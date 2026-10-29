import test from 'node:test';
import assert from 'node:assert/strict';
import {createEnsNameResolver} from '../lib/directory/ens.mjs';
const address='0x'+'1'.repeat(40);
test('display lookup uses the forward-verifying ENS Universal Resolver with ETH coin type, coalesces and bounds cache lifetime',async()=>{
  let calls=0,clock=1;const resolve=createEnsNameResolver({now:()=>clock,client:{async readContract(input){calls++;assert.equal(input.address.toLowerCase(),'0xeeeeeeee14d718c2b47d9923deab1335e144eeee');assert.equal(input.functionName,'reverse');assert.deepEqual(input.args,[address,60n]);assert.deepEqual(input.abi[0].inputs.map(p=>p.type),['bytes','uint256']);return ['fixture.eth',address,address];}}});
  assert.deepEqual(await Promise.all([resolve(address),resolve(address)]),['fixture.eth','fixture.eth']);assert.equal(calls,1);
  assert.equal(await resolve('person@example.org'),null);assert.equal(calls,1);clock+=600001;assert.equal(await resolve(address),'fixture.eth');assert.equal(calls,2);
});
test('missing, mismatched, malformed, unnormalized and failed ENS lookups fall back without blocking sign-in',async()=>{
  for(const candidate of [null,'','NAME.eth','unsafe\nname.eth','<script>.eth','a'.repeat(260)+'.eth']){
    const resolve=createEnsNameResolver({client:{async readContract(){return [candidate,address,address];}}});assert.equal(await resolve(address),null);
  }
  const resolve=createEnsNameResolver({client:{async readContract(){throw Error('ReverseAddressMismatch or unavailable RPC');}}});assert.equal(await resolve(address),null);
});
