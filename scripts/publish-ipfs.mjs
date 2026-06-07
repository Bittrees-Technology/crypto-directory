import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getIpfsStorageConfig,
  IpfsStorageClient,
  publishProjectPath,
} from "../../ipfs-evm-system/src/index.js";

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

  console.log(`CID: ${result.cid}`);
  console.log(`Pinned: ${result.pinStatus.pinned ? "yes" : "no"}`);
  console.log(`Gateway available: ${result.health.available ? "yes" : "no"}`);
  console.log("");
  console.log("Gateway URL:");
  console.log(`${result.gatewayUrl}/`);
}

await main();
