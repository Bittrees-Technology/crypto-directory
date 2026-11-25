import {RUNTIME_ORIGIN} from './runtime-store.mjs';
import {hash,fail,ORIGIN} from './model.mjs';

export function catalogueManifest(value,storeId){
  if(!value||value.schemaVersion!==1||value.storeId!==storeId||!Number.isSafeInteger(value.revision)||value.revision<0||!Number.isSafeInteger(value.appliedAt)||!/^[a-f0-9]{40}$/.test(value.seedSourceCommit||'')||!/^[a-f0-9]{64}$/.test(value.datasetSha256||''))throw fail('Catalogue provenance is unavailable.',503);
  return value;
}
export function createPublicCatalogue({env=process.env,fetcher=fetch,now=Date.now}={}){
  let cache=null,pending=null;
  async function read(path,max){
    const response=await fetcher(RUNTIME_ORIGIN+path,{redirect:'error',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(4500),headers:{accept:'application/json'}});
    if(!response.ok||response.redirected||!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')||''))throw fail('The live catalogue is unavailable.',503);
    const raw=await response.text();if(Buffer.byteLength(raw)>max)throw fail('Catalogue exceeds its bound.',503);return raw;
  }
  async function snapshot(){
    if(cache&&cache.expires>now())return cache;
    if(!pending)pending=(async()=>{
      const before=await read('/manifest',4096);let manifest;
      try{manifest=catalogueManifest(JSON.parse(before),env.DIRECTORY_RUNTIME_STORE_ID);}catch{throw fail('Catalogue provenance is unavailable.',503);}
      const raw=await read('/catalogue',2500000),after=await read('/manifest',4096);
      if(before!==after||hash(raw)!==manifest.datasetSha256)throw fail('Catalogue changed during the read.',503);
      let rows;try{rows=JSON.parse(raw);}catch{throw fail('Invalid catalogue.',503);}
      if(!Array.isArray(rows)||rows.length>10000||new Set(rows.map(r=>r.id)).size!==rows.length)throw fail('Invalid catalogue.',503);
      return cache={raw,manifest,expires:now()+30000};
    })().finally(()=>{pending=null;});
    return pending;
  }
  return async req=>{
    const headers={'X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':'*','Access-Control-Expose-Headers':'ETag, X-Directory-Catalogue-Revision, X-Directory-Catalogue-Store','Content-Type':'application/json; charset=utf-8'};
    try{
      const url=new URL(req.url);
      // Vercel forwards an unused wildcard as ?path=manifest. It is routing
      // metadata for this one fixed public resource, never a source URL.
      if(['/api/catalogue','/api/catalogue/manifest'].includes(url.pathname)&&url.searchParams.size===1&&url.searchParams.get('path')==='manifest'){
        url.pathname='/api/catalogue/manifest';url.search='';
      }
      if(url.origin!==ORIGIN||!['/api/catalogue','/api/catalogue/manifest'].includes(url.pathname)||url.search||req.method!=='GET')return Response.json({error:'Not found.'},{status:404,headers});
      if(env.DIRECTORY_DATA_BACKEND!=='runtime-v1'||!/^[a-f0-9-]{36}$/.test(env.DIRECTORY_RUNTIME_STORE_ID||''))throw fail('The runtime catalogue is not enabled.',503);
      const value=await snapshot(),etag='"'+(url.pathname.endsWith('/manifest')?hash(JSON.stringify(value.manifest)):value.manifest.datasetSha256)+'"';
      Object.assign(headers,{'Cache-Control':'public, max-age=0, s-maxage=15','ETag':etag,'X-Directory-Catalogue-Revision':String(value.manifest.revision),'X-Directory-Catalogue-Store':value.manifest.storeId});
      if(req.headers.get('if-none-match')===etag)return new Response(null,{status:304,headers});
      return new Response(url.pathname.endsWith('/manifest')?JSON.stringify(value.manifest):value.raw,{headers});
    }catch(error){return Response.json({error:'The live directory is unavailable. No older revision was substituted.'},{status:error.status||503,headers:{...headers,'Cache-Control':'no-store'}});}
  };
}
