import assert from 'node:assert/strict';
import test from 'node:test';
import { buildEnsPublicationGate, releaseRecordIncludesCid } from './ens-publication-gate.mjs';
import { parseArgs, normalizeIpfsCid } from './lib/ens-release.mjs';

const cid = 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4';
const env = { ETH_RPC_URL: 'https://mainnet.example/rpc' };
const record = '- 2026-10-18: CID=' + cid + ' | entries=1030 | notes=reviewed';

test('release gate requires a complete dated CID field and accepts equivalent CID encodings', () => {
  assert.equal(releaseRecordIncludesCid(cid, record), true);
  assert.equal(releaseRecordIncludesCid(normalizeIpfsCid(cid), record), true);
  for (const value of ['CID=' + cid, '- ' + cid, '# ' + record, record.replace(cid, cid + 'suffix'), '- 2026-10-18: CID=other | notes=' + cid, '- 2026-10-18: CID=invalid\nnotes=' + cid]) {
    assert.equal(releaseRecordIncludesCid(cid, value), false);
  }
});

test('valid gate permits only read or unsigned preparation and never grants execution authority', () => {
  const gate = buildEnsPublicationGate(parseArgs(['--prepare', '--cid', cid], {}), env, record);
  assert.equal(gate.releaseRecorded, true);
  assert.equal(gate.dryRunReady, true);
  assert.equal(gate.prepareReady, true);
  assert.equal(gate.executeReady, false);
  assert.deepEqual(gate.blockers, []);
  assert.match(gate.approvalRequired, /grants no signing authority/);
});

test('missing release or RPC configuration blocks the gate', () => {
  for (const [config, ledger] of [[env, ''], [{}, record], [{ ETH_RPC_URL: 'file:///secret' }, record]]) {
    const gate = buildEnsPublicationGate(parseArgs(['--cid', cid], {}), config, ledger);
    assert.equal(gate.prepareReady, false);
    assert.equal(gate.dryRunReady, false);
    assert.ok(gate.blockers.length);
    assert.equal(gate.executeReady, false);
  }
});
