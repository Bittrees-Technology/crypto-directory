import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import {DIRECTORY_PAGE_SIZE,filterProjects} from '../web/catalog.mjs';

// Synthetic browser acceptance. This does not claim live identities, grants,
// GitHub writes, email delivery or ENS transaction approval.
const root=path.resolve(process.env.DIRECTORY_BUILD_OUTPUT||'site');
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))throw Error('Path rejected');const content=await readFile(file);res.setHeader('Content-Type',/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':file.endsWith('.png')?'image/png':file.endsWith('.jpg')?'image/jpeg':'text/html');res.end(content);}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await (process.env.DIRECTORY_TEST_BROWSER==='webkit'?webkit:chromium).launch({headless:true});
const errors=[],checks=[];
async function screenshot(page,name,options={}){if(process.env.DIRECTORY_SCREENSHOT_DIR){await mkdir(process.env.DIRECTORY_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.DIRECTORY_SCREENSHOT_DIR,(process.env.DIRECTORY_SCREENSHOT_PREFIX||'')+name+'.png'),...options});}}
const base={name:'Browser Fixture Project',lead_category:'Infrastructure',tags:['Infrastructure'],ecosystem:['Ethereum'],description:'A synthetic onchain project used only for local browser acceptance.',primary_url:'https://fixture.example.org',product_url:'https://fixture.example.org/app',founded:'2024',hq:'Metaverse',token:'n/a',token_url:'https://fixture.example.org/token',twitter:'n/a'};
async function scenario(role,run,options={}){
  const context=await browser.newContext({viewport:{width:1360,height:900},...options.context}),page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  const staff=['admin','editor','reviewer'].includes(role),session={identity:role==='admin'?'0x'+'1'.repeat(40):'fixture@example.org',staff,admin:role==='admin',editor:role==='editor',reviewer:role==='reviewer',canEdit:['admin','editor'].includes(role),canReview:['admin','reviewer'].includes(role),canAutoReview:role==='reviewer',canHandleRequests:staff,canSubmit:role!=='anonymous',canRequestEdit:role!=='anonymous',csrf:'fixture-csrf',storageConfigured:true};
  const editRequests=[{id:'22222222-2222-4222-8222-222222222222',projectId:'existing.md',projectName:'Existing Project',changes:'Please correct the official project description.',sources:'https://fixture.example.org/announcement',kind:'edit',patch:{description:'A requested correction to this existing project description.'},original:{description:base.description},listingSha:'a'.repeat(40),status:'pending',revision:1}];
  if(role==='editor')editRequests.push({id:'33333333-3333-4333-8333-333333333333',projectId:'existing.md',projectName:'Shutdown fixture',kind:'removal',removalReasons:['shutdown'],changes:'The project announced it has permanently shut down.',sources:'https://fixture.example.org/shutdown',status:'pending',revision:1});
  const records=[{id:'11111111-1111-4111-8111-111111111111',entry:{...base,verification_status:'pending_audit'},status:'pending',revision:1,history:[]}];let writes=[];
  await page.route('**/api/**',async route=>{
    const u=new URL(route.request().url()),endpoint=u.pathname.split('/').pop();let data={},status=200;
    if(endpoint==='session'){if(role==='anonymous'){status=401;data={error:'Sign in with email or Ethereum to continue.'};}else data=session;}
    else if(endpoint==='status')data={configured:true,action:null};
    else if(endpoint==='identity')data={identity:session.identity,ensName:'fixture.eth'};
    else if(endpoint==='edit-requests')data={requests:editRequests};
    else if(endpoint==='request-edit'){const value=route.request().postDataJSON();writes.push({endpoint,value});editRequests.push({id:value.operationId,projectId:value.id,projectName:base.name,kind:value.kind,changes:value.changes,sources:value.sources,removalReasons:value.removalReasons,...(value.kind==='edit'?{patch:{description:value.entry.description},original:{description:base.description}}:{}),status:'pending',revision:1});data={status:'pending'};}
    else if(endpoint==='close-edit-request'){const value=route.request().postDataJSON();writes.push({endpoint,value});editRequests[0].status='closed';data={status:'closed',message:'Edit request closed.'};}
    else if(endpoint==='review-edit-request'){const value=route.request().postDataJSON();writes.push({endpoint,value});editRequests[0].status=value.decision==='accept'?'accepted':'rejected';data={status:value.decision==='accept'?'release-pending':'rejected',...(value.decision==='accept'?{proposal:{url:'https://github.com/Bittrees-Technology/crypto-directory/pull/101',number:101}}:{})};}
    else if(endpoint==='project')data={id:u.searchParams.get('id'),sha:'a'.repeat(40),entry:{...base,verification_status:'verified'}};
    else if(endpoint==='submissions')data={revision:1,submissions:records};
    else if(['submit','edit','review'].includes(endpoint)){const value=route.request().postDataJSON();writes.push({endpoint,value});if(endpoint==='review')records[0].status=value.decision==='accept'?'accepted':'rejected';data=endpoint==='submit'?{id:value.operationId,status:'pending'}:{status:endpoint==='review'&&value.decision==='reject'?'rejected':'release-pending',proposal:{url:'https://github.com/Bittrees-Technology/crypto-directory/pull/100',number:100}};}
    else data={ok:true};
    await route.fulfill({status,json:data});
  });
  try{await run({context,page,session,writes,editRequests});checks.push(options.name||role);}finally{await context.close();}
}
async function settleSearch(page) {
  await page.waitForFunction(() => !document.getElementById('rows').hasAttribute('aria-busy'));
  assert.equal(await page.locator('#catalog-search-status').textContent(), '');
}
async function walkDiscovery(page, start) {
  await page.goto(start);
  const seen = new Set(), collected = [];
  let canonicalOrigin;
  while (true) {
    assert(!seen.has(page.url()), 'Pagination cycle'); seen.add(page.url());
    const ids = await page.locator('tbody tr[data-project-id]').evaluateAll(rows => rows.map(row => row.dataset.projectId));
    assert(ids.length <= DIRECTORY_PAGE_SIZE); collected.push(...ids);
    const canonical = new URL(await page.locator('link[rel=canonical]').getAttribute('href'));
    canonicalOrigin ||= canonical.origin;
    assert.equal(canonical.origin, canonicalOrigin);
    assert.equal(canonical.pathname, new URL(page.url()).pathname);
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'index,follow');
    const next = page.locator('#catalog-pagination a[rel=next]');
    if (!(await next.count())) break;
    assert(await next.getAttribute('href'), 'Next page must be a normal anchor');
    await next.click();
  }
  assert.equal(new Set(collected).size, collected.length, 'No duplicated records within a series');
  return collected.sort();
}

try{
  await scenario('anonymous',async({page})=>{
    await page.goto(origin+'/');await page.getByRole('heading',{name:'Explore the directory',exact:true}).waitFor();
    assert.equal(await page.locator('.site-nav').isVisible(),false);assert.equal(await page.locator('[data-edit-entry]:visible').count(),0);assert(await page.locator('table').isVisible());
    const header=page.locator('.directory-header');assert(await header.getByRole('link',{name:'Submit a project',exact:true}).isVisible());assert(await header.getByRole('link',{name:'Request an edit',exact:true}).isVisible());
    const linksBox=await page.locator('.header-forms').boundingBox(),loginBox=await page.locator('.directory-account').boundingBox();assert(linksBox.x+linksBox.width<=loginBox.x);
    assert.equal(await page.locator('#category option[value="AI Agents"]').count(),1);
    await page.goto(origin+'/categories/ai-agents.html');
    await page.getByRole('heading',{name:'Category: AI Agents',exact:true}).waitFor();
    assert(await page.getByText('Crypto and Web3 agents, frameworks and agent marketplaces with an onchain use case.',{exact:true}).isVisible());
    const published=JSON.parse(await readFile(path.join(root,'data/projects.json'),'utf8'));
    const first=JSON.parse(await readFile('content/submissions/reviews/2026-10-29-first-publication.json','utf8'));
    const completion=JSON.parse(await readFile('content/submissions/reviews/2026-10-29-complete-500-additions.json','utf8'));
    assert.equal(first.listings.length+completion.listings.length,500);
    const publication={listings:[...first.listings,...completion.listings]};
    // A merged research package used to leave the public list unchanged. Check
    // actual source entries against built public data, then exercise the UI.
    for(const listing of publication.listings){
      const id=path.basename(listing.project_file);
      assert(published.some(project=>project.id===id),'Publication entry missing from public data: '+id);
    }
    const agents=published.filter(project=>project.lead_category==='AI Agents'&&project.verification_status==='verified');
    assert(agents.length>0,'Reviewed AI Agents must reach the public category');
    await page.goto(origin+'/categories/ai-agents.html');await settleSearch(page);
    while(await page.getByRole('button',{name:'Load more projects',exact:true}).count())await page.getByRole('button',{name:'Load more projects',exact:true}).click();
    assert.deepEqual(await page.locator('#rows tr').evaluateAll(rows=>rows.map(row=>row.dataset.projectId).sort()),agents.map(project=>project.id).sort());
    await page.getByRole('link',{name:'Back to directory',exact:true}).click();
    const newAgent=agents.find(project=>project.name==='Virtuals Protocol')||agents[0];
    await page.locator('#search').fill(newAgent.name);await settleSearch(page);
    assert(await page.getByText(newAgent.name,{exact:true}).first().isVisible());
    for(const name of ['Slither','DeDust','Monero']){
      await page.locator('#search').fill(name);await settleSearch(page);
      assert(await page.getByText(name,{exact:true}).first().isVisible(),name+' missing from directory search');
    }
    await page.locator('#search').fill('');await settleSearch(page);
    // Public discovery must agree with Surf's verified-only catalogue. Exercise
    // both server-rendered category pages and client-rendered search results.
    const visible=filterProjects(published);
    const rowIds=selector=>page.locator(selector+' [data-edit-entry]').evaluateAll(links=>links.map(link=>new URL(link.href).searchParams.get('id')).sort());
    assert.deepEqual(await rowIds('#rows'),visible.slice(0,DIRECTORY_PAGE_SIZE).map(project=>project.id).sort());
    for(const status of ['needs_update','rejected','pending_audit']){
      const excluded=published.find(project=>project.verification_status===status);
      if(!excluded)continue;
      await page.locator('#search').fill(excluded.name);await settleSearch(page);
      assert(!(await rowIds('#rows')).includes(excluded.id),'Excluded listing returned through search: '+excluded.id);
    }
    const staticContext=await browser.newContext({javaScriptEnabled:false});
    try{
      const staticPage=await staticContext.newPage();
      assert.deepEqual(await walkDiscovery(staticPage,origin+'/'),visible.map(project=>project.id).sort());
      for(const category of ['Wallets','DeFi','AI Agents']){
        const slug=category.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
        const ids=await walkDiscovery(staticPage,origin+'/categories/'+slug+'.html');
        assert.deepEqual(ids,visible.filter(project=>project.lead_category===category).map(project=>project.id).sort());
      }
    }finally{await staticContext.close();}
    if(visible.length>DIRECTORY_PAGE_SIZE){
      await page.goto(origin+'/pages/2.html');
      const initialIds=await rowIds('#rows');
      assert.deepEqual(initialIds,visible.slice(DIRECTORY_PAGE_SIZE,DIRECTORY_PAGE_SIZE*2).map(project=>project.id).sort());
      await page.locator('#search').fill(visible.at(-1).name);await settleSearch(page);
      assert((await rowIds('#rows')).includes(visible.at(-1).id),'Search must find records outside this static page');
      assert.equal(await page.locator('[data-edit-entry]:visible').count(),0);
      await page.locator('#search').fill('');await settleSearch(page);
      assert.deepEqual(await rowIds('#rows'),initialIds);
      assert(await page.locator('#catalog-pagination').isVisible());
    }
    await page.locator('#search').fill('');await settleSearch(page);
    await page.evaluate(()=>localStorage.setItem('role','superadmin'));await page.reload();await page.locator('[data-login-link]').waitFor();assert.equal(await page.locator('.site-nav').isVisible(),false);
    await page.goto(origin+'/submit.html');assert.equal(await page.locator('#listing-form').isVisible(),false);
    assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('[data-login-link]:visible').count(),1);
    assert.equal(await page.locator('.submission-nav').count(),0);assert.equal(await page.locator('#directory-message').isVisible(),false);
    const back=page.getByRole('link',{name:'Back to directory',exact:true});assert(await back.isVisible());
    assert.equal(await page.getByRole('link',{name:'CryptoDirectory home',exact:true}).getAttribute('href'),'./');
    await screenshot(page,'signed-out-desktop');
    await page.setViewportSize({width:360,height:800});
    const brand=await page.locator('.directory-brand').boundingBox(),account=await page.locator('.directory-account').boundingBox();
    const forms=await page.locator('.header-forms').boundingBox();assert(brand.y<forms.y);assert(forms.x+forms.width<=account.x);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert(await back.isVisible());await screenshot(page,'signed-out-mobile');
    await back.click();await page.getByRole('heading',{name:'Explore the directory',exact:true}).waitFor();assert.equal(page.url(),origin+'/');
    await page.goto(origin+'/categories/wallets.html');assert.equal(await page.getByRole('link',{name:'Back to directory',exact:true}).getAttribute('href'),'../');
    await page.getByRole('link',{name:'Back to directory',exact:true}).click();await page.getByRole('heading',{name:'Explore the directory',exact:true}).waitFor();
    let mirrorApiCalls=0;
    await page.route('https://cryptodirectory.eth.limo/**',async route=>{
      const u=new URL(route.request().url());if(u.pathname.startsWith('/api/')){mirrorApiCalls++;return route.fulfill({status:404,json:{}});}
      const file=path.resolve(root,'.'+u.pathname);assert(file.startsWith(root+path.sep));await route.fulfill({body:await readFile(file),contentType:/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':file.endsWith('.png')?'image/png':file.endsWith('.jpg')?'image/jpeg':'text/html'});
    });
    if(visible.length>DIRECTORY_PAGE_SIZE){
      await page.goto('https://cryptodirectory.eth.limo/pages/2.html');
      assert.deepEqual(await rowIds('#rows'),visible.slice(DIRECTORY_PAGE_SIZE,DIRECTORY_PAGE_SIZE*2).map(project=>project.id).sort());
      await page.locator('#search').fill(visible.at(-1).name);await settleSearch(page);
      assert((await rowIds('#rows')).includes(visible.at(-1).id),'Mirror search must load its relative catalogue');
      assert.equal(await page.locator('[data-edit-entry]:visible').count(),0);
      await page.locator('#search').fill('');await settleSearch(page);
      assert(await page.locator('#catalog-pagination').isVisible());
    }
    await page.goto('https://cryptodirectory.eth.limo/submit.html');
    await page.waitForFunction(()=>document.querySelector('[data-login-link]').href.includes('?return_to='));
    assert.equal(await page.locator('#directory-message').isVisible(),false);assert(await page.getByRole('link',{name:'Back to directory',exact:true}).isVisible());
    assert.equal(new URL(await page.locator('[data-login-link]').getAttribute('href')).origin,'https://cd.bittrees.org');assert.equal(mirrorApiCalls,0);
    for(const link of await page.locator('.header-forms a').all())assert.equal(new URL(await link.getAttribute('href')).origin,'https://cd.bittrees.org');
    await page.goto('https://cryptodirectory.eth.limo/request-edit.html?id=aave.md');
    await page.waitForFunction(()=>document.querySelector('[data-login-link]').href.includes('?return_to='));
    assert.equal(new URL(await page.locator('[data-login-link]').getAttribute('href')).searchParams.get('return_to'),'/submit.html?form=request-edit&id=aave.md');
    await page.route('https://roles.bittrees.org/sign-in**',route=>route.fulfill({contentType:'text/html',body:'<p>Shared sign-in fixture</p>'}));
    await page.goto(origin+'/sign-in.html?'+new URLSearchParams({return_to:'/request-edit.html?id=aave.md'}));await page.waitForURL('https://roles.bittrees.org/sign-in**');
    assert.equal(new URL(page.url()).searchParams.get('return_to'),'/submit.html?form=request-edit&id=aave.md');
  });
  await scenario('submitter',async({page,writes})=>{
    await page.goto(origin+'/submit.html');await page.locator('#listing-form').waitFor({state:'visible'});assert.equal(await page.locator('.site-nav').isVisible(),false);
    const listingFields=await page.locator('#listing-form [data-field-label]').evaluateAll(nodes=>nodes.map(n=>n.name));assert.deepEqual(listingFields,['name','lead_category','description','primary_url','product_url','tags','ecosystem','founded','hq','token','token_url','twitter']);
    assert.equal(await page.locator('form [name="lead_category"] option').filter({hasText:'AI Agents'}).count(),1);
    assert(await page.getByRole('link',{name:'Back to directory',exact:true}).isVisible());await screenshot(page,'submission-desktop');
    await page.setViewportSize({width:390,height:844});await screenshot(page,'submission-mobile');await page.setViewportSize({width:1360,height:900});
    for(const [key,value] of Object.entries(base)){const field=page.locator('form [name="'+key+'"]');if(key==='lead_category')await field.selectOption(value);else await field.fill(Array.isArray(value)?value.join(', '):value);}
    await page.getByRole('button',{name:'Submit for review',exact:true}).click();await page.getByText('Submission received. It is awaiting an independent reviewer.',{exact:true}).waitFor();
    assert.equal(writes.length,1);assert.equal(writes[0].endpoint,'submit');assert.equal(writes[0].value.entry.name,base.name);
    await page.setViewportSize({width:390,height:844});const box=await page.locator('.listing-form-card').boundingBox();assert(box.x>=0&&box.x+box.width<=390);
    await page.goto(origin+'/submit.html?form=request-edit&id=aave.md');await page.waitForURL('**/request-edit.html?id=aave.md');await page.locator('#listing-request-form').waitFor({state:'visible'});
    await page.getByText('Current details loaded. Change the fields below, or request removal.',{exact:true}).waitFor();
    assert.equal(await page.locator('form [name="id"]').inputValue(),'aave.md');
    assert.deepEqual(await page.locator('#listing-request-form [data-field-label]').evaluateAll(nodes=>nodes.map(n=>n.name)),listingFields);assert.equal(await page.locator('form [name="name"]').inputValue(),base.name);assert.equal(await page.locator('form [name="token_url"]').inputValue(),base.token_url);
    await page.locator('form [name="description"]').fill('Requested new description based on the official project announcement.');
    await page.locator('form [name="changes"]').fill('Please correct the official project details using this source.');await page.locator('form [name="sources"]').fill('https://fixture.example.org/announcement');
    await screenshot(page,'edit-request-mobile',{fullPage:true});await page.setViewportSize({width:1360,height:900});await screenshot(page,'edit-request-desktop',{fullPage:true});
    await page.getByRole('button',{name:'Send edit request',exact:true}).click();await page.getByText('Edit request received. A Reviewer or Admin will review it before publication.',{exact:true}).waitFor();
    assert.equal(writes.at(-1).endpoint,'request-edit');assert.equal(writes.at(-1).value.id,'aave.md');assert.equal(await page.getByRole('link',{name:'Open listing editor',exact:true}).count(),0);
    assert.equal(writes.at(-1).value.kind,'edit');assert.equal(writes.at(-1).value.sha,'a'.repeat(40));assert.equal(writes.at(-1).value.entry.token_url,base.token_url);assert.equal('verification_status' in writes.at(-1).value.entry,false);
    await page.locator('form [name="id"]').selectOption('aave.md');await page.getByText('Current details loaded. Change the fields below, or request removal.',{exact:true}).waitFor();await page.getByLabel('Request removal of this listing',{exact:true}).check();
    assert.equal(await page.locator('#request-listing-fields').isVisible(),false);assert(await page.locator('#request-listing-fields [name=name]').isDisabled());assert.equal(await page.locator('form [name=removalReasons]').count(),8);
    await page.locator('form [name="changes"]').fill('The project announced a permanent shutdown and its website is offline.');await page.getByRole('button',{name:'Send removal request',exact:true}).click();assert.equal(writes.length,2);
    await page.getByLabel('Project has shut down',{exact:true}).check();await page.getByLabel('Website or product is no longer available',{exact:true}).check();await page.locator('form [name="sources"]').fill('https://fixture.example.org/shutdown');
    await screenshot(page,'removal-request-desktop',{fullPage:true});await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await screenshot(page,'removal-request-mobile',{fullPage:true});
    await page.getByRole('button',{name:'Send removal request',exact:true}).click();await page.getByText('Removal request received. The listing stays visible until a Reviewer or Admin approves removal.',{exact:true}).waitFor();assert.equal(writes.at(-1).value.kind,'removal');assert.deepEqual(writes.at(-1).value.removalReasons,['shutdown','unavailable']);assert.equal('entry' in writes.at(-1).value,false);
    await page.goto(origin+'/submit.html?form=request-edit&id='+encodeURIComponent('//attacker.example/'));await page.waitForURL(origin+'/request-edit.html');assert.equal(await page.locator('form [name="id"]').inputValue(),'');
  });
  await scenario('editor',async({page,writes,editRequests})=>{
    await page.goto(origin+'/request-edit.html');await page.getByRole('link',{name:'Open listing editor',exact:true}).waitFor();
    assert.equal(await page.getByRole('link',{name:'Open listing editor',exact:true}).count(),1);assert(await page.getByText('An accepted change creates a release proposal. The public listing changes after required checks and independent release approval. Closing a request does not change the listing.',{exact:true}).first().isVisible());
    await page.getByRole('link',{name:'Open listing editor',exact:true}).click();await page.getByText('Requested correction:',{exact:false}).waitFor();
    assert((await page.locator('form [name="reason"]').inputValue()).includes('22222222-2222-4222-8222-222222222222'));
    assert.equal(await page.locator('form [name="description"]').inputValue(),editRequests[0].patch.description);
    editRequests[0].listingSha='b'.repeat(40);await page.reload();await page.getByText('The listing changed since this request.',{exact:false}).waitFor();assert.equal(await page.locator('form [name="description"]').inputValue(),base.description);
    await page.goto(origin+'/');await page.locator('.site-nav').waitFor({state:'visible'});assert.equal(await page.locator('.site-nav a').count(),4);assert(await page.locator('[data-edit-entry]').first().isVisible());
    await page.locator('#search').fill('aave');await settleSearch(page);await page.locator('[data-edit-entry]').first().waitFor({state:'visible'});
    await page.goto(origin+'/edit.html?id=existing.md');await page.locator('form [name="name"]').waitFor({state:'visible'});assert.equal(await page.locator('form [name="name"]').inputValue(),base.name);
    await page.locator('form [name="description"]').fill('Updated synthetic details of this existing project.');await page.locator('form [name="reason"]').fill('Official fixture details have changed.');await page.getByRole('button',{name:'Propose update',exact:true}).click();await page.locator('#directory-result').waitFor({state:'visible'});
    assert.equal(writes[0].endpoint,'edit');assert.equal('verification_status' in writes[0].value.entry,false);
    await page.goto(origin+'/review.html');await page.locator('[data-review-unavailable]').waitFor({state:'visible'});assert.equal(await page.locator('#directory-review').isVisible(),false);
  });
  await scenario('reviewer',async({page,writes})=>{
    await page.goto(origin+'/review.html');await page.getByRole('button',{name:'Accept for release review',exact:true}).waitFor();assert.equal(await page.locator('[data-edit-entry]:visible').count(),0);
    await page.getByLabel('Review rationale').fill('Reviewed official website and live onchain product.');await page.getByRole('button',{name:'Accept for release review',exact:true}).click();await page.getByText('No new submissions are waiting for review.',{exact:true}).waitFor();
    assert.equal(writes[0].endpoint,'review');assert.equal(writes[0].value.decision,'accept');assert.equal('entry' in writes[0].value,false);
    await page.getByLabel('Review outcome').fill('Independently checked the requested official correction.');await page.getByRole('button',{name:'Accept change for release review',exact:true}).click();await page.getByRole('heading',{name:'Existing Project — accepted',exact:true}).waitFor();
    assert.equal(writes[1].endpoint,'review-edit-request');assert.equal(writes[1].value.decision,'accept');assert.equal('entry' in writes[1].value,false);
    await page.goto(origin+'/request-edit.html');await page.locator('#listing-request-form').waitFor({state:'visible'});assert.equal(await page.getByRole('link',{name:'Open listing editor',exact:true}).count(),0);
    await page.goto(origin+'/submit.html');await page.locator('#listing-form').waitFor({state:'visible'});
  });
  await scenario('admin',async({page})=>{
    await page.goto(origin+'/');await page.locator('.site-nav').waitFor({state:'visible'});assert(await page.locator('.header-forms').isVisible());assert(await page.locator('[data-edit-entry]').first().isVisible());
    await page.getByText('fixture.eth',{exact:true}).waitFor();assert.equal(await page.locator('#directory-identity').getAttribute('title'),'0x'+'1'.repeat(40));
    await screenshot(page,'staff-navigation');
  });
  for(const width of [320,375,390,768])await scenario('anonymous',async({page})=>{
    await page.goto(origin+'/');await page.getByRole('heading',{name:'Explore the directory',exact:true}).waitFor();
    const geometry=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
    assert(geometry.document<=geometry.viewport&&geometry.body<=geometry.viewport,'Phone layout must not scroll sideways');
    assert(await page.locator('.directory-icon').evaluate(img=>img.complete&&img.naturalWidth>0),'Existing brand icon should load without a third-party service');
    assert(await page.getByRole('table').isVisible());assert.equal(await page.getByRole('rowheader').count(),await page.locator('#rows tr').count());assert.equal(await page.getByRole('columnheader').count(),9);
    const row=page.locator('#rows tr').first();assert(await row.locator('[data-label="Ecosystem"]').isVisible());assert(await row.locator('[data-label="Token"]').isVisible());
    const description=await row.locator('.project-description').boundingBox();assert(description.width>=width-72,'Description needs a readable full-width column');
    for(const target of ['.header-forms a','[data-login-link]','.controls input','.controls select','.link-pill','#catalog-pagination a']){
      for(const box of await page.locator(target+':visible').evaluateAll(nodes=>nodes.slice(0,4).map(n=>n.getBoundingClientRect().height)))assert(box>=44,'Phone controls need a 44px touch target: '+target);
    }
    const structured=JSON.parse(await page.locator('#catalog-schema').textContent()),list=structured['@graph'].find(n=>n['@type']==='ItemList');
    assert.equal(list.numberOfItems,await page.locator('#rows tr').count());assert.equal(list.itemListElement[0].item.name,await row.locator('strong').textContent());
    await screenshot(page,'mobile-directory-'+width);
    await page.getByLabel('Search all projects',{exact:true}).fill('aave');await settleSearch(page);
    const filtered=JSON.parse(await page.locator('#catalog-schema').textContent())['@graph'].find(n=>n['@type']==='ItemList');assert.equal(filtered.numberOfItems,await page.locator('#rows tr').count());
    assert.equal(await page.locator('[data-edit-entry]:visible').count(),0);
  },{name:'mobile-'+width,context:{viewport:{width,height:844}}});
  await scenario('admin',async({page})=>{
    await page.addInitScript(()=>{window.IntersectionObserver=undefined;});
    await page.goto(origin+'/');const row=page.locator('#rows tr').first(),edit=row.locator('[data-edit-entry]');await edit.waitFor({state:'visible'});
    const category=await row.locator('small').boundingBox(),link=await edit.boundingBox();
    assert(link.y>=category.y+category.height,'The mobile edit action must be separate from the category label');assert(link.height>=44);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await screenshot(page,'mobile-admin');
    const firstRow=await row.elementHandle();
    await page.locator('#catalog-load-more').focus();await page.locator('#catalog-load-more').press('Enter');
    await page.waitForFunction(()=>document.querySelectorAll('#rows tr').length===100);
    assert(await firstRow.evaluate(node=>node.isConnected),'Appending must retain existing rows and their focus targets');
    assert.equal(await page.locator('[data-edit-entry]:visible').count(),100,'New rows must retain current role enforcement');
  },{name:'mobile-admin',context:{viewport:{width:390,height:844}}});
  await scenario('member',async({page})=>{
    await page.goto(origin+'/submit.html');await page.locator('#listing-form').waitFor({state:'visible'});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    for(const input of await page.locator('#listing-form input').evaluateAll(nodes=>nodes.map(n=>({font:getComputedStyle(n).fontSize,width:n.getBoundingClientRect().width}))))assert(parseFloat(input.font)>=16&&input.width>200);
    await screenshot(page,'mobile-submit');
  },{name:'mobile-member',context:{viewport:{width:320,height:844}}});
  await scenario('anonymous',async({page})=>{
    await page.goto(origin+'/');assert(await page.locator('#rows tr').count()>0);assert(await page.locator('#rows tr').first().locator('[data-label="Ecosystem"]').isVisible());
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert(await page.locator('#catalog-pagination a[rel=next]').count()>0);
  },{name:'mobile-no-javascript',context:{viewport:{width:390,height:844},javaScriptEnabled:false}});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({syntheticBrowserChecks:checks,pageErrors:errors}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
