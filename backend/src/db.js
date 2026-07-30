import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'app.db');

export const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL,
    topic TEXT NOT NULL,
    ward TEXT,
    rawText TEXT,
    language TEXT,
    translatedText TEXT,
    summary TEXT,
    subtopics TEXT,
    urgency TEXT,
    photoPath TEXT,
    photoCaption TEXT,
    createdAt TEXT NOT NULL
  );
`);

const existingColumns = db.prepare(`PRAGMA table_info(submissions)`).all().map((c) => c.name);
if (!existingColumns.includes('upvotes')) {
  db.exec(`ALTER TABLE submissions ADD COLUMN upvotes INTEGER NOT NULL DEFAULT 0`);
}
if (!existingColumns.includes('downvotes')) {
  db.exec(`ALTER TABLE submissions ADD COLUMN downvotes INTEGER NOT NULL DEFAULT 0`);
}
if (!existingColumns.includes('summarySw')) {
  db.exec(`ALTER TABLE submissions ADD COLUMN summarySw TEXT`);
}
if (!existingColumns.includes('subtopicsSw')) {
  db.exec(`ALTER TABLE submissions ADD COLUMN subtopicsSw TEXT`);
}
