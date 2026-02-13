import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.join(root, 'content', 'projects');

function parseValue(raw) {
  const trimmed = raw.trim();
  const listMatch = trimmed.match(/^\[(.*)\]$/);
  if (listMatch) {
    const inner = listMatch[1].trim();
    if (!inner) return [];
    return inner.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return trimmed;
}

function parseFrontMatter(text) {
  const lines = text.split(/\r?\n/);
  let i = 0;
  if (lines[0]?.trim() !== '---') return null;
  i += 1;
  const meta = {};
  for (; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') break;
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = parseValue(value);
  }
  return meta;
}

async function main() {
  const files = (await fs.readdir(contentDir)).filter((f) => f.endsWith('.md')).sort();
  const projects = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(contentDir, f), 'utf8');
    const p = parseFrontMatter(raw);
    if (p) projects.push({ file: f, ...p });
  }

  const byCategory = new Map();
  for (const p of projects) {
    const key = p.lead_category || 'Unknown';
    byCategory.set(key, (byCategory.get(key) || 0) + 1);
  }

  const pending = projects.filter((p) => p.verification_status === 'pending_audit');

  console.log(`Total projects: ${projects.length}`);
  console.log('Category counts:');
  for (const [name, count] of [...byCategory.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`- ${name}: ${count}`);
  }
  console.log(`Pending audit: ${pending.length}`);
  console.log('Pending list:');
  for (const p of pending) {
    console.log(`- ${p.name} (${p.file})`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

