import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getIpfsStorageConfig,
  IpfsStorageClient,
  publishProjectPath,
} from "../../ipfs-evm-system/src/index.js";
import { createEnsContenthash, ENS_NAME } from "./lib/ens-release.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");

async function main() {
  const client = new IpfsStorageClient({
    ...getIpfsStorageConfig(),
    defaultSourceProject: "crypto-directory",
  });

  const nodeHealth = await client.checkNodeHealth();
  if (!nodeHealth.available) {
    console.error("ipfs-node:unavailable");
    if (nodeHealth.error) {
      console.error(nodeHealth.error);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Publishing site/ to IPFS through the shared storage contract...");
  const result = await publishProjectPath(client, {
    project: "crypto-directory",
    inputPath: siteDir,
    artifactKind: "site-release",
    wrapWithDirectory: true,
    extraMetadata: {
      releaseSurface: "site",
      contentType: "text/html",
    },
  });

  const ensPacket = createEnsContenthash(result.cid);

  console.log(`CID: ${result.cid}`);
  console.log(`Pinned: ${result.pinStatus.pinned ? "yes" : "no"}`);
  console.log(`Gateway available: ${result.health.available ? "yes" : "no"}`);
  console.log("");
  console.log("Gateway URL:");
  console.log(`${result.gatewayUrl}/`);
  console.log("");
  console.log("ENS contenthash packet:");
  console.log(`ENS name: ${ENS_NAME}`);
  console.log(`URI: ${ensPacket.uri}`);
  console.log(`Contenthash: ${ensPacket.contenthash}`);
  console.log("After recording the release, inspect the current resolver (read-only):");
  console.log(`npm run ens:set-contenthash -- --dry-run --cid ${ensPacket.cid}`);
  console.log("For a reviewed recovery proposal, prepare an unsigned wallet/Safe transaction:");
  console.log(`npm run ens:set-contenthash -- --prepare --cid ${ensPacket.cid}`);
  console.log("Normal weekly releases use the existing IPNS publisher; this does not update ENS.");
}

await main();
