import {createHash,createHmac,timingSafeEqual} from 'node:crypto';

export const PROJECT='crypto-directory';
export const ORIGIN='https://cd.bittrees.org';
export const CATEGORIES=['Custody','DAOs & Governance','Data & Analytics','DeFi','Developer Tools','Gaming','Identity','Infrastructure','Layer 1 / Layer 2','NFTs & Creator Economy','Payments','Real World Assets (RWA)','Security','Wallets'];
export const FIELDS=['name','lead_category','tags','ecosystem','description','primary_url','product_url','founded','hq','token','twitter'];
export const fail=(message,status=400)=>Object.assign(Error(message),{status});
export const hash=value=>createHash('sha256').update(value).digest('hex');
export const canonical=value=>JSON.stringify(value);
export function permissions(access,now=Date.now()){
  const request=access?.request;
  const current=access?.authoritative===true&&access.enrolled===true&&access.audience==='cd.bittrees.org'&&request?.project===PROJECT&&request.source==='cd.bittrees.org'&&Number.isSafeInteger(access.checkedAt)&&Number.isSafeInteger(access.expiresAt)&&access.checkedAt<=now+1000&&access.expiresAt>now&&access.expiresAt-access.checkedAt<=5000;
  const actions=current&&Array.isArray(access.actions)?access.actions:[];
  const admin=actions.includes('project.admin')&&/^0x[a-f0-9]{40}$/.test(request?.authenticatedWallet||'')&&request.subjects?.includes(request.authenticatedWallet);
  const superadmin=Boolean(admin&&access.administration?.roles?.includes('superadmin'));
  const editor=actions.includes('role.editor'),reviewer=actions.includes('role.reviewer');
  const staff=admin||editor||reviewer;
  return {staff,admin,superadmin,editor,reviewer,canEdit:admin||editor,canReview:admin||reviewer,canSubmit:admin||!staff};
}
function text(value,name,min,max){
  if(typeof value!=='string'||value.trim().length<min||value.trim().length>max||/[\u0000-\u001f\u007f]/.test(value))throw fail('Invalid '+name);
  return value.trim();
}
function url(value,name,optional=false){
  if(optional&&value==='n/a')return value;
  const v=text(value,name,8,700);let u;try{u=new URL(v);}catch{throw fail('Invalid '+name);}
  if(!['https:','http:'].includes(u.protocol)||u.username||u.password||!u.hostname.includes('.'))throw fail('Invalid '+name);
  return u.href;
}
export function entry(input,{existing=null}={}){
  if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(k=>!FIELDS.includes(k))||FIELDS.some(k=>!(k in input)))throw fail('Supply only the listing fields');
  const result=existing?structuredClone(existing):{};
  result.name=text(input.name,'name',2,100);
  if(!CATEGORIES.includes(input.lead_category))throw fail('Choose an existing category');
  result.lead_category=input.lead_category;
  for(const key of ['tags','ecosystem']){
    const list=input[key];if(!Array.isArray(list)||!list.length||list.length>12)throw fail('Invalid '+key);
    result[key]=[...new Set(list.map(v=>text(v,key,1,70)))];
  }
  result.description=text(input.description,'description',20,500);
  result.primary_url=url(input.primary_url,'website');
  result.product_url=url(input.product_url,'product',true);
  const founded=String(input.founded);
  if(founded!=='n/a'&&(!/^\d{4}$/.test(founded)||Number(founded)<1800||Number(founded)>new Date().getUTCFullYear()+1))throw fail('Invalid founding year');
  result.founded=founded;
  result.hq=text(input.hq,'country',2,100);
  result.token=text(input.token,'token',1,100);
  result.twitter=url(input.twitter,'social link',true);
  // Editors can change listing information, never verification or approval state.
  result.verification_status=existing?.verification_status||'pending_audit';
  if(existing?.token_url)result.token_url=existing.token_url;
  return result;
}
export function frontMatter(value){
  return '---\n'+Object.entries(value).map(([key,v])=>key+': '+JSON.stringify(v)).join('\n')+'\n---\n';
}
export function parseFrontMatter(raw){
  const lines=raw.split(/\r?\n/);if(lines.shift()!=='---')throw fail('Invalid existing listing',409);
  const value={};let end=false;
  for(const line of lines){if(line==='---'){end=true;break;}if(!line.trim())continue;const at=line.indexOf(':');if(at<0)throw fail('Invalid existing listing',409);const key=line.slice(0,at),v=line.slice(at+1).trim();try{value[key]=JSON.parse(v);}catch{value[key]=v.startsWith('[')&&v.endsWith(']')?v.slice(1,-1).split(',').map(s=>s.trim()).filter(Boolean):v;}}
  if(!end)throw fail('Invalid existing listing',409);return value;
}
export function documentBody(raw){const header=raw.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);if(!header)throw fail('Invalid existing listing',409);return raw.slice(header[0].length);}
export function projectPath(id){
  if(typeof id!=='string'||!/^[-a-z0-9]{1,120}\.md$/.test(id))throw fail('Invalid listing ID');
  return 'content/projects/'+id;
}
export function newProjectId(name){if(typeof name!=='string'||!name.trim())throw fail('A project name is required');const slug=name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);return (slug||'project-'+hash(name.normalize('NFC').toLowerCase()).slice(0,16))+'.md';}
export function subject(identity,secret){if(typeof secret!=='string'||secret.length<32)throw fail('Submission storage is not configured',503);return createHmac('sha256',secret).update('cryptodirectory.submitter.v1:'+identity).digest('hex');}
export function signedState(value,secret){return {value,signature:createHmac('sha256',secret).update(canonical(value)).digest('hex')};}
export function readState(envelope,secret){
  const expected=signedState(envelope?.value,secret).signature,actual=envelope?.signature;
  if(typeof actual!=='string'||!/^[a-f0-9]{64}$/.test(actual)||!timingSafeEqual(Buffer.from(expected),Buffer.from(actual)))throw fail('Submission journal integrity check failed',503);
  const value=envelope.value;
  if(value.version!==1||!Number.isSafeInteger(value.revision)||value.revision<0||!Array.isArray(value.submissions)||value.submissions.length>256||!Array.isArray(value.edits)||value.edits.length>256)throw fail('Submission journal is unavailable',503);
  return value;
}
export function strictObject(input,keys){if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(k=>!keys.includes(k)))throw fail('Unexpected request fields');}
