import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
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
    return {'workflow_runs':[{'head_sha':SOURCE,'event':'push','head_repository':{'full_name':sync.REPO},'conclusion':conclusion,'status':'completed'}]}

def status(state='success',id=DEPLOYMENT):
    return {'statuses':[{'context':'Vercel','state':state,'target_url':sync.VERCEL+id[4:],'id':7}]}

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

    def test_tampered_candidate_cannot_omit_approved_files(self):
        op=self.root/'release';op.mkdir()
        bad=dict(self.candidate,artifactManifestSHA256=sync.sha(self.raw),deploymentId=DEPLOYMENT,files={'index.html':sync.sha(PAGE)})
        sync.write(op/'candidate.json',bad)
        with patch.object(sync,'approved',return_value={}),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs') as command,self.assertRaises(ValueError):
            sync.prepare(self.root,op,self.raw,self.value,{'phase':'new'})
        command.assert_not_called()

    def test_uncertain_previous_release_blocks_a_new_source(self):
        active='b'*40;op=self.root/'releases'/active;op.mkdir(parents=True)
        sync.write(self.root/'sync-state.json',{'activeSourceCommit':active})
        sync.write(op/'journal.json',{'phase':'publication-unconfirmed'})
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})),patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'held');command.assert_not_called()

    def test_unchanged_synced_source_uses_only_two_small_manifest_reads(self):
        op=self.root/'releases'/SOURCE;op.mkdir(parents=True)
        sync.write(op/'journal.json',{'phase':'synced','sourceCommit':SOURCE,'manifestSHA256':sync.sha(self.raw),'cid':CID})
        with patch.object(sync,'guard',return_value=None),patch.object(sync,'fetch',return_value=(self.raw,{})) as fetch,patch.object(sync,'github') as github,patch.object(sync,'ipfs') as command:
            self.assertEqual(sync.run(self.root,True)['status'],'synchronized-unchanged')
            self.assertEqual(fetch.call_count,2);github.assert_not_called();command.assert_not_called()

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
