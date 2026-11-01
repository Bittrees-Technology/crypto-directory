import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PassThrough, Readable, Writable } from 'node:stream';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createAdapter, createHandler, createReader, serve, TOOLS } from '../integrations/crypto-directory-read-mcp.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const row = (id, extra = {}) => ({ id: id + '.md', name: id, lead_category: 'Wallets', description: 'Public crypto wallet', tags: ['Wallet'], ecosystem: ['Ethereum'], primary_url: 'https://example.org/', product_url: 'n/a', verification_status: 'verified', ...extra });
const dataset = [row('zeta'), row('alpha', { research_url: 'https://private.invalid/', duplicate_of: 'secret.md', unexpected: 'never forward' }), row('held', { verification_status: 'needs_update' }), row('retired', { verification_status: 'rejected' }), row('pending', { verification_status: 'awaiting_review' }), row('agent', { lead_category: 'AI Agents', tags: ['AI Agents'], description: 'Web3 agent', ecosystem: ['Base'] })];
function fixture(rows = dataset, options = {}) {
  const bytes = Buffer.from(JSON.stringify(rows));
  const manifest = Buffer.from(JSON.stringify({ schemaVersion: 1, repository: 'Bittrees-Technology/crypto-directory', sourceCommit: options.commit ?? 'a'.repeat(40), files: { 'data/projects.json': hash(bytes) } }));
  return { bytes, manifest };
}
function response(bytes, init = {}) { return new Response(bytes, { headers: { 'content-type': 'application/json' }, ...init }); }
function source(initial = fixture()) {
  const calls = []; let current = initial;
  return { calls, set(value) { current = value; }, async request(url, options) { calls.push({ url, options }); return response(url.endsWith('/release.json') ? current.manifest : current.bytes); } };
}
const rpc = (method, params, id = 1) => ({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) });
const initialize = version => rpc('initialize', { protocolVersion: version ?? '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
async function ready(handle) { await handle(initialize()); await handle({ jsonrpc: '2.0', method: 'notifications/initialized' }); }

test('discovery advertises exactly the implemented public tools and reviewed local setup', async () => {
  const manifest = JSON.parse(await readFile(new URL('../bittrees.tools.json', import.meta.url), 'utf8'));
  assert.equal(manifest.schema, 'bittrees.app-tools.v1'); assert.equal(manifest.version, 1); assert.equal(manifest.projectId, 'crypto-directory');
  assert.equal(manifest.connections.length, 1);
  const connection = manifest.connections[0];
  assert.equal(connection.transport, 'local-mcp-adapter'); assert.equal(connection.endpoint, 'https://cd.bittrees.org/data/projects.json');
  assert.deepEqual(connection.setup, { command: 'node', args: ['integrations/crypto-directory-read-mcp.mjs'], authentication: 'none' });
  assert.deepEqual(connection.operations, { read: TOOLS.map(t => t.name) });
});

test('fixed public GETs, digest/revision provenance, no inherited credentials or URL controls', async () => {
  const f = source(), call = createAdapter({ request: f.request });
  const data = await call('directory.read_release');
  assert.equal(data.sourceCommit, 'a'.repeat(40)); assert.equal(data.datasetSha256, hash(fixture().bytes)); assert.equal(data.verifiedListingCount, 3);
  assert.deepEqual(f.calls.map(x => x.url), ['https://cd.bittrees.org/release.json', 'https://cd.bittrees.org/data/projects.json', 'https://cd.bittrees.org/release.json']);
  for (const { options } of f.calls) { assert.equal(options.method, 'GET'); assert.equal(options.redirect, 'error'); assert.equal(options.credentials, 'omit'); assert.deepEqual(Object.keys(options.headers).sort(), ['Accept', 'User-Agent']); assert.equal(options.body, undefined); }
  assert.equal(new Set(f.calls.map(x => x.options.signal)).size, 1);
});
test('only verified 14-field projections; no research, duplicates, body or arbitrary metadata', async () => {
  const call = createAdapter({ request: source().request });
  const all = await call('directory.search');
  assert.deepEqual(all.listings.map(x => x.id), ['agent.md', 'alpha.md', 'zeta.md']);
  assert(!JSON.stringify(all).includes('private.invalid')); assert(!JSON.stringify(all).includes('never forward'));
  assert.deepEqual(Object.keys(all.listings[1]).sort(), ['description', 'ecosystem', 'id', 'lead_category', 'name', 'primary_url', 'product_url', 'tags', 'verification_status'].sort());
  for (const id of ['held.md', 'retired.md', 'pending.md', 'unknown.md']) assert.equal((await call('directory.get_listing', { id })).listing, null);
});
test('search name, description, tags and ecosystem with exact category and stable ID order', async () => {
  const call = createAdapter({ request: source().request });
  assert.equal((await call('directory.search', { query: ' ＷＥＢ３ ' })).listings[0].id, 'agent.md');
  assert.equal((await call('directory.search', { query: 'base' })).total, 1);
  assert.equal((await call('directory.search', { query: 'ALPHA' })).total, 1);
  assert.equal((await call('directory.search', { query: 'wallet', category: 'Wallets' })).total, 2);
  assert.equal((await call('directory.search', { category: 'wallets' })).total, 0);
  assert.deepEqual((await call('directory.list_categories')).categories, [{ name: 'AI Agents', count: 1 }, { name: 'Wallets', count: 2 }]);
});
test('deterministic pagination binds exact revision, query, category and page size', async () => {
  const call = createAdapter({ request: source().request });
  const one = await call('directory.search', { limit: 1 });
  const two = await call('directory.search', { limit: 1, cursor: one.nextCursor });
  const three = await call('directory.search', { limit: 1, cursor: two.nextCursor });
  assert.deepEqual([one, two, three].map(x => x.listings[0].id), ['agent.md', 'alpha.md', 'zeta.md']); assert.equal(three.nextCursor, null);
  for (const extra of [{ query: 'wallet' }, { category: 'Wallets' }, { limit: 2 }]) await assert.rejects(call('directory.search', { limit: 1, cursor: one.nextCursor, ...extra }), /Cursor/);
  const mutated = JSON.parse(Buffer.from(one.nextCursor, 'base64url')); mutated.n = -1;
  await assert.rejects(call('directory.search', { limit: 1, cursor: Buffer.from(JSON.stringify(mutated)).toString('base64url') }), /Cursor/);
});
test('bounded cache shares concurrent refresh; expired failure never serves stale; no retry', async () => {
  const f = source(); let now = 1000;
  const call = createAdapter({ request: f.request, clock: () => now });
  await Promise.all([call('directory.search'), call('directory.list_categories'), call('directory.read_release')]); assert.equal(f.calls.length, 3);
  now += 59999; await call('directory.read_release'); assert.equal(f.calls.length, 3);
  now++; f.set({ manifest: Buffer.from('invalid'), bytes: Buffer.alloc(0) });
  await assert.rejects(call('directory.search'), /JSON/); assert.equal(f.calls.length, 4);
});
test('release change after cache expiration rejects previous cursor even for same listing set', async () => {
  const f = source(); let now = 0;
  const call = createAdapter({ request: f.request, clock: () => now });
  const page = await call('directory.search', { limit: 1 });
  now = 60000; f.set(fixture(dataset, { commit: 'b'.repeat(40) }));
  await assert.rejects(call('directory.search', { limit: 1, cursor: page.nextCursor }), /another release/);
});
test('unsafe link schemes, embedded credentials, whitespace and unknown URL values are null', async () => {
  const r = row('unsafe', { primary_url: 'javascript:alert(1)', product_url: 'https://user:password@example.org', token_url: 'file:///secret', twitter: ' https://example.org' });
  const call = createAdapter({ request: source(fixture([r])).request });
  const { listing } = await call('directory.get_listing', { id: 'unsafe.md' });
  for (const key of ['primary_url', 'product_url', 'token_url', 'twitter']) assert.equal(listing[key], null);
});
test('malformed input, arbitrary URLs, project selection, private/write tools fail before network', async () => {
  const f = source(), call = createAdapter({ request: f.request });
  const invalid = [
    ['directory.submit', {}], ['directory.search', { url: 'http://127.0.0.1/' }], ['directory.search', { projectId: 'roles' }],
    ['directory.search', { query: 'x'.repeat(161) }], ['directory.search', { query: null }], ['directory.search', { limit: 101 }], ['directory.search', { limit: 1.5 }], ['directory.search', { limit: 0 }],
    ['directory.search', { cursor: 'x'.repeat(513) }], ['directory.search', { category: '' }], ['directory.search', []], ['directory.search', null],
    ['directory.get_listing', { id: '../roles.md' }], ['directory.get_listing', { id: 'a/b.md' }], ['directory.get_listing', { id: 'https://example.org' }], ['directory.get_listing', {}],
    ['directory.read_release', { token: 'secret' }], ['directory.list_categories', { path: '/api/directory/review' }],
  ];
  for (const [name, args] of invalid) await assert.rejects(call(name, args));
  assert.equal(f.calls.length, 0);
});
for (const status of [301, 401, 403, 429, 500]) test('HTTP ' + status + ' fails without fallback or retries', async () => {
  let calls = 0;
  const call = createAdapter({ request: async () => { calls++; return response('{}', { status }); } });
  await assert.rejects(call('directory.read_release'), status === 429 ? /rate limited/ : /unavailable/); assert.equal(calls, 1);
});
test('redirected response, changed response URL and HTML response are rejected', async () => {
  for (const changed of [{ redirected: true }, { url: 'https://evil.invalid/' }, { headers: new Headers({ 'content-type': 'text/html' }) }]) {
    const request = async () => { const r = response(fixture().manifest); for (const [key, value] of Object.entries(changed)) Object.defineProperty(r, key, { value }); return r; };
    await assert.rejects(createAdapter({ request })('directory.read_release'), /Unexpected/);
  }
});
test('declared and streamed manifest size limits reject oversized input', async () => {
  for (const request of [async () => response('{}', { headers: { 'content-type': 'application/json', 'content-length': '128001' } }), async () => response(Buffer.alloc(128001, 32))]) await assert.rejects(createAdapter({ request })('directory.read_release'), /size limit/);
});
test('dataset size is bounded independently of manifest', async () => {
  const f = fixture(); let calls = 0;
  const request = async url => { calls++; return response(url.endsWith('/release.json') ? f.manifest : Buffer.alloc(4000001)); };
  await assert.rejects(createAdapter({ request })('directory.search'), /size limit/); assert.equal(calls, 2);
});
test('a shared overall deadline covers slow bodies as well as requests', async () => {
  let calls = 0;
  const request = async () => { calls++; return response(new ReadableStream({ start() {} })); };
  // Keep test process alive while Node's unref'ed AbortSignal timer expires.
  const keepAlive = setTimeout(() => {}, 1000);
  try { await assert.rejects(createAdapter({ request, deadlineMs: 15 })('directory.search')); } finally { clearTimeout(keepAlive); }
  assert.equal(calls, 1);
});
test('upstream failures do not leak credentials, raw errors, HTML or paths', async () => {
  const h = createHandler({ request: async () => { throw Error('https://user:SECRET@host.invalid /Users/private'); } }); await ready(h);
  const result = await h(rpc('tools/call', { name: 'directory.search' }));
  assert.equal(result.result.isError, true); assert(!JSON.stringify(result).includes('SECRET')); assert(!JSON.stringify(result).includes('/Users'));
});
test('mismatched digest and changing release are rejected', async () => {
  for (const mode of ['digest', 'release']) {
    let n = 0; const f = fixture();
    const request = async () => { n++; return response(n === 2 ? (mode === 'digest' ? Buffer.from('[]') : f.bytes) : (n === 3 ? Buffer.concat([f.manifest, Buffer.from(' ')]) : f.manifest)); };
    await assert.rejects(createAdapter({ request })('directory.search'), mode === 'digest' ? /digest/ : /changed/);
    assert.equal(n, mode === 'digest' ? 2 : 3);
  }
});
test('invalid manifest schema, repository, commit or digest cannot establish a snapshot', async () => {
  for (const change of [{ schemaVersion: 2 }, { repository: 'someone/other' }, { sourceCommit: 'latest' }, { files: {} }]) {
    const f = fixture(); const value = { ...JSON.parse(f.manifest), ...change };
    await assert.rejects(createAdapter({ request: async () => response(JSON.stringify(value)) })('directory.read_release'), /release manifest/);
  }
});
test('invalid dataset shape, duplicate IDs, oversized fields, invalid IDs and excessive rows fail closed', async () => {
  for (const rows of [{}, [null], [row('x'), row('x')], [row('../unsafe')], [row('x', { description: 'x'.repeat(4001) })], [row('x', { tags: 'not an array' })], Array.from({ length: 10001 }, (_, i) => ({ id: i + '.md' }))]) {
    await assert.rejects(createAdapter({ request: source(fixture(rows)).request })('directory.search'));
  }
});
test('invalid UTF-8 or JSON source is rejected', async () => {
  for (const bytes of [Buffer.from([0xff]), Buffer.from('{')]) await assert.rejects(createAdapter({ request: async () => response(bytes) })('directory.read_release'), /JSON/);
});
test('MCP lifecycle negotiates supported versions, readiness, read-only tools and no other capabilities', async () => {
  const f = source(), h = createHandler({ request: f.request });
  assert.equal((await h(rpc('tools/list'))).error.code, -32002);
  const init = await h(initialize('2025-06-18')); assert.equal(init.result.protocolVersion, '2025-06-18'); assert.deepEqual(init.result.capabilities, { tools: {} });
  assert.equal((await h(rpc('tools/list'))).error.code, -32002);
  await h({ jsonrpc: '2.0', method: 'notifications/initialized' });
  const listed = await h(rpc('tools/list'));
  assert.deepEqual(listed.result.tools.map(t => t.name), TOOLS.map(t => t.name)); assert.equal(f.calls.length, 0);
  for (const t of listed.result.tools) { assert.equal(t.annotations.readOnlyHint, true); assert.equal(t.annotations.destructiveHint, false); assert.equal(t.inputSchema.additionalProperties, false); }
  assert.equal((await h(rpc('resources/list'))).error.code, -32601); assert.equal((await h(rpc('tools/list', { cursor: 'unknown' }))).error.code, -32602);
  assert.equal((await h(initialize())).error.code, -32602);
});
test('MCP rejects unknown tools and extra tool-call properties without network', async () => {
  const f = source(), h = createHandler({ request: f.request }); await ready(h);
  for (const params of [{ name: 'directory.delete', arguments: {} }, { name: 'directory.search', arguments: null }, { name: 'directory.search', arguments: { url: 'https://other' } }, { name: 'directory.search', token: 'secret' }]) assert.equal((await h(rpc('tools/call', params))).error.code, -32602);
  assert.equal(f.calls.length, 0);
  const r = await h(rpc('tools/call', { name: 'directory.search', arguments: { limit: 1 } }));
  assert.equal(r.result.isError, false); assert.deepEqual(JSON.parse(r.result.content[0].text), r.result.structuredContent);
});
test('MCP invalid envelopes and notifications never trigger reads', async () => {
  const f = source(), h = createHandler({ request: f.request });
  for (const value of [null, [], {}, rpc('ping', []), { ...rpc('ping'), id: null }, { ...rpc('ping'), id: {} }]) assert.equal((await h(value)).error.code, -32600);
  assert.equal(await h({ jsonrpc: '2.0', method: 'tools/call', params: { name: 'directory.search' } }), null); assert.equal(f.calls.length, 0);
});
test('large tool results are bounded with explicit error rather than partial data', async () => {
  const rows = Array.from({ length: 100 }, (_, i) => row(String(i), { description: 'x'.repeat(4000), tags: Array(20).fill('a'.repeat(160)) }));
  const h = createHandler({ request: source(fixture(rows)).request }); await ready(h);
  const result = await h(rpc('tools/call', { name: 'directory.search', arguments: { limit: 100 } }));
  assert.equal(result.result.isError, true); assert.match(result.result.content[0].text, /fewer results/);
});
function sink() { let text = ''; return { stream: new Writable({ write(chunk, encoding, done) { text += chunk; done(); } }), text: () => text }; }
test('stdio handles split UTF-8 chunks, parse errors and newline framing without stdout logs', async () => {
  const output = sink(), errors = sink();
  const messages = ['{bad}', JSON.stringify(initialize()), JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }), JSON.stringify(rpc('tools/list', undefined, 'café'))].join('\n') + '\n';
  const bytes = Buffer.from(messages), at = bytes.indexOf(Buffer.from('é')) + 1;
  assert.equal(await serve({ input: Readable.from([bytes.subarray(0, at), bytes.subarray(at)]), output: output.stream, errors: errors.stream }), true);
  const replies = output.text().trim().split('\n').map(JSON.parse);
  assert.equal(replies.length, 3); assert.equal(replies[0].error.code, -32700); assert.equal(replies[2].id, 'café'); assert.equal(errors.text(), '');
});
test('stdio rejects oversized and unterminated lines and applies request backpressure', async () => {
  for (const value of ['x'.repeat(8193), '{}']) {
    const output = sink(), errors = sink(); assert.equal(await serve({ input: Readable.from([value]), output: output.stream, errors: errors.stream }), false); assert.equal(output.text(), ''); assert.match(errors.text(), /transport failed/);
  }
  const input = new PassThrough(), output = sink(), errors = sink(); let active = 0, peak = 0;
  const run = serve({ input, output: output.stream, errors: errors.stream, handle: async x => { active++; peak = Math.max(peak, active); await new Promise(r => setTimeout(r, 2)); active--; return x; } });
  input.end('{}\n'.repeat(20)); assert.equal(await run, true); assert.equal(peak, 1);
});
test('real stdio executable initializes/lists with no network and rejects configuration overrides', async () => {
  const script = new URL('../integrations/crypto-directory-read-mcp.mjs', import.meta.url).pathname;
  const child = spawn(process.execPath, [script], { env: { ...process.env, BITTREES_APP_TOKEN: 'must-not-use', CD_ORIGIN: 'http://127.0.0.1:1' }, stdio: ['pipe', 'pipe', 'pipe'] });
  let out = '', err = ''; child.stdout.on('data', x => out += x); child.stderr.on('data', x => err += x);
  child.stdin.end([initialize(), { jsonrpc: '2.0', method: 'notifications/initialized' }, rpc('tools/list', undefined, 2)].map(JSON.stringify).join('\n') + '\n');
  const [code] = await once(child, 'close'); assert.equal(code, 0); assert.equal(err, ''); assert.equal(out.trim().split('\n').map(JSON.parse)[1].result.tools.length, 4); assert(!out.includes('must-not-use'));
  const override = spawn(process.execPath, [script, '--origin=https://other.invalid'], { stdio: ['pipe', 'pipe', 'pipe'] }); let stderr = ''; override.stderr.on('data', x => stderr += x); override.stdin.end();
  assert.equal((await once(override, 'close'))[0], 1); assert.match(stderr, /no arguments/);
});
