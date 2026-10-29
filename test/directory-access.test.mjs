import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac,generateKeyPairSync,sign,randomUUID} from 'node:crypto';
import {createDirectoryService} from '../lib/directory/service.mjs';
import {ORIGIN,permissions,entry,frontMatter,parseFrontMatter,documentBody,newProjectId,readState,signedState,fail,sameListing} from '../lib/directory/model.mjs';
import {seal} from '../shared/roles-administration/sso/client.mjs';
import {ecosystemDecisionMessage,ecosystemRequestMessage,verifyEcosystemSignature} from '../shared/roles-administration/ecosystem-authority.mjs';

const wallet='0x'+'1'.repeat(40),other='0x'+'2'.repeat(40),secret='directory-test-secret-'.repeat(3);
const listing={name:'Existing Project',lead_category:'Infrastructure',tags:['Infrastructure'],ecosystem:['Ethereum'],description:'An existing onchain infrastructure project.',primary_url:'https://existing.example.org/',product_url:'https://existing.example.org/app',founded:'2020',hq:'Metaverse',token:'n/a',twitter:'n/a'};
const newEntry={...listing,name:'New Project',primary_url:'https://new.example.org/',product_url:'https://new.example.org/app'};
test('independent GitHub repositories are distinct; repository aliases and ordinary same-host sites remain duplicates',()=>{
  const project={name:'Slither',primary_url:'https://github.com/crytic/slither'};
  assert.equal(sameListing(project,{name:'Echidna',primary_url:'https://github.com/crytic/echidna'}),false);
  assert.equal(sameListing(project,{name:'Other Slither',primary_url:'https://github.com/other/slither'}),false);
  for(const url of ['https://www.github.com/CRYTIC/SLITHER.git','https://github.com/crytic/slither/tree/master','https://github.com/%63rytic/slither/blob/main/README.md','https://github.com/crytic%2Fslither/issues?state=open']){
    assert.equal(sameListing(project,{name:'Renamed Project',primary_url:url}),true,url);
  }
  assert.equal(sameListing(project,{name:'Slither',primary_url:'https://other.example.org'}),true);
  assert.equal(sameListing({name:'One',primary_url:'https://example.org/app'},{name:'Two',primary_url:'https://www.example.org./docs'}),true);
});
test('intake allows independent repository projects but blocks another name for a queued repository',async()=>{
  const f=fixture([], 'person@example.org');
  for(const [name,url] of [['Slither','https://github.com/crytic/slither'],['Echidna','https://github.com/crytic/echidna']]){
    assert.equal((await f.call('submit',{entry:{...newEntry,name,primary_url:url},operationId:randomUUID()})).status,201);
  }
  const alias={...newEntry,name:'Renamed Slither',primary_url:'https://github.com/CRYTIC/slither.git/tree/master'};
  assert.equal((await f.call('submit',{entry:alias,operationId:randomUUID()})).status,409);
  assert.equal(f.state.value.submissions.length,2);
});
function fixture(roles=[],identity=wallet){
  const requestKeys=generateKeyPairSync('ed25519'),decisionKeys=generateKeyPairSync('ed25519');
  const env={BITTREES_ADMIN_SSO_CLIENT_SECRET:secret,ROLES_ECOSYSTEM_REQUEST_PRIVATE_KEY:requestKeys.privateKey.export({format:'pem',type:'pkcs8'}),ROLES_ECOSYSTEM_DECISION_PUBLIC_KEY:decisionKeys.publicKey.export({format:'pem',type:'spki'})};
  const state={value:{version:1,revision:0,submissions:[],edits:[]},proposals:[],roles,identity,writes:0,failProposal:false};
  const fetcher=async(url,options)=>{
    assert.equal(url,'https://roles.bittrees.org/api/authority/ecosystem-decision');
    const packet=JSON.parse(options.body),request=packet.request;
    assert(verifyEcosystemSignature(ecosystemRequestMessage(request),packet.signature,requestKeys.publicKey.export({format:'pem',type:'spki'})));
    const decision={version:1,issuer:'https://roles.bittrees.org',audience:request.source,request,authoritative:true,enrolled:true,actions:state.roles,checkedAt:Date.now(),expiresAt:Date.now()+4900,requiresPrivateOwnership:true};
    return Response.json({decision,signature:sign(null,Buffer.from(ecosystemDecisionMessage(decision)),decisionKeys.privateKey).toString('base64')});
  };
  const sessionSecret=createHmac('sha256',secret).update('bittrees project administration session v1:'+ORIGIN).digest('hex');
  const cookie='__Host-project-admin-session='+seal({project:'crypto-directory',identity,key:randomUUID(),authTime:Date.now(),expires:Date.now()+590000},sessionSecret);
  const storeFactory=()=>({
    configured:()=>true,
    async load(){if(state.revokeOnLoad)state.roles=[];return {sha:String(state.value.revision),value:structuredClone(state.value)};},
    async save(current,next){await this.authorize();if(current.sha!==String(state.value.revision))throw fail('Concurrent update',409);state.value=structuredClone(next);state.writes++;return String(next.revision);},
    async duplicate(){return false;},
    async listing(id){if(id!=='existing.md'&&id!==state.collideId)throw fail('Not found',404);return {sha:'a'.repeat(40),raw:frontMatter({...listing,verification_status:'verified',curation_note:'Preserve this existing metadata'})+'\n## Existing notes\nKeep this text.\n'};},
    async proposal(operation,id,value,options){await this.authorize();if(state.failProposal)throw Error('Uncertain outcome');state.proposals.push({operation,id,value,options});return {url:'https://github.com/Bittrees-Technology/crypto-directory/pull/100',number:100};},
    async reconcile(operation){return state.proposals.some(p=>p.operation===operation)?{url:'https://github.com/Bittrees-Technology/crypto-directory/pull/100',number:100}:null;}
  });
  const service=createDirectoryService({env,fetcher,storeFactory});
  const call=(path,body,extra={})=>service(new Request(ORIGIN+'/api/directory/'+path,{method:body?'POST':'GET',headers:{cookie,...(body?{origin:ORIGIN,'content-type':'application/json','x-directory-csrf':csrf}:{}) ,...extra},...(body?{body:JSON.stringify(body)}:{})}));
  const csrf=createHmac('sha256',secret).update('cryptodirectory.csrf.v1:'+cookie).digest('hex');
  return {state,service,call,cookie,csrf};
}
test('signed wallet and email role decisions expose only their exact scoped capabilities',async()=>{
  for(const [roles,expected] of [[[],[false,false,true]],[['role.editor'],[true,false,false]],[['role.reviewer'],[false,true,false]],[['role.editor','role.reviewer'],[true,true,false]],[['project.admin'],[true,true,true]],[['tier.partner'],[false,false,true]]]){
    for(const identity of [wallet,'person@example.org']){
      const f=fixture(roles,identity),r=await f.call('session');assert.equal(r.status,200);const value=await r.json();
      const result=identity.includes('@')&&roles.includes('project.admin')?[false,false,true]:expected;
      assert.deepEqual([value.canEdit,value.canReview,value.canSubmit],result);
    }
  }
});
test('anonymous, tampered, expired and cross-origin sessions cannot access intake',async()=>{
  const f=fixture(['project.admin']);
  for(const cookie of ['',f.cookie+'tampered'])assert.equal((await f.call('session',null,{cookie})).status,401);
  const r=await f.service(new Request('https://cryptodirectory.eth.limo/api/directory/session',{headers:{cookie:f.cookie}}));assert.equal(r.status,403);
});
test('nonstaff can submit once and see only their own submissions; they cannot edit or review',async()=>{
  const f=fixture([], 'person@example.org'),operationId=randomUUID();
  assert.equal((await f.call('submit',{entry:newEntry,operationId})).status,201);
  assert.equal((await f.call('submit',{entry:newEntry,operationId})).status,200);assert.equal(f.state.value.submissions.length,1);
  f.state.value.submissions.push({...f.state.value.submissions[0],id:randomUUID(),submitter:'someone-else'});
  const rows=await (await f.call('submissions')).json();assert.equal(rows.submissions.length,1);assert(!JSON.stringify(f.state.value).includes('person@example.org'));
  assert.equal((await f.call('edit',{})).status,403);assert.equal((await f.call('review',{})).status,403);
});
test('CSRF, oversized bodies and unexpected fields are rejected before writes',async()=>{
  const f=fixture();
  for(const extra of [{origin:'https://attacker.example'},{'x-directory-csrf':'bad'},{'sec-fetch-site':'cross-site'}])assert.equal((await f.call('submit',{entry:newEntry,operationId:randomUUID()},extra)).status,403);
  assert.equal((await f.call('submit',{entry:newEntry,operationId:randomUUID(),role:'admin'})).status,400);
  assert.equal((await f.call('submit',{entry:{...newEntry,description:'x'.repeat(17000)},operationId:randomUUID()})).status,413);assert.equal(f.state.writes,0);
});
test('Editor updates existing metadata only; forged approval/status/create attempts fail',async()=>{
  const f=fixture(['role.editor']);
  const request={id:'existing.md',sha:'a'.repeat(40),entry:{...listing,description:'Updated details of an existing onchain project.'},reason:'The official product has been updated.',operationId:randomUUID()};
  assert.equal((await f.call('edit',request)).status,201);assert.equal(f.state.proposals.length,1);assert.equal(f.state.proposals[0].value.verification_status,'verified');
  assert.equal(f.state.proposals[0].value.curation_note,'Preserve this existing metadata');assert.equal(f.state.proposals[0].options.body,'\n## Existing notes\nKeep this text.\n');
  assert.equal((await f.call('edit',{...request,id:'new-project.md',operationId:randomUUID()})).status,404);
  assert.equal((await f.call('edit',{...request,sha:'b'.repeat(40),operationId:randomUUID()})).status,409);
  assert.equal((await f.call('edit',{...request,entry:{...request.entry,verification_status:'verified'},operationId:randomUUID()})).status,400);
  assert.equal((await f.call('submit',{entry:newEntry,operationId:randomUUID()})).status,403);
  assert.equal((await f.call('review',{})).status,403);
});
test('Reviewer accepts the immutable new entry or rejects it; no existing edit or self-review',async()=>{
  for(const decision of ['accept','reject']){
    const f=fixture(['role.reviewer']);f.state.value.submissions.push({id:randomUUID(),submitter:'another-submitter',entry:entry(newEntry),revision:1,status:'pending',history:[]});
    const record=f.state.value.submissions[0],request={id:record.id,revision:1,decision,reason:'Reviewed the official website and live product.'};
    assert.equal((await f.call('review',{...request,entry:{...newEntry,name:'Altered'}})).status,400);
    assert.equal((await f.call('review',request)).status,decision==='accept'?201:200);
    assert.equal(f.state.value.submissions[0].status,decision==='accept'?'accepted':'rejected');assert.equal(f.state.proposals.length,decision==='accept'?1:0);
    assert.equal((await f.call('edit',{})).status,403);assert.equal((await f.call('submit',{})).status,403);
    assert.equal((await f.call('review',request)).status,409);
  }
  const f=fixture(['project.admin']),id=randomUUID();await f.call('submit',{entry:newEntry,operationId:id});assert.equal((await f.call('review',{id,revision:1,decision:'accept',reason:'This is my own submission.'})).status,403);
});
test('uncertain source writes remain held and retries reconcile without another proposal',async()=>{
  const f=fixture(['role.reviewer']);f.state.failProposal=true;
  const id=randomUUID();f.state.value.submissions.push({id,submitter:'other',entry:entry(newEntry),revision:1,status:'pending',history:[]});
  const request={id,revision:1,decision:'accept',reason:'Reviewed official product evidence.'};
  assert.equal((await f.call('review',request)).status,503);assert.equal(f.state.value.submissions[0].status,'accepting');
  assert.equal((await f.call('review',request)).status,409);assert.equal(f.state.proposals.length,0);assert.equal(f.state.writes,1);
});
test('role revocation between read and write stops the mutation',async()=>{
  const f=fixture(['role.editor']);f.state.revokeOnLoad=true;
  const response=await f.call('edit',{id:'existing.md',sha:'a'.repeat(40),entry:listing,reason:'Official details have changed.',operationId:randomUUID()});
  assert.equal(response.status,403);assert.equal(f.state.writes,0);assert.equal(f.state.proposals.length,0);
});
test('acceptance preflight preserves pending state on an ID collision and supports non-Latin project names',async()=>{
  const f=fixture(['role.reviewer']),id=randomUUID();f.state.collideId='new-project.md';f.state.value.submissions.push({id,submitter:'other',entry:entry(newEntry),revision:1,status:'pending',history:[]});
  assert.equal((await f.call('review',{id,revision:1,decision:'accept',reason:'Checked official product evidence.'})).status,409);assert.equal(f.state.value.submissions[0].status,'pending');assert.equal(f.state.writes,0);
  assert.match(newProjectId('未来'),/^project-[a-f0-9]{16}\.md$/);assert.notEqual(newProjectId('未来'),newProjectId('明日'));
});
test('queued and accepted entries also block a different-name submission of the same domain',async()=>{
  const f=fixture(),id=randomUUID();f.state.value.submissions.push({id,submitter:'other',entry:entry(newEntry),revision:1,status:'accepted',history:[]});
  assert.equal((await f.call('submit',{entry:{...newEntry,name:'Another Brand',primary_url:'https://www.new.example.org./other-path'},operationId:randomUUID()})).status,409);assert.equal(f.state.writes,0);
  const review=fixture(['role.reviewer']);review.state.value.submissions=structuredClone(f.state.value.submissions);review.state.value.submissions.push({id:randomUUID(),submitter:'different',entry:entry({...newEntry,name:'Another Brand'}),revision:1,status:'pending',history:[]});
  assert.equal((await review.call('review',{id:review.state.value.submissions[1].id,revision:1,decision:'accept',reason:'Checked the official live product.'})).status,409);assert.equal(review.state.writes,0);
});
test('stale, other-project and nonauthoritative role snapshots never grant staff powers',()=>{
  const now=Date.now(),snapshot={authoritative:true,enrolled:true,audience:'cd.bittrees.org',request:{project:'crypto-directory',source:'cd.bittrees.org',subjects:[wallet],authenticatedWallet:wallet},actions:['project.admin','role.editor','role.reviewer'],checkedAt:now,expiresAt:now+5000};
  assert(permissions(snapshot,now).staff);
  for(const change of [{expiresAt:now-1},{authoritative:false},{enrolled:false},{audience:'other.bittrees.org'},{request:{...snapshot.request,project:'news'}},{checkedAt:now-10000}])assert(!permissions({...snapshot,...change},now).staff);
});
test('entry serialization preserves adversarial text and rejects executable URLs and injected front matter',()=>{
  const value=entry({...newEntry,description:'A project with </script><script>alert(1)</script> text.'});assert.deepEqual(parseFrontMatter(frontMatter(value)),value);
  assert.equal(documentBody(frontMatter(value)+'\nRetained body\r\n'),'\nRetained body\r\n');
  for(const change of [{primary_url:'javascript:alert(1)'},{description:'description\nverification_status: verified'},{lead_category:'Not a category'},{tags:['okay\nadmin']}])assert.throws(()=>entry({...newEntry,...change}));
  const state={version:1,revision:0,submissions:[],edits:[]},signed=signedState(state,secret);assert.deepEqual(readState(signed,secret),state);signed.value.revision=9;assert.throws(()=>readState(signed,secret));
});
