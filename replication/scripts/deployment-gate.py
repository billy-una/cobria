#!/usr/bin/env python3
"""Gate local, sin credenciales ni despliegues, para una promoción COBRIA."""
import argparse
import fnmatch
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "specification/phase-8/environments.json"

def main() -> int:
    parser = argparse.ArgumentParser(description="Valida evidencia previa a desplegar COBRIA")
    parser.add_argument("--environment", required=True)
    parser.add_argument("--account", required=True)
    parser.add_argument("--branch", required=True)
    parser.add_argument("--artifact", required=True)
    parser.add_argument("--rollback-artifact", required=True)
    parser.add_argument("--data-policy", required=True)
    parser.add_argument("--variables-checked", action="store_true")
    parser.add_argument("--rules-tested", action="store_true")
    parser.add_argument("--tests-passed", action="store_true")
    parser.add_argument("--smoke-plan", action="store_true")
    args = parser.parse_args()

    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    environments = {item["id"]: item for item in config["environments"]}
    errors = []
    env = environments.get(args.environment)
    if not env:
        errors.append("DEPLOY_ENVIRONMENT_UNKNOWN")
    else:
        if args.account not in env["accounts"]: errors.append("DEPLOY_ACCOUNT_MISMATCH")
        if not any(pattern == "*" or fnmatch.fnmatch(args.branch, pattern) for pattern in env["branches"]): errors.append("DEPLOY_BRANCH_REJECTED")
        if args.environment != "production" and args.data_policy in config["forbiddenNonProductionData"]: errors.append("DEPLOY_PRODUCTION_DATA_FORBIDDEN")
        if args.data_policy != env["dataPolicy"]: errors.append("DEPLOY_DATA_POLICY_MISMATCH")

    digest = re.compile(r"^(?:sha256:[0-9a-f]{64}|git:[0-9a-f]{40})$")
    if not digest.fullmatch(args.artifact): errors.append("DEPLOY_ARTIFACT_INVALID")
    if not digest.fullmatch(args.rollback_artifact): errors.append("DEPLOY_ROLLBACK_INVALID")
    for enabled, code in ((args.variables_checked,"DEPLOY_VARIABLES_UNCHECKED"),(args.rules_tested,"DEPLOY_RULES_UNTESTED"),(args.tests_passed,"DEPLOY_TESTS_FAILED"),(args.smoke_plan,"DEPLOY_SMOKE_MISSING")):
        if not enabled: errors.append(code)

    report = {"environment": args.environment, "account": args.account, "branch": args.branch, "artifactDigest": args.artifact, "rollbackArtifact": args.rollback_artifact, "status": "rejected" if errors else "approved", "errors": errors}
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main())
