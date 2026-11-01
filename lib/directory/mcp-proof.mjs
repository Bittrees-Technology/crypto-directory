import {createHash,createPublicKey} from 'node:crypto';
import {canonical} from '../../shared/roles-administration/signed-action.mjs';
import {verifyEcosystemSignature} from '../../shared/roles-administration/ecosystem-authority.mjs';
import {EDITORIAL_AUDIENCE,EDITORIAL_RESOURCE,EDITORIAL_TOOLS,UUID} from './editorial-contract.mjs';
import {fail,strictObject} from './model.mjs';
export {canonical};
export const digest=value=>createHash('sha256').update(canonical(value)).digest('hex');
export function connectionBinding(c){
  return digest({version:1,audience:EDITORIAL_AUDIENCE,id:c.id,sourceTokenHash:c.sourceTokenHash,principal:c.principal,credentialId:c.credentialId,delegationId:c.delegationId,tenant:c.tenant,workspace:c.workspace,identityBindingDigest:c.identityBindingDigest,actions:[...c.actions].sort(),gatewayPublicKey:c.gatewayPublicKey,actorPublicKey:c.actorPublicKey,approvedAt:c.approvedAt,expiresAt:c.expiresAt,proofMode:c.proofMode});
}
const HEX=/^[a-f0-9]{64}$/;
const deny=()=>{throw fail('Current enrolled actor, approved source connection and exact Roles permission are required.',403);};
const requestMessage=r=>'Bittrees MCP authority request v1\n'+canonical(r);
const decisionMessage=d=>'Bittrees MCP authority decision v1\n'+canonical(d);

export function sourceConnection(env,bearer,now=Date.now()){
  if(env.DIRECTORY_MCP_EDITORIAL_ENABLED!=='true')throw fail('Authenticated editorial MCP is not activated.',503);
  if(typeof bearer!=='string'||!/^Bearer [a-f0-9]{64}$/.test(bearer))deny();
  const raw=env.DIRECTORY_MCP_CONNECTIONS_JSON||'[]';if(raw.length>65536)deny();
  let connections;try{connections=JSON.parse(raw);}catch{deny();}
  if(!Array.isArray(connections)||connections.length>32)deny();
  const tokenHash=createHash('sha256').update(bearer.slice(7)).digest('hex');
  const matches=connections.filter(c=>c?.enabled===true&&c.sourceTokenHash===tokenHash);
  if(matches.length!==1)deny();
  const c=matches[0];
  strictObject(c,['id','enabled','sourceTokenHash','bindingDigest','credentialId','delegationId','principal','tenant','workspace','approvedAt','expiresAt','actions','gatewayPublicKey','actorPublicKey','proofMode','identityBindingDigest']);
  if(!UUID.test(c.id)||!HEX.test(c.bindingDigest)||!HEX.test(c.credentialId)||!UUID.test(c.delegationId)||!/^((agent|service|person):)[a-f0-9-]{36}$/.test(c.principal||'')||!UUID.test(c.principal.slice(c.principal.indexOf(':')+1))||!Number.isSafeInteger(c.expiresAt)||c.expiresAt<=now||!Number.isSafeInteger(c.approvedAt)||c.approvedAt>now||c.expiresAt-c.approvedAt>86400000||typeof c.tenant!=='string'||!c.tenant.length||c.tenant.length>128||typeof c.workspace!=='string'||!c.workspace.length||c.workspace.length>128||!Array.isArray(c.actions)||!c.actions.length||new Set(c.actions).size!==c.actions.length||c.actions.some(a=>!EDITORIAL_TOOLS.some(t=>t.action===a))||typeof c.gatewayPublicKey!=='string'||typeof c.actorPublicKey!=='string'||c.gatewayPublicKey===c.actorPublicKey||!['gateway-held-delegated-v1','device-held-delegated-v1'].includes(c.proofMode))deny();
  // identityBindingDigest refers to an independently verified native owner and
  // current identity links. Configuring a key never supplies that verification.
  if(!HEX.test(c.identityBindingDigest)||c.bindingDigest!==connectionBinding(c)||[c.tenant,c.workspace].some(v=>!/^[a-zA-Z0-9][a-zA-Z0-9._:/@-]{0,127}$/.test(v)))deny();
  try{if([c.gatewayPublicKey,c.actorPublicKey].some(key=>key.length>1024||!key.startsWith('-----BEGIN PUBLIC KEY-----')||key.includes('PRIVATE KEY')))deny();const gateway=createPublicKey(c.gatewayPublicKey),actor=createPublicKey(c.actorPublicKey);if(gateway.asymmetricKeyType!=='ed25519'||actor.asymmetricKeyType!=='ed25519'||gateway.export({format:'der',type:'spki'}).equals(actor.export({format:'der',type:'spki'}))||createHash('sha256').update(actor.export({format:'pem',type:'spki'})).digest('hex')!==c.credentialId)deny();}catch{deny();}
  return structuredClone(c);
}
export function sourceContext(connection,tool,args,operationId){
  return {version:1,audience:EDITORIAL_AUDIENCE,connectionId:connection.id,connectionBindingDigest:connection.bindingDigest,identityBindingDigest:connection.identityBindingDigest,operation:tool.name,operationId,step:args.step||'prepare',selection:args};
}
export function decodeProof(header){
  if(typeof header!=='string'||!header.length||header.length>16384||!/^[A-Za-z0-9_-]+$/.test(header))deny();
  try{const raw=Buffer.from(header,'base64url');if(raw.length>12288||raw.toString('base64url')!==header)deny();return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));}catch{deny();}
}
export function verifySourceProof(proof,{connection,tool,args,decisionKey,now=Date.now()}){
  if(!proof||typeof decisionKey!=='string'||decisionKey.length>1024||!decisionKey.startsWith('-----BEGIN PUBLIC KEY-----')||decisionKey.includes('PRIVATE KEY'))deny();
  strictObject(proof,['request','signature','principalSignature','decisionEnvelope']);
  const r=proof.request,d=proof.decisionEnvelope?.decision;
  if(!r||!d)deny();
  strictObject(r,['version','source','audience','requestId','operationId','parametersDigest','issuedAt','principal','credentialId','delegationId','stage','tenant','workspace','project','resource','action']);
  strictObject(proof.decisionEnvelope,['decision','signature']);
  if(r.version!==1||r.source!=='mcp.bittrees.org'||r.audience!=='https://roles.bittrees.org/api/authority/mcp-decision'||r.stage!=='execute'||r.project!=='crypto-directory'||r.resource!==EDITORIAL_RESOURCE||r.action!==tool.action||!connection.actions.includes(r.action)||r.tenant!==connection.tenant||r.workspace!==connection.workspace||r.principal!==connection.principal||r.credentialId!==connection.credentialId||r.delegationId!==connection.delegationId||!UUID.test(r.requestId)||!UUID.test(r.operationId)||!Number.isSafeInteger(r.issuedAt)||r.issuedAt>now+1000||now-r.issuedAt>5000||r.parametersDigest!==digest(sourceContext(connection,tool,args,r.operationId)))deny();
  if(!verifyEcosystemSignature(requestMessage(r),proof.signature,connection.gatewayPublicKey)||!verifyEcosystemSignature(requestMessage(r),proof.principalSignature,connection.actorPublicKey))deny();
  if(d.version!==1||d.issuer!=='https://roles.bittrees.org'||d.audience!=='https://mcp.bittrees.org'||d.allowed!==true||d.requiresSourceAuthorization!==true||canonical(d.request)!==canonical(r)||!Number.isSafeInteger(d.checkedAt)||!Number.isSafeInteger(d.expiresAt)||d.checkedAt>now+1000||d.expiresAt<=now||d.expiresAt<=d.checkedAt||d.expiresAt-d.checkedAt>5000||!verifyEcosystemSignature(decisionMessage(d),proof.decisionEnvelope.signature,decisionKey))deny();
  return {requestId:r.requestId,operationId:r.operationId,parametersDigest:r.parametersDigest,decisionDigest:digest(proof.decisionEnvelope),connectionDigest:digest(connection),expiresAt:d.expiresAt};
}
export function receiptHeaders(proof){
  return {'X-Bittrees-Mcp-Request-Id':proof.requestId,'X-Bittrees-Mcp-Operation-Id':proof.operationId,'X-Bittrees-Mcp-Decision-Digest':proof.decisionDigest};
}
