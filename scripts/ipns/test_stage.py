import tempfile, unittest
from pathlib import Path
from unittest.mock import patch
import stage
class StageTests(unittest.TestCase):
 def test_unchecked_main_cannot_build_or_pin(self):
  with tempfile.TemporaryDirectory() as d, patch.object(stage,'github',side_effect=[{'sha':'a'*40},{'workflow_runs':[]},{'tree':{'sha':'tree'}},[]]), patch.object(stage.subprocess,'run') as run:
   with self.assertRaises(ValueError): stage.stage(Path(d))
   run.assert_not_called()
 def test_disabled_does_not_fetch_or_build(self):
  with tempfile.TemporaryDirectory() as d, patch.object(stage,'github') as github:
   root=Path(d); (root/'disabled').touch()
   self.assertEqual(stage.stage(root)['status'],'disabled');github.assert_not_called()
 def test_pr_check_does_not_count_as_main_ci(self):
  run={'head_sha':'a'*40,'event':'pull_request','head_repository':{'full_name':stage.REPO}}
  with tempfile.TemporaryDirectory() as d, patch.object(stage,'github',side_effect=[{'sha':'a'*40},{'workflow_runs':[run]},{'tree':{'sha':'tree'}},[]]):
   with self.assertRaises(ValueError): stage.stage(Path(d))
 def test_merged_pr_requires_identical_tree(self):
  import json
  sha='a'*40; head='b'*40
  run={'head_sha':head,'event':'pull_request','head_repository':{'full_name':stage.REPO}}
  pr={'merged_at':'2026-10-17','merge_commit_sha':sha,'base':{'ref':'main'},'head':{'sha':head,'repo':{'full_name':stage.REPO}}}
  for tree, accepted in [('same',True),('different',False)]:
   responses=[{'sha':sha},{'workflow_runs':[run]},{'tree':{'sha':'same'}},[pr],{'tree':{'sha':tree}}]
   with tempfile.TemporaryDirectory() as d, patch.object(stage,'github',side_effect=responses):
    root=Path(d);(root/'candidate.json').write_text(json.dumps({'sourceCommit':sha}))
    if accepted: self.assertEqual(stage.stage(root)['status'],'already-staged')
    else:
     with self.assertRaises(ValueError):stage.stage(root)
if __name__=='__main__': unittest.main()
