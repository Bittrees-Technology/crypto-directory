import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';
import { base58btc } from 'multiformats/bases/base58';

export const ENS_NAME = 'cryptodirectory.eth';
export const ENS_NODE = '0xdf0f31c3e38bad2ca82e5eb0d973e120ccc868e76730cc4e3b4459831bfc1578';
export const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
export const CHAIN_ID = 1;
export class EnsReleaseError extends Error {}

function parseCid(input) {
  if (typeof input !== 'string' || input.length > 1024) throw new EnsReleaseError('Invalid IPFS CID');
  let value = input.trim();
  if (value.startsWith('ipfs://')) value = value.slice(7);
  else if (value.startsWith('/ipfs/')) value = value.slice(6);
  else if (/^https?:\/\//.test(value)) {
    let url;
    try { url = new URL(value); } catch { throw new EnsReleaseError('Invalid IPFS URL'); }
    if (url.username || url.password || url.search || url.hash || !/^\/ipfs\/[^/]+\/?$/.test(url.pathname)) throw new EnsReleaseError('Expected an IPFS root CID without a file path, credentials, query or fragment');
    value = url.pathname.slice(6);
  }
  value = value.replace(/\/$/, '');
  try {
    const cid = CID.parse(value, base32.decoder.or(base58btc.decoder));
    if (!cid.multihash.digest.length) throw new Error();
    return cid.toV1();
  } catch { throw new EnsReleaseError('Invalid IPFS CID'); }
}

export function normalizeIpfsCid(input) { return parseCid(input).toString(base32); }
export function cidToBytes(input) { return parseCid(input).bytes; }
export function createEnsContenthash(input) {
  const cid = normalizeIpfsCid(input);
  // ERC-1577 requires a CIDv1 payload even when the input used CIDv0.
  return { cid, uri: 'ipfs://' + cid, contenthash: '0xe301' + Buffer.from(cidToBytes(cid)).toString('hex') };
}

export function parseArgs(argv = process.argv.slice(2), env = process.env) {
  const result = { cid: env.CRYPTO_DIRECTORY_IPFS_CID || '', ensName: ENS_NAME, prepare: false, execute: false };
  let mode, cidSet = false, nameSet = false;
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--execute') throw new EnsReleaseError('Direct signing is unsupported; use --prepare and the existing wallet or Safe approval flow');
    if (arg === '--prepare' || arg === '--dry-run') {
      if (mode) throw new EnsReleaseError('Choose exactly one invocation mode');
      mode = arg;
      result.prepare = arg === '--prepare';
    } else if (arg === '--cid' || arg === '--name') {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new EnsReleaseError('Missing option value');
      if (arg === '--cid') {
        if (cidSet) throw new EnsReleaseError('Duplicate CID argument');
        result.cid = value; cidSet = true;
      } else {
        if (nameSet) throw new EnsReleaseError('Duplicate ENS name argument');
        result.ensName = value; nameSet = true;
      }
    } else if (!arg.startsWith('-') && !cidSet) { result.cid = arg; cidSet = true; }
    else throw new EnsReleaseError('Unknown or duplicate argument');
  }
  if (result.ensName !== ENS_NAME || (env.CRYPTO_DIRECTORY_ENS_NAME && env.CRYPTO_DIRECTORY_ENS_NAME !== ENS_NAME)) throw new EnsReleaseError('This release tool only supports cryptodirectory.eth');
  return result;
}

export function isAddress(value) { return /^0x[0-9a-fA-F]{40}$/.test(value || '') && !/^0x0{40}$/i.test(value); }
export function validateSetContenthashEnv(args, env = process.env) {
  const missing = [], invalid = [];
  if (!args.cid) missing.push('CRYPTO_DIRECTORY_IPFS_CID or --cid');
  if (!env.ETH_RPC_URL) missing.push('ETH_RPC_URL');
  else {
    try {
      const url = new URL(env.ETH_RPC_URL);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch { invalid.push('ETH_RPC_URL must be an http(s) URL'); }
  }
  if (env.ENS_RESOLVER_ADDRESS && !isAddress(env.ENS_RESOLVER_ADDRESS)) invalid.push('ENS_RESOLVER_ADDRESS must be a nonzero 20-byte hex address');
  return { ok: !missing.length && !invalid.length, missing, invalid };
}

export function encodeSetContenthash(node, contenthash) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(node) || !/^0x(?:[0-9a-fA-F]{2}){1,512}$/.test(contenthash)) throw new EnsReleaseError('Invalid transaction data');
  const value = contenthash.slice(2);
  const uint = n => n.toString(16).padStart(64, '0');
  // setContenthash(bytes32,bytes): selector, node, dynamic offset, length, bytes.
  return '0x304e6ade' + node.slice(2) + uint(64) + uint(value.length / 2) + value.padEnd(Math.ceil(value.length / 64) * 64, '0');
}
