import { readFile } from 'node:fs/promises';
import { normalizeCatalog } from '../public/core.js';

export const SOURCE = 'https://cd.bittrees.org/data/projects.json';
export async function getCatalog({ fetcher = fetch, clock = () => new Date().toISOString() } = {}) {
  try {
    const response = await fetcher(SOURCE, { signal: AbortSignal.timeout(7000), redirect: 'error', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Directory unavailable');
    const projects = normalizeCatalog(await response.json());
    if (!projects.length) throw new Error('No verified projects');
    return { projects, source: SOURCE, status: 'live', checkedAt: clock() };
  } catch {
    const raw = JSON.parse(await readFile(new URL('../public/data/source.json', import.meta.url), 'utf8'));
    return { projects: normalizeCatalog(raw), source: SOURCE, status: 'snapshot', snapshotDate: '2026-10-29', checkedAt: clock() };
  }
}
