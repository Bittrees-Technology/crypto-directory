#!/usr/bin/env node
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createEnsContenthash, normalizeIpfsCid, parseArgs, validateSetContenthashEnv } from './lib/ens-release.mjs';

export const releasesUrl = new URL('../releases.md', import.meta.url);
export function readReleases() { return fs.readFileSync(releasesUrl, 'utf8'); }

export function releaseRecordIncludesCid(cid, releasesText) {
  const expected = normalizeIpfsCid(cid);
  // Match an entire CID= field on a dated release entry, never a substring or prose.
  for (const line of releasesText.split(/\r?\n/)) {
    const match = /^- \d{4}-\d{2}-\d{2}: CID=([^\s|]+)(?=\s*\||\s*$)/.exec(line);
    if (match) {
      try { if (normalizeIpfsCid(match[1]) === expected) return true; } catch { /* Invalid entries cannot authorize a packet. */ }
    }
  }
  return false;
}

export function buildEnsPublicationGate(args, env = process.env, releasesText = '') {
  const packet = createEnsContenthash(args.cid);
  const validation = validateSetContenthashEnv(args, env);
  const releaseRecorded = releaseRecordIncludesCid(packet.cid, releasesText);
  const blockers = [...validation.missing, ...validation.invalid];
  if (!releaseRecorded) blockers.push('Release CID is not recorded as an exact dated entry in releases.md');
  return { ensName: args.ensName, ...packet, releaseRecorded, dryRunReady: !blockers.length, prepareReady: !blockers.length, executeReady: false, blockers, approvalRequired: 'Existing ENS wallet, Safe and TLD authorization still applies. This gate grants no signing authority.' };
}

export function main(argv = process.argv.slice(2), env = process.env) {
  return buildEnsPublicationGate(parseArgs(argv, env), env, readReleases());
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { const gate = main(); console.log(JSON.stringify(gate, null, 2)); if (gate.blockers.length) process.exitCode = 1; }
  catch { console.error(JSON.stringify({ error: 'ENS publication gate failed; no transaction was submitted' })); process.exitCode = 1; }
}
