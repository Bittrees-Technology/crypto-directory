#!/usr/bin/env python3
"""Bounded IPNS publisher. No Ethereum key or transaction capability."""
import argparse, fcntl, hashlib, json, os, re, subprocess, time
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import quote
WINDOW = 7 * 24 * 3600
KEY = 'cryptodirectory-weekly'
NAME = 'k51qzi5uqu5dj5gnbib6enjf4ae0qp0rr41izt3bo2o23vczesjhype374d5ox'
IPFS = ['/usr/local/bin/ipfs', '--api=/ip4/127.0.0.1/tcp/5001']

def write(path, value):
    tmp = path.with_suffix('.tmp')
    with open(tmp, 'w') as f:
        json.dump(value, f, indent=2); f.flush(); os.fsync(f.fileno())
    os.replace(tmp, path)

def validate(release):
    if not re.fullmatch(r'bafy[a-z2-7]{20,120}', release['cid']):
        raise ValueError('Expected CIDv1 dag-pb release')
    files = release['files']
    if not isinstance(files, dict) or not 1 <= len(files) <= 1000 or 'index.html' not in files:
        raise ValueError('Invalid release manifest')
    for path, digest in files.items():
        if path.startswith('/') or any(p in ('', '.', '..') for p in path.split('/')) or not re.fullmatch(r'[A-Za-z0-9_./-]+', path):
            raise ValueError('Unsafe file path')
        if not re.fullmatch('[a-f0-9]{64}', digest):
            raise ValueError('Invalid SHA256')

def eligible(state, now):
    return now >= state.get('lastAttemptAt', -WINDOW) + WINDOW

def check_file(base, cid, path, expected):
    url = f'{base}/ipfs/{cid}/{quote(path)}'
    try:
        with urlopen(Request(url, headers={'User-Agent':'Bittrees-CryptoDirectory-Publisher/1.0'}), timeout=35) as response:
            data = response.read(16 * 1024 * 1024 + 1)
    except Exception as exc:
        raise ValueError(f'Delivery check failed at {url}: {exc}') from exc
    if len(data) > 16 * 1024 * 1024 or hashlib.sha256(data).hexdigest() != expected:
        raise ValueError(f'File verification failed: {url}')

def run(root, publish=False):
    root.mkdir(parents=True, exist_ok=True)
    with open(root / 'lock', 'a') as lock:
        try: fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError: return {'status':'already-running'}
        statefile = root / 'state.json'
        state = json.loads(statefile.read_text()) if statefile.exists() else {}
        release = json.loads((root / 'candidate.json').read_text())
        validate(release)
        if (root / 'disabled').exists(): return {'status':'disabled'}
        budget = Path('/var/lib/ipfs-budget/status.json')
        if budget.exists() and json.loads(budget.read_text()).get('managed_pause'):
            return {'status':'ipfs-budget-paused'}
        cid = release['cid']
        if state.get('publishedCid') == cid: return {'status':'unchanged', 'cid':cid}
        if not eligible(state, int(time.time())): return {'status':'weekly-limit', 'nextAttemptAt':state['lastAttemptAt']+WINDOW}
        pin = json.loads(subprocess.check_output(IPFS + ['pin','ls','--type=recursive','--enc=json',cid], timeout=30))
        if pin.get('Keys',{}).get(cid,{}).get('Type') != 'recursive': raise ValueError('Release must be recursively pinned')
        for path, digest in release['files'].items():
            check_file('http://127.0.0.1:8080',cid,path,digest)
            check_file('https://ipfs.nftfactory.org',cid,path,digest)
        # A small cached file is not evidence that the full site is retrievable.
        check_file('https://gateway.pinata.cloud',cid,'index.html',release['files']['index.html'])
        if not publish: return {'status':'verified-dry-run','cid':cid}
        # Reserve before signing; crashes and failed/uncertain attempts consume the slot.
        state.update(lastAttemptAt=int(time.time()), attemptedCid=cid, status='attempt-reserved')
        write(statefile,state)
        try:
            result = json.loads(subprocess.check_output(IPFS + ['name','publish','--key='+KEY,'--lifetime=720h','--ttl=1h','--enc=json','--timeout=120s','/ipfs/'+cid],timeout=130))
            if result['Name'] != NAME or result['Value'] != '/ipfs/'+cid: raise ValueError('Unexpected publication response')
            state.update(publishedCid=cid,status='published',publishedAt=int(time.time()))
        except Exception as exc:
            state.update(status='publication-unconfirmed',error=type(exc).__name__)
            write(statefile,state)
            raise
        write(statefile,state)
        return state

if __name__ == '__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--state-dir',type=Path,required=True); parser.add_argument('--publish',action='store_true')
    args=parser.parse_args()
    try: result=run(args.state_dir,args.publish)
    except Exception as exc: result={'status':'blocked','error':str(exc)[:700]}
    write(args.state_dir/'latest-check.json',dict(result,checkedAt=int(time.time())))
    print(json.dumps(result))
    if result['status']=='blocked': raise SystemExit(1)
