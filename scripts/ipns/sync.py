#!/usr/bin/env python3
"""Mirror checked production artifacts into the existing IPNS name.

No cloud builds, credentials, Ethereum transactions, downloaded executables or
new services. $0 additional spending; existing seed/bandwidth limits apply.
"""
import argparse
import concurrent.futures
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import time
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from publisher import IPFS, KEY, NAME, validate, write
from stage import github, REPO

PRODUCTION = 'https://cd.bittrees.org'
ENS = 'https://cryptodirectory.eth.limo'
PROJECT = 'prj_VR4haeMLogio89OfwCsD1zBI4QxE'
VERCEL = 'https://vercel.com/bittrees-tech/bittrees-cryptodirectory/'
VERCEL_CONTEXT = 'Vercel – bittrees-cryptodirectory'
MAX_FILE = 16*1024*1024
MAX_TOTAL = 32*1024*1024
MAX_MANIFEST = 128*1024
MAX_PREFLIGHT = 3
MAX_VERIFY = 6
MAX_DISCOVERY_BLOCKS = 512
MAX_DISCOVERY_SECONDS = 180
MAX_DISCOVERY_BLOCK_SECONDS = 40

def sha(data):
    return hashlib.sha256(data).hexdigest()

class SameOrigin(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        a, b = urlsplit(req.full_url), urlsplit(newurl)
        if (a.scheme,a.netloc)!=(b.scheme,b.netloc):
            raise ValueError('Cross-origin release redirect refused')
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def fetch(url, limit=MAX_FILE):
    with build_opener(SameOrigin()).open(Request(url,headers={'User-Agent':'Bittrees-CryptoDirectory-Sync/1.0'}),timeout=40) as r:
        data = r.read(limit+1)
        if r.status!=200 or len(data)>limit:
            raise ValueError('Release response exceeds bounds')
        return data, r.headers

def manifest(raw):
    if len(raw)>MAX_MANIFEST:
        raise ValueError('Manifest exceeds bounds')
    value = json.loads(raw)
    if value.get('schemaVersion')!=1 or value.get('repository')!=REPO or value.get('projectId')!=PROJECT:
        raise ValueError('Unrecognized production release')
    if not re.fullmatch('[a-f0-9]{40}',value.get('sourceCommit','')):
        raise ValueError('Expected an exact source commit')
    if not re.fullmatch('dpl_[A-Za-z0-9]{10,80}',value.get('deploymentId','')):
        raise ValueError('Invalid deployment identity')
    if not re.fullmatch(r'bittrees-cryptodirectory-[a-z0-9]{6,40}-bittrees-tech\.vercel\.app',value.get('deploymentHost','')):
        raise ValueError('Unrecognized immutable deployment host')
    files = value.get('files',{})
    validate({'cid':'bafy'+'a'*50,'files':files})
    if len(files)>128 or 'release.json' in files or any(part.startswith('.') for p in files for part in p.split('/')):
        raise ValueError('Unsafe or excessive release paths')
    return value

def approved(value):
    """Accept only current main with successful CI and this Vercel deployment."""
    source = value['sourceCommit']
    if github('commits/main')['sha']!=source:
        raise ValueError('Production is not the current main release')
    ci_proof={}
    def checked(head,event):
        runs = github(f'actions/workflows/ci.yml/runs?head_sha={head}&event={event}&per_page=1')['workflow_runs']
        if not runs:
            return None
        r=runs[0]
        valid=r['head_sha']==head and r['event']==event and r['head_repository']['full_name']==REPO and r['conclusion']=='success' and r['status']=='completed'
        if valid:
            ci_proof.update(ciRunId=r['id'],ciAttempt=r['run_attempt'],ciHead=head,ciEvent=event)
        return valid
    verified = checked(source,'push')
    if verified is False:
        raise ValueError('Latest main CI is not successful')
    if verified is None:
        tree = github('git/commits/'+source)['tree']['sha']
        for pr in github('commits/'+source+'/pulls'):
            if pr.get('merged_at') and pr['merge_commit_sha']==source and pr['base']['ref']=='main' and pr['head']['repo'] and pr['head']['repo']['full_name']==REPO:
                head=pr['head']['sha']
                if checked(head,'pull_request') and github('git/commits/'+head)['tree']['sha']==tree:
                    verified=True
                    break
    if not verified:
        raise ValueError('No successful CI for the exact main source tree')
    statuses=github('commits/'+source+'/status')['statuses']
    # Multiple Vercel projects qualify their status contexts. A sibling cannot
    # approve this release; legacy success cannot override a qualified failure.
    status=next((s for s in statuses if s['context']==VERCEL_CONTEXT),None)
    if status is None:
        status=next((s for s in statuses if s['context']=='Vercel'),None)
    if not status or status['state']!='success' or status['target_url']!=VERCEL+value['deploymentId'][4:]:
        raise ValueError('Exact Vercel deployment has not passed')
    return {'sourceCommit':source,'deploymentId':value['deploymentId'],'vercelStatusId':status['id'],'checkedAt':int(time.time()),**ci_proof}

def ipfs(*args,timeout=40):
    return subprocess.check_output(IPFS+list(args),timeout=timeout,text=True).strip()

def pin(cid):
    data=json.loads(ipfs('pin','ls','--type=recursive','--enc=json',cid))
    if data.get('Keys',{}).get(cid,{}).get('Type')!='recursive':
        raise ValueError('Release must remain recursively pinned')

def file_check(base,cid,path,digest):
    data,_=fetch(f'{base}/ipfs/{cid}/{path}')
    if sha(data)!=digest:
        raise ValueError('Pinned release file differs: '+path)

def guard(root):
    if (root/'disabled').exists():
        return 'disabled'
    budget=Path('/var/lib/ipfs-budget/status.json')
    if budget.exists() and json.loads(budget.read_text()).get('managed_pause'):
        return 'ipfs-budget-paused'
    return None

def same_production(raw):
    if fetch(PRODUCTION+'/release.json',MAX_MANIFEST)[0]!=raw:
        raise ValueError('Production changed during release; do not publish stale content')

def announce(root,op,release):
    """Announce this pinned DAG with bounded work, retaining partial progress."""
    nodes=set(ipfs('refs','--recursive','--unique',release['cid']).splitlines())|{release['cid']}
    if len(nodes)>MAX_DISCOVERY_BLOCKS or any(not re.fullmatch('[b][a-z2-7]{20,120}',node) for node in nodes):
        raise ValueError('Invalid or excessive release discovery graph')
    identity={'cid':release['cid'],'manifestSHA256':release['artifactManifestSHA256']}
    path=op/'discovery.json'
    receipt=json.loads(path.read_text()) if path.exists() else dict(identity,provided={})
    if any(receipt.get(key)!=value for key,value in identity.items()) or not isinstance(receipt.get('provided'),dict) or not set(receipt['provided']).issubset(nodes):
        raise ValueError('Release discovery receipt identity changed')
    now=int(time.time())
    receipt['provided']={node:at for node,at in receipt['provided'].items() if isinstance(at,int) and now-86400<=at<=now+60}
    pending=sorted(nodes-set(receipt['provided']),key=lambda node:(not node.startswith('bafy'),node))
    deadline=time.monotonic()+MAX_DISCOVERY_SECONDS
    def provide(node):
        remaining=int(deadline-time.monotonic())
        if remaining<1 or guard(root):
            raise ValueError('Discovery deadline or seed pause reached')
        seconds=min(MAX_DISCOVERY_BLOCK_SECONDS,remaining)
        # Kubo 0.43's "provide once" only queues work. This compatibility
        # command also completes a synchronous DHT announcement per given CID.
        ipfs('routing','provide',f'--timeout={seconds}s',node,timeout=seconds+2)
        return int(time.time())
    failed=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        futures={pool.submit(provide,node):node for node in pending}
        for future in concurrent.futures.as_completed(futures):
            node=futures[future]
            try:receipt['provided'][node]=future.result()
            except Exception:failed.append(node)
            write(path,receipt)
    if failed:
        raise ValueError('Release discovery incomplete; failed announcements remain retryable')

def prepare(root,op,raw,value,journal):
    """Copy public production files checked against one approved manifest."""
    proof=approved(value)
    # Vercel can protect deployment URLs even when the production domain is
    # public. Keep credentials off the seed: use only the fixed public origin,
    # check each file's approved digest, and reject a changing release manifest.
    base=PRODUCTION
    same_production(raw)
    # Refresh durable evidence for resumed candidates as well as new imports.
    write(op/'approval.json',proof)
    candidate=op/'candidate.json'
    if candidate.exists():
        release=json.loads(candidate.read_text())
        if release['sourceCommit']!=value['sourceCommit'] or release['artifactManifestSHA256']!=sha(raw):
            raise ValueError('Staged candidate identity changed')
    else:
        if shutil.disk_usage(root).free<256*1024*1024:
            raise ValueError('Insufficient room for bounded artifact staging')
        site=op/'site'
        site.mkdir(mode=0o700,exist_ok=True)
        total=0
        for path,digest in value['files'].items():
            data,_=fetch(base+'/'+path)
            total+=len(data)
            if total>MAX_TOTAL or sha(data)!=digest:
                raise ValueError('Deployment bytes differ or exceed release bounds: '+path)
            target=site/path
            target.parent.mkdir(mode=0o700,parents=True,exist_ok=True)
            target.write_bytes(data)
        (site/'release.json').write_bytes(raw)
        same_production(raw)
        cid=ipfs('add','--recursive','--quieter','--cid-version=1','--raw-leaves=true','--pin=true',str(site),timeout=180)
        release={'cid':cid,'sourceCommit':value['sourceCommit'],'files':dict(value['files'],**{'release.json':sha(raw)}),
                 'artifactManifestSHA256':sha(raw),'deploymentId':value['deploymentId']}
        validate(release)
        write(candidate,release) # Persist pin identity before any announcement/retrieval failure.
    validate(release)
    if release['files']!=dict(value['files'],**{'release.json':sha(raw)}) or release.get('deploymentId')!=value['deploymentId']:
        raise ValueError('Candidate files do not match the approved artifact')
    pin(release['cid'])
    announce(root,op,release)
    for path,digest in release['files'].items():
        file_check('http://127.0.0.1:8080',release['cid'],path,digest)
        file_check('https://ipfs.nftfactory.org',release['cid'],path,digest)
        file_check('https://ipfs.filebase.io',release['cid'],path,digest)
    same_production(raw)
    journal.update(phase='verified',cid=release['cid'],verifiedAt=int(time.time()),preflightAttempts=0)
    write(op/'journal.json',journal)
    return release

def verify_public(raw,release):
    same_production(raw)
    def compare(item):
        path,digest=item
        route='/' if path=='index.html' else '/'+path
        for base in (PRODUCTION,ENS):
            if base==ENS and path=='robots.txt':
                continue # eth.limo supplies its own gateway policy.
            data,headers=fetch(base+route)
            if sha(data)!=digest:
                raise ValueError('Public content has not converged: '+base+route)
            if base==ENS and path=='index.html' and headers.get('X-Ipfs-Roots','').split(',')[0]!=release['cid']:
                raise ValueError('ENS gateway has not resolved the published CID')
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(compare,release['files'].items()))
    same_production(raw)
    return {'contentFilesMatched':len(release['files'])-1,'verifiedAt':int(time.time())}

def record(root,result):
    write(root/'latest-sync.json',dict(result,checkedAt=int(time.time()),invocationId=os.environ.get('INVOCATION_ID'),workerSHA256=sha(Path(__file__).read_bytes())))
    if result['status']=='held':
        write(root/'sync-exception.json',dict(result,checkedAt=int(time.time())))
    elif result['status'] in ('synchronized','synchronized-unchanged') and (root/'sync-exception.json').exists():
        previous=json.loads((root/'sync-exception.json').read_text())
        if previous.get('status')=='held':
            write(root/'sync-exception.json',dict(previous,status='resolved',resolvedAt=int(time.time())))
    return result

def run(root,publish=False):
    root.mkdir(parents=True,exist_ok=True,mode=0o700)
    with open(root/'staging.lock','a') as staging,open(root/'lock','a') as publishing:
        try:
            fcntl.flock(staging,fcntl.LOCK_EX|fcntl.LOCK_NB)
            fcntl.flock(publishing,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:
            return {'status':'already-running'}
        blocked=guard(root)
        if blocked:
            return record(root,{'status':blocked})
        raw,_=fetch(PRODUCTION+'/release.json',MAX_MANIFEST)
        value=manifest(raw)
        source=value['sourceCommit']
        summaryfile=root/'sync-state.json'
        summary=json.loads(summaryfile.read_text()) if summaryfile.exists() else {}
        active=summary.get('activeSourceCommit')
        if active and active!=source:
            prior=json.loads((root/'releases'/active/'journal.json').read_text())
            if prior['phase'] in ('attempt-reserved','publication-unconfirmed'):
                return record(root,{'status':'held','reason':'Earlier publication outcome requires reconciliation','sourceCommit':active})
        op=root/'releases'/source
        op.mkdir(parents=True,exist_ok=True,mode=0o700)
        path=op/'journal.json'
        journal=json.loads(path.read_text()) if path.exists() else {'phase':'new','sourceCommit':source,'manifestSHA256':sha(raw),'preflightAttempts':0,'verificationAttempts':0}
        if journal['manifestSHA256']!=sha(raw):
            return record(root,{'status':'held','reason':'Same approved source was rebuilt with different bytes; review required','sourceCommit':source})
        write(summaryfile,{'activeSourceCommit':source})
        journal.update(lastInvocationId=os.environ.get('INVOCATION_ID'),lastCheckAt=int(time.time()))
        if journal['phase']=='synced':
            public,headers=fetch(ENS+'/release.json',MAX_MANIFEST)
            if public==raw and headers.get('X-Ipfs-Roots','').split(',')[0]==journal['cid']:
                return record(root,{'status':'synchronized-unchanged','sourceCommit':source,'cid':journal['cid']})
            journal.update(phase='published',verificationAttempts=0)
        if journal['phase'] in ('new','verified','preflight-blocked'):
            if journal['preflightAttempts']>=MAX_PREFLIGHT:
                return record(root,{'status':'held','reason':'Preflight retry limit reached','sourceCommit':source})
            journal['preflightAttempts']+=1
            write(path,journal)
            try:
                release=prepare(root,op,raw,value,journal)
            except Exception as exc:
                journal.update(phase='preflight-blocked',error=(type(exc).__name__+': '+str(exc))[:500])
                write(path,journal)
                return record(root,{'status':'held' if journal['preflightAttempts']>=MAX_PREFLIGHT else 'preflight-retry','reason':journal['error'],'sourceCommit':source})
            journal['preflightAttempts']=0
            write(path,journal)
            if not publish:
                return record(root,{'status':'verified-dry-run','sourceCommit':source,'cid':release['cid']})
            same_production(raw)
            if github('commits/main')['sha']!=source or guard(root):
                return record(root,{'status':'held','reason':'Source or budget changed before publication','sourceCommit':source})
            keys=json.loads(ipfs('key','list','--enc=json'))
            if not any(k.get('Name')==KEY and k.get('Id')==NAME for k in keys['Keys']):
                raise ValueError('Unexpected existing IPNS key')
            statefile=root/'state.json'
            state=json.loads(statefile.read_text()) if statefile.exists() else {}
            if state.get('status') in ('attempt-reserved','publication-unconfirmed'):
                return record(root,{'status':'held','reason':'Existing publisher outcome requires reconciliation','sourceCommit':source})
            if state.get('publishedCid'):
                pin(state['publishedCid'])
            for name in ('state.json','candidate.json'):
                if (root/name).exists() and not (op/('previous-'+name)).exists():
                    (op/('previous-'+name)).write_bytes((root/name).read_bytes())
            # No weekly bypass/reset: owner replaced that release cadence with
            # one attempt per checked production source. Reserve durably first.
            journal.update(phase='attempt-reserved',lastAttemptAt=int(time.time()),previousCid=state.get('publishedCid'),publicationInvocationId=os.environ.get('INVOCATION_ID'))
            write(path,journal)
            state.update(lastAttemptAt=journal['lastAttemptAt'],attemptedCid=release['cid'],status='attempt-reserved',sourceCommit=source)
            write(root/'candidate.json',release)
            write(statefile,state)
            try:
                result=json.loads(ipfs('name','publish','--key='+KEY,'--lifetime=720h','--ttl=1m','--enc=json','--timeout=120s','/ipfs/'+release['cid'],timeout=130))
                if result['Name']!=NAME or result['Value']!='/ipfs/'+release['cid']:
                    raise ValueError('Unexpected publication result')
                journal.update(phase='published',publishedAt=int(time.time()))
                state.update(publishedCid=release['cid'],publishedAt=journal['publishedAt'],status='published')
                write(statefile,state)
                write(path,journal)
            except Exception as exc:
                journal.update(phase='publication-unconfirmed',error=type(exc).__name__)
                state.update(status='publication-unconfirmed')
                write(statefile,state)
                write(path,journal)
        release=json.loads((op/'candidate.json').read_text())
        if journal['verificationAttempts']>=MAX_VERIFY:
            return record(root,{'status':'held','reason':'Public convergence retry limit reached; reconcile without re-signing','sourceCommit':source,'cid':release['cid']})
        journal['verificationAttempts']+=1
        write(path,journal)
        try:
            verification=verify_public(raw,release)
        except Exception as exc:
            journal['lastVerificationError']=type(exc).__name__
            write(path,journal)
            return record(root,{'status':'held' if journal['verificationAttempts']>=MAX_VERIFY else 'awaiting-public-convergence','sourceCommit':source,'cid':release['cid'],'publicationPhase':journal['phase']})
        # A public full-site match reconciles a timeout without another signature.
        journal.update(phase='synced',**verification)
        statefile=root/'state.json'
        state=json.loads(statefile.read_text())
        state.update(status='published',publishedCid=release['cid'],sourceCommit=source,publishedAt=journal.get('publishedAt',journal.get('lastAttemptAt')),synchronizedAt=verification['verifiedAt'])
        write(statefile,state)
        # Commit the journal only after the shared publisher state is repaired.
        # A crash before this write leaves a resumable verification phase.
        write(path,journal)
        return record(root,{'status':'synchronized','sourceCommit':source,'cid':release['cid'],**verification})

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--state-dir',type=Path,required=True)
    parser.add_argument('--publish',action='store_true')
    args=parser.parse_args()
    os.umask(0o077)
    try:
        result=run(args.state_dir,args.publish)
    except Exception as exc:
        result=record(args.state_dir,{'status':'held','reason':type(exc).__name__})
    print(json.dumps(result))
    if result['status']=='held':
        raise SystemExit(1)
