import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {eligible,checksPass,approvalAllowed,sameSnapshot,REPOSITORY,CI_WORKFLOW_ID} from '../scripts/approval-bot/policy.mjs';
import {snapshot,approve} from '../scripts/approval-bot/github.mjs';
import {reviewWithClaude} from '../scripts/approval-bot/run.mjs';
const head='a'.repeat(40),base='b'.repeat(40),newHead='c'.repeat(40);
const pr=()=>({state:'open',draft:false,merged:false,changed_files:1,head:{sha:head,repo:{full_name:REPOSITORY}},base:{ref:'main',sha:base,repo:{full_name:REPOSITORY}}});
const files=()=>[{filename:'bittrees.tools.json',status:'added',patch:'+{"connections":[]}'}];
const run=()=>({id:10,run_attempt:1,workflow_id:CI_WORKFLOW_ID,path:'.github/workflows/ci.yml',event:'pull_request',head_sha:head,head_repository:{full_name:REPOSITORY},status:'completed',conclusion:'success'});
const checks=()=>[{name:'build-and-check',app:{id:15368},status:'completed',conclusion:'success'}];
const jobs=()=>[{name:'build-and-check',status:'completed',conclusion:'success'}];
const clear=()=>({headSha:head,baseSha:base,complete:true,verdict:'clear',summary:'Reviewed all files; no blocking findings.',findings:[]});
class FakeGitHub {
  constructor(){this.writes=[];this.prReads=0;this.reviews=[];this.ci=run();this.checks=checks();this.changedAt=Infinity;}
  async request(path,method='GET',body) {
    if(method!=='GET'){this.writes.push({path,method,body});return {id:44,commit_id:body.commit_id,state:'APPROVED'};}
    if(/\/pulls\/6$/.test(path)){const p=pr();if(++this.prReads>=this.changedAt)p.head.sha=newHead;return p;}
    if(path.includes('/compare/'))return {status:'ahead',merge_base_commit:{sha:base}};
    if(path.endsWith('/actions/runs/10'))return this.ci;
    if(path.includes('/contents/')){const text='{}';return {type:'file',encoding:'base64',size:2,content:Buffer.from(text).toString('base64')};}
    throw Error(`Unexpected request: ${path}`);
  }
  async list(path) {
    if(path.endsWith('/files'))return files();
    if(path.includes('/workflows/'))return [this.ci];
    if(path.endsWith('/jobs'))return jobs();
    if(path.includes('/check-runs'))return this.checks;
    if(path.endsWith('/statuses'))return [];
    if(path.endsWith('/reviews'))return this.reviews;
    throw Error(`Unexpected list: ${path}`);
  }
}
test('eligible pilot rejects forks, drafts, incomplete files, binary and bot/CI edits including renamed paths',()=>{
  eligible(pr(),files());
  for(const alter of [p=>p.draft=true,p=>p.head.repo.full_name='other/fork',p=>p.changed_files=2]){const p=pr();alter(p);assert.throws(()=>eligible(p,files()));}
  for(const file of [{...files()[0],patch:undefined},{...files()[0],filename:'.github/workflows/ci.yml'},{...files()[0],previous_filename:'scripts/approval-bot/run.mjs'}])assert.throws(()=>eligible(pr(),[file]));
});
test('CI requires actual successful required job, trusted workflow and exact head',()=>{
  checksPass(checks(),[],jobs(),run(),head);
  for(const alteration of [{head_sha:newHead},{workflow_id:999},{event:'push'},{conclusion:'failure'},{status:'in_progress'}])assert.throws(()=>checksPass(checks(),[],jobs(),{...run(),...alteration},head));
  assert.throws(()=>checksPass(checks(),[],[],run(),head));
  for(const conclusion of ['failure','cancelled','neutral','skipped',null])assert.throws(()=>checksPass([{...checks()[0],conclusion}],[],jobs(),run(),head));
  assert.throws(()=>checksPass(checks(),[{state:'pending'}],jobs(),run(),head));
});
test('incomplete, blocked, malformed, wrong-commit and high-severity reports never approve',()=>{
  const s={head,base};approvalAllowed(clear(),s);
  for(const change of [{complete:false},{verdict:'blocked'},{verdict:'incomplete'},{headSha:newHead},{extra:'approve'},{findings:[{path:'file',severity:'high',blocking:false,explanation:'Defect'}]},{findings:[{path:'file',severity:'low',blocking:true,explanation:'Defect'}]}])assert.throws(()=>approvalAllowed({...clear(),...change},s));
});
test('base, content, head, CI attempt and PR identity must still match',()=>{
  const s={repository:REPOSITORY,number:6,head,base,digest:'digest',ciRunId:10,ciAttempt:1};
  for(const key of Object.keys(s))assert.throws(()=>sameSnapshot(s,{...s,[key]:'changed'}));
});
test('clean reviewed commit is submitted explicitly with APPROVE and commit_id',async()=>{
  const g=new FakeGitHub(),state=await snapshot(g,6);g.prReads=0;
  const result=await approve(g,{version:1,snapshot:state.snapshot,review:clear()});
  assert.equal(result.state,'approved');assert.equal(g.writes.length,1);assert.equal(g.writes[0].body.commit_id,head);assert.equal(g.writes[0].body.event,'APPROVE');
});
test('changed head immediately before submission cannot be approved',async()=>{
  const g=new FakeGitHub(),state=await snapshot(g,6);g.prReads=0;g.changedAt=2;
  await assert.rejects(approve(g,{version:1,snapshot:state.snapshot,review:clear()}));assert.equal(g.writes.length,0);
});
test('head race after submission dismisses the stale approval',async()=>{
  const g=new FakeGitHub(),state=await snapshot(g,6);g.prReads=0;g.changedAt=3;
  await assert.rejects(approve(g,{version:1,snapshot:state.snapshot,review:clear()}));assert.equal(g.writes.length,2);assert.match(g.writes[1].path,/dismissals$/);
});
test('new failing check or human change request stops submission',async()=>{
  for(const mode of ['check','human']){const g=new FakeGitHub(),state=await snapshot(g,6);if(mode==='check')g.checks[0].conclusion='failure';else g.reviews=[{state:'CHANGES_REQUESTED',user:{id:2}}];await assert.rejects(approve(g,{version:1,snapshot:state.snapshot,review:clear()}));assert.equal(g.writes.length,0);}
});
test('existing exact bot approval is idempotent',async()=>{
  const g=new FakeGitHub(),state=await snapshot(g,6);g.reviews=[{user:{id:2,login:'github-actions[bot]'},state:'APPROVED',commit_id:head,body:`Review digest: ${state.snapshot.digest}`}];
  assert.equal((await approve(g,{version:1,snapshot:state.snapshot,review:clear()})).state,'already-approved');assert.equal(g.writes.length,0);
});
test('Claude child has no GitHub credential, tools, MCP configuration or PR checkout',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'fake-claude-'));
  const executable=join(dir,'claude');
  await writeFile(executable,`#!/usr/bin/env node\nconst a=process.argv.slice(2);if(process.env.GH_TOKEN||process.env.GITHUB_TOKEN||!a.includes('--strict-mcp-config')||a[a.indexOf('--tools')+1]!==''||a[a.indexOf('--setting-sources')+1]!=='')process.exit(2);process.stdin.resume();process.stdin.on('end',()=>console.log(JSON.stringify({type:'result',subtype:'success',is_error:false,structured_output:${JSON.stringify(clear())}})));\n`,{mode:0o700});
  const old=process.env.GH_TOKEN;process.env.GH_TOKEN='synthetic-test-secret';
  try{assert.deepEqual(await reviewWithClaude({head,base},'synthetic-oauth',executable),clear());await assert.rejects(reviewWithClaude({head,base},'',executable));}
  finally{if(old===undefined)delete process.env.GH_TOKEN;else process.env.GH_TOKEN=old;await rm(dir,{recursive:true,force:true});}
});
test('Claude refusals, truncated output and malformed JSON cannot become reviews',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'fake-claude-errors-')),executable=join(dir,'claude');
  try {
    for(const output of ['not json',JSON.stringify({type:'result',subtype:'error_max_turns',is_error:true}),JSON.stringify({type:'result',subtype:'success',is_error:false})]) {
      await writeFile(executable,`#!/usr/bin/env node\nprocess.stdin.resume();process.stdin.on('end',()=>process.stdout.write(${JSON.stringify(output)}));\n`,{mode:0o700});
      await assert.rejects(reviewWithClaude({head,base},'synthetic-oauth',executable));
    }
  } finally {await rm(dir,{recursive:true,force:true});}
});
