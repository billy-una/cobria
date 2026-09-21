#!/usr/bin/env python3
"""Valida documentación, errores estables, comentarios e i18n de fase 6."""

from datetime import date
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-6"
APP = ROOT / "replication/examples/ecosistema-app/src"
manifest = json.loads((BASE / "documentation.yaml").read_text(encoding="utf-8"))
catalog = json.loads((BASE / "ERROR-CATALOG.json").read_text(encoding="utf-8"))
errors: list[str] = []

doc_types = {item["id"] for item in manifest.get("documentTypes", [])}
for item in manifest.get("canonicalDocuments", []):
    path = ROOT / item.get("path", "")
    if not path.is_file():
        errors.append(f"documento inexistente: {item.get('path')}")
    for field in ("type", "owner", "version", "status", "reviewBefore"):
        if not item.get(field):
            errors.append(f"{item.get('path')}: falta {field}")
    if item.get("type") not in doc_types:
        errors.append(f"{item.get('path')}: tipo desconocido")
    try:
        review = date.fromisoformat(item.get("reviewBefore", ""))
        if review < date.today():
            errors.append(f"{item.get('path')}: revisión vencida")
    except ValueError:
        errors.append(f"{item.get('path')}: reviewBefore inválido")

catalog_codes = [item.get("code") for item in catalog.get("errors", [])]
if len(catalog_codes) != len(set(catalog_codes)):
    errors.append("catálogo contiene códigos duplicados")
for item in catalog.get("errors", []):
    if not re.fullmatch(r"[A-Z][A-Z0-9_]+", str(item.get("code", ""))):
        errors.append(f"código inválido: {item.get('code')}")
    if item.get("http") not in {400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504}:
        errors.append(f"estado de protocolo inválido: {item.get('code')}")

source_text = "\n".join(path.read_text(encoding="utf-8") for path in APP.rglob("*.mjs"))
used_codes = set(re.findall(r"new ErrorCobria\(['\"]([A-Z0-9_]+)['\"]", source_text))
unknown = used_codes - set(catalog_codes)
if unknown:
    errors.append(f"códigos usados no catalogados: {sorted(unknown)}")

messages_path = APP / "presentation/i18n/mensajes-es.mjs"
messages_text = messages_path.read_text(encoding="utf-8")
for code in used_codes:
    if not re.search(rf"^\s*{re.escape(code)}:", messages_text, re.MULTILINE):
        errors.append(f"código sin mensaje español: {code}")

for folder_name in ("domain", "application", "presentation"):
    for source in (APP / folder_name).rglob("*.mjs"):
        content = source.read_text(encoding="utf-8")
        if "throw new Error(" in content:
            errors.append(f"{source.relative_to(ROOT)}: Error sin código estable")

debt_pattern = re.compile(r"\b(TODO|FIXME|HACK)\b(?!\([A-Z][A-Z0-9-]+,\s*[^)]+\):)")
for source in APP.rglob("*.mjs"):
    for number, line in enumerate(source.read_text(encoding="utf-8").splitlines(), 1):
        if debt_pattern.search(line):
            errors.append(f"{source.relative_to(ROOT)}:{number}: deuda sin referencia y responsable")

if len(manifest.get("documentTypes", [])) != 5:
    errors.append("se esperaban cinco tipos documentales")
if len(catalog_codes) != 21:
    errors.append(f"se esperaban 21 códigos y se encontraron {len(catalog_codes)}")

if errors:
    print("Fase 6 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print(
    f"Fase 6 válida: {len(manifest['canonicalDocuments'])} documentos registrados, "
    f"{len(catalog_codes)} errores catalogados y {len(used_codes)} usados con traducción."
)
