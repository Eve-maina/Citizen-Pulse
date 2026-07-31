import { Ollama } from 'ollama';
import { readFileSync } from 'node:fs';
import { toolDefinitions, toolImplementations } from './tools.js';

// Talks to Ollama Cloud directly over HTTPS with an API key, rather than
// through a locally installed/signed-in Ollama daemon. This is what makes
// the backend deployable anywhere — no OS-level Ollama install required.
if (!process.env.OLLAMA_API_KEY) {
  throw new Error('OLLAMA_API_KEY is not set. Create one at https://ollama.com/settings/keys');
}

const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
});

const MODEL = process.env.GEMMA_MODEL || 'gemma4';

const TOPICS = [
  'Governance',
  'Education',
  'Health',
  'Water & Infrastructure',
  'Security',
  'Agriculture',
  'Environment',
];

function stripThinking(text) {
  return text.replace(/<\|channel>thought[\s\S]*?<channel\|>/g, '').trim();
}

function extractJson(text) {
  const cleaned = stripThinking(text);
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON object found in model output: ${cleaned}`);
  return JSON.parse(match[0]);
}

const RETRYABLE_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EPIPE']);

function isRetryableNetworkError(err) {
  return RETRYABLE_CODES.has(err?.code) || RETRYABLE_CODES.has(err?.cause?.code);
}

// Sequential calls to ollama.com occasionally hit a transient ECONNRESET or
// ETIMEDOUT (observed reliably on the multi-turn tool-calling loop, which
// makes several requests back to back) — a short retry with backoff clears
// these without needing to understand the exact network cause.
async function chatWithRetry(options, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await ollama.chat(options);
    } catch (err) {
      lastErr = err;
      if (!isRetryableNetworkError(err) || i === attempts - 1) throw err;
      const delay = 500 * 2 ** i;
      console.warn(`[ollama] transient network error (${err?.cause?.code || err?.code}), retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastErr;
}

// Normalizes a raw citizen submission: detects language, translates to English,
// summarizes, extracts subtopics/urgency, and optionally captions an attached photo.
export async function analyzeSubmission({ rawText, topic, photoPath }) {
  const images = photoPath ? [readFileSync(photoPath).toString('base64')] : undefined;

  const prompt = `You are helping structure a citizen development request submitted to their Member of Parliament.
Topic selected by the citizen: "${topic}" (must be one of: ${TOPICS.join(', ')}).
${images ? 'An attached photo is provided — factor what it shows into your summary.' : ''}
Citizen text: """${rawText || '(no text provided, rely on the photo)'}"""

The app has a language toggle (English / Swahili), so every display field must be produced in BOTH languages.

First, screen the submission (text and photo) for abuse. Reject ONLY if it contains one or more of:
- hate speech or slurs targeting a person or group
- personal insults, name-calling, or harassment directed at an individual (e.g. an official, neighbor, or the MP by name)
- threats of violence
- sexually explicit content
- spam or gibberish with no genuine civic content
${images ? '- the attached photo appears to be AI-generated or synthetic (not an authentic photograph) — look for telltale signs like warped or extra fingers/limbs, nonsensical text in the scene, impossibly smooth or plastic-looking textures, physically inconsistent shadows/reflections, or an uncanny "generated" look. Photo quality issues (blur, bad lighting, compression, low resolution) are normal for real phone photos and are NOT signs of AI generation — only reject if you have reasonably strong evidence it is synthetic, not just low quality.\n' : ''}Being angry, blunt, or sharply critical of the government, an MP, or a public office is NOT abuse and must NOT be rejected — citizens are allowed to be frustrated about real problems. When in doubt, do not reject.

Respond with ONLY a JSON object, no other text, in this exact shape:
{
  "rejected": true or false,
  "rejectionReason": "if rejected, one short plain-English sentence explaining why (which rule above it broke); otherwise null",
  "rejectionReasonSw": "the same rejection reason translated into natural Kiswahili; otherwise null",
  "language": "detected language of the citizen text (e.g. Swahili, English, Sheng, Kikuyu)",
  "translatedText": "English translation of the citizen text (verbatim meaning, not paraphrased)",
  "summary": "one sentence plain-English summary of the request/grievance",
  "summarySw": "the same one-sentence summary translated into natural Kiswahili",
  "subtopics": ["short English tags, e.g. 'classroom shortage', 'borehole repair'"],
  "subtopicsSw": ["the same tags translated into Kiswahili, same order"],
  "urgency": "low | medium | high",
  "photoCaption": "${images ? 'what the photo shows, focused on the infrastructure/issue' : 'null'}",
  "photoCaptionSw": "${images ? 'the same photo caption translated into Kiswahili' : 'null'}"
}
If rejected is true, still fill in the other fields with your best effort.`;

  const response = await chatWithRetry({
    model: MODEL,
    messages: [{ role: 'user', content: prompt, images }],
  });

  return extractJson(response.message.content);
}

// Runs a tool-calling loop where Gemma pulls ward stats and submission counts
// to rank a candidate list of proposed projects with cited evidence.
export async function rankRecommendations({ candidateProjects }) {
  const messages = [
    {
      role: 'system',
      content:
        'You are an analyst helping an MP prioritize constituency development projects. ' +
        'Use the available tools to pull ward statistics and citizen submission counts before ranking. ' +
        'Never invent numbers — always call a tool to get them. Cite the specific stats you used in your rationale.',
    },
    {
      role: 'user',
      content: `Rank these candidate projects from highest to lowest priority. For each, call tools to check ward stats and submission demand, then justify the ranking with concrete evidence.

Candidate projects:
${candidateProjects.map((p, i) => `${i + 1}. ${p.title} — ward: ${p.ward}, topic: ${p.topic}`).join('\n')}

Once you have gathered evidence, respond with ONLY a JSON object (no other text) in this shape:
{
  "ranking": [
    {
      "title": "project title",
      "ward": "ward name",
      "rank": 1,
      "score": "0-100",
      "rationale": "1-3 sentences citing the specific stats/submission counts you pulled",
      "evidence": { "any relevant fields you looked up": "values" }
    }
  ]
}`,
    },
  ];

  // Tool-calling loop: keep feeding tool results back until the model returns a final answer.
  for (let turn = 0; turn < 6; turn++) {
    const response = await chatWithRetry({
      model: MODEL,
      messages,
      tools: toolDefinitions,
    });

    const { message } = response;
    messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      return extractJson(message.content);
    }

    for (const call of message.tool_calls) {
      const impl = toolImplementations[call.function.name];
      const args =
        typeof call.function.arguments === 'string'
          ? JSON.parse(call.function.arguments)
          : call.function.arguments;
      const result = impl ? impl(args) : { error: `Unknown tool ${call.function.name}` };
      messages.push({
        role: 'tool',
        content: JSON.stringify(result),
      });
    }
  }

  throw new Error('Gemma did not converge on a final ranking within the tool-call turn limit');
}

export { TOPICS };
