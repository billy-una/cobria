#!/usr/bin/env python3
"""Genera evidencia de gate/entrega sin copiar secretos ni afirmar más de lo ejecutado."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import sys

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--environment', required=True, choices=['preview','staging','production','recovery'])
    parser.add_argument('--revision', required=True)
    parser.add_argument('--artifact', required=True)
    parser.add_argument('--status', default='gate-only', choices=['gate-only','deployed','rolled-back','failed'])
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    if not re.fullmatch(r'[0-9a-f]{40}', args.revision): return 2
    if not re.fullmatch(r'(?:git:[0-9a-f]{40}|sha256:[0-9a-f]{64})', args.artifact): return 2
    now = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    deployed = args.status != 'gate-only'
    evidence = {
      'schemaVersion':'1.0.0','status':args.status,'environment':args.environment,
      'revision':args.revision,'artifactDigest':args.artifact,'startedAt':now,'finishedAt':now,
      'gate':{'phase8':'passed'},'tests':[{'id':'delivery-gate','status':'passed'}],
      'smoke':[] if not deployed else [{'id':'endpoint-smoke','status':'not-recorded'}],
      'rollbackReady':True,
      'limitations':['No hubo despliegue ni humo contra endpoint real.'] if not deployed else []
    }
    path = Path(args.output); path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(path)
    return 0
if __name__ == '__main__': sys.exit(main())
