#!/usr/bin/env python3
"""Construye una candidata reproducible sin modificar evidencia científica."""

from pathlib import Path
import argparse
import gzip
import hashlib
import json
import shutil
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[2]
NAME = "COBRIA-Ecosistema-1.0.0-rc1"
TAG = "ecosistema-1.0.0-rc1"
PDF_FILES = [
    "COBRIA-especificacion-ecosistema-1.0.pdf",
    "COBRIA-articulo-cientifico-actualizado.pdf",
    "COBRIA-documento-maestro-ecosistema.pdf",
    "COBRIA-ecosistema-manual-completo.pdf",
    "COBRIA-cuaderno-de-trabajo.pdf",
    "COBRIA-anexo-tecnico.pdf",
]
DOCUMENTS = [
    "RELEASE-NOTES-1.0.0-rc1.md",
    "GUIA-REPRODUCCION-RC1.md",
    "MATRIZ-TRAZABILIDAD-RELEASE.md",
    "LICENSES.md",
    "replication/SBOM.cdx.json",
    "replication/CITATION.cff",
]


def run(*args: str) -> str:
    return subprocess.check_output(args, cwd=ROOT, text=True).strip()


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def zip_directory(directory: Path, output: Path) -> None:
    fixed = (2026, 9, 21, 0, 0, 0)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for source in sorted(path for path in directory.rglob("*") if path.is_file()):
            relative = source.relative_to(directory.parent).as_posix()
            info = zipfile.ZipInfo(relative, fixed)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, source.read_bytes())


parser = argparse.ArgumentParser()
parser.add_argument("--output", default=str(ROOT / "output" / "release" / "ecosistema-1.0.0-rc1"))
arguments = parser.parse_args()
output = Path(arguments.output).resolve()
stage = output / NAME
if output == ROOT or ROOT in output.parents and output.name == "":
    raise SystemExit("Destino inseguro")
shutil.rmtree(output, ignore_errors=True)
stage.mkdir(parents=True)

commit = run("git", "rev-parse", "--verify", f"refs/tags/{TAG}^{{commit}}")
if run("git", "status", "--porcelain"):
    raise SystemExit("El árbol de trabajo debe estar limpio antes de construir la candidata")

raw_tar = output / "fuentes.tar"
subprocess.run(["git", "archive", "--format=tar", "-o", str(raw_tar), commit], cwd=ROOT, check=True)
(stage / "fuentes.tar.gz").write_bytes(gzip.compress(raw_tar.read_bytes(), compresslevel=9, mtime=0))
raw_tar.unlink()

for name in PDF_FILES:
    source = ROOT / "output" / "pdf" / name
    if not source.is_file():
        raise SystemExit(f"Falta artefacto canónico: {source}")
    shutil.copyfile(source, stage / name)

for relative in DOCUMENTS:
    try:
        content = subprocess.check_output(["git", "show", f"{TAG}:{relative}"], cwd=ROOT)
    except subprocess.CalledProcessError as error:
        raise SystemExit(f"Falta documento de release en {TAG}: {relative}") from error
    destination = stage / Path(relative).name
    destination.write_bytes(content)

entries = []
for path in sorted(item for item in stage.iterdir() if item.is_file()):
    entries.append({"path": path.name, "bytes": path.stat().st_size, "sha256": digest(path)})

manifest = {
    "schemaVersion": "1.0.0",
    "release": "ecosistema-1.0.0-rc1",
    "status": "candidata-no-estable",
    "proposalIndependent": True,
    "officialStandard": False,
    "certified": False,
    "commit": commit,
    "sourceDateEpoch": int(run("git", "show", "-s", "--format=%ct", commit)),
    "files": entries,
    "humanValidationPending": ["lectura editorial independiente", "revisión técnica independiente", "prueba de transferencia", "evaluación de claridad"],
}
(stage / "MANIFEST-SHA256.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(stage / "SHA256SUMS").write_text("".join(f'{item["sha256"]}  {item["path"]}\n' for item in entries), encoding="utf-8")

archive = output / f"{NAME}.zip"
zip_directory(stage, archive)
summary = {"archive": archive.name, "sha256": digest(archive), "bytes": archive.stat().st_size, "commit": commit, "files": len(entries) + 2}
(output / "BUILD-SUMMARY.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
print(json.dumps(summary, ensure_ascii=False))
