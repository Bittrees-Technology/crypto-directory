import test from 'node:test';
import assert from 'node:assert/strict';
import {accountService,ORIGIN} from '../lib/account.js';
import {digest} from '../lib/sso/client.mjs';
const secret='test-only-secret-'.repeat(4),tokenA='a'.repeat(43),tokenB='b'.repeat(43);
function fixture(){const strings=new Map(),hashes=new Map();const expires=Date.now()+3600000;
  strings.set('surf:session:'+digest(tokenA),JSON.stringify({identity:'a@example.org',authTime:Date.now(),expires}));strings.set('surf:session:'+digest(tokenB),JSON.stringify({identity:'b@example.org',authTime:Date.now(),expires}));
  const store=async(command,...args)=>{if(command==='GET')return strings.get(args[0]);if(command==='DEL')return strings.delete(args[0]);if(command==='SET'){strings.set(args[0],args[1]);return 'OK';}if(command==='HVALS')return [...(hashes.get(args[0])?.values()||[])];if(command==='HDEL')return hashes.get(args[0])?.delete(args[1]);if(command==='EVAL'){const key=args[2],field=args[3],value=args[4];if(!hashes.has(key))hashes.set(key,new Map());hashes.get(key).set(field,value);return 1;}throw Error('Unexpected storage command');};
  const service=accountService({env:{SURF_SSO_CLIENT_SECRET:secret},store});
  const request=(path,token=tokenA,body=null,csrf='')=>new Request(ORIGIN+path,{method:body?'POST':'GET',headers:{Host:'surf.bittrees.org',Cookie:'__Host-surf-session='+token,...(body?{Origin:ORIGIN,'Content-Type':'application/json','X-Surf-CSRF':csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});
  return {service,request,hashes};
}
const catalog=async()=>({projects:[{id:'aave.md',name:'Aave',website:'https://aave.com/',product:'https://app.aave.com/'}]});
test('account UI gets an honest unavailable state when credentials/storage are missing',async()=>{const s=accountService({env:{}});const r=await s.handle(new Request(ORIGIN+'/api/account/session'));assert.deepEqual(await r.json(),{configured:false,signedIn:false});});
test('a forged or unknown session never exposes a saved collection',async()=>{const f=fixture();const r=await f.service.handle(f.request('/api/account/saved','z'.repeat(43)));assert.equal(r.status,401);});
test('saved websites and products are private to the signed-in identity',async()=>{const f=fixture(),session=await(await f.service.handle(f.request('/api/account/session'))).json();for(const type of ['website','product'])assert.equal((await f.service.handle(f.request('/api/account/saved',tokenA,{action:'save',id:'aave.md',type},session.csrf),{catalog})).status,200);const a=await(await f.service.handle(f.request('/api/account/saved',tokenA))).json(),b=await(await f.service.handle(f.request('/api/account/saved',tokenB))).json();assert.equal(a.saved.length,2);assert.equal(b.saved.length,0);assert.notEqual(a.saved[0].url,a.saved[1].url);});
test('save requests require exact origin and session-bound CSRF; callers cannot choose identities',async()=>{const f=fixture();assert.equal((await f.service.handle(f.request('/api/account/saved',tokenA,{action:'save',id:'aave.md',type:'website'},'wrong'),{catalog})).status,403);const s=await(await f.service.handle(f.request('/api/account/session'))).json();const r=f.request('/api/account/saved',tokenA,{action:'save',id:'aave.md',type:'website'},s.csrf);r.headers.set('Origin','https://attacker.example');assert.equal((await f.service.handle(r,{catalog})).status,403);assert.equal((await f.service.handle(f.request('/api/account/saved',tokenA,{action:'save',id:'aave.md',type:'website',identity:'b@example.org'},s.csrf),{catalog})).status,400);});
test('saved target URLs come from the current verified directory, never caller input',async()=>{const f=fixture(),s=await(await f.service.handle(f.request('/api/account/session'))).json();const r=await f.service.handle(f.request('/api/account/saved',tokenA,{action:'save',id:'removed.md',type:'website'},s.csrf),{catalog});assert.equal(r.status,404);assert.equal(f.hashes.size,0);});
test('logout revokes the server session, not only the browser cookie',async()=>{const f=fixture(),s=await(await f.service.handle(f.request('/api/account/session'))).json();const r=await f.service.handle(f.request('/api/account/logout',tokenA,{},s.csrf));assert.equal(r.status,200);assert.ok(r.headers.getSetCookie().some(c=>c.startsWith('__Host-surf-session=;')));assert.equal((await f.service.handle(f.request('/api/account/saved',tokenA))).status,401);});
test('shared sign-in starts a sealed PKCE flow and establishes a Surf session only after redemption',async()=>{
  const storage=new Map();let redeemed=false;
  const service=accountService({env:{SURF_SSO_CLIENT_SECRET:secret},store:async(command,key,value)=>{if(command==='GET')return storage.get(key);if(command==='SET'){storage.set(key,value);return 'OK';}throw Error('Unexpected command');},fetcher:async(url,options)=>{
    assert.equal(url,'https://roles.bittrees.org/api/sso/redeem');const b=JSON.parse(options.body);assert.equal(b.client_id,'surf');assert.equal(b.redirect_uri,ORIGIN+'/api/sso/callback');assert.match(b.code_verifier,/^[A-Za-z0-9_-]{43}$/);redeemed=true;return Response.json({issuer:'https://roles.bittrees.org',audience:'surf',identity:'fixture@example.org',auth_time:Date.now()});
  }});
  const start=await service.handle(new Request(ORIGIN+'/api/sso/start?mode=resume&return_to='+encodeURIComponent('/?project=aave.md&type=product')));
  assert.equal(start.status,303);const issuer=new URL(start.headers.get('Location'));assert.equal(issuer.origin,'https://roles.bittrees.org');assert.equal(issuer.searchParams.get('client_id'),'surf');assert.match(issuer.searchParams.get('code_challenge'),/^[A-Za-z0-9_-]{43}$/);
  const flow=start.headers.getSetCookie().map(c=>c.split(';')[0]).join('; '),state=issuer.searchParams.get('state');
  const callback=await service.handle(new Request(ORIGIN+'/api/sso/callback?'+new URLSearchParams({state,code:'synthetic-one-use-code'}),{headers:{cookie:flow}}));
  assert.equal(redeemed,true);assert.equal(callback.headers.get('Location'),ORIGIN+'/?project=aave.md&type=product');
  const sessionCookie=callback.headers.getSetCookie().find(c=>c.startsWith('__Host-surf-session='));assert(sessionCookie.includes('HttpOnly')&&sessionCookie.includes('Secure'));
  const session=await(await service.handle(new Request(ORIGIN+'/api/account/session',{headers:{cookie:sessionCookie.split(';')[0]}}))).json();assert.equal(session.signedIn,true);assert.equal(session.identity,'fixture@example.org');
});
test('an unsolicited SSO callback never creates an account session',async()=>{
  let writes=0;const service=accountService({env:{SURF_SSO_CLIENT_SECRET:secret},store:async()=>{writes++;return null;},fetcher:async()=>{throw Error('Should not redeem without a transaction');}});
  const response=await service.handle(new Request(ORIGIN+'/api/sso/callback?state=forged&code=forged'));
  assert.equal(writes,0);assert.equal(response.headers.getSetCookie().some(c=>c.startsWith('__Host-surf-session=')),false);
});
