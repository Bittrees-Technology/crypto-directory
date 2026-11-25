import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {unlink} from 'node:fs/promises';
import path from 'node:path';
import {RuntimeStore,encryptJournal,decryptJournal,RUNTIME_ORIGIN,publicationReceipt} from '../lib/directory/runtime-store.mjs';
import {createDirectoryStore} from '../lib/directory/store.mjs';
import {createDirectoryService} from '../lib/directory/service.mjs';
import {ORIGIN,hash,permissions,frontMatter,editableFields} from '../lib/directory/model.mjs';
import {createPublicCatalogue} from '../lib/directory/public-catalogue.mjs';
import {checkedCatalogue,fetchCatalogue} from '../web/runtime-catalogue.mjs';

const env={DIRECTORY_DATA_BACKEND:'runtime-v1',DIRECTORY_RUNTIME_STORE_ID:'e38a1a2e-3602-4e3b-875b-ac80ce210c90',DIRECTORY_RUNTIME_SERVICE_KEY:'11'.repeat(32),DIRECTORY_RUNTIME_ENCRYPTION_KEY:'22'.repeat(32),DIRECTORY_JOURNAL_SECRET:'runtime-journal-fixture-'.repeat(3),BITTREES_ADMIN_SSO_CLIENT_SECRET:'runtime-sso-fixture-'.repeat(3)};
const base={name:'Existing Fixture',lead_category:'Infrastructure',tags:['Infrastructure'],ecosystem:['Ethereum'],description:'A real transactional test with entirely synthetic listing information.',primary_url:'https://fixture.example/',product_url:'n/a',founded:'2020',hq:'Metaverse',token:'n/a',twitter:'n/a',verification_status:'needs_update'};
const sha1=raw=>createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0'+raw).digest('hex');
async function fixture(t){
  const database=path.resolve('reports/runtime-fixture-'+randomUUID()+'.sqlite'),raw=frontMatter(base)+'\nPreserve the original body.\n';
  const seed=[{id:'fixture.md',raw,sha:sha1(raw)}],journal={version:1,revision:0,submissions:[],edits:[],editRequests:[]};
  const python=spawn('python3',['-u','-c',`import sys,json\nsys.path.insert(0,'runtime')\nfrom catalogue import Catalogue\nfrom serve import server\np=json.load(sys.stdin)\nc=Catalogue(p['database'],p['storeId'],p['key'])\nc.bootstrap(p['seed'],p['digest'],'a'*40,p['envelope'])\nwith c.connect() as db: db.execute("UPDATE settings SET value='true' WHERE key='writer_enabled'")\ns=server(c,0)\nprint(s.server_address[1],flush=True)\ns.serve_forever()`],{env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'},stdio:['pipe','pipe','pipe']});
  let errors='';python.stderr.on('data',x=>{errors+=x;});
  t.after(async()=>{python.kill('SIGTERM');await new Promise(resolve=>{if(python.exitCode!==null)resolve();else python.once('exit',resolve);});for(const suffix of ['','-wal','-shm'])await unlink(database+suffix).catch(()=>{});});
  python.stdin.end(JSON.stringify({database,storeId:env.DIRECTORY_RUNTIME_STORE_ID,key:env.DIRECTORY_RUNTIME_SERVICE_KEY,seed,digest:hash(JSON.stringify(seed)),envelope:encryptJournal(journal,env)}));
  const port=await new Promise((resolve,reject)=>{python.stdout.once('data',x=>resolve(Number(String(x).trim())));python.once('exit',()=>reject(Error(errors||'Fixture stopped')));});
  assert(Number.isInteger(port));
  const calls=[];const fetcher=(url,options)=>{calls.push(url);assert(url.startsWith(RUNTIME_ORIGIN+'/'),'Runtime data operations must never call GitHub');return fetch('http://127.0.0.1:'+port+new URL(url).pathname,options);};
  const state={identity:'submitter',roles:[]};
  const actor=()=>{const now=Date.now(),wallet='0x'+'1'.repeat(40),decision={authoritative:true,enrolled:true,audience:'cd.bittrees.org',checkedAt:now,expiresAt:now+4900,actions:state.roles,request:{project:'crypto-directory',source:'cd.bittrees.org',authenticatedWallet:wallet,subjects:[wallet]}};return {identity:state.identity,subject:hash(state.identity),personSubject:hash('person:'+state.identity),authorityDecision:decision,authorityReference:hash(JSON.stringify(decision)),permissions:permissions(decision)};};
  const storeFactory=()=>new RuntimeStore({env,fetcher});
  const service=createDirectoryService({env,storeFactory,actorAuthenticator:actor,writeAuthorizer:async()=>{},resolveName:async()=>null});
  const call=async(route,body)=>{const response=await service(new Request(ORIGIN+'/api/directory/'+route,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})}));return {status:response.status,...await response.json()};};
  return {state,call,storeFactory,fetcher,calls};
}
test('encrypted journal round trip rejects tampering, wrong keys and plaintext',()=>{
  const value={version:1,revision:0,submissions:[],edits:[],privateFixture:'not-for-the-public-feed'},encrypted=encryptJournal(value,env);
  assert(!encrypted.includes(value.privateFixture));assert.deepEqual(decryptJournal(encrypted,env),value);
  assert.throws(()=>decryptJournal(encrypted,{...env,DIRECTORY_RUNTIME_ENCRYPTION_KEY:'33'.repeat(32)}));
  assert.throws(()=>decryptJournal(JSON.stringify(value),env));const tampered=JSON.parse(encrypted);tampered.tag='AA'.repeat(16);assert.throws(()=>decryptJournal(JSON.stringify(tampered),env));
});
test('migration fence never silently falls back to GitHub',()=>{
  const store=createDirectoryStore({env:{DIRECTORY_LEGACY_WRITES_DISABLED:'true'}});assert.equal(store.backend,'runtime-v1');assert.equal(store.configured(),false);
});
test('signed-in submissions, reviewer publication and lost response reconciliation use no GitHub',async t=>{
  const f=await fixture(t),id=randomUUID();const input={...editableFields(base),name:'New Runtime Fixture',primary_url:'https://new-fixture.example/'};
  assert.equal((await f.call('submit',{operationId:id,entry:input})).status,'pending');
  assert.equal((await f.storeFactory().workspaceSnapshot('/data/projects.json')).data.length,1);
  assert.equal((await f.call('review',{id,revision:1,decision:'accept',reason:'The complete official listing has been checked.',operationId:randomUUID()})).status,403);
  f.state.roles=['role.reviewer'];
  assert.equal((await f.call('review',{id,revision:1,decision:'accept',reason:'The complete official listing has been checked.',operationId:randomUUID()})).status,403,'Reviewer cannot approve their own submission');
  f.state.identity='reviewer';const operationId=randomUUID(),review={id,revision:1,decision:'accept',reason:'The complete official listing has been checked.',operationId};
  const applied=await f.call('review',review);assert.equal(applied.status,'published');assert.equal(applied.publication.catalogueRevision,1);
  const again=await f.call('review',review);assert.equal(again.status,'published');assert.equal(again.publication.operationId,operationId);
  const rows=await f.storeFactory().workspaceSnapshot('/data/projects.json');assert.equal(rows.data.length,2);assert.equal(rows.catalogueRevision,1);
  assert.equal((await f.call('review',{...review,reason:'A materially different review should be held.'})).status,409);
  assert(f.calls.every(url=>url.startsWith(RUNTIME_ORIGIN)));
});
test('Editor only queues changes; partial corrections stay held, explicit verification publishes, removal is a tombstone',async t=>{
  const f=await fixture(t);f.state.roles=['role.editor'];f.state.identity='editor';
  let existing=await f.storeFactory().listing('fixture.md');const editId=randomUUID();
  assert.equal((await f.call('edit',{id:'fixture.md',sha:existing.sha,entry:{...editableFields(base),description:'A corrected description with an official supporting source.'},reason:'Correct the description from the official project site.',operationId:editId})).status,'pending');
  assert.equal((await f.storeFactory().listing('fixture.md')).sha,existing.sha);
  f.state.roles=['role.reviewer'];f.state.identity='reviewer';
  const review={id:editId,revision:1,decision:'accept',reason:'The description is supported; the product still needs checking.',operationId:randomUUID()};
  const firstReview=await f.call('review-edit-request',review);assert.equal(firstReview.status,'published',JSON.stringify(firstReview));
  let snapshot=await f.storeFactory().workspaceSnapshot('/data/projects.json');assert.equal(snapshot.data[0].verification_status,'needs_update');
  existing=await f.storeFactory().listing('fixture.md');assert(existing.raw.endsWith('\nPreserve the original body.\n'));
  f.state.identity='submitter';f.state.roles=[];const nextId=randomUUID();
  assert.equal((await f.call('request-edit',{id:'fixture.md',sha:existing.sha,kind:'edit',entry:{...editableFields(snapshot.data[0]),product_url:'https://fixture.example/app'},changes:'The official project has a working application at this URL.',sources:'https://fixture.example/',operationId:nextId})).status,'pending');
  f.state.identity='reviewer';f.state.roles=['role.reviewer'];assert.equal((await f.call('review-edit-request',{id:nextId,revision:1,decision:'accept',reason:'The entire listing and both official links were verified.',verifyListing:true,operationId:randomUUID()})).status,'published');
  snapshot=await f.storeFactory().workspaceSnapshot('/data/projects.json');assert.equal(snapshot.data[0].verification_status,'verified');
  existing=await f.storeFactory().listing('fixture.md');const removalId=randomUUID();f.state.identity='submitter';f.state.roles=[];
  await f.call('request-edit',{id:'fixture.md',sha:existing.sha,kind:'removal',removalReasons:['shutdown'],changes:'The official project has announced its permanent shutdown.',sources:'https://fixture.example/shutdown',operationId:removalId});
  f.state.identity='reviewer';f.state.roles=['role.reviewer'];const removed=await f.call('review-edit-request',{id:removalId,revision:1,decision:'accept',reason:'The shutdown notice confirms the product is retired.',operationId:randomUUID()});assert.equal(removed.status,'published');
  snapshot=await f.storeFactory().workspaceSnapshot('/data/projects.json');assert.equal(snapshot.data.length,1);assert.equal(snapshot.data[0].verification_status,'rejected');
});
test('Admin self-review is recorded and concurrent/native permissions still apply',async t=>{
  const f=await fixture(t),id=randomUUID();await f.call('request-edit',{id:'fixture.md',sha:(await f.storeFactory().listing('fixture.md')).sha,kind:'removal',removalReasons:['shutdown'],changes:'Official closure announcement confirms this listing is retired.',sources:'https://fixture.example/shutdown',operationId:id});
  f.state.roles=['project.admin'];const result=await f.call('review-edit-request',{id,revision:1,decision:'accept',reason:'Reviewed the closure announcement and confirmed removal.',operationId:randomUUID()});assert.equal(result.status,'published');
  const journal=await f.storeFactory().load();assert.equal(journal.value.editRequests[0].review.selfReviewOverride.policy,'directory-admin-self-review-v1');
  const publicHandler=createPublicCatalogue({env,fetcher:f.fetcher});const response=await publicHandler(new Request(ORIGIN+'/api/catalogue'));
  assert.equal(response.status,200);const text=await response.text();assert(!text.includes('submitter'));assert(!text.includes('closure announcement'));assert(!text.includes('selfReviewOverride'));
});
test('public API checks one version, browser checks digest and refuses executable links',async t=>{
  const f=await fixture(t),handler=createPublicCatalogue({env,fetcher:f.fetcher});
  const response=await handler(new Request(ORIGIN+'/api/catalogue'));assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),'*');assert(response.headers.get('access-control-expose-headers').includes('ETag'));
  const snapshot=await fetchCatalogue(async()=>response.clone());assert.equal(snapshot.revision,0);assert.equal(snapshot.rows.length,1);
  assert.throws(()=>checkedCatalogue([{...snapshot.rows[0],primary_url:'javascript:alert(1)'}]));
  assert.throws(()=>checkedCatalogue([{...snapshot.rows[0],token_url:'https://user:secret@example.org/'}]));
  assert.equal((await handler(new Request(ORIGIN+'/api/catalogue?arbitrary=1'))).status,404);
  assert.equal((await handler(new Request(ORIGIN+'/api/catalogue',{headers:{'if-none-match':response.headers.get('etag')}}))).status,304);
  const corrupt=createPublicCatalogue({env,fetcher:async url=>new URL(url).pathname==='/catalogue'?Response.json([]):f.fetcher(url)});assert.equal((await corrupt(new Request(ORIGIN+'/api/catalogue'))).status,503);
});

test('late source response observes the shorter original proof deadline and rejects mismatched receipts',async()=>{
  let now=100;const store=new RuntimeStore({env,now:()=>now,fetcher:async()=>{now=1200;return Response.json({storeId:env.DIRECTORY_RUNTIME_STORE_ID});}});
  await assert.rejects(()=>store.rpc('catalogue.publish',{}, {actor:hash('fixture'),capability:'canReview',decision:{expiresAt:5000},deadline:1100}),/after permission expiry/);
  const receipt={storeId:env.DIRECTORY_RUNTIME_STORE_ID,operationId:randomUUID(),projectId:'fixture.md',catalogueRevision:1,appliedAt:1000,contentHash:'a'.repeat(64),listingSha:'b'.repeat(40)};
  assert.deepEqual(publicationReceipt(receipt,env.DIRECTORY_RUNTIME_STORE_ID),receipt);
  assert.throws(()=>publicationReceipt(receipt,randomUUID()),/does not match/);
  assert.throws(()=>publicationReceipt(receipt,env.DIRECTORY_RUNTIME_STORE_ID,{contentHash:'c'.repeat(64)}),/does not match/);
});

test('Vercel rewrite metadata reaches only the fixed public catalogue manifest',async t=>{
  const f=await fixture(t),handler=createPublicCatalogue({env,fetcher:f.fetcher});
  for(const pathname of ['/api/catalogue/manifest','/api/catalogue']){
    const result=await handler(new Request(ORIGIN+pathname+'?path=manifest'));
    assert.equal(result.status,200,'Vercel appends an unused wildcard as a query parameter');
    const data=await result.json();assert.equal(data.schemaVersion,1);assert.equal(data.storeId,env.DIRECTORY_RUNTIME_STORE_ID);assert.equal(data.revision,0);
  }
  for(const query of ['path=elsewhere','path=manifest&extra=1','path=manifest&path=manifest','path=https://evil.example/manifest'])assert.equal((await handler(new Request(ORIGIN+'/api/catalogue/manifest?'+query))).status,404);
});
test('Vercel weak ETags retain mandatory body digest and store checks',async t=>{
  const f=await fixture(t),handler=createPublicCatalogue({env,fetcher:f.fetcher}),response=await handler(new Request(ORIGIN+'/api/catalogue'));
  const headers=new Headers(response.headers);headers.set('etag','W/'+headers.get('etag'));const raw=await response.text();
  const snapshot=await fetchCatalogue(async()=>new Response(raw,{headers}),env.DIRECTORY_RUNTIME_STORE_ID);assert.equal(snapshot.rows.length,1);assert.equal(snapshot.revision,0);
  headers.set('etag','W/"'+'0'.repeat(64)+'"');await assert.rejects(()=>fetchCatalogue(async()=>new Response(raw,{headers})),/integrity/);
});
