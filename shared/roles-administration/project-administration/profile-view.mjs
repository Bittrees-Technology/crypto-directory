import {profileFields,profileEnvelope} from '../sso/profile-model.mjs';
export const profileMarkup='<section id="shared-profile" hidden><h2>My Bittrees profile</h2><div id="profile-fields"></div><p id="profile-status"></p><a href="https://roles.bittrees.org/profile" target="_blank" rel="noopener noreferrer">Manage shared profile</a><p class="muted">Display information only. Private data and permissions stay in this app.</p></section>';
// Serialized as a separate same-origin script; no session tokens or profile data in HTML.
function profileClient(){
 const panel=document.getElementById('shared-profile'),fields=document.getElementById('profile-fields'),status=document.getElementById('profile-status');
 if(!panel||!fields||!status)return;
 let generation=0,expiry,controller,stopped=false;
 function clear(){++generation;controller?.abort();clearTimeout(expiry);fields.replaceChildren();status.textContent='';panel.hidden=true;}
 async function load(){
  clear();if(stopped||document.hidden)return;const id=generation;controller=new AbortController();
  try{
   const r=await fetch('/api/project-admin/sso/profile',{credentials:'same-origin',cache:'no-store',signal:controller.signal});
   if(!r.ok)throw Error();const p=profileEnvelope(await r.json());if(id!==generation||stopped)return;
   if(p.fields){
    const f=p.fields;
    if(f.avatar){const img=document.createElement('img');img.src=f.avatar;img.alt='';img.width=48;img.height=48;img.referrerPolicy='no-referrer';img.onerror=()=>img.remove();fields.append(img);}
    for(const key of ['name','bio'])if(f[key]){const line=document.createElement('p');line.textContent=f[key];fields.append(line);}
    if(f.website){const a=document.createElement('a');a.href=f.website;a.textContent='Website';a.target='_blank';a.rel='noopener noreferrer';fields.append(a);}
   }else status.textContent='No profile is shared with this app. Choose fields and apps in Roles.';
   panel.hidden=false;expiry=setTimeout(clear,60000);
  }catch{if(id===generation)clear();}
 }
 document.getElementById('sign-out').addEventListener('click',()=>{stopped=true;clear();});
 window.addEventListener('pagehide',clear);window.addEventListener('focus',load);document.addEventListener('visibilitychange',load);
 setInterval(load,45000);load();
}
export const profileScript=`${profileFields.toString()}\n${profileEnvelope.toString()}\n(${profileClient.toString()})();`;
