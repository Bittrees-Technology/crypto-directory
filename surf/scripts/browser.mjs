import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {normalizeCatalog} from '../public/core.js';
const root=fileURLToPath(new URL('../public/',import.meta.url));
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root))throw Error();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const base={id:'aave.md',name:'Fixture A',lead_category:'DeFi',verification_status:'verified',description:'Synthetic browser acceptance project.',primary_url:'https://fixture.example.org/a',product_url:'https://fixture.example.org/a/product',tags:[],ecosystem:['Ethereum']};
const second={...base,id:'second.md',name:'Fixture B',primary_url:'https://fixture.example.org/b',product_url:'https://fixture.example.org/b/product'};
const browser=await chromium.launch({headless:true});const checks=[],errors=[];
async function scenario(name,run,{initial=[base,second],oldSaves=null,frameStatus='embeddable',signedIn=false}={}){
  const context=await browser.newContext({viewport:{width:1360,height:900}}),page=await context.newPage();let raw=initial;let remoteSaved=[];
  if(oldSaves)await context.addInitScript(value=>{if(!localStorage.getItem('bittrees.surf.v1'))localStorage.setItem('bittrees.surf.v1',JSON.stringify({saved:value}));},oldSaves);
  page.on('pageerror',error=>errors.push(name+': '+error.message));
  await context.route('https://fixture.example.org/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><title>Embedded fixture</title></head><body><h1>Actual embedded website</h1></body></html>'}));
  await page.route('**/catalog.json',route=>route.fulfill({json:{projects:normalizeCatalog(raw),status:'live',checkedAt:new Date().toISOString()}}));
  await page.route('**/api/**',async route=>{const u=new URL(route.request().url());let data;
    if(u.pathname==='/api/catalog')data={projects:normalizeCatalog(raw),status:'live',checkedAt:new Date().toISOString()};
    else if(u.pathname==='/api/frame'){const p=normalizeCatalog(raw).find(p=>p.id===u.searchParams.get('project'));if(!p)return route.fulfill({status:404,json:{error:'Removed'}});data={status:frameStatus,url:p[u.searchParams.get('type')],reason:'embedding-blocked'};}
    else if(u.pathname==='/api/account/session')data={configured:true,signedIn,...(signedIn?{identity:'fixture@example.org',csrf:'fixture-csrf'}:{})};
    else if(u.pathname==='/api/account/saved'){
      if(route.request().method()==='POST'){const b=route.request().postDataJSON();remoteSaved=remoteSaved.filter(s=>!(s.id===b.id&&s.type===b.type));if(b.action==='save'){const p=normalizeCatalog(raw).find(p=>p.id===b.id);remoteSaved.push({id:p.id,type:b.type,url:p[b.type],name:p.name,savedAt:new Date().toISOString()});}data={ok:true};}else data={saved:remoteSaved};
    }else data={ok:true};await route.fulfill({json:data});
  });
  const refresh=async next=>{raw=next;const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/catalog');await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await response;};
  try{await page.goto(origin+'/');await page.waitForFunction(()=>document.getElementById('welcome-meta').textContent.includes('verified projects'));await run({page,context,refresh,setRaw:next=>raw=next});checks.push(name);}finally{await context.close();}
}
async function startProduct(page){await page.locator('#link-mode').selectOption('product');await page.locator('#start-surf').click();await page.frameLocator('#site-frame').getByRole('heading',{name:'Actual embedded website'}).waitFor();}
try{
  await scenario('preserved landing and actual website below persistent toolbar',async({page})=>{
    assert(await page.locator('.ocean-art').isVisible(),'Wave artwork remains visible on the landing page');assert(await page.getByRole('heading',{name:'Surf the new web.',exact:true}).isVisible(),'Landing heading has a readable accessible name');await startProduct(page);assert(await page.locator('.toolbar').isVisible());assert.equal(await page.locator('#welcome').isVisible(),false);assert((await page.locator('#site-frame').getAttribute('src')).endsWith('/product'));const toolbar=await page.locator('.toolbar').boundingBox(),frame=await page.locator('#site-frame').boundingBox();assert(toolbar.y+toolbar.height<=frame.y);
    await page.setViewportSize({width:390,height:844});assert(await page.locator('#surf-next').isVisible());assert(await page.locator('#nav-account').isVisible());const widths=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(widths.scroll<=widths.client);
  });
  await scenario('removed current with no eligible replacement clears all links and iframe',async({page,refresh})=>{
    await startProduct(page);const id=new URL(page.url()).searchParams.get('project'),p=[base,second].find(p=>p.id===id);await refresh([{...p,verification_status:'rejected'},{...second,id:'other.md',product_url:'n/a',lead_category:'Wallets'}]);await page.locator('#welcome').waitFor({state:'visible'});assert.equal(await page.locator('#site-frame').getAttribute('src'),null);for(const id of ['open-site','fallback-open','help-open'])assert.equal(await page.locator('#'+id).getAttribute('href'),null);assert.equal(await page.locator('#save-project').isEnabled(),false);
  });
  await scenario('unchanged entry losing product gets an eligible replacement',async({page,refresh})=>{
    await startProduct(page);const id=new URL(page.url()).searchParams.get('project');const current=[base,second].find(p=>p.id===id),other=[base,second].find(p=>p.id!==id);await refresh([{...current,product_url:'n/a'},other]);await page.waitForFunction(id=>new URL(location.href).searchParams.get('project')!==id,id);assert.equal(new URL(page.url()).searchParams.get('project'),other.id);assert.equal(await page.locator('#site-frame').getAttribute('src'),other.product_url);
  });
  await scenario('unchanged entry changing category gets an eligible replacement',async({page,refresh})=>{
    await page.locator('#category').selectOption('DeFi');await startProduct(page);const id=new URL(page.url()).searchParams.get('project'),current=[base,second].find(p=>p.id===id),other=[base,second].find(p=>p.id!==id);await refresh([{...current,lead_category:'Wallets'},other]);await page.waitForFunction(id=>new URL(location.href).searchParams.get('project')!==id,id);assert.equal(new URL(page.url()).searchParams.get('project'),other.id);
  });
  await scenario('stale Explore row cannot revive a removed project',async({page,refresh})=>{
    await page.locator('#nav-explore').click();await page.getByRole('button',{name:'Fixture A',exact:true}).waitFor();await refresh([second]);await page.waitForFunction(()=>document.getElementById('welcome-meta').textContent.startsWith('1 '));await page.getByRole('button',{name:'Fixture A',exact:true}).click();assert.equal(await page.locator('#site-frame').getAttribute('src'),null);assert.equal(await page.locator('#open-site').getAttribute('href'),null);
  });
  await scenario('stale Saved row cannot revive removed destinations',async({page,refresh})=>{
    await startProduct(page);const current=await page.locator('#site-name').textContent(),id=new URL(page.url()).searchParams.get('project');await page.locator('#save-project').click();await page.getByRole('button',{name:'Save on this device',exact:true}).click();await page.locator('#nav-saved').click();await refresh([id===base.id?second:base]);await page.waitForFunction(()=>document.getElementById('welcome-meta').textContent.startsWith('1 '));await page.getByRole('button',{name:current,exact:true}).click();assert.equal(await page.locator('#site-frame').getAttribute('src'),null);assert.equal(await page.locator('#open-site').getAttribute('href'),null);
  });
  await scenario('stale modal rows use the current URL after an edit',async({page,refresh})=>{
    await page.locator('#nav-explore').click();await page.getByRole('button',{name:'Fixture A',exact:true}).waitFor();await refresh([{...base,primary_url:'https://fixture.example.org/a-updated'}]);await page.waitForFunction(()=>document.getElementById('welcome-meta').textContent.startsWith('1 '));await page.getByRole('button',{name:'Fixture A',exact:true}).click();await page.frameLocator('#site-frame').getByRole('heading',{name:'Actual embedded website'}).waitFor();assert.equal(await page.locator('#open-site').getAttribute('href'),'https://fixture.example.org/a-updated');
  });
  await scenario('legacy bookmark IDs migrate and do not return after removal',async({page})=>{
    await page.locator('#nav-saved').click();await page.getByRole('button',{name:'Fixture A',exact:true}).waitFor();const migrated=await page.evaluate(()=>JSON.parse(localStorage.getItem('bittrees.surf.v2')).saved);assert.equal(migrated[0].id,'aave.md');await page.getByRole('button',{name:'Remove',exact:true}).click();await page.reload();await page.locator('#nav-saved').click();await page.getByText('No saved sites yet.',{exact:false}).waitFor();
  },{initial:[base],oldSaves:['https://aave.com']});
  await scenario('middle click adds exactly one outbound visit',async({page,context})=>{
    await startProduct(page);await page.waitForFunction(()=>JSON.parse(localStorage.getItem('bittrees.surf.v2')).visits.length>0);const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('bittrees.surf.v2')).visits.length);await page.locator('#open-site').click({button:'middle'});await page.waitForFunction(n=>JSON.parse(localStorage.getItem('bittrees.surf.v2')).visits.length===n,before+1);const count=await page.evaluate(()=>JSON.parse(localStorage.getItem('bittrees.surf.v2')).visits.length);assert.equal(count,before+1);
  });
  await scenario('sites that block embedding get an honest external fallback',async({page})=>{await page.locator('#start-surf').click();await page.locator('#frame-fallback').waitFor({state:'visible'});assert.equal(await page.locator('#site-frame').getAttribute('src'),null);assert(await page.getByText('This site doesn’t allow embedded browsing.',{exact:true}).isVisible());assert((await page.locator('#fallback-open').getAttribute('href')).startsWith('https://fixture.example.org/'));},{frameStatus:'external'});
  await scenario('signed-in website and product saves use the account API',async({page})=>{await startProduct(page);await page.locator('#save-project').click();await page.waitForFunction(()=>document.getElementById('saved-count').textContent==='1');await page.locator('#nav-saved').click();assert(await page.getByText('Your Bittrees collection.',{exact:true}).isVisible());assert.equal(await page.locator('.collection-item').count(),1);},{signedIn:true});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({syntheticSurfBrowserChecks:checks,pageErrors:errors}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
