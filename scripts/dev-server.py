#!/usr/bin/env python3
"""Static file server with a dev-only JSON write API for poker data editors.

Serves the repo root (same as `python3 -m http.server`) and exposes:
  GET  /__dev__/ping   — editor probes for write support
  POST /__dev__/write  — body: {"path":"poker/prestige-defs.json","content":<json>}

Only whitelisted paths under poker/ may be written. Not for production deploy.
"""
from __future__ import annotations

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
ALLOWED = {
    'poker/prestige-defs.json',
    'poker/upgrade-defs.json',
    'poker/achievement-defs.json',
    'poker/quest-defs.json',
    'poker/changelog.json',
}
PORT = int(os.environ.get('PORT', '8080'))


class DevHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        if args and str(args[0]).startswith('GET /__dev__/'):
            return
        super().log_message(fmt, *args)

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        if self.path.startswith('/__dev__/'):
            self.send_response(204)
            self._cors()
            self.end_headers()
            return
        self.send_error(404)

    def do_GET(self):
        if self.path.rstrip('/') == '/__dev__/ping':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(b'{"ok":true,"write":true}')
            return
        super().do_GET()

    def do_POST(self):
        if self.path.rstrip('/') != '/__dev__/write':
            self.send_error(404)
            return

        length = int(self.headers.get('Content-Length', '0') or 0)
        if length <= 0 or length > 8_000_000:
            self.send_error(400, 'bad content length')
            return

        try:
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_error(400, 'invalid json body')
            return

        rel = unquote(str(payload.get('path', ''))).replace('\\', '/').lstrip('/')
        if rel not in ALLOWED or '..' in rel.split('/'):
            self.send_error(403, 'path not allowed')
            return

        if 'content' not in payload:
            self.send_error(400, 'missing content')
            return

        target = ROOT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        text = json.dumps(payload['content'], indent=2, ensure_ascii=False) + '\n'
        target.write_text(text, encoding='utf-8')

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self._cors()
        self.end_headers()
        self.wfile.write(json.dumps({'ok': True, 'path': rel, 'bytes': len(text)}).encode())


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('', PORT), DevHandler)
    print(f'dev-server: http://localhost:{PORT}/  (write API enabled)')
    print(f'  poker editor: http://localhost:{PORT}/poker/vip-perk-editor.html')
    server.serve_forever()


if __name__ == '__main__':
    main()
