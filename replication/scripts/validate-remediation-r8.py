#!/usr/bin/env python3
"""Compuerta R8: sincronización editorial con la evidencia confirmatoria R7."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXPECTED_CORE = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"R8: {message}")


def text(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def sha256(relative: str) -> str:
    return hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()


require(sha256("specification/COBRIA-CORE-1.0.md") == EXPECTED_CORE, "Core 1.0 cambió")
summary = json.loads(text("replication/results/core-r7-statistics/summary.json"))
evidence = json.loads(text("editorial/generated/evidence-r7.json"))
canonical = json.loads(text("editorial/canonical.json"))

require(evidence["status"] == "confirmatorio-completo-interno", "clasificación R7 incorrecta")
require(evidence["scope"] == summary["scope"], "el alcance editorial difiere del análisis")
require(evidence["observations"] == 270 and sum(row["observations"] for row in evidence["engines"]) == 270, "conteo R7 incorrecto")
require(len(evidence["comparisons"]) == 9 and len(evidence["negativeResults"]) == 1, "faltan comparaciones o resultado negativo")
require(evidence["alternatives"]["observations"] == 630, "alternativas desincronizadas")
require(evidence["humanPending"] == summary["humanPending"], "se ocultaron pendientes humanos")
require({row["id"]: row["rawSha256"] for row in evidence["engines"]} == summary["rawSha256"], "las huellas crudas no coinciden")

claims = {claim["id"]: claim for claim in canonical["claims"]}
require(claims["CLAIM-R7-270"]["status"] == "confirmatorio-completo-interno", "falta afirmación R7 clasificada")
require(claims["CLAIM-R7-ONE-NONCONCLUSIVE"]["status"] == "resultado-negativo-publicado", "falta publicar el resultado no concluyente")

for relative in [
    "libro-cobria/generated/evidence-r7.json",
    "sitio/public/evidence-r7.json",
]:
    require(json.loads(text(relative)) == evidence, f"{relative} no coincide con la fuente editorial")

article = text("articulo-cobria.tex")
master = text("main.tex")
book = text("libro-cobria/build-book.mjs")
site = text("sitio/app/evidencia/page.tsx")
conclusion = text("partes/parte-vii-sintesis-nosql.tex")
for label, content in [("artículo", article), ("maestro", master)]:
    require("editorial/generated/evidence-r7.tex" in content, f"{label} no consume la fuente R7")
require("generated/evidence-r7.json" in book, "el libro no consume la fuente R7")
require('evidence-r7' in site, "el sitio no consume la fuente R7")

joined = "\n".join([article, master, book, site, conclusion])
for stale in ["repetición preliminar", "OpenSearch 2.19.3", "celdas incompletas"]:
    require(stale not in joined, f"permanece una afirmación obsoleta: {stale}")
for required in ["no concluyente", "réplica externa independiente", "estudio de transferencia"]:
    require(required in joined, f"falta el límite editorial: {required}")

for relative in [
    "output/pdf/COBRIA-articulo-cientifico-actualizado.pdf",
    "output/pdf/COBRIA-documento-maestro-ecosistema.pdf",
    "output/pdf/COBRIA-ecosistema-manual-completo.pdf",
    "output/pdf/COBRIA-cuaderno-de-trabajo.pdf",
    "output/pdf/COBRIA-anexo-tecnico.pdf",
]:
    path = ROOT / relative
    require(path.is_file() and path.stat().st_size > 100_000, f"falta el PDF actualizado {relative}")

print("R8 válida: artículo, maestro, libro y sitio comparten R7, sus huellas, su resultado negativo y sus límites.")
