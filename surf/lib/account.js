import { createHmac, randomBytes } from 'node:crypto';
import { createSsoClient, readCookie, cookie, digest, equal } from './sso/client.mjs';
export const ORIGIN='https://surf.bittrees.org';
export function accountService({env=process.env,fetcher=fetch,now=Date.now,store=null}={}){
  const secret=env.SURF_SSO_CLIENT_SECRET;
  const storageConfigured=Boolean(store||(env.SURF_REDIS_REST_URL&&env.SURF_REDIS_REST_TOKEN));
  const configured=typeof secret==='string'&&secret.length>=32&&storageConfigured;
  const command=store||async function(...args){
    const response=await fetcher(env.SURF_REDIS_REST_URL,{method:'POST',redirect:'error',signal:AbortSignal.timeout(7000),headers:{Authorization:'Bearer '+env.SURF_REDIS_REST_TOKEN,'Content-Type':'application/json'},body:JSON.stringify(args)});
    if(!response.ok)throw Error('Account storage unavailable');const data=await response.json();if(data.error)throw Error('Account storage unavailable');return data.result;
  };
  const keyFor=value=>'surf:user:'+createHmac('sha256',secret).update(value).digest('hex')+':saved';
  async function session(req){
    if(!configured)return null;
    const key=readCookie(req,'surf-session',ORIGIN);if(!/^[A-Za-z0-9_-]{43}$/.test(key))return null;
    const raw=await command('GET','surf:session:'+digest(key));if(!raw)return null;const value=JSON.parse(raw);
    if(typeof value.identity!=='string'||!Number.isFinite(value.authTime)||!Number.isFinite(value.expires)||value.expires<=now())return null;
    return {key,...value};
  }
  const sso=createSsoClient({clientId:'surf',origin:ORIGIN,issuer:'https://roles.bittrees.org',secret,enabled:configured,fetcher,adapter:{current:session,async establish(identity,authTime){
    const key=randomBytes(32).toString('base64url'),expires=Math.min(now()+604800000,authTime+604800000);const ttl=Math.max(1,Math.floor((expires-now())/1000));
    await command('SET','surf:session:'+digest(key),JSON.stringify({identity,authTime,expires}),'EX',ttl);
    return {key,cookies:[cookie('surf-session',key,ttl,ORIGIN)]};
  }}});
  const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store','Pragma':'no-cache','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});
  const csrf=key=>createHmac('sha256',secret).update('surf-csrf:'+key).digest('hex');
  const itemKey=(id,type)=>digest(JSON.stringify([id,type]));
  async function handle(req,{catalog}={}){
    const url=new URL(req.url);
    if(url.origin!==ORIGIN||(req.headers.get('host')||url.host)!==url.host)return json({error:'Use surf.bittrees.org for account actions.'},403);
    if(url.pathname.startsWith('/api/sso/'))return sso(req);
    try{
      if(req.method==='GET'&&url.pathname==='/api/account/session'){
        const actor=await session(req);return json({configured,signedIn:!!actor,...(actor?{identity:actor.identity,csrf:csrf(actor.key)}:{})});
      }
      if(!configured)return json({error:'Sign-in is temporarily unavailable.'},503);
      const actor=await session(req);if(!actor)return json({error:'Sign in to continue.'},401);
      const userKey=keyFor(actor.identity);
      if(req.method==='GET'&&url.pathname==='/api/account/saved'){
        const values=await command('HVALS',userKey);return json({saved:(values||[]).map(v=>JSON.parse(v)).sort((a,b)=>b.savedAt.localeCompare(a.savedAt))});
      }
      if(req.method!=='POST')return json({error:'Method not allowed'},405);
      if(req.headers.get('origin')!==ORIGIN||req.headers.get('sec-fetch-site')==='cross-site'||!equal(csrf(actor.key),req.headers.get('x-surf-csrf')))return json({error:'Refresh your sign-in before trying again.'},403);
      if(url.pathname==='/api/account/logout'){
        await command('DEL','surf:session:'+digest(actor.key));const out=json({ok:true});out.headers.append('Set-Cookie',cookie('surf-session','',0,ORIGIN));out.headers.append('Set-Cookie',cookie('bt-sso-skip','1',604800,ORIGIN));return out;
      }
      if(url.pathname!=='/api/account/saved')return json({error:'Not found'},404);
      if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'Use JSON requests.'},415);
      const text=await req.text();if(text.length>4096)return json({error:'Request too large'},413);let input;try{input=JSON.parse(text);}catch{return json({error:'Invalid request'},400);}
      if(!input||Object.keys(input).some(k=>!['action','id','type'].includes(k))||typeof input.id!=='string'||input.id.length>170||!['website','product'].includes(input.type)||!['save','remove'].includes(input.action))return json({error:'Invalid saved site'},400);
      const field=itemKey(input.id,input.type);
      if(input.action==='remove'){await command('HDEL',userKey,field);return json({ok:true});}
      const p=(await catalog()).projects.find(p=>p.id===input.id),target=p?.[input.type];
      if(!target)return json({error:'This site is no longer in the verified directory.'},404);
      const value={id:p.id,type:input.type,url:target,name:p.name,savedAt:new Date(now()).toISOString()};
      const result=await command('EVAL',"if redis.call('HEXISTS',KEYS[1],ARGV[1]) == 0 and redis.call('HLEN',KEYS[1]) >= 500 then return 0 end redis.call('HSET',KEYS[1],ARGV[1],ARGV[2]) return 1",1,userKey,field,JSON.stringify(value));
      if(result!==1)return json({error:'Your collection is full. Remove a site before saving another.'},409);
      return json({ok:true,saved:value});
    }catch{return json({error:'Your account is temporarily unavailable. Please try again.'},503);}
  }
  return {handle,session,configured};
}
