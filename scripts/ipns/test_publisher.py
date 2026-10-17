import unittest
from publisher import validate, eligible, WINDOW
class PolicyTests(unittest.TestCase):
 def test_limit_and_backward_clock(self):
  s={'lastAttemptAt':1000}
  for t in (0,1000,1000+WINDOW-1): self.assertFalse(eligible(s,t))
  self.assertTrue(eligible(s,1000+WINDOW))
 def test_manifest_paths(self):
  for path in ('../index.html','/index.html','foo//bar','foo/../bar','x?y'):
   with self.assertRaises(ValueError): validate({'cid':'bafy'+'a'*50,'files':{'index.html':'a'*64,path:'a'*64}})
 def test_valid_manifest(self): validate({'cid':'bafy'+'a'*50,'files':{'index.html':'a'*64,'assets/styles.css':'b'*64}})
 def test_missing_homepage(self):
  with self.assertRaises(ValueError): validate({'cid':'bafy'+'a'*50,'files':{'robots.txt':'a'*64}})

class ExecutionTests(unittest.TestCase):
 def test_failed_publish_consumes_week_and_dry_run_does_not(self):
  import tempfile, json
  from pathlib import Path
  from unittest.mock import patch
  import publisher
  release={'cid':'bafy'+'a'*50,'files':{'index.html':'a'*64}}
  with tempfile.TemporaryDirectory() as d:
   root=Path(d); (root/'candidate.json').write_text(json.dumps(release))
   pin=json.dumps({'Keys':{release['cid']:{'Type':'recursive'}}}).encode()
   with patch.object(publisher,'check_file'), patch.object(publisher.subprocess,'check_output',return_value=pin):
    self.assertEqual(publisher.run(root)['status'],'verified-dry-run')
    self.assertFalse((root/'state.json').exists())
   with patch.object(publisher,'check_file'), patch.object(publisher.subprocess,'check_output',side_effect=[pin,TimeoutError()]):
    with self.assertRaises(TimeoutError): publisher.run(root,True)
   state=json.loads((root/'state.json').read_text())
   self.assertEqual(state['status'],'publication-unconfirmed')
   self.assertEqual(publisher.run(root,True)['status'],'weekly-limit')
 def test_failed_delivery_cannot_publish(self):
  import tempfile,json
  from pathlib import Path
  from unittest.mock import patch
  import publisher
  cid='bafy'+'a'*50
  with tempfile.TemporaryDirectory() as d:
   root=Path(d); (root/'candidate.json').write_text(json.dumps({'cid':cid,'files':{'index.html':'a'*64}}))
   with patch.object(publisher.subprocess,'check_output',return_value=json.dumps({'Keys':{cid:{'Type':'recursive'}}}).encode()) as command, patch.object(publisher,'check_file',side_effect=ValueError('hash mismatch')):
    with self.assertRaises(ValueError): publisher.run(root,True)
    self.assertEqual(command.call_count,1)
    self.assertFalse((root/'state.json').exists())

if __name__=='__main__': unittest.main()
