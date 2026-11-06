import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {createProjectAdministration} from '../../shared/roles-administration/project-administration/portal.mjs';
import {GitHubStore} from './github.mjs';
import {ORIGIN,permissions,fail,entry,subject,strictObject,parseFrontMatter,documentBody,newProjectId,sameListing,editableFields,requestedChange,hash} from './model.mjs';
import {createEnsNameResolver} from './ens.mjs';

const headers={'Cache-Control':'private, no-store','Pragma':'no-cache','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};
const json=(value,status=200)=>Response.json(value,{status,headers});
function queuePage(rows,params){
  if(!params.has('limit')&&!params.has('offset')&&!params.has('expectedSnapshot'))return {rows};
  const limit=Number(params.get('limit')||20),offset=Number(params.get('offset')||0);
  if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0||offset>256)throw fail('Invalid queue pagination.');
  const sorted=[...rows].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0),snapshot=hash(JSON.stringify(sorted));
  if(params.has('expectedSnapshot')&&params.get('expectedSnapshot')!==snapshot)throw fail('This queue changed. Start a fresh snapshot before continuing.',409);
  return {rows:sorted.slice(offset,offset+limit),snapshot,total:sorted.length,nextOffset:offset+limit<sorted.length?offset+limit:null};
}
async function body(req){
  if(!req.headers.get('content-type')?.startsWith('application/json'))throw fail('Use JSON requests',415);
  const reader=req.body?.getReader();if(!reader)throw fail('Request body is required');let bytes=0,parts=[];
  while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>16384){await reader.cancel();throw fail('Request is too large',413);}parts.push(value);}
  try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw fail('Invalid request data');}
}
export function createDirectoryService({env=process.env,fetcher=fetch,administration=createProjectAdministration('crypto-directory',{env,fetcher}),storeFactory=()=>new GitHubStore({env,fetcher}),now=Date.now,resolveName=createEnsNameResolver({fetcher}),actorAuthenticator=null,writeAuthorizer=null,proposalMode='immediate',operationContext=null}={}){
  // A source-owned MCP verifier may supply BOTH trusted callbacks. No HTTP
  // field/header selects this mode; the browser always retains its CSRF checks.
  if(Boolean(actorAuthenticator)!==Boolean(writeAuthorizer))throw Error('Both source authentication callbacks are required');
  if(!['immediate','prepare'].includes(proposalMode)||proposalMode==='prepare'&&(!actorAuthenticator||!operationContext))throw Error('Prepared proposals require a verified source operation');
  const sameActor=(recordSubject,recordOwner,actor)=>{
    if(recordSubject===actor.subject||recordOwner&&recordOwner===actor.personSubject)return true;
    if(actorAuthenticator&&!/^[a-f0-9]{64}$/.test(recordOwner||''))throw fail('This historical request has no verified canonical owner. Use authorized manual native review.',409);
    return false;
  };
  const prepared=(operationId,projectId)=>json({status:'prepared',operationId,projectId,message:'A fresh authorization is required for each proposal step.'},202);
  const secret=env.BITTREES_ADMIN_SSO_CLIENT_SECRET;
  const csrf=req=>createHmac('sha256',secret).update('cryptodirectory.csrf.v1:'+(req.headers.get('cookie')||'')).digest('hex');
  async function authenticate(req){
    if(actorAuthenticator)return actorAuthenticator(req);
    const result=await administration(new Request(ORIGIN+'/api/project-admin/access',{headers:req.headers}));
    if(!result.ok)throw fail(result.status===401?'Sign in with email or Ethereum to continue.':'Current project permissions are unavailable.',result.status===401?401:503);
    const data=await result.json();if(typeof data.identity!=='string')throw fail('Sign in to continue',401);
    return {identity:data.identity,subject:subject(data.identity,env.DIRECTORY_JOURNAL_SECRET||secret),permissions:permissions(data.access,now())};
  }
  return async function handle(req){
    const store=storeFactory();
    try{
      const url=new URL(req.url);
      if(url.origin!==ORIGIN||(req.headers.get('host')||url.host)!==url.host)throw fail('Use cd.bittrees.org for signed-in actions.',403);
      if(!['GET','POST'].includes(req.method))throw fail('Method not allowed',405);
      const actor=await authenticate(req),p=actor.permissions;
      if(req.method==='GET'&&url.pathname==='/api/directory/session')return json({identity:actor.identity,...p,csrf:csrf(req),storageConfigured:store.configured()});
      if(req.method==='GET'&&url.pathname==='/api/directory/identity')return json({identity:actor.identity,ensName:await resolveName(actor.identity)});
      if(req.method==='POST'){
        if(writeAuthorizer)await writeAuthorizer(req);
        else{
        if(req.headers.get('origin')!==ORIGIN||req.headers.get('sec-fetch-site')==='cross-site')throw fail('Cross-site request rejected',403);
        const expected=csrf(req),actual=req.headers.get('x-directory-csrf')||'';
        if(actual.length!==expected.length||!timingSafeEqual(Buffer.from(actual),Buffer.from(expected)))throw fail('Refresh your sign-in before trying again.',403);
        }
      }
      const requirePermission=cap=>{if(!p[cap])throw fail('Your role does not allow this action.',403);};
      let capability=null;
      const recheck=async()=>{if(writeAuthorizer)await writeAuthorizer(req);const current=await authenticate(req);if(writeAuthorizer)await writeAuthorizer(req);if(current.subject!==actor.subject||!current.permissions[capability])throw fail('Your permission changed. Refresh before continuing.',403);};
      // Recheck the current signed Roles decision immediately before each write.
      store.authorize=recheck;
      if(req.method==='GET'&&url.pathname==='/api/directory/edit-requests'){
        const current=await store.load();
        const {rows,...pagination}=queuePage((current.value.editRequests||[]).filter(r=>p.canHandleRequests||r.requester===actor.subject).map(({requester,requesterOwner,...r})=>r),url.searchParams);
        return json({requests:rows,...pagination});
      }
      if(req.method==='GET'&&url.pathname==='/api/directory/project'){
        requirePermission('canRequestEdit');const existing=await store.listing(url.searchParams.get('id'));
        const value=parseFrontMatter(existing.raw);if(value.verification_status==='rejected')throw fail('Rejected entries require a separate review.',403);
        return json({id:url.searchParams.get('id'),sha:existing.sha,entry:{...editableFields(value),verification_status:value.verification_status}});
      }
      if(req.method==='GET'&&url.pathname==='/api/directory/submissions'){
        const current=await store.load();
        const records=current.value.submissions.filter(r=>p.canReview||r.submitter===actor.subject).map(({submitter,submitterOwner,...record})=>record);
        const {rows,...pagination}=queuePage(records,url.searchParams);return json({revision:current.value.revision,submissions:rows,...pagination});
      }
      if(req.method==='GET'&&url.pathname==='/api/directory/operation'){
        const operationId=url.searchParams.get('operationId');
        if(!/^[a-f0-9-]{36}$/.test(operationId||''))throw fail('A valid operation ID is required.');
        const current=await store.load();
        const submission=current.value.submissions.find(r=>r.id===operationId&&(r.submitter===actor.subject||p.canReview));
        const change=current.value.editRequests?.find(r=>r.id===operationId&&(r.requester===actor.subject||p.canHandleRequests));
        const edit=current.value.edits.find(r=>r.id===operationId&&(r.actor===actor.subject||p.canEdit));
        const record=submission||change||edit;if(!record)throw fail('Operation not found',404);
        return json({operationId,status:record.status||'recorded',revision:record.revision??null,...(record.proposal?{proposal:record.proposal}:{})});
      }
      if(req.method==='GET'&&url.pathname==='/api/directory/workspace'){
        const {PAGE_COVERAGE}=await import('./editorial-contract.mjs');
        const page=url.searchParams.get('page')||'overview';
        if(!['overview','needs-update','process-status','administration'].includes(page))throw fail('Choose a supported workspace page.');
        if(page==='overview')return json({pages:PAGE_COVERAGE,permissions:p});
        if(page==='administration'){requirePermission('admin');return json({permissions:p,administrationUrl:ORIGIN+'/administration',rolesUrl:'https://roles.bittrees.org/role-management?project=crypto-directory',grantsAndSigning:'Existing Roles, controller and Safe approvals remain required.'});}
        requirePermission('staff');const snapshot=await store.workspaceSnapshot(page==='process-status'?'/data/process-status.json':'/data/projects.json');
        if(page==='process-status')return json({sourceCommit:snapshot.sourceCommit,status:snapshot.data});
        const limit=Number(url.searchParams.get('limit')||20),offset=Number(url.searchParams.get('offset')||0);
        if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0||offset>10000)throw fail('Invalid workspace pagination.');
        const rows=snapshot.data.filter(row=>row.verification_status==='needs_update').sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
        return json({sourceCommit:snapshot.sourceCommit,total:rows.length,listings:rows.slice(offset,offset+limit).map(row=>({id:row.id,...editableFields(row),verification_status:row.verification_status})),nextOffset:offset+limit<rows.length?offset+limit:null});
      }
      if(req.method!=='POST')throw fail('Not found',404);
      const input=await body(req);
      if(url.pathname==='/api/directory/request-edit'){
        requirePermission('canRequestEdit');capability='canRequestEdit';const request=requestedChange(input),{changes,sources}=request,requestHash=hash(JSON.stringify({id:input.id,...request}));
        const current=await store.load(),requests=current.value.editRequests||[],previous=requests.find(r=>r.id===input.operationId);
        if(previous){if(previous.requester!==actor.subject||(previous.requestHash?previous.requestHash!==requestHash:request.kind!=='legacy'||previous.projectId!==input.id||previous.changes!==changes||previous.sources!==sources))throw fail('Edit request operation was already used',409);return json({id:previous.id,status:previous.status},200);}
        if(requests.length>=256)throw fail('The edit request queue is full; contact an administrator.',409);
        if(requests.filter(r=>r.requester===actor.subject&&r.status==='pending').length>=3)throw fail('You already have three edit requests awaiting review.',429);
        const existing=await store.listing(input.id),value=parseFrontMatter(existing.raw);
        if(value.verification_status==='rejected')throw fail('Rejected listings require a separate review.',403);
        if(request.kind!=='legacy'&&request.sha!==existing.sha)throw fail('This listing changed. Reload its details before sending the request.',409);
        const extra={};
        if(request.kind==='edit'){
          extra.original=editableFields(value);extra.patch=Object.fromEntries(Object.entries(request.entry).filter(([key,v])=>JSON.stringify(v)!==JSON.stringify(extra.original[key])));
          if(!Object.keys(extra.patch).length)throw fail('Change at least one listing field, or choose removal.');
        }
        if(request.kind==='removal')extra.removalReasons=request.removalReasons;
        requests.push({id:input.operationId,requester:actor.subject,...(actor.personSubject?{requesterOwner:actor.personSubject}:{}),projectId:input.id,projectName:value.name,listingSha:existing.sha,changes,sources,kind:request.kind,requestHash,...extra,status:'pending',revision:1,createdAt:new Date(now()).toISOString()});
        await recheck();await store.save(current,{...current.value,editRequests:requests,revision:current.value.revision+1});
        return json({id:input.operationId,status:'pending'},201);
      }
      if(url.pathname==='/api/directory/close-edit-request'){
        requirePermission('canHandleRequests');capability='canHandleRequests';strictObject(input,['id','revision','reason']);
        if(typeof input.reason!=='string'||input.reason.trim().length<10||input.reason.length>1000)throw fail('Explain the outcome in at least 10 characters.');
        const current=await store.load(),record=current.value.editRequests?.find(r=>r.id===input.id);
        if(!record)throw fail('Edit request not found',404);
        if(record.status!=='pending'||record.revision!==input.revision)throw fail('This request changed or was already closed.',409);
        record.status='closed';record.revision++;record.outcome={reason:input.reason.trim(),editor:actor.subject,at:new Date(now()).toISOString()};
        await recheck();await store.save(current,{...current.value,revision:current.value.revision+1});
        return json({status:'closed',message:'Edit request closed. Listing changes still require an approved release proposal.'});
      }
      if(url.pathname==='/api/directory/review-edit-request'){
        requirePermission('canReview');capability='canReview';strictObject(input,['id','revision','decision','reason','mode']);
        if(input.mode!==undefined&&!['manual','automatic'].includes(input.mode))throw fail('Choose a valid review mode.');
        if(input.mode==='automatic'){if(!actorAuthenticator)throw fail('Automatic review requires an approved enrolled source connection.',403);requirePermission('canAutoReview');capability='canAutoReview';}
        if(!['accept','reject'].includes(input.decision)||typeof input.reason!=='string'||input.reason.trim().length<10||input.reason.length>1000)throw fail('Choose accept/reject and provide a review rationale.');
        const current=await store.load(),record=current.value.editRequests?.find(r=>r.id===input.id);
        if(!record)throw fail('Edit request not found',404);
        if(sameActor(record.requester,record.requesterOwner,actor))throw fail('A different authorized reviewer must review your request.',403);
        if(record.status==='accepting'){
          if(input.decision!=='accept'||record.review?.reviewer!==actor.subject||record.review.mode!==(input.mode||'manual')||record.review.reason!==input.reason.trim())throw fail('Acceptance needs reconciliation by the original reviewer and decision.',409);
          if(record.review.mode==='automatic'){requirePermission('canAutoReview');capability='canAutoReview';}
          const proposal=await store.reconcile(record.operationId,record.projectId,record.approvedEntry,{body:record.body});
          if(!proposal)return json({status:'held',message:'The source outcome needs administrator reconciliation. No operation was replayed.'},409);
          record.status='accepted';record.proposal=proposal;record.revision++;await recheck();await store.save(current,{...current.value,revision:current.value.revision+1});return json({status:'release-pending',proposal});
        }
        if(record.status!=='pending'||record.revision!==input.revision)throw fail('This request changed or was already reviewed.',409);
        let approvedEntry,preservedBody;
        if(input.decision==='accept'){
          if(!['edit','removal'].includes(record.kind))throw fail('This older request needs an Editor to prepare structured changes before approval.',409);
          const existing=await store.listing(record.projectId),before=parseFrontMatter(existing.raw);
          if(existing.sha!==record.listingSha)throw fail('The listing changed since this request. Request a fresh revision before approval.',409);
          if(before.verification_status==='rejected')throw fail('Rejected listings require a separate review.',403);
          preservedBody=documentBody(existing.raw);
          if(record.kind==='edit'){
            if(!record.patch||typeof record.patch!=='object'||Array.isArray(record.patch)||!Object.keys(record.patch).length)throw fail('Structured field changes are required.',409);
            approvedEntry={...entry({...editableFields(before),...record.patch},{existing:before}),verification_status:'verified'};
            if(await store.duplicate(approvedEntry,record.projectId))throw fail('This update duplicates another listing.',409);
          }else approvedEntry={...before,verification_status:'rejected'};
        }
        record.status=input.decision==='accept'?'accepting':'rejected';record.revision++;
        record.review={decision:input.decision,reviewer:actor.subject,reason:input.reason.trim(),mode:input.mode||'manual',at:new Date(now()).toISOString()};
        if(input.decision==='accept'){record.operationId=operationContext?.operationId||randomUUID();record.approvedEntry=approvedEntry;record.body=preservedBody;}
        const saved=await(async()=>{await recheck();return store.save(current,{...current.value,revision:current.value.revision+1});})();
        if(input.decision==='reject')return json({status:'rejected'});
        if(proposalMode==='prepare')return prepared(record.operationId,record.projectId);
        await recheck();const proposal=await store.proposal(record.operationId,record.projectId,approvedEntry,{existingSha:record.listingSha,reason:input.reason,kind:'edit',body:preservedBody});
        record.status='accepted';record.proposal=proposal;record.revision++;
        await recheck();await store.save({sha:saved,value:current.value},{...current.value,revision:current.value.revision+2});
        return json({status:'release-pending',proposal},201);
      }
      if(url.pathname==='/api/directory/submit'){
        requirePermission('canSubmit');capability='canSubmit';strictObject(input,['entry','operationId']);
        if(!/^[a-f0-9-]{36}$/.test(input.operationId||''))throw fail('A submission operation ID is required');
        const value=entry(input.entry),current=await store.load();
        const previous=current.value.submissions.find(r=>r.id===input.operationId);
        if(previous){if(previous.submitter!==actor.subject||JSON.stringify(previous.entry)!==JSON.stringify(value))throw fail('Submission operation was already used',409);return json({id:previous.id,status:previous.status},200);}
        if(current.value.submissions.length>=256)throw fail('The submission queue is full; contact an administrator.',409);
        if(current.value.submissions.filter(r=>r.submitter===actor.subject&&r.status==='pending').length>=3)throw fail('You already have three submissions awaiting review.',429);
        if(await store.duplicate(value)||current.value.submissions.some(r=>['pending','accepting','accepted'].includes(r.status)&&sameListing(r.entry,value)))throw fail('This project is already listed or awaiting review.',409);
        current.value.submissions.push({id:input.operationId,submitter:actor.subject,...(actor.personSubject?{submitterOwner:actor.personSubject}:{}),entry:value,status:'pending',revision:1,createdAt:new Date(now()).toISOString(),history:[]});
        const next={...current.value,revision:current.value.revision+1};await recheck();await store.save(current,next);
        return json({id:input.operationId,status:'pending'},201);
      }
      if(url.pathname==='/api/directory/edit'){
        requirePermission('canEdit');capability='canEdit';strictObject(input,['id','sha','entry','reason','operationId']);
        if(!/^[a-f0-9-]{36}$/.test(input.operationId||''))throw fail('An update operation ID is required');
        if(typeof input.reason!=='string'||input.reason.trim().length<10||input.reason.length>1000)throw fail('Explain the update in at least 10 characters.');
        const existing=await store.listing(input.id),before=parseFrontMatter(existing.raw);
        if(existing.sha!==input.sha)throw fail('This listing changed. Refresh before editing.',409);
        if(before.verification_status==='rejected')throw fail('Editors cannot restore rejected entries.',403);
        const value=entry(input.entry,{existing:before}),preservedBody=documentBody(existing.raw);
        if(await store.duplicate(value,input.id))throw fail('This update duplicates another listing.',409);
        const current=await store.load(),previous=current.value.edits.find(r=>r.id===input.operationId);
        if(previous){if(previous.actor!==actor.subject||previous.projectId!==input.id||JSON.stringify(previous.entry)!==JSON.stringify(value)||previous.body!==preservedBody)throw fail('Update operation was already used',409);const proposal=await store.reconcile(previous.id,previous.projectId,previous.entry,{body:previous.body});return json(proposal?{status:'release-pending',proposal}:{status:'held',message:'The prior outcome needs administrator reconciliation; no update was replayed.'},proposal?200:409);}
        if(current.value.edits.length>=256)throw fail('The update journal is full; contact an administrator.',409);
        current.value.edits.push({id:input.operationId,actor:actor.subject,projectId:input.id,entry:value,body:preservedBody,existingSha:input.sha,reason:input.reason,...(proposalMode==='prepare'?{status:'prepared'}:{}),createdAt:new Date(now()).toISOString()});
        await recheck();await store.save(current,{...current.value,revision:current.value.revision+1});
        if(proposalMode==='prepare')return prepared(input.operationId,input.id);
        await recheck();const proposal=await store.proposal(input.operationId,input.id,value,{existingSha:input.sha,reason:input.reason,kind:'edit',body:preservedBody});
        return json({status:'release-pending',proposal},201);
      }
      if(url.pathname==='/api/directory/review'){
        requirePermission('canReview');capability='canReview';strictObject(input,['id','revision','decision','reason','mode']);
        if(input.mode!==undefined&&!['manual','automatic'].includes(input.mode))throw fail('Choose a valid review mode.');
        if(input.mode==='automatic'){if(!actorAuthenticator)throw fail('Automatic review requires an approved enrolled source connection.',403);requirePermission('canAutoReview');capability='canAutoReview';}
        if(!['accept','reject'].includes(input.decision)||typeof input.reason!=='string'||input.reason.trim().length<10||input.reason.length>1000)throw fail('Choose accept/reject and provide a review rationale.');
        const current=await store.load(),record=current.value.submissions.find(r=>r.id===input.id);
        if(!record)throw fail('Submission not found',404);
        if(sameActor(record.submitter,record.submitterOwner,actor))throw fail('A different authorized reviewer must review your submission.',403);
        if(record.status==='accepting'){
          const previous=record.history.at(-1);
          if(input.decision!=='accept'||previous?.reviewer!==actor.subject||(previous.mode||'manual')!==(input.mode||'manual')||previous.reason.trim()!==input.reason.trim())throw fail('Acceptance outcome needs reconciliation by the original reviewer and decision.',409);
          if(previous.mode==='automatic'){requirePermission('canAutoReview');capability='canAutoReview';}
          const proposal=await store.reconcile(record.operationId,newProjectId(record.entry.name),record.approvedEntry);
          if(!proposal)return json({status:'held',message:'The acceptance outcome needs administrator reconciliation. No source operation was replayed.'},409);
          record.status='accepted';record.proposal=proposal;record.revision++;await recheck();await store.save(current,{...current.value,revision:current.value.revision+1});return json({status:'release-pending',proposal});
        }
        if(record.status!=='pending'||record.revision!==input.revision)throw fail('This submission changed or was already reviewed.',409);
        let targetId;
        if(input.decision==='accept'){
          targetId=newProjectId(record.entry.name);
          if(current.value.submissions.some(r=>r.id!==record.id&&['pending','accepting','accepted'].includes(r.status)&&sameListing(r.entry,record.entry)))throw fail('Another submission covers this project. Resolve the duplicate first.',409);
          if(await store.duplicate(record.entry))throw fail('This project is already listed. Resolve the duplicate first.',409);
          try{await store.listing(targetId);throw fail('A listing with the same directory ID already exists. Resolve the duplicate first.',409);}catch(error){if(error.status!==404)throw error;}
        }
        record.status=input.decision==='accept'?'accepting':'rejected';record.revision++;
        record.history.push({decision:input.decision,reviewer:actor.subject,reason:input.reason,mode:input.mode||'manual',at:new Date(now()).toISOString()});
        if(input.decision==='accept'){record.operationId=operationContext?.operationId||randomUUID();record.approvedEntry={...record.entry,verification_status:'verified'};}
        const saved=await (async()=>{await recheck();return store.save(current,{...current.value,revision:current.value.revision+1});})();
        if(input.decision==='reject')return json({status:'rejected'});
        if(proposalMode==='prepare')return prepared(record.operationId,targetId);
        await recheck();const proposal=await store.proposal(record.operationId,targetId,record.approvedEntry,{reason:input.reason,kind:'accept'});
        record.status='accepted';record.proposal=proposal;record.revision++;
        await recheck();await store.save({sha:saved,value:current.value},{...current.value,revision:current.value.revision+2});
        return json({status:'release-pending',proposal},201);
      }
      throw fail('Not found',404);
    }catch(error){return json({error:error.status?error.message:'The operation could not be confirmed. Refresh and check its status before retrying.'},error.status||503);}
  };
}
