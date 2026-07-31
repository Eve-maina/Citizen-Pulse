import { db } from '../db.js';

// Inserts a submission with only the citizen-provided fields known yet.
// AI-derived fields (translation, summary, urgency, ...) are filled in later
// via applyAnalysis() once the async Gemma call finishes.
export function insertRawSubmission({ id, channel, topic, ward, rawText, createdAt }) {
  db.prepare(
    `INSERT INTO submissions
      (id, channel, topic, ward, rawText, language, translatedText, summary, summarySw, subtopics, subtopicsSw, urgency, photoPath, photoCaption, createdAt)
     VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, '[]', '[]', 'medium', NULL, NULL, ?)`
  ).run(id, channel, topic, ward, rawText, createdAt);
}

export function applyAnalysis(id, analysis) {
  db.prepare(
    `UPDATE submissions SET
       language = ?, translatedText = ?, summary = ?, summarySw = ?,
       subtopics = ?, subtopicsSw = ?, urgency = ?, photoCaption = ?
     WHERE id = ?`
  ).run(
    analysis.language || null,
    analysis.translatedText || null,
    analysis.summary || null,
    analysis.summarySw || null,
    JSON.stringify(analysis.subtopics || []),
    JSON.stringify(analysis.subtopicsSw || []),
    analysis.urgency || 'medium',
    analysis.photoCaption || null,
    id
  );
}

export function deleteSubmission(id) {
  db.prepare(`DELETE FROM submissions WHERE id = ?`).run(id);
}
