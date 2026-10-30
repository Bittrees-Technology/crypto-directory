import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const origin='https://surf.bittrees.org/';
const output=process.argv[2]||'surf-seo-artifacts';
const source=new URL('../public/',import.meta.url);
const names=['index.html','style.css','landing.css','app.js'];
const expected=await Promise.all(names.map(name=>readFile(new URL(name,source))));
const hash=body=>createHash('sha256').update(body).digest('hex');
async function request(url){
  const response=await fetch(new URL(url,origin),{redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(10000)});
  return {response,body:Buffer.from(await response.arrayBuffer())};
}
let home,matched=false;
for(let attempt=0;attempt<18;attempt++){
  try{
    const results=await Promise.all(names.map(name=>request((name==='index.html'?'/':'/'+name)+'?surf_release='+encodeURIComponent(process.env.GITHUB_SHA||'manual'))));
    matched=results.every(({response,body},i)=>response.status===200&&body.equals(expected[i]));
    if(matched){home=results[0];break;}
  }catch(error){console.log('Waiting for source:',error.message);}
  console.log('Waiting for the exact Surf source ('+(attempt+1)+'/18)');
  await new Promise(resolve=>setTimeout(resolve,5000));
}
assert(matched,'The public deployment does not match the checked-out Surf source');
assert(!/noindex/i.test(home.response.headers.get('x-robots-tag')||''),'Homepage must be indexable');
const checks=[];
for(const [url,target] of [
  ['http://surf.bittrees.org/',origin],
  ['/index.html',origin],['/index',origin],
  ['https://bittrees-surf.vercel.app/',origin],
  ['https://bittrees-surf.vercel.app/?project=aave.md&type=product',origin+'?project=aave.md&type=product'],
  ['https://bittrees-surf.vercel.app/robots.txt',origin+'robots.txt']
]){
  const {response}=await request(url);assert.equal(response.status,308,url);
  const destination=new URL(response.headers.get('location'),new URL(url,origin));
  assert.equal(destination.href,target,url);checks.push({url,status:response.status,destination:destination.href});
}
const missing=await request('/missing-surf-seo-check');assert.equal(missing.response.status,404);
assert(missing.body.toString().includes('content="noindex, follow"'));checks.push({url:'/missing-surf-seo-check',status:404});
const robots=await request('/robots.txt');assert.equal(robots.response.status,200);assert(robots.response.headers.get('content-type').includes('text/plain'));
assert(robots.body.toString().includes('Allow: /'));assert(robots.body.toString().includes('Sitemap: '+origin+'sitemap.xml'));
const sitemap=await request('/sitemap.xml');assert.equal(sitemap.response.status,200);assert(sitemap.response.headers.get('content-type').includes('xml'));
assert.deepEqual([...sitemap.body.toString().matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),[origin]);
for(const [name,width,height] of [['social.png',1200,630],['favicon-192.png',192,192],['apple-touch-icon.png',180,180]]){
  const {response,body}=await request('/'+name);assert.equal(response.status,200);assert(response.headers.get('content-type').includes('image/png'));
  assert.equal(body.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(body.readUInt32BE(16),width);assert.equal(body.readUInt32BE(20),height);
}
for(const url of ['/catalog.json','/api/catalog','/api/account/session']){
  const {response}=await request(url);assert.equal(response.status,200,url);assert(/noindex/i.test(response.headers.get('x-robots-tag')||''),url);
  if(url.endsWith('/session'))assert(response.headers.get('cache-control').includes('no-store'));
}
await mkdir(output,{recursive:true});
const receipt={checkedAt:new Date().toISOString(),commit:process.env.GITHUB_SHA||null,origin,sourceHashes:Object.fromEntries(names.map((name,i)=>[name,hash(expected[i])])),checks};
await writeFile(output+'/live-http.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({liveSeoHttp:'passed',commit:receipt.commit,sourceHashes:receipt.sourceHashes,redirectChecks:checks}));
