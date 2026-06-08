import assert from "node:assert/strict";
import test from "node:test";

import { cidToBytes, createEnsContenthash, normalizeIpfsCid } from "../../ipfs-evm-system/src/index.js";

test("normalizes ipfs uri and gateway path forms", () => {
  assert.equal(normalizeIpfsCid("ipfs://bafybeigdyrzt5sfp7udm7hu76yqkqbvuzim4x3uhg56mymw3hmw4usjv2q"), "bafybeigdyrzt5sfp7udm7hu76yqkqbvuzim4x3uhg56mymw3hmw4usjv2q");
  assert.equal(normalizeIpfsCid("/ipfs/QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3"), "QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3");
});

test("encodes CIDv0 as an ENS ipfs-ns contenthash", () => {
  const result = createEnsContenthash("QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3");
  assert.equal(result.uri, "ipfs://QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3");
  assert.match(result.contenthash, /^0xe3011220[0-9a-f]+$/);
  assert.equal(cidToBytes(result.cid).length, 34);
});

test("encodes CIDv1 base32 as an ENS ipfs-ns contenthash", () => {
  const result = createEnsContenthash("bafybeigdyrzt5sfp7udm7hu76yqkqbvuzim4x3uhg56mymw3hmw4usjv2q");
  assert.match(result.contenthash, /^0xe3010170[0-9a-f]+$/);
  assert.ok(cidToBytes(result.cid).length > 34);
});
