import {fail} from './model.mjs';
import {STEPS} from './proposal-steps.mjs';

async function transaction(store,authorize,change){
  const previous=store.authorize;store.authorize=authorize;
  try{
    const current=await store.load();if(!current.sha)throw fail('Initialize the existing source intake journal through its native setup before MCP activation.',503);const value=structuredClone(current.value);
    value.mcpRequests??=[];value.mcpOperations??=[];
    if(!Array.isArray(value.mcpRequests)||value.mcpRequests.length>256||!Array.isArray(value.mcpOperations)||value.mcpOperations.length>64)throw fail('MCP operation journal is unavailable',503);
    await authorize();const result=change(value);await store.save(current,{...value,revision:value.revision+1});return structuredClone(result);
  }finally{store.authorize=previous;}
}
export async function reserveRequest(store,proof,connection,tool,args,authorize,now){
  return transaction(store,authorize,value=>{
    // This is a five-second replay cache, not the durable business/audit log.
    // Expired requests can never become valid again; operations remain retained.
    value.mcpRequests=value.mcpRequests.filter(r=>r.expiresAt>now);
    if(value.mcpRequests.some(r=>r.id===proof.requestId))throw fail('This signed request was already consumed',409);
    if(value.mcpRequests.length>=256)throw fail('MCP replay cache is full',429);
    value.mcpRequests.push({id:proof.requestId,operationId:proof.operationId,parametersDigest:proof.parametersDigest,decisionDigest:proof.decisionDigest,binding:connection.bindingDigest,expiresAt:proof.expiresAt});
    if(tool.method==='GET'||tool.name==='directory.execute_step')return null;
    const previous=value.mcpOperations.find(r=>r.id===proof.operationId);
    if(previous){if(previous.binding!==connection.bindingDigest||previous.action!==tool.action||previous.parametersDigest!==proof.parametersDigest)throw fail('Operation ID already belongs to another immutable request',409);return previous;}
    if(value.mcpOperations.length>=64)throw fail('MCP operation audit is full; source administrator review is required',409);
    const row={id:proof.operationId,binding:connection.bindingDigest,action:tool.action,capability:tool.capability,parametersDigest:proof.parametersDigest,args,status:'preparing',revision:1,history:[{requestId:proof.requestId,decisionDigest:proof.decisionDigest,step:'prepare',at:now}]};value.mcpOperations.push(row);return null;
  });
}
export async function readOperation(store,id,connection){
  const current=await store.load(),row=current.value.mcpOperations?.find(r=>r.id===id&&r.binding===connection.bindingDigest);
  if(!row)throw fail('Source operation not found',404);return structuredClone(row);
}
export function operationReceipt(row){
  return {operationId:row.id,status:row.status,revision:row.revision,...(row.plan?{projectId:row.plan.projectId,expectedHeadSha:row.headSha,expectedDiffDigest:row.plan.diffDigest,nextStep:row.status==='prepared'?STEPS[row.nextIndex]:null}:{}),...(row.outcome?{outcome:row.outcome}:{}),...(row.heldReason?{message:row.heldReason}:{})};
}
export async function auditOperation(store,id,connection,change){
  // Source-owned append/update of an already reserved operation receipt. It
  // cannot dispatch GitHub effects or alter native listing/submission records.
  // Recording a late result is allowed; it grants no authority for a next step.
  return transaction(store,async()=>{},value=>{
    const row=value.mcpOperations.find(r=>r.id===id&&r.binding===connection.bindingDigest);
    if(!row)throw fail('Reserved operation disappeared',409);
    const immutable=JSON.stringify({id:row.id,binding:row.binding,action:row.action,parametersDigest:row.parametersDigest,args:row.args});
    change(row);if(immutable!==JSON.stringify({id:row.id,binding:row.binding,action:row.action,parametersDigest:row.parametersDigest,args:row.args}))throw fail('Immutable source operation changed',409);
    row.revision++;return row;
  });
}
export async function reserveStep(store,connection,proof,args,authorize,now){
  return transaction(store,authorize,value=>{
    const row=value.mcpOperations.find(r=>r.id===args.operationId&&r.binding===connection.bindingDigest);
    if(!row||row.status!=='prepared'||row.revision!==args.revision||!row.plan||STEPS[row.nextIndex]!==args.step||row.headSha!==args.expectedHeadSha||row.plan.diffDigest!==args.expectedDiffDigest||proof.operationId!==row.id)throw fail('Exact next operation step, revision and source head are required',409);
    row.status='dispatching';row.dispatch={step:args.step,requestId:proof.requestId,decisionDigest:proof.decisionDigest,expectedHead:args.expectedHeadSha,at:now};row.history.push({...row.dispatch});row.revision++;
    return row;
  });
}
export async function recordStep(store,connection,reserved,receipt,{held=false,reason=''}={}){
  return auditOperation(store,reserved.id,connection,row=>{
    if(!row.dispatch||row.dispatch.requestId!==reserved.dispatch.requestId||row.status!=='dispatching')throw fail('Operation step outcome changed; reconcile first',409);
    if(held){row.status='held';row.heldReason=reason||'The dispatched outcome requires a fresh read-authorized reconciliation.';if(receipt)row.observedReceipt=receipt;return;}
    row.receipts??=[];row.receipts.push({step:row.dispatch.step,...receipt});row.headSha=receipt.headSha;row.nextIndex++;
    row.status=row.nextIndex===STEPS.length?'complete':'prepared';row.dispatch=null;row.heldReason=null;
    if(receipt.proposal)row.outcome={status:'release-pending',proposal:receipt.proposal};
  });
}
