import {profileEnvelope} from './profile-model.mjs';
import {createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
export const digest=value=>createHash('sha256').update(value).digest('hex');
export const random=()=>randomBytes(32).toString('base64url');
export const pkce=value=>createHash('sha256').update(value).digest('base64url');
export function equal(a,b){const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&timingSafeEqual(x,y);}
export function identity(value){if(typeof value!=='string')throw Error('Invalid identity');const v=value.trim().toLowerCase();if(v.length>254||!(/^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/.test(v)||/^0x[0-9a-f]{40}$/.test(v)))throw Error('Invalid identity');return v;}
export function safeOrigin(value){const u=new URL(value);if(u.origin!==value||u.username||u.password||!(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname))))throw Error('Invalid SSO origin');return u.origin;}
export function returnPath(value){return typeof value==='string'&&value.startsWith('/')&&!value.startsWith('//')&&!/[\\\r\n]/.test(value)&&value.length<=2048&&!value.startsWith('/api/')?value:'/';}
export const cookies=req=>Object.fromEntries((req.headers.get('cookie')||'').split(';').map(v=>{const at=v.indexOf('=');return at<0?['','']:[v.slice(0,at).trim(),v.slice(at+1)];}));
export function cookie(name,value,seconds,origin){return `${origin.startsWith('https:')?'__Host-':''}${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${origin.startsWith('https:')?'; Secure':''}`;}
export function readCookie(req,name,origin){return cookies(req)[`${origin.startsWith('https:')?'__Host-':''}${name}`]||'';}
export function headers(){return new Headers({'Cache-Control':'private, no-store','Pragma':'no-cache','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"});}
export function json(body,status=200){return Response.json(body,{status,headers:headers()});}
export function redirect(url,values=[]){const h=headers();h.set('Location',url);for(const c of values)h.append('Set-Cookie',c);return new Response(null,{status:303,headers:h});}
export function seal(value,secret){const payload=Buffer.from(JSON.stringify(value)).toString('base64url');return payload+'.'+createHmac('sha256',secret).update(payload).digest('base64url');}
export function unseal(value,secret){try{const [payload,signature,...rest]=value.split('.');if(rest.length||!equal(signature,createHmac('sha256',secret).update(payload).digest('base64url')))return null;return JSON.parse(Buffer.from(payload,'base64url'));}catch{return null;}}
export async function body(req){if(Number(req.headers.get('content-length')||0)>8192)throw Error('Request too large');const text=await req.text();if(text.length>8192)throw Error('Request too large');return JSON.parse(text||'{}');}

/** Server-side adapter keeps each app's session and authorization model intact. */
export function createSsoClient({clientId,origin,issuer,secret,enabled,adapter,fetcher=fetch,callbackPath='/api/sso/callback',cookiePrefix='bt-sso'}){
 const configured=enabled===true&&typeof secret==='string'&&secret.length>=32&&!!clientId&&!!origin&&!!issuer;
 if(configured){safeOrigin(origin);safeOrigin(issuer);}
 if(!['/api/sso/callback','/api/project-admin/sso/callback'].includes(callbackPath))throw Error('Invalid callback path');
 if(!/^[a-z][a-z0-9-]{2,48}$/.test(cookiePrefix))throw Error('Invalid cookie prefix');
 const name=suffix=>cookiePrefix+'-'+suffix;
 const callback=()=>origin+callbackPath;
 // Negative handoff results only: never an identity or authorization cache.
 const retryCookie=session=>cookie(name('skip'),seal({retry:true,sessionHash:session?digest(session.key):null,expires:Date.now()+30000},secret),30,origin);
 async function call(action,data){const r=await fetcher(issuer+'/api/sso/'+action,{method:'POST',redirect:'error',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json',Authorization:'Bearer '+secret},body:JSON.stringify({...data,client_id:clientId,redirect_uri:callback()})});if(!r.ok)throw Error('Shared sign-in unavailable');return action==='profile-read'?body(r):r.json();}
 function transaction(req){const t=unseal(readCookie(req,name('flow'),origin),secret);if(!t||!Number.isFinite(t.expires)||t.expires<Date.now()||!equal(t.state,new URL(req.url).searchParams.get('state')))throw Error('Sign-in request expired');return t;}
 return async function handle(req){
  const url=new URL(req.url),action=url.pathname.split('/').pop();
  if(!configured)return action==='status'?json({configured:false}):json({error:'Shared sign-in is not configured'},503);
  if(url.origin!==origin)return json({error:'Unexpected application origin'},403);
  if(req.method!=='GET')return json({error:'Method not allowed'},405);
  if(req.headers.get('sec-fetch-site')==='cross-site'&&!['callback','publish'].includes(action))return json({error:'Cross-site request rejected'},403);
  let t,session;
  try{
   session=await adapter.current(req);
   const proof=unseal(readCookie(req,name('proof'),origin),secret);
   if(session&&proof&&equal(proof.sessionHash,digest(session.key))&&Number.isFinite(proof.authTime)){
    // Recover only the original sealed, session-bound proof when a legacy
    // adapter has no timestamp. Never invent freshness or update native storage.
    const local=Number.isFinite(session.authTime)&&session.authTime>0?session.authTime:null;
    if(local!==null)session={...session,authTime:Math.min(local,proof.authTime)};
    else if(proof.authTime>0&&proof.authTime<=Date.now()+30000&&proof.authTime>=Date.now()-604800000)session={...session,authTime:proof.authTime};
   }
   if(action==='profile'){
    if(!session)return json({error:'Sign in required'},401);
    const result=await call('profile-read',{identity:identity(session.identity),auth_time:session.authTime});
    const current=await adapter.current(req);
    if(!current||!equal(current.key,session.key)||identity(current.identity)!==identity(session.identity))return json({error:'Session changed'},401);
    return json(profileEnvelope(result));
   }
   if(action==='status'){
    const published=readCookie(req,name('published'),origin),suppressed=readCookie(req,name('skip'),origin);
    const retry=unseal(suppressed,secret);
    const cooling=retry?.retry===true&&Number.isFinite(retry.expires)&&retry.expires>Date.now()&&retry.expires<=Date.now()+30000&&retry.sessionHash===(session?digest(session.key):null);
    const next=cooling||suppressed==='once'?null:session?(published===digest(session.key)?null:'publish'):(suppressed==='1'?null:'resume');
    const response=json({configured:true,action:next});
    // A failed automatic handoff gets a short host-only retry cooldown.
    // Keep explicit sign-out suppression unchanged; neither cookie grants access.
    if(suppressed==='once')response.headers.append('Set-Cookie',retryCookie(session));
    return response;
   }
   if(action==='start'){
    const mode=url.searchParams.get('mode');if(!['publish','resume'].includes(mode)||mode==='publish'&&!session)throw Error('Sign in locally first');
    t={mode,state:random(),verifier:random(),returnTo:returnPath(url.searchParams.get('return_to')),sessionHash:session?digest(session.key):null,expires:Date.now()+300000};
    const auth=new URL(issuer+'/api/sso/authorize');for(const [k,v] of Object.entries({client_id:clientId,redirect_uri:callback(),state:t.state,code_challenge:pkce(t.verifier),code_challenge_method:'S256',mode}))auth.searchParams.set(k,v);
    return redirect(auth.href,[cookie(name('flow'),seal(t,secret),300,origin)]);
   }
   if(action==='publish'){
    t=transaction(req);if(t.mode!=='publish'||!session||!equal(t.sessionHash,digest(session.key)))throw Error('Local sign-in changed');
    const result=await call('attest',{challenge:url.searchParams.get('challenge'),state:t.state,identity:identity(session.identity),auth_time:session.authTime,session_hash:digest(session.key)});
    const accept=new URL(issuer+'/api/sso/accept');accept.searchParams.set('ticket',result.ticket);
    return redirect(accept.href);
   }
   if(action==='callback'){
    t=transaction(req);const done=[cookie(name('flow'),'',0,origin)];
    if(url.searchParams.get('error'))return redirect(origin+t.returnTo,[...done,retryCookie(session)]);
    if(t.mode==='publish'){
     if(!session||!equal(t.sessionHash,digest(session.key))||url.searchParams.get('published')!=='1')throw Error('Local sign-in changed');
     return redirect(origin+t.returnTo,[...done,cookie(name('published'),digest(session.key),604800,origin),cookie(name('skip'),'',0,origin)]);
    }
    // Do not replace an account signed in while the handoff was in progress.
    if(session)return redirect(origin+t.returnTo,done);
    const proof=await call('redeem',{code:url.searchParams.get('code'),code_verifier:t.verifier});
    if(proof.issuer!==issuer||proof.audience!==clientId||!Number.isFinite(proof.auth_time)||proof.auth_time>Date.now()+30000||proof.auth_time<Date.now()-604800000)throw Error('Invalid shared identity');
    const established=await adapter.establish(identity(proof.identity),proof.auth_time,req);
    return redirect(origin+t.returnTo,[...done,...established.cookies,cookie(name('published'),digest(established.key),604800,origin),cookie(name('proof'),seal({sessionHash:digest(established.key),authTime:proof.auth_time},secret),604800,origin),cookie(name('skip'),'',0,origin)]);
   }
   return json({error:'Not found'},404);
  }catch{
   // Ordinary local sign-in remains available, including when the issuer is down.
   if(action==='profile')return json({error:'Shared profile unavailable'},503);
   if(action==='status')return json({configured:true,action:null});
   return redirect(origin+returnPath(t?.returnTo),[cookie(name('flow'),'',0,origin),retryCookie(session)]);
  }
 };
}

export async function nodeRequest(req,origin){const h=new Headers();for(const [k,v] of Object.entries(req.headers))if(v!==undefined)h.set(k,Array.isArray(v)?v.join(','):String(v));let payload;if(req.method!=='GET'&&req.method!=='HEAD')payload=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});return new Request(new URL(req.url,origin),{method:req.method,headers:h,body:payload});}
export async function nodeResponse(response,res){res.status(response.status);for(const [k,v] of response.headers)if(k!=='set-cookie')res.setHeader(k,v);const values=response.headers.getSetCookie();if(values.length)res.setHeader('Set-Cookie',values);return res.end(await response.text());}
export function suppressSso(res,origin,prefix='bt-sso'){const value=cookie(prefix+'-skip','1',604800,origin);const existing=res.getHeader('Set-Cookie');res.setHeader('Set-Cookie',[...(Array.isArray(existing)?existing:existing?[existing]:[]),value,cookie(prefix+'-published','',0,origin)]);}
