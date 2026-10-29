import https from 'node:https';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
export const SURF_ORIGIN = 'https://surf.bittrees.org';
export function publicAddress(address) {
  if (isIP(address) === 4) {
    const [a,b] = address.split('.').map(Number);
    return !(a===0||a===10||a===127||a>=224||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0))||(a===100&&b>=64&&b<=127)||(a===198&&(b===18||b===19)));
  }
  if (isIP(address) === 6) return /^[23][0-9a-f]{3}:/i.test(address) && !/^2001:(?:0:|db8:|10:|20:)/i.test(address);
  return false;
}
export function permitsEmbedding(headers, target, origin=SURF_ORIGIN) {
  const csp = String(headers['content-security-policy'] || '');
  const policies = [...csp.matchAll(/(?:^|[;,])\s*frame-ancestors\s+([^;,]+)/gi)];
  if (policies.length) {
    const allowed = policy => policy.trim().split(/\s+/).some(source => {
      if(source==="'none'") return false;
      if(source==='*')return true;
      if(source==="'self'")return new URL(target).origin===origin;
      if(source==='https:')return true;
      if(source===origin)return true;
      if(source.startsWith('https://*.')){const suffix=source.slice(10);return new URL(origin).hostname.endsWith('.'+suffix);}
      return false;
    });
    return policies.every(match=>allowed(match[1]));
  }
  const xfo=String(headers['x-frame-options']||'').toUpperCase();
  if(xfo.includes('DENY'))return false;
  if(xfo.includes('SAMEORIGIN'))return new URL(target).origin===origin;
  return true;
}
async function head(url, resolve=lookup) {
  const target=new URL(url);
  if(target.protocol!=='https:'||target.username||target.password||target.port&&target.port!=='443')throw Error('Unsupported destination');
  const addresses=await resolve(target.hostname,{all:true,verbatim:true});
  if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw Error('Destination unavailable');
  const pinned=addresses.find(a=>a.family===4)||addresses[0];
  return new Promise((resolve,reject)=>{
    const request=https.request(target,{method:'HEAD',servername:target.hostname,headers:{'User-Agent':'Bittrees-Surf/1.0 (embedding compatibility check)','Accept':'text/html'},lookup:(hostname,options,callback)=>options.all?callback(null,[pinned]):callback(null,pinned.address,pinned.family)},response=>{
      response.resume(); resolve({status:response.statusCode,headers:response.headers});
    });
    request.setTimeout(5500,()=>request.destroy(Error('Destination timed out')));request.on('error',reject);request.end();
  });
}
export async function inspectFrame(url,{request=head}={}) {
  let current=url;
  try {
    for(let redirects=0;redirects<5;redirects++){
      if(!current.startsWith('https:'))return {status:'external',reason:'https-required',url};
      const response=await request(current);
      if([301,302,303,307,308].includes(response.status)&&response.headers.location){current=new URL(response.headers.location,current).href;continue;}
      if(response.status>=400)return {status:'unknown',url:current};
      if(!permitsEmbedding(response.headers,current))return {status:'external',reason:'embedding-blocked',url:current};
      return {status:'embeddable',url:current};
    }
    return {status:'unknown',url};
  }catch{return {status:'unknown',url};}
}
