import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { CATEGORIES } from '../lib/directory/model.mjs';
import { DIRECTORY_PAGE_SIZE, filterProjects, projectPage, catalogPagePath, tableRows, catalogueItemList, updateCatalogueSchema } from '../web/catalog.mjs';
import { mountDirectorySearch } from '../web/directory-search.mjs';

const source = path.resolve(new URL('..', import.meta.url).pathname);
const baseUrl = 'https://cd.bittrees.org';
const entries = Array.from({ length: 127 }, (_, index) => ({
  id: `project-${String(index).padStart(3, '0')}.md`, name: `Project ${String(index).padStart(3, '0')}`,
  lead_category: index < 102 ? 'DeFi' : 'Wallets', tags: ['shared-tag', `tag-${index}`],
  ecosystem: ['Ethereum', `chain-${index}`], description: `A verified onchain project with distinct description-${index} evidence.`,
  primary_url: `https://project-${index}.example.org`, product_url: `https://project-${index}.example.org/app`,
  founded: '2024', hq: 'Metaverse', token: 'n/a', twitter: 'n/a', verification_status: 'verified'
}));
const allEntries = [...entries, ...['rejected', 'needs_update', 'pending_audit'].map((status, index) => ({
  ...entries[index], id: `excluded-${index}.md`, name: `Excluded ${status}`, verification_status: status
}))];
const ids = html => [...html.matchAll(/<tr data-project-id="([^"]+)"/g)].map(match => match[1]);
const unescape = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

async function fixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'directory-pages-'));
  for (const file of ['scripts/build.mjs', 'scripts/lib/process-metrics.mjs', 'scripts/lib/release-manifest.mjs',
    'lib/directory/model.mjs', 'web/catalog.mjs', 'web/directory-search.mjs', 'web/runtime-catalogue.mjs', 'web/directory-client.js', 'site/assets/styles.css', 'site/assets/social-card.png', 'site/assets/directory-icon.jpg']) {
    const target = path.join(directory, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(source, file), target);
  }
  await fs.mkdir(path.join(directory, 'content/projects'), { recursive: true });
  const write = async records => {
    for (const { id, ...entry } of records) await fs.writeFile(path.join(directory, 'content/projects', id),
      '---\n' + Object.entries(entry).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n') + '\n---\n');
  };
  const build = () => execFileSync(process.execPath, ['scripts/build.mjs'], {
    cwd: directory, encoding: 'utf8', env: { SITE_URL: baseUrl, VERCEL_GIT_COMMIT_SHA: 'a'.repeat(40) }
  });
  await write(allEntries);
  build();
  return { directory, site: path.join(directory, 'site'), write, build,
    cleanup: () => fs.rm(directory, { recursive: true, force: true }) };
}

async function walk(site, firstPath) {
  let url = new URL(firstPath || '/', baseUrl);
  const visited = [], records = [];
  while (url) {
    assert(!visited.includes(url.href), 'Pagination must not form a cycle');
    visited.push(url.href);
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const html = await fs.readFile(path.join(site, file), 'utf8');
    const pageIds = ids(html);
    assert(pageIds.length <= DIRECTORY_PAGE_SIZE, 'Every initial document has bounded rows');
    records.push(...pageIds);
    assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)[1], url.href);
    assert.equal(html.match(/<meta property="og:url" content="([^"]+)"/)[1], url.href);
    assert.match(html, /<meta name="robots" content="index,follow">/);
    for (const match of html.matchAll(/(?:href|src|data-source)="([^"]+)"/g)) {
      const target = new URL(unescape(match[1]), url);
      if (target.origin !== baseUrl || target.pathname.startsWith('/api/')) continue;
      const relative = target.pathname === '/' ? 'index.html' : target.pathname === '/sign-in' ? 'sign-in.html' : target.pathname.slice(1);
      assert((await fs.stat(path.join(site, relative))).isFile(), `Broken relative link from ${file}: ${match[1]}`);
    }
    const next = html.match(/<a rel="next" href="([^"]+)"/);
    url = next ? new URL(unescape(next[1]), url) : null;
  }
  assert.equal(new Set(records).size, records.length, 'No duplicate records within a series');
  return { urls: visited, records };
}

test('search spans every original field, intersects category and excludes every nonverified status', () => {
  for (const query of ['Project 126', 'description-126', 'tag-126', 'chain-126']) {
    assert.deepEqual(filterProjects(allEntries, { query }).map(item => item.id), ['project-126.md']);
  }
  assert.equal(filterProjects(allEntries, { query: '  ETHEREUM  ', category: 'Wallets' }).length, 25);
  assert.equal(filterProjects(allEntries, { query: 'Excluded' }).length, 0);
  assert.equal(filterProjects(allEntries).length, entries.length);
  assert.deepEqual(projectPage([], 100).items, []);
  assert.equal(projectPage(entries, 99).page, 3);
  assert.equal(projectPage(entries, -1).page, 1);
  assert.throws(() => projectPage(entries, 1, 0));
  assert.equal(catalogPagePath(1), '');
  assert.equal(catalogPagePath(2), 'pages/2.html');
  assert.equal(catalogPagePath(1, 'defi'), 'categories/defi.html');
  assert.equal(catalogPagePath(2, 'defi'), 'categories/defi/2.html');
  assert.throws(() => catalogPagePath(2, '../defi'));
});

test('fresh builds expose every verified ID once per global/category series with resolvable static links', async () => {
  const f = await fixture();
  try {
    const global = await walk(f.site, '/');
    assert.deepEqual(global.records, entries.map(entry => entry.id));
    assert.equal(global.urls.length, 3);
    const expectedUrls = [...global.urls];
    for (const category of CATEGORIES) {
      const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const series = await walk(f.site, `categories/${slug}.html`);
      assert.deepEqual(series.records, entries.filter(entry => entry.lead_category === category).map(entry => entry.id));
      expectedUrls.push(...series.urls);
    }
    const sitemap = await fs.readFile(path.join(f.site, 'sitemap.xml'), 'utf8');
    assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => unescape(match[1])).sort(), expectedUrls.sort());
    assert(expectedUrls.every(url => !new URL(url).search));
    assert(!sitemap.includes('<lastmod>'), 'A rebuild is not evidence of a content-change date');
    const feed = JSON.parse(await fs.readFile(path.join(f.site, 'data/projects.json'), 'utf8'));
    assert.deepEqual(feed, [...allEntries].sort((a, b) => a.name.localeCompare(b.name)));
    for(const url of expectedUrls){
      const html=await fs.readFile(path.join(f.site,new URL(url).pathname.slice(1)||'index.html'),'utf8');
      const data=JSON.parse(html.match(/<script id="catalog-schema" type="application\/ld\+json">([^<]+)<\/script>/)[1]);
      const collection=data['@graph'].find(x=>x['@type']==='CollectionPage'),list=data['@graph'].find(x=>x['@type']==='ItemList');
      assert.equal(collection.url,url);assert.equal(list.numberOfItems,ids(html).length);assert.equal(list.itemListElement.length,list.numberOfItems);
      assert.match(html,/<meta name="twitter:card" content="summary_large_image">/);
      assert.match(html,/<meta property="og:image" content="https:\/\/cd\.bittrees\.org\/assets\/social-card\.png">/);
    }
    for(const file of ['submit.html','request-edit.html','sign-in.html'])assert.match(await fs.readFile(path.join(f.site,file),'utf8'),/<meta name="robots" content="noindex,follow">/);
    const manifest = JSON.parse(await fs.readFile(path.join(f.site, 'release.json'), 'utf8'));
    assert(Object.keys(manifest.files).length < 128);
    for (const url of expectedUrls) assert(manifest.files[new URL(url).pathname.slice(1) || 'index.html']);
    for (const file of ['review.html', 'needs-update.html', 'process-status.html', 'edit.html']) {
      assert.match(await fs.readFile(path.join(f.site, file), 'utf8'), /<meta name="robots" content="noindex,follow">/);
      assert(!sitemap.includes(file));
    }
    const first = await fs.readFile(path.join(f.site, 'index.html'), 'utf8');
    assert(Buffer.byteLength(first) < 100000, 'Initial HTML remains bounded rather than embedding the catalogue');
    assert(!first.includes('project-126.md'));
  } finally { await f.cleanup(); }
});

test('rebuild after withdrawals removes obsolete pages from disk, sitemap and release manifest', async () => {
  const f = await fixture();
  try {
    await fs.writeFile(path.join(f.site, 'assets/keep.txt'), 'An unrelated release asset');
    assert((await fs.stat(path.join(f.site, 'pages/3.html'))).isFile());
    assert((await fs.stat(path.join(f.site, 'categories/defi/3.html'))).isFile());
    await f.write(allEntries.map((entry, index) => index < 2 ? entry : { ...entry, verification_status: 'rejected' }));
    f.build();
    for (const file of ['pages/2.html', 'pages/3.html', 'categories/defi/2.html', 'categories/defi/3.html']) {
      await assert.rejects(fs.stat(path.join(f.site, file)), { code: 'ENOENT' });
    }
    assert.equal(await fs.readFile(path.join(f.site, 'assets/keep.txt'), 'utf8'), 'An unrelated release asset');
    assert.deepEqual((await walk(f.site, '/')).records, ['project-000.md', 'project-001.md']);
    const manifest = JSON.parse(await fs.readFile(path.join(f.site, 'release.json'), 'utf8'));
    assert(!Object.keys(manifest.files).some(file => file.startsWith('pages/') || file.startsWith('categories/defi/')));
  } finally { await f.cleanup(); }
});

function searchFixture(fetch) {
  const nodes = new Map();
  for (const id of ['search', 'category', 'rows', 'catalog-count', 'catalog-pagination', 'search-pagination',
    'search-previous', 'search-next', 'catalog-search-status', 'catalog-retry', 'search-page']) {
    const listeners = new Map();
    nodes.set(id, { value: '', innerHTML: '', textContent: '', hidden: false, disabled: false,
      addEventListener: (event, handler) => listeners.set(event, handler),
      emit: event => listeners.get(event)?.(), setAttribute() {}, removeAttribute() {} });
  }
  nodes.get('rows').innerHTML = tableRows(entries.slice(50, 100), '../');
  nodes.get('catalog-count').textContent = 'Showing 51–100 of 127 verified projects.';
  nodes.get('search-pagination').hidden = true;
  const controls = { dataset: { source: '../data/projects.json', prefix: '../' } }, events = [];
  const document = { querySelector: () => controls, getElementById: id => nodes.get(id), dispatchEvent: event => events.push(event.type) };
  mountDirectorySearch({ document, fetch });
  return { nodes, events, original: nodes.get('rows').innerHTML,
    input: async (id, value) => { nodes.get(id).value = value; await nodes.get(id).emit(id === 'search' ? 'input' : 'change'); } };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('lazy search finds later-page records, pages all matches and restores the exact initial page', async () => {
  let requests = 0;
  const f = searchFixture(async () => { requests += 1; return { ok: true, json: async () => allEntries }; });
  assert.equal(requests, 0);
  await f.input('search', 'Project 126');
  assert.deepEqual(ids(f.nodes.get('rows').innerHTML), ['project-126.md']);
  assert.match(f.nodes.get('rows').innerHTML, /href="..\/edit.html\?id=project-126.md"/);
  await f.input('search', 'Ethereum');
  const collected = [...ids(f.nodes.get('rows').innerHTML)];
  while (!f.nodes.get('search-next').disabled) {
    f.nodes.get('search-next').emit('click'); await flush();
    collected.push(...ids(f.nodes.get('rows').innerHTML));
  }
  assert.deepEqual(collected, entries.map(entry => entry.id));
  assert.equal(requests, 1);
  await f.input('category', 'Wallets');
  assert.deepEqual(ids(f.nodes.get('rows').innerHTML), entries.slice(102).map(entry => entry.id));
  await f.input('search', 'Excluded');
  assert.deepEqual(ids(f.nodes.get('rows').innerHTML), []);
  assert.equal(f.nodes.get('catalog-count').textContent, 'No verified projects match these filters.');
  await f.input('search', ''); await f.input('category', '');
  assert.equal(f.nodes.get('rows').innerHTML, f.original);
  assert.equal(f.nodes.get('catalog-count').textContent, 'Showing 51–100 of 127 verified projects.');
  assert.equal(f.nodes.get('catalog-pagination').hidden, false);
  assert.equal(f.nodes.get('search-pagination').hidden, true);
  assert(f.events.length >= 7 && f.events.every(event => event === 'directory-rows-rendered'));
});

test('clearing search during the catalogue request cannot replace the restored page', async () => {
  let resolve;
  const f = searchFixture(() => new Promise(done => { resolve = done; }));
  const pending = f.input('search', 'Project 126');
  await f.input('search', '');
  resolve({ ok: true, json: async () => allEntries });
  await pending;
  assert.equal(f.nodes.get('rows').innerHTML, f.original);
  assert.equal(f.nodes.get('catalog-pagination').hidden, false);
  assert.equal(f.nodes.get('catalog-search-status').textContent, '');
});

for (const failure of ['network', 'invalid-json']) test(`search ${failure} keeps static browsing and supports retry`, async () => {
  let requests = 0;
  const f = searchFixture(async () => {
    requests += 1;
    if (requests === 1) {
      if (failure === 'network') throw new Error('Offline');
      return { ok: true, json: async () => [{ name: 'Incomplete record' }] };
    }
    return { ok: true, json: async () => allEntries };
  });
  await f.input('search', 'Project 126');
  assert.equal(f.nodes.get('rows').innerHTML, f.original);
  assert.equal(f.nodes.get('catalog-pagination').hidden, false);
  assert.equal(f.nodes.get('catalog-retry').hidden, false);
  assert.match(f.nodes.get('catalog-search-status').textContent, /Search is unavailable/);
  await f.nodes.get('catalog-retry').emit('click');
  assert.deepEqual(ids(f.nodes.get('rows').innerHTML), ['project-126.md']);
  assert.equal(f.nodes.get('catalog-retry').hidden, true);
  assert.equal(requests, 2);
});

test('mobile rows retain every listing field and semantic row headers, with safe labels',()=>{
  const html=tableRows([{...entries[0],name:'Unsafe <name>',description:'</script><img src=x>',token:'FIX',token_url:'https://fixture.example/token'}]);
  assert.match(html,/<th scope="row" class="project-name">/);assert.match(html,/Unsafe &lt;name&gt;/);assert(!html.includes('<img'));
  for(const label of ['Description','Links','Tags','Ecosystem','Founded','HQ','Token','X'])assert(html.includes('data-label="'+label+'"'));
});
test('live and filtered structured data track only the visible bounded page and preserve its canonical graph',()=>{
  const state=projectPage(entries,2),list=catalogueItemList(state);assert.equal(list.numberOfItems,50);assert.equal(list.itemListElement[0].position,51);
  const node={textContent:JSON.stringify({'@graph':[{'@type':'CollectionPage',url:baseUrl+'/pages/2.html'},list]})},document={getElementById:()=>node};
  const updated=projectPage([{...entries[0],name:'</script>Public update'}]);updateCatalogueSchema(document,updated);
  assert(!node.textContent.includes('</script>'));const graph=JSON.parse(node.textContent)['@graph'];assert.equal(graph[0].url,baseUrl+'/pages/2.html');assert.equal(graph[1].numberOfItems,1);assert.equal(graph[1].itemListElement[0].item.name,'</script>Public update');
});

test('server-rendered listing schema escapes HTML delimiters without changing the source text',async()=>{
  const f=await fixture();
  try{
    const description='Official </script><img src=x> project description with source evidence.';
    await f.write([{...entries[0],description}]);f.build();
    const html=await fs.readFile(path.join(f.site,'index.html'),'utf8'),raw=html.match(/<script id="catalog-schema" type="application\/ld\+json">([^<]+)<\/script>/)[1];
    assert(!raw.includes('</script>'));
    const list=JSON.parse(raw)['@graph'].find(x=>x['@type']==='ItemList');assert.equal(list.itemListElement[0].item.description,description);
  }finally{await f.cleanup();}
});
