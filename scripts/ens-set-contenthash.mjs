#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { createEnsContenthash } from "../../ipfs-evm-system/src/index.js";

function isHex(value, bytes) {
  return new RegExp("^0x[0-9a-fA-F]{" + (bytes * 2) + "}$").test(String(value || ""));
}

function normalizePrivateKey(value) {
  const trimmed = String(value || "").trim();
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return "0x" + trimmed;
  return trimmed;
}

export function parseArgs(argv = process.argv.slice(2), env = process.env) {
  const result = {
    cid: env.CRYPTO_DIRECTORY_IPFS_CID || "",
    ensName: env.CRYPTO_DIRECTORY_ENS_NAME || "cryptodirectory.eth",
    execute: ["1", "true", "yes", "on"].includes(String(env.ENS_SET_CONTENTHASH_EXECUTE || "").toLowerCase()),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--execute") result.execute = true;
    else if (arg === "--dry-run") result.execute = false;
    else if (arg === "--name") result.ensName = argv[++index] || "";
    else if (arg === "--cid") result.cid = argv[++index] || "";
    else if (!arg.startsWith("--") && !result.cid) result.cid = arg;
    else throw new Error("unknown argument: " + arg);
  }

  return result;
}

export function validateSetContenthashEnv({ cid, ensName, execute }, env = process.env) {
  const normalizedKey = normalizePrivateKey(env.ENS_OWNER_PRIVATE_KEY);
  const missing = [];
  const invalid = [];

  if (!cid) missing.push("CRYPTO_DIRECTORY_IPFS_CID or --cid");
  if (!ensName) missing.push("CRYPTO_DIRECTORY_ENS_NAME or --name");
  if (!env.ENS_RESOLVER_ADDRESS) missing.push("ENS_RESOLVER_ADDRESS");
  if (!env.ETH_RPC_URL) missing.push("ETH_RPC_URL");
  if (execute && !normalizedKey) missing.push("ENS_OWNER_PRIVATE_KEY");

  if (env.ENS_RESOLVER_ADDRESS && !isHex(env.ENS_RESOLVER_ADDRESS, 20)) invalid.push("ENS_RESOLVER_ADDRESS must be a 20-byte hex address");
  if (env.ETH_RPC_URL && !/^https?:\/\//.test(env.ETH_RPC_URL)) invalid.push("ETH_RPC_URL must be an http(s) URL");
  if (execute && normalizedKey && !isHex(normalizedKey, 32)) invalid.push("ENS_OWNER_PRIVATE_KEY must be a 32-byte hex private key");

  return {
    ok: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
    privateKeyPresent: Boolean(normalizedKey),
    normalizedPrivateKey: normalizedKey,
  };
}

export function buildSetContenthashPlan(args, env = process.env) {
  const packet = createEnsContenthash(args.cid);
  const validation = validateSetContenthashEnv(args, env);

  return {
    ensName: args.ensName,
    cid: packet.cid,
    uri: packet.uri,
    contenthash: packet.contenthash,
    resolverAddress: env.ENS_RESOLVER_ADDRESS || null,
    rpcConfigured: Boolean(env.ETH_RPC_URL),
    execute: Boolean(args.execute),
    validation: {
      ok: validation.ok,
      missing: validation.missing,
      invalid: validation.invalid,
      privateKeyPresent: validation.privateKeyPresent,
    },
  };
}

function runCast(castBin, args, options = {}) {
  const result = spawnSync(castBin, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "cast command failed").trim();
    throw new Error(detail);
  }

  return String(result.stdout || "").trim();
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv, env);
  const plan = buildSetContenthashPlan(args, env);
  const validation = validateSetContenthashEnv(args, env);

  if (!validation.ok) {
    console.error(JSON.stringify(plan, null, 2));
    process.exitCode = 1;
    return;
  }

  const castBin = env.CAST_BIN || "cast";
  const namehash = runCast(castBin, ["namehash", args.ensName]);
  const currentContenthash = runCast(castBin, [
    "call",
    env.ENS_RESOLVER_ADDRESS,
    "contenthash(bytes32)(bytes)",
    namehash,
    "--rpc-url",
    env.ETH_RPC_URL,
  ]);
  const alreadyCurrent = currentContenthash.toLowerCase() === plan.contenthash.toLowerCase();

  const evidence = {
    ...plan,
    node: namehash,
    currentContenthash,
    alreadyCurrent,
    action: alreadyCurrent ? "skip-already-current" : (args.execute ? "send-setContenthash" : "dry-run-only"),
  };

  if (alreadyCurrent || !args.execute) {
    console.log(JSON.stringify(evidence, null, 2));
    return;
  }

  const sendOutput = runCast(castBin, [
    "send",
    env.ENS_RESOLVER_ADDRESS,
    "setContenthash(bytes32,bytes)",
    namehash,
    plan.contenthash,
    "--rpc-url",
    env.ETH_RPC_URL,
    "--private-key",
    validation.normalizedPrivateKey,
  ]);

  console.log(JSON.stringify({
    ...evidence,
    transactionSubmitted: true,
    castOutput: sendOutput,
  }, null, 2));
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
