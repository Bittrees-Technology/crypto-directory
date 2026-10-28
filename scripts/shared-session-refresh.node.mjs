import test from 'node:test';
import assert from 'node:assert/strict';
const paths=["../shared/roles-administration/sso/client.mjs"];
for(const path of paths){
 const {createSsoClient,seal,digest}=await import(new URL(path,import.meta.url));
 const origin='https://app.test',secret='test-only-client-secret-not-a-real-credential',issuer='https://issuer.test';
 function fixture(prefix='bt-sso'){
  let actor=null,calls=0;const jar=new Map();
  const client=createSsoClient({clientId:'test',origin,issuer,secret,enabled:true,cookiePrefix:prefix,adapter:{async current(){return actor;},async establish(){throw Error('No establishment in negative tests');}},fetcher:async()=>{calls++;throw Error('Issuer unavailable');}});
  async function request(path){const r=await client(new Request(origin+path,{headers:{cookie:[...jar].map(([k,v])=>`${k}=${v}`).join('; ')}}));for(const c of r.headers.getSetCookie()){const [pair]=c.split(';'),at=pair.indexOf('='),key=pair.slice(0,at),value=pair.slice(at+1);if(c.includes('Max-Age=0'))jar.delete(key);else jar.set(key,value);}return r;}
  return {request,jar,setActor(v){actor=v;},get calls(){return calls;}};
 }
 test(path+': failed resume stays suppressed on repeated refresh without extending cooldown',async()=>{
  const f=fixture();let r=await f.request('/api/sso/start?mode=resume&return_to=%2Faccount');const state=new URL(r.headers.get('location')).searchParams.get('state');
  r=await f.request('/api/sso/callback?state='+state+'&error=login_required');assert.equal(r.headers.get('location'),origin+'/account');
  const c=r.headers.getSetCookie().find(c=>c.startsWith('__Host-bt-sso-skip='));for(const flag of ['HttpOnly','Secure','SameSite=Lax','Max-Age=30'])assert(c.includes(flag));assert(!c.includes('Domain='));
  for(let i=0;i<3;i++){r=await f.request('/api/sso/status');assert.equal((await r.json()).action,null);assert.equal(r.headers.getSetCookie().length,0);assert.match(r.headers.get('cache-control'),/no-store/);}
  f.jar.delete('__Host-bt-sso-skip');assert.equal((await(await f.request('/api/sso/status')).json()).action,'resume');assert.equal(f.calls,0);
 });
 test(path+': failed publication is bound to the current session and does not loop',async()=>{
  const f=fixture();const old={key:'original',identity:'person@example.org',authTime:Date.now()-60000};f.setActor(old);
  const r=await f.request('/api/sso/start?mode=publish');const state=new URL(r.headers.get('location')).searchParams.get('state');await f.request('/api/sso/publish?state='+state+'&challenge=test');
  for(let i=0;i<3;i++)assert.equal((await(await f.request('/api/sso/status')).json()).action,null);
  assert.equal(f.calls,1);f.setActor({...old,key:'new-session'});assert.equal((await(await f.request('/api/sso/status')).json()).action,'publish');
 });
 test(path+': expired, forged and mismatched retry cookies cannot suppress a different session',async()=>{
  const f=fixture();f.jar.set('__Host-bt-sso-skip',seal({retry:true,sessionHash:null,expires:Date.now()-1},secret));assert.equal((await(await f.request('/api/sso/status')).json()).action,'resume');
  f.jar.set('__Host-bt-sso-skip','forged');assert.equal((await(await f.request('/api/sso/status')).json()).action,'resume');
  f.jar.set('__Host-bt-sso-skip','1');assert.equal((await(await f.request('/api/sso/status')).json()).action,null);
  f.setActor({key:'fresh',identity:'person@example.org',authTime:Date.now()});assert.equal((await(await f.request('/api/sso/status')).json()).action,'publish');
 });
 test(path+': revoked local session denies private profile even with sealed old proof',async()=>{
  const f=fixture();f.jar.set('__Host-bt-sso-proof',seal({sessionHash:digest('old'),authTime:Date.now()},secret));assert.equal((await f.request('/api/sso/profile')).status,401);assert.equal(f.calls,0);
 });
 test(path+': separate client cookie namespace does not consume native logout or proof',async()=>{
  const f=fixture('project-admin-bt-sso');f.jar.set('__Host-bt-sso-skip','1');assert.equal((await(await f.request('/api/sso/status')).json()).action,'resume');
 });
}
