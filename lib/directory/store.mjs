import {GitHubStore} from './github.mjs';
import {RuntimeStore} from './runtime-store.mjs';

export function createDirectoryStore(options={}){
  const env=options.env||process.env;
  if(env.DIRECTORY_DATA_BACKEND==='runtime-v1'||env.DIRECTORY_LEGACY_WRITES_DISABLED==='true')return new RuntimeStore(options);
  // Compatibility during the explicitly frozen/exported migration only.
  // Once the legacy fence is installed, configuration failure cannot select GitHub.
  return new GitHubStore(options);
}
