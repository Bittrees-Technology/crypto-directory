import { readFile, writeFile } from 'node:fs/promises';
import { normalizeCatalog } from '../public/core.js';
const root = new URL('../', import.meta.url);
let raw;
try { raw = JSON.parse(await readFile(new URL('../site/data/projects.json', root), 'utf8')); }
catch { raw = JSON.parse(await readFile(new URL('public/data/source.json', root), 'utf8')); }
const projects = normalizeCatalog(raw);
if (!projects.length) throw new Error('No verified directory projects');
await writeFile(new URL('public/catalog.json', root), JSON.stringify({ projects, status: 'snapshot', snapshotDate: '2026-10-29', source: 'https://cd.bittrees.org/data/projects.json' }));
console.log(`Surf ready: ${projects.length} projects, ${new Set(projects.map(p => p.category)).size} categories.`);
