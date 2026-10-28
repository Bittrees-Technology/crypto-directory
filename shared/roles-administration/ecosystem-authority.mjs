import {validateAdministrationModel} from './administration-model.mjs';
import {createPublicKey, verify, createHmac} from 'node:crypto';
import {canonical} from './signed-action.mjs';

export const ECOSYSTEM_ENDPOINT='https://roles.bittrees.org/api/authority/ecosystem-decision';
export const MAX_DECISION_AGE=5000;
export const ecosystemSources={
 workflow:{host:'workflow.bittrees.org',roles:['roles-reviewer']},
 gov:{host:'gov.bittrees.org',roles:['admin','moderator','operations']},
 research:{host:'research.bittrees.org',roles:['executive','assistant','researcher','steward']},
 capital:{host:'capital.bittrees.org',roles:[]},
 news:{host:'news.bittrees.org',roles:['moderator','editor','admin','super_admin']},
 crm:{host:'crm.bittrees.org',roles:[]},autonote:{host:'autonote.bittrees.org',roles:[]},
 insights:{host:'insights.bittrees.org',roles:['administrator']},
 mercado:{host:'mercado.bittrees.org',roles:['owner','admin','dealer_manager','support','catalog_manager','offer_manager','vendor_manager']},
 mail:{host:'mail.bittrees.org',roles:['super_admin','mail_admin','auditor']},
 tld:{host:'bittrees-tld.vercel.app',roles:[]},mcp:{host:'mcp.bittrees.org',roles:['operations-viewer']},
 ai:{host:'ai.bittrees.org',roles:['operations-viewer']},wallet:{host:'wallet.bittrees.org',roles:['operations-viewer']},chat:{host:'chat.bittrees.org',roles:['operations-viewer']},roles:{host:'roles.bittrees.org',roles:['directory-viewer']},
 agent:{host:'agent.bittrees.org',roles:['operations-viewer']},verse:{host:'verse.bittrees.org',roles:['operations-viewer']},
 bounties:{host:'bounties.bittrees.org',roles:['moderator']},
 'bittrees-org':{host:'bittrees.org',roles:[]},'crypto-directory':{host:'cd.bittrees.org',roles:['editor','reviewer']},
 'id-agent-control-center':{host:'idacc.bittrees.org',roles:[]},nftfactory:{host:'nftfactory.org',roles:[]},tcp:{host:'tcp.bittrees.org',roles:[]},
 index:{host:'index.bittrees.org',roles:[]},calendar:{host:'calendar.bittrees.org',roles:[]},spacetrader:{host:'captain.bittrees.org',roles:[]},
 'bbrf-pt':{host:'bbrf-pt.bittrees.org',roles:[]},ecrypt:{host:'ecrypt.bittrees.org',roles:[]},cryptoalegre:{host:'ca.bittrees.org',roles:[]},
 'builders-advocacy-group':{host:'buildersadvocacy.org',roles:[]},treeswap:{host:'treeswap.bittrees.org',roles:[]},
};
// Labels reflect established ENS names; enrollment never transfers ENS authority.
export const administrationDomain=project=>({'bittrees-org':'bittrees.eth','crypto-directory':'cryptodirectory.eth','id-agent-control-center':'idacc.bittrees.eth',nftfactory:'nftfactory.eth',spacetrader:'spacetrader.bittrees.eth',cryptoalegre:'cryptoalegre.bittrees.eth'}[project]||project+'.bittrees.eth');
export const scopeFor=project=>'ecosystem.'+project;
export const resourceFor=project=>'project:'+project;
const legacyActions={gov:['community.roles.manage','community.moderation.manage','rooms.manage','rooms.propose'],research:['community.roles.manage','community.moderation.manage','rooms.manage','rooms.propose'],capital:['snapshot.refresh'],roles:['directory.read']};
export const actionsFor=project=>[...(project==='research'?['research.credentials.define','research.credentials.assign']:[]),...(legacyActions[project]||[]),'project.admin','tier.partner','tier.junior-partner','tier.associate',...ecosystemSources[project].roles.map(role=>'role.'+role.replaceAll('_','-'))];
export const ecosystemRequestMessage=r=>'Bittrees ecosystem authority request v1\n'+canonical(r);
export const ecosystemDecisionMessage=d=>'Bittrees ecosystem authority decision v1\n'+canonical(d);
export function verifyEcosystemSignature(message,signature,pem){
 try{const key=createPublicKey(pem);return key.asymmetricKeyType==='ed25519'&&typeof signature==='string'&&signature.length<=128&&verify(null,Buffer.from(message),key,Buffer.from(signature,'base64'));}catch{return false;}
}
// Use the same source-bound opaque identity as the signed assignment feed.
export function ecosystemSubject(project,kind,value,secret){
 if(kind==='wallet'){
  if(!/^0x[a-fA-F0-9]{40}$/.test(value))throw Error('Invalid verified wallet');
  return value.toLowerCase();
 }
 if(!['email','account'].includes(kind)||typeof value!=='string'||!value||value.length>512||!secret||secret.length<32)throw Error('Source identity unavailable');
 return 'subject:'+createHmac('sha256',secret).update(JSON.stringify([ecosystemSources[project].host,kind,value])).digest('hex');
}
export function verifyEcosystemDecision(envelope,request,pem,now=Date.now()){
 const d=envelope?.decision;
 if(!d||d.version!==1||d.issuer!=='https://roles.bittrees.org'||d.audience!==request.source||canonical(d.request)!==canonical(request)||!verifyEcosystemSignature(ecosystemDecisionMessage(d),envelope.signature,pem)||!Number.isSafeInteger(d.checkedAt)||!Number.isSafeInteger(d.expiresAt)||d.checkedAt>now+1000||d.expiresAt<=now||d.expiresAt<=d.checkedAt||d.expiresAt-d.checkedAt>MAX_DECISION_AGE||d.requiresPrivateOwnership!==true||typeof d.authoritative!=='boolean'||typeof d.enrolled!=='boolean'||!Array.isArray(d.actions)||new Set(d.actions).size!==d.actions.length||d.actions.some(a=>!actionsFor(request.project).includes(a))||(!d.authoritative&&d.actions.length))throw Error('Roles ecosystem decision rejected');
 if(d.unavailableTiers!==undefined&&(!Array.isArray(d.unavailableTiers)||new Set(d.unavailableTiers).size!==d.unavailableTiers.length||d.unavailableTiers.some(a=>!['tier.partner','tier.junior-partner','tier.associate'].includes(a)||d.actions.includes(a))))throw Error('Invalid tier availability');
 if(request.reviewerCandidates&&(!Array.isArray(d.reviewers)||new Set(d.reviewers).size!==d.reviewers.length||d.reviewers.some(w=>!request.reviewerCandidates.includes(w))||(!d.authoritative&&d.reviewers.length)))throw Error('Invalid reviewer routing');
 if(!request.reviewerCandidates&&d.reviewers!==undefined)throw Error('Unrequested reviewer routing');
 if(d.roleTemplates!==undefined&&(!request.includeRoleMetadata||request.project!=='workflow'||!d.authoritative||!d.actions.some(a=>['project.admin','role.roles-reviewer'].includes(a))||!Array.isArray(d.roleTemplates)||d.roleTemplates.length>300||d.roleTemplates.some(t=>!t||Object.keys(t).some(k=>!['id','name','description','scope','revision','baseRoleIds'].includes(k))||typeof t.id!=='string'||!/^[a-f0-9-]{36}$/.test(t.id)||typeof t.name!=='string'||!t.name.length||t.name.length>100||typeof t.description!=='string'||t.description.length>500||t.scope!=='project:workflow'||!Number.isSafeInteger(t.revision)||t.revision<1||!Array.isArray(t.baseRoleIds)||!t.baseRoleIds.length||t.baseRoleIds.length>20||t.baseRoleIds.some(id=>id!=='ecosystem.workflow.roles-reviewer'))))throw Error('Invalid scoped role metadata');
 validateAdministrationModel(d.administration,d,request);
 return d;
}
