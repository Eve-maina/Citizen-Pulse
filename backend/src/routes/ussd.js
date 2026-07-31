import { Router } from 'express';
import { nanoid } from 'nanoid';
import { TOPICS, analyzeSubmission } from '../lib/ollama.js';
import { getWardNames } from '../lib/wards.js';
import { insertRawSubmission, applyAnalysis, deleteSubmission } from '../services/submissions.js';

export const ussdRouter = Router();

// Display-only Swahili topic labels, same order as TOPICS. The canonical
// English string from TOPICS is always what gets stored in the DB.
const TOPICS_SW = [
  'Utawala',
  'Elimu',
  'Afya',
  'Maji na Miundombinu',
  'Usalama',
  'Kilimo',
  'Mazingira',
];

function languageMenu() {
  return 'CON Citizen Pulse\nSelect language / Chagua lugha:\n1. English\n2. Kiswahili';
}

function topicMenu(lang) {
  const labels = lang === 'sw' ? TOPICS_SW : TOPICS;
  const header = lang === 'sw' ? 'Chagua mada:' : 'Choose a topic:';
  const lines = labels.map((label, i) => `${i + 1}. ${label}`).join('\n');
  return `CON ${header}\n${lines}`;
}

function descriptionPrompt(lang) {
  return lang === 'sw'
    ? 'CON Eleza tatizo lako (lugha yoyote):'
    : 'CON Describe the issue (any language):';
}

function wardMenu(lang) {
  const header = lang === 'sw' ? 'Chagua kata:' : 'Choose your ward:';
  const lines = getWardNames().map((w, i) => `${i + 1}. ${w}`).join('\n');
  return `CON ${header}\n${lines}`;
}

// Used only before a language has been chosen, so the message covers both.
function bilingualEnd(enMsg, swMsg) {
  return `END ${enMsg}\n${swMsg}`;
}

// Used once a language is known, so the message is single-language.
function end(lang, enMsg, swMsg) {
  return `END ${lang === 'sw' ? swMsg : enMsg}`;
}

// Fire-and-forget: Gemma analysis runs AFTER the USSD response has already
// been sent. Africa's Talking times out callbacks after ~10-15s, and Gemma
// calls in this app have taken anywhere from a few seconds to 90+ under
// load, so the AI step can never sit in front of the response.
function analyzeInBackground(id, { rawText, topic }) {
  analyzeSubmission({ rawText, topic })
    .then((analysis) => {
      if (analysis.rejected) {
        // No citizen is still on the line to notify for USSD, so a
        // moderation rejection just quietly removes the submission
        // instead of surfacing an error.
        deleteSubmission(id);
        console.log(`[ussd] submission ${id} removed by moderation: ${analysis.rejectionReason}`);
        return;
      }
      applyAnalysis(id, analysis);
    })
    .catch((err) => {
      console.error(`[ussd] background analysis failed for ${id}:`, err);
    });
}

ussdRouter.post('/ussd', (req, res) => {
  res.set('Content-Type', 'text/plain');

  const { text = '' } = req.body || {};
  const inputs = text ? text.split('*') : [];

  // Screen 1: nothing entered yet — ask for a language.
  if (inputs.length === 0) {
    return res.send(languageMenu());
  }

  const lang = inputs[0] === '2' ? 'sw' : inputs[0] === '1' ? 'en' : null;
  if (!lang) {
    return res.send(bilingualEnd('Invalid selection. Please dial again.', 'Chaguo batili. Piga tena.'));
  }

  // Screen 2: language chosen — show the topic menu in that language.
  if (inputs.length === 1) {
    return res.send(topicMenu(lang));
  }

  const topic = TOPICS[Number(inputs[1]) - 1];
  if (!topic) {
    return res.send(
      end(lang, 'Invalid topic selected. Please dial again.', 'Mada batili. Tafadhali piga tena.')
    );
  }

  // Screen 3: topic chosen — ask for a free-text description.
  if (inputs.length === 2) {
    return res.send(descriptionPrompt(lang));
  }

  // Screen 4: description given — show the ward menu.
  if (inputs.length === 3) {
    if (!inputs[2].trim()) {
      return res.send(
        end(lang, 'No description entered. Please dial again.', 'Hukuandika maelezo. Tafadhali piga tena.')
      );
    }
    return res.send(wardMenu(lang));
  }

  // Final: language + topic + description + ward all present. Everything
  // between the topic and the last "*" is treated as the description, so a
  // stray "*" typed inside the free-text answer doesn't shift the ward off
  // the end.
  const description = inputs.slice(2, -1).join('*').trim();
  const ward = getWardNames()[Number(inputs[inputs.length - 1]) - 1];

  if (!description) {
    return res.send(
      end(lang, 'No description entered. Please dial again.', 'Hukuandika maelezo. Tafadhali piga tena.')
    );
  }
  if (!ward) {
    return res.send(
      end(lang, 'Invalid ward selected. Please dial again.', 'Kata batili. Tafadhali piga tena.')
    );
  }

  const id = nanoid();
  const createdAt = new Date().toISOString();

  try {
    insertRawSubmission({ id, channel: 'ussd', topic, ward, rawText: description, createdAt });
  } catch (err) {
    console.error('[ussd] insert failed:', err);
    return res.send(
      end(lang, 'Something went wrong. Please try again later.', 'Kuna hitilafu. Jaribu tena baadaye.')
    );
  }

  const ref = id.slice(0, 8).toUpperCase();
  res.send(end(lang, `Thank you! Report received, ref #${ref}.`, `Asante! Ombi limepokelewa, kumb #${ref}.`));

  // Runs after the response above has already been sent — never awaited.
  analyzeInBackground(id, { rawText: description, topic });
});
