import { Router } from 'express';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wards = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'data', 'wards.json'), 'utf-8')
);

export const hotspotsRouter = Router();

hotspotsRouter.get('/wards', (req, res) => {
  res.json({ wards: wards.map((w) => w.ward) });
});

hotspotsRouter.get('/hotspots', (req, res) => {
  const rows = db
    .prepare(
      `SELECT ward, topic, COUNT(*) as count
       FROM submissions
       WHERE ward IS NOT NULL
       GROUP BY ward, topic
       ORDER BY count DESC`
    )
    .all();

  const byWard = {};
  for (const row of rows) {
    if (!byWard[row.ward]) byWard[row.ward] = { ward: row.ward, total: 0, topics: {} };
    byWard[row.ward].total += row.count;
    byWard[row.ward].topics[row.topic] = row.count;
  }

  res.json({ hotspots: Object.values(byWard) });
});
