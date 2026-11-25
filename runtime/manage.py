"""Explicit local operator commands; never callable through the HTTP origin."""
import argparse
import json
import os
import sqlite3
import stat
from pathlib import Path
from catalogue import Catalogue, Held, digest, encoded


def private_json(path):
    path = Path(path)
    if path.is_symlink() or stat.S_IMODE(path.stat().st_mode) & 0o077:
        raise Held('Operator inputs must be private regular files.', 503)
    if path.stat().st_size > 8 * 1024 * 1024:
        raise Held('Operator input exceeds its bound.', 413)
    return json.loads(path.read_text())


def load_config(path):
    config = private_json(path)
    if set(config) != {'database', 'storeId', 'serviceKeyFile', 'port'}:
        raise Held('Unexpected runtime configuration.')
    key_path = Path(config['serviceKeyFile'])
    if key_path.is_symlink() or stat.S_IMODE(key_path.stat().st_mode) & 0o077:
        raise Held('A dedicated private service key is required.')
    return Catalogue(config['database'], config['storeId'], key_path.read_text().strip())


def verify(catalogue):
    with catalogue.connect() as db:
        if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
            raise Held('Database integrity check failed.', 503)
        db.execute('BEGIN')
        data = catalogue.public(db)
        result = {k: data[k] for k in ('storeId', 'revision', 'seedSourceCommit', 'datasetSha256')}
        result.update(listingCount=len(data['projects']), journalSha=db.execute('SELECT sha FROM journal WHERE id=1').fetchone()[0], receiptCount=db.execute('SELECT count(*) FROM receipts').fetchone()[0], writerEnabled=db.execute("SELECT value FROM settings WHERE key='writer_enabled'").fetchone()[0] == 'true')
        db.rollback()
        return result


def backup(catalogue, destination):
    destination = Path(destination)
    fd = os.open(destination, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    os.close(fd)
    with catalogue.connect() as source, sqlite3.connect(destination) as target:
        source.backup(target, pages=256, sleep=.01)
    restored = Catalogue(destination, catalogue.store_id, catalogue.key.hex())
    # Checking the independent backup catches missing WAL data and partial copies.
    snapshot = verify(restored)
    with restored.connect() as db:
        db.execute("UPDATE settings SET value='false' WHERE key='writer_enabled'")
    return {**snapshot, 'writerEnabled': False, 'restorationVerified': True}


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('verify')
    bootstrap = sub.add_parser('bootstrap')
    bootstrap.add_argument('--package', required=True)
    bootstrap.add_argument('--package-sha256', required=True)
    bootstrap.add_argument('--approved-source-commit', required=True)
    sub.add_parser('pause')
    enable = sub.add_parser('enable')
    enable.add_argument('--expected-revision', type=int, required=True)
    enable.add_argument('--expected-journal-sha', required=True)
    enable.add_argument('--expected-dataset-sha256', required=True)
    enable.add_argument('--legacy-writer-fenced', action='store_true', required=True)
    snapshot = sub.add_parser('backup')
    snapshot.add_argument('--destination', required=True)
    args = parser.parse_args()
    catalogue = load_config(args.config)
    if args.command == 'bootstrap':
        package = private_json(args.package)
        if digest(Path(args.package).read_text()) != args.package_sha256 or set(package) != {'version', 'sourceCommit', 'seed', 'seedSha256', 'envelope', 'legacyJournalSha'} or package['version'] != 1 or package['sourceCommit'] != args.approved_source_commit:
            raise Held('The explicit approved migration package does not match.')
        catalogue.bootstrap(package['seed'], package['seedSha256'], package['sourceCommit'], package['envelope'])
    elif args.command == 'backup':
        print(encoded(backup(catalogue, args.destination)))
        return
    elif args.command in ('enable', 'pause'):
        with catalogue.connect() as db:
            db.execute('BEGIN IMMEDIATE')
            if args.command == 'enable':
                current = catalogue.public(db)
                journal_sha = db.execute('SELECT sha FROM journal WHERE id=1').fetchone()[0]
                if current['revision'] != args.expected_revision or current['datasetSha256'] != args.expected_dataset_sha256 or journal_sha != args.expected_journal_sha:
                    raise Held('The exact migration or restoration snapshot changed.')
            db.execute("UPDATE settings SET value=? WHERE key='writer_enabled'", ('true' if args.command == 'enable' else 'false',))
            db.commit()
    print(encoded(verify(catalogue)))


if __name__ == '__main__':
    try:
        main()
    except (Held, OSError, ValueError, sqlite3.Error) as error:
        # No input content, decrypted journal or key is printed.
        raise SystemExit(str(error) if isinstance(error, Held) else 'Operator action held. Existing data was preserved.')
