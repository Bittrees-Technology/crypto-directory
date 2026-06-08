#!/usr/bin/env node
import { createEnsContenthash } from "../../ipfs-evm-system/src/index.js";

const cid = process.argv[2] || process.env.CRYPTO_DIRECTORY_IPFS_CID || "";
const ensName = process.env.CRYPTO_DIRECTORY_ENS_NAME || "cryptodirectory.eth";

if (!cid) {
  console.error("usage: node scripts/ens-contenthash.mjs <ipfs-cid>");
  process.exitCode = 1;
} else {
  const result = createEnsContenthash(cid);
  console.log(JSON.stringify({
    ensName,
    ...result,
    resolverCall: {
      function: "setContenthash(bytes32 node, bytes hash)",
      dryRunCommand: `cast call "$ENS_RESOLVER_ADDRESS" "contenthash(bytes32)(bytes)" "$(cast namehash ${ensName})"`,
      sendCommandTemplate: `cast send "$ENS_RESOLVER_ADDRESS" "setContenthash(bytes32,bytes)" "$(cast namehash ${ensName})" "${result.contenthash}" --rpc-url "$ETH_RPC_URL" --private-key "$ENS_OWNER_PRIVATE_KEY"`,
    },
    safety: "Dry-run only. Confirm resolver address, owner wallet, gas, and current contenthash before sending.",
  }, null, 2));
}
