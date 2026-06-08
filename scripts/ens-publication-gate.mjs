#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createEnsContenthash } from "../../ipfs-evm-system/src/index.js";
import { parseArgs, validateSetContenthashEnv } from "./ens-set-contenthash.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function buildGatewayUrl(cid, env = process.env) {
  const base = (env.IPFS_GATEWAY_BASE_URL || "https://ipfs.nftfactory.org").replace(/\/+$/, "");
  return base + "/ipfs/" + cid + "/";
}

export function releaseRecordIncludesCid(cid, releasesText) {
  return Boolean(cid && releasesText.includes(cid));
}

export function buildEnsPublicationGate(args, env = process.env, releasesText = "") {
  const packet = createEnsContenthash(args.cid);
  const dryRunEnv = validateSetContenthashEnv({ ...args, execute: false }, env);
  const executeEnv = validateSetContenthashEnv({ ...args, execute: true }, env);
  const releaseRecorded = releaseRecordIncludesCid(packet.cid, releasesText);
  const gatewayUrl = buildGatewayUrl(packet.cid, env);
  const blockers = [];

  if (!releaseRecorded) blockers.push("release CID is not recorded in releases.md");
  if (!dryRunEnv.ok) blockers.push(...dryRunEnv.missing, ...dryRunEnv.invalid);

  return {
    ensManager: "bao-bo",
    signerAuthority: "bob",
    secretSafetyReviewer: "hob",
    ensName: args.ensName,
    cid: packet.cid,
    uri: packet.uri,
    contenthash: packet.contenthash,
    gatewayUrl,
    releaseRecorded,
    dryRunReady: dryRunEnv.ok,
    executeReady: executeEnv.ok,
    signerKeyPresent: executeEnv.privateKeyPresent,
    missingForDryRun: dryRunEnv.missing,
    missingForExecute: executeEnv.missing,
    invalid: Array.from(new Set([...dryRunEnv.invalid, ...executeEnv.invalid])),
    blockers: Array.from(new Set(blockers)),
    recommendedBobDecision: releaseRecorded && dryRunEnv.ok ? "dry-run-resolver-check" : "blocked-before-dry-run",
  };
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv, env);
  if (!args.cid) {
    console.error("usage: node scripts/ens-publication-gate.mjs --cid <ipfs-cid>");
    process.exitCode = 1;
    return;
  }

  const releasesPath = path.join(rootDir, "releases.md");
  const releasesText = fs.existsSync(releasesPath) ? fs.readFileSync(releasesPath, "utf8") : "";
  const gate = buildEnsPublicationGate(args, env, releasesText);

  console.log(JSON.stringify(gate, null, 2));
  if (gate.blockers.length > 0) process.exitCode = 1;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
