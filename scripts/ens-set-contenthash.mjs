#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildEnsPublicationGate, readReleases } from './ens-publication-gate.mjs';
import { CHAIN_ID, ENS_NODE, ENS_REGISTRY, EnsReleaseError, createEnsContenthash, encodeSetContenthash, isAddress, parseArgs, validateSetContenthashEnv } from './lib/ens-release.mjs';

export { parseArgs, validateSetContenthashEnv } from './lib/ens-release.mjs';

export function buildSetContenthashPlan(args, env = process.env) {
  return { ensName: args.ensName, ...createEnsContenthash(args.cid), chainId: CHAIN_ID, mode: args.prepare ? 'prepare' : 'dry-run', execute: false, transactionSubmitted: false, validation: validateSetContenthashEnv(args, env) };
}

export function runCast(argv, env = process.env) {
  if (!['chain-id', 'call'].includes(argv[0])) throw new EnsReleaseError('Unsupported read operation');
  // RPC credentials stay out of argv; signer variables and unrelated secrets are never inherited.
  const result = spawnSync(env.CAST_BIN || 'cast', argv, { encoding: 'utf8', shell: false, timeout: 20000, maxBuffer: 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], env: { PATH: env.PATH || process.env.PATH || '', ETH_RPC_URL: env.ETH_RPC_URL } });
  // Never expose raw tool diagnostics: they may include RPC credentials or inherited input.
  if (result.error || result.signal || result.status !== 0) throw new EnsReleaseError('ENS read operation failed; check the local RPC and Foundry configuration');
  return String(result.stdout || '').trim();
}

export function main(argv = process.argv.slice(2), env = process.env, runtime = {}) {
  const args = parseArgs(argv, env);
  const plan = buildSetContenthashPlan(args, env);
  const gate = buildEnsPublicationGate(args, env, (runtime.readReleases || readReleases)());
  if (gate.blockers.length) throw new EnsReleaseError('ENS publication gate blocked: ' + gate.blockers.join('; '));
  const read = values => (runtime.runCast || runCast)(values, env);
  if (read(['chain-id']) !== String(CHAIN_ID)) throw new EnsReleaseError('Expected Ethereum mainnet (chain ID 1)');
  const resolver = read(['call', ENS_REGISTRY, 'resolver(bytes32)(address)', ENS_NODE]);
  if (!isAddress(resolver)) throw new EnsReleaseError('ENS registry did not return a valid resolver');
  if (env.ENS_RESOLVER_ADDRESS && resolver.toLowerCase() !== env.ENS_RESOLVER_ADDRESS.toLowerCase()) throw new EnsReleaseError('Current ENS resolver differs from ENS_RESOLVER_ADDRESS');
  if (read(['call', resolver, 'supportsInterface(bytes4)(bool)', '0xbc1c58d1']) !== 'true') throw new EnsReleaseError('Resolver does not support ENS contenthash');
  const currentContenthash = read(['call', resolver, 'contenthash(bytes32)(bytes)', ENS_NODE]);
  if (!/^0x(?:[a-fA-F0-9]{2})*$/.test(currentContenthash) || currentContenthash.length > 2048) throw new EnsReleaseError('Resolver returned malformed contenthash data');
  const alreadyCurrent = currentContenthash.toLowerCase() === plan.contenthash.toLowerCase();
  const evidence = { ...plan, gate, node: ENS_NODE, resolverAddress: resolver, currentContenthash, alreadyCurrent, action: alreadyCurrent ? 'skip-already-current' : args.prepare ? 'unsigned-transaction-prepared' : 'dry-run-only' };
  if (args.prepare && !alreadyCurrent) {
    // IPNS is the live weekly publisher. Replacing it is a separate, approved migration.
    if (currentContenthash.toLowerCase().startsWith('0xe501')) throw new EnsReleaseError('Active ENS contenthash uses IPNS; use the existing TLD/Safe migration flow instead of replacing it with an IPFS release');
    evidence.transaction = { chainId: CHAIN_ID, to: resolver, value: '0', data: encodeSetContenthash(ENS_NODE, plan.contenthash) };
    evidence.approvalRequired = 'Unsigned proposal only. Verify current ENS authority, release availability and simulation through the existing wallet, Safe and TLD approval flow.';
  }
  return evidence;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(main(), null, 2)); }
  catch (error) { console.error(JSON.stringify({ error: error instanceof EnsReleaseError ? error.message : 'ENS operation failed', transactionSubmitted: false })); process.exitCode = 1; }
}
