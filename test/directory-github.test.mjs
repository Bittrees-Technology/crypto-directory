import test from 'node:test';import assert from 'node:assert/strict';import {generateKeyPairSync} from 'node:crypto';
import {GitHubStore} from '../lib/directory/github.mjs';
import {signedState,frontMatter} from '../lib/directory/model.mjs';
const privateKey=generateKeyPairSync('rsa',{modulusLength:2048}).privateKey.export({format:'pem',type:'pkcs8'});
const env={DIRECTORY_GITHUB_APP_ID:'123',DIRECTORY_GITHUB_INSTALLATION_ID:'456',DIRECTORY_GITHUB_APP_PRIVATE_KEY:privateKey,DIRECTORY_JOURNAL_SECRET:'separate-private-journal-key-'.repeat(2)};
function storeWith(handler){const calls=[];const store=new GitHubStore({env,fetcher:async(url,options)=>{calls.push({url,method:options.method,body:options.body?JSON.parse(options.body):null});return handler(url,options,calls);}});store.token={value:'ephemeral-test-token',expires:Date.now()+300000};store.authorize=async()=>{};return {store,calls};}
test('GitHub App token is restricted to this repository and content/PR writes only',async()=>{
  const store=new GitHubStore({env,fetcher:async(url,options)=>{assert.equal(url,'https://api.github.com/app/installations/456/access_tokens');assert.deepEqual(JSON.parse(options.body),{repositories:['crypto-directory'],permissions:{contents:'write',pull_requests:'write'}});assert.match(options.headers.Authorization,/^Bearer ey/);return Response.json({token:'short-lived-token',expires_at:new Date(Date.now()+3600000).toISOString()});}});
  assert.equal(await store.credential(),'short-lived-token');
});
test('storage initialization cannot silently replace a missing existing journal',async()=>{
  const absent=storeWith(()=>Response.json({}, {status:404}));assert.equal((await absent.store.load()).sha,null);assert.equal(absent.calls.length,2);
  const missing=storeWith(url=>url.includes('/contents/')?Response.json({},{status:404}):Response.json({object:{sha:'a'.repeat(40)}}));await assert.rejects(()=>missing.store.load(),e=>e.status===503);
});
test('journal compare-and-swap uses the prior blob and never retries a conflict',async()=>{
  const f=storeWith((_u,options)=>{const request=JSON.parse(options.body);assert.equal(request.sha,'a'.repeat(40));assert.equal(request.branch,'directory-intake');const content=JSON.parse(Buffer.from(request.content,'base64').toString());assert.equal(content.value.revision,2);assert.equal(content.signature,signedState(content.value,env.DIRECTORY_JOURNAL_SECRET).signature);return Response.json({},{status:409});});
  await assert.rejects(()=>f.store.save({sha:'a'.repeat(40)},{version:1,revision:2,submissions:[],edits:[]}),e=>e.status===409);assert.equal(f.calls.length,1);
});
test('each source write requires a current authorization recheck',async()=>{
  const f=storeWith(()=>{throw Error('Network must not be called');});f.store.authorize=async()=>{throw Object.assign(Error('Revoked'),{status:403});};
  await assert.rejects(()=>f.store.request('/repos/Bittrees-Technology/crypto-directory/git/refs','POST',{}),e=>e.status===403);assert.equal(f.calls.length,0);
});
test('proposal reconciliation verifies repository, exact sole file, contents and open/merged status',async()=>{
  const operation='12345678-1234-4123-8123-123456789abc',value={name:'Test Project',verification_status:'verified'},raw=frontMatter(value),head='directory/change-'+operation;
  for(const problem of [null,'file','content','repository','closed']){
    const f=storeWith(url=>{
      if(url.includes('/pulls?'))return Response.json([{number:23,state:problem==='closed'?'closed':'open',merged_at:null,html_url:'https://github.com/Bittrees-Technology/crypto-directory/pull/23',base:{ref:'main'},head:{ref:head,sha:'b'.repeat(40),repo:{full_name:problem==='repository'?'attacker/crypto-directory':'Bittrees-Technology/crypto-directory'}}}]);
      if(url.includes('/files?'))return Response.json([{filename:problem==='file'?'scripts/build.mjs':'content/projects/test.md',status:'added'}]);
      return Response.json({type:'file',sha:'c'.repeat(40),size:raw.length,encoding:'base64',content:Buffer.from(problem==='content'?'altered':raw).toString('base64')});
    });
    if(problem)await assert.rejects(()=>f.store.reconcile(operation,'test.md',value),e=>e.status===409);else assert.equal((await f.store.reconcile(operation,'test.md',value)).number,23);
    assert(f.calls.every(c=>c.method==='GET'));
  }
});
test('provider failures do not disclose credentials or untrusted diagnostics',async()=>{
  const f=storeWith(()=>new Response('SECRET=ephemeral-test-token private-key-value',{status:500}));await assert.rejects(()=>f.store.main(),error=>!error.message.includes('token')&&!error.message.includes('private-key'));
});
