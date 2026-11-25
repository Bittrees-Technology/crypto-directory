"""CryptoDirectory's isolated data origin. Python/SQLite only; no outbound calls.

The application authenticates native users and verifies Roles. This origin trusts
only its separately keyed source application, fences that exact store, and checks
the source's original authority interval at the transactional mutation. It does
not accept browser identities, SQL, filesystem paths or executable instructions.
"""
import hashlib
import hmac
import json
import os
import re
import sqlite3
import time
import uuid
from pathlib import Path
from urllib.parse import urlsplit

PUBLIC_FIELDS = ('name', 'lead_category', 'tags', 'ecosystem', 'description',
                 'primary_url', 'product_url', 'founded', 'hq', 'token', 'token_url',
                 'twitter', 'verification_status')
STATUSES = ('verified', 'needs_update', 'pending_audit', 'rejected')
HEX64 = re.compile(r'^[a-f0-9]{64}$')
HEX40 = re.compile(r'^[a-f0-9]{40}$')
IDENT = re.compile(r'^[-a-z0-9]{1,120}\.md$')
MAX_BODY = 2 * 1024 * 1024


class Held(Exception):
    def __init__(self, message, status=409):
        super().__init__(message)
        self.status = status


def encoded(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def blob_sha(raw):
    data = raw.encode()
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def metadata(raw):
    if not isinstance(raw, str) or len(raw.encode()) > 65536 or not raw.startswith('---\n'):
        raise Held('Invalid listing document.', 400)
    header = re.match(r'^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)', raw)
    if header is None:
        raise Held('Invalid listing document.', 400)
    result = {}
    for line in header.group(1).splitlines():
        if not line.strip():
            continue
        key, sep, value = line.partition(':')
        if not sep or key in result:
            raise Held('Invalid listing fields.', 400)
        value = value.strip()
        try:
            result[key] = json.loads(value)
        except ValueError:
            result[key] = [x.strip() for x in value[1:-1].split(',') if x.strip()] if value.startswith('[') and value.endswith(']') else value
    if result.get('verification_status') not in STATUSES or any(k not in result for k in PUBLIC_FIELDS if k != 'token_url'):
        raise Held('Invalid listing status or fields.', 400)
    for key in PUBLIC_FIELDS:
        if key in ('tags', 'ecosystem'):
            if not isinstance(result[key], list) or len(result[key]) > 64 or not all(isinstance(x, str) and len(x) <= 160 for x in result[key]):
                raise Held('Invalid listing labels.', 400)
        elif key in result and not isinstance(result[key], (str, int)):
            raise Held('Invalid listing text.', 400)
    for key in ('primary_url', 'product_url', 'twitter', 'token_url'):
        value = result.get(key)
        if value in (None, '', 'n/a') and key != 'primary_url':
            continue
        try:
            link = urlsplit(value)
            if link.scheme not in ('http', 'https') or not link.hostname or link.username or link.password or re.search(r'[\x00-\x20\x7f]', value):
                raise ValueError()
        except (ValueError, TypeError):
            raise Held('Unsafe listing link.', 400)
    return result


def uuid_value(value):
    try:
        if str(uuid.UUID(value)) != value:
            raise ValueError()
    except (ValueError, TypeError, AttributeError):
        raise Held('A canonical operation ID is required.', 400)
    return value


def fresh_authority(value, now, review=False):
    if not isinstance(value, dict) or not HEX64.fullmatch(value.get('actor', '')):
        raise Held('Source write authority is required.', 403)
    if 'deadline' in value and (type(value['deadline']) is not int or now >= value['deadline']):
        raise Held('The original source proof expired.', 403)
    cap = value.get('capability')
    if cap in ('canSubmit', 'canRequestEdit') and not review:
        return
    access = value.get('decision') or {}
    if not isinstance(access, dict):
        raise Held('Invalid directory permission.', 403)
    checked, expires = access.get('checkedAt'), access.get('expiresAt')
    request = access.get('request') or {}
    if not isinstance(request, dict) or not isinstance(access.get('actions'), list) or not isinstance(request.get('subjects'), list):
        raise Held('Invalid directory permission.', 403)
    if not (type(checked) is int and type(expires) is int and checked <= now + 1000
            and now < expires and 0 < expires - checked <= 5000
            and access.get('authoritative') is True and access.get('enrolled') is True
            and access.get('audience') == 'cd.bittrees.org'
            and request.get('project') == 'crypto-directory'
            and request.get('source') == 'cd.bittrees.org'):
        raise Held('The original directory permission has expired or is unavailable.', 403)
    actions = access.get('actions') or []
    wallet = request.get('authenticatedWallet') or ''
    admin = ('project.admin' in actions and re.fullmatch(r'0x[a-f0-9]{40}', wallet)
             and wallet in request.get('subjects', []))
    reviewer, editor = 'role.reviewer' in actions, 'role.editor' in actions
    allowed = {'canEdit': bool(admin or editor), 'canReview': bool(admin or reviewer),
               'canReviewOwn': bool(admin), 'canAutoReview': reviewer,
               'canAutoReviewOwn': bool(admin and reviewer),
               'canHandleRequests': bool(admin or reviewer or editor)}
    if not allowed.get(cap) or review and cap not in ('canReview', 'canReviewOwn', 'canAutoReview', 'canAutoReviewOwn'):
        raise Held('The current source role does not allow this mutation.', 403)


class Catalogue:
    def __init__(self, path, store_id, service_key):
        self.path = Path(path)
        self.store_id = uuid_value(store_id)
        if not HEX64.fullmatch(service_key):
            raise Held('A dedicated service key is required.', 503)
        self.key = bytes.fromhex(service_key)

    def connect(self):
        # Normal requests can neither create nor substitute a database.
        if self.path.is_symlink() or not self.path.is_file() or self.path.stat().st_mode & 0o077:
            raise Held('The pinned private database is unavailable.', 503)
        db = sqlite3.connect(self.path.as_uri() + '?mode=rw', uri=True, timeout=.1, isolation_level=None)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA busy_timeout=100')
        db.execute('PRAGMA synchronous=FULL')
        if db.execute("SELECT value FROM settings WHERE key='store_id'").fetchone()[0] != self.store_id:
            db.close()
            raise Held('Directory store identity changed.', 503)
        return db

    @staticmethod
    def wall_clock(db):
        return int(db.execute("SELECT unixepoch('subsec')*1000").fetchone()[0])

    def bootstrap(self, seed, expected_digest, source_commit, envelope):
        if self.path.exists() or not HEX64.fullmatch(expected_digest) or not HEX40.fullmatch(source_commit) or digest(encoded(seed)) != expected_digest:
            raise Held('Bootstrap must match an explicit approved seed and an absent destination.')
        if not isinstance(seed, list) or not 1 <= len(seed) <= 10000:
            raise Held('Invalid approved seed.', 400)
        ids = set()
        for row in seed:
            if not IDENT.fullmatch(row.get('id', '')) or row['id'] in ids or blob_sha(row.get('raw', '')) != row.get('sha'):
                raise Held('Bootstrap IDs or source hashes do not match.', 400)
            ids.add(row['id'])
            metadata(row['raw'])
        self._envelope(envelope)
        self.path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        # Exclusive creation preserves any existing database or restoration copy.
        fd = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        os.close(fd)
        db = sqlite3.connect(self.path, isolation_level=None)
        try:
            db.executescript('''PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
              PRAGMA max_page_count=32768; PRAGMA journal_size_limit=16777216; PRAGMA wal_autocheckpoint=256;
              CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
              CREATE TABLE catalogue_state(id INTEGER PRIMARY KEY CHECK(id=1),revision INTEGER NOT NULL,applied_at INTEGER NOT NULL);
              CREATE TABLE journal(id INTEGER PRIMARY KEY CHECK(id=1),sha TEXT NOT NULL,envelope TEXT NOT NULL);
              CREATE TABLE listings(id TEXT PRIMARY KEY,sha TEXT NOT NULL,raw TEXT NOT NULL,metadata TEXT NOT NULL);
              CREATE TABLE receipts(operation_id TEXT PRIMARY KEY,actor TEXT NOT NULL,request_digest TEXT NOT NULL,receipt TEXT NOT NULL,audit TEXT NOT NULL);
              CREATE TABLE requests(id TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
            ''')
            db.execute('BEGIN IMMEDIATE')
            db.executemany('INSERT INTO settings VALUES(?,?)', [('store_id', self.store_id), ('seed_source_commit', source_commit), ('writer_enabled', 'false')])
            db.execute('INSERT INTO catalogue_state VALUES(1,0,?)', (self.wall_clock(db),))
            db.execute('INSERT INTO journal VALUES(1,?,?)', (digest(envelope), envelope))
            db.executemany('INSERT INTO listings VALUES(?,?,?,?)', [(row['id'], row['sha'], row['raw'], encoded(metadata(row['raw']))) for row in seed])
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    @staticmethod
    def _envelope(raw):
        if not isinstance(raw, str) or len(raw.encode()) > 1500000:
            raise Held('Encrypted journal exceeds its bound.', 413)
        try:
            value = json.loads(raw)
            if set(value) != {'version', 'iv', 'tag', 'ciphertext'} or value['version'] != 1 or not all(isinstance(value[k], str) for k in ('iv', 'tag', 'ciphertext')):
                raise ValueError()
        except (ValueError, TypeError):
            raise Held('Only the encrypted source journal is accepted.', 400)

    def public(self, db=None):
        own = db is None
        db = db or self.connect()
        try:
            # One read transaction prevents combining a new revision with old rows.
            if own:
                db.execute('BEGIN')
            state = db.execute('SELECT revision,applied_at FROM catalogue_state WHERE id=1').fetchone()
            projects = []
            for row in db.execute('SELECT id,metadata FROM listings ORDER BY id'):
                meta = json.loads(row['metadata'])
                projects.append({'id': row['id'], **{k: meta[k] for k in PUBLIC_FIELDS if k in meta}})
                projects[-1]['founded'] = str(projects[-1]['founded'])
            projects.sort(key=lambda x: (x['lead_category'].casefold(), x['name'].casefold(), x['id']))
            raw = encoded(projects)
            source = db.execute("SELECT value FROM settings WHERE key='seed_source_commit'").fetchone()[0]
            return {'storeId': self.store_id, 'revision': state['revision'], 'appliedAt': state['applied_at'], 'seedSourceCommit': source, 'datasetSha256': digest(raw), 'projects': projects, 'bytes': raw}
        finally:
            if own:
                db.rollback()
                db.close()

    def handle(self, raw, signature):
        if not isinstance(raw, bytes) or len(raw) > MAX_BODY:
            raise Held('Source request exceeds its bound.', 413)
        expected = hmac.new(self.key, raw, hashlib.sha256).hexdigest()
        if not isinstance(signature, str) or not hmac.compare_digest(expected, signature):
            raise Held('Authenticated source requests only.', 403)
        try:
            packet = json.loads(raw)
        except (ValueError, UnicodeError):
            raise Held('Invalid source JSON.', 400)
        if not isinstance(packet, dict) or set(packet) - {'version', 'storeId', 'requestId', 'issuedAt', 'method', 'args', 'authorization'} or packet.get('version') != 1 or packet.get('storeId') != self.store_id:
            raise Held('Source/store binding mismatch.', 403)
        uuid_value(packet.get('requestId'))
        args, method = packet.get('args'), packet.get('method')
        if not isinstance(args, dict) or method not in ('journal.read', 'journal.save', 'journal.audit', 'listing.read', 'catalogue.read', 'catalogue.publish', 'operation.read'):
            raise Held('Unknown source operation.', 400)
        db = self.connect()
        try:
            now = self.wall_clock(db)
            issued = packet.get('issuedAt')
            if type(issued) is not int or not now - 15000 < issued <= now + 1000:
                raise Held('Source transport expired.', 403)
            if method in ('journal.save', 'catalogue.publish'):
                fresh_authority(packet.get('authorization'), now, method == 'catalogue.publish')
            db.execute('BEGIN IMMEDIATE')
            db.execute('DELETE FROM requests WHERE expires_at<=?', (now,))
            if db.execute('SELECT count(*) FROM requests').fetchone()[0] >= 256:
                raise Held('Source replay window is full.', 429)
            try:
                db.execute('INSERT INTO requests VALUES(?,?)', (packet['requestId'], issued + 15000))
            except sqlite3.IntegrityError:
                raise Held('This signed source request was already consumed.')
            result = self._operation(db, method, args, packet.get('authorization'))
            db.commit()
            # A durable receipt survives a late COMMIT. The caller must reconcile
            # the same operation; a late response never authorizes another write.
            if method in ('journal.save', 'catalogue.publish'):
                try:
                    fresh_authority(packet.get('authorization'), self.wall_clock(db), method == 'catalogue.publish')
                except Held:
                    raise Held('Commit outcome is held after permission expiry. Read the original operation receipt; do not replay.', 409)
            return {'storeId': self.store_id, **result}
        except sqlite3.OperationalError:
            db.rollback()
            raise Held('Directory is busy. Reconcile the original operation before retrying.')
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def _operation(self, db, method, args, authority):
        fields = {'journal.read': set(), 'catalogue.read': set(), 'listing.read': {'id'}, 'operation.read': {'operationId'}}
        if method in fields and set(args) != fields[method]:
            raise Held('Unexpected read fields.', 400)
        if method == 'journal.read':
            row = db.execute('SELECT sha,envelope FROM journal WHERE id=1').fetchone()
            return dict(row, catalogueRevision=db.execute('SELECT revision FROM catalogue_state WHERE id=1').fetchone()[0])
        if method == 'catalogue.read':
            data = self.public(db)
            data.pop('bytes')
            return data
        if method == 'listing.read':
            if not IDENT.fullmatch(args.get('id', '')):
                raise Held('Invalid listing ID.', 400)
            row = db.execute('SELECT sha,raw FROM listings WHERE id=?', (args['id'],)).fetchone()
            if row is None:
                raise Held('Listing not found.', 404)
            return dict(row)
        if method == 'operation.read':
            uuid_value(args.get('operationId'))
            row = db.execute('SELECT receipt FROM receipts WHERE operation_id=?', (args['operationId'],)).fetchone()
            if row is None:
                raise Held('Original publication receipt not found.', 404)
            return {'receipt': json.loads(row[0])}
        if method in ('journal.save', 'journal.audit'):
            if set(args) != {'expectedSha', 'envelope'}:
                raise Held('Unexpected journal fields.', 400)
            self._envelope(args['envelope'])
            if method == 'journal.save':
                if db.execute("SELECT value FROM settings WHERE key='writer_enabled'").fetchone()[0] != 'true':
                    raise Held('Runtime writes are paused.', 503)
                fresh_authority(authority, self.wall_clock(db))
            cursor = db.execute('UPDATE journal SET sha=?,envelope=? WHERE id=1 AND sha=?', (digest(args['envelope']), args['envelope'], args['expectedSha']))
            if cursor.rowcount != 1:
                raise Held('The private journal changed; refresh its exact revision.')
            if method == 'journal.save':
                fresh_authority(authority, self.wall_clock(db))
            return {'sha': digest(args['envelope'])}
        if method != 'catalogue.publish':
            raise Held('Unknown source operation.', 400)
        if db.execute("SELECT value FROM settings WHERE key='writer_enabled'").fetchone()[0] != 'true':
            raise Held('Runtime publication is held pending the verified migration.', 503)
        required = {'operationId', 'id', 'raw', 'expectedListingSha', 'expectedCatalogueRevision', 'expectedJournalSha', 'envelope', 'requestDigest', 'contentHash', 'audit'}
        if set(args) != required or not IDENT.fullmatch(args.get('id', '')) or not HEX64.fullmatch(args.get('requestDigest', '')):
            raise Held('An exact immutable publication is required.', 400)
        uuid_value(args['operationId'])
        self._envelope(args['envelope'])
        if not isinstance(args['raw'], str) or not HEX64.fullmatch(args.get('contentHash', '')) or digest(args['raw']) != args['contentHash']:
            raise Held('Approved listing bytes do not match their digest.')
        audit = args['audit']
        if not isinstance(audit, dict) or set(audit) != {'collection', 'recordId', 'reasonHash', 'reviewDigest'} or audit['collection'] not in ('submissions', 'editRequests') or not HEX64.fullmatch(audit.get('reasonHash', '')) or not HEX64.fullmatch(audit.get('reviewDigest', '')):
            raise Held('Only bounded opaque review audit fields are accepted.', 400)
        uuid_value(audit['recordId'])
        previous = db.execute('SELECT actor,request_digest,receipt FROM receipts WHERE operation_id=?', (args['operationId'],)).fetchone()
        if previous:
            old_receipt = json.loads(previous['receipt'])
            if previous['actor'] != authority['actor'] or previous['request_digest'] != args['requestDigest'] or old_receipt['projectId'] != args['id'] or old_receipt['contentHash'] != args['contentHash']:
                raise Held('Original operation belongs to different content or actor.')
            return old_receipt
        state = db.execute('SELECT revision FROM catalogue_state WHERE id=1').fetchone()[0]
        if type(args['expectedCatalogueRevision']) is not int or args['expectedCatalogueRevision'] != state:
            raise Held('The catalogue revision changed; refresh the exact review.')
        old = db.execute('SELECT sha FROM listings WHERE id=?', (args['id'],)).fetchone()
        if (old['sha'] if old else None) != args['expectedListingSha']:
            raise Held('The reviewed listing changed or its ID already exists.')
        meta = metadata(args['raw'])
        if meta['verification_status'] not in STATUSES or old is None and meta['verification_status'] != 'verified':
            raise Held('An approved publication state is required.')
        applied = self.wall_clock(db)
        fresh_authority(authority, applied, True)
        receipt = {'operationId': args['operationId'], 'projectId': args['id'], 'catalogueRevision': state + 1,
                   'contentHash': args['contentHash'], 'listingSha': blob_sha(args['raw']), 'appliedAt': applied, 'storeId': self.store_id}
        # These effects either all commit or all roll back, including the review
        # and receipt. No network/provider operation runs while the lock is held.
        cursor = db.execute('UPDATE journal SET sha=?,envelope=? WHERE id=1 AND sha=?', (digest(args['envelope']), args['envelope'], args['expectedJournalSha']))
        if cursor.rowcount != 1:
            raise Held('The native review journal changed; refresh the exact request.')
        db.execute('INSERT INTO listings VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET sha=excluded.sha,raw=excluded.raw,metadata=excluded.metadata', (args['id'], receipt['listingSha'], args['raw'], encoded(meta)))
        db.execute('UPDATE catalogue_state SET revision=?,applied_at=? WHERE id=1', (state + 1, applied))
        db.execute('INSERT INTO receipts VALUES(?,?,?,?,?)', (args['operationId'], authority['actor'], args['requestDigest'], encoded(receipt), encoded(args['audit'])))
        if len(self.public(db)['bytes'].encode()) > 2500000:
            raise Held('Public catalogue capacity reached; administrator review is required.', 413)
        fresh_authority(authority, self.wall_clock(db), True)
        return receipt
