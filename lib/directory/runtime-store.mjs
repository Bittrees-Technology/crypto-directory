import {createCipheriv,createDecipheriv,createHash,createHmac,randomBytes,randomUUID} from 'node:crypto';
import {ORIGIN,fail,hash,frontMatter,projectPath,readState,signedState,sameListing} from './model.mjs';

export const RUNTIME_ORIGIN='https://cd-data.bittrees.world';
export const CATALOGUE_URL=ORIGIN+'/api/catalogue';
export const CATALOGUE_MANIFEST=CATALOGUE_URL+'/manifest';
const AAD=Buffer.from('cryptodirectory.runtime.journal.v1');
const sha1=raw=>createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0'+raw).digest('hex');
function storageKey(env){
  if(!/^[a-f0-9]{64}$/.test(env.DIRECTORY_RUNTIME_ENCRYPTION_KEY||''))throw fail('Directory storage encryption is unavailable.',503);
  return Buffer.from(env.DIRECTORY_RUNTIME_ENCRYPTION_KEY,'hex');
}
export function encryptJournal(value,env){
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',storageKey(env),iv);cipher.setAAD(AAD);
  const bytes=Buffer.concat([cipher.update(JSON.stringify(signedState(value,env.DIRECTORY_JOURNAL_SECRET)),'utf8'),cipher.final()]);
  return JSON.stringify({version:1,iv:iv.toString('base64url'),tag:cipher.getAuthTag().toString('base64url'),ciphertext:bytes.toString('base64url')});
}
export function decryptJournal(raw,env){
  try{
    const value=JSON.parse(raw);if(value.version!==1||Object.keys(value).sort().join(',')!=='ciphertext,iv,tag,version')throw Error();
    const decipher=createDecipheriv('aes-256-gcm',storageKey(env),Buffer.from(value.iv,'base64url'));decipher.setAAD(AAD);decipher.setAuthTag(Buffer.from(value.tag,'base64url'));
    return readState(JSON.parse(Buffer.concat([decipher.update(Buffer.from(value.ciphertext,'base64url')),decipher.final()]).toString('utf8')),env.DIRECTORY_JOURNAL_SECRET);
  }catch{throw fail('Directory journal integrity check failed.',503);}
}
export function runtimeAuthorization(actor){
  if(!actor||!/^[a-f0-9]{64}$/.test(actor.subject||'')||typeof actor.requiredCapability!=='string')throw fail('Current directory write authority is required.',403);
  return {actor:actor.subject,capability:actor.requiredCapability,decision:actor.authorityDecision||null,...(actor.writeDeadline?{deadline:actor.writeDeadline}:{})};
}
export function publicationReceipt(value,storeId,expected={}){
  if(!value||value.storeId!==storeId||!/^[a-f0-9-]{36}$/.test(value.operationId||'')||!/^[-a-z0-9]{1,120}\.md$/.test(value.projectId||'')||!Number.isSafeInteger(value.catalogueRevision)||value.catalogueRevision<1||!Number.isSafeInteger(value.appliedAt)||value.appliedAt<1||!/^[a-f0-9]{64}$/.test(value.contentHash||'')||!/^[a-f0-9]{40}$/.test(value.listingSha||'')||Object.entries(expected).some(([key,v])=>value[key]!==v))throw fail('The durable publication receipt does not match the original approval.',409);
  return Object.fromEntries(['operationId','projectId','catalogueRevision','appliedAt','contentHash','listingSha','storeId'].map(key=>[key,value[key]]));
}
export class RuntimeStore {
  constructor({env=process.env,fetcher=fetch,now=Date.now}={}){this.env=env;this.fetcher=fetcher;this.now=now;this.atomicPublication=true;this.backend='runtime-v1';}
  configured(){return this.env.DIRECTORY_DATA_BACKEND==='runtime-v1'&&/^[a-f0-9-]{36}$/.test(this.env.DIRECTORY_RUNTIME_STORE_ID||'')&&/^[a-f0-9]{64}$/.test(this.env.DIRECTORY_RUNTIME_SERVICE_KEY||'')&&/^[a-f0-9]{64}$/.test(this.env.DIRECTORY_RUNTIME_ENCRYPTION_KEY||'')&&this.env.DIRECTORY_RUNTIME_SERVICE_KEY!==this.env.DIRECTORY_RUNTIME_ENCRYPTION_KEY&&this.env.DIRECTORY_JOURNAL_SECRET?.length>=32;}
  async rpc(method,args={},authorization=null){
    if(!this.configured())throw fail('The directory data connection is not configured.',503);
    const packet={version:1,storeId:this.env.DIRECTORY_RUNTIME_STORE_ID,requestId:randomUUID(),issuedAt:this.now(),method,args,...(authorization?{authorization}:{})};
    const raw=JSON.stringify(packet),signature=createHmac('sha256',Buffer.from(this.env.DIRECTORY_RUNTIME_SERVICE_KEY,'hex')).update(raw).digest('hex');
    let response;try{response=await this.fetcher(RUNTIME_ORIGIN+'/rpc',{method:'POST',redirect:'error',cache:'no-store',signal:AbortSignal.timeout(4500),headers:{'content-type':'application/json','x-directory-signature':signature},body:raw});}catch{throw fail('Directory outcome is unconfirmed. Check the original operation before retrying.',503);}
    const text=await response.text();if(Buffer.byteLength(text)>3*1024*1024)throw fail('Directory response exceeds safe bounds.',503);
    let data;try{data=JSON.parse(text);}catch{throw fail('Directory response is unavailable.',503);}
    if(!response.ok)throw fail([403,404,409,429].includes(response.status)?data.error||'Directory request held.':'Directory data is unavailable.',[403,404,409,429].includes(response.status)?response.status:503);
    if(data.storeId!==this.env.DIRECTORY_RUNTIME_STORE_ID)throw fail('Directory store identity changed.',503);
    if(['journal.save','catalogue.publish'].includes(method)&&Math.min(authorization?.decision?.expiresAt??Infinity,authorization?.deadline??Infinity)<=this.now())throw fail('The response arrived after permission expiry. Read the original operation receipt before any retry.',409);
    return data;
  }
  async load(){const result=await this.rpc('journal.read');return {sha:result.sha,value:decryptJournal(result.envelope,this.env),catalogueRevision:result.catalogueRevision};}
  async save(current,next){
    if(!this.authorize)throw fail('Directory write authority is unavailable.',403);
    const actor=await this.authorize(),envelope=encryptJournal(next,this.env);
    const result=await this.rpc('journal.save',{expectedSha:current.sha,envelope},runtimeAuthorization(actor));return result.sha;
  }
  async saveAudit(current,next){
    const envelope=encryptJournal(next,this.env);
    // This private source-owned path records an existing operation outcome only.
    // It is never exposed as a caller-selectable browser/MCP mutation.
    return (await this.rpc('journal.audit',{expectedSha:current.sha,envelope})).sha;
  }
  async listing(id){projectPath(id);const result=await this.rpc('listing.read',{id});return {sha:result.sha,raw:result.raw,path:projectPath(id)};}
  async workspaceSnapshot(relative){
    if(!['/data/projects.json','/data/process-status.json'].includes(relative))throw fail('Unexpected workspace resource.',503);
    if(relative==='/data/process-status.json'){
      const response=await this.fetcher(ORIGIN+relative,{redirect:'error',credentials:'omit',signal:AbortSignal.timeout(4500)});
      const raw=await response.text();if(!response.ok||Buffer.byteLength(raw)>128000)throw fail('Process status is unavailable.',503);
      let data;try{data=JSON.parse(raw);}catch{throw fail('Process status is unavailable.',503);}if(!Array.isArray(data))throw fail('Process status is unavailable.',503);
      return {sourceCommit:null,data};
    }
    const data=await this.rpc('catalogue.read');
    return {sourceCommit:data.seedSourceCommit,catalogueRevision:data.revision,data:relative==='/data/projects.json'?data.projects:[]};
  }
  async duplicate(candidate,exceptId=null){const result=await this.rpc('catalogue.read');return result.projects.some(row=>row.id!==exceptId&&sameListing(row,candidate));}
  async commitReview(current,next,{operationId,id,value,body='',existingSha=null,collection,recordId,reason}){
    if(!this.authorize)throw fail('Current review authority is unavailable.',403);
    const actor=await this.authorize(),authorization=runtimeAuthorization(actor);
    if(!['canReview','canReviewOwn','canAutoReview','canAutoReviewOwn'].includes(authorization.capability))throw fail('A current Reviewer or Admin approval is required.',403);
    projectPath(id);const raw=frontMatter(value)+body,contentHash=hash(raw),revision=current.catalogueRevision+1;
    const record=next[collection]?.find(row=>row.id===recordId);if(!record||!Number.isSafeInteger(revision))throw fail('The exact native review record is required.',409);
    const publication={operationId,projectId:id,catalogueRevision:revision,contentHash,listingSha:sha1(raw)};
    record.status='accepted';record.publication=publication;record.operationId=operationId;
    const operation=next.mcpOperations?.find(row=>row.id===operationId);
    if(operation){if(operation.status!=='preparing')throw fail('The source operation changed before publication.',409);operation.status='complete';operation.capability=authorization.capability;operation.outcome={status:'published',publication};operation.revision++;}
    const envelope=encryptJournal(next,this.env);
    const review=record.review||record.history?.at(-1);
    const intent={operationId,id,existingSha,contentHash,actor:actor.subject,collection,recordId,recordRevision:record.revision,reason,mode:review?.mode||'manual',decision:review?.decision};
    const requestDigest=hash(JSON.stringify(intent));
    const result=await this.rpc('catalogue.publish',{operationId,id,raw,expectedListingSha:existingSha,expectedCatalogueRevision:current.catalogueRevision,expectedJournalSha:current.sha,envelope,requestDigest,contentHash,audit:{collection,recordId,reasonHash:hash(reason),reviewDigest:hash(JSON.stringify(review))}},authorization);
    const receipt=publicationReceipt(result,this.env.DIRECTORY_RUNTIME_STORE_ID,publication);
    return {status:'published',publication:receipt,catalogueRevision:receipt.catalogueRevision};
  }
  async receipt(operationId){const result=await this.rpc('operation.read',{operationId});return {storeId:result.storeId,receipt:publicationReceipt(result.receipt,this.env.DIRECTORY_RUNTIME_STORE_ID,{operationId})};}
  async reconcile(operation,id,value,{body=''}={}){try{const result=await this.receipt(operation);if(result.receipt.projectId!==id||result.receipt.contentHash!==hash(frontMatter(value)+body))throw fail('The original publication content changed.',409);return result.receipt;}catch(error){if(error.status===404)return null;throw error;}}
}
