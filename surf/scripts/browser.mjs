import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {normalizeCatalog} from '../public/core.js';
const root=path.resolve(fileURLToPath(new URL('../public/',import.meta.url)));
const deployment=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
const contentType=file=>file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.png')?'image/png':'text/html';
const server=createServer(async(req,res)=>{
  for(const header of deployment.headers.find(rule=>rule.source==='/(.*)').headers)res.setHeader(header.key,header.value);
  try{const u=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',contentType(file));res.end(await readFile(file));}
  catch{res.statusCode=404;res.setHeader('Content-Type','text/html');res.end(await readFile(path.join(root,'404.html')));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const base={id:'aave.md',name:'Fixture A',lead_category:'DeFi',verification_status:'verified',description:'Synthetic browser acceptance project.',primary_url:'https://fixture.example.org/a',product_url:'https://fixture.example.org/a/product',tags:[],ecosystem:['Ethereum']};
const second={...base,id:'second.md',name:'Fixture B',primary_url:'https://fixture.example.org/b',product_url:'https://fixture.example.org/b/product'};
const browser=await chromium.launch({headless:true});const checks=[],errors=[];
async function scenario(name,run,{initial=[base,second],oldSaves=null,frameStatus='embeddable',signedIn=false,nativeOrigin=false,resume=false,seedSaved=null,pendingSave=null,frameGate=null}={}){
  const context=await browser.newContext({viewport:{width:1360,height:900}}),page=await context.newPage();let raw=initial;let remoteSaved=[];let sharedSignedIn=signedIn;let handoffs=0;const apiRequests=[];const navigationOrigin=nativeOrigin?'https://surf.bittrees.org':origin;
  if(oldSaves)await context.addInitScript(value=>{if(!localStorage.getItem('bittrees.surf.v1'))localStorage.setItem('bittrees.surf.v1',JSON.stringify({saved:value}));},oldSaves);
  if(seedSaved)await context.addInitScript(value=>{if(!localStorage.getItem('bittrees.surf.v2'))localStorage.setItem('bittrees.surf.v2',JSON.stringify({saved:value}));},seedSaved);
  if(pendingSave)await context.addInitScript(value=>{if(!sessionStorage.getItem('fixture.pending.seeded')){sessionStorage.setItem('surf.pending-save',JSON.stringify(value));sessionStorage.setItem('fixture.pending.seeded','1');}},pendingSave);
  if(nativeOrigin)await context.setOffline(true);
  if(nativeOrigin)await context.route('https://surf.bittrees.org/**',async route=>{const u=new URL(route.request().url()),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))throw Error();await route.fulfill({body:await readFile(file),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html'});});
  page.on('pageerror',error=>errors.push(name+': '+error.message));
  await context.route('https://fixture.example.org/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><title>Embedded fixture</title></head><body><h1>Actual embedded website</h1></body></html>'}));
  await page.route('**/catalog.json',route=>route.fulfill({json:{projects:normalizeCatalog(raw),status:'live',checkedAt:new Date().toISOString()}}));
  await page.route('**/api/**',async route=>{const u=new URL(route.request().url());apiRequests.push(route.request().method()+' '+u.pathname);let data;
    if(u.pathname==='/api/catalog')data={projects:normalizeCatalog(raw),status:'live',checkedAt:new Date().toISOString()};
    else if(u.pathname==='/api/frame'){if(frameGate)await frameGate;const p=normalizeCatalog(raw).find(p=>p.id===u.searchParams.get('project'));if(!p)return route.fulfill({status:404,json:{error:'Removed'}});data={status:frameStatus,url:p[u.searchParams.get('type')],reason:'embedding-blocked'};}
    else if(u.pathname==='/api/account/session')data={configured:true,signedIn:sharedSignedIn,...(sharedSignedIn?{identity:'fixture@example.org',csrf:'fixture-csrf'}:{})};
    else if(u.pathname==='/api/sso/status')data={configured:true,action:resume&&!sharedSignedIn?'resume':null};
    else if(u.pathname==='/api/sso/start'){assert.equal(u.searchParams.get('mode'),'resume');sharedSignedIn=true;handoffs++;// Model the issuer return as a fresh navigation. Mocked HTTP redirects bypass subsequent Playwright routes.
      return route.fulfill({contentType:'text/html',body:'<!doctype html><script>location.replace('+JSON.stringify(navigationOrigin+(u.searchParams.get('return_to')||'/'))+')</script>'});}
    else if(u.pathname==='/api/account/saved'){
      if(route.request().method()==='POST'){const b=route.request().postDataJSON();remoteSaved=remoteSaved.filter(s=>!(s.id===b.id&&s.type===b.type));if(b.action==='save'){const p=normalizeCatalog(raw).find(p=>p.id===b.id);remoteSaved.push({id:p.id,type:b.type,url:p[b.type],name:p.name,savedAt:new Date().toISOString()});}data={ok:true};}else data={saved:remoteSaved};
    }else data={ok:true};await route.fulfill({json:data});
  });
  const refresh=async next=>{raw=next;const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/catalog');await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await response;};
  try{await page.goto(navigationOrigin+'/');await page.waitForFunction(()=>document.getElementById('welcome-meta').textContent.includes('verified projects'));await run({page,context,refresh,setRaw:next=>raw=next,handoffs:()=>handoffs});checks.push(name);}catch(error){let visible;try{visible=await page.evaluate(()=>({account:document.getElementById('nav-account')?.textContent,saved:document.getElementById('saved-count')?.textContent,pending:sessionStorage.getItem('surf.pending-save'),count:document.getElementById('welcome-meta')?.textContent}));}catch{}console.error(JSON.stringify({failedSyntheticScenario:name,url:page.url(),handoffs,sharedSignedIn,remoteSavedCount:remoteSaved.length,apiRequests,visible,pageErrors:errors}));throw error;}finally{await context.close();}
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
  let releaseFrame;const frameGate=new Promise(resolve=>releaseFrame=resolve);
  await scenario('filters are disabled while destination compatibility is being checked',async({page})=>{
    await page.locator('#start-surf').click();await page.waitForFunction(()=>document.getElementById('surf-next').disabled);assert.equal(await page.locator('#category').isEnabled(),false);assert.equal(await page.locator('#link-mode').isEnabled(),false);releaseFrame();await page.frameLocator('#site-frame').getByRole('heading',{name:'Actual embedded website'}).waitFor();assert.equal(await page.locator('#category').isEnabled(),true);assert.equal(await page.locator('#link-mode').isEnabled(),true);
  },{frameGate});
  await scenario('account import preserves unavailable device bookmarks',async({page})=>{
    await page.locator('#nav-saved').click();await page.getByRole('button',{name:'Import 3 saved from this device',exact:true}).click();await page.getByRole('button',{name:'Import 2 saved from this device',exact:true}).waitFor();const remaining=await page.evaluate(()=>JSON.parse(localStorage.getItem('bittrees.surf.v2')).saved);assert.equal(remaining.length,2);assert(remaining.some(s=>s.id==='removed.md'));assert(remaining.some(s=>s.id==='aave.md'&&s.type==='product'));
  },{initial:[{...base,product_url:'n/a'}],signedIn:true,seedSaved:[{id:'aave.md',type:'website'},{id:'removed.md',type:'website'},{id:'aave.md',type:'product'}]});
  await scenario('native shared sign-in starts one resume handoff and preserves the pending bookmark',async({page,handoffs})=>{
    await page.waitForFunction(()=>document.getElementById('saved-count').textContent==='1');assert.equal(handoffs(),1);assert.equal(await page.evaluate(()=>sessionStorage.getItem('surf.pending-save')),null);await page.locator('#nav-saved').click();assert.equal(await page.locator('.collection-item').count(),1);assert(await page.getByText('Your Bittrees collection.',{exact:true}).isVisible());
  },{nativeOrigin:true,resume:true,initial:[base],pendingSave:{id:'aave.md',type:'product'}});
  await scenario('canonical and structured metadata survive embedded discovery',async({page})=>{
    assert((await page.title()).includes('Surf by Bittrees'));
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://surf.bittrees.org/');
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://surf.bittrees.org/');
    const data=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(data['@graph'].find(n=>n['@type']==='WebSite').url,'https://surf.bittrees.org/');
    const image=await page.request.get(origin+'/social.png');assert.equal(image.status(),200);assert(image.headers()['content-type'].includes('image/png'));
    assert.equal((await image.body()).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    await startProduct(page);assert(new URL(page.url()).searchParams.has('project'));
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://surf.bittrees.org/');
  });
  {
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();
    try{
      await page.goto(origin+'/');assert(await page.getByRole('heading',{name:'Surf the new web.',exact:true}).isVisible());
      assert(await page.getByRole('link',{name:'browse CryptoDirectory directly',exact:true}).isVisible());
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://surf.bittrees.org/');
      const response=await page.goto(origin+'/missing-seo-fixture');assert.equal(response.status(),404);
      assert(await page.getByRole('heading',{name:'That wave has passed.',exact:true}).isVisible());
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, follow');
      checks.push('landing content is readable without JavaScript and unknown pages return a real 404');
    }finally{await context.close();}
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({syntheticSurfBrowserChecks:checks,pageErrors:errors}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
