#!/usr/bin/env python3
"""Local static server with a live git-rev endpoint for Poker update detection.

Serves the repo like `python3 -m http.server`, and answers
`/poker/dev-rev.json` with `{ "rev": "<git HEAD sha>" }` so a long-lived
localhost tab can prompt Refresh when you switch branches or pull — even
when CHANGELOG ids match across branches.

Usage:
  python3 serve.py
  python3 serve.py 8080
"""
from __future__ import annotations

import json
import subprocess
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEV_REV_PATHS = {"/poker/dev-rev.json", "/dev-rev.json"}


def git_head() -> str:
    try:
        out = subprocess.check_output(
            ["git", "-C", str(ROOT), "rev-parse", "HEAD"],
            stderr=subprocess.DEVNULL,
            text=True,
        )
        return out.strip()
    except (subprocess.CalledProcessError, FileNotFoundError, OSError):
        return ""


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path in DEV_REV_PATHS:
            body = json.dumps({"rev": git_head()}, separators=(",", ":")).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

    def log_message(self, fmt, *args):
        # Quieter than the default access log spam during release polls.
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main():
    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Serving {ROOT} at http://localhost:{port}/")
    print(f"Poker: http://localhost:{port}/poker/  (dev-rev.json → live git HEAD)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
