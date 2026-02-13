import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const projectsDir = path.join(root, 'content', 'projects');
const csvPath = path.join(root, 'content', 'status-updates.csv');
const allowed = new Set(['pending_audit', 'verified', 'needs_update', 'rejected']);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseCsv(csv) {
  const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase();
  if (header !== 'slug,status') {
    throw new Error('CSV header must be exactly: slug,status');
  }
  return lines.slice(1).map((line, i) => {
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length !== 2) {
      throw new Error(`Invalid CSV row ${i + 2}: ${line}`);
    }
    return { slug: parts[0], status: parts[1] };
  });
}

async function main() {
  if (!(await fileExists(csvPath))) {
    console.log('No content/status-updates.csv found.');
    console.log('Copy content/status-updates.example.csv to content/status-updates.csv and edit it.');
    return;
  }

  const rows = parseCsv(await fs.readFile(csvPath, 'utf8'));
  if (rows.length === 0) {
    console.log('No updates found.');
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!allowed.has(row.status)) {
      console.log(`SKIP invalid status: ${row.slug} -> ${row.status}`);
      skipped += 1;
      continue;
    }

    const filePath = path.join(projectsDir, `${row.slug}.md`);
    if (!(await fileExists(filePath))) {
      console.log(`SKIP missing file: ${row.slug}.md`);
      skipped += 1;
      continue;
    }

    const raw = await fs.readFile(filePath, 'utf8');
    const next = raw.replace(/^verification_status:.*$/m, `verification_status: ${row.status}`);
    if (next === raw) {
      console.log(`SKIP no status line: ${row.slug}.md`);
      skipped += 1;
      continue;
    }

    await fs.writeFile(filePath, next, 'utf8');
    console.log(`UPDATE: ${row.slug}.md -> ${row.status}`);
    updated += 1;
  }

  console.log(`Done. updated=${updated} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

