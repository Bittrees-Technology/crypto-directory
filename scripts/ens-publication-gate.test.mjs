import assert from "node:assert/strict";
import test from "node:test";

import { buildEnsPublicationGate, releaseRecordIncludesCid } from "./ens-publication-gate.mjs";
import { parseArgs } from "./ens-set-contenthash.mjs";

const cid = "QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3";
const env = {
  ENS_RESOLVER_ADDRESS: "0x1234567890123456789012345678901234567890",
  ETH_RPC_URL: "https://mainnet.example/rpc",
  IPFS_GATEWAY_BASE_URL: "https://gateway.example",
};

test("checks whether release records include a CID", () => {
  assert.equal(releaseRecordIncludesCid(cid, "CID=" + cid), true);
  assert.equal(releaseRecordIncludesCid(cid, "CID=other"), false);
});

test("passes dry-run gate with recorded CID and resolver env", () => {
  const args = parseArgs(["--cid", cid], {});
  const gate = buildEnsPublicationGate(args, env, "- CID=" + cid);
  assert.equal(gate.ensManager, "bao-bo");
  assert.equal(gate.signerAuthority, "bob");
  assert.equal(gate.secretSafetyReviewer, "hob");
  assert.equal(gate.releaseRecorded, true);
  assert.equal(gate.dryRunReady, true);
  assert.equal(gate.executeReady, false);
  assert.deepEqual(gate.missingForExecute, ["ENS_OWNER_PRIVATE_KEY"]);
  assert.equal(gate.recommendedBobDecision, "dry-run-resolver-check");
});

test("blocks when CID is not recorded", () => {
  const args = parseArgs(["--cid", cid], {});
  const gate = buildEnsPublicationGate(args, env, "");
  assert.equal(gate.releaseRecorded, false);
  assert.deepEqual(gate.blockers, ["release CID is not recorded in releases.md"]);
  assert.equal(gate.recommendedBobDecision, "blocked-before-dry-run");
});
