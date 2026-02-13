import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const approvedDir = path.join(root, 'content', 'submissions', 'approved');
const projectsDir = path.join(root, 'content', 'projects');

const required = [
  'name',
  'lead_category',
  'tags',
  'ecosystem',
  'description',
  'primary_url',
  'product_url',
  'founded',
  'hq',
  'token',
  'twitter'
];

function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function assertSubmission(data, fileName) {
  for (const key of required) {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      throw new Error(`${fileName}: missing required field "${key}"`);
    }
  }
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    throw new Error(`${fileName}: tags must be a non-empty array`);
  }
  if (!Array.isArray(data.ecosystem) || data.ecosystem.length === 0) {
    throw new Error(`${fileName}: ecosystem must be a non-empty array`);
  }
}

function toList(values) {
  return `[${values.map((v) => String(v).trim()).filter(Boolean).join(', ')}]`;
}

function toProjectMarkdown(data) {
  return `---
name: ${data.name}
lead_category: ${data.lead_category}
tags: ${toList(data.tags)}
ecosystem: ${toList(data.ecosystem)}
description: ${data.description}
primary_url: ${data.primary_url}
product_url: ${data.product_url}
founded: ${data.founded}
hq: ${data.hq}
token: ${data.token}
twitter: ${data.twitter}
verification_status: pending_audit
---
`;
}

async function main() {
  await fs.mkdir(approvedDir, { recursive: true });
  await fs.mkdir(projectsDir, { recursive: true });

  const files = (await fs.readdir(approvedDir))
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    console.log('No approved submissions found.');
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const fullPath = path.join(approvedDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const data = JSON.parse(raw);
    assertSubmission(data, file);

    const slug = slugify(data.name);
    if (!slug) throw new Error(`${file}: could not create filename slug from name`);
    const outPath = path.join(projectsDir, `${slug}.md`);

    try {
      await fs.access(outPath);
      console.log(`SKIP (exists): ${path.basename(outPath)}`);
      skipped += 1;
      continue;
    } catch {
      // file does not exist
    }

    await fs.writeFile(outPath, toProjectMarkdown(data), 'utf8');
    console.log(`CREATE: ${path.basename(outPath)}`);
    created += 1;
  }

  console.log(`Done. created=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

