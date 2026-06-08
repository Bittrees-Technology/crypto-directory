import assert from "node:assert/strict";
import test from "node:test";

import { buildSetContenthashPlan, parseArgs, validateSetContenthashEnv } from "./ens-set-contenthash.mjs";

const validEnv = {
  ENS_RESOLVER_ADDRESS: "0x1234567890123456789012345678901234567890",
  ETH_RPC_URL: "https://mainnet.example/rpc",
  ENS_OWNER_PRIVATE_KEY: "0x" + "1".repeat(64),
};

test("parses dry-run CID argument", () => {
  const args = parseArgs(["QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3"], {});
  assert.equal(args.cid, "QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3");
  assert.equal(args.ensName, "cryptodirectory.eth");
  assert.equal(args.execute, false);
});

test("requires signer key only when executing", () => {
  const dryRunArgs = parseArgs(["--cid", "QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3"], {});
  assert.equal(validateSetContenthashEnv(dryRunArgs, { ...validEnv, ENS_OWNER_PRIVATE_KEY: "" }).ok, true);

  const executeArgs = parseArgs(["--execute", "--cid", "QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3"], {});
  assert.deepEqual(validateSetContenthashEnv(executeArgs, { ...validEnv, ENS_OWNER_PRIVATE_KEY: "" }).missing, ["ENS_OWNER_PRIVATE_KEY"]);
});

test("builds a redacted execution plan", () => {
  const args = parseArgs(["--execute", "--cid", "QmYwAPJzv5CZsnAzt8auVTL9JmUbsL7op5c8ALoA4WJxE3"], {});
  const plan = buildSetContenthashPlan(args, validEnv);
  assert.equal(plan.ensName, "cryptodirectory.eth");
  assert.equal(plan.validation.ok, true);
  assert.equal(plan.validation.privateKeyPresent, true);
  assert.equal(JSON.stringify(plan).includes(validEnv.ENS_OWNER_PRIVATE_KEY), false);
});
