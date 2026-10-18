#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { createEnsContenthash, ENS_NAME } from './lib/ens-release.mjs';

export function main(argv = process.argv.slice(2), env = process.env) {
  if (argv.length > 1) throw new Error();
  return { ensName: ENS_NAME, ...createEnsContenthash(argv[0] || env.CRYPTO_DIRECTORY_IPFS_CID || ''), transactionSubmitted: false, approvalRequired: 'Use ens:set-contenthash -- --prepare, then the existing ENS wallet, Safe or TLD approval flow.' };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(main(), null, 2)); }
  catch { console.error(JSON.stringify({ error: 'Expected one valid IPFS root CID; no transaction was submitted' })); process.exitCode = 1; }
}
