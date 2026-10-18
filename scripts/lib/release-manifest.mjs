import { promises as fs } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

export async function writeReleaseManifest(root, site, env = process.env) {
  const sourceCommit = env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  if (!/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('Release requires an exact source commit');
  const files = {};
  let total = 0;
  async function visit(directory, prefix = '') {
    for (const entry of (await fs.readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith('.')) throw new Error('Hidden files are not release assets');
      const relative = prefix + entry.name;
      if (entry.isSymbolicLink()) throw new Error('Release assets cannot be symlinks');
      if (relative === 'release.json') continue;
      if (entry.isDirectory()) await visit(path.join(directory, entry.name), relative + '/');
      else if (entry.isFile()) {
        const file = path.join(directory, entry.name);
        const { size } = await fs.stat(file);
        total += size;
        if (size > 16 * 1024 * 1024 || total > 32 * 1024 * 1024 || Object.keys(files).length >= 128) throw new Error('Release exceeds artifact bounds');
        files[relative] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
      }
      else throw new Error('Unsupported release asset');
    }
  }
  await visit(site);
  const manifest = { schemaVersion: 1, repository: 'Bittrees-Technology/crypto-directory', sourceCommit,
    projectId: env.VERCEL_PROJECT_ID || null, deploymentId: env.VERCEL_DEPLOYMENT_ID || null,
    deploymentHost: env.VERCEL_URL || null, files };
  await fs.writeFile(path.join(site, 'release.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
