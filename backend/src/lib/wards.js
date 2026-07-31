import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wards = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'data', 'wards.json'), 'utf-8')
);

export function getWardNames() {
  return wards.map((w) => w.ward);
}

export function getWardByIndex(index) {
  const i = Number(index) - 1;
  if (!Number.isInteger(i) || i < 0 || i >= wards.length) return null;
  return wards[i].ward;
}
