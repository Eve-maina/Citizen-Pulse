import express from 'express';
import cors from 'cors';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { submissionsRouter } from './routes/submissions.js';
import { recommendationsRouter } from './routes/recommendations.js';
import { hotspotsRouter } from './routes/hotspots.js';
import { statsRouter } from './routes/stats.js';
import { ussdRouter } from './routes/ussd.js';
import './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(__dirname, '..', 'data', 'uploads'), { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());
// Africa's Talking posts USSD callbacks as application/x-www-form-urlencoded,
// not JSON, so /ussd needs this to have a populated req.body.
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'data', 'uploads')));

app.use(submissionsRouter);
app.use(recommendationsRouter);
app.use(hotspotsRouter);
app.use(statsRouter);
app.use(ussdRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
