import {resolveProject} from './core.js';
export function restoreSaved(value) {
  // Preserve existing collections; limits apply only when adding new saves.
  return Array.isArray(value) ? value.filter(v=>v&&typeof v.id==='string'&&['website','product'].includes(v.type)) : [];
}
export async function importSaved(items,projects,save){
  const remaining=[];let imported=0;
  for(let i=0;i<items.length;i++){
    const item=items[i],p=resolveProject(item.id,projects);
    if(!p?.[item.type]){remaining.push(item);continue;}
    try{await save({action:'save',id:p.id,type:item.type});imported++;}
    catch(error){return {remaining:[...remaining,...items.slice(i)],imported,error};}
  }
  return {remaining,imported,error:null};
}
