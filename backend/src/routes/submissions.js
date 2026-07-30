import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { analyzeSubmission, TOPICS } from '../lib/ollama.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'data', 'uploads');

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'));
  },
});

export const submissionsRouter = Router();

submissionsRouter.get('/topics', (req, res) => {
  res.json({ topics: TOPICS });
});

submissionsRouter.post('/submissions', upload.single('photo'), async (req, res) => {
  try {
    const { text, topic, ward, channel } = req.body;

    if (!topic || !TOPICS.includes(topic)) {
      return res.status(400).json({ error: `topic must be one of: ${TOPICS.join(', ')}` });
    }
    if (!text && !req.file) {
      return res.status(400).json({ error: 'Provide text and/or a photo' });
    }

    const analysis = await analyzeSubmission({
      rawText: text,
      topic,
      photoPath: req.file?.path,
    });

    if (analysis.rejected) {
      if (req.file?.path) unlink(req.file.path).catch(() => {});
      return res.status(422).json({
        error: analysis.rejectionReason || 'Submission rejected',
        rejected: true,
        reason: analysis.rejectionReason || null,
        reasonSw: analysis.rejectionReasonSw || null,
      });
    }

    const id = nanoid();
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO submissions
        (id, channel, topic, ward, rawText, language, translatedText, summary, summarySw, subtopics, subtopicsSw, urgency, photoPath, photoCaption, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      channel || 'web',
      topic,
      ward || null,
      text || null,
      analysis.language || null,
      analysis.translatedText || null,
      analysis.summary || null,
      analysis.summarySw || null,
      JSON.stringify(analysis.subtopics || []),
      JSON.stringify(analysis.subtopicsSw || []),
      analysis.urgency || 'medium',
      req.file?.path || null,
      analysis.photoCaption || null,
      createdAt
    );

    res.status(201).json({
      id,
      topic,
      ward,
      createdAt,
      understood: analysis,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process submission', detail: err.message });
  }
});

submissionsRouter.get('/submissions', (req, res) => {
  const rows = db
    .prepare(`SELECT * FROM submissions ORDER BY createdAt DESC`)
    .all()
    .map((r) => ({
      ...r,
      subtopics: JSON.parse(r.subtopics || '[]'),
      subtopicsSw: JSON.parse(r.subtopicsSw || '[]'),
      photoUrl: r.photoPath ? `/uploads/${path.basename(r.photoPath)}` : null,
    }));
  res.json({ submissions: rows });
});

submissionsRouter.post('/submissions/:id/vote', (req, res) => {
  const { direction } = req.body || {};
  if (direction !== 'up' && direction !== 'down') {
    return res.status(400).json({ error: 'direction must be "up" or "down"' });
  }

  const column = direction === 'up' ? 'upvotes' : 'downvotes';
  const result = db
    .prepare(`UPDATE submissions SET ${column} = ${column} + 1 WHERE id = ?`)
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const row = db
    .prepare(`SELECT upvotes, downvotes FROM submissions WHERE id = ?`)
    .get(req.params.id);
  res.json(row);
});
