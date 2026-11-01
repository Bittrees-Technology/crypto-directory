// Synthetic identities and in-memory source API only. No enrollment or grants.
import assert from 'node:assert/strict';
import {createHash,generateKeyPairSync,randomUUID,sign} from 'node:crypto';
import {createEditorialMcp} from '../lib/directory/editorial-mcp.mjs';
import {EDITORIAL_AUDIENCE,EDITORIAL_TOOLS,editorialArguments} from '../lib/directory/editorial-contract.mjs';
import {canonical,digest,sourceContext,connectionBinding} from '../lib/directory/mcp-proof.mjs';
import {frontMatter,hash,signedState,readState,subject} from '../lib/directory/model.mjs';
import {ecosystemRequestMessage,ecosystemDecisionMessage,verifyEcosystemSignature} from '../shared/roles-administration/ecosystem-authority.mjs';
export const listing={name:'Existing Project',lead_category:'Infrastructure',tags:['Infrastructure'],ecosystem:['Ethereum'],description:'An existing onchain infrastructure project.',primary_url:'https://existing.example.org/',product_url:'https://existing.example.org/app',founded:'2020',hq:'Metaverse',token:'n/a',twitter:'n/a'};
export const newEntry={...listing,name:'New Project',primary_url:'https://new.example.org/',product_url:'https://new.example.org/app'};
const blob=raw=>createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0'+raw).digest('hex');
const pem=key=>key.export({format:'pem',type:'spki'});
export function fixture(t,roles=['role.reviewer']){
  const clock={value:Date.now()};t.mock.method(Date,'now',()=>clock.value);
  const gateway=generateKeyPairSync('ed25519'),actor=generateKeyPairSync('ed25519'),decision=generateKeyPairSync('ed25519'),ecosystem=generateKeyPairSync('ed25519'),source=generateKeyPairSync('ed25519'),app=generateKeyPairSync('rsa',{modulusLength:2048});
  const secret='synthetic-editorial-journal-secret-'.repeat(3),token='a'.repeat(64),identity='0x'+'1'.repeat(40);
  const connection={id:randomUUID(),enabled:true,sourceTokenHash:hash(token),bindingDigest:'b'.repeat(64),credentialId:hash(pem(actor.publicKey)),delegationId:randomUUID(),principal:'agent:'+randomUUID(),tenant:'fixture:tenant',workspace:'fixture:directory',approvedAt:clock.value-1000,expiresAt:clock.value+3600000,actions:EDITORIAL_TOOLS.map(t=>t.action),gatewayPublicKey:pem(gateway.publicKey),actorPublicKey:pem(actor.publicKey),proofMode:'gateway-held-delegated-v1'};
  const native={verified:true,purpose:'crypto-directory:editorial',audience:EDITORIAL_AUDIENCE,connectionId:connection.id,principal:connection.principal,credentialId:connection.credentialId,personSubject:'d'.repeat(64),sourceSubject:subject(identity,secret),identity,identityRevision:1,authTime:clock.value-1000};
  connection.identityBindingDigest=digest({purpose:native.purpose,audience:native.audience,personSubject:native.personSubject,sourceSubject:native.sourceSubject,identityRevision:1});
  connection.bindingDigest=connectionBinding(connection);
  const env={DIRECTORY_MCP_EDITORIAL_ENABLED:'true',DIRECTORY_MCP_CONNECTIONS_JSON:JSON.stringify([connection]),DIRECTORY_MCP_ROLES_DECISION_PUBLIC_KEY:pem(decision.publicKey),BITTREES_ADMIN_SSO_CLIENT_SECRET:secret,DIRECTORY_JOURNAL_SECRET:secret,ROLES_ECOSYSTEM_REQUEST_PRIVATE_KEY:source.privateKey.export({format:'pem',type:'pkcs8'}),ROLES_ECOSYSTEM_DECISION_PUBLIC_KEY:pem(ecosystem.publicKey),DIRECTORY_GITHUB_APP_ID:'123',DIRECTORY_GITHUB_INSTALLATION_ID:'456',DIRECTORY_GITHUB_APP_PRIVATE_KEY:app.privateKey.export({format:'pem',type:'pkcs8'})};
  const base='1'.repeat(40),raw=frontMatter({...listing,verification_status:'verified',curation_note:'Preserve this source metadata'})+'\nOriginal document body.\n';
  const files=new Map([['content/projects/existing.md',{raw,sha:blob(raw)}]]);
  const state={roles,clock,base,files,branches:new Map(),prs:[],businessWrites:[],journalWrites:0,value:{version:1,revision:0,submissions:[],edits:[]},lateOn:null,throwAfter:null,extraDiff:false,identityRevoked:false,rolesCalls:0};
  const fileResponse=file=>Response.json({type:'file',size:Buffer.byteLength(file.raw),sha:file.sha,encoding:'base64',content:Buffer.from(file.raw).toString('base64')});
  const response=(data,status=200)=>Response.json(data,{status});
  const fetcher=async(url,options={})=>{
    if(url==='https://roles.bittrees.org/api/authority/ecosystem-decision'){
      state.rolesCalls++;const packet=JSON.parse(options.body),request=packet.request;
      assert(verifyEcosystemSignature(ecosystemRequestMessage(request),packet.signature,pem(source.publicKey)));
      const d={version:1,issuer:'https://roles.bittrees.org',audience:request.source,request,authoritative:true,enrolled:true,actions:state.roles,checkedAt:clock.value,expiresAt:clock.value+4900,requiresPrivateOwnership:true};
      return response({decision:d,signature:sign(null,Buffer.from(ecosystemDecisionMessage(d)),ecosystem.privateKey).toString('base64')});
    }
    const data=JSON.stringify([{...listing,id:'existing.md',verification_status:'verified'}]);
    if(url==='https://cd.bittrees.org/release.json')return response({schemaVersion:1,repository:'Bittrees-Technology/crypto-directory',sourceCommit:base,files:{'data/projects.json':hash(data),'data/process-status.json':hash('[]')}});
    if(url==='https://cd.bittrees.org/data/projects.json')return new Response(data);
    if(url==='https://cd.bittrees.org/data/process-status.json')return response([]);
    const u=new URL(url);assert.equal(u.origin,'https://api.github.com');const path=u.pathname,method=options.method||'GET',body=options.body?JSON.parse(options.body):null;
    if(path==='/app/installations/456/access_tokens')return response({token:'synthetic-app-token',expires_at:new Date(clock.value+3600000).toISOString()});
    if(path==='/graphql'){
      assert.equal(method,'POST');assert(body.query.startsWith('mutation CryptoDirectoryWrite('));const input=body.variables.input;
      assert.equal(input.branch.repositoryNameWithOwner,'Bittrees-Technology/crypto-directory');assert(/^directory\/change-[a-f0-9-]{36}$/.test(input.branch.refName));
      assert.equal(input.fileChanges.additions.length,1);assert.equal(input.fileChanges.deletions,undefined);
      const branch=state.branches.get(input.branch.refName),addition=input.fileChanges.additions[0];assert(branch);assert(/^content\/projects\/[-a-z0-9]+\.md$/.test(addition.path));
      if(state.raceHead)branch.head='9'.repeat(40);
      if(branch.head!==input.expectedHeadOid)return response({errors:[{message:'Expected head changed'}]});
      const next=Buffer.from(addition.contents,'base64').toString();branch.files.set(addition.path,{raw:next,sha:blob(next)});branch.changed=addition.path;branch.head=blob('commit:'+next);state.businessWrites.push({step:'write_file',method,route:path});
      if(state.lateOn==='write_file')clock.value+=6000;if(state.throwAfter==='write_file')throw Error('Synthetic lost commit response');
      return response({data:{createCommitOnBranch:{commit:{oid:branch.head},ref:{target:{oid:branch.head}}}}});
    }
    const prefix='/repos/Bittrees-Technology/crypto-directory';assert(path.startsWith(prefix));const route=path.slice(prefix.length);
    if(route==='/git/ref/heads/main')return response({object:{sha:base}});
    if(route==='/contents/.directory/intake.json'){
      if(method==='GET'&&state.journalMissing)return response({},404);
      const currentRaw=JSON.stringify(signedState(state.value,secret)),currentSha=blob(currentRaw);
      if(method==='GET')return fileResponse({raw:currentRaw,sha:currentSha});
      assert.equal(method,'PUT');assert.equal(body.branch,'directory-intake');if(body.sha!==currentSha)return response({},409);
      state.value=readState(JSON.parse(Buffer.from(body.content,'base64').toString()),secret);state.journalWrites++;
      if(state.revokeAfterJournal)state.roles=[];
      return response({content:{sha:blob(JSON.stringify(signedState(state.value,secret)))}});
    }
    if(route.startsWith('/git/ref/heads/')){const ref=route.slice('/git/ref/heads/'.length),branch=state.branches.get(ref);return branch?response({object:{sha:branch.head}}):response({},404);}
    const recordEffect=step=>{
      state.businessWrites.push({step,method,route});
      if(state.lateOn===step)clock.value+=6000;
      if(state.throwAfter===step)throw Error('Synthetic lost response after dispatch');
    };
    if(route==='/git/refs'){
      assert.equal(method,'POST');assert(/^refs\/heads\/directory\/change-[a-f0-9-]{36}$/.test(body.ref));assert.equal(body.sha,base);
      const ref=body.ref.slice('refs/heads/'.length);if(state.branches.has(ref))return response({},422);
      state.branches.set(ref,{head:base,files:new Map(files)});recordEffect('create_branch');return response({object:{sha:base}});
    }
    if(route.startsWith('/contents/content/projects/')){
      const filePath=route.slice('/contents/'.length),ref=method==='GET'?u.searchParams.get('ref')||'main':body.branch;
      const branch=ref==='main'||ref===base?{files}:state.branches.get(ref)||[...state.branches.values()].find(b=>b.head===ref);if(!branch)return response({},404);
      const file=branch.files.get(filePath);
      if(method==='GET')return file?fileResponse(file):response({},404);
      assert.equal(method,'PUT');assert(file?body.sha===file.sha:body.sha===undefined);
      const next=Buffer.from(body.content,'base64').toString();branch.files.set(filePath,{raw:next,sha:blob(next)});branch.changed=filePath;branch.head=blob('commit:'+next);recordEffect('write_file');return response({commit:{sha:branch.head},content:{sha:blob(next)}});
    }
    if(route.startsWith('/compare/')){const branch=[...state.branches.values()].find(b=>route.endsWith('...'+b.head));assert(branch);return response({ahead_by:1,files:[{filename:branch.changed,status:files.has(branch.changed)?'modified':'added'},...(state.extraDiff?[{filename:'api/evil.mjs',status:'added'}]:[])]});}
    if(route==='/pulls'){
      if(method==='GET'){const head=(u.searchParams.get('head')||'').replace('Bittrees-Technology:','');return response(state.prs.filter(p=>p.head.ref===head));}
      assert.equal(method,'POST');assert.equal(body.base,'main');const branch=state.branches.get(body.head);assert(branch);
      if(state.racePrHead)branch.head='8'.repeat(40);
      const pr={number:100+state.prs.length,html_url:'https://github.com/Bittrees-Technology/crypto-directory/pull/'+(100+state.prs.length),state:'open',merged_at:null,head:{ref:body.head,sha:branch.head,repo:{full_name:'Bittrees-Technology/crypto-directory'}},base:{ref:'main'}};state.prs.push(pr);recordEffect('create_pr');return response(pr);
    }
    if(/^\/pulls\/\d+\/files$/.test(route)){const pr=state.prs.find(p=>route.startsWith('/pulls/'+p.number+'/')),branch=state.branches.get(pr.head.ref);return response([{filename:branch.changed,status:files.has(branch.changed)?'modified':'added'}]);}
    throw Error('Unexpected synthetic source route: '+method+' '+route);
  };
  const identityProvider=async({connection:binding,context})=>{assert.equal(binding.sourceTokenHash,undefined);assert.equal(binding.actorPublicKey,undefined);assert.equal(context.selection,undefined);assert.equal(context.sourceContext,undefined);if(context.kind==='execute')assert.equal(context.authorityProof.request.parametersDigest,context.parametersDigest);return {...native,verified:!state.identityRevoked,contextDigest:digest(context),checkedAt:clock.value,expiresAt:clock.value+4900,...(state.providerChange||{})};};
  const handler=createEditorialMcp({env,fetcher,identityProvider,now:()=>clock.value});
  function proof(name,args,operationId= args.operationId||randomUUID(),change){
    // Valid requests sign the same source-normalized payload as the gateway.
    // Invalid argument fixtures intentionally sign raw input to test rejection.
    try{args=editorialArguments(name,args).args;}catch{}
    const tool=EDITORIAL_TOOLS.find(t=>t.name===name);
    const r={version:1,source:'mcp.bittrees.org',audience:'https://roles.bittrees.org/api/authority/mcp-decision',requestId:randomUUID(),operationId,parametersDigest:digest(sourceContext(connection,tool,args,operationId)),issuedAt:clock.value,principal:connection.principal,credentialId:connection.credentialId,delegationId:connection.delegationId,stage:'execute',tenant:connection.tenant,workspace:connection.workspace,project:'crypto-directory',resource:'directory:editorial',action:tool.action};
    const d={version:1,issuer:'https://roles.bittrees.org',audience:'https://mcp.bittrees.org',request:r,allowed:true,requiresSourceAuthorization:true,checkedAt:clock.value,expiresAt:clock.value+4900};
    const packet={request:r,signature:sign(null,Buffer.from('Bittrees MCP authority request v1\n'+canonical(r)),gateway.privateKey).toString('base64'),principalSignature:sign(null,Buffer.from('Bittrees MCP authority request v1\n'+canonical(r)),actor.privateKey).toString('base64'),decisionEnvelope:{decision:d,signature:sign(null,Buffer.from('Bittrees MCP authority decision v1\n'+canonical(d)),decision.privateKey).toString('base64')}};
    if(change)change(packet);return packet;
  }
  const request=(message,packet,extra={})=>handler(new Request(EDITORIAL_AUDIENCE,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json',...(packet?{'x-bittrees-mcp-decision':Buffer.from(JSON.stringify(packet)).toString('base64url')}:{}),...extra},body:JSON.stringify(message)}));
  const call=async(short,args={},options={})=>{
    const name='directory.'+short,packet=options.packet||proof(name,args,options.operationId,options.change);
    const response=await request({jsonrpc:'2.0',id:1,method:'tools/call',params:{name,arguments:args}},packet,options.headers);
    const wire=await response.json();return {response,wire,data:wire.result?.structuredContent,packet};
  };
  return {state,clock,connection,native,env,handler,proof,request,call,secret,identity,ownerSubject:subject(identity,secret),oldSha:files.get('content/projects/existing.md').sha};
}
