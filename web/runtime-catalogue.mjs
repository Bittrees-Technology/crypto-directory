import {filterProjects,projectPage,pageSummary,tableRows,updateCatalogueSchema} from './catalog.mjs';

const ENDPOINT='https://cd.bittrees.org/api/catalogue';
const textFields=['name','lead_category','description','founded','hq','token'];
export function checkedCatalogue(rows){
  if(!Array.isArray(rows)||rows.length>10000)throw Error('Invalid directory data.');
  const ids=new Set();
  for(const row of rows){
    if(!row||typeof row!=='object'||!/^[-a-z0-9]{1,120}\.md$/.test(row.id||'')||ids.has(row.id)||!['verified','needs_update','pending_audit','rejected'].includes(row.verification_status))throw Error('Invalid directory data.');
    ids.add(row.id);
    for(const key of textFields)if(typeof row[key]!=='string'||row[key].length>4000)throw Error('Invalid directory text.');
    for(const key of ['tags','ecosystem'])if(!Array.isArray(row[key])||row[key].length>64||row[key].some(x=>typeof x!=='string'||x.length>160))throw Error('Invalid directory labels.');
    for(const key of ['primary_url','product_url','token_url','twitter']){
      const value=row[key];if(key!=='primary_url'&&[undefined,'','n/a'].includes(value))continue;
      let url;try{url=new URL(value);}catch{throw Error('Invalid directory link.');}
      if(typeof value!=='string'||value.length>2048||!['http:','https:'].includes(url.protocol)||url.username||url.password||/[\u0000-\u0020\u007f]/.test(value))throw Error('Unsafe directory link.');
    }
  }
  return rows;
}
export async function fetchCatalogue(fetcher=fetch,expectedStoreId=null){
  const response=await fetcher(ENDPOINT,{credentials:'omit',redirect:'error',cache:'no-store',signal:AbortSignal.timeout(12000),headers:{accept:'application/json'}});
  if(!response.ok||response.redirected||!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')||''))throw Error('Live directory unavailable.');
  const raw=await response.text();if(new TextEncoder().encode(raw).length>2500000)throw Error('Directory exceeds its bound.');
  const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)))].map(x=>x.toString(16).padStart(2,'0')).join('');
  // Compression can weaken the transport ETag. The decoded body must still
  // match the exact SHA-256, and the separately pinned store must also match.
  if(response.headers.get('etag')?.replace(/^W\//,'')!=='"'+digest+'"')throw Error('Directory integrity check failed.');
  const storeId=response.headers.get('x-directory-catalogue-store');if(!/^[a-f0-9-]{36}$/.test(storeId||'')||expectedStoreId&&storeId!==expectedStoreId)throw Error('Directory store changed.');
  const revision=response.headers.get('x-directory-catalogue-revision');if(!/^\d+$/.test(revision||'')||!Number.isSafeInteger(Number(revision)))throw Error('Directory revision unavailable.');
  return {rows:checkedCatalogue(JSON.parse(raw)),storeId,revision:Number(revision)};
}
export function mountRuntimeCatalogue(document,location,history){
  const root=document.body;
  if(!root.hasAttribute('data-live-catalogue'))return Promise.resolve(null);
  const table=document.getElementById('rows'),select=document.querySelector('#listing-request-form select[name=id]');
  if(!table&&!select)return Promise.resolve(null);
  const status=document.getElementById('catalog-search-status')||document.createElement('p');
  if(!status.id){status.id='catalog-search-status';status.setAttribute('role','status');(table?.closest('table')||select).before(status);}
  const retry=document.getElementById('catalog-retry')||document.createElement('button');
  if(!retry.id){retry.id='catalog-retry';retry.type='button';retry.textContent='Reload directory';status.after(retry);}
  retry.hidden=true;
  const search=document.getElementById('search'),category=document.getElementById('category'),count=document.getElementById('catalog-count'),pagination=document.getElementById('catalog-pagination');
  document.getElementById('search-pagination')?.remove();
  let snapshot=null,filteredPage=1;
  const currentPage=()=>{const query=new URLSearchParams(location.search).get('page');return query&&/^\d{1,5}$/.test(query)?Number(query):Number(root.dataset.cataloguePage||1);};
  function render(){
    if(!table||!snapshot)return;
    const filtering=!!(search?.value.trim()||category?.value),scope=root.dataset.catalogueView;
    const rows=scope==='needs-update'?snapshot.rows.filter(x=>x.verification_status==='needs_update'):filterProjects(snapshot.rows,{query:search?.value||'',category:category?.value||root.dataset.catalogueCategory||''});
    const state=projectPage(rows,filtering?filteredPage:currentPage());
    table.innerHTML=tableRows(state.items,root.dataset.cataloguePrefix||'');
    updateCatalogueSchema(document,state);
    if(count)count.textContent=scope==='needs-update'?`Showing ${state.first}–${state.last} of ${state.total} listings needing an update.`:pageSummary(state,filtering);
    const total=document.getElementById('category-total');if(total)total.textContent=String(rows.length);
    const marked=document.getElementById('needs-update-total');if(marked)marked.textContent=String(rows.length);
    if(pagination){
      pagination.replaceChildren();
      const move=(page,label)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>{if(filtering)filteredPage=page;else{const target=new URL(location.href);target.searchParams.set('page',String(page));history.pushState(null,'',target.pathname+target.search);}render();});pagination.append(button);};
      if(state.page>1){move(1,'First page');move(state.page-1,'Previous page');}
      const label=document.createElement('span');label.textContent=`Page ${state.page} of ${state.pageCount}`;label.setAttribute('aria-current','page');pagination.append(label);
      if(state.page<state.pageCount){move(state.page+1,'Next page');move(state.pageCount,'Last page');}
    }
    document.dispatchEvent(new Event('directory-rows-rendered'));
  }
  async function load(){
    retry.hidden=true;status.textContent='Loading current listings…';
    try{
      const next=await fetchCatalogue(fetch,root.dataset.catalogueStore);const expected=new URLSearchParams(location.search).get('revision');if(expected&&/^\d+$/.test(expected)&&next.revision<Number(expected))throw Error('The published revision has not reached this cache yet.');snapshot=next;root.dataset.catalogueRevision=String(next.revision);status.textContent='';
      if(select){const selected=select.value||new URLSearchParams(location.search).get('id');const options=[new Option('Choose a listing','')];for(const row of next.rows.filter(x=>x.verification_status!=='rejected').sort((a,b)=>a.name.localeCompare(b.name)))options.push(new Option(row.name,row.id));select.replaceChildren(...options);if(selected)select.value=selected;}
      render();return next;
    }catch{status.textContent='Latest updates could not be loaded. Showing the saved directory.';retry.hidden=false;return null;}
  }
  retry.addEventListener('click',()=>void load());
  for(const control of [search,category].filter(Boolean))control.addEventListener(control===search?'input':'change',()=>{filteredPage=1;render();});
  globalThis.addEventListener?.('popstate',render);
  return load();
}
if(typeof document!=='undefined')globalThis.directoryCatalogueReady=mountRuntimeCatalogue(document,location,history);
