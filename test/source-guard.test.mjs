import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSource } from '../scripts/check-source.mjs';

test('rejects the imported/local tableRows collision that broke the preview build', () => {
  const source = "import { tableRows } from '../web/catalog.mjs';\nfunction tableRows() {}\n";
  assert.match(validateSource('scripts/build.mjs', source).join('\n'), /already been declared/);
});

test('accepts the corrected import without executing it', () => {
  assert.deepEqual(validateSource('scripts/build.mjs', "import { tableRows } from './not-installed.mjs';\n"), []);
});

test('syntax checking does not execute source', () => {
  assert.deepEqual(validateSource('api/example.js', "throw new Error('must never execute');"), []);
});

test('rejects broken JavaScript and malformed deployment JSON', () => {
  assert.notDeepEqual(validateSource('surf/api/catalog.js', 'export const broken = ;'), []);
  assert.match(validateSource('vercel.json', '{"git":').join('\n'), /Invalid JSON/);
});

test('rejects unresolved merge markers in source, config and content', () => {
  for (const file of ['scripts/build.mjs', '.github/workflows/ci.yml', 'content/projects/example.md']) {
    assert.match(validateSource(file, ['<<<<<<< HEAD', 'old', '=======', 'new', '>>>>>>> branch'].join('\n')).join('\n'), /conflict marker/);
  }
});

test('accepts common markdown rules and CommonJS handlers', () => {
  assert.deepEqual(validateSource('README.md', 'Title\n=======\n---\n'), []);
  assert.deepEqual(validateSource('api/example.cjs', 'module.exports = () => 1;'), []);
});

test('automatic builds are limited to the app release branch, including names with slashes', () => {
  for (const [config, branch] of [['../vercel.json', 'main'], ['../surf/vercel.json', 'surf-production']]) {
    const rules = JSON.parse(readFileSync(new URL(config, import.meta.url))).git.deploymentEnabled;
    assert.deepEqual(rules, { '**': false, [branch]: true });
  }
});

test('source preflight runs before dependency installation in the existing required CI job', () => {
  const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  assert.ok(ci.indexOf('npm run check:source') < ci.indexOf('npm ci'));
  assert.match(ci, /node-version: "24"/);
  assert.match(ci, /build-and-check:/);
  assert.match(ci, /cancel-in-progress: true/);
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
  assert.equal(pkg.scripts.prebuild, 'npm run check:source');
});
