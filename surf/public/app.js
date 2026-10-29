import {candidates,chooseProject,targetFor,resolveProject,currentSelection,safeUrl} from './core.js';
import {bindVisitLink,clearViewer} from './viewer.js';
const $=id=>document.getElementById(id);
const STORAGE='bittrees.surf.v2';
const state={projects:[],current:null,category:'All waves',mode:'either',seen:[],trail:[],position:-1,saved:[],visits:[],account:null,accountReady:false,accountConfigured:false,remoteSaved:[],busy:false};
let navigation=0,toastTimer,frameTimer,refreshing=false;
try{const s=JSON.parse(localStorage.getItem(STORAGE)||'{}');state.saved=Array.isArray(s.saved)?s.saved.filter(v=>v&&typeof v.id==='string'&&['website','product'].includes(v.type)).slice(0,500):[];state.visits=Array.isArray(s.visits)?s.visits.filter(v=>v&&safeUrl(v.url)).slice(0,300):[];if(['website','product','either'].includes(s.mode))state.mode=s.mode;}catch{}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify({saved:state.saved,visits:state.visits,mode:state.mode}));}catch{toast('Browser storage is unavailable. Your current session still works.');}renderControls();}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3600);}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
function collection(){return state.account?state.remoteSaved:state.saved;}
function savedCurrent(){return state.current&&collection().some(s=>s.id===state.current.id&&s.type===state.current.type);}
function renderControls(){
  $('saved-count').textContent=collection().length;$('save-project').disabled=!state.current||state.busy;
  $('save-project').setAttribute('aria-pressed',String(Boolean(savedCurrent())));$('save-project').setAttribute('aria-label',savedCurrent()?'Remove saved site':'Save this site');
  $('previous').disabled=state.position<=0||state.busy;$('surf-next').disabled=state.busy;
  $('nav-account').textContent=state.account?(state.account.identity.startsWith('0x')?state.account.identity.slice(0,6)+'…'+state.account.identity.slice(-4):state.account.identity):'Sign in';
}
function recordVisit(selection){if(!selection)return;state.visits.unshift({id:selection.id,name:selection.project.name,url:selection.url,type:selection.type,at:new Date().toISOString()});state.visits=state.visits.slice(0,300);persist();}
for(const id of ['open-site','fallback-open','help-open'])bindVisitLink($(id),()=>recordVisit(state.current));
function migrateSaved(){
  let changed=false;
  state.saved=state.saved.map(s=>{const p=resolveProject(s.id,state.projects);if(!p)return s;if(s.id!==p.id)changed=true;return {...s,id:p.id,url:p[s.type]||s.url,name:p.name};});
  try{const previous=JSON.parse(localStorage.getItem('bittrees.surf.v1')||'{}');if(Array.isArray(previous.saved)&&!previous.surfV2Migrated){
    for(const id of previous.saved){const p=resolveProject(id,state.projects);if(p&&!state.saved.some(s=>s.id===p.id&&s.type==='website')){state.saved.push({id:p.id,type:p.website?'website':'product',url:p.website||p.product,name:p.name,savedAt:new Date().toISOString()});changed=true;}}
    // A version marker prevents removed bookmarks being re-imported on reload.
    previous.surfV2Migrated=true;localStorage.setItem('bittrees.surf.v1',JSON.stringify(previous));
  }}catch{}
  if(changed)persist();
}
function renderCategories(){const value=state.category;const categories=[...new Set(state.projects.map(p=>p.category))].sort();$('category').replaceChildren(...['All waves',...categories].map(c=>{const o=node('option','',c==='All waves'?'All categories':c);o.value=c;return o;}));state.category=categories.includes(value)?value:'All waves';$('category').value=state.category;}
function clearCurrent(message){navigation++;clearTimeout(frameTimer);state.current=null;state.busy=false;clearViewer();const u=new URL(location.href);u.searchParams.delete('project');u.searchParams.delete('type');history.replaceState(null,'',u.pathname+u.search);renderControls();if(message)toast(message);}
function showFallback(selection,result){
  $('site-frame').hidden=true;$('site-frame').removeAttribute('src');$('frame-loading').hidden=true;$('frame-help').hidden=true;$('frame-fallback').hidden=false;
  $('fallback-category').textContent=selection.project.category;$('fallback-title').textContent=selection.project.name;$('fallback-description').textContent=selection.project.description;
  $('fallback-reason').textContent=result?.reason==='https-required'?'This site opens in its own tab.':'This site doesn’t allow embedded browsing.';
  $('fallback-detail').textContent='Open it separately, or continue surfing below.';
}
function startFrame(selection,result,token){
  if(token!==navigation)return;
  $('welcome').hidden=true;$('browserbar').hidden=false;$('site-stage').hidden=false;$('site-name').textContent=selection.project.name;
  $('site-domain').textContent=new URL(selection.url).hostname;$('site-icon').textContent=selection.project.name.slice(0,1);$('site-kind').textContent=selection.type;
  for(const id of ['open-site','fallback-open','help-open'])$(id).href=selection.url;
  $('site-frame').title=selection.project.name+' — '+selection.type;
  $('frame-fallback').hidden=true;$('frame-help').hidden=true;
  if(result.status==='external'){showFallback(selection,result);return;}
  $('loading-name').textContent='Loading '+selection.project.name+'…';$('frame-loading').hidden=false;
  $('site-frame').onload=()=>{if(token!==navigation)return;clearTimeout(frameTimer);$('frame-loading').hidden=true;$('frame-help').hidden=false;recordVisit(selection);};
  $('site-frame').hidden=false;$('site-frame').src=result.url||selection.url;
  clearTimeout(frameTimer);frameTimer=setTimeout(()=>{if(token===navigation){$('frame-loading').hidden=true;$('frame-help').hidden=false;}},10000);
}
async function inspect(selection){
  try{const query=new URLSearchParams({project:selection.id,type:selection.type}),r=await fetch('/api/frame?'+query,{signal:AbortSignal.timeout(11000)});if(r.status===404)return {status:'removed'};if(!r.ok)throw Error();return await r.json();}catch{return {status:'unknown',url:selection.url};}
}
async function display(selection,{addTrail=true,inspection=null}={}){
  // Re-resolve every entry point, including rows retained in an open dialog.
  const latest=resolveProject(selection.id,state.projects);
  if(!latest?.[selection.type]){clearCurrent('That destination is no longer available.');return;}
  selection={id:latest.id,project:latest,type:selection.type,url:latest[selection.type]};
  if(state.category!=='All waves'&&state.category!==latest.category){state.category='All waves';$('category').value=state.category;}
  if(state.mode!=='either'&&state.mode!==selection.type){state.mode=selection.type;$('link-mode').value=state.mode;persist();}
  const token=++navigation;clearTimeout(frameTimer);state.current=selection;state.busy=true;renderControls();
  $('welcome').hidden=true;$('site-stage').hidden=false;$('browserbar').hidden=false;$('site-name').textContent=selection.project.name;$('site-domain').textContent=new URL(selection.url).hostname;$('site-kind').textContent=selection.type;$('site-icon').textContent=selection.project.name.slice(0,1);
  $('site-frame').removeAttribute('src');$('site-frame').hidden=true;$('frame-fallback').hidden=true;$('frame-help').hidden=true;$('frame-loading').hidden=false;$('loading-name').textContent='Opening '+selection.project.name+'…';
  for(const id of ['open-site','fallback-open','help-open'])$(id).href=selection.url;
  const result=inspection||await inspect(selection);if(token!==navigation)return;
  if(result.status==='removed'){clearCurrent('This destination is no longer listed. Choose another site.');refreshCatalog();return;}
  if(addTrail){state.trail=state.trail.slice(0,state.position+1);state.trail.push({id:selection.id,type:selection.type});state.position=state.trail.length-1;}
  state.busy=false;startFrame(selection,result,token);renderControls();$('announcement').textContent=selection.project.name+'. '+selection.project.description;
  const u=new URL(location.href);u.searchParams.set('project',selection.id);u.searchParams.set('type',selection.type);history.replaceState(null,'',u.pathname+u.search);
}
async function surf(){
  if(state.busy)return;const pool=candidates(state.projects,state.category,state.mode);
  if(!pool.length){clearCurrent(state.projects.length?'No sites match these filters. Try another category or link type.':'The directory is still loading. Please try again.');return;}
  if(pool.every(p=>state.seen.includes(p.id)))state.seen=[];
  const p=chooseProject(pool,state.seen,state.current?.id);state.seen.push(p.id);const target=targetFor(p,state.mode);
  await display({id:p.id,project:p,...target});
}
async function previous(){if(state.position<=0||state.busy)return;state.position--;const old=state.trail[state.position],p=resolveProject(old.id,state.projects);if(!p||!p[old.type]){clearCurrent('That destination is no longer available.');return;}await display({id:p.id,project:p,type:old.type,url:p[old.type]},{addTrail:false});}
async function updateCatalog(data){
  if(!Array.isArray(data.projects)||!data.projects.length)throw Error('Empty directory');state.projects=data.projects;renderCategories();migrateSaved();
  $('welcome-meta').textContent=`${data.projects.length.toLocaleString()} verified projects · ${new Set(data.projects.map(p=>p.category)).size} categories`+(data.status==='live'?' · Live directory':` · Snapshot ${data.snapshotDate||''}`);
  if(state.current){const refreshed=currentSelection(state.current,state.projects,state.category,state.mode);
    if(!refreshed){const replacement=chooseProject(candidates(state.projects,state.category,state.mode),state.seen);if(replacement){const target=targetFor(replacement,state.mode);await display({id:replacement.id,project:replacement,...target});}else clearCurrent('That destination is no longer available in these filters.');}
    else if(refreshed.url!==state.current.url){await display(refreshed,{addTrail:false});}
    else{state.current=refreshed;$('site-name').textContent=refreshed.project.name;renderControls();}
  }
  const u=new URL(location.href),shared=u.searchParams.get('project');
  if(!state.current&&shared&&!state.trail.length){const p=resolveProject(shared,state.projects),type=u.searchParams.get('type')==='product'?'product':'website';if(p&&p[type])await display({id:p.id,project:p,type,url:p[type]});else{u.searchParams.delete('project');u.searchParams.delete('type');history.replaceState(null,'',u.pathname+u.search);toast('That shared site is no longer available.');}}
}
async function refreshCatalog(){if(refreshing)return;refreshing=true;try{const r=await fetch('/api/catalog',{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();await updateCatalog(await r.json());}catch{if(!state.projects.length)$('welcome-meta').textContent='Directory unavailable. Please try again shortly.';}finally{refreshing=false;}}
async function accountApi(path,body){const r=await fetch('/api/account/'+path,{credentials:'same-origin',cache:'no-store',...(body?{method:'POST',headers:{'Content-Type':'application/json','X-Surf-CSRF':state.account?.csrf||''},body:JSON.stringify(body)}:{})});const result=await r.json();if(!r.ok)throw Object.assign(Error(result.error||'Unable to complete the request.'),{status:r.status});return result;}
async function refreshAccount(){try{const s=await accountApi('session');state.accountConfigured=s.configured;state.account=s.signedIn?s:null;if(state.account)state.remoteSaved=(await accountApi('saved')).saved;else state.remoteSaved=[];}catch{state.account=null;}finally{state.accountReady=true;renderControls();}}
function modal(title){$('modal-title').textContent=title;$('modal-body').replaceChildren();if(!$('modal').open)$('modal').showModal();}
function closeModal(){$('modal').close();}
function signin(pending=false){
  modal('Save with your Bittrees account');$('modal-body').append(node('p','modal-copy','Sign in with the same email or Ethereum identity you use across Bittrees. Your saved websites and products will be available on any device.'));
  const actions=node('div','modal-actions');
  if(state.accountConfigured){const a=node('a','primary','Continue with Bittrees ↗');a.href='https://roles.bittrees.org/sign-in?'+new URLSearchParams({app:'surf',return_to:location.pathname+location.search});if(pending)a.addEventListener('click',()=>{try{sessionStorage.setItem('surf.pending-save',JSON.stringify({id:state.current.id,type:state.current.type}));}catch{}});actions.append(a);}
  else $('modal-body').append(node('p','notice','Bittrees sign-in is temporarily unavailable. You can still save sites on this device.'));
  if(pending){const local=node('button','secondary','Save on this device');local.addEventListener('click',()=>{saveLocal();closeModal();});actions.append(local);}
  $('modal-body').append(actions);
}
function saveLocal(){if(!state.current)return;const c=state.current,key=s=>s.id===c.id&&s.type===c.type;if(state.saved.some(key)){state.saved=state.saved.filter(s=>!key(s));toast('Removed from saved.');}else{state.saved.push({id:c.id,type:c.type,url:c.url,name:c.project.name,savedAt:new Date().toISOString()});toast('Saved on this device.');}persist();}
async function saveCurrent(){if(!state.current)return;if(!state.account){if(savedCurrent())saveLocal();else signin(true);return;}const c=state.current;try{const removing=savedCurrent();await accountApi('saved',{action:removing?'remove':'save',id:c.id,type:c.type});await refreshAccount();toast(removing?'Removed from saved.':'Saved to your Bittrees collection.');}catch(e){toast(e.message);if(e.status===401)await refreshAccount();}}
function showSaved(){
  modal('Saved sites');const items=collection();$('modal-body').append(node('p','modal-copy',state.account?'Your Bittrees collection.':'Saved on this device. Sign in to keep a collection across devices.'));
  if(!state.account){const b=node('button','secondary','Sign in with Bittrees');b.addEventListener('click',()=>signin());$('modal-body').append(b);}
  if(state.account&&state.saved.length){const b=node('button','secondary',`Import ${state.saved.length} saved from this device`);b.addEventListener('click',async()=>{b.disabled=true;let imported=0;try{for(const item of state.saved){const p=resolveProject(item.id,state.projects);if(p?.[item.type]){await accountApi('saved',{action:'save',id:p.id,type:item.type});imported++;}}state.saved=[];persist();await refreshAccount();showSaved();toast(`${imported} saved sites imported.`);}catch(e){toast(e.message);b.disabled=false;}});$('modal-body').append(b);}
  if(!items.length)$('modal-body').append(node('p','empty-state','No saved sites yet. Press the bookmark button while surfing.'));
  for(const item of items){const p=resolveProject(item.id,state.projects),row=node('div','collection-item'),main=node('div','collection-main'),title=node('button','collection-title',p?.name||item.name||'Unavailable project');title.disabled=!p?.[item.type];title.addEventListener('click',()=>{closeModal();display({id:p.id,project:p,type:item.type,url:p[item.type]});});main.append(title,node('p','collection-meta',`${item.type==='product'?'Product':'Website'} · ${p?.[item.type]?new URL(p[item.type]).hostname:'No longer listed'}`));const remove=node('button','remove-save','Remove');remove.addEventListener('click',async()=>{try{if(state.account){await accountApi('saved',{action:'remove',id:item.id,type:item.type});await refreshAccount();}else{state.saved=state.saved.filter(s=>!(s.id===item.id&&s.type===item.type));persist();}showSaved();}catch(e){toast(e.message);}});row.append(main,remove);$('modal-body').append(row);}
}
function showAccount(){if(!state.account){signin();return;}modal('Your Bittrees account');$('modal-body').append(node('p','account-label',state.account.identity));const saved=node('button','primary','View saved sites');saved.addEventListener('click',showSaved);const logout=node('button','secondary','Sign out');logout.addEventListener('click',async()=>{try{await accountApi('logout',{});state.account=null;state.remoteSaved=[];renderControls();closeModal();}catch(e){toast(e.message);}});const actions=node('div','modal-actions');actions.append(saved,logout);$('modal-body').append(actions);}
function showExplore(){modal('Explore the directory');const input=node('input','modal-search');input.type='search';input.placeholder='Search projects, categories, ecosystems';input.setAttribute('aria-label','Search the directory');const results=node('div');let limit=40;function render(){const matches=candidates(state.projects,'All waves','either',input.value);results.replaceChildren();if(!matches.length)results.append(node('p','empty-state','No projects found.'));for(const p of matches.slice(0,limit)){const row=node('div','collection-item'),main=node('div','collection-main'),title=node('button','collection-title',p.name);const stableId=p.id;title.addEventListener('click',()=>{closeModal();const latest=resolveProject(stableId,state.projects);if(!latest){clearCurrent('That project is no longer listed.');return;}const type=latest.website?'website':'product';display({id:stableId,type});});main.append(title,node('p','collection-meta',p.category));row.append(main);results.append(row);}if(matches.length>limit){const more=node('button','secondary','Show more');more.addEventListener('click',()=>{limit+=40;render();});results.append(more);}}input.addEventListener('input',()=>{limit=40;render();});$('modal-body').append(input,results);render();input.focus();}
function showInfo(){if(!state.current)return;const p=state.current.project;modal(p.name);$('modal-body').append(node('p','modal-copy',p.description),node('p','collection-meta',`${p.category} · ${p.ecosystems.join(', ')}`));const actions=node('div','modal-actions');for(const [type,url] of [['website',p.website],['product',p.product]])if(url){const b=node('button','secondary',type==='website'?'View website':'View product');b.addEventListener('click',()=>{closeModal();display({id:p.id,project:p,type,url});});actions.append(b);}$('modal-body').append(actions);const source=node('a','modal-copy','View CryptoDirectory ↗');source.href='https://cd.bittrees.org';source.target='_blank';source.rel='noopener noreferrer';$('modal-body').append(source);}
$('surf-next').addEventListener('click',surf);$('start-surf').addEventListener('click',surf);$('fallback-next').addEventListener('click',surf);$('previous').addEventListener('click',previous);$('save-project').addEventListener('click',saveCurrent);$('nav-saved').addEventListener('click',showSaved);$('nav-account').addEventListener('click',showAccount);$('site-info').addEventListener('click',showInfo);
$('nav-explore').addEventListener('click',showExplore);
$('category').addEventListener('change',e=>{state.category=e.target.value;if(state.current)surf();});$('link-mode').value=state.mode;$('link-mode').addEventListener('change',e=>{state.mode=e.target.value;persist();if(state.current)surf();});
$('how-it-works').addEventListener('click',()=>{modal('How Surf works');for(const text of ['Choose a category and press Surf to discover a random website or product from CryptoDirectory. The site opens directly beneath the toolbar.','Some sites prevent embedding. Surf respects those settings and offers an external link instead.','Bookmark a website or product to save it. Sign in with your Bittrees account for a collection across devices, or keep saves on this device.','Directory edits appear automatically. Listings are informational and do not imply endorsement.'])$('modal-body').append(node('p','modal-copy',text));});
$('close-modal').addEventListener('click',closeModal);$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey||$('modal').open||['INPUT','SELECT','TEXTAREA','BUTTON','A','IFRAME'].includes(document.activeElement?.tagName))return;if(e.key.toLowerCase()==='n')surf();if(e.key.toLowerCase()==='s'&&state.current)saveCurrent();});
renderControls();
try{const r=await fetch('/catalog.json');if(r.ok)await updateCatalog(await r.json());}catch{}
await refreshAccount();
try{const pending=JSON.parse(sessionStorage.getItem('surf.pending-save')||'null');if(pending&&state.account){sessionStorage.removeItem('surf.pending-save');const p=resolveProject(pending.id,state.projects);if(p?.[pending.type]){await accountApi('saved',{action:'save',id:p.id,type:pending.type});await refreshAccount();toast('Saved to your Bittrees collection.');}}}catch{}
refreshCatalog();setInterval(()=>{if(document.visibilityState==='visible')refreshCatalog();},300000);
window.addEventListener('focus',()=>{refreshAccount();refreshCatalog();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshCatalog();});
