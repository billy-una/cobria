#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "specification/COBRIA-CORE-1.0.md"
EXAMPLES = ROOT / "libro-cobria/practical-examples.json"
SITE_EXAMPLES = ROOT / "sitio/public/practical-examples.json"
CATALOG = ROOT / "sitio/public/pattern-catalog.json"
SOURCE = ROOT / "replication/examples/patterns-r4/src/patrones.ts"
CASES = ROOT / "replication/examples/patterns-r4/cases.json"
FROZEN_CORE_SHA256 = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"
ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"JSON inválido {path.relative_to(ROOT)}: {exc}")
        return []


if digest(CORE) != FROZEN_CORE_SHA256:
    fail("COBRIA Core 1.0 cambió respecto a su huella congelada")

examples = load(EXAMPLES)
site_examples = load(SITE_EXAMPLES)
cases = load(CASES)
catalog = load(CATALOG)
source = SOURCE.read_text(encoding="utf-8")

if examples != site_examples:
    fail("el libro y el sitio no publican el mismo conjunto de ejemplos")
if len(examples) != 30 or {item.get("id") for item in examples} != set(range(1, 31)):
    fail("la colección pedagógica no contiene los treinta patrones una vez")
if len(cases) != 30 or {item.get("id") for item in cases} != set(range(1, 31)):
    fail("los oráculos no cubren los treinta patrones una vez")

required = {
    "problemaIngenuo", "solucion", "contrato", "code", "pruebaPositiva",
    "pruebaNegativa", "costo", "cuandoNoUsar", "languagesVerified",
}
for item in examples:
    item_id = item.get("id", "<sin-id>")
    missing = sorted(required - set(item))
    if missing:
        fail(f"patrón {item_id}: faltan campos {missing}")
        continue
    if "TypeScript" not in item["code"]:
        fail(f"patrón {item_id}: no tiene referencia TypeScript")
    if not item["pruebaPositiva"].get("entrada") or not item["pruebaPositiva"].get("esperado"):
        fail(f"patrón {item_id}: la prueba positiva no declara entrada y oráculo")
    negative = item["pruebaNegativa"]
    if not negative.get("entrada") or not (negative.get("codigoError") or negative.get("esperado")):
        fail(f"patrón {item_id}: la prueba adversa no declara rechazo ni abstención")
    declared = {entry.get("language") for entry in item["languagesVerified"]}
    if declared != set(item["code"]):
        fail(f"patrón {item_id}: código publicado y lenguajes verificados divergen")
    for evidence in item["languagesVerified"]:
        for key in ("source", "test"):
            relative = evidence.get(key, "")
            if not relative or not (ROOT / relative).is_file():
                fail(f"patrón {item_id}: {key} no resoluble para {evidence.get('language')}")

if "return { patron:" in json.dumps(examples, ensure_ascii=False):
    fail("persisten plantillas que devuelven solamente el número del patrón")
if re.findall(r"// @example-start (\d+)", source) != [str(i) for i in range(1, 31)]:
    fail("las marcas de código TypeScript no cubren 1–30 en orden")
if len(re.findall(r"export function ", source)) < 31:
    fail("la referencia TypeScript no expone las treinta funciones y su despachador")

catalog_items = catalog.get("items", []) if isinstance(catalog, dict) else []
if len(catalog_items) != 30:
    fail("el catálogo enriquecido no contiene treinta fichas")
else:
    for example, item in zip(examples, catalog_items):
        if example["id"] != item.get("id") or example["code"] != item.get("codigo"):
            fail(f"catálogo y fuente divergen en patrón {example['id']}")
        if example["languagesVerified"] != item.get("lenguajesVerificados"):
            fail(f"el catálogo omite evidencia de lenguaje en patrón {example['id']}")

if ERRORS:
    print("R4 no conforme:")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

language_counts: dict[str, int] = {}
for item in examples:
    for language in item["code"]:
        language_counts[language] = language_counts.get(language, 0) + 1
summary = ", ".join(f"{language}: {count}" for language, count in language_counts.items())
print(f"R4 conforme: 30 patrones con prueba positiva/adversa; código verificado ({summary}).")
