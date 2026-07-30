import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { db } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wards = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'data', 'wards.json'), 'utf-8')
);

function getWardStats(ward) {
  const match = wards.find((w) => w.ward.toLowerCase() === String(ward).toLowerCase());
  return match ?? { error: `No data on file for ward "${ward}"`, knownWards: wards.map((w) => w.ward) };
}

function listWards() {
  return wards.map((w) => w.ward);
}

function countSubmissionsByWardAndTopic(ward, topic) {
  const rows = db
    .prepare(
      `SELECT id, summary, urgency, createdAt FROM submissions WHERE ward = ? AND topic = ? ORDER BY createdAt DESC`
    )
    .all(ward, topic);
  return { ward, topic, count: rows.length, submissions: rows };
}

export const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_ward_stats',
      description:
        'Get demographic and infrastructure statistics for a constituency ward: population, school enrollment, distance to nearest secondary school/health facility, water access percentage, road condition score (1-10), and existing vocational centres.',
      parameters: {
        type: 'object',
        properties: {
          ward: { type: 'string', description: 'Name of the ward' },
        },
        required: ['ward'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_wards',
      description: 'List all wards that have data on file.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'count_submissions_by_ward_and_topic',
      description:
        'Count how many citizen submissions exist for a given ward and topic, to gauge real demand volume behind a proposed project.',
      parameters: {
        type: 'object',
        properties: {
          ward: { type: 'string' },
          topic: {
            type: 'string',
            description:
              'One of: Governance, Education, Health, Water & Infrastructure, Security, Agriculture, Environment',
          },
        },
        required: ['ward', 'topic'],
      },
    },
  },
];

export const toolImplementations = {
  get_ward_stats: ({ ward }) => getWardStats(ward),
  list_wards: () => listWards(),
  count_submissions_by_ward_and_topic: ({ ward, topic }) =>
    countSubmissionsByWardAndTopic(ward, topic),
};
