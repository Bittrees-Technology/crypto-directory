import assert from 'node:assert/strict';
import test from 'node:test';
import { CID } from 'multiformats/cid';
import { base58btc } from 'multiformats/bases/base58';
import { cidToBytes, createEnsContenthash, normalizeIpfsCid, encodeSetContenthash, ENS_NODE } from './lib/ens-release.mjs';

const v0 = 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4';
const v1 = 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4';
const golden = '0xe3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f';

test('ERC-1577 published vector is identical for CIDv0 and CIDv1', () => {
  for (const cid of [v0, v1]) {
    assert.deepEqual(createEnsContenthash(cid), { cid: v1, uri: 'ipfs://' + v1, contenthash: golden });
    assert.equal(cidToBytes(cid).length, 36);
  }
});

test('normalizes root URI and gateway representations without changing identity', () => {
  for (const value of [v0, v1, 'ipfs://' + v0, '/ipfs/' + v1, 'https://gateway.example/ipfs/' + v0 + '/', CID.parse(v1).toString(base58btc)]) {
    assert.equal(normalizeIpfsCid(value), v1);
  }
});

test('malformed, truncated and non-root references cannot become a contenthash', () => {
  for (const value of ['', 'bafyinvalid', v0.slice(0, -1), v1 + '!', 'ipns://' + v1, 'ipfs://' + v1 + '/index.html', '/ipfs/' + v1 + '?x=1', 'https://u:secret@gateway.example/ipfs/' + v1, 'https://gateway.example/ipfs/' + v1 + '?x=1', 'https://gateway.example/ipfs/' + v1 + '#fragment', 'https://gateway.example/ipfs/' + v1 + '/index.html', 'x'.repeat(1025)]) {
    assert.throws(() => createEnsContenthash(value), { name: 'Error' });
  }
});

test('unsigned ABI data matches the independent cast calldata vector', () => {
  const expected = '0x304e6ade' + ENS_NODE.slice(2) + '0'.repeat(62) + '40' + '0'.repeat(62) + '26' + golden.slice(2) + '0'.repeat(52);
  assert.equal(encodeSetContenthash(ENS_NODE, golden), expected);
  for (const size of [1, 31, 32, 33, 64, 512]) {
    const value = '0x' + 'ab'.repeat(size);
    const data = encodeSetContenthash(ENS_NODE, value);
    assert.equal(data.slice(138, 202), size.toString(16).padStart(64, '0'));
    assert.equal(data.slice(202, 202 + size * 2), value.slice(2));
    assert.equal((data.length - 10) % 64, 0);
  }
  for (const value of ['0x', '0x1', '0xzz', '0x' + 'ab'.repeat(513)]) assert.throws(() => encodeSetContenthash(ENS_NODE, value));
});
