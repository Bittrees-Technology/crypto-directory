import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const projectsDir = path.join(root, 'content', 'projects');

function hasHttpsUrl(v) {
  return typeof v === 'string' && /^https:\/\//.test(v);
}

function parseFrontMatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return null;
  const meta = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') break;
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  }
  return meta;
}

function decideStatus(meta) {
  // Conservative auto-pass:
  // verified if core fields look complete and externally referenceable.
  // "Metaverse" is accepted for HQ when official country is unknown.
  const checks = [
    hasHttpsUrl(meta.primary_url),
    meta.product_url === 'n/a' || hasHttpsUrl(meta.product_url),
    meta.twitter === 'n/a' || hasHttpsUrl(meta.twitter),
    meta.description && meta.description.length >= 30,
    /^\d{4}$/.test(String(meta.founded || '')),
    meta.hq && meta.hq.length >= 2
  ];

  const passed = checks.filter(Boolean).length;
  if (passed >= 6) return 'verified';
  return 'needs_update';
}

async function main() {
  const files = (await fs.readdir(projectsDir)).filter((f) => f.endsWith('.md')).sort();
  let verified = 0;
  let needsUpdate = 0;
  let skipped = 0;

  for (const file of files) {
    const fullPath = path.join(projectsDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const meta = parseFrontMatter(raw);
    if (!meta || !meta.verification_status) {
      skipped += 1;
      continue;
    }
    if (meta.verification_status !== 'pending_audit' && meta.verification_status !== 'needs_update') {
      skipped += 1;
      continue;
    }

    const nextStatus = decideStatus(meta);
    const next = raw.replace(/^verification_status:.*$/m, `verification_status: ${nextStatus}`);
    await fs.writeFile(fullPath, next, 'utf8');
    if (nextStatus === 'verified') verified += 1;
    if (nextStatus === 'needs_update') needsUpdate += 1;
    console.log(`UPDATE: ${file} -> ${nextStatus}`);
  }

  console.log(`Done. verified=${verified} needs_update=${needsUpdate} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
