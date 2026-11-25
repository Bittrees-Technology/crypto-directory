import {nodeRequest} from '../shared/roles-administration/sso/client.mjs';
import {createPublicCatalogue} from '../lib/directory/public-catalogue.mjs';
const handle=createPublicCatalogue();
export default async function catalogue(req,res){
  const response=await handle(await nodeRequest(req,'https://cd.bittrees.org'));
  res.statusCode=response.status;for(const[key,value]of response.headers)res.setHeader(key,value);res.end(await response.text());
}
