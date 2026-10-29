import { getCatalog } from '../lib/catalog.js';
import { inspectFrame } from '../lib/frame.js';
let catalogCache=null;let catalogUntil=0;let pending;
const results=new Map();
async function catalog(){if(catalogCache&&Date.now()<catalogUntil)return catalogCache;if(!pending)pending=getCatalog().then(c=>{catalogCache=c;catalogUntil=Date.now()+60000;return c;}).finally(()=>pending=null);return pending;}
export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  try{
    const u=new URL(req.url,'https://surf.bittrees.org'),id=u.searchParams.get('project'),type=u.searchParams.get('type');
    if(!id||id.length>1024||!['website','product'].includes(type))return res.status(400).json({error:'Invalid destination'});
    const p=(await catalog()).projects.find(p=>p.id===id),target=p?.[type];
    if(!target)return res.status(404).json({error:'This destination is no longer listed.'});
    const cached=results.get(target);let result;
    if(cached&&cached.until>Date.now())result=cached.value;else{result=await inspectFrame(target);if(results.size>1000)results.clear();results.set(target,{value:result,until:Date.now()+600000});}
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=300');return res.status(200).json(result);
  }catch{return res.status(503).json({error:'Unable to check this destination.'});}
}
