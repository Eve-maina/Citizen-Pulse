import { Router } from 'express';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';
import { rankRecommendations } from '../lib/ollama.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plannedProjects = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'data', 'planned-projects.json'), 'utf-8')
);

export const recommendationsRouter = Router();

// Builds candidate projects from two sources: pre-loaded local development plan
// proposals, and recurring themes that emerged organically from citizen submissions.
function buildCandidates() {
  const clusters = db
    .prepare(
      `SELECT ward, topic, COUNT(*) as count, GROUP_CONCAT(summary, ' | ') as summaries
       FROM submissions
       WHERE ward IS NOT NULL
       GROUP BY ward, topic
       HAVING count >= 1
       ORDER BY count DESC`
    )
    .all();

  const fromSubmissions = clusters.map((c) => ({
    title: `${c.topic} concern raised by citizens in ${c.ward}`,
    ward: c.ward,
    topic: c.topic,
    source: 'citizen submissions',
    submissionCount: c.count,
  }));

  const fromPlan = plannedProjects.map((p) => ({ ...p, source: 'local development plan' }));

  return [...fromPlan, ...fromSubmissions];
}

recommendationsRouter.get('/recommendations', async (req, res) => {
  try {
    const candidateProjects = buildCandidates();
    if (candidateProjects.length === 0) {
      return res.json({ ranking: [], note: 'No candidate projects yet — submissions or planned projects needed.' });
    }
    const result = await rankRecommendations({ candidateProjects });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rank recommendations', detail: err.message });
  }
});
