import {createHash} from 'node:crypto';
import {ensure, eligible, checksPass, REPOSITORY, CI_WORKFLOW_ID} from './policy.mjs';
export class GitHub {
  constructor(token) { ensure(token, 'GitHub credential missing'); this.token = token; }
  async request(path, method = 'GET', body) {
    ensure(path.startsWith(`/repos/${REPOSITORY}/`), 'Unexpected GitHub resource');
    const response = await fetch(`https://api.github.com${path}`, {method, redirect:'error', signal:AbortSignal.timeout(30000), headers:{Authorization:`Bearer ${this.token}`, Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'}, body:body === undefined ? undefined : JSON.stringify(body)});
    ensure(response.ok, `GitHub request failed (${response.status})`);
    const text = await response.text(); ensure(Buffer.byteLength(text) <= 2000000, 'GitHub response exceeds limit');
    return text ? JSON.parse(text) : null;
  }
  async list(path, field) {
    const rows = [];
    for (let page=1;page<=10;page++) {
      const data=await this.request(`${path}${path.includes('?')?'&':'?'}per_page=100&page=${page}`);
      const batch=field ? data[field] : data; ensure(Array.isArray(batch), 'Invalid GitHub list'); rows.push(...batch);
      if(batch.length<100) return rows;
    }
    throw Error('GitHub list exceeds review limit');
  }
}
const prefix=`/repos/${REPOSITORY}`;
export async function snapshot(github, number) {
  ensure(Number.isSafeInteger(number) && number>0, 'Invalid PR number');
  const pr=await github.request(`${prefix}/pulls/${number}`);
  const files=await github.list(`${prefix}/pulls/${number}/files`); eligible(pr,files);
  const comparison=await github.request(`${prefix}/compare/${pr.base.sha}...${pr.head.sha}`);
  ensure(['ahead','identical'].includes(comparison.status) && comparison.merge_base_commit?.sha===pr.base.sha, 'Branch must include current main');
  const ciRuns=await github.list(`${prefix}/actions/workflows/${CI_WORKFLOW_ID}/runs?head_sha=${pr.head.sha}&event=pull_request`,'workflow_runs');
  ciRuns.sort((a,b)=>b.id-a.id); ensure(ciRuns.length>0,'No CI run for current commit');
  const run=await github.request(`${prefix}/actions/runs/${ciRuns[0].id}`);
  const jobs=await github.list(`${prefix}/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs`,'jobs');
  const checks=await github.list(`${prefix}/commits/${pr.head.sha}/check-runs?filter=latest`,'check_runs');
  const statusRows=await github.list(`${prefix}/commits/${pr.head.sha}/statuses`);
  const latestStatuses=[...new Map(statusRows.slice().reverse().map(s=>[s.context,s])).values()];
  checksPass(checks,latestStatuses,jobs,run,pr.head.sha);
  const reviews=await github.list(`${prefix}/pulls/${number}/reviews`);
  const latestReviews=new Map(); for(const r of reviews) if(['APPROVED','CHANGES_REQUESTED','DISMISSED'].includes(r.state)) latestReviews.set(r.user.id,r);
  ensure(![...latestReviews.values()].some(r=>r.state==='CHANGES_REQUESTED'), 'Outstanding requested changes require resolution');
  const content=[]; let bytes=0;
  async function read(path,sha) {
    const file=await github.request(`${prefix}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${sha}`);
    ensure(file.type==='file' && file.encoding==='base64' && file.size<=64000 && typeof file.content==='string','Unsupported or oversized source file');
    const data=Buffer.from(file.content,'base64'); ensure(data.length===file.size && !data.includes(0),'Incomplete or binary source');
    bytes+=data.length; ensure(bytes<=200000,'Review context exceeds limit'); return data.toString('utf8');
  }
  for(const f of files) content.push({path:f.filename,previousPath:f.previous_filename??null,status:f.status,patch:f.patch,before:f.status==='added'?null:await read(f.previous_filename??f.filename,pr.base.sha),after:f.status==='removed'?null:await read(f.filename,pr.head.sha)});
  // Unchanged implementation context is supplied as inert text, never run.
  const context=[];
  for(const path of ['README.md','package.json','scripts/build.mjs','scripts/check-links.mjs']) if(!files.some(f=>f.filename===path)) context.push({path,content:await read(path,pr.base.sha)});
  const data={repository:REPOSITORY,number,head:pr.head.sha,base:pr.base.sha,files:content,context};
  const digest=createHash('sha256').update(JSON.stringify(data)).digest('hex');
  return {snapshot:{repository:REPOSITORY,number,head:pr.head.sha,base:pr.base.sha,digest,ciRunId:run.id,ciAttempt:run.run_attempt},data,pr,reviews};
}
export async function approve(github, envelope) {
  const {approvalAllowed,sameSnapshot}=await import('./policy.mjs');
  ensure(envelope?.version===1,'Invalid review envelope'); approvalAllowed(envelope.review,envelope.snapshot);
  const fresh=await snapshot(github,envelope.snapshot.number); sameSnapshot(envelope.snapshot,fresh.snapshot);
  if(fresh.reviews.some(r=>r.user?.login==='github-actions[bot]' && r.state==='APPROVED' && r.commit_id===fresh.snapshot.head && r.body?.includes(`Review digest: ${fresh.snapshot.digest}`))) return {state:'already-approved',head:fresh.snapshot.head};
  const p=`${prefix}/pulls/${fresh.snapshot.number}`;
  const current=await github.request(p);
  ensure(current.state==='open' && !current.draft && current.head.sha===fresh.snapshot.head && current.base.sha===fresh.snapshot.base,'PR changed immediately before approval');
  const body=`Claude review completed without blocking findings. Required CI and all reported checks passed.\n\nReviewed commit: ${fresh.snapshot.head}\nBase commit: ${fresh.snapshot.base}\nReview digest: ${fresh.snapshot.digest}\nCI run: ${fresh.snapshot.ciRunId}, attempt ${fresh.snapshot.ciAttempt}\n\n${envelope.review.summary}\n\n${envelope.review.findings.map(f=>`${f.severity}: ${f.path} — ${f.explanation}`).join('\n')}`;
  const receipt=await github.request(`${p}/reviews`,'POST',{event:'APPROVE',commit_id:fresh.snapshot.head,body});
  ensure(receipt.id && receipt.commit_id===fresh.snapshot.head && receipt.state==='APPROVED','Approval receipt mismatch');
  const after=await github.request(p);
  if(after.head.sha!==fresh.snapshot.head || after.base.sha!==fresh.snapshot.base || after.state!=='open' || after.draft) {
    await github.request(`${p}/reviews/${receipt.id}/dismissals`,'PUT',{message:'PR changed during approval; a fresh review is required.'});
    throw Error('PR changed during approval; review dismissed');
  }
  return {state:'approved',head:fresh.snapshot.head,reviewId:receipt.id};
}

export async function merge(github, envelope) {
  const {approvalAllowed,sameSnapshot}=await import('./policy.mjs');
  ensure(envelope?.version===1,'Invalid review envelope'); approvalAllowed(envelope.review,envelope.snapshot);
  const fresh=await snapshot(github,envelope.snapshot.number); sameSnapshot(envelope.snapshot,fresh.snapshot);
  const botReviews=fresh.reviews.filter(r=>r.user?.login==='github-actions[bot]' && ['APPROVED','CHANGES_REQUESTED','DISMISSED'].includes(r.state));
  const approval=botReviews.at(-1);
  ensure(approval?.state==='APPROVED' && approval.commit_id===fresh.snapshot.head && approval.body?.includes(`Review digest: ${fresh.snapshot.digest}`),'Missing current bot approval for this review');
  const p=`${prefix}/pulls/${fresh.snapshot.number}`;
  const current=await github.request(p);
  ensure(current.state==='open' && !current.draft && current.head.sha===fresh.snapshot.head && current.base.sha===fresh.snapshot.base,'PR changed immediately before merge');
  // The ordinary Actions token must satisfy GitHub branch protections. Never use an admin bypass.
  const receipt=await github.request(`${p}/merge`,'PUT',{sha:fresh.snapshot.head,merge_method:'squash'});
  ensure(receipt.merged===true && /^[a-f0-9]{40}$/.test(receipt.sha),'GitHub did not confirm merge');
  const after=await github.request(p);
  ensure(after.merged===true && after.head.sha===fresh.snapshot.head && after.merge_commit_sha===receipt.sha,'Merge verification failed');
  // GitHub deletes merged branches through delete_branch_on_merge; never delete refs ourselves.
  return {state:'merged',head:fresh.snapshot.head,mergeCommit:receipt.sha,branchCleanup:'repository automatic deletion'};
}
