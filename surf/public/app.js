import { candidates, chooseProject, targetFor, safeUrl } from './core.js';
const $ = id => document.getElementById(id);
const STORAGE = 'bittrees.surf.v1';
const state = { projects: [], current: null, category: 'All waves', mode: 'either', auto: false, saved: [], history: [], seen: [], waves: 0 };
let toastTimer;
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE) || '{}');
  state.saved = Array.isArray(stored.saved) ? stored.saved.filter(x => typeof x === 'string').slice(0, 1000) : [];
  state.history = Array.isArray(stored.history) ? stored.history.filter(h => h && safeUrl(h.url) && typeof h.name === 'string' && typeof h.id === 'string').slice(0, 300) : [];
  if (['website','product','either'].includes(stored.mode)) state.mode = stored.mode;
  state.auto = stored.auto === true;
} catch { storageAvailable = false; }
function persist() {
  try { localStorage.setItem(STORAGE, JSON.stringify({ saved: state.saved, history: state.history, mode: state.mode, auto: state.auto })); }
  catch { if (storageAvailable) toast('Browser storage is full or unavailable. This session still works.'); storageAvailable = false; }
  counts();
}
function counts() { $('saved-count').textContent = state.saved.length; $('history-count').textContent = state.history.length; }
function toast(message) { $('toast').textContent = message; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3300); }
function announce(message) { $('announcement').textContent = message; }
function node(tag, className, text) { const n = document.createElement(tag); if (className) n.className = className; if (text != null) n.textContent = text; return n; }
const symbols = { 'All waves':'∿', 'Gaming':'✳', 'DeFi':'◈', 'Wallets':'▱', 'NFTs & Creator Economy':'✦', 'Developer Tools':'⌘', 'Identity':'◎', 'Infrastructure':'⌁', 'Security':'◇' };
const shortNames = { 'NFTs & Creator Economy':'Art & creators', 'Developer Tools':'Dev tools', 'DAOs & Governance':'DAOs', 'Real World Assets (RWA)':'Real world assets', 'Layer 1 / Layer 2':'Networks', 'Data & Analytics':'Data & analytics' };
function renderCategories() {
  const categories = [...new Set(state.projects.map(p => p.category))];
  const first = ['Gaming','DeFi','Wallets','NFTs & Creator Economy','Developer Tools','Identity'];
  categories.sort((a,b) => (first.includes(a) ? first.indexOf(a) : 100) - (first.includes(b) ? first.indexOf(b) : 100) || a.localeCompare(b));
  if (!categories.includes(state.category)) state.category = 'All waves';
  $('categories').replaceChildren(...['All waves', ...categories].map(category => {
    const b = node('button', 'pill' + (state.category === category ? ' selected' : ''), `${symbols[category] || '·'} ${shortNames[category] || category}`);
    b.dataset.category = category; b.setAttribute('aria-pressed', String(state.category === category));
    b.addEventListener('click', () => { state.category = category; renderCategories(); surf(false); }); return b;
  }));
}
function pool() { return candidates(state.projects, state.category, state.mode); }
function recordVisit(p, type, url) {
  state.history.unshift({ id:p.id, name:p.name, type, url, at:new Date().toISOString() });
  state.history = state.history.slice(0, 300); persist();
}
function visit(p, type, url) { recordVisit(p, type, url); }
function renderProject(p, animate = true) {
  state.current = p;
  $('project-name').textContent = p.name; $('project-description').textContent = p.description;
  $('project-category').textContent = p.category; $('visual-category').textContent = shortNames[p.category] || p.category;
  $('project-initial').textContent = p.name.slice(0, 2); $('find-number').textContent = `WAVE ${String(state.waves || 1).padStart(2,'0')}`;
  $('project-tags').replaceChildren(...[...new Set([...p.ecosystems, ...p.tags.filter(t => t !== p.category)])].slice(0, 4).map(t => node('span','',t)));
  const tones = ['#e1e9cf','#e5dded','#e7e6c6','#d6e7e2','#f0dfcc'];
  let hash = 0; for (const c of p.category) hash += c.charCodeAt(0);
  // A class keeps the content security policy strict without inline styles.
  $('project-visual').className = 'project-visual tone-' + hash % tones.length;
  const links = [];
  for (const [type,url] of [['website',p.website],['product',p.product]]) {
    if (!url) continue;
    const a = node('a','',`${type === 'website' ? 'Visit website' : 'Open product'} ↗`);
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.addEventListener('click', () => visit(p,type,url)); links.push(a);
  }
  $('project-links').replaceChildren(...links); $('project-links').hidden = false;
  $('save-project').hidden = false; $('share-project').hidden = false; renderSave();
  $('next-wave').replaceChildren(document.createTextNode('Catch another wave '), node('span','','↗'));
  if (animate) { $('surf-panel').classList.remove('pop'); void $('surf-panel').offsetWidth; $('surf-panel').classList.add('pop'); }
  announce(`${p.name}. ${p.description}`);
}
function renderSave() {
  const saved = state.current && state.saved.includes(state.current.id);
  $('save-project').textContent = saved ? '♥' : '♡'; $('save-project').setAttribute('aria-pressed', String(Boolean(saved)));
  $('save-project').setAttribute('aria-label', saved ? 'Remove this project from saved' : 'Save this project'); counts();
}
function surf(scroll = true) {
  const selection = pool();
  if (selection.every(p => state.seen.includes(p.id))) state.seen = [];
  const p = chooseProject(selection, state.seen, state.current?.id);
  if (!p) { toast(state.projects.length ? 'No projects in this current. Try another category or link type.' : 'Loading the waves. Try again in a moment.'); return; }
  state.seen.push(p.id); state.waves += 1; renderProject(p);
  if (state.auto) { const target = targetFor(p,state.mode); recordVisit(p,target.type,target.url); window.open(target.url,'_blank','noopener,noreferrer'); }
  if (scroll) $('discover').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
}
function toggleSave() {
  if (!state.current) return;
  const id = state.current.id;
  if (state.saved.includes(id)) { state.saved = state.saved.filter(x => x !== id); toast('Released back into the ocean.'); }
  else { state.saved.push(id); toast('A keeper. Saved to your collection.'); }
  persist(); renderSave();
}
function closeModal() { $('modal').close(); }
function modal(title) { $('modal-title').textContent = title; $('modal-body').replaceChildren(); if (!$('modal').open) $('modal').showModal(); }
function showCopy(title, paragraphs) {
  modal(title); const body = node('div','modal-copy');
  for (const [heading,copy] of paragraphs) { if(heading) body.append(node('h3','',heading)); body.append(node('p','',copy)); } $('modal-body').append(body);
}
function listProject(p) {
  const row = node('div','list-item'); const main = node('div','list-item-main');
  const name = node('button','',p.name); name.addEventListener('click', () => { closeModal(); state.waves++; renderProject(p); $('discover').scrollIntoView({behavior:'smooth'}); });
  main.append(name,node('p','',`${shortNames[p.category] || p.category} · ${new URL(p.website || p.product).hostname}`));
  const save = node('button','mini-action',state.saved.includes(p.id) ? '♥' : '♡'); save.setAttribute('aria-label',`Save or unsave ${p.name}`);
  save.addEventListener('click',()=> { const id=p.id; state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id]; persist(); renderSave(); save.textContent=state.saved.includes(id)?'♥':'♡'; });
  row.append(main,save); return row;
}
function showSaved() {
  modal('Your little collection.');
  $('modal-body').append(node('p','modal-copy','The good finds you wanted to come back to. Saved on this device.'));
  const saved = state.projects.filter(p => state.saved.includes(p.id));
  if (!saved.length) $('modal-body').append(node('p','modal-empty','No keepers yet. Catch a wave and tap the heart to save a find.'));
  else for (const p of saved) $('modal-body').append(listProject(p));
  const unavailable = state.saved.length - saved.length;
  if (unavailable > 0) $('modal-body').append(node('p','modal-copy',`${unavailable} saved find(s) are no longer in the current verified directory.`));
}
function showExplore() {
  modal('An ocean of possibilities.');
  const input = node('input','modal-search'); input.type='search'; input.placeholder='Search names, interests, ecosystems…'; input.setAttribute('aria-label','Search projects');
  const status = node('div','modal-toolbar'); const list=node('div'); let limit=40;
  function render() {
    const filtered=candidates(state.projects,'All waves','either',input.value); status.textContent=`${filtered.length.toLocaleString()} projects · from CryptoDirectory`;
    list.replaceChildren(...filtered.slice(0,limit).map(listProject));
    if (!filtered.length) list.append(node('p','modal-empty','No finds in these waters. Try another search.'));
    if(filtered.length>limit) { const more=node('button','more-button','Show more finds'); more.addEventListener('click',()=>{limit+=40;render();}); list.append(more); }
  }
  input.addEventListener('input',()=>{limit=40;render();}); $('modal-body').append(input,status,list);render();input.focus();
}
function showHistory() {
  modal('Your surf trail.');
  const toolbar=node('div','modal-toolbar');toolbar.append(node('span','',`${state.history.length} website & product visits · this device`));
  const clear=node('button','danger-button','Clear trail');clear.addEventListener('click',()=>{state.history=[];persist();showHistory();toast('A fresh start. Your trail is cleared.');});toolbar.append(clear);$('modal-body').append(toolbar);
  if(!state.history.length) $('modal-body').append(node('p','modal-empty','Your trail starts when you open a website or product. Let’s see where you end up.'));
  for(const h of state.history) {
    const row=node('div','list-item');const main=node('div','list-item-main');const a=node('a','',`${h.name} ↗`);a.href=h.url;a.target='_blank';a.rel='noopener noreferrer';
    main.append(a,node('p','',`${h.type === 'product' ? 'Product' : 'Website'} · ${new URL(h.url).hostname} · ${new Date(h.at).toLocaleDateString()}`)); row.append(main);$('modal-body').append(row);
  }
}
function updateCatalog(catalog) {
  if (!Array.isArray(catalog.projects) || !catalog.projects.length) throw new Error('Empty catalog');
  state.projects = catalog.projects; renderCategories();
  const count=state.projects.length.toLocaleString();const categoryCount=new Set(state.projects.map(p=>p.category)).size;
  const live=catalog.status==='live';$('sync-dot').classList.toggle('stale',!live);
  const checked=catalog.checkedAt?new Date(catalog.checkedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):null;
  $('sync-status').textContent=live?`${count} verified projects · ${categoryCount} currents · Synced with CryptoDirectory at ${checked}`:`${count} verified projects · ${categoryCount} currents · Directory snapshot ${catalog.snapshotDate || ''}. Live sync is reconnecting.`;
  const shared=new URL(location.href).searchParams.get('project');
  if(!state.current&&shared){const p=state.projects.find(p=>p.id===shared);if(p){state.waves=1;renderProject(p);}else toast('That find is no longer in the verified directory. Catch a fresh wave.');}
  if(state.current){const updated=state.projects.find(p=>p.id===state.current.id);if(updated)renderProject(updated,false);else{state.current=null;surf(false);}}
}
async function refreshFeed(manual=false) {
  $('refresh-feed').disabled=true;
  try { const r=await fetch('/api/catalog'+(manual?'?refresh='+Date.now():''),{signal:AbortSignal.timeout(12000)}); if(!r.ok)throw new Error();updateCatalog(await r.json());if(manual)toast('Directory checked. You’re ready to ride.'); }
  catch { if(!state.projects.length) {try{const r=await fetch('/catalog.json');if(!r.ok)throw new Error();updateCatalog(await r.json());}catch{$('sync-status').textContent='The tide is out. Check your connection and tap Refresh.';}} if(manual)toast('Live sync is unavailable. Your last directory snapshot is still ready.'); }
  finally{$('refresh-feed').disabled=false;}
}
$('hero-surf').addEventListener('click',()=>surf());$('next-wave').addEventListener('click',()=>surf(false));$('manifesto-surf').addEventListener('click',()=>surf());
$('nav-surf').addEventListener('click',()=>surf());$('save-project').addEventListener('click',toggleSave);
$('nav-saved').addEventListener('click',showSaved);$('nav-explore').addEventListener('click',showExplore);$('nav-history').addEventListener('click',showHistory);
$('nav-how').addEventListener('click',()=>showCopy('A little less feed. A little more freedom.',[
  ['01 — Pick your current.','Go anywhere, or choose a category that catches your eye. Gaming, art, building, onchain tools — there’s a lot of web out there.'],
  ['02 — Catch a wave.','Surf picks a random verified project from CryptoDirectory. Open its website or product, save the good ones, and catch another. You won’t get the same project twice until you’ve worked through your current pool.'],
  ['03 — Make your own trail.','Turn on “Open each wave in a new tab” for one-click wandering. Your visits and saved finds stay on this device. No account needed.'],
  ['One directory. Two ways to discover.','CryptoDirectory maintains the website and product links. Surf reads its public feed, cached for five minutes with background refresh. If the feed is unavailable, a dated snapshot keeps the waves rolling. Directory edits flow into Surf; personal bookmarks and visit history stay local.'],
  ['', 'A listing is a starting point for your own research, not an endorsement.']
]));
$('nav-privacy').addEventListener('click',()=>{showCopy('Your curiosity is yours.',[
  ['', 'Surf stores saved project IDs, website and product visit history, and your browsing settings in this browser’s local storage. There is no Surf account, advertising tracker, or central visit database.'],
  ['', 'The server reads the public CryptoDirectory feed. Hosting providers may process standard request logs. When you open an external site, its own privacy policies apply.'],
  ['', 'Clear your surf trail below, or remove all local Surf data to reset bookmarks, history, and preferences. Clearing browser data also removes this information.']
  ]);const clear=node('button','more-button','Reset all local Surf data');clear.addEventListener('click',()=>{state.saved=[];state.history=[];state.mode='either';state.auto=false;persist();$('link-mode').value=state.mode;$('auto-open').checked=false;renderSave();closeModal();toast('All local Surf data has been reset.');});$('modal-body').append(clear);});
$('close-modal').addEventListener('click',closeModal);$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
$('link-mode').value=state.mode;$('auto-open').checked=state.auto;
$('link-mode').addEventListener('change',e=>{state.mode=e.target.value;persist();toast('Current set. Your next wave will use this link type.');});
$('auto-open').addEventListener('change',e=>{state.auto=e.target.checked;persist();if(state.auto)toast('Next waves open in a new tab. Allow pop-ups if your browser asks.');});
$('share-project').addEventListener('click',async()=>{if(!state.current)return;const u=new URL(location.origin);u.searchParams.set('project',state.current.id);try{if(navigator.share)await navigator.share({title:`${state.current.name} — Found on Surf`,url:u.href});else{await navigator.clipboard.writeText(u.href);toast('Link copied. Share a good wave.');}}catch(e){if(e.name!=='AbortError')toast('Copy the project link from your browser to share this wave.');}});
$('refresh-feed').addEventListener('click',()=>refreshFeed(true));
document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey||$('modal').open||['INPUT','SELECT','TEXTAREA','BUTTON','A'].includes(document.activeElement.tagName))return;if(e.key.toLowerCase()==='n')surf();if(e.key.toLowerCase()==='s'&&state.current)toggleSave();});
counts();
try{const r=await fetch('/catalog.json');if(r.ok)updateCatalog(await r.json());}catch{}
refreshFeed();
setInterval(()=>{if(document.visibilityState==='visible')refreshFeed();},300000);
