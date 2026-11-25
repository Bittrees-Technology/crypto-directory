"""Real SQLite transaction tests, with isolated disposable fixture files only."""
import hashlib
import hmac
import json
import os
import tempfile
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch
from catalogue import Catalogue, Held, blob_sha, digest, encoded

KEY = '11' * 32
STORE = 'e38a1a2e-3602-4e3b-875b-ac80ce210c90'
ACTOR = '22' * 32
ENVELOPE = encoded({'version': 1, 'iv': 'fixture', 'tag': 'fixture', 'ciphertext': 'not-real-user-data'})
META = {'name': 'Fixture project', 'lead_category': 'Infrastructure', 'tags': ['test'], 'ecosystem': ['Ethereum'], 'description': 'An isolated listing for transactional validation.', 'primary_url': 'https://fixture.example/', 'product_url': 'n/a', 'founded': '2020', 'hq': 'Metaverse', 'token': 'n/a', 'twitter': 'n/a', 'verification_status': 'verified'}
def document(meta):
    return '---\n' + '\n'.join(k+': '+encoded(v) for k, v in meta.items()) + '\n---\nPreserved body.\n'

class Transactions(unittest.TestCase):
    def setUp(self):
        fd, path = tempfile.mkstemp(prefix='cd-runtime-', suffix='.sqlite', dir=os.environ.get('DIRECTORY_TEST_DIRECTORY'))
        os.close(fd)
        os.unlink(path)
        self.path = Path(path)
        self.addCleanup(self.remove_fixture)
        self.catalogue = Catalogue(path, STORE, KEY)
        raw = document(META)
        self.seed = [{'id': 'fixture.md', 'raw': raw, 'sha': blob_sha(raw)}]
        self.catalogue.bootstrap(self.seed, digest(encoded(self.seed)), 'a'*40, ENVELOPE)
        with self.catalogue.connect() as db:
            db.execute("UPDATE settings SET value='true' WHERE key='writer_enabled'")
    def remove_fixture(self):
        for suffix in ('', '-wal', '-shm'):
            Path(str(self.path)+suffix).unlink(missing_ok=True)
    def authority(self, cap='canReview', actions=None):
        with self.catalogue.connect() as db:
            now = self.catalogue.wall_clock(db)
        return {'actor': ACTOR, 'capability': cap, 'decision': {'checkedAt': now, 'expiresAt': now+5000, 'authoritative': True, 'enrolled': True, 'audience': 'cd.bittrees.org', 'request': {'project': 'crypto-directory', 'source': 'cd.bittrees.org', 'subjects': []}, 'actions': actions or ['role.reviewer']}}
    def call(self, method, args=None, authority=None, packet=None):
        with self.catalogue.connect() as db:
            now = self.catalogue.wall_clock(db)
        packet = packet or {'version': 1, 'storeId': STORE, 'requestId': str(uuid.uuid4()), 'issuedAt': now, 'method': method, 'args': args or {}, 'authorization': authority}
        raw = encoded(packet).encode()
        return self.catalogue.handle(raw, hmac.new(bytes.fromhex(KEY), raw, hashlib.sha256).hexdigest())
    def proposal(self):
        current = self.call('journal.read')
        raw = document({**META, 'description': 'A corrected description with supported official evidence.'})
        return {'operationId': str(uuid.uuid4()), 'id': 'fixture.md', 'raw': raw, 'expectedListingSha': self.seed[0]['sha'], 'expectedCatalogueRevision': 0, 'expectedJournalSha': current['sha'], 'envelope': ENVELOPE.replace('not-real-user-data', 'accepted-private-outcome'), 'requestDigest': '3'*64, 'contentHash': digest(raw), 'audit': {'collection': 'editRequests', 'recordId': str(uuid.uuid4()), 'reasonHash': '4'*64, 'reviewDigest': '5'*64}}
    def test_atomic_publication_and_read_only_receipt_reconciliation(self):
        args = self.proposal()
        result = self.call('catalogue.publish', args, self.authority())
        self.assertEqual(result['catalogueRevision'], 1)
        self.assertEqual(self.catalogue.public()['revision'], 1)
        self.assertEqual(self.call('listing.read', {'id': 'fixture.md'})['raw'], args['raw'])
        self.assertEqual(self.call('journal.read')['envelope'], args['envelope'])
        receipt = self.call('operation.read', {'operationId': args['operationId']})['receipt']
        self.assertEqual(receipt['contentHash'], args['contentHash'])
        self.assertEqual(self.call('catalogue.publish', args, self.authority())['catalogueRevision'], 1)
        self.assertEqual(self.catalogue.public()['revision'], 1)
        with self.assertRaises(Held):
            self.call('catalogue.publish', {**args, 'raw': document(META), 'contentHash': digest(document(META))}, self.authority())
    def test_failed_journal_cas_rolls_back_catalogue_and_receipt(self):
        args = self.proposal()
        with self.assertRaises(Held):
            self.call('catalogue.publish', {**args, 'expectedJournalSha': '0'*64}, self.authority())
        self.assertEqual(self.catalogue.public()['revision'], 0)
        self.assertEqual(self.call('listing.read', {'id': 'fixture.md'})['raw'], self.seed[0]['raw'])
        with self.assertRaises(Held) as held:
            self.call('operation.read', {'operationId': args['operationId']})
        self.assertEqual(held.exception.status, 404)
    def test_editor_and_unprivileged_actor_cannot_publish(self):
        args = self.proposal()
        for authority in (self.authority('canEdit', ['role.editor']), {'actor': ACTOR, 'capability': 'canSubmit'}, self.authority('canReview', ['role.editor'])):
            with self.assertRaises(Held):
                self.call('catalogue.publish', args, authority)
        self.assertEqual(self.catalogue.public()['revision'], 0)
    def test_expiry_after_lock_and_before_commit_rolls_back(self):
        args, authority = self.proposal(), self.authority()
        now = authority['decision']['checkedAt']
        # Initial read, guarded mutation, final guard: expiration is not renewed.
        with patch.object(self.catalogue, 'wall_clock', side_effect=[now, now, now+1, now+5000]):
            with self.assertRaises(Held):
                self.call('catalogue.publish', args, authority, packet={'version': 1, 'storeId': STORE, 'requestId': str(uuid.uuid4()), 'issuedAt': now, 'method': 'catalogue.publish', 'args': args, 'authorization': authority})
        self.assertEqual(self.catalogue.public()['revision'], 0)
    def test_concurrent_listing_or_catalogue_change_holds_exact_review(self):
        for field, value in [('expectedListingSha', '0'*40), ('expectedCatalogueRevision', 1)]:
            args = {**self.proposal(), field: value}
            with self.assertRaises(Held):
                self.call('catalogue.publish', args, self.authority())
        self.assertEqual(self.catalogue.public()['revision'], 0)
    def test_public_data_excludes_private_journal_audit_and_markdown_body(self):
        data = self.catalogue.public()
        self.assertNotIn('not-real-user-data', data['bytes'])
        self.assertNotIn('Preserved body', data['bytes'])
        self.assertEqual(digest(data['bytes']), data['datasetSha256'])
        self.assertEqual(set(data['projects'][0]), set(META) | {'id'})
    def test_replayed_transport_wrong_store_bad_signature_and_unsafe_links(self):
        with self.catalogue.connect() as db:
            now = self.catalogue.wall_clock(db)
        packet = {'version': 1, 'storeId': STORE, 'requestId': str(uuid.uuid4()), 'issuedAt': now, 'method': 'journal.read', 'args': {}}
        self.call('journal.read', packet=packet)
        with self.assertRaises(Held):
            self.call('journal.read', packet=packet)
        with self.assertRaises(Held):
            self.call('journal.read', packet={**packet, 'storeId': str(uuid.uuid4())})
        with self.assertRaises(Held):
            self.catalogue.handle(encoded(packet).encode(), '0'*64)
        args = self.proposal()
        args['raw'] = document({**META, 'primary_url': 'javascript:alert(1)'})
        args['contentHash'] = digest(args['raw'])
        with self.assertRaises(Held):
            self.call('catalogue.publish', args, self.authority())
    def test_paused_writer_preserves_all_native_requests(self):
        with self.catalogue.connect() as db:
            db.execute("UPDATE settings SET value='false' WHERE key='writer_enabled'")
        current = self.call('journal.read')
        with self.assertRaises(Held):
            self.call('journal.save', {'expectedSha': current['sha'], 'envelope': ENVELOPE}, {'actor': ACTOR, 'capability': 'canSubmit'})
        self.assertEqual(self.call('journal.read')['sha'], current['sha'])
    def test_commit_crossing_expiry_is_held_but_original_receipt_survives(self):
        args, authority = self.proposal(), self.authority()
        now = authority['decision']['checkedAt']
        with patch.object(self.catalogue, 'wall_clock', side_effect=[now, now, now+1, now+2, now+5000]):
            with self.assertRaises(Held) as held:
                self.call('catalogue.publish', args, authority, packet={'version': 1, 'storeId': STORE, 'requestId': str(uuid.uuid4()), 'issuedAt': now, 'method': 'catalogue.publish', 'args': args, 'authorization': authority})
        self.assertEqual(held.exception.status, 409)
        self.assertEqual(self.catalogue.public()['revision'], 1)
        self.assertEqual(self.call('operation.read', {'operationId': args['operationId']})['receipt']['contentHash'], args['contentHash'])
    def test_sqlite_backup_restores_wal_data_and_is_fenced(self):
        from manage import backup, verify
        args = self.proposal()
        self.call('catalogue.publish', args, self.authority())
        destination = Path(str(self.path)+'.backup')
        self.addCleanup(lambda: [Path(str(destination)+suffix).unlink(missing_ok=True) for suffix in ('', '-wal', '-shm')])
        result = backup(self.catalogue, destination)
        self.assertTrue(result['restorationVerified'])
        restored = Catalogue(destination, STORE, KEY)
        self.assertEqual(verify(restored)['datasetSha256'], verify(self.catalogue)['datasetSha256'])
        self.assertFalse(verify(restored)['writerEnabled'])
        self.assertEqual(self.call('operation.read', {'operationId': args['operationId']})['receipt']['contentHash'], args['contentHash'])
    def test_bootstrap_cannot_overwrite_or_reseed_existing_store(self):
        with self.assertRaises(Held):
            self.catalogue.bootstrap(self.seed, digest(encoded(self.seed)), 'a'*40, ENVELOPE)
        self.assertEqual(self.catalogue.public()['revision'], 0)

if __name__ == '__main__':
    unittest.main()
