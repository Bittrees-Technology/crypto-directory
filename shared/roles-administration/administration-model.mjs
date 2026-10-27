// Signed display evidence. Actions and the app's server guard remain authority.
export function administrationModel(request,result,registry,now=Date.now(),expectedPolicyDigest=null){
 const native=['gov','research','capital'].includes(request.project),current=registry?.status==='current'&&registry.project===request.project&&registry.wallet===request.authenticatedWallet&&typeof expectedPolicyDigest==='string'&&registry.policyDigest===expectedPolicyDigest&&Number.isSafeInteger(registry.checkedAt)&&registry.checkedAt<=now+1000&&registry.validUntil>now&&registry.validUntil-registry.checkedAt<=5000;
 const enabled=!native&&result.authoritative===true&&result.validUntil>now&&result.actions.includes('project.admin')&&Boolean(request.authenticatedWallet)&&request.subjects.includes(request.authenticatedWallet)&&current;
 return {project:request.project,model:native?'native':'ecosystem',status:current?'current':registry?.status==='not-active'?'not-active':'unavailable',roles:enabled?(registry.superadmin===true?['superadmin','admin']:registry.admin===true?['admin']:[]):[]};
}
export function validateAdministrationModel(value,decision,request){
 if(value===undefined)return;
 if(!value||Object.keys(value).sort().join(',')!=='model,project,roles,status'||value.project!==request.project||value.model!==(['gov','research','capital'].includes(request.project)?'native':'ecosystem')||!['current','not-active','unavailable'].includes(value.status)||!Array.isArray(value.roles)||value.roles.length>2||new Set(value.roles).size!==value.roles.length||value.roles.some(r=>!['superadmin','admin'].includes(r))||value.roles.includes('superadmin')&&!value.roles.includes('admin')||value.roles.length&&(value.model!=='ecosystem'||value.status!=='current'||!decision.authoritative||!decision.enrolled||!decision.actions.includes('project.admin')||!request.authenticatedWallet||!request.subjects.includes(request.authenticatedWallet)))throw Error('Invalid project administration evidence');
}
