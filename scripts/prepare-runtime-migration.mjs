#!/usr/bin/env node
// Writes one private, encrypted migration package. No network or live mutation.
import {readFile,writeFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {encryptJournal} from '../lib/directory/runtime-store.mjs';
import {hash,readState,parseFrontMatter,projectPath} from '../lib/directory/model.mjs';
const {values}=parseArgs({options:{commit:{type:'string'},journal:{type:'string'},'journal-sha256':{type:'string'},output:{type:'string'}}});
if(!/^[a-f0-9]{40}$/.test(values.commit||'')||!values.journal||!values.output||!/^[a-f0-9]{64}$/.test(values['journal-sha256']||''))throw Error('An explicit approved commit, private legacy journal, exact digest and absent output are required.');
const info=await stat(values.journal);if(!info.isFile()||info.mode&0o077||info.size>1500000)throw Error('The exported legacy journal must be a bounded private file.');
const legacy=await readFile(values.journal,'utf8');if(hash(legacy)!==values['journal-sha256'])throw Error('Legacy journal export changed.');
const journal=readState(JSON.parse(legacy),process.env.DIRECTORY_JOURNAL_SECRET);
// Accepted/uncertain GitHub proposals remain historical records, never new approvals.
const paths=execFileSync('git',['ls-tree','-r','--name-only',values.commit,'--','content/projects/'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const seed=paths.map(path=>{const id=path.slice('content/projects/'.length);if(projectPath(id)!==path)throw Error('Unexpected listing path');const raw=execFileSync('git',['show',values.commit+':'+path],{encoding:'utf8',maxBuffer:65536});parseFrontMatter(raw);const sha=execFileSync('git',['rev-parse',values.commit+':'+path],{encoding:'utf8'}).trim();return {id,sha,raw};});
if(!seed.length||seed.length>10000)throw Error('Approved seed exceeds its bound.');
const envelope=encryptJournal(journal,process.env),packageValue={version:1,sourceCommit:values.commit,seed,seedSha256:hash(JSON.stringify(seed)),envelope,legacyJournalSha:values['journal-sha256']};
const raw=JSON.stringify(packageValue);if(Buffer.byteLength(raw)>8*1024*1024)throw Error('Migration package exceeds its bound.');
await writeFile(values.output,raw,{flag:'wx',mode:0o600});
console.log(JSON.stringify({sourceCommit:values.commit,listingCount:seed.length,journalRevision:journal.revision,packageSha256:hash(raw),seedSha256:packageValue.seedSha256}));
