import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../public/',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const head=html.slice(0,html.indexOf('</head>'));
const origin='https://surf.bittrees.org/';
const attribute=(tag,name)=>tag.match(new RegExp('(?:^|\\s)'+name+'=["\u0027]([^"\u0027]*)["\u0027]','i'))?.[1]?.replaceAll('&amp;','&');
const metas=[...head.matchAll(/<meta\b[^>]*>/gi)].map(([tag])=>({name:attribute(tag,'name')||attribute(tag,'property'),content:attribute(tag,'content')}));
const meta=name=>metas.find(m=>m.name===name)?.content;
const links=[...head.matchAll(/<link\b[^>]*>/gi)].map(([tag])=>({rel:attribute(tag,'rel'),href:attribute(tag,'href')}));

test('canonical, search and social metadata agree on one public identity',()=>{
  const title=head.match(/<title>([^<]+)<\/title>/)?.[1].replaceAll('&amp;','&');
  assert(title.includes('Surf by Bittrees')&&title.includes('Web3'));
  assert(meta('description').length>=100&&meta('description').length<=170);
  assert.deepEqual(links.filter(l=>l.rel==='canonical').map(l=>l.href),[origin]);
  assert.equal(meta('og:url'),origin);assert.equal(meta('og:type'),'website');
  assert.equal(meta('og:site_name'),'Surf by Bittrees');
  for(const name of ['og:title','twitter:title'])assert.equal(meta(name),title);
  for(const name of ['og:description','twitter:description'])assert.equal(meta(name),meta('description'));
  assert.equal(meta('twitter:card'),'summary_large_image');
  assert(!/noindex/i.test(meta('robots')));assert(meta('robots').includes('max-image-preview:large'));
  assert(!/1,?488|1,?003/.test(head),'Search metadata must not freeze a changing directory count');
});

test('social and touch assets exist with their advertised raster dimensions',async()=>{
  const image=meta('og:image');assert.equal(image,origin+'social.png');assert.equal(meta('twitter:image'),image);
  assert.equal(meta('og:image:type'),'image/png');assert(meta('og:image:alt'));assert(meta('twitter:image:alt'));
  for(const [name,width,height] of [['social.png',1200,630],['favicon-192.png',192,192],['apple-touch-icon.png',180,180]]){
    const png=await readFile(new URL(name,root));assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name);
    assert.equal(png.readUInt32BE(16),width,name);assert.equal(png.readUInt32BE(20),height,name);
  }
  assert.equal(Number(meta('og:image:width')),1200);assert.equal(Number(meta('og:image:height')),630);
});

test('structured site and page data reference the canonical URL and real publisher',()=>{
  const blocks=[...head.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)];assert.equal(blocks.length,1);
  const data=JSON.parse(blocks[0][1]);assert.equal(data['@context'],'https://schema.org');
  const sites=data['@graph'].filter(n=>n['@type']==='WebSite');assert.equal(sites.length,1);
  const site=sites[0],page=data['@graph'].find(n=>n['@type']==='WebPage'),publisher=data['@graph'].find(n=>n['@type']==='Organization');
  assert.equal(site.url,origin);assert.equal(site.name,meta('og:site_name'));assert(site.alternateName.includes('Surf'));
  assert.equal(page.url,origin);assert.equal(page.isPartOf['@id'],site['@id']);assert.equal(page.primaryImageOfPage.url,meta('og:image'));
  assert.equal(site.publisher['@id'],publisher['@id']);assert.equal(publisher.url,'https://bittrees.org/');
  assert(!JSON.stringify(data).includes('SearchAction'));assert(!JSON.stringify(data).includes('aggregateRating'));
});

test('crawl files advertise only the canonical landing page and errors stay out of search',async()=>{
  const robots=await readFile(new URL('robots.txt',root),'utf8'),sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
  assert(robots.includes('Allow: /'));assert(!/^Disallow:\s*\/\s*$/m.test(robots));assert(robots.includes('Sitemap: '+origin+'sitemap.xml'));
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),[origin]);
  const error=await readFile(new URL('404.html',root),'utf8');assert(/<meta name="robots" content="noindex, follow">/.test(error));
  assert(error.includes('href="/"'));assert(!error.includes('src="/app.js"'));
  assert(html.includes('<noscript>'));assert(html.includes('browse CryptoDirectory directly'));
  assert(!html.includes('Connecting to the directory…'));
});
