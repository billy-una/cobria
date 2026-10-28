#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def repository_digest(relative: str) -> str:
    """Usa el blob del índice para no depender de archivos iCloud sin materializar."""
    changed = subprocess.run(
        ["git", "diff", "--quiet", "--", relative], cwd=ROOT
    ).returncode != 0
    if changed:
        return digest(ROOT / relative)
    result = subprocess.run(
        ["git", "show", f":{relative}"], cwd=ROOT, capture_output=True
    )
    if result.returncode == 0:
        return hashlib.sha256(result.stdout).hexdigest()
    return digest(ROOT / relative)


for required in (
    "LICENSE",
    "LICENSE-CODE.txt",
    "LICENSE-CONTENT.md",
    "LICENSES.md",
    "NOTICE",
    "PROVENANCE.md",
    "CITATION.cff",
):
    if not (ROOT / required).is_file():
        fail(f"falta {required}")

inventory_path = ROOT / "editorial/provenance.json"
try:
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
except Exception as exc:
    fail(f"inventario de procedencia inválido: {exc}")
    inventory = {}

if inventory.get("release") != "1.0.0-rc2":
    fail("procedencia no corresponde a 1.0.0-rc2")
if inventory.get("status") != "candidate-non-stable":
    fail("procedencia no declara estado candidato")
if inventory.get("licenses", {}).get("code") != "Apache-2.0":
    fail("licencia de código no declarada")
if inventory.get("licenses", {}).get("content") != "CC-BY-4.0":
    fail("licencia de contenido no declarada")

entries = inventory.get("visualAssets", []) + inventory.get("historicalArtifacts", [])
declared: set[str] = set()
for entry in entries:
    relative = entry.get("path", "")
    path = ROOT / relative
    declared.add(relative)
    if not path.is_file():
        fail(f"recurso declarado inexistente: {relative}")
        continue
    if path.stat().st_size != entry.get("bytes"):
        fail(f"tamaño divergente: {relative}")
    if repository_digest(relative) != entry.get("sha256"):
        fail(f"huella divergente: {relative}")
    source = entry.get("source")
    if source and repository_digest(source) != entry.get("sha256"):
        fail(f"copia visual no coincide con origen: {relative}")

tracked = subprocess.run(
    ["git", "ls-files"], cwd=ROOT, check=True, text=True, capture_output=True
).stdout.splitlines()
required_visuals = {
    path
    for path in tracked
    if path.startswith("libro-cobria/assets/")
    or path.startswith("sitio/public/images/")
    or path in {"sitio/public/og.png", "sitio/public/favicon.svg"}
}
missing = sorted(required_visuals - declared)
if missing:
    fail("recursos visuales sin procedencia: " + ", ".join(missing))

for obsolete in (
    "sitio/db/index.ts",
    "sitio/db/schema.ts",
    "sitio/drizzle.config.ts",
    "sitio/examples/d1/app/api/notes/route.ts",
    "sitio/examples/d1/db/schema.ts",
    "sitio/public/file.svg",
    "sitio/public/globe.svg",
    "sitio/public/window.svg",
):
    if (ROOT / obsolete).exists():
        fail(f"andamiaje obsoleto todavía activo: {obsolete}")

for old_prefix in ("output/pdf/", "libro-cobria/output/"):
    stale = sorted(
        path for path in tracked if path.startswith(old_prefix) and path.endswith(".pdf")
    )
    if stale:
        fail("PDF histórico en ruta canónica: " + ", ".join(stale))

for relative in ("sitio/package.json", "sitio/vite.config.ts", "sitio/worker/index.ts"):
    text = (ROOT / relative).read_text(encoding="utf-8").lower()
    if "sqlite" in text or "drizzle" in text or "d1database" in text:
        fail(f"configuración relacional obsoleta en {relative}")

for package in ("sitio/package.json", "libro-cobria/package.json", "replication/package.json"):
    data = json.loads((ROOT / package).read_text(encoding="utf-8"))
    if data.get("license") != "Apache-2.0":
        fail(f"paquete sin licencia Apache-2.0: {package}")

refs = inventory.get("referenceRepositories", [])
if len(refs) != 3 or any(
    item.get("use") != "read-only-observation-no-code-copied" for item in refs
):
    fail("repositorios de referencia sin límite de uso explícito")

if ERRORS:
    print("R2 no conforme:")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print(f"R2 conforme: {len(entries)} recursos con licencia, procedencia, tamaño y SHA-256.")
