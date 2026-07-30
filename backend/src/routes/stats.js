import { Router } from 'express';
import { db } from '../db.js';
import { TOPICS } from '../lib/ollama.js';

export const statsRouter = Router();

statsRouter.get('/stats/topics', (req, res) => {
  const rows = db
    .prepare(`SELECT topic, COUNT(*) as count FROM submissions GROUP BY topic`)
    .all();
  const counts = Object.fromEntries(rows.map((r) => [r.topic, r.count]));

  const topics = TOPICS.map((topic) => ({ topic, count: counts[topic] || 0 })).sort(
    (a, b) => b.count - a.count
  );

  res.json({ topics });
});

statsRouter.get('/stats/urgency', (req, res) => {
  const rows = db
    .prepare(`SELECT urgency, COUNT(*) as count FROM submissions GROUP BY urgency`)
    .all();
  const counts = Object.fromEntries(rows.map((r) => [r.urgency, r.count]));

  res.json({
    urgency: {
      high: counts.high || 0,
      medium: counts.medium || 0,
      low: counts.low || 0,
    },
  });
});
