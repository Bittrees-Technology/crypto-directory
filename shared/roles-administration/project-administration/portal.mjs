import {ecosystemSources} from '../ecosystem-authority.mjs';
import {profileScript} from './profile-view.mjs';
import {createHmac} from 'node:crypto';
import {createSsoClient,seal,unseal,cookie,readCookie,nodeRequest} from '../sso/client.mjs';
import {ecosystemAccess} from './ecosystem-client.mjs';
import {clientScript,styleSheet,page} from './view.mjs';
const ttl=600000;
export const canInspect=access=>access?.enrolled===true&&access.authoritative===true&&access.expiresAt>Date.now()&&(access.actions.includes('role.operations-viewer')||(access.actions.includes('project.admin')&&/^0x[a-f0-9]{40}$/.test(access.request?.authenticatedWallet||'')&&access.request.subjects.includes(access.request.authenticatedWallet)));
export function createProjectAdministration(project,{env=process.env,fetcher=fetch,now=Date.now}={}){
 if(!ecosystemSources[project]||!/^[a-z][a-z0-9-]{0,47}$/.test(project))throw Error('Invalid project');
 const origin='https://'+ecosystemSources[project].host,secret=env.BITTREES_ADMIN_SSO_CLIENT_SECRET;
 const sessionSecret=typeof secret==='string'?createHmac('sha256',secret).update('bittrees project administration session v1:'+origin).digest('hex'):'';
 function session(req){
  if(!secret||secret.length<32)return null;
  const value=unseal(readCookie(req,'project-admin-session',origin),sessionSecret);
  if(!value||value.project!==project||typeof value.key!=='string'||!Number.isSafeInteger(value.expires)||value.expires<=now()||value.expires>now()+ttl||!Number.isFinite(value.authTime)||value.authTime>now()+30000||value.authTime<now()-604800000||!/^0x[a-f0-9]{40}$|^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/.test(value.identity||''))return null;
  return value;
 }
 const sso=createSsoClient({clientId:project+'-admin',origin,issuer:'https://roles.bittrees.org',secret,enabled:!!secret,fetcher,callbackPath:'/api/project-admin/sso/callback',adapter:{
  async current(req){return session(req);},
  async establish(identity,authTime){const value={project,identity,authTime,key:crypto.randomUUID(),expires:Math.min(now()+ttl,authTime+604800000)};return {key:value.key,cookies:[cookie('project-admin-session',seal(value,sessionSecret),Math.floor((value.expires-now())/1000),origin)]};}
 }});
 const common={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src https:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"};
 const response=(body,status=200,type='application/json')=>new Response(type==='application/json'?JSON.stringify(body):body,{status,headers:{...common,'Content-Type':type+'; charset=utf-8'}});
 return async function handle(req){
  const u=new URL(req.url),path=u.pathname;
  const primary=ecosystemSources[project].host,inbound=req.headers.get('host')||u.host;
  if(!['ai','mcp','chat','wallet','agent','verse'].includes(project)&&inbound!==primary&&path!=='/api/shared-roles-health'){
   if(req.method==='GET'&&(path==='/administration'||path==='/administration/'||path.startsWith('/api/project-admin/sso/')))return new Response(null,{status:307,headers:{...common,Location:origin+path+u.search}});
   return response({error:'Use the canonical project administration origin.'},403);
  }
  if(u.origin!==origin)return response({error:'Unexpected application origin'},403);
  if(path.startsWith('/api/project-admin/sso/')){
   // Keep the native account's same-origin handoff cookies untouched (Wallet
   // already has its own SSO client). Reuse the canonical protocol internally.
   const names=['bt-sso-flow','bt-sso-proof','bt-sso-published','bt-sso-skip'];
   const nativeName=name=>name.replace(/^__Host-/,'');
   const headers=new Headers(req.headers),jar=(req.headers.get('cookie')||'').split(';').map(v=>v.trim()).filter(Boolean).filter(v=>!names.includes(nativeName(v.split('=')[0]))).map(v=>v.replace(/^(__Host-)?project-admin-(bt-sso-(?:flow|proof|published|skip))=/,'$1$2='));
   headers.set('cookie',jar.join('; '));
   const result=await sso(new Request(req,{headers})),out=new Headers(result.headers);out.delete('set-cookie');
   for(const c of result.headers.getSetCookie())out.append('Set-Cookie',c.replace(/^(__Host-)?(bt-sso-(?:flow|proof|published|skip))=/,'$1project-admin-$2='));
   return new Response(result.body,{status:result.status,headers:out});
  }
  if(path==='/api/project-admin/logout'){
   if(req.method!=='POST'||req.headers.get('origin')!==origin)return response({error:'Request rejected'},403);
   const r=response({ok:true});r.headers.append('Set-Cookie',cookie('project-admin-session','',0,origin));return r;
  }
  if(req.method!=='GET')return response({error:'Method not allowed'},405);
  if(path==='/administration'||path==='/administration/')return response(page(project),200,'text/html');
  if(path==='/api/project-admin/profile.js')return response(profileScript,200,'text/javascript');
  if(path==='/api/project-admin/client.js')return response(clientScript,200,'text/javascript');
  if(path==='/api/project-admin/style.css')return response(styleSheet,200,'text/css');
  if(path==='/api/shared-roles-health')return response({protocol:'bittrees-roles-ecosystem-v1',project,configured:!!env.ROLES_ECOSYSTEM_REQUEST_PRIVATE_KEY&&!!env.ROLES_ECOSYSTEM_DECISION_PUBLIC_KEY,administrationSignInConfigured:!!secret});
  if(!['/api/project-admin/access','/api/project-admin/status'].includes(path))return response({error:'Not found'},404);
  const actor=session(req);if(!actor)return response({error:'Sign in through Roles with Ethereum or email.'},401);
  try{
   // A source-local opaque email proof is mapped to the canonical subject by Roles.
   const wallet=actor.identity.startsWith('0x'),subject=wallet?actor.identity:'subject:'+createHmac('sha256',sessionSecret).update(JSON.stringify([origin,'email',actor.identity])).digest('hex');
   const access=await ecosystemAccess(project,[subject],{env,fetcher,authenticatedWallet:wallet?actor.identity:null,verifiedEmails:wallet?[]:[{subject,email:actor.identity}]});
   const data={project,identity:actor.identity,access,canInspect:canInspect(access),canManage:wallet&&canInspect(access)&&access.actions.includes('project.admin'),rolesUrl:'https://roles.bittrees.org/role-management?project='+project,privateOwnershipRequired:true};
   if(path.endsWith('/status')&&!data.canInspect)return response({error:access.enrolled?'An approved project staff role is required.':'Controller enrollment is pending.'},access.enrolled?403:409);
   return response({...data,...(path.endsWith('/status')?{status:'Shared staff authority verified',readiness:{sharedAuthorityConfigured:!!env.ROLES_ECOSYSTEM_REQUEST_PRIVATE_KEY&&!!env.ROLES_ECOSYSTEM_DECISION_PUBLIC_KEY,...(project==='ai'?{workflowStorageConfigured:!!env.DATABASE_URL}:project==='mcp'?{serviceStorageConfigured:!!env.DATABASE_URL}:project==='chat'?{syncStorageConfigured:!!(env.KV_REST_API_URL||env.UPSTASH_REDIS_REST_URL)}:project==='wallet'?{privateIngressEnabled:env.WALLET_INGRESS_ENABLED==='1'}:{})},ownerControls:'Wallet keys, devices, credentials and private memberships remain owner-controlled.'}:{})});
  }catch{return response({error:'Shared permissions are unavailable. Administration is locked.'},503);}
 };
}
export function projectAdministrationNode(project,options){const handle=createProjectAdministration(project,options);return async(req,res)=>{const response=await handle(await nodeRequest(req,'https://'+ecosystemSources[project].host));res.statusCode=response.status;for(const[k,v]of response.headers)if(k!=='set-cookie')res.setHeader(k,v);const cookies=response.headers.getSetCookie();if(cookies.length)res.setHeader('Set-Cookie',cookies);return res.end(await response.text());};}
