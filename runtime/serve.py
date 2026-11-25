"""Loopback-only HTTP composition; no public bind or credential provisioning."""
import argparse
import json
import os
import stat
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from catalogue import Catalogue, Held, MAX_BODY, encoded


def server(catalogue, port):
    slots = threading.BoundedSemaphore(8)
    connections = threading.BoundedSemaphore(8)

    class BoundedServer(ThreadingHTTPServer):
        daemon_threads = True
        request_queue_size = 8

        def process_request(self, request, address):
            if not connections.acquire(blocking=False):
                request.close()
                return
            try:
                super().process_request(request, address)
            except Exception:
                connections.release()
                raise

        def process_request_thread(self, request, address):
            try:
                super().process_request_thread(request, address)
            finally:
                connections.release()

    class Handler(BaseHTTPRequestHandler):
        protocol_version = 'HTTP/1.1'

        def setup(self):
            super().setup()
            self.connection.settimeout(5)

        def log_message(self, *_):
            pass  # Never log bodies, source signatures, private identifiers or keys.

        def send(self, status, body, headers=None):
            body = body.encode() if isinstance(body, str) else body
            self.close_connection = True
            self.send_response(status)
            self.send_header('Connection', 'close')
            for key, value in {'Content-Type': 'application/json; charset=utf-8',
                               'X-Content-Type-Options': 'nosniff',
                               'Cache-Control': 'private, no-store', **(headers or {})}.items():
                self.send_header(key, str(value))
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path not in ('/catalogue', '/manifest'):
                return self.send(404, b'{}')
            if not slots.acquire(blocking=False):
                return self.send(503, b'{}')
            try:
                value = catalogue.public()
                etag = '"' + value['datasetSha256'] + '"'
                headers = {'ETag': etag, 'Cache-Control': 'public, max-age=30',
                           'Access-Control-Allow-Origin': '*'}
                if self.headers.get('If-None-Match') == etag:
                    return self.send(304, b'', headers)
                body = value.pop('bytes')
                value.pop('projects')
                self.send(200, body if self.path == '/catalogue' else encoded({'schemaVersion': 1, **value}), headers)
            except Exception:
                self.send(503, b'{"error":"Catalogue unavailable."}')
            finally:
                slots.release()

        def do_POST(self):
            if self.path != '/rpc' or self.headers.get('Content-Type') != 'application/json' or self.headers.get('Transfer-Encoding'):
                return self.send(400, b'{}')
            length = self.headers.get('Content-Length', '')
            if not length.isdigit() or not 0 < int(length) <= MAX_BODY:
                return self.send(413, b'{}')
            if not slots.acquire(blocking=False):
                return self.send(503, b'{}')
            try:
                raw = self.rfile.read(int(length))
                if len(raw) != int(length):
                    raise Held('Incomplete source request.', 400)
                value = catalogue.handle(raw, self.headers.get('X-Directory-Signature'))
                self.send(200, encoded(value))
            except Held as error:
                self.send(error.status, encoded({'error': str(error)}))
            except Exception:
                self.send(503, b'{"error":"Source outcome unconfirmed; reconcile the original operation."}')
            finally:
                slots.release()

    return BoundedServer(('127.0.0.1', port), Handler)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    options = parser.parse_args()
    config_path = Path(options.config)
    if config_path.is_symlink() or not config_path.is_file() or stat.S_IMODE(config_path.stat().st_mode) & 0o077:
        raise SystemExit('Private runtime configuration must have mode 0600.')
    config = json.loads(config_path.read_text())
    if set(config) != {'database', 'storeId', 'serviceKeyFile', 'port'}:
        raise SystemExit('Unexpected runtime configuration.')
    key_path = Path(config['serviceKeyFile'])
    if key_path.is_symlink() or not key_path.is_file() or stat.S_IMODE(key_path.stat().st_mode) & 0o077:
        raise SystemExit('Service key must have mode 0600.')
    os.umask(0o077)
    catalogue = Catalogue(config['database'], config['storeId'], key_path.read_text().strip())
    with catalogue.connect() as db:
        db.execute('SELECT 1')
    server(catalogue, int(config['port'])).serve_forever(poll_interval=.5)


if __name__ == '__main__':
    main()
