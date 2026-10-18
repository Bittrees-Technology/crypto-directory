import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const cid = 'QmZGqVE6KSbGqq9r4GwtHdSSZUxmu7ZL75kaYUJigp1oZ7';
const resolver = '0x1234567890123456789012345678901234567890';

function withCast(mode, callback) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ens-cli-'));
  try {
    const log = path.join(temp, 'calls.jsonl');
    const binary = path.join(temp, 'cast');
    const source = '#!' + process.execPath + '\n' +
      'const fs=require("node:fs");const a=process.argv.slice(2);' +
      'fs.appendFileSync(' + JSON.stringify(log) + ',JSON.stringify({argv:a,signerPresent:"ENS_OWNER_PRIVATE_KEY" in process.env,unrelatedPresent:"UNRELATED_SECRET" in process.env,rpcConfigured:!!process.env.ETH_RPC_URL})+"\\n");' +
      (mode === 'fail' ? 'console.error("rpc-secret signer-secret");process.exit(7);' :
      'if(a[0]==="chain-id")console.log("1");else if(a[2]==="resolver(bytes32)(address)")console.log(' + JSON.stringify(resolver) + ');else if(a[2]==="supportsInterface(bytes4)(bool)")console.log("true");else if(a[2]==="contenthash(bytes32)(bytes)")console.log("0x");else process.exit(9);');
    fs.writeFileSync(binary, source, { mode: 0o700 });
    callback({ binary, calls: () => fs.existsSync(log) ? fs.readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse) : [] });
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

function invoke(argv, binary) {
  return spawnSync(process.execPath, ['scripts/ens-set-contenthash.mjs', ...argv], {
    cwd: root, encoding: 'utf8', timeout: 10000,
    env: { PATH: process.env.PATH, CAST_BIN: binary, ETH_RPC_URL: 'https://rpc.example/rpc-secret', ENS_OWNER_PRIVATE_KEY: 'signer-secret', ENS_SET_CONTENTHASH_EXECUTE: 'true', UNRELATED_SECRET: 'unrelated-secret' }
  });
}

test('fresh-process CLI ignores execute environment and isolates child credentials and argv', () => withCast('ok', stub => {
  const result = invoke(['--cid', cid], stub.binary);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).action, 'dry-run-only');
  assert.equal(JSON.parse(result.stdout).transaction, undefined);
  assert.equal(stub.calls().length, 4);
  for (const call of stub.calls()) {
    assert.equal(call.signerPresent, false);
    assert.equal(call.unrelatedPresent, false);
    assert.equal(call.rpcConfigured, true);
    assert.equal(call.argv.join(' ').includes('rpc-secret'), false);
    assert.equal(call.argv[0] === 'call' || call.argv[0] === 'chain-id', true);
  }
  assert.equal((result.stdout + result.stderr).includes('signer-secret'), false);
  assert.equal((result.stdout + result.stderr).includes('rpc-secret'), false);
}));

test('CLI rejects execution before spawning a child', () => withCast('ok', stub => {
  const result = invoke(['--execute', '--cid', cid], stub.binary);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Direct signing is unsupported/);
  assert.deepEqual(stub.calls(), []);
}));

test('CLI suppresses secret-bearing child diagnostics and exits nonzero', () => withCast('fail', stub => {
  const result = invoke(['--prepare', '--cid', cid], stub.binary);
  assert.equal(result.status, 1);
  assert.equal(stub.calls().length, 1);
  const output = result.stdout + result.stderr;
  for (const secret of ['rpc-secret', 'signer-secret', 'unrelated-secret']) assert.equal(output.includes(secret), false);
  assert.equal(JSON.parse(result.stderr).transactionSubmitted, false);
}));

test('CLI cannot bypass ledger gate to prepare an unrecorded release', () => withCast('ok', stub => {
  const result = invoke(['--prepare', '--cid', 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4'], stub.binary);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /publication gate blocked/);
  assert.deepEqual(stub.calls(), []);
}));
