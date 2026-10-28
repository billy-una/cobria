#!/usr/bin/env python3
"""Comprueba el sitio público contra una candidata local verificada (solo lectura)."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlparse
from urllib.request import Request, HTTPRedirectHandler, build_opener
from zipfile import BadZipFile

from public_release_gate import audit, load_candidate, TAG

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', default=str(ROOT / 'output/release' / TAG))
    parser.add_argument('--base-url', default='https://cobria-atlas.sectagpt.chatgpt.site')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    origin = urlparse(base)
    if (origin.scheme != 'https' or not origin.hostname or origin.username or origin.password or
            origin.path or origin.query or origin.fragment):
        raise SystemExit('La URL debe ser un origen HTTPS sin credenciales, ruta ni consulta')
    try:
        subprocess.run([sys.executable, str(ROOT / 'replication/scripts/validate-remediation-r9.py'),
                        '--output', args.output], cwd=ROOT, check=True)
        candidate = load_candidate(Path(args.output).resolve() / 'COBRIA-Ecosistema-1.0.0-rc2')
    except (subprocess.CalledProcessError, OSError, ValueError, KeyError, BadZipFile) as error:
        raise SystemExit(f'Paquete local no conforme; no se consultó la red: {error}') from None

    class SameOriginRedirect(HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            target = urlparse(newurl)
            if (target.scheme, target.netloc) != (origin.scheme, origin.netloc):
                raise ValueError('Redirección fuera del origen HTTPS autorizado')
            return super().redirect_request(req, fp, code, msg, headers, newurl)

    opener = build_opener(SameOriginRedirect())

    def fetch(path, limit):
        request = Request(base + path, headers={'User-Agent': 'COBRIA-R9-public-gate/1.1'})
        with opener.open(request, timeout=30) as response:
            data = response.read(limit + 1)
            if len(data) > limit:
                raise ValueError(f'Respuesta excesiva: {path}')
            return data, response.headers

    report = audit(candidate, fetch)
    report['url'] = base
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    destination = ROOT / 'output/review' / TAG / f'PUBLIC-GATE-{stamp}.json'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(1 if report['automaticBlockers'] else 0)


if __name__ == '__main__':
    main()
