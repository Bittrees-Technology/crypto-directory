import { readFile, writeFile } from 'node:fs/promises';
import { normalizeCatalog } from '../public/core.js';
import { SOURCE, SNAPSHOT_DATE } from '../lib/catalog.js';
const root = new URL('../', import.meta.url);
// The reviewed snapshot also backs runtime outages. The directory build in this
// independent release branch can be older and must not replace that snapshot.
const raw = JSON.parse(await readFile(new URL('public/data/source.json', root), 'utf8'));
const projects = normalizeCatalog(raw);
if (!projects.length) throw new Error('No verified directory projects');
await writeFile(new URL('public/catalog.json', root), JSON.stringify({ projects, status: 'snapshot', snapshotDate: SNAPSHOT_DATE, source: SOURCE }));
console.log(`Surf ready: ${projects.length} projects, ${new Set(projects.map(p => p.category)).size} categories.`);
