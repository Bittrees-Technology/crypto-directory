import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from collections import Counter
import sync

SOURCE='a'*40
DEPLOYMENT='dpl_1234567890abcdef'
CID='bafy'+'a'*50
PAGE=b'<html>approved site</html>'

def release():
    return {'schemaVersion':1,'repository':sync.REPO,'sourceCommit':SOURCE,'projectId':sync.PROJECT,
            'deploymentId':DEPLOYMENT,'deploymentHost':'bittrees-cryptodirectory-123456789-bittrees-tech.vercel.app',
            'files':{'index.html':hashlib.sha256(PAGE).hexdigest(),'robots.txt':hashlib.sha256(b'policy').hexdigest()}}

def ci(conclusion='success'):
    return {'workflow_runs':[{'id':123,'run_attempt':1,'head_sha':SOURCE,'event':'push','head_repository':{'full_name':sync.REPO},'conclusion':conclusion,'status':'completed'}]}

def status(state='success',id=DEPLOYMENT,context='Vercel'):
    return {'statuses':[{'context':context,'state':state,'target_url':sync.VERCEL+id[4:],'id':7}]}

class BoundaryTests(unittest.TestCase):
    def test_manifest_cannot_select_other_sources_hosts_projects_or_paths(self):
        for field,value in [('repository','other/repo'),('sourceCommit','main'),('projectId','other'),('deploymentHost','localhost'),('deploymentHost','bittrees-cryptodirectory-git-main-bittrees-tech.vercel.app'),('deploymentId','bad')]:
            x=release();x[field]=value
            with self.subTest(field=field,value=value),self.assertRaises(ValueError):sync.manifest(json.dumps(x).encode())
        for path in ['../secret','/index.html','.env','assets/.key','release.json','x?secret']:
            x=release();x['files'][path]='b'*64
            with self.subTest(path=path),self.assertRaises(ValueError):sync.manifest(json.dumps(x).encode())

    def test_latest_failed_ci_cannot_fall_back_to_an_older_success_or_pr(self):
        with patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci('failure')]) as github:
            with self.assertRaises(ValueError):sync.approved(release())
            self.assertEqual(github.call_count,2)

    def test_exact_vercel_deployment_must_pass(self):
        for vercel in [status('pending'),status(id='dpl_othertarget12345'),{'statuses':[]}]:
            with patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci(),vercel]),self.assertRaises(ValueError):sync.approved(release())
        with patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci(),status()]):self.assertEqual(sync.approved(release())['deploymentId'],DEPLOYMENT)

    def test_superseded_main_cannot_publish(self):
        with patch.object(sync,'github',return_value={'sha':'b'*40}),self.assertRaises(ValueError):sync.approved(release())

    def test_qualified_directory_status_selects_its_own_receipt(self):
        directory=status(context=sync.VERCEL_CONTEXT)['statuses'][0]
        directory['id']=42
        sibling=status(context='Vercel – bittrees-surf')['statuses'][0]
        sibling['target_url']='https://vercel.com/bittrees-tech/bittrees-surf/1234567890abcdef'
        stale=status(id='dpl_previousrelease')['statuses'][0]
        for records in ([sibling,stale,directory],[directory,stale,sibling]):
            with self.subTest(records=records),patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci(),{'statuses':records}]):
                self.assertEqual(sync.approved(release())['vercelStatusId'],42)

    def test_other_project_context_cannot_authorize_even_with_directory_url(self):
        for context in ('Vercel – bittrees-surf','Vercel – unknown-project'):
            with self.subTest(context=context),patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci(),status(context=context)]),self.assertRaises(ValueError):
                sync.approved(release())

    def test_qualified_failure_cannot_fall_back_to_legacy_success(self):
        for rejected in (status('pending',context=sync.VERCEL_CONTEXT),status('error',context=sync.VERCEL_CONTEXT),status('failure',context=sync.VERCEL_CONTEXT),status(id='dpl_wrongdeployment',context=sync.VERCEL_CONTEXT)):
            for records in (rejected['statuses']+status()['statuses'],status()['statuses']+rejected['statuses']):
                with self.subTest(records=records),patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci(),{'statuses':records}]),self.assertRaises(ValueError):
                    sync.approved(release())

    def test_qualified_status_must_match_fixed_team_project_and_deployment(self):
        for target in ('https://vercel.com/other-team/bittrees-cryptodirectory/1234567890abcdef','https://vercel.com/bittrees-tech/bittrees-surf/1234567890abcdef',sync.VERCEL+'otherdeployment'):
            record=status(context=sync.VERCEL_CONTEXT)
            record['statuses'][0]['target_url']=target
            with self.subTest(target=target),patch.object(sync,'github',side_effect=[{'sha':SOURCE},ci(),record]),self.assertRaises(ValueError):
                sync.approved(release())

    def test_identical_merged_tree_is_required_when_push_ci_did_not_run(self):
        head='b'*40
        pr={'merged_at':'now','merge_commit_sha':SOURCE,'base':{'ref':'main'},'head':{'sha':head,'repo':{'full_name':sync.REPO}}}
        checked=ci();checked['workflow_runs'][0].update(head_sha=head,event='pull_request')
        for tree,accepted in [('tree',True),('different',False)]:
            replies=[{'sha':SOURCE},{'workflow_runs':[]},{'tree':{'sha':'tree'}},[pr],checked,{'tree':{'sha':tree}},status()]
            with patch.object(sync,'github',side_effect=replies):
                if accepted:self.assertEqual(sync.approved(release())['sourceCommit'],SOURCE)
                else:
                    with self.assertRaises(ValueError):sync.approved(release())

    def test_cross_origin_redirect_refused(self):
        from urllib.request import Request
        with self.assertRaises(ValueError):sync.SameOrigin().redirect_request(Request(sync.PRODUCTION+'/file'),None,302,'',{},'https://other.example/file')

class OperationTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        self.value=release();self.raw=json.dumps(self.value).encode()
        self.candidate={'cid':CID,'sourceCommit':SOURCE,'files':dict(self.value['files'],**{'release.json':sync.sha(self.raw)})}
    def tearDown(self):self.temp.cleanup()
    def prepared(self,root,op,raw,value,journal):
        sync.write(op/'candidate.json',self.candidate)
        journal.update(phase='verified',cid=CID)
        sync.write(op/'journal.json',journal)
        return self.candidate
    def ipfs(self,*args,**kwargs):
        if args[:2]==('key','list'):return json.dumps({'Keys':[{'Name':sync.KEY,'Id':sync.NAME}]})
        if args[:2]==('name','publish'):raise TimeoutError('uncertain signing result')
        raise AssertionError(args)
    def test_failed_signature_is_reserved_once_and_reconciled_without_replay(self):
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'prepare',side_effect=self.prepared),patch.object(sync,'github',return_value={'sha':SOURCE}),patch.object(sync,'ipfs',side_effect=self.ipfs) as command,patch.object(sync,'verify_public',side_effect=ValueError('cache')):
            first=sync.run(self.root,True)
            self.assertEqual(first['status'],'awaiting-public-convergence')
            self.assertEqual(json.loads((self.root/'state.json').read_text())['status'],'publication-unconfirmed')
            sync.run(self.root,True)
            self.assertEqual(sum(c.args[:2]==('name','publish') for c in command.call_args_list),1)
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs') as command,patch.object(sync,'verify_public',return_value={'verifiedAt':100,'contentFilesMatched':2}):
            self.assertEqual(sync.run(self.root,True)['status'],'synchronized')
            command.assert_not_called()

    def test_dry_run_and_delivery_failure_cannot_sign(self):
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'prepare',side_effect=self.prepared),patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root)['status'],'verified-dry-run')
            command.assert_not_called();self.assertFalse((self.root/'state.json').exists())
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'prepare',side_effect=ValueError('bad hash')),patch.object(sync,'ipfs') as command:
            for _ in range(3):last=sync.run(self.root,True)
            self.assertEqual(last['status'],'held');command.assert_not_called()

    def test_successful_dry_runs_never_consume_failure_budget(self):
        def command(*args,**kwargs):
            if args[:2]==('key','list'):return json.dumps({'Keys':[{'Name':sync.KEY,'Id':sync.NAME}]})
            if args[:2]==('name','publish'):return json.dumps({'Name':sync.NAME,'Value':'/ipfs/'+CID})
            raise AssertionError(args)
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'prepare',side_effect=self.prepared),patch.object(sync,'github',return_value={'sha':SOURCE}),patch.object(sync,'ipfs',side_effect=command) as calls,patch.object(sync,'verify_public',return_value={'verifiedAt':100,'contentFilesMatched':2}):
            for _ in range(5):self.assertEqual(sync.run(self.root)['status'],'verified-dry-run')
            self.assertEqual(sync.run(self.root,True)['status'],'synchronized')
            self.assertEqual(sum(c.args[:2]==('name','publish') for c in calls.call_args_list),1)

    def test_crash_while_repairing_state_keeps_reconciliation_resumable(self):
        op=self.root/'releases'/SOURCE;op.mkdir(parents=True)
        sync.write(op/'candidate.json',self.candidate)
        sync.write(op/'journal.json',{'phase':'publication-unconfirmed','sourceCommit':SOURCE,'manifestSHA256':sync.sha(self.raw),'cid':CID,'verificationAttempts':0,'lastAttemptAt':10})
        sync.write(self.root/'state.json',{'status':'publication-unconfirmed','attemptedCid':CID})
        real_write=sync.write
        def crash(path,value):
            if path==self.root/'state.json':raise OSError('interrupted state repair')
            return real_write(path,value)
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'verify_public',return_value={'verifiedAt':100,'contentFilesMatched':2}),patch.object(sync,'write',side_effect=crash),patch.object(sync,'ipfs') as command:
            with self.assertRaises(OSError):sync.run(self.root,True)
            self.assertEqual(json.loads((op/'journal.json').read_text())['phase'],'publication-unconfirmed')
            command.assert_not_called()
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'verify_public',return_value={'verifiedAt':100,'contentFilesMatched':2}),patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'synchronized')
            self.assertEqual(json.loads((self.root/'state.json').read_text())['status'],'published')
            command.assert_not_called()

    def test_changed_bytes_for_same_source_hold_without_signing(self):
        op=self.root/'releases'/SOURCE;op.mkdir(parents=True)
        sync.write(op/'journal.json',{'phase':'synced','sourceCommit':SOURCE,'manifestSHA256':'wrong','cid':CID})
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'held');command.assert_not_called()

    def test_tampered_download_is_never_pinned(self):
        op=self.root/'release';op.mkdir()
        def fetch(url,limit=sync.MAX_FILE):
            return (self.raw,{}) if url.endswith('release.json') else (b'tampered',{})
        with patch.object(sync,'approved',return_value={}),patch.object(sync,'fetch',side_effect=fetch),patch.object(sync,'ipfs') as command,self.assertRaises(ValueError):
            sync.prepare(self.root,op,self.raw,self.value,{'phase':'new'})
        command.assert_not_called()

    def test_public_production_copy_needs_no_access_to_protected_deployment(self):
        op=self.root/'release';op.mkdir()
        def fetch(url,limit=sync.MAX_FILE):
            if not url.startswith(sync.PRODUCTION+'/'):
                raise ValueError('Protected deployment redirects to sign-in')
            if url.endswith('/release.json'):return self.raw,{}
            return (b'policy' if url.endswith('/robots.txt') else PAGE),{}
        def ipfs(*args,**kwargs):
            if args[0]=='add':return CID
            return ''
        with patch.object(sync,'approved',return_value={}),patch.object(sync,'fetch',side_effect=fetch),patch.object(sync,'ipfs',side_effect=ipfs),patch.object(sync,'pin'),patch.object(sync,'file_check'):
            candidate=sync.prepare(self.root,op,self.raw,self.value,{'phase':'new'})
        self.assertEqual(candidate['cid'],CID)
        self.assertEqual(candidate['files']['index.html'],sync.sha(PAGE))
        self.assertEqual((op/'site'/'release.json').read_bytes(),self.raw)

    def test_production_change_during_copy_is_never_pinned(self):
        op=self.root/'release';op.mkdir()
        manifests=iter([self.raw,b'changed release'])
        def fetch(url,limit=sync.MAX_FILE):
            if url.endswith('/release.json'):return next(manifests),{}
            return (b'policy' if url.endswith('/robots.txt') else PAGE),{}
        with patch.object(sync,'approved',return_value={}),patch.object(sync,'fetch',side_effect=fetch),patch.object(sync,'ipfs') as command,self.assertRaisesRegex(ValueError,'Production changed'):
            sync.prepare(self.root,op,self.raw,self.value,{'phase':'new'})
        command.assert_not_called()

    def test_tampered_candidate_cannot_omit_approved_files(self):
        op=self.root/'release';op.mkdir()
        bad=dict(self.candidate,artifactManifestSHA256=sync.sha(self.raw),deploymentId=DEPLOYMENT,files={'index.html':sync.sha(PAGE)})
        sync.write(op/'candidate.json',bad)
        with patch.object(sync,'approved',return_value={}),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs') as command,self.assertRaises(ValueError):
            sync.prepare(self.root,op,self.raw,self.value,{'phase':'new'})
        command.assert_not_called()

    def test_resumed_candidate_restores_approval_proof_before_publication(self):
        op=self.root/'release';op.mkdir()
        candidate=dict(self.candidate,artifactManifestSHA256=sync.sha(self.raw),deploymentId=DEPLOYMENT)
        sync.write(op/'candidate.json',candidate)
        proof={'sourceCommit':SOURCE,'ciRunId':123,'deploymentId':DEPLOYMENT}
        with patch.object(sync,'approved',return_value=proof),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs',return_value=''),patch.object(sync,'pin'),patch.object(sync,'file_check'):
            sync.prepare(self.root,op,self.raw,self.value,{'phase':'new'})
        self.assertEqual(json.loads((op/'approval.json').read_text()),proof)

    def test_independent_manifest_failure_blocks_signing_even_when_homepage_passes(self):
        def fetch(url,limit=sync.MAX_FILE):
            if url.endswith('/release.json'):return self.raw,{}
            return (b'policy' if url.endswith('/robots.txt') else PAGE),{}
        def ipfs(*args,**kwargs):
            if args[0]=='add':return CID
            if args[:2]==('key','list'):return json.dumps({'Keys':[{'Name':sync.KEY,'Id':sync.NAME}]})
            if args[:2]==('name','publish'):return json.dumps({'Name':sync.NAME,'Value':'/ipfs/'+CID})
            return ''
        def delivery(base,cid,path,digest):
            if base=='https://ipfs.filebase.io' and path=='release.json':raise ValueError('New manifest not independently retrievable')
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'approved',return_value={}),patch.object(sync,'github',return_value={'sha':SOURCE}),patch.object(sync,'fetch',side_effect=fetch),patch.object(sync,'ipfs',side_effect=ipfs) as commands,patch.object(sync,'pin'),patch.object(sync,'file_check',side_effect=delivery),patch.object(sync,'verify_public',return_value={'contentFilesMatched':2,'verifiedAt':100}):
            self.assertEqual(sync.run(self.root,True)['status'],'preflight-retry')
            self.assertFalse(any(call.args[:2]==('name','publish') for call in commands.call_args_list))
            self.assertFalse((self.root/'state.json').exists())

    def test_uncertain_previous_release_blocks_a_new_source(self):
        active='b'*40;op=self.root/'releases'/active;op.mkdir(parents=True)
        sync.write(self.root/'sync-state.json',{'activeSourceCommit':active})
        sync.write(op/'journal.json',{'phase':'publication-unconfirmed'})
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'held');command.assert_not_called()

    def test_unchanged_synced_source_uses_only_two_small_manifest_reads(self):
        op=self.root/'releases'/SOURCE;op.mkdir(parents=True)
        sync.write(op/'journal.json',{'phase':'synced','sourceCommit':SOURCE,'manifestSHA256':sync.sha(self.raw),'cid':CID})
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{'X-Ipfs-Roots':CID+',bafychild'})) as fetch,patch.object(sync,'github') as github,patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'synchronized-unchanged')
            self.assertEqual(fetch.call_count,2);github.assert_not_called();command.assert_not_called()

    def test_copied_manifest_under_another_cid_is_never_marked_healthy(self):
        op=self.root/'releases'/SOURCE;op.mkdir(parents=True)
        sync.write(op/'candidate.json',self.candidate)
        sync.write(op/'journal.json',{'phase':'synced','sourceCommit':SOURCE,'manifestSHA256':sync.sha(self.raw),'cid':CID,'verificationAttempts':0})
        sync.write(self.root/'state.json',{'status':'published','publishedCid':CID})
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{'X-Ipfs-Roots':'bafywrong'})),patch.object(sync,'verify_public',side_effect=ValueError('root differs')),patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'awaiting-public-convergence')
            command.assert_not_called()

    def test_public_match_checks_both_domains_and_gateway_owned_robots_exception(self):
        def fetch(url,limit=sync.MAX_FILE):
            if url.endswith('/release.json'):return self.raw,{}
            if url.endswith('/robots.txt'):return b'policy',{}
            return PAGE,{'X-Ipfs-Roots':CID}
        with patch.object(sync,'fetch',side_effect=fetch) as request:
            self.assertEqual(sync.verify_public(self.raw,self.candidate)['contentFilesMatched'],2)
            self.assertTrue(any(c.args[0]==sync.ENS+'/' for c in request.call_args_list))
        def wrong(url,limit=sync.MAX_FILE):return (b'wrong',{}) if url==sync.ENS+'/' else fetch(url,limit)
        with patch.object(sync,'fetch',side_effect=wrong),self.assertRaises(ValueError):sync.verify_public(self.raw,self.candidate)

    def test_paused_and_concurrent_workers_do_no_network_work(self):
        with patch.object(sync,'guard',return_value='ipfs-budget-paused'),patch.object(sync,'fetch') as fetch:
            self.assertEqual(sync.run(self.root,True)['status'],'ipfs-budget-paused');fetch.assert_not_called()
        import fcntl
        with open(self.root/'lock','a') as lock,patch.object(sync,'fetch') as fetch:
            fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
            self.assertEqual(sync.run(self.root,True)['status'],'already-running');fetch.assert_not_called()

class DiscoveryTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        self.op=self.root/'release';self.op.mkdir()
        self.release={'cid':CID,'artifactManifestSHA256':'c'*64}
        self.child='bafk'+'b'*50
    def tearDown(self):self.temp.cleanup()

    def test_direct_announcements_deduplicate_and_resume_fresh_receipts(self):
        calls=[]
        def ipfs(*args,**kwargs):
            calls.append((args,kwargs))
            return '\n'.join([self.child,self.child,CID]) if args[0]=='refs' else ''
        with patch.object(sync,'ipfs',side_effect=ipfs),patch.object(sync,'guard',return_value=None):
            sync.announce(self.root,self.op,self.release)
            sync.announce(self.root,self.op,self.release)
        announcements=[(a,k) for a,k in calls if a[:2]==('routing','provide')]
        self.assertEqual(Counter(a[-1] for a,k in announcements),Counter([CID,self.child]))
        self.assertTrue(all(1<=k['timeout']<=22 for a,k in announcements))
        self.assertFalse(any(a[:2]==('name','publish') for a,k in calls))

    def test_partial_failure_preserves_progress_and_retries_only_missing_record(self):
        calls=Counter()
        def ipfs(*args,**kwargs):
            if args[0]=='refs':return self.child
            node=args[-1];calls[node]+=1
            if node==self.child and calls[node]==1:raise subprocess.TimeoutExpired('provide',20)
            return ''
        with patch.object(sync,'ipfs',side_effect=ipfs),patch.object(sync,'guard',return_value=None):
            with self.assertRaises(ValueError):sync.announce(self.root,self.op,self.release)
            self.assertEqual(set(json.loads((self.op/'discovery.json').read_text())['provided']),{CID})
            sync.announce(self.root,self.op,self.release)
        self.assertEqual(calls,Counter({CID:1,self.child:2}))

    def test_malformed_or_excessive_graph_is_rejected_before_announcements(self):
        for refs in ['--untrusted-option','\n'.join('bafy'+'a'*30+format(i,'b').replace('0','a').replace('1','b') for i in range(1,600))]:
            with patch.object(sync,'ipfs',return_value=refs) as commands,self.assertRaises(ValueError):sync.announce(self.root,self.op,self.release)
            self.assertEqual(commands.call_count,1)

    def test_stale_receipts_refresh_but_changed_identity_cannot_skip_discovery(self):
        receipt={'cid':CID,'manifestSHA256':'c'*64,'provided':{CID:1}}
        sync.write(self.op/'discovery.json',receipt)
        with patch.object(sync,'ipfs',return_value='') as commands,patch.object(sync,'guard',return_value=None):
            sync.announce(self.root,self.op,self.release)
            self.assertEqual(sum(call.args[:2]==('routing','provide') for call in commands.call_args_list),1)
        receipt['cid']='bafy'+'d'*50;sync.write(self.op/'discovery.json',receipt)
        with patch.object(sync,'ipfs',return_value='') as commands,self.assertRaises(ValueError):sync.announce(self.root,self.op,self.release)
        self.assertEqual(commands.call_count,1)

    def test_seed_pause_and_deadline_prevent_network_announcements(self):
        for patches in [(patch.object(sync,'guard',return_value='ipfs-budget-paused'),),(patch.object(sync,'guard',return_value=None),patch.object(sync,'MAX_DISCOVERY_SECONDS',0))]:
            from contextlib import ExitStack
            with ExitStack() as stack:
                for context in patches:stack.enter_context(context)
                commands=stack.enter_context(patch.object(sync,'ipfs',return_value=''))
                with self.assertRaises(ValueError):sync.announce(self.root,self.op,self.release)
                self.assertEqual(commands.call_count,1)

class BuildManifestTests(unittest.TestCase):
    def test_build_manifest_hashes_real_files_excludes_secrets_and_rejects_symlinks(self):
        helper=(Path(__file__).resolve().parents[1]/'lib/release-manifest.mjs').as_uri()
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);site=root/'site';site.mkdir();(site/'index.html').write_bytes(PAGE)
            script=f"import {{writeReleaseManifest}} from {json.dumps(helper)}; await writeReleaseManifest({json.dumps(d)},{json.dumps(str(site))},{{VERCEL_GIT_COMMIT_SHA:'{SOURCE}',SECRET:'do-not-publish'}});"
            subprocess.run(['node','--input-type=module','-e',script],check=True,capture_output=True)
            raw=(site/'release.json').read_text();m=json.loads(raw)
            self.assertEqual(m['files'],{'index.html':sync.sha(PAGE)});self.assertNotIn('do-not-publish',raw)
            (site/'evil').symlink_to(site/'index.html')
            self.assertNotEqual(subprocess.run(['node','--input-type=module','-e',script],capture_output=True).returncode,0)

if __name__=='__main__':unittest.main()
