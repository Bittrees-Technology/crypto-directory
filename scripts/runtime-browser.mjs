// Isolated synthetic browser coverage; no real identity or production write.
import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve(process.env.DIRECTORY_BUILD_OUTPUT||'site');
const storeId='e38a1a2e-3602-4e3b-875b-ac80ce210c90';
const base={lead_category:'Infrastructure',tags:['Infrastructure'],ecosystem:['Ethereum'],description:'A synthetic runtime listing for isolated browser validation.',primary_url:'https://fixture.example/',product_url:'n/a',founded:'2020',hq:'Metaverse',token:'n/a',twitter:'n/a',verification_status:'verified'};
let rows=Array.from({length:112},(_,i)=>({...base,id:`runtime-${String(i).padStart(3,'0')}.md`,name:`Runtime ${String(i).padStart(3,'0')}`}));rows.push({...base,id:'held-fixture.md',name:'Held fixture',verification_status:'needs_update'});
let revision=1,unavailable=false;const calls=[],writes=[],errors=[];
const browser=await chromium.launch({headless:true});
async function contextFor(origin,role='anonymous'){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.href==='https://cd.bittrees.org/api/catalogue'){
      calls.push(url.href);if(unavailable)return route.fulfill({status:503,json:{error:'Held fixture'}});
      const raw=JSON.stringify(rows),etag='W/"'+createHash('sha256').update(raw).digest('hex')+'"';
      return route.fulfill({body:raw,headers:{'content-type':'application/json','access-control-allow-origin':'*','access-control-expose-headers':'ETag, X-Directory-Catalogue-Revision, X-Directory-Catalogue-Store','etag':etag,'x-directory-catalogue-revision':String(revision),'x-directory-catalogue-store':storeId}});
    }
    if(url.pathname.startsWith('/api/')){
      const endpoint=url.pathname.split('/').pop();let data={};
      const session={identity:'fixture@example.org',staff:role!=='anonymous',canSubmit:role!=='anonymous',canRequestEdit:role!=='anonymous',canEdit:false,canReview:role==='reviewer',canHandleRequests:role==='reviewer',storageConfigured:true,dataBackend:'runtime-v1',csrf:'synthetic'};
      if(endpoint==='session')return route.fulfill(role==='anonymous'?{status:401,json:{error:'Sign in'}}:{json:session});
      if(endpoint==='status')data={configured:true,action:null};
      if(endpoint==='identity')data={identity:session.identity,ensName:null};
      if(endpoint==='submissions')data={submissions:[]};
      if(endpoint==='project')data={id:'runtime-000.md',sha:'a'.repeat(40),entry:base};
      if(endpoint==='edit-requests')data={requests:role==='reviewer'?[{id:'11111111-1111-4111-8111-111111111111',projectId:'runtime-000.md',projectName:'Runtime 000',kind:'edit',listingSha:'a'.repeat(40),patch:{description:'A newly supported corrected description for this listing.'},original:{description:base.description},changes:'The description is now supported by official documentation.',sources:'https://fixture.example/docs',status:'pending',revision:1}]:[]};
      if(endpoint==='review-edit-request'){const value=route.request().postDataJSON();writes.push(value);data={status:'published',publication:{catalogueRevision:++revision,operationId:value.operationId}};}
      return route.fulfill({json:data});
    }
    if(url.origin!==origin)return route.abort();
    const pathname=url.pathname==='/'?'/index.html':url.pathname,file=path.resolve(root,'.'+decodeURIComponent(pathname));
    if(!file.startsWith(root+path.sep))return route.abort();
    try{return route.fulfill({body:await readFile(file),contentType:/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html'});}catch{return route.fulfill({status:404,body:'Not found'});}
  });
  return {context,page};
}
try{
  for(const origin of ['https://cd.bittrees.org','https://cryptodirectory.eth.limo']){
    const {context,page}=await contextFor(origin);
    await page.goto(origin+'/');await page.waitForFunction(()=>document.body.dataset.catalogueRevision==='1');
    assert.equal(await page.locator('#rows tr').count(),50);assert((await page.locator('#catalog-count').textContent()).includes('112'));
    await page.getByRole('button',{name:'Last page',exact:true}).click();assert.equal(await page.locator('#rows tr').count(),12);assert(page.url().includes('page=3'));
    await page.locator('#search').fill('Runtime 111');assert.equal(await page.locator('#rows tr').count(),1);assert((await page.locator('#rows').textContent()).includes('Runtime 111'));
    await page.locator('#search').fill('');assert.equal(await page.locator('#rows tr').count(),12);
    await page.goto(origin+'/categories/infrastructure.html');await page.waitForFunction(()=>document.body.dataset.catalogueRevision==='1');assert.equal(await page.locator('#category-total').textContent(),'112');
    assert.equal(await page.locator('[data-edit-entry]:visible').count(),0);
    if(origin.includes('eth.limo'))assert((await page.locator('.header-forms a').first().getAttribute('href')).startsWith('https://cd.bittrees.org/'));
    // The same static HTML sees a later data revision without rebuilding files.
    rows.push({...base,id:'runtime-later.md',name:'Runtime Later'});revision=2;
    await page.reload();await page.waitForFunction(()=>document.body.dataset.catalogueRevision==='2');assert.equal(await page.locator('#category-total').textContent(),'113');
    rows.pop();revision=1;unavailable=true;await page.reload();await page.getByText('Latest updates could not be loaded. Showing the saved directory.',{exact:true}).waitFor();assert.equal(await page.locator('#catalog-retry').isVisible(),true);
    unavailable=false;await page.locator('#catalog-retry').click();await page.waitForFunction(()=>document.body.dataset.catalogueRevision==='1');
    await context.close();
  }
  const {context,page}=await contextFor('https://cd.bittrees.org','reviewer');
  await page.goto('https://cd.bittrees.org/review.html');await page.getByRole('button',{name:'Approve and publish change',exact:true}).waitFor();
  await page.getByRole('textbox',{name:'Review outcome',exact:true}).fill('The complete listing and official website and product are supported.');
  await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Approve and publish change',exact:true}).click();await page.getByText(/Approved and published/).waitFor();
  assert.equal(writes.length,1);assert.equal(writes[0].verifyListing,true);assert(/^[a-f0-9-]{36}$/.test(writes[0].operationId));
  await page.goto('https://cd.bittrees.org/request-edit.html');await page.waitForFunction(()=>document.querySelector('#listing-request-form select[name=id]').options.length===114);
  await context.close();assert.equal(errors.length,0,errors.join('\n'));assert(calls.length>=8);
  console.log(JSON.stringify({checks:['Vercel live catalogue','ENS shared catalogue','runtime pagination and search','category counts','new revision without rebuild','labelled offline fallback and retry','Reviewer publication with explicit verification','live edit selector'],errors}));
}finally{await browser.close();}
