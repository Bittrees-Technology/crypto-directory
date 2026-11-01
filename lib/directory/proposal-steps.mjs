import {frontMatter,hash,projectPath,fail,newProjectId} from './model.mjs';
import {digest} from './mcp-proof.mjs';
import {UUID} from './editorial-contract.mjs';
const repo='/repos/Bittrees-Technology/crypto-directory';
export const STEPS=['create_branch','write_file','create_pr'];
const sha=value=>/^[a-f0-9]{40}$/.test(value||'');
function branch(plan){if(!UUID.test(plan.operationId))throw fail('Invalid proposal operation',409);return 'directory/change-'+plan.operationId;}
export function planFromJournal(value,operationId,action,actor){
  let record,entry,body='',existingSha=null,reason,projectId,capability;
  if(action==='directory.propose_edit'){
    record=value.edits.find(r=>r.id===operationId&&r.actor===actor.subject&&r.status==='prepared');
    if(record){({entry,body,existingSha,reason,projectId}=record);capability='canEdit';}
  }else{
    const submission=value.submissions.find(r=>r.operationId===operationId&&r.status==='accepting'&&r.history?.at(-1)?.reviewer===actor.subject);
    const change=value.editRequests?.find(r=>r.operationId===operationId&&r.status==='accepting'&&r.review?.reviewer===actor.subject);
    record=submission||change;
    if(record){
      entry=record.approvedEntry;body=record.body||'';existingSha=change?record.listingSha:null;projectId=change?record.projectId:newProjectId(record.entry.name);
      const review=change?record.review:record.history.at(-1);reason=review.reason;capability=review.mode==='automatic'?'canAutoReview':'canReview';
    }
  }
  if(!record||!entry||typeof body!=='string'||typeof reason!=='string'||!actor.permissions[capability])throw fail('Prepared native proposal not found or no longer permitted',403);
  projectPath(projectId);if(existingSha!==null&&!sha(existingSha))throw fail('Invalid prepared source SHA',409);
  const raw=frontMatter(entry)+body;
  if(Buffer.byteLength(raw)>32768)throw fail('Prepared listing exceeds MCP proposal bounds',413);
  return {operationId,action,capability,projectId,entry,body,existingSha,reason,contentHash:hash(raw),ownerSubject:actor.subject};
}
export async function preparePlan(store,plan){
  const baseCommit=await store.main();if(!sha(baseCommit))throw fail('Current source head is unavailable',503);
  try{const current=await store.file(projectPath(plan.projectId),baseCommit);if(!plan.existingSha||current.sha!==plan.existingSha)throw fail('Prepared listing changed',409);}catch(error){if(error.status!==404||plan.existingSha)throw error;}
  const value={...plan,baseCommit};return {...value,diffDigest:digest(value)};
}
export function assertPlan(plan){
  const {diffDigest,...body}=plan;
  if(diffDigest!==digest(body)||!sha(plan.baseCommit)||hash(frontMatter(plan.entry)+plan.body)!==plan.contentHash)throw fail('Prepared proposal integrity mismatch',409);
  projectPath(plan.projectId);branch(plan);
}
export async function performStep(store,plan,step,expectedHead){
  assertPlan(plan);const head=branch(plan),path=projectPath(plan.projectId);
  if(!STEPS.includes(step)||!sha(expectedHead))throw fail('Invalid proposal step',409);
  if(step==='create_branch'){
    if(expectedHead!==plan.baseCommit||await store.main()!==plan.baseCommit)throw fail('The approved source head changed before dispatch',409);
    try{await store.request(repo+'/git/ref/heads/'+head);throw fail('Proposal branch already exists; reconcile before continuing',409);}catch(error){if(error.status!==404)throw error;}
    const result=await store.request(repo+'/git/refs','POST',{ref:'refs/heads/'+head,sha:plan.baseCommit});
    if(result.object?.sha!==plan.baseCommit)throw fail('Branch outcome needs reconciliation',409);
    return {headSha:result.object.sha};
  }
  const current=await store.request(repo+'/git/ref/heads/'+head);
  if(current.object?.sha!==expectedHead)throw fail('The proposal head changed before dispatch',409);
  if(step==='write_file'){
    try{const existing=await store.file(path,head);if(!plan.existingSha||existing.sha!==plan.existingSha)throw fail('The listing changed before dispatch',409);}catch(error){if(error.status!==404||plan.existingSha)throw error;}
    // REST contents SHA guards only the file, not a concurrently changed branch
    // head. This one mutation atomically requires the exact approved head.
    const result=await store.request('/graphql','POST',{
      query:'mutation CryptoDirectoryWrite($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } ref { target { oid } } } }',
      variables:{input:{branch:{repositoryNameWithOwner:'Bittrees-Technology/crypto-directory',refName:head},expectedHeadOid:expectedHead,message:{headline:'CryptoDirectory approved operation '+plan.operationId},fileChanges:{additions:[{path,contents:Buffer.from(frontMatter(plan.entry)+plan.body).toString('base64')}]}}}
    });
    const committed=result.data?.createCommitOnBranch;
    if(result.errors?.length||!sha(committed?.commit?.oid)||committed.ref?.target?.oid!==committed.commit.oid)throw fail('Listing write outcome needs reconciliation',409);
    return {headSha:committed.commit.oid,contentHash:plan.contentHash};
  }
  await inspectStep(store,plan,'write_file',expectedHead);
  if(await store.existingProposal(plan.operationId))throw fail('Proposal outcome needs reconciliation',409);
  const created=await store.request(repo+'/pulls','POST',{title:(plan.existingSha?'Update ':'Add ')+plan.entry.name,head,base:'main',body:'Approved CryptoDirectory editorial operation `'+plan.operationId+'`.\n\n'+plan.reason+'\n\nContent SHA-256: `'+plan.contentHash+'`\n\nRequired checks, independent GitHub review and synchronized publication remain required. This operation does not merge or publish.'});
  if(!Number.isSafeInteger(created.number)||!new RegExp('^https://github.com/Bittrees-Technology/crypto-directory/pull/[0-9]+$').test(created.html_url||'')||created.head?.sha!==expectedHead)throw fail('Proposal outcome needs reconciliation',409);
  return {headSha:expectedHead,proposal:{url:created.html_url,number:created.number,contentHash:plan.contentHash}};
}
export async function inspectStep(store,plan,step,expectedHead){
  assertPlan(plan);const head=branch(plan),path=projectPath(plan.projectId);
  const ref=await store.request(repo+'/git/ref/heads/'+head),actual=ref.object?.sha;
  if(!sha(actual))throw fail('Proposal head cannot be confirmed',409);
  if(step==='create_branch'){
    if(actual!==plan.baseCommit)throw fail('Proposal branch changed; outcome held',409);
    return {headSha:actual};
  }
  if(step==='write_file'){
    const file=await store.file(path,head),comparison=await store.request(repo+'/compare/'+plan.baseCommit+'...'+actual);
    if(hash(file.raw)!==plan.contentHash||expectedHead&&actual!==expectedHead||comparison.ahead_by!==1||!Array.isArray(comparison.files)||comparison.files.length!==1||comparison.files[0].filename!==path||!['added','modified'].includes(comparison.files[0].status))throw fail('The actual proposal diff does not match the approved listing',409);
    return {headSha:actual,fileSha:file.sha,contentHash:plan.contentHash};
  }
  if(step!=='create_pr')throw fail('Unknown proposal step',409);
  const proposal=await store.reconcile(plan.operationId,plan.projectId,plan.entry,{body:plan.body});
  if(!proposal||expectedHead&&actual!==expectedHead)throw fail('Exact proposal receipt is not available; outcome held',409);
  return {headSha:actual,proposal};
}
