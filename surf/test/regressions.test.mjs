import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCatalog,resolveProject,currentSelection} from '../public/core.js';
import {bindVisitLink,clearViewer} from '../public/viewer.js';
import {permitsEmbedding,inspectFrame,publicAddress} from '../lib/frame.js';
const raw={id:'aave.md',name:'Aave',lead_category:'DeFi',verification_status:'verified',description:'Lending',primary_url:'https://aave.com',product_url:'https://app.aave.com',tags:[],ecosystem:[]};
test('entry identity survives website, product and name edits; original share IDs still resolve',()=>{
  const before=normalizeCatalog([raw])[0],after=normalizeCatalog([{...raw,name:'Aave renamed',primary_url:'https://new.aave.com',product_url:'https://new.app.aave.com'}])[0];
  assert.equal(before.id,'aave.md');assert.equal(before.id,after.id);assert.equal(resolveProject('https://aave.com',[after]).id,'aave.md');assert.equal(resolveProject('aave.md',[after]).name,'Aave renamed');
});
test('no URL-derived IDs are created when a feed entry lacks its stable directory ID',()=>{const {id,...missing}=raw;assert.deepEqual(normalizeCatalog([missing]),[]);});
test('refresh invalidates removed or rejected current projects',()=>{const p=normalizeCatalog([raw])[0],current={id:p.id,type:'product',url:p.product};assert.equal(currentSelection(current,[]),null);assert.equal(currentSelection(current,normalizeCatalog([{...raw,verification_status:'rejected'}])),null);});
test('refresh rechecks the selected category and product eligibility with unchanged IDs',()=>{
  const current={id:'aave.md',type:'product'};
  assert.equal(currentSelection(current,normalizeCatalog([{...raw,product_url:'n/a'}]),'DeFi','product'),null);
  assert.equal(currentSelection(current,normalizeCatalog([{...raw,lead_category:'Wallets'}]),'DeFi','product'),null);
  assert.equal(currentSelection({...current,type:'website'},normalizeCatalog([raw]),'DeFi','product'),null);
});
test('refresh retains stable IDs while replacing changed target URLs',()=>{const [p]=normalizeCatalog([{...raw,product_url:'https://new.app.aave.com'}]);const selected=currentSelection({id:'https://aave.com',type:'product'},[p],'DeFi','product');assert.equal(selected.id,'aave.md');assert.equal(selected.url,'https://new.app.aave.com/');});
test('clearing the viewer removes every stale iframe and outbound link',()=>{
  const elements=new Map();const ids=['site-frame','site-stage','browserbar','welcome','open-site','fallback-open','help-open','site-name','site-domain','site-kind','fallback-title','fallback-description','save-project'];
  for(const id of ids)elements.set(id,{hidden:false,textContent:'stale project',attrs:new Map([['href','https://old.example.org'],['src','https://old.example.org']]),removeAttribute(k){this.attrs.delete(k);},setAttribute(k,v){this.attrs.set(k,v);}});
  clearViewer({getElementById:id=>elements.get(id)});
  assert.equal(elements.get('site-frame').attrs.has('src'),false);assert.equal(elements.get('site-stage').hidden,true);assert.equal(elements.get('welcome').hidden,false);assert.equal(elements.get('save-project').disabled,true);
  for(const id of ['open-site','fallback-open','help-open'])assert.equal(elements.get(id).attrs.has('href'),false);
  assert.equal(elements.get('site-name').textContent,'');
});
test('outbound visit tracking counts ordinary and middle clicks once, excluding right clicks',()=>{
  const target=new EventTarget();let count=0;bindVisitLink(target,()=>count++);
  function dispatch(type,button){const e=new Event(type);Object.defineProperty(e,'button',{value:button});target.dispatchEvent(e);}
  dispatch('click',0);assert.equal(count,1);dispatch('auxclick',1);assert.equal(count,2);dispatch('auxclick',2);dispatch('click',1);assert.equal(count,2);
});
test('embedding honors CSP frame-ancestors and X-Frame-Options',()=>{
  assert.equal(permitsEmbedding({'x-frame-options':'DENY'},'https://example.org'),false);
  assert.equal(permitsEmbedding({'x-frame-options':'SAMEORIGIN'},'https://example.org'),false);
  assert.equal(permitsEmbedding({'content-security-policy':"frame-ancestors 'none'"},'https://example.org'),false);
  assert.equal(permitsEmbedding({'content-security-policy':"default-src 'self'; frame-ancestors https://surf.bittrees.org"},'https://example.org'),true);
  assert.equal(permitsEmbedding({'content-security-policy':"frame-ancestors https://*.bittrees.org"},'https://example.org'),true);
  assert.equal(permitsEmbedding({'content-security-policy':"frame-ancestors *; frame-ancestors 'none'"},'https://example.org'),false);
});
test('frame checks follow redirects, preserve restrictions, and label unknown failures honestly',async()=>{
  const urls=[];const result=await inspectFrame('https://example.org',{request:async url=>{urls.push(url);return urls.length===1?{status:302,headers:{location:'https://www.example.org'}}:{status:200,headers:{'x-frame-options':'DENY'}};}});
  assert.equal(result.status,'external');assert.equal(result.reason,'embedding-blocked');assert.equal(urls.length,2);
  assert.equal((await inspectFrame('https://example.org',{request:async()=>{throw Error();}})).status,'unknown');
});
test('frame network guard excludes private, loopback and mapped IPv6 addresses',()=>{
  for(const ip of ['127.0.0.1','10.0.0.1','172.16.0.1','192.168.1.1','169.254.169.254','100.64.0.1','::1','::ffff:127.0.0.1','fe80::1','fc00::1','2001:db8::1'])assert.equal(publicAddress(ip),false,ip);
  assert.equal(publicAddress('8.8.8.8'),true);assert.equal(publicAddress('2606:4700:4700::1111'),true);
});
