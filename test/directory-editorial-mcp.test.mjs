import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {fixture,listing,newEntry} from './editorial-fixture.mjs';
import {createEditorialMcp} from '../lib/directory/editorial-mcp.mjs';
import {EDITORIAL_AUDIENCE,EDITORIAL_TOOLS,PAGE_COVERAGE} from '../lib/directory/editorial-contract.mjs';
import {connectionBinding,digest} from '../lib/directory/mcp-proof.mjs';
import {subject,entry} from '../lib/directory/model.mjs';
import {auditOperation} from '../lib/directory/mcp-ledger.mjs';

const reason='Independently checked current official project and product evidence.';
function seedSubmission(f,submitter='another-source-subject'){
  const id=randomUUID();f.state.value.submissions.push({id,submitter,submitterOwner:'e'.repeat(64),entry:entry(newEntry),revision:1,status:'pending',history:[]});return id;
}
async function prepare(f){return f.call('review_submission',{id:seedSubmission(f),revision:1,decision:'accept',reason});}
async function step(f,receipt,changes={}){
  return f.call('execute_step',{operationId:receipt.operationId,step:receipt.nextStep,revision:receipt.revision,expectedHeadSha:receipt.expectedHeadSha,expectedDiffDigest:receipt.expectedDiffDigest,...changes});
}
test('editorial MCP stays disabled with no provider, actor, grant or credential invented',async()=>{
  const h=createEditorialMcp({env:{}}),r=await h(new Request(EDITORIAL_AUDIENCE,{method:'POST',headers:{'content-type':'application/json'},body:'{}'}));
  assert.equal(r.status,503);assert.match((await r.json()).error.message,/not activated/);
});
test('real signed source guard lists role-and-connection-scoped tools without exposing config',async t=>{
  const f=fixture(t),r=await f.request({jsonrpc:'2.0',id:1,method:'tools/list',params:{}});assert.equal(r.status,200);
  const tools=(await r.json()).result.tools;assert(tools.some(t=>t.name==='directory.auto_review'));assert(!tools.some(t=>t.name==='directory.propose_edit'));
  assert(tools.every(t=>t.inputSchema.additionalProperties===false));assert(!JSON.stringify(tools).includes('PublicKey'));assert(!JSON.stringify(tools).includes(f.connection.credentialId));
  assert.equal(f.state.journalWrites,0);assert.equal(f.state.businessWrites.length,0);
  assert(PAGE_COVERAGE.some(p=>p.page==='/process-status.html'));assert(PAGE_COVERAGE.some(p=>p.page==='/administration'));
});
test('ordinary signed-in source actor submits and requests edits without acquiring staff permission',async t=>{
  const f=fixture(t,[]),operationId=randomUUID();const r=await f.call('submit_project',{entry:newEntry,operationId});
  assert.equal(r.response.status,200);assert.equal(r.data.outcome.status,'pending');assert.equal(f.state.value.submissions.length,1);assert.equal(f.state.businessWrites.length,0);
  const change=await f.call('request_change',{id:'existing.md',sha:f.oldSha,kind:'edit',entry:{...listing,description:'Corrected official onchain project description.'},changes:'Official evidence supports this requested correction.',sources:'https://existing.example.org/news',operationId:randomUUID()});
  assert.equal(change.data.outcome.status,'pending');assert.equal(f.state.value.editRequests.length,1);
  assert.equal((await f.call('review_submission',{id:f.state.value.submissions[0].id,revision:1,decision:'accept',reason})).response.status,403);
  assert.equal((await f.call('propose_edit',{id:'existing.md',sha:f.oldSha,entry:listing,reason,operationId:randomUUID()})).response.status,403);
});
test('page coverage and own queues are authenticated; staff data and administration stay role gated',async t=>{
  const f=fixture(t,[]);
  const own=randomUUID();await f.call('submit_project',{entry:newEntry,operationId:own});seedSubmission(f);
  const rows=await f.call('list_submissions');assert.equal(rows.data.submissions.length,1);assert.equal(rows.data.submissions[0].id,own);assert(!('submitter' in rows.data.submissions[0]));
  assert.equal((await f.call('read_workspace',{page:'needs-update'})).response.status,403);
  assert.equal((await f.call('read_workspace',{page:'administration'})).response.status,403);
  assert.equal((await f.call('read_workspace',{page:'overview'})).data.pages.length,PAGE_COVERAGE.length);
  const access=await f.call('read_access');assert.equal(access.data.csrf,undefined);assert.equal(access.data.canReview,false);
});
test('source HTTP rejects cookies, cross-origin input, unknown arguments and notification effects',async t=>{
  const f=fixture(t),args={entry:newEntry,operationId:randomUUID()};
  assert.equal((await f.call('submit_project',args,{headers:{cookie:'browser-session=not-mcp'}})).response.status,403);
  assert.equal((await f.call('submit_project',args,{headers:{origin:'https://attacker.invalid'}})).response.status,403);
  assert.equal((await f.call('submit_project',{...args,url:'https://attacker.invalid'})).response.status,400);
  const r=await f.request({jsonrpc:'2.0',method:'tools/call',params:{name:'directory.submit_project',arguments:args}},f.proof('directory.submit_project',args));assert.equal(r.status,202);
  assert.equal(f.state.journalWrites,0);assert.equal(f.state.businessWrites.length,0);
});
test('invalid gateway/actor/issuer signatures and tuple/digest changes fail before durable reservation',async t=>{
  const f=fixture(t),args={entry:newEntry,operationId:randomUUID()};
  const changes=[p=>p.signature='invalid',p=>p.principalSignature='invalid',p=>p.decisionEnvelope.signature='invalid',p=>p.request.tenant='other',p=>p.request.workspace='other',p=>p.request.project='roles',p=>p.request.resource='private:other',p=>p.request.action='directory.propose_edit',p=>p.request.credentialId='f'.repeat(64),p=>p.request.delegationId=randomUUID(),p=>p.request.principal='agent:'+randomUUID(),p=>p.request.stage='enqueue',p=>p.request.parametersDigest='f'.repeat(64),p=>p.decisionEnvelope.decision.allowed=false,p=>p.decisionEnvelope.decision.expiresAt+=10000];
  for(const change of changes){const r=await f.call('submit_project',args,{change});assert.equal(r.response.status,403);}
  assert.equal(f.state.journalWrites,0);assert.equal(f.state.businessWrites.length,0);
});
test('expired proofs, oversized carriers, source operation mismatch and unknown native identities are denied',async t=>{
  const f=fixture(t),args={entry:newEntry,operationId:randomUUID()},packet=f.proof('directory.submit_project',args);f.clock.value+=6000;
  assert.equal((await f.call('submit_project',args,{packet})).response.status,403);
  assert.equal((await f.call('submit_project',args,{headers:{'x-bittrees-mcp-decision':'a'.repeat(16385)}})).response.status,403);
  assert.equal((await f.call('submit_project',args,{operationId:randomUUID()})).response.status,409);
  f.state.identityRevoked=true;assert.equal((await f.call('submit_project',args)).response.status,403);assert.equal(f.state.journalWrites,0);
});
test('binding/action edits, duplicate connection mappings and missing native resolver fail closed',async t=>{
  const f=fixture(t),args={entry:newEntry,operationId:randomUUID()};
  f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([{...f.connection,workspace:'changed'}]);assert.equal((await f.call('submit_project',args)).response.status,403);
  f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([f.connection,f.connection]);assert.equal((await f.call('submit_project',args)).response.status,403);
  const sameKey={...f.connection,actorPublicKey:'\n'+f.connection.gatewayPublicKey+'\n'};sameKey.bindingDigest=connectionBinding(sameKey);f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([sameKey]);assert.equal((await f.request({jsonrpc:'2.0',id:1,method:'tools/list',params:{}})).status,403);
  const h=createEditorialMcp({env:{...f.env,DIRECTORY_MCP_CONNECTIONS_JSON:JSON.stringify([f.connection])}});
  const r=await h(new Request(EDITORIAL_AUDIENCE,{method:'POST',headers:{authorization:'Bearer '+'a'.repeat(64),'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list',params:{}})}));assert.equal(r.status,503);assert.equal(f.state.journalWrites,0);
});
test('request replay is denied, and fresh-proof operation retry returns the existing receipt without replay',async t=>{
  const f=fixture(t,[]),args={entry:newEntry,operationId:randomUUID()},packet=f.proof('directory.submit_project',args);
  const first=await f.call('submit_project',args,{packet});assert.equal(first.data.outcome.status,'pending');
  assert.equal((await f.call('submit_project',args,{packet})).response.status,409);
  const fresh=await f.call('submit_project',args);assert.equal(fresh.data.outcome.status,'pending');assert.equal(f.state.value.submissions.length,1);
  assert.equal((await f.call('submit_project',{...args,entry:{...newEntry,name:'Changed same operation'}})).response.status,409);
});
test('exact source receipts bind request, operation and signed decision, with no CSRF or secrets',async t=>{
  const f=fixture(t,[]),r=await f.call('read_access');
  assert.equal(r.response.headers.get('X-Bittrees-Mcp-Request-Id'),r.packet.request.requestId);
  assert.equal(r.response.headers.get('X-Bittrees-Mcp-Operation-Id'),r.packet.request.operationId);
  assert.equal(r.response.headers.get('X-Bittrees-Mcp-Decision-Digest'),digest(r.packet.decisionEnvelope));assert.equal(r.data.csrf,undefined);
  assert(!JSON.stringify(f.state.value).includes('PRIVATE KEY'));assert(!JSON.stringify(f.state.value).includes('synthetic-app-token'));
});
test('automatic approval needs explicit Reviewer, immutable evidence and opaque same-person self-review denial',async t=>{
  const f=fixture(t,['project.admin']);const id=seedSubmission(f),args={target:'submission',id,revision:1,reason,evidence:'Current official website and product were independently verified.'};
  assert.equal((await f.call('auto_review',args)).response.status,403);
  f.state.roles=['role.reviewer'];f.state.value.submissions[0].submitter=subject('reviewer@example.org',f.secret);f.state.value.submissions[0].submitterOwner=f.native.personSubject;assert.equal((await f.call('auto_review',args)).response.status,403);
  f.state.value.submissions[0].submitter='other';f.state.value.submissions[0].submitterOwner='e'.repeat(64);const r=await f.call('auto_review',args);assert.equal(r.data.status,'prepared');assert.equal(f.state.value.submissions[0].history[0].mode,'automatic');assert.match(f.state.value.submissions[0].history[0].reason,/independently verified/);assert.equal(f.state.businessWrites.length,0);
  assert.equal((await f.call('review_submission',{id:seedSubmission(f),revision:1,decision:'accept',reason,mode:'automatic'})).response.status,400);
});
test('proposal preparation performs no business write; exactly one fresh authorization advances each GitHub step',async t=>{
  const f=fixture(t),prepared=await prepare(f);assert.equal(prepared.data.status,'prepared');assert.equal(f.state.businessWrites.length,0);
  const first=await step(f,prepared.data);assert.equal(first.data.nextStep,'write_file');assert.equal(f.state.businessWrites.length,1);
  const second=await step(f,first.data);assert.equal(second.data.nextStep,'create_pr');assert.equal(f.state.businessWrites.length,2);
  const third=await step(f,second.data);assert.equal(third.data.status,'complete');assert.equal(third.data.outcome.status,'release-pending');assert.equal(f.state.businessWrites.length,3);
  assert.deepEqual(f.state.businessWrites.map(r=>r.step),['create_branch','write_file','create_pr']);assert.equal(f.state.value.submissions[0].status,'accepted');assert.equal(f.state.prs.length,1);
  assert.equal((await step(f,second.data)).response.status,409);assert.equal(f.state.businessWrites.length,3);
});
test('steps cannot be reordered, skipped, widened, replayed or redirected to another branch or source',async t=>{
  const f=fixture(t),r=await prepare(f);
  for(const change of [{step:'write_file'},{revision:999},{expectedHeadSha:'9'.repeat(40)},{expectedDiffDigest:'f'.repeat(64)},{operationId:randomUUID()}])assert.equal((await step(f,r.data,change)).response.status,change.operationId?404:409);
  const a={operationId:r.data.operationId,step:'create_branch',revision:r.data.revision,expectedHeadSha:r.data.expectedHeadSha,expectedDiffDigest:r.data.expectedDiffDigest,branch:'main'};
  assert.equal((await f.call('execute_step',a)).response.status,400);assert.equal(f.state.businessWrites.length,0);
});
test('late committed file writes are held; fresh read reconciliation verifies exact head and diff without another write',async t=>{
  const f=fixture(t),p=await prepare(f),a=await step(f,p.data);f.state.lateOn='write_file';
  const late=await step(f,a.data);assert.equal(late.response.status,409);assert.equal(f.state.businessWrites.length,2);assert.equal(f.state.value.mcpOperations[0].status,'held');
  assert.equal((await step(f,a.data)).response.status,409);assert.equal(f.state.businessWrites.length,2);
  f.state.lateOn=null;const read=await f.call('read_operation',{operationId:p.data.operationId});assert.equal(read.data.status,'prepared');assert.equal(read.data.nextStep,'create_pr');assert.equal(f.state.businessWrites.length,2);
  assert.equal((await step(f,read.data)).data.status,'complete');assert.equal(f.state.businessWrites.length,3);
});
test('a lost dispatched response never triggers a retry or a new operation fallback',async t=>{
  const f=fixture(t),p=await prepare(f);f.state.throwAfter='create_branch';const failed=await step(f,p.data);assert.equal(failed.response.status,409);assert.equal(f.state.businessWrites.length,1);
  const again=await f.call('review_submission',f.state.value.mcpOperations[0].args,{operationId:p.data.operationId});assert.equal(again.data.status,'held');assert.equal(f.state.businessWrites.length,1);
  f.state.throwAfter=null;const read=await f.call('read_operation',{operationId:p.data.operationId});assert.equal(read.data.nextStep,'write_file');assert.equal(f.state.businessWrites.length,1);
});
test('unexpected proposal diffs keep reconciliation held and never authorize a later PR creation',async t=>{
  const f=fixture(t),p=await prepare(f),a=await step(f,p.data);f.state.lateOn='write_file';await step(f,a.data);f.state.lateOn=null;f.state.extraDiff=true;
  const r=await f.call('read_operation',{operationId:p.data.operationId});assert.equal(r.data.status,'held');assert.equal(f.state.prs.length,0);assert.equal(f.state.businessWrites.length,2);
});
test('native role revocation before a later step blocks the write even with a valid MCP grant',async t=>{
  const f=fixture(t),p=await prepare(f);f.state.roles=[];assert.equal((await step(f,p.data)).response.status,403);assert.equal(f.state.businessWrites.length,0);
});
test('a scoped step connection cannot execute a parent editorial action it was never approved for',async t=>{
  const f=fixture(t),p=await prepare(f);f.connection.actions=['directory.execute_step','directory.read_operation'];f.connection.bindingDigest=connectionBinding(f.connection);f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([f.connection]);
  assert.equal((await step(f,p.data)).response.status,404);assert.equal(f.state.businessWrites.length,0);
});
test('Editor proposal steps only update an existing record, retaining status, unknown metadata and body',async t=>{
  const f=fixture(t,['role.editor']),operationId=randomUUID();
  let r=await f.call('propose_edit',{id:'existing.md',sha:f.oldSha,entry:{...listing,description:'Updated official onchain infrastructure description.'},reason,operationId});
  assert.equal(r.data.status,'prepared');assert.equal(f.state.businessWrites.length,0);
  for(let i=0;i<3;i++)r=await step(f,r.data);
  assert.equal(r.data.status,'complete');assert.equal(f.state.value.edits[0].status,'accepted');
  const raw=f.state.branches.get('directory/change-'+operationId).files.get('content/projects/existing.md').raw;
  assert(raw.includes('curation_note'));assert(raw.includes('Original document body.'));assert(raw.includes('verification_status: "verified"'));
});
test('Reviewer auto-approval of removal proposes rejection without deleting the record or skipping release review',async t=>{
  const f=fixture(t),id=randomUUID();f.state.value.editRequests=[{id,requester:'other',requesterOwner:'e'.repeat(64),projectId:'existing.md',projectName:listing.name,listingSha:f.oldSha,kind:'removal',removalReasons:['shutdown'],changes:'Official closure announced.',sources:'https://existing.example.org/closure',status:'pending',revision:1}];
  let r=await f.call('auto_review',{target:'change',id,revision:1,reason,evidence:'The official project closure announcement was independently verified.'});
  assert.equal(r.data.status,'prepared');const operationId=r.data.operationId;
  for(let i=0;i<3;i++)r=await step(f,r.data);
  assert.equal(r.data.status,'complete');const record=f.state.value.editRequests[0];assert.equal(record.status,'accepted');assert.equal(record.review.mode,'automatic');
  const raw=f.state.branches.get('directory/change-'+operationId).files.get('content/projects/existing.md').raw;assert(raw.includes('verification_status: "rejected"'));assert(raw.includes('Original document body.'));assert.equal(f.state.prs[0].state,'open');
});
test('source queue pagination binds a stable snapshot despite replay reservations, and rejects changed queue pages',async t=>{
  const f=fixture(t);for(let i=0;i<4;i++)seedSubmission(f);
  const first=await f.call('list_submissions',{limit:2,offset:0});assert.equal(first.data.submissions.length,2);assert.equal(first.data.nextOffset,2);
  const next=await f.call('list_submissions',{limit:2,offset:2,expectedSnapshot:first.data.snapshot});assert.equal(next.data.submissions.length,2);assert.equal(next.data.nextOffset,null);
  seedSubmission(f);assert.equal((await f.call('list_submissions',{limit:2,offset:2,expectedSnapshot:first.data.snapshot})).response.status,409);
});
test('a role revoked during a broad queue read cannot fall back to ordinary-user authority to release other submissions',async t=>{
  const f=fixture(t);seedSubmission(f);f.state.revokeAfterJournal=true;
  const result=await f.call('list_submissions');assert.equal(result.response.status,403);assert.equal(result.data,undefined);assert.equal(f.state.businessWrites.length,0);
});
test('staff process status and needs-update page tools validate the fixed public release hashes',async t=>{
  const f=fixture(t);const status=await f.call('read_workspace',{page:'process-status'});assert.equal(status.response.status,200);assert.deepEqual(status.data.status,[]);assert.equal(status.data.sourceCommit,f.state.base);
  const needs=await f.call('read_workspace',{page:'needs-update',limit:10});assert.equal(needs.data.total,0);assert.equal(needs.data.sourceCommit,f.state.base);
});
test('source replay and durable audit capacity failures hold work without widening limits or dispatching writes',async t=>{
  const f=fixture(t);f.state.value.mcpOperations=Array.from({length:64},()=>({id:randomUUID(),binding:'x',action:'directory.submit_project'}));
  assert.equal((await f.call('submit_project',{entry:newEntry,operationId:randomUUID()})).response.status,409);assert.equal(f.state.businessWrites.length,0);assert.equal(f.state.value.submissions.length,0);
});
test('owner provenance is purpose/context bound and rejects cross-app aliases, stale links and identity substitution',async t=>{
  const f=fixture(t),args={entry:newEntry,operationId:randomUUID()};
  for(const change of [{purpose:'workflow:private-history'},{audience:'https://workflow.bittrees.org'},{contextDigest:'f'.repeat(64)},{identityRevision:2},{sourceSubject:'e'.repeat(64)},{identity:'someone@example.org'},{expiresAt:f.clock.value-1}]){
    f.state.providerChange=change;assert.equal((await f.call('submit_project',args)).response.status,403);
  }
  f.state.providerChange={identities:['private@example.org']};assert.equal((await f.call('submit_project',args)).response.status,400);assert.equal(f.state.journalWrites,0);
});
test('historical owner unknown is held for manual native review rather than assumed unrelated',async t=>{
  const f=fixture(t),id=seedSubmission(f);delete f.state.value.submissions[0].submitterOwner;
  const r=await f.call('auto_review',{target:'submission',id,revision:1,reason,evidence:'Current official project evidence was independently assessed.'});
  assert.equal(r.response.status,409);assert.equal(f.state.value.submissions[0].status,'pending');assert.equal(f.state.businessWrites.length,0);assert.match(r.wire.result.content[0].text,/historical request/);
});
test('opaque person provenance stays server-side and cannot be forged as tool input',async t=>{
  const f=fixture(t,[]),operationId=randomUUID();const r=await f.call('submit_project',{entry:newEntry,operationId});assert.equal(r.data.outcome.status,'pending');
  assert.equal(f.state.value.submissions[0].submitterOwner,f.native.personSubject);
  const rows=await f.call('list_submissions');assert.equal(rows.data.submissions[0].submitterOwner,undefined);assert(!JSON.stringify(rows.wire).includes(f.native.personSubject));
  assert.equal((await f.call('submit_project',{entry:newEntry,operationId:randomUUID(),submitterOwner:'e'.repeat(64)})).response.status,400);
});
test('device-held delegated signatures need no actor private key at the source and leases remain rejected',async t=>{
  const f=fixture(t);f.connection.proofMode='device-held-delegated-v1';f.connection.bindingDigest=connectionBinding(f.connection);f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([f.connection]);
  assert.equal((await f.call('read_access')).response.status,200);assert(!Object.keys(f.env).some(k=>k.includes('ACTOR_PRIVATE_KEY')));
  const args={},packet=f.proof('directory.read_access',args);packet.request.leaseId=randomUUID();packet.request.runtimeBindingDigest='a'.repeat(64);
  assert.equal((await f.call('read_access',args,{packet})).response.status,400);
  const unsafe={...f.connection,privateKey:'never accepted'};f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([unsafe]);assert.equal((await f.call('read_access')).response.status,400);
});
test('the actor credential fingerprint must actually match the pinned Ed25519 key',async t=>{
  const f=fixture(t);f.connection.credentialId='f'.repeat(64);f.connection.bindingDigest=connectionBinding(f.connection);f.env.DIRECTORY_MCP_CONNECTIONS_JSON=JSON.stringify([f.connection]);
  assert.equal((await f.call('read_access')).response.status,403);assert.equal(f.state.rolesCalls,0);assert.equal(f.state.journalWrites,0);
});
test('MCP does not silently bootstrap a missing native storage branch',async t=>{
  const f=fixture(t,[]);f.state.journalMissing=true;
  const r=await f.call('submit_project',{entry:newEntry,operationId:randomUUID()});assert.equal(r.response.status,503);assert.equal(f.state.journalWrites,0);assert.equal(f.state.businessWrites.length,0);assert.equal(f.state.branches.size,0);
});
test('late audit receipt logging cannot mutate the immutable business request',async()=>{
  const id=randomUUID(),connection={bindingDigest:'binding'},operation={id,binding:'binding',action:'directory.submit_project',parametersDigest:'digest',args:{name:'Approved request'},revision:1};let writes=0;
  const store={load:async()=>({sha:'existing',value:{version:1,revision:0,submissions:[],edits:[],mcpOperations:[structuredClone(operation)]}}),async save(){writes++;}};
  await assert.rejects(()=>auditOperation(store,id,connection,row=>{row.args.name='Changed business intent';}),e=>e.status===409);assert.equal(writes,0);
});
test('a branch-head race is rejected atomically even when the target file SHA did not change',async t=>{
  const f=fixture(t),p=await prepare(f),a=await step(f,p.data);f.state.raceHead=true;
  const r=await step(f,a.data);assert.equal(r.response.status,409);assert.equal(f.state.businessWrites.length,1);assert.equal(f.state.prs.length,0);
  const branch=f.state.branches.get('directory/change-'+p.data.operationId);assert.equal(branch.files.has('content/projects/new-project.md'),false);assert.equal(f.state.value.mcpOperations[0].status,'held');
});
test('a PR created at an unexpected head is held and never reported as an approved release proposal',async t=>{
  const f=fixture(t),p=await prepare(f),a=await step(f,p.data),b=await step(f,a.data);f.state.racePrHead=true;
  const r=await step(f,b.data);assert.equal(r.response.status,409);assert.equal(r.data,undefined);assert.equal(f.state.value.mcpOperations[0].status,'held');assert.equal(f.state.value.submissions[0].status,'accepting');
  const read=await f.call('read_operation',{operationId:p.data.operationId});assert.equal(read.data.status,'held');assert.equal(f.state.prs.length,1);assert.equal(f.state.prs[0].state,'open');assert.equal(f.state.businessWrites.length,3);
});
