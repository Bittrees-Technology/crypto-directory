import {accountService} from '../lib/account.js';
import {nodeRequest,nodeResponse} from '../lib/sso/client.mjs';
import {getCatalog} from '../lib/catalog.js';
const service=accountService();
export default async function handler(req,res){return nodeResponse(await service.handle(await nodeRequest(req,'https://surf.bittrees.org'),{catalog:getCatalog}),res);}
