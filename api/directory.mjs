import {nodeRequest} from '../shared/roles-administration/sso/client.mjs';
import {createDirectoryService} from '../lib/directory/service.mjs';
const handle=createDirectoryService();
export default async function directory(req,res){
  const result=await handle(await nodeRequest(req,'https://cd.bittrees.org'));
  res.statusCode=result.status;for(const [key,value] of result.headers)res.setHeader(key,value);
  res.end(await result.text());
}
