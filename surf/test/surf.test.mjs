import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { normalizeCatalog, safeUrl, candidates, chooseProject, targetFor } from '../public/core.js';
import { getCatalog, SOURCE, SNAPSHOT_DATE } from '../lib/catalog.js';
const raw = JSON.parse(await readFile(new URL('../public/data/source.json',import.meta.url),'utf8'));
test('directory feed excludes rejected projects and preserves distinct product URLs',()=>{
  const projects=normalizeCatalog(raw);
  const verified=raw.filter(p=>p.verification_status==='verified');
  assert.deepEqual(projects.map(p=>p.id).sort(),verified.map(p=>p.id).sort());
  assert.deepEqual([...new Set(projects.map(p=>p.category))].sort(),[...new Set(verified.map(p=>p.lead_category))].sort());
  assert.ok(!projects.some(p=>raw.some(r=>r.verification_status!=='verified'&&r.id===p.id)));
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
    const catalog=await getCatalog({fetcher});assert.equal(catalog.status,'snapshot');assert.deepEqual(catalog.projects,normalizeCatalog(raw));assert.equal(catalog.snapshotDate,SNAPSHOT_DATE);
  }
});
test('the built first-load catalog and runtime fallback use one reviewed snapshot',async()=>{
  await promisify(execFile)(process.execPath,[fileURLToPath(new URL('../scripts/build.mjs',import.meta.url))]);
  const built=JSON.parse(await readFile(new URL('../public/catalog.json',import.meta.url),'utf8'));
  const fallback=await getCatalog({fetcher:async()=>{throw new Error('offline');}});
  assert.equal(built.status,'snapshot');assert.equal(built.source,SOURCE);
  assert.equal(built.snapshotDate,fallback.snapshotDate);
  assert.deepEqual(built.projects,fallback.projects,'An older root directory build must not override the reviewed Surf snapshot');
});
