import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {createProjectAdministration} from '../../shared/roles-administration/project-administration/portal.mjs';
import {GitHubStore} from './github.mjs';
import {ORIGIN,permissions,fail,entry,subject,strictObject,parseFrontMatter,newProjectId} from './model.mjs';

const headers={'Cache-Control':'private, no-store','Pragma':'no-cache','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};
const json=(value,status=200)=>Response.json(value,{status,headers});
async function body(req){
  if(!req.headers.get('content-type')?.startsWith('application/json'))throw fail('Use JSON requests',415);
  const reader=req.body?.getReader();if(!reader)throw fail('Request body is required');let bytes=0,parts=[];
  while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>16384){await reader.cancel();throw fail('Request is too large',413);}parts.push(value);}
  try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw fail('Invalid request data');}
}
export function createDirectoryService({env=process.env,fetcher=fetch,administration=createProjectAdministration('crypto-directory',{env,fetcher}),storeFactory=()=>new GitHubStore({env,fetcher}),now=Date.now}={}){
  const secret=env.BITTREES_ADMIN_SSO_CLIENT_SECRET;
  const csrf=req=>createHmac('sha256',secret).update('cryptodirectory.csrf.v1:'+(req.headers.get('cookie')||'')).digest('hex');
  async function authenticate(req){
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
      if(req.method==='POST'){
        if(req.headers.get('origin')!==ORIGIN||req.headers.get('sec-fetch-site')==='cross-site')throw fail('Cross-site request rejected',403);
        const expected=csrf(req),actual=req.headers.get('x-directory-csrf')||'';
        if(actual.length!==expected.length||!timingSafeEqual(Buffer.from(actual),Buffer.from(expected)))throw fail('Refresh your sign-in before trying again.',403);
      }
      const requirePermission=cap=>{if(!p[cap])throw fail('Your role does not allow this action.',403);};
      let capability=null;
      const recheck=async()=>{const current=await authenticate(req);if(current.subject!==actor.subject||!current.permissions[capability])throw fail('Your permission changed. Refresh before continuing.',403);};
      // Recheck the current signed Roles decision immediately before each write.
      store.authorize=recheck;
      if(req.method==='GET'&&url.pathname==='/api/directory/project'){
        requirePermission('canEdit');const existing=await store.listing(url.searchParams.get('id'));
        const value=parseFrontMatter(existing.raw);if(value.verification_status==='rejected')throw fail('Rejected entries require a separate review.',403);
        return json({id:url.searchParams.get('id'),sha:existing.sha,entry:value});
      }
      if(req.method==='GET'&&url.pathname==='/api/directory/submissions'){
        const current=await store.load();
        const records=current.value.submissions.filter(r=>p.canReview||r.submitter===actor.subject).map(({submitter,...record})=>record);
        return json({revision:current.value.revision,submissions:records});
      }
      if(req.method!=='POST')throw fail('Not found',404);
      const input=await body(req);
      if(url.pathname==='/api/directory/submit'){
        requirePermission('canSubmit');capability='canSubmit';strictObject(input,['entry','operationId']);
        if(!/^[a-f0-9-]{36}$/.test(input.operationId||''))throw fail('A submission operation ID is required');
        const value=entry(input.entry),current=await store.load();
        const previous=current.value.submissions.find(r=>r.id===input.operationId);
        if(previous){if(previous.submitter!==actor.subject||JSON.stringify(previous.entry)!==JSON.stringify(value))throw fail('Submission operation was already used',409);return json({id:previous.id,status:previous.status},200);}
        if(current.value.submissions.length>=256)throw fail('The submission queue is full; contact an administrator.',409);
        if(current.value.submissions.filter(r=>r.submitter===actor.subject&&r.status==='pending').length>=3)throw fail('You already have three submissions awaiting review.',429);
        if(await store.duplicate(value)||current.value.submissions.some(r=>['pending','accepting','accepted'].includes(r.status)&&r.entry.name.toLowerCase()===value.name.toLowerCase()))throw fail('This project is already listed or awaiting review.',409);
        current.value.submissions.push({id:input.operationId,submitter:actor.subject,entry:value,status:'pending',revision:1,createdAt:new Date(now()).toISOString(),history:[]});
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
        const value=entry(input.entry,{existing:before});
        if(await store.duplicate(value,input.id))throw fail('This update duplicates another listing.',409);
        const current=await store.load(),previous=current.value.edits.find(r=>r.id===input.operationId);
        if(previous){if(previous.actor!==actor.subject||previous.projectId!==input.id||JSON.stringify(previous.entry)!==JSON.stringify(value))throw fail('Update operation was already used',409);const proposal=await store.reconcile(previous.id,previous.projectId,previous.entry);return json(proposal?{status:'release-pending',proposal}:{status:'held',message:'The prior outcome needs administrator reconciliation; no update was replayed.'},proposal?200:409);}
        if(current.value.edits.length>=256)throw fail('The update journal is full; contact an administrator.',409);
        current.value.edits.push({id:input.operationId,actor:actor.subject,projectId:input.id,entry:value,createdAt:new Date(now()).toISOString()});
        await recheck();await store.save(current,{...current.value,revision:current.value.revision+1});
        await recheck();const proposal=await store.proposal(input.operationId,input.id,value,{existingSha:input.sha,reason:input.reason,kind:'edit'});
        return json({status:'release-pending',proposal},201);
      }
      if(url.pathname==='/api/directory/review'){
        requirePermission('canReview');capability='canReview';strictObject(input,['id','revision','decision','reason']);
        if(!['accept','reject'].includes(input.decision)||typeof input.reason!=='string'||input.reason.trim().length<10||input.reason.length>1000)throw fail('Choose accept/reject and provide a review rationale.');
        const current=await store.load(),record=current.value.submissions.find(r=>r.id===input.id);
        if(!record)throw fail('Submission not found',404);
        if(record.submitter===actor.subject)throw fail('A different authorized reviewer must review your submission.',403);
        if(record.status==='accepting'){
          if(input.decision!=='accept')throw fail('Acceptance outcome needs reconciliation before another decision.',409);
          const proposal=await store.reconcile(record.operationId,newProjectId(record.entry.name),record.approvedEntry);
          if(!proposal)return json({status:'held',message:'The acceptance outcome needs administrator reconciliation. No source operation was replayed.'},409);
          record.status='accepted';record.proposal=proposal;record.revision++;await recheck();await store.save(current,{...current.value,revision:current.value.revision+1});return json({status:'release-pending',proposal});
        }
        if(record.status!=='pending'||record.revision!==input.revision)throw fail('This submission changed or was already reviewed.',409);
        if(input.decision==='accept'&&await store.duplicate(record.entry))throw fail('This project is already listed. Resolve the duplicate first.',409);
        record.status=input.decision==='accept'?'accepting':'rejected';record.revision++;
        record.history.push({decision:input.decision,reviewer:actor.subject,reason:input.reason,at:new Date(now()).toISOString()});
        if(input.decision==='accept'){record.operationId=randomUUID();record.approvedEntry={...record.entry,verification_status:'verified'};}
        const saved=await (async()=>{await recheck();return store.save(current,{...current.value,revision:current.value.revision+1});})();
        if(input.decision==='reject')return json({status:'rejected'});
        await recheck();const proposal=await store.proposal(record.operationId,newProjectId(record.entry.name),record.approvedEntry,{reason:input.reason,kind:'accept'});
        record.status='accepted';record.proposal=proposal;record.revision++;
        await recheck();await store.save({sha:saved,value:current.value},{...current.value,revision:current.value.revision+2});
        return json({status:'release-pending',proposal},201);
      }
      throw fail('Not found',404);
    }catch(error){return json({error:error.status?error.message:'The operation could not be confirmed. Refresh and check its status before retrying.'},error.status||503);}
  };
}
