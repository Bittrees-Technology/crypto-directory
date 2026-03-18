import path from 'node:path';
import { loadProcessStatuses } from './lib/process-metrics.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

async function main() {
  const statuses = await loadProcessStatuses(root);
  if (statuses.length === 0) {
    console.log('No process definitions found.');
    return;
  }

  for (const status of statuses) {
    const state = status.completed ? 'completed' : 'in_progress';
    const projected = status.timeline.projectedCompletionDate || 'unknown';
    console.log(`${status.name}: ${status.progressPercent}% ${state} | projected=${projected}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
