import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const projectsDir = path.join(root, 'content', 'projects');

const canonicalByUrl = new Map([
  ['https://across.to', 'across-protocol.md'],
  ['https://alchemypay.org', 'alchemy-pay.md'],
  ['https://arkhamintelligence.com', 'arkham.md'],
  ['https://backpack.app', 'backpack.md'],
  ['https://cantina.xyz', 'cantina.md'],
  ['https://celestia.org', 'celestia.md'],
  ['https://charmverse.io', 'charmverse.md'],
  ['https://flipsidecrypto.xyz', 'flipside.md'],
  ['https://guild.xyz', 'guild.md'],
  ['https://hextrust.com', 'hex-trust.md'],
  ['https://lens.xyz', 'lens-protocol.md'],
  ['https://maple.finance', 'maple-finance.md'],
  ['https://messari.io', 'messari.md'],
  ['https://quillaudits.com', 'quillaudits.md'],
  ['https://sequence.xyz', 'sequence.md'],
  ['https://snapshot.org', 'snapshot-labs.md'],
  ['https://tenderly.co', 'tenderly.md'],
  ['https://www.artemis.xyz', 'artemis.md'],
  ['https://www.cyberscope.io', 'cyberscope.md'],
  ['https://www.nansen.ai', 'nansen.md'],
  ['https://www.qredo.com', 'qredo.md'],
  ['https://www.tally.xyz', 'tally.md']
]);

function parseFrontMatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { meta: {}, lines, endIdx: -1 };
  const meta = {};
  let endIdx = -1;
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') {
      endIdx = i;
      break;
    }
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    meta[k] = v;
  }
  return { meta, lines, endIdx };
}

function setOrAppendMeta(lines, startIdx, endIdx, key, value) {
  for (let i = startIdx; i < endIdx; i += 1) {
    if (lines[i].startsWith(`${key}:`)) {
      lines[i] = `${key}: ${value}`;
      return;
    }
  }
  lines.splice(endIdx, 0, `${key}: ${value}`);
}

async function main() {
  const files = (await fs.readdir(projectsDir)).filter((f) => f.endsWith('.md')).sort();
  const byUrl = new Map();
  const fileToName = new Map();

  for (const f of files) {
    const full = path.join(projectsDir, f);
    const raw = await fs.readFile(full, 'utf8');
    const { meta } = parseFrontMatter(raw);
    const url = (meta.primary_url || '').trim().toLowerCase();
    const name = (meta.name || '').trim() || f;
    fileToName.set(f, name);
    if (!url) continue;
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url).push(f);
  }

  let rejected = 0;
  let unchanged = 0;

  for (const [url, group] of byUrl.entries()) {
    if (group.length < 2) continue;
    const canonical = canonicalByUrl.get(url);
    if (!canonical || !group.includes(canonical)) {
      console.log(`SKIP group no canonical mapping: ${url} => ${group.join(', ')}`);
      continue;
    }

    const canonicalName = fileToName.get(canonical) || canonical;

    for (const f of group) {
      if (f === canonical) continue;
      const full = path.join(projectsDir, f);
      const raw = await fs.readFile(full, 'utf8');
      const parsed = parseFrontMatter(raw);
      if (parsed.endIdx === -1) continue;

      setOrAppendMeta(parsed.lines, 1, parsed.endIdx, 'verification_status', 'rejected');
      setOrAppendMeta(parsed.lines, 1, parsed.endIdx, 'duplicate_of', canonicalName);
      setOrAppendMeta(parsed.lines, 1, parsed.endIdx, 'duplicate_url', url);

      const next = parsed.lines.join('\n');
      if (next === raw) {
        unchanged += 1;
      } else {
        await fs.writeFile(full, next, 'utf8');
        rejected += 1;
        console.log(`REJECT duplicate: ${f} -> ${canonical}`);
      }
    }
  }

  console.log(`Done. rejected=${rejected} unchanged=${unchanged}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
