import {createPublicClient,http} from 'viem';
import {mainnet} from 'viem/chains';
import {normalize} from 'viem/ens';

// ENS DAO's upgradeable Universal Resolver verifies the forward address before
// returning a primary name. This is display metadata, never role authority.
const resolver='0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe';
const abi=[{type:'function',name:'reverse',stateMutability:'view',inputs:[{name:'lookupAddress',type:'bytes'},{name:'coinType',type:'uint256'}],outputs:[{name:'primary',type:'string'},{name:'resolver',type:'address'},{name:'reverseResolver',type:'address'}]}];
export function createEnsNameResolver({fetcher=fetch,now=Date.now,client=null}={}){
  const rpc=client||createPublicClient({chain:mainnet,ccipRead:false,transport:http('https://ethereum-rpc.publicnode.com',{retryCount:0,timeout:3500,maxResponseBodySize:16384,fetchFn:fetcher})});
  const cache=new Map(),pending=new Map();
  return async identity=>{
    if(typeof identity!=='string'||!/^0x[a-f0-9]{40}$/i.test(identity))return null;
    const address=identity.toLowerCase(),hit=cache.get(address);if(hit&&hit.until>now())return hit.name;
    if(pending.has(address))return pending.get(address);
    const lookup=(async()=>{
      let name=null;
      try{
        const result=await rpc.readContract({address:resolver,abi,functionName:'reverse',args:[address,60n]});
        const candidate=result?.[0];
        if(typeof candidate==='string'&&candidate.length<=255&&candidate.includes('.')&&normalize(candidate)===candidate)name=candidate;
      }catch{}
      if(cache.size>=256)cache.delete(cache.keys().next().value);
      cache.set(address,{name,until:now()+(name?600000:30000)});return name;
    })().finally(()=>pending.delete(address));
    pending.set(address,lookup);return lookup;
  };
}
