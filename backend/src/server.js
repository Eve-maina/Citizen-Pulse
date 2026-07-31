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

// Serves the built React app from the same origin/process as the API, so
// the whole thing deploys as one Node service behind one public URL (no
// CORS, no separate static host). Must be registered after every API
// route above, since the SPA fallback below matches any unmatched GET.
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
