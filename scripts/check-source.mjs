import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, lstatSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const javascript = new Set(['.js', '.mjs', '.cjs']);
const textFiles = new Set([...javascript, '.json', '.yml', '.yaml', '.html', '.css', '.md', '.sh', '.py']);

// Parse only: never import application code, install packages, generate files or use the network.
export function validateSource(path, source) {
  const errors = [];
  if (/^(?:<{7}(?: .*)?|>{7}(?: .*)?)\r?$/m.test(source)) {
    errors.push('Unresolved Git conflict marker');
  }
  const extension = extname(path);
  if (extension === '.json') {
    try { JSON.parse(source); } catch (error) { errors.push(`Invalid JSON: ${error.message}`); }
  }
  if (javascript.has(extension)) {
    const result = spawnSync(process.execPath,
      ['--input-type=' + (extension === '.cjs' ? 'commonjs' : 'module'), '--check'],
      { input: source, encoding: 'utf8', timeout: 10_000, maxBuffer: 256 * 1024 });
    if (result.error || result.status !== 0) {
      errors.push(result.error?.message || result.stderr.trim() || 'JavaScript syntax check failed');
    }
  }
  return errors;
}

export function checkSource() {
  // Include new, nonignored files so the local preflight also protects changes before commit.
  const paths = [...new Set(execFileSync('git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }).split('\0').filter(Boolean))];
  let checked = 0;
  const failures = [];
  for (const path of paths) {
    if (!textFiles.has(extname(path))) continue;
    const fullPath = resolve(root, path);
    let stat;
    try { stat = lstatSync(fullPath); } catch (error) {
      if (error.code === 'ENOENT') continue; // A staged deletion is valid.
      throw error;
    }
    if (!stat.isFile()) throw new Error(`Source must be a regular file: ${path}`);
    const errors = validateSource(path, readFileSync(fullPath, 'utf8'));
    checked += 1;
    for (const error of errors) failures.push(`${path}: ${error}`);
  }
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`Source preflight passed (${checked} files; no build, installs or network).`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { checkSource(); } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
