import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.join(root, 'content', 'projects');
const reportPath = path.join(root, 'reports', 'link-check.json');

function parseLineMap(text) {
  const lines = text.split(/\r?\n/);
  const map = new Map();
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (!key) continue;
    const value = line.slice(idx + 1).trim();
    map.set(key, { index: i, value });
  }
  return { lines, map };
}

function isHardBroken(entry) {
  if (!entry) return false;
  return entry.status === 404 || entry.status === 410 || entry.status === 500;
}

async function main() {
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
  const brokenMap = new Map((report.external?.broken || []).map((b) => [b.url, b]));

  const files = (await fs.readdir(contentDir)).filter((f) => f.endsWith('.md')).sort();

  let promotedProductToPrimary = 0;
  let repairedProductToPrimary = 0;
  let removedBrokenProduct = 0;
  let touchedFiles = 0;

  for (const file of files) {
    const fullPath = path.join(contentDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { lines, map } = parseLineMap(raw);

    const primary = map.get('primary_url')?.value || '';
    const product = map.get('product_url')?.value || '';

    const primaryBroken = isHardBroken(brokenMap.get(primary));
    const productBroken = isHardBroken(brokenMap.get(product));

    let changed = false;

    if (primaryBroken && product && product !== 'n/a' && !productBroken) {
      const primaryLine = map.get('primary_url');
      if (primaryLine) {
        lines[primaryLine.index] = `primary_url: ${product}`;
        changed = true;
        promotedProductToPrimary += 1;
      }
    }

    const effectivePrimary = lines[map.get('primary_url')?.index] || '';
    const currentPrimary = effectivePrimary.startsWith('primary_url:')
      ? effectivePrimary.slice('primary_url:'.length).trim()
      : primary;

    const currentPrimaryBroken = isHardBroken(brokenMap.get(currentPrimary));
    if (productBroken) {
      const productLine = map.get('product_url');
      if (productLine) {
        if (currentPrimary && currentPrimary !== 'n/a' && !currentPrimaryBroken) {
          lines[productLine.index] = `product_url: ${currentPrimary}`;
          changed = true;
          repairedProductToPrimary += 1;
        } else {
          lines[productLine.index] = 'product_url: n/a';
          changed = true;
          removedBrokenProduct += 1;
        }
      }
    }

    if (changed) {
      touchedFiles += 1;
      await fs.writeFile(fullPath, lines.join('\n'));
    }
  }

  console.log(`Touched files: ${touchedFiles}`);
  console.log(`Promoted product_url -> primary_url: ${promotedProductToPrimary}`);
  console.log(`Repaired product_url -> primary_url: ${repairedProductToPrimary}`);
  console.log(`Set product_url to n/a: ${removedBrokenProduct}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
