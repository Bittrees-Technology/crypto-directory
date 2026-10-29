import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeCatalog, safeUrl, candidates, chooseProject, targetFor } from '../public/core.js';
import { getCatalog, SOURCE } from '../lib/catalog.js';
const raw = JSON.parse(await readFile(new URL('../public/data/source.json',import.meta.url),'utf8'));
test('directory feed excludes rejected projects and preserves distinct product URLs',()=>{
  const projects=normalizeCatalog(raw);
  assert.equal(projects.length,1003);
  assert.equal(new Set(projects.map(p=>p.category)).size,14);
  assert.ok(!projects.some(p=>raw.some(r=>r.verification_status==='rejected'&&r.name===p.name)));
  const aave=projects.find(p=>p.name==='Aave');assert.equal(aave.website,'https://aave.com/');assert.equal(aave.product,'https://app.aave.com/');
});
test('unsafe outbound URLs never become surf destinations',()=>{
  for(const url of ['javascript:alert(1)','data:text/html,x','https://user:pass@example.com','http://127.0.0.1','http://localhost','https://x.local','http://[::1]','n/a'])assert.equal(safeUrl(url),null,url);
  assert.equal(safeUrl('https://app.aave.com'), 'https://app.aave.com/');
});
test('link modes and categories restrict the candidate pool',()=>{
  const projects=normalizeCatalog(raw);
  const wallets=candidates(projects,'Wallets','product');assert.ok(wallets.length);assert.ok(wallets.every(p=>p.category==='Wallets'&&p.product));
  assert.equal(candidates(projects,'Not a category').length,0);
  assert.ok(candidates(projects,'All waves','either','aave').some(p=>p.name==='Aave'));
});
test('random discovery avoids seen projects until the pool is exhausted',()=>{
  const projects=normalizeCatalog(raw).slice(0,3);
  assert.equal(chooseProject(projects,[projects[0].id,projects[1].id],projects[1].id,()=>0).id,projects[2].id);
  assert.notEqual(chooseProject(projects,projects.map(p=>p.id),projects[0].id,()=>0).id,projects[0].id);
  assert.equal(chooseProject([],[]),null);
  assert.equal(targetFor(projects[1],'product').url,projects[1].product);
});
test('runtime sync reflects new data and removed entries without a redeploy',async()=>{
  const updated=[{...raw[0],name:'Updated name',primary_url:'https://changed.example.org'}];
  let fetched;
  const catalog=await getCatalog({fetcher:async url=>{fetched=url;return {ok:true,json:async()=>updated};},clock:()=> '2026-10-29T10:00:00Z'});
  assert.equal(fetched,SOURCE);assert.equal(catalog.status,'live');assert.equal(catalog.projects.length,1);assert.equal(catalog.projects[0].name,'Updated name');assert.equal(catalog.projects[0].website,'https://changed.example.org/');
});
test('outages and empty feeds use an explicitly labeled snapshot',async()=>{
  for(const fetcher of [async()=>{throw new Error('offline');},async()=>({ok:false}),async()=>({ok:true,json:async()=>[]})]){
    const catalog=await getCatalog({fetcher});assert.equal(catalog.status,'snapshot');assert.equal(catalog.projects.length,1003);assert.ok(catalog.snapshotDate);
  }
});
