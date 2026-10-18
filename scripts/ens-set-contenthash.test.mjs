import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSetContenthashPlan, main, parseArgs, runCast, validateSetContenthashEnv } from './ens-set-contenthash.mjs';
import { createEnsContenthash, ENS_NODE, ENS_REGISTRY, encodeSetContenthash } from './lib/ens-release.mjs';

const cid = 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4';
const resolver = '0x1234567890123456789012345678901234567890';
const env = { ETH_RPC_URL: 'https://mainnet.example/rpc-secret', ENS_RESOLVER_ADDRESS: resolver, ENS_OWNER_PRIVATE_KEY: 'signer-secret', ENS_SET_CONTENTHASH_EXECUTE: 'true' };
const record = '- 2026-10-18: CID=' + cid + ' | entries=1030';

function fixture(replies = ['1', resolver, 'true', '0x'], ledger = record) {
  const calls = [];
  return { calls, readReleases: () => ledger, runCast: argv => { calls.push(argv); if (!replies.length) throw new Error('Unexpected operation'); return replies.shift(); } };
}

test('execution environment cannot enable sending or unsigned preparation', () => {
  for (const value of ['1', 'true', 'yes', 'on']) {
    const args = parseArgs(['--cid', cid], { ENS_SET_CONTENTHASH_EXECUTE: value });
    assert.equal(args.execute, false);
    assert.equal(args.prepare, false);
  }
  for (const argv of [['--execute', '--cid', cid], ['--prepare', '--dry-run', '--cid', cid], ['--cid'], ['--name', 'other.eth', '--cid', cid], ['--unknown'], ['--cid', cid, '--cid', cid], [cid, '--cid', cid]]) assert.throws(() => parseArgs(argv, {}));
});

test('plan and validation never contain private keys or RPC secrets', () => {
  const args = parseArgs(['--prepare', '--cid', cid], {});
  assert.equal(validateSetContenthashEnv(args, { ETH_RPC_URL: env.ETH_RPC_URL }).ok, true);
  const output = JSON.stringify(buildSetContenthashPlan(args, env));
  assert.equal(output.includes('signer-secret'), false);
  assert.equal(output.includes('rpc-secret'), false);
  assert.equal(output.includes('normalizedPrivateKey'), false);
});

test('missing release record blocks before any external tool or RPC operation', () => {
  for (const argv of [['--cid', cid], ['--prepare', '--cid', cid]]) {
    const runtime = fixture([], '');
    assert.throws(() => main(argv, env, runtime), /publication gate blocked/);
    assert.deepEqual(runtime.calls, []);
  }
});

test('dry run checks mainnet and registry resolver and never includes a transaction', () => {
  const runtime = fixture();
  const result = main(['--cid', cid], env, runtime);
  assert.equal(result.action, 'dry-run-only');
  assert.equal(result.transactionSubmitted, false);
  assert.equal(result.transaction, undefined);
  assert.deepEqual(runtime.calls, [
    ['chain-id'],
    ['call', ENS_REGISTRY, 'resolver(bytes32)(address)', ENS_NODE],
    ['call', resolver, 'supportsInterface(bytes4)(bool)', '0xbc1c58d1'],
    ['call', resolver, 'contenthash(bytes32)(bytes)', ENS_NODE]
  ]);
});

test('only explicit preparation returns an unsigned transaction for the actual resolver', () => {
  const runtime = fixture();
  const result = main(['--prepare', '--cid', cid], env, runtime);
  assert.equal(result.action, 'unsigned-transaction-prepared');
  assert.equal(result.execute, false);
  assert.equal(result.transactionSubmitted, false);
  assert.deepEqual(result.transaction, { chainId: 1, to: resolver, value: '0', data: encodeSetContenthash(ENS_NODE, createEnsContenthash(cid).contenthash) });
  assert.equal(runtime.calls.some(argv => argv[0] === 'send'), false);
});

test('wrong network, resolver mismatch, unsupported interface and malformed responses fail closed', () => {
  for (const replies of [['2'], ['1', '0x' + '0'.repeat(40)], ['1', '0x' + '2'.repeat(40)], ['1', resolver, 'false'], ['1', resolver, 'true', 'not-hex']]) {
    assert.throws(() => main(['--prepare', '--cid', cid], env, fixture(replies)));
  }
});

test('current IPNS publication cannot be replaced by an IPFS packet', () => {
  const current = '0xe5010172002408011220771c3fc4dbc0a5a2733f31d9165c1a85224d3ed17f66cb267dc84567c8000e11';
  const dry = main(['--cid', cid], env, fixture(['1', resolver, 'true', current]));
  assert.equal(dry.action, 'dry-run-only');
  assert.equal(dry.transaction, undefined);
  assert.throws(() => main(['--prepare', '--cid', cid], env, fixture(['1', resolver, 'true', current])), /uses IPNS/);
});

test('already-current content produces no unsigned transaction or signing attempt', () => {
  const runtime = fixture(['1', resolver, 'true', createEnsContenthash(cid).contenthash]);
  const result = main(['--prepare', '--cid', cid], env, runtime);
  assert.equal(result.action, 'skip-already-current');
  assert.equal(result.transaction, undefined);
});

test('read runner cannot invoke a sending command', () => {
  assert.throws(() => runCast(['send', 'sensitive-input'], env), /Unsupported read operation/);
});
