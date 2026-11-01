import {nodeRequest} from '../shared/roles-administration/sso/client.mjs';
import {createEditorialMcp} from '../lib/directory/editorial-mcp.mjs';
// Default-off until a source-reviewed identity/enrollment provider and exact
// finite-lived actor connections are installed. No actor or grant is invented.
const handle=createEditorialMcp();
export default async function editorial(req,res){
  const response=await handle(await nodeRequest(req,'https://cd.bittrees.org'));
  res.statusCode=response.status;for(const[k,v]of response.headers)res.setHeader(k,v);res.end(await response.text());
}
