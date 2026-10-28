// Display data only. Never pass this object into authorization or account linking.
export const profileApps=['roles','insights','workflow','mercado','crm','autonote','news','wallet','ai','mail','bounties','tld','mcp','chat','nftfactory','agent','verse'];
export function profileFields(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!['name','avatar','bio','website'].includes(k)))throw Error('Only name, avatar, bio and website can be shared');
 const out={};for(const [key,max] of Object.entries({name:120,avatar:2048,bio:1000,website:2048})){
  const v=value[key]??'';if(typeof v!=='string'||v.length>max||/[\x00-\x08\x0b-\x1f\x7f-\x9f\u202a-\u202e\u2066-\u2069]/.test(v))throw Error('Invalid '+key);
  out[key]=v.trim();
 }
 for(const key of ['avatar','website'])if(out[key]){
  let u;try{u=new URL(out[key]);}catch{throw Error('Use an HTTPS '+key+' URL');}
  if(u.protocol!=='https:'||u.username||u.password||/[\s]/.test(out[key])||!u.hostname.includes('.')||u.hostname.endsWith('.local')||u.hostname.endsWith('.localhost')||u.hostname.endsWith('.internal')||/^\[|^[\d.]+$/.test(u.hostname))throw Error('Use a public HTTPS '+key+' URL');
  out[key]=u.href;
 }
 return out;
}
export function profileAudience(value){if(!Array.isArray(value)||value.length>profileApps.length||new Set(value).size!==value.length||value.some(v=>!profileApps.includes(v)))throw Error('Invalid sharing selection');return [...value].sort();}
export function profileEnvelope(value){
 if(!value||!['shared','not-shared'].includes(value.status)||(value.status==='shared'&&(!Number.isSafeInteger(value.revision)||value.revision<1)))throw Error('Invalid profile response');
 return value.status==='shared'?{status:'shared',fields:profileFields(value.fields),revision:value.revision,maxAgeMs:60000}:{status:'not-shared',fields:null,maxAgeMs:60000};
}

// Only these registered staff clients share their parent app’s explicit consent.
export const profileAppForClient=id=>new Map([['ai-admin','ai'],['mcp-admin','mcp'],['chat-admin','chat'],['wallet-admin','wallet'],['agent-admin','agent'],['verse-admin','verse']]).get(id)||id;
