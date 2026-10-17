#!/usr/bin/env python3
"""Stage a checked main-branch release; never sign or update ENS."""
import argparse, fcntl, hashlib, json, os, re, shutil, subprocess, tempfile, time
from pathlib import Path
from urllib.request import Request, urlopen
from publisher import IPFS, validate, write, eligible
REPO='Bittrees-Technology/crypto-directory'

def github(path):
    with urlopen(Request('https://api.github.com/repos/'+REPO+'/'+path,headers={'User-Agent':'Bittrees-CryptoDirectory-Publisher/1.0','Accept':'application/vnd.github+json'}),timeout=30) as r:
        return json.load(r)

def stage(root):
    if (root/'disabled').exists(): return {'status':'disabled'}
    budget=Path('/var/lib/ipfs-budget/status.json')
    if budget.exists() and json.loads(budget.read_text()).get('managed_pause'): return {'status':'ipfs-budget-paused'}
    state=root/'state.json'
    if state.exists() and not eligible(json.loads(state.read_text()),int(time.time())): return {'status':'weekly-limit'}
    # A checked main commit, never a pull-request head or arbitrary source URL.
    sha=github('commits/main')['sha']
    if not re.fullmatch('[a-f0-9]{40}',sha): raise ValueError('Invalid commit')
    def checked(head, event):
        runs=github(f'actions/workflows/ci.yml/runs?head_sha={head}&event={event}&status=success&per_page=1')['workflow_runs']
        return any(r['head_sha']==head and r['event']==event and r['head_repository']['full_name']==REPO for r in runs)
    verified=checked(sha,'push')
    if not verified:
        # Token-authored merges do not trigger another Actions run. Accept only
        # the identical tree from a merged PR whose exact head passed this CI.
        tree=github('git/commits/'+sha)['tree']['sha']
        for pr in github('commits/'+sha+'/pulls'):
            if pr.get('merged_at') and pr['merge_commit_sha']==sha and pr['base']['ref']=='main' and pr['head']['repo']['full_name']==REPO:
                head=pr['head']['sha']
                if checked(head,'pull_request') and github('git/commits/'+head)['tree']['sha']==tree:
                    verified=True; break
    if not verified: raise ValueError('Current main has no successful CI for its exact source tree')
    dest=root/'candidate.json'
    if dest.exists() and json.loads(dest.read_text()).get('sourceCommit')==sha:
        return {'status':'already-staged','sourceCommit':sha}
    if shutil.disk_usage(root).free < 256*1024*1024: raise ValueError('Insufficient room for bounded release build')
    with tempfile.TemporaryDirectory(prefix='cryptodirectory-build-',dir=root) as temp:
        checkout=Path(temp)/'source'
        subprocess.run(['git','clone','--depth=1','--single-branch','--branch=main','https://github.com/'+REPO+'.git',str(checkout)],check=True,timeout=90,stdout=subprocess.DEVNULL)
        actual=subprocess.check_output(['git','-C',str(checkout),'rev-parse','HEAD'],text=True).strip()
        if actual!=sha: raise ValueError('Main moved during staging; retry after next checks')
        subprocess.run(['npm','run','build'],cwd=checkout,env={'PATH':'/usr/bin:/bin','SITE_URL':'https://cryptodirectory.eth.limo'},check=True,timeout=90,stdout=subprocess.DEVNULL)
        site=checkout/'site'; files={}; total=0
        for path in sorted(site.rglob('*')):
            if path.is_symlink(): raise ValueError('Symlinks are not release files')
            if not path.is_file(): continue
            size=path.stat().st_size;total+=size
            if size>16*1024*1024 or total>32*1024*1024: raise ValueError('Release exceeds size limit')
            digest=hashlib.sha256();count=0
            with path.open('rb') as stream:
                while chunk:=stream.read(65536):
                    count+=len(chunk)
                    if count>size:raise ValueError('Release file changed during hashing')
                    digest.update(chunk)
            if count!=size:raise ValueError('Release file changed during hashing')
            files[path.relative_to(site).as_posix()]=digest.hexdigest()
        # Import into the existing local daemon, keeping old release pins intact.
        cid=subprocess.check_output(IPFS+['add','--recursive','--quieter','--cid-version=1','--raw-leaves=true','--pin=true',str(site)],text=True,timeout=180).strip()
        candidate={'cid':cid,'sourceCommit':sha,'files':files}
        validate(candidate)
        write(dest,candidate)
        subprocess.run(IPFS+['provide','once','--recursive',cid],check=True,timeout=30,stdout=subprocess.DEVNULL)
    return {'status':'staged','cid':cid,'sourceCommit':sha,'files':len(files)}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--state-dir',type=Path,required=True);args=parser.parse_args()
    args.state_dir.mkdir(parents=True,exist_ok=True)
    with open(args.state_dir/'staging.lock','a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        print(json.dumps(stage(args.state_dir)))
