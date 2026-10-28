#!/usr/bin/env python3
"""Valida el paquete local RC2 sin afirmar publicación externa."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
import zipfile

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
TAG = "ecosistema-1.0.0-rc2"
NAME = "COBRIA-Ecosistema-1.0.0-rc2"
parser = argparse.ArgumentParser()
parser.add_argument("--output", default=str(ROOT / "output" / "release" / TAG))
args = parser.parse_args()
BASE = Path(args.output).resolve()
allowed = (ROOT / "output" / "release").resolve()
if BASE == allowed or allowed not in BASE.parents:
    raise SystemExit("el destino debe ser un subdirectorio específico de output/release")
STAGE = BASE / NAME
CORE_SHA256 = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"
ERRORS: list[str] = []


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        ERRORS.append(message)


require(STAGE.is_dir(), "falta el directorio de la candidata")
manifest_path = STAGE / "MANIFEST-SHA256.json"
summary_path = BASE / "BUILD-SUMMARY.json"
if manifest_path.is_file() and summary_path.is_file():
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    require(manifest.get("release") == TAG, "el manifiesto no corresponde a RC2")
    require(manifest.get("published") is False, "el paquete afirma publicación sin autoridad humana")
    require(manifest.get("coreSha256") == CORE_SHA256, "la huella declarada de Core es incorrecta")
    require(summary.get("status") == "candidate-built-not-published", "estado de construcción incorrecto")
    require(summary.get("humanPublicationPending") is True, "falta la compuerta humana")
    require(not summary.get("automaticBlockers"), "quedan bloqueadores automáticos")
    for entry in manifest.get("files", []):
        path = STAGE / entry["path"]
        require(path.is_file(), f"falta {entry['path']}")
        if path.is_file():
            require(path.stat().st_size == entry["bytes"], f"tamaño distinto: {entry['path']}")
            require(sha(path) == entry["sha256"], f"huella distinta: {entry['path']}")
    comparison = json.loads((STAGE / "COMPARACION-DOBLE-CONSTRUCCION.json").read_text(encoding="utf-8"))
    require(comparison.get("decision") == "pass", "la doble construcción no coincide")
    require(comparison.get("builds") == 2, "no se registraron dos construcciones")
else:
    ERRORS.append("faltan manifiesto o resumen de construcción")

pdfs = sorted(STAGE.glob("*.pdf")) if STAGE.is_dir() else []
require(len(pdfs) == 6, f"se esperaban 6 PDF y se encontraron {len(pdfs)}")
for pdf in pdfs:
    try:
        require(len(PdfReader(str(pdf)).pages) > 0, f"PDF vacío: {pdf.name}")
    except Exception as error:
        ERRORS.append(f"PDF ilegible {pdf.name}: {error}")

archive = BASE / f"{NAME}.zip"
require(archive.is_file(), "falta el ZIP principal")
if archive.is_file():
    require(zipfile.is_zipfile(archive), "el ZIP principal es ilegible")
    if summary_path.is_file():
        summary = json.loads(summary_path.read_text(encoding="utf-8"))
        require(sha(archive) == summary.get("sha256"), "la huella del ZIP no coincide")

require(sha(ROOT / "specification" / "COBRIA-CORE-1.0.md") == CORE_SHA256, "Core 1.0 cambió")
if ERRORS:
    print("R9 no conforme:")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)
print("R9 conforme: RC2 construida dos veces desde clones limpios, empaquetada y pendiente de publicación humana.")
