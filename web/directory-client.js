const canonical='https://cd.bittrees.org';
const local=location.origin===canonical||['127.0.0.1','localhost'].includes(location.hostname);
const byId=id=>document.getElementById(id);
let session=null,loading=false,initialized=false;
const ensNames=new Map();
const show=(selector,visible)=>document.querySelectorAll(selector).forEach(node=>{node.hidden=!visible;});
function message(text){const node=byId('directory-message');if(node)node.textContent=text;}
function requestDestination(){const params=new URLSearchParams(location.search),target=new URL('/request-edit.html',canonical),id=params.get('id');if(/^[-a-z0-9]{1,120}\.md$/.test(id||''))target.searchParams.set('id',id);return target.pathname+target.search;}
function signInReturn(requested=location.pathname+location.search){
  if(!requested.startsWith('/')||requested.startsWith('//')||/[\\\r\n]/.test(requested))return requested;
  const page=new URL(requested,canonical);if(page.pathname!=='/request-edit.html')return requested;
  const target=new URL('/submit.html',canonical);target.searchParams.set('form','request-edit');const id=page.searchParams.get('id');if(/^[-a-z0-9]{1,120}\.md$/.test(id||''))target.searchParams.set('id',id);return target.pathname+target.search;
}
async function api(route,body,{signal}={}){
  const response=await fetch('/api/directory/'+route,{credentials:'same-origin',cache:'no-store',signal,...(body?{method:'POST',headers:{'Content-Type':'application/json','X-Directory-CSRF':session?.csrf||''},body:JSON.stringify(body)}:{})});
  const result=await response.json();if(!response.ok){if([401,403].includes(response.status))clear();throw Object.assign(Error(result.error||'Unable to complete the request.'),{status:response.status});}return result;
}
function clear(){session=null;show('[data-staff]',false);show('[data-can-edit]',false);show('[data-can-review]',false);show('[data-can-submit]',false);show('[data-can-request-edit]',false);show('[data-request-unavailable]',false);show('[data-signed-in]',false);show('[data-signed-out]',true);const identity=byId('directory-identity');if(identity){identity.textContent='';identity.removeAttribute('title');}}
function apply(value){
  session=value;
  show('[data-staff]',value.staff);show('[data-can-edit]',value.canEdit);show('[data-can-review]',value.canReview);show('[data-can-submit]',value.canSubmit);show('[data-signed-in]',true);show('[data-signed-out]',false);
  show('[data-can-request-edit]',value.canRequestEdit);show('[data-request-unavailable]',!value.canRequestEdit);
  show('[data-review-unavailable]',value.staff&&!value.canReview);
  const identity=byId('directory-identity');if(identity)identity.textContent=value.identity.startsWith('0x')?value.identity.slice(0,6)+'…'+value.identity.slice(-4):value.identity;
  if(identity){identity.title=value.identity;if(/^0x[a-f0-9]{40}$/i.test(value.identity)){
    const cached=ensNames.get(value.identity),lookup=cached&&cached.until>Date.now()?cached.lookup:fetch('/api/directory/identity',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(5000)}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(ensNames.size>=32)ensNames.delete(ensNames.keys().next().value);
    ensNames.set(value.identity,{lookup,until:Date.now()+300000});
    lookup.then(result=>{if(session===value&&result?.identity===value.identity&&typeof result.ensName==='string'&&result.ensName.length<=255)identity.textContent=result.ensName;});
  }}
  const role=byId('directory-role');if(role)role.textContent=value.superadmin?'Superadmin':value.admin?'Admin':value.editor&&value.reviewer?'Editor · Reviewer':value.editor?'Editor':value.reviewer?'Reviewer':'Submitter';
}
async function refresh({resume=false}={}){
  if(loading||!local)return;loading=true;
  try{const previous=session?JSON.stringify([session.identity,session.staff,session.canEdit,session.canReview,session.canSubmit]):null;const value=await api('session');apply(value);if(initialized&&previous!==JSON.stringify([value.identity,value.staff,value.canEdit,value.canReview,value.canSubmit]))location.reload();}
  catch(error){clear();if(resume){try{const response=await fetch('/api/project-admin/sso/status',{credentials:'same-origin',cache:'no-store'}),value=await response.json();if(value.configured&&value.action==='resume'){location.replace('/api/project-admin/sso/start?'+new URLSearchParams({mode:'resume',return_to:location.pathname+location.search}));return;}}catch{}}
    message(error.status===401?'':error.message);
  }finally{loading=false;}
}
function readEntry(form){const data=new FormData(form),result={};for(const key of ['name','lead_category','description','primary_url','product_url','founded','hq','token','token_url','twitter'])result[key]=String(data.get(key)||'').trim()||(['product_url','founded','token','token_url','twitter'].includes(key)?'n/a':key==='hq'?'Metaverse':'');for(const key of ['tags','ecosystem'])result[key]=String(data.get(key)||'').split(',').map(v=>v.trim()).filter(Boolean);return result;}
function fill(form,value){for(const [key,v] of Object.entries(value)){const control=form.elements.namedItem(key);if(control)control.value=key==='token_url'&&v==='n/a'?'':Array.isArray(v)?v.join(', '):v;}}
function patchTable(record){
  const table=document.createElement('table');table.className='request-comparison';const head=document.createElement('thead'),row=document.createElement('tr');
  for(const text of ['Field','At time of request','Requested value']){const th=document.createElement('th');th.scope='col';th.textContent=text;row.append(th);}head.append(row);table.append(head);const body=document.createElement('tbody');
  for(const [key,value] of Object.entries(record.patch||{})){const tr=document.createElement('tr'),label=document.querySelector('[data-field-label][name="'+CSS.escape(key)+'"]')?.dataset.fieldLabel||key.replaceAll('_',' ');for(const v of [label,record.original?.[key]??'n/a',value]){const td=document.createElement('td');td.textContent=Array.isArray(v)?v.join(', '):String(v);tr.append(td);}body.append(tr);}table.append(body);return table;
}
function proposalMessage(result){if(result.proposal){message('Saved for release review. The public listing changes after approval and the next synchronized release.');const link=byId('directory-result');if(link&&/^https:\/\/github\.com\/Bittrees-Technology\/crypto-directory\/pull\/\d+$/.test(result.proposal.url)){link.href=result.proposal.url;link.textContent='View release proposal';link.hidden=false;}}else message(result.status==='rejected'?'Submission rejected.':result.message||'Submission received. It is awaiting an independent reviewer.');}
async function reviewQueue(){
  const root=byId('directory-review');if(!root||!session?.canReview)return;
  const result=await api('submissions');root.replaceChildren();
  const pending=result.submissions.filter(r=>['pending','accepting'].includes(r.status));
  if(!pending.length){const empty=document.createElement('p');empty.textContent='No new submissions are waiting for review.';root.append(empty);return;}
  for(const record of pending){
    const card=document.createElement('article');card.className='card review-card';
    const heading=document.createElement('h2');heading.textContent=record.entry.name;card.append(heading);
    const details=document.createElement('dl');for(const [key,value] of Object.entries(record.entry)){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key.replaceAll('_',' ');dd.textContent=Array.isArray(value)?value.join(', '):value;details.append(dt,dd);}card.append(details);
    const label=document.createElement('label');label.textContent='Review rationale';const reason=document.createElement('textarea');reason.minLength=10;reason.maxLength=1000;reason.required=true;if(record.status==='accepting')reason.value=record.history.at(-1)?.reason||'';label.append(reason);card.append(label);
    const state=document.createElement('p');state.setAttribute('role','status');card.append(state);
    for(const decision of record.status==='accepting'?['accept']:['accept','reject']){const button=document.createElement('button');button.type='button';button.textContent=record.status==='accepting'?'Check acceptance outcome':decision==='accept'?'Accept for release review':'Reject';button.addEventListener('click',async()=>{if(!reason.reportValidity())return;button.disabled=true;try{await refresh();if(!session?.canReview)throw Error('Reviewer access is required.');const response=await api('review',{id:record.id,revision:record.revision,decision,reason:reason.value});proposalMessage(response);await reviewQueue();}catch(error){state.textContent=error.message;}finally{button.disabled=false;}});card.append(button);}
    root.append(card);
  }
}
async function ownSubmissions(){const root=byId('my-submissions');if(!root||!session?.canSubmit)return;const result=await api('submissions');root.replaceChildren();for(const record of result.submissions){const p=document.createElement('p');p.textContent=record.entry.name+' — '+(record.status==='accepted'?'accepted; see release proposal':record.status);if(record.proposal&&/^https:\/\/github\.com\/Bittrees-Technology\/crypto-directory\/pull\/\d+$/.test(record.proposal.url)){const link=document.createElement('a');link.href=record.proposal.url;link.textContent=' Release proposal';p.append(link);}root.append(p);}}
async function editRequests(){
  const root=byId('edit-requests');if(!root||!session)return;
  byId('edit-requests-heading').textContent=session.canEdit?'Edit and removal requests':'Your change requests';
  const result=await api('edit-requests');root.replaceChildren();
  if(!result.requests.length){root.textContent='No edit requests yet.';return;}
  for(const record of result.requests){
    const card=document.createElement('article');card.className='review-card';
    const title=document.createElement('h3');title.textContent=record.projectName+' — '+(record.kind==='removal'?'removal requested · ':'')+record.status;card.append(title);
    if(record.patch)card.append(patchTable(record));
    if(record.kind==='removal'){const reasons=document.createElement('ul');for(const reason of record.removalReasons||[]){const li=document.createElement('li');li.textContent=document.querySelector('[data-reason-label][value="'+CSS.escape(reason)+'"]')?.dataset.reasonLabel||reason;reasons.append(li);}card.append(reasons);}
    for(const text of [record.changes,record.sources,record.outcome?.reason].filter(Boolean)){const p=document.createElement('p');p.className='request-details';p.textContent=text;card.append(p);}
    if(session.canEdit&&record.status==='pending'){
      const link=document.createElement('a');link.href=record.kind==='removal'?'https://github.com/Bittrees-Technology/crypto-directory/blob/main/content/projects/'+encodeURIComponent(record.projectId):'edit.html?'+new URLSearchParams({id:record.projectId,request:record.id});link.textContent=record.kind==='removal'?'View listing source for removal review':'Open listing editor';card.append(link);
      const label=document.createElement('label');label.textContent='Review outcome';const reason=document.createElement('textarea');reason.minLength=10;reason.maxLength=1000;reason.required=true;label.append(reason);card.append(label);
      const close=document.createElement('button');close.type='button';close.textContent='Close request';close.addEventListener('click',async()=>{if(!reason.reportValidity())return;close.disabled=true;try{await refresh();const response=await api('close-edit-request',{id:record.id,revision:record.revision,reason:reason.value});message(response.message);await editRequests();}catch(error){message(error.message);}finally{close.disabled=false;}});card.append(close);
      const note=document.createElement('p');note.textContent=record.kind==='removal'?'An administrator must prepare a separate removal proposal for independent release approval. Closing this request does not remove the listing.':'Closing a request does not change the listing. Propose changes in the editor for independent release approval.';card.append(note);
    }
    root.append(card);
  }
}
async function requestEditForm(){
  const form=byId('listing-request-form');if(!form||!session?.canRequestEdit)return;
  if(!session.storageConfigured){message('The edit request connection is awaiting administrator setup.');form.querySelector('button[type=submit]').disabled=true;return;}
  const select=form.elements.namedItem('id'),remove=byId('request-removal'),details=byId('request-listing-fields'),reasons=byId('removal-reasons'),button=form.querySelector('button[type=submit]'),status=byId('request-loading'),checks=[...form.querySelectorAll('[name=removalReasons]')];
  let operationId=crypto.randomUUID(),current=null,serial=0,busy=false,controller;
  function mode(){const ready=!!current&&!busy;details.hidden=remove.checked;details.disabled=!ready||remove.checked;reasons.hidden=!remove.checked;reasons.disabled=!ready||!remove.checked;remove.disabled=!ready;select.disabled=busy;button.disabled=!ready;button.textContent=remove.checked?'Send removal request':'Send edit request';form.elements.namedItem('changes').disabled=busy;form.elements.namedItem('sources').disabled=busy;checks[0].setCustomValidity(remove.checked&&!checks.some(c=>c.checked)?'Choose at least one removal reason.':'');}
  async function load(){
    const id=select.value,token=++serial,actor=session?.identity;controller?.abort();controller=new AbortController();current=null;form.reset();select.value=id;operationId=crypto.randomUUID();mode();status.textContent=id?'Loading current listing details…':'Choose a listing to load its current details.';if(!id)return;
    try{const result=await api('project?id='+encodeURIComponent(id),null,{signal:controller.signal});if(token!==serial||session?.identity!==actor||!session?.canRequestEdit)return;if(result.id!==id||!/^[a-f0-9]{40}$/.test(result.sha))throw Error('The listing details could not be confirmed.');fill(form,result.entry);current={id,sha:result.sha};status.textContent='Current details loaded. Change the fields below, or request removal.';mode();}
    catch(error){if(token===serial&&error.name!=='AbortError'){status.textContent=error.message;mode();}}
  }
  select.addEventListener('change',load);remove.addEventListener('change',mode);checks.forEach(c=>c.addEventListener('change',mode));
  form.addEventListener('submit',async event=>{
    event.preventDefault();mode();if(busy||!current||!form.reportValidity())return;
    const data=new FormData(form),actor=session?.identity,kind=remove.checked?'removal':'edit',input={id:current.id,sha:current.sha,kind,changes:String(data.get('changes')),sources:String(data.get('sources')),operationId,...(kind==='edit'?{entry:readEntry(form)}:{removalReasons:data.getAll('removalReasons')})};busy=true;mode();
    try{await refresh();if(!session?.canRequestEdit||session.identity!==actor)throw Error('Your sign-in changed. Reload before sending this request.');const result=await api('request-edit',input);message(result.status==='closed'?'This request has already been reviewed.':kind==='removal'?'Removal request received. The listing stays visible until review and release approval.':'Edit request received. An Editor or Admin will review it before any listing changes.');current=null;form.reset();status.textContent='Choose a listing to load its current details.';operationId=crypto.randomUUID();await editRequests();}catch(error){message(error.message);}finally{busy=false;mode();}
  });
  const selected=new URLSearchParams(location.search).get('id');if(selected)select.value=selected;await load();
}
async function loadListingEditor(form,id){
  const result=await api('project?id='+encodeURIComponent(id||''));fill(form,result.entry);
  const requestId=new URLSearchParams(location.search).get('request');
  if(requestId){
    const requests=await api('edit-requests'),request=requests.requests.find(r=>r.id===requestId&&r.projectId===id);
    if(request){
      if(request.kind==='removal')throw Error('Removal requests require a separate administrator release proposal. This editor changes listing details only.');
      const note=document.createElement('p');note.className='request-details';note.textContent='Requested correction: '+request.changes+(request.sources?' Sources: '+request.sources:'');
      if(request.patch){if(request.listingSha===result.sha){fill(form,request.patch);note.textContent+=' Requested field changes are loaded into the draft below.';}else note.textContent+=' The listing changed since this request. Current values have been kept; compare the requested changes before editing.';form.before(patchTable(request));}
      form.before(note);form.elements.namedItem('reason').value='Edit request '+request.id+': '+request.changes.slice(0,600)+(request.sources?' Sources: '+request.sources.slice(0,250):'');
    }
  }
  return result.sha;
}
async function start(){
  clear();
  document.querySelectorAll('[data-login-link]').forEach(link=>{link.href=canonical+'/sign-in?'+new URLSearchParams({return_to:signInReturn()});});
  if(!local)document.querySelectorAll('.header-forms a').forEach(link=>{link.href=new URL(link.getAttribute('href'),canonical+location.pathname).href;});
  if(!local)return;
  if(location.pathname==='/sign-in'||location.pathname==='/sign-in.html'){
    const query=new URLSearchParams(location.search),target=new URL('https://roles.bittrees.org/sign-in');target.searchParams.set('app','crypto-directory');target.searchParams.set('return_to',signInReturn(query.get('return_to')||'/'));location.replace(target.href);return;
  }
  await refresh({resume:true});
  // The shared issuer already permits submit.html. Resume this exact form
  // inside the app after authentication, without accepting an arbitrary URL.
  if(session&&location.pathname==='/submit.html'&&new URLSearchParams(location.search).get('form')==='request-edit'){location.replace(requestDestination());return;}
  if(session){
    if(session.canEdit)document.querySelectorAll('[data-edit-entry]').forEach(link=>{link.hidden=false;});
    const form=byId('listing-form');
    if(form){
      form.addEventListener('submit',event=>event.preventDefault());
      const edit=form.dataset.mode==='edit',id=new URLSearchParams(location.search).get('id');let sha;
      if(edit&&!session.canEdit){message('An Editor, Admin or Superadmin role is required to update listings.');return;}
      if(!edit&&!session.canSubmit){message('Your staff role does not include new submissions.');return;}
      if(!session.storageConfigured){message('The submission connection is awaiting administrator setup. Your sign-in and permissions are available.');form.querySelector('button[type=submit]').disabled=true;return;}
      if(edit){try{sha=await loadListingEditor(form,id);}catch(error){form.querySelector('button[type=submit]').disabled=true;throw error;}}
      let operationId=crypto.randomUUID();
      form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('button[type=submit]');button.disabled=true;try{await refresh();const value=readEntry(form);const result=await api(edit?'edit':'submit',edit?{id,sha,entry:value,reason:String(new FormData(form).get('reason')||''),operationId}:{entry:value,operationId});proposalMessage(result);if(!edit){form.reset();operationId=crypto.randomUUID();await ownSubmissions();}else form.hidden=true;}catch(error){message(error.message);}finally{button.disabled=false;}});
    }
    await reviewQueue();await ownSubmissions();await requestEditForm();await editRequests();
  }
}
byId('directory-logout')?.addEventListener('click',async()=>{await fetch('/api/project-admin/logout',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:'{}'});clear();message('');});
window.addEventListener('focus',()=>refresh());
document.addEventListener('directory-rows-rendered',()=>show('[data-can-edit]',Boolean(session?.canEdit)));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
start().catch(error=>message(error.message)).finally(()=>{initialized=true;});
