import {CATEGORIES,FIELDS,LISTING_FIELDS,REMOVAL_REASONS,entry,requestedChange,projectPath,strictObject,fail} from './model.mjs';

export const EDITORIAL_AUDIENCE='https://cd.bittrees.org/api/integrations/mcp';
export const EDITORIAL_RESOURCE='directory:editorial';
export const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const id={type:'string',pattern:'^[-a-z0-9]{1,120}\\.md$'},uuid={type:'string',format:'uuid'},sha={type:'string',pattern:'^[a-f0-9]{40}$'};
const reason={type:'string',minLength:10,maxLength:1000},revision={type:'integer',minimum:1},mode={type:'string',enum:['manual']};
const schema=(properties={},required=[])=>({type:'object',properties,required,additionalProperties:false});
const opaque={type:'string',pattern:'^[a-f0-9]{64}$'};
export const SOURCE_PERSON_RESULT_SCHEMA=schema({verified:{type:'boolean',const:true},purpose:{type:'string',enum:['crypto-directory:editorial']},audience:{type:'string',enum:[EDITORIAL_AUDIENCE]},connectionId:uuid,principal:{type:'string',maxLength:64},credentialId:opaque,personSubject:opaque,sourceSubject:opaque,identity:{type:'string',maxLength:254,description:'One native identity already known to CD through its own verified owner consent; never cross-app contact/alias enumeration.'},identityRevision:revision,authTime:{type:'integer'},checkedAt:{type:'integer'},expiresAt:{type:'integer'},contextDigest:opaque},['verified','purpose','audience','connectionId','principal','credentialId','personSubject','sourceSubject','identity','identityRevision','authTime','checkedAt','expiresAt','contextDigest']);
export const ENTRY_SCHEMA=schema(Object.fromEntries(LISTING_FIELDS.map(([key])=>[key,key==='lead_category'?{type:'string',enum:CATEGORIES}:['tags','ecosystem'].includes(key)?{type:'array',minItems:1,maxItems:12,items:{type:'string',minLength:1,maxLength:70}}:{type:'string',maxLength:key==='description'?500:700}])),LISTING_FIELDS.map(([key])=>key).filter(key=>key!=='token_url'));
const changeProperties={id,sha,kind:{type:'string',enum:['edit','removal']},entry:ENTRY_SCHEMA,changes:{type:'string',minLength:20,maxLength:2000},sources:{type:'string',maxLength:1500},removalReasons:{type:'array',minItems:1,maxItems:REMOVAL_REASONS.length,uniqueItems:true,items:{type:'string',enum:REMOVAL_REASONS.map(([key])=>key)}},operationId:uuid};
const decisionProperties={id:uuid,revision,decision:{type:'string',enum:['accept','reject']},reason,mode};
const queueSchema=schema({limit:{type:'integer',minimum:1,maximum:100,default:20},offset:{type:'integer',minimum:0,maximum:256},expectedSnapshot:{type:'string',pattern:'^[a-f0-9]{64}$'}});
export const PAGE_COVERAGE=[
  {page:'/',tools:['directory.search','directory.get_listing'],access:'public'},
  {page:'/categories/:category.html',tools:['directory.list_categories','directory.search'],access:'public'},
  {page:'/submit.html',tools:['directory.submit_project','directory.list_submissions'],access:'signed-in'},
  {page:'/request-edit.html',tools:['directory.request_change','directory.list_change_requests','directory.read_editable_listing'],access:'signed-in'},
  {page:'/edit.html',tools:['directory.propose_edit'],access:'Editor or Admin'},
  {page:'/review.html',tools:['directory.list_submissions','directory.list_change_requests','directory.review_submission','directory.review_change','directory.auto_review'],access:'Reviewer or Admin; automatic approval needs an assigned Reviewer'},
  {page:'/needs-update.html',tools:['directory.read_workspace','directory.list_change_requests','directory.close_change_request'],access:'staff'},
  {page:'/process-status.html',tools:['directory.read_workspace'],access:'staff'},
  {page:'/administration',tools:['directory.read_access','directory.read_workspace'],access:'Admin; role grants and Safe signing stay source-owned'},
  {page:'/sign-in',tools:['directory.read_access'],access:'shared email/wallet sign-in; credentials never accepted as tool input'},
];
export const EDITORIAL_TOOLS=[
  ['read_access','GET','session','canSubmit',schema(),'Read this authenticated source actor’s current Roles capabilities.'],
  ['read_workspace','GET','workspace','canSubmit',schema({page:{type:'string',enum:['overview','needs-update','process-status','administration']},limit:{type:'integer',minimum:1,maximum:100},offset:{type:'integer',minimum:0,maximum:10000}}),'Read page coverage or role-gated staff workspace data.'],
  ['list_submissions','GET','submissions','canSubmit',queueSchema,'Read a bounded page of your submissions or the currently authorized review queue; snapshot guards prevent mixed pages.'],
  ['list_change_requests','GET','edit-requests','canRequestEdit',queueSchema,'Read a bounded page of your requested changes or the authorized staff queue; snapshot guards prevent mixed pages.'],
  ['read_editable_listing','GET','project','canRequestEdit',schema({id},['id']),'Read the current listing fields and exact SHA before requesting a change.'],
  ['submit_project','POST','submit','canSubmit',schema({entry:ENTRY_SCHEMA,operationId:uuid},['entry','operationId']),'Submit a new project for independent review; does not approve or publish.'],
  ['request_change','POST','request-edit','canRequestEdit',schema(changeProperties,['id','sha','kind','changes','sources','operationId']),'Request structured field changes or removal of an existing listing.'],
  ['propose_edit','POST','edit','canEdit',schema({id,sha,entry:ENTRY_SCHEMA,reason,operationId:uuid},['id','sha','entry','reason','operationId']),'Editor/Admin proposes an update to an existing listing, preserving release approval.'],
  ['close_change_request','POST','close-edit-request','canHandleRequests',schema({id:uuid,revision,reason},['id','revision','reason']),'Close a change request with an audit reason; changes no public listing.'],
  ['review_submission','POST','review','canReview',schema(decisionProperties,['id','revision','decision','reason']),'Accept or reject another actor’s new listing; acceptance creates a release proposal.'],
  ['review_change','POST','review-edit-request','canReview',schema(decisionProperties,['id','revision','decision','reason']),'Accept or reject immutable requested changes/removal; no self-approval or direct publication.'],
  ['auto_review','POST',null,'canAutoReview',schema({target:{type:'string',enum:['submission','change']},id:uuid,revision,reason,evidence:{type:'string',minLength:10,maxLength:1000}},['target','id','revision','reason','evidence']),'Explicitly assigned Reviewer approves one independently assessed pending request automatically. Records rationale/evidence; existing source and release gates still apply.'],
  ['execute_step','POST',null,'canSubmit',schema({operationId:uuid,step:{type:'string',enum:['create_branch','write_file','create_pr']},revision,expectedHeadSha:sha,expectedDiffDigest:{type:'string',pattern:'^[a-f0-9]{64}$'}},['operationId','step','revision','expectedHeadSha','expectedDiffDigest']),'Execute only the exact next step of your prepared proposal with fresh Roles permission and unchanged source head/diff. Never merge, publish, reorder or replay an uncertain write.'],
  ['read_operation','GET','operation','canSubmit',schema({operationId:uuid},['operationId']),'Read the current source receipt for your operation; never replay an uncertain write.'],
].map(([short,method,route,capability,inputSchema,description])=>({name:'directory.'+short,action:'directory.'+short,method,route,capability,inputSchema,description,annotations:{readOnlyHint:method==='GET',destructiveHint:false,idempotentHint:true,openWorldHint:true}}));
const purpose={type:'string',enum:['crypto-directory:editorial']},audience={type:'string',enum:[EDITORIAL_AUDIENCE]};
const connectionFields={id:uuid,bindingDigest:opaque,principal:{type:'string',pattern:'^(agent|service|person):[a-f0-9-]{36}$'},credentialId:opaque,delegationId:uuid,tenant:{type:'string',minLength:1,maxLength:128},workspace:{type:'string',minLength:1,maxLength:128},identityBindingDigest:opaque};
const proofSchema=schema({request:{type:'object'},signature:{type:'string',maxLength:128},principalSignature:{type:'string',maxLength:128},decisionEnvelope:schema({decision:{type:'object'},signature:{type:'string',maxLength:128}},['decision','signature'])},['request','signature','principalSignature','decisionEnvelope']);
const metadataFields={kind:{type:'string',enum:['metadata']},purpose,audience,connectionId:uuid,method:{type:'string',enum:['initialize','ping','tools/list']}};
const executeFields={kind:{type:'string',enum:['execute']},purpose,audience,operationId:uuid,requestId:uuid,action:{type:'string',enum:EDITORIAL_TOOLS.map(t=>t.action)},recordId:{anyOf:[{type:'string',maxLength:123},{type:'null'}]},expectedRevision:{anyOf:[revision,{type:'null'}]},expectedSha:{anyOf:[sha,{type:'null'}]},expectedDiffDigest:{anyOf:[opaque,{type:'null'}]},step:{type:'string',enum:['prepare','create_branch','write_file','create_pr']},parametersDigest:opaque,decisionDigest:opaque,authorityProof:proofSchema};
export const SOURCE_PERSON_REQUEST_SCHEMA=schema({connection:schema(connectionFields,Object.keys(connectionFields)),context:{oneOf:[schema(metadataFields,Object.keys(metadataFields)),schema(executeFields,Object.keys(executeFields))]}},['connection','context']);

function validateSchema(value,s){
  if(s.type==='object'){
    strictObject(value,Object.keys(s.properties));if((s.required||[]).some(k=>!Object.hasOwn(value,k)))throw fail('Required tool arguments are missing.');
    for(const [key,v] of Object.entries(value))validateSchema(v,s.properties[key]);
  }else if(s.type==='string'){
    if(typeof value!=='string'||s.minLength!==undefined&&value.trim().length<s.minLength||s.maxLength!==undefined&&value.length>s.maxLength||s.pattern&&!new RegExp(s.pattern).test(value)||s.format==='uuid'&&!UUID.test(value)||s.enum&&!s.enum.includes(value))throw fail('Invalid tool argument.');
  }else if(s.type==='integer'){
    if(!Number.isSafeInteger(value)||value<s.minimum||value>s.maximum)throw fail('Invalid integer tool argument.');
  }else if(s.type==='array'){
    if(!Array.isArray(value)||value.length<s.minItems||value.length>s.maxItems||s.uniqueItems&&new Set(value).size!==value.length)throw fail('Invalid array tool argument.');
    for(const v of value)validateSchema(v,s.items);
  }
}
export function editorialArguments(name,args){
  const tool=EDITORIAL_TOOLS.find(t=>t.name===name);if(!tool)throw fail('Unknown editorial tool.');
  validateSchema(args,tool.inputSchema);
  if(args.id&&name==='directory.read_editable_listing')projectPath(args.id);
  const normalized=structuredClone(args);
  if(args.entry){const value=entry(args.entry);normalized.entry=Object.fromEntries(FIELDS.filter(key=>Object.hasOwn(args.entry,key)).map(key=>[key,key==='token_url'&&!Object.hasOwn(value,key)?'n/a':value[key]]));}
  if(name==='directory.request_change')requestedChange(args);
  if(name==='directory.auto_review'&&args.reason.length+args.evidence.length>980)throw fail('Combined automatic review rationale and evidence must fit 980 characters.');
  for(const key of ['reason','changes','sources','evidence'])if(typeof normalized[key]==='string')normalized[key]=normalized[key].trim();
  if(name==='directory.request_change'&&args.kind==='removal')normalized.removalReasons=REMOVAL_REASONS.map(([id])=>id).filter(id=>args.removalReasons.includes(id));
  if(['directory.review_submission','directory.review_change'].includes(name))normalized.mode='manual';
  return {tool,args:normalized};
}
