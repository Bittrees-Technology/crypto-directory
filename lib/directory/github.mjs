import {createPrivateKey,sign} from 'node:crypto';
import {ORIGIN,fail,readState,signedState,hash,frontMatter,projectPath} from './model.mjs';

const repo='/repos/Bittrees-Technology/crypto-directory';
const branch='directory-intake';
const statePath='.directory/intake.json';
export class GitHubStore {
  constructor({env=process.env,fetcher=fetch}={}){this.env=env;this.fetcher=fetcher;this.secret=env.DIRECTORY_JOURNAL_SECRET;this.token=null;}
  configured(){return !!(this.env.DIRECTORY_GITHUB_APP_ID&&this.env.DIRECTORY_GITHUB_INSTALLATION_ID&&this.env.DIRECTORY_GITHUB_APP_PRIVATE_KEY&&this.secret?.length>=32);}
  async credential(){
    if(this.token?.expires>Date.now()+60000)return this.token.value;
    if(!this.configured())throw fail('The repository submission connection is not configured yet.',503);
    if(!/^\d+$/.test(this.env.DIRECTORY_GITHUB_APP_ID)||!/^\d+$/.test(this.env.DIRECTORY_GITHUB_INSTALLATION_ID))throw fail('Repository connection is unavailable',503);
    const b64=v=>Buffer.from(JSON.stringify(v)).toString('base64url'),now=Math.floor(Date.now()/1000);
    const head=b64({alg:'RS256',typ:'JWT'})+'.'+b64({iat:now-30,exp:now+300,iss:this.env.DIRECTORY_GITHUB_APP_ID});
    let jwt;try{jwt=head+'.'+sign('RSA-SHA256',Buffer.from(head),createPrivateKey(this.env.DIRECTORY_GITHUB_APP_PRIVATE_KEY)).toString('base64url');}catch{throw fail('Repository connection is unavailable',503);}
    const result=await this.request('/app/installations/'+this.env.DIRECTORY_GITHUB_INSTALLATION_ID+'/access_tokens','POST',{repositories:['crypto-directory'],permissions:{contents:'write',pull_requests:'write'}},jwt);
    if(!result.token||!Number.isFinite(Date.parse(result.expires_at)))throw fail('Repository connection is unavailable',503);
    this.token={value:result.token,expires:Date.parse(result.expires_at)};return result.token;
  }
  async request(route,method='GET',body,credential=null){
    const token=credential||await this.credential();
    if(method!=='GET'&&!route.startsWith('/app/')){if(!this.authorize)throw fail('Write authority is unavailable',403);await this.authorize();}
    const r=await this.fetcher('https://api.github.com'+route,{method,redirect:'error',signal:AbortSignal.timeout(12000),headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
    const raw=await r.text();if(raw.length>3*1024*1024)throw fail('Repository response exceeds safe bounds',503);
    if(!r.ok)throw fail([404,409,422].includes(r.status)?'Repository state changed or was not found. Refresh before retrying.':'Repository connection is unavailable',r.status===404?404:[409,422].includes(r.status)?409:503);
    try{return raw?JSON.parse(raw):null;}catch{throw fail('Repository response is unavailable',503);}
  }
  async main(){const result=await this.request(repo+'/git/ref/heads/main');if(!/^[a-f0-9]{40}$/.test(result.object?.sha))throw fail('Current release source is unavailable',503);return result.object.sha;}
  async file(path,ref='main'){
    const item=await this.request(repo+'/contents/'+path+'?ref='+encodeURIComponent(ref));
    if(item.type!=='file'||item.encoding!=='base64'||item.size>1024*1024||!/^[a-f0-9]{40}$/.test(item.sha))throw fail('Repository file is unavailable',503);
    return {sha:item.sha,raw:Buffer.from(item.content,'base64').toString('utf8')};
  }
  async load(){
    try{const file=await this.file(statePath,branch);return {sha:file.sha,value:readState(JSON.parse(file.raw),this.secret)};}
    catch(error){
      if(error.status!==404)throw error;
      try{await this.request(repo+'/git/ref/heads/'+branch);}catch(refError){if(refError.status===404)return {sha:null,value:{version:1,revision:0,submissions:[],edits:[]}};throw refError;}
      throw fail('The existing submission journal is missing. Administrator reconciliation is required.',503);
    }
  }
  async save(current,next){
    if(!this.configured())throw fail('The repository submission connection is not configured yet.',503);
    const encoded=JSON.stringify(signedState(next,this.secret));if(Buffer.byteLength(encoded)>1024*1024)throw fail('Submission journal is full; an administrator must archive it.',409);
    if(!current.sha){
      try{await this.request(repo+'/git/refs','POST',{ref:'refs/heads/'+branch,sha:await this.main()});}catch(error){if(error.status!==409)throw error;}
    }
    const result=await this.request(repo+'/contents/'+statePath,'PUT',{message:'Record directory intake revision '+next.revision,content:Buffer.from(encoded).toString('base64'),branch,...(current.sha?{sha:current.sha}:{})});
    return result.content.sha;
  }
  async listing(id){const path=projectPath(id),file=await this.file(path);return {...file,path};}
  async productionText(relative){
    if(!['/release.json','/data/projects.json'].includes(relative))throw fail('Unexpected release asset',503);
    // Public static files only. Never forward a GitHub credential or session cookie.
    const response=await this.fetcher(ORIGIN+relative,{method:'GET',redirect:'error',cache:'no-store',signal:AbortSignal.timeout(8000),headers:{Accept:'application/json'}});
    if(!response.ok)throw fail('The current production index is unavailable. Try again after release verification.',503);
    const raw=await response.text();if(Buffer.byteLength(raw)>2*1024*1024)throw fail('Production index exceeds safe bounds',503);return raw;
  }
  async duplicate(candidate,exceptId=null){
    // Metadata-only PRs do not commit generated files back into Git. Read the
    // actual approved release, bound to main and its exact public content hash.
    const source=await this.main();let manifest;
    try{manifest=JSON.parse(await this.productionText('/release.json'));}catch{throw fail('The current production index is unavailable. Try again after release verification.',503);}
    if(manifest.schemaVersion!==1||manifest.repository!=='Bittrees-Technology/crypto-directory'||manifest.sourceCommit!==source||!/^[a-f0-9]{64}$/.test(manifest.files?.['data/projects.json']||''))throw fail('The production release is still updating. Try again after release verification.',503);
    const raw=await this.productionText('/data/projects.json');if(hash(raw)!==manifest.files['data/projects.json'])throw fail('The production index changed. Refresh before trying again.',503);
    let projects;try{projects=JSON.parse(raw);}catch{throw fail('Listing index is unavailable',503);}
    if(!Array.isArray(projects)||projects.length>5000)throw fail('Listing index is unavailable',503);
    const host=u=>{try{return new URL(u).hostname.toLowerCase().replace(/^www\./,'');}catch{return '';}};
    return projects.some(p=>p.id!==exceptId&&(p.name.toLowerCase()===candidate.name.toLowerCase()||host(p.primary_url)===host(candidate.primary_url)));
  }
  async existingProposal(operation){
    const head='directory/change-'+operation;
    const prs=await this.request(repo+'/pulls?state=all&head=Bittrees-Technology:'+head+'&base=main&per_page=10');
    if(prs.length>1)throw fail('Multiple release proposals require administrator review',409);
    if(!prs.length)return null;
    const pr=prs[0];if(pr.base.ref!=='main'||pr.head.ref!==head||pr.head.repo?.full_name!=='Bittrees-Technology/crypto-directory')throw fail('Release proposal provenance mismatch',409);
    const files=await this.request(repo+'/pulls/'+pr.number+'/files?per_page=10');
    return {pr,files};
  }
  async proposal(operation,id,value,{existingSha=null,reason,kind,body=''}){
    const path=projectPath(id),raw=frontMatter(value)+body,head='directory/change-'+operation;
    const main=await this.main();
    if(existingSha){const current=await this.file(path,main);if(current.sha!==existingSha)throw fail('This listing changed. Refresh before editing.',409);}
    else {try{await this.file(path,main);throw fail('This listing already exists',409);}catch(error){if(error.status!==404)throw error;}}
    await this.request(repo+'/git/refs','POST',{ref:'refs/heads/'+head,sha:main});
    await this.request(repo+'/contents/'+path,'PUT',{message:(kind==='edit'?'Update existing listing: ':'Accept reviewed submission: ')+value.name,content:Buffer.from(raw).toString('base64'),branch:head,...(existingSha?{sha:existingSha}:{})});
    const created=await this.request(repo+'/pulls','POST',{title:(kind==='edit'?'Update ':'Add ')+value.name,head,base:'main',body:'This '+(kind==='edit'?'update to an existing listing':'new listing')+' was submitted through CryptoDirectory.\n\nReview rationale:\n\n'+reason+'\n\nOperation: `'+operation+'`\nContent SHA-256: `'+hash(raw)+'`\n\nRequired repository checks and independent release approval remain in force. This proposal has not been merged or deployed by the app.'});
    return {url:created.html_url,number:created.number,contentHash:hash(raw)};
  }
  async reconcile(operation,id,value,{body=''}={}){
    const found=await this.existingProposal(operation);if(!found)return null;
    const expected=frontMatter(value)+body,path=projectPath(id);
    if(found.pr.state!=='open'&&!found.pr.merged_at)throw fail('The release proposal was closed without merging. Administrator review is required.',409);
    if(found.files.length!==1||found.files[0].filename!==path||!['added','modified'].includes(found.files[0].status))throw fail('Release proposal changed; administrator review is required',409);
    const file=await this.file(path,found.pr.head.sha);
    if(hash(file.raw)!==hash(expected))throw fail('Release proposal content changed; administrator review is required',409);
    return {url:found.pr.html_url,number:found.pr.number,contentHash:hash(expected)};
  }
}
