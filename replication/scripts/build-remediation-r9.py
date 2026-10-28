#!/usr/bin/env python3
"""Construye RC2 dos veces desde clones limpios y prepara un paquete verificable."""

from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parents[2]
TAG = "ecosistema-1.0.0-rc2"
NAME = "COBRIA-Ecosistema-1.0.0-rc2"
CORE_SHA256 = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"
PDFS = (
    "COBRIA-especificacion-ecosistema-1.0.pdf",
    "COBRIA-articulo-cientifico-actualizado.pdf",
    "COBRIA-documento-maestro-ecosistema.pdf",
    "COBRIA-ecosistema-manual-completo.pdf",
    "COBRIA-cuaderno-de-trabajo.pdf",
    "COBRIA-anexo-tecnico.pdf",
)
DOCUMENTS = (
    "RELEASE-NOTES-1.0.0-rc2.md",
    "GUIA-REPRODUCCION-RC2.md",
    "INCIDENCIAS-CONOCIDAS-1.0.0-rc2.md",
    "LICENSE",
    "LICENSE-CODE.txt",
    "LICENSE-CONTENT.md",
    "LICENSES.md",
    "NOTICE",
    "PROVENANCE.md",
    "CITATION.cff",
)


def run(args: list[str], cwd: Path, env: dict[str, str] | None = None) -> str:
    completed = subprocess.run(args, cwd=cwd, env=env, check=True, text=True, stdout=sys.stdout, stderr=sys.stderr)
    return completed.stdout or ""


def capture(args: list[str], cwd: Path) -> str:
    return subprocess.check_output(args, cwd=cwd, text=True).strip()


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def deterministic_zip(source: Path, output: Path, prefix: str | None = None) -> None:
    fixed = (2026, 9, 23, 0, 0, 0)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for item in sorted(path for path in source.rglob("*") if path.is_file()):
            relative = item.relative_to(source).as_posix()
            name = f"{prefix}/{relative}" if prefix else relative
            info = zipfile.ZipInfo(name, fixed)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, item.read_bytes())


def create_source_archive(clone: Path, commit: str, output: Path) -> None:
    raw = output.with_suffix("")
    subprocess.run(["git", "archive", "--format=tar", "-o", str(raw), commit], cwd=clone, check=True)
    output.write_bytes(gzip.compress(raw.read_bytes(), compresslevel=9, mtime=0))
    raw.unlink()


def create_sbom(clone: Path, output: Path, commit: str) -> None:
    components: dict[tuple[str, str], dict[str, str]] = {}
    for relative in ("replication/package-lock.json", "sitio/package-lock.json", "libro-cobria/package-lock.json"):
        lock = json.loads((clone / relative).read_text(encoding="utf-8"))
        for name, metadata in lock.get("packages", {}).items():
            if not name or not name.startswith("node_modules/") or not metadata.get("version"):
                continue
            package_name = name.removeprefix("node_modules/")
            version = str(metadata["version"])
            components[(package_name, version)] = {
                "type": "library",
                "name": package_name,
                "version": version,
                "purl": f"pkg:npm/{package_name}@{version}",
            }
    sbom = {
        "bomFormat": "CycloneDX",
        "specVersion": "1.5",
        "serialNumber": "urn:uuid:00000000-0000-4000-8000-000000000002",
        "version": 1,
        "metadata": {
            "timestamp": "2026-09-23T00:00:00Z",
            "component": {"type": "application", "name": "cobria-ecosistema", "version": "1.0.0-rc2"},
            "properties": [{"name": "cobria:commit", "value": commit}],
        },
        "components": [components[key] for key in sorted(components)],
    }
    output.write_text(json.dumps(sbom, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def pdf_fingerprint(pdf: Path) -> dict[str, object]:
    from pypdf import PdfReader

    reader = PdfReader(str(pdf))
    text = "\n".join((page.extract_text() or "").strip() for page in reader.pages)
    normalized = " ".join(text.split()).encode("utf-8")
    return {
        "bytes": pdf.stat().st_size,
        "sha256": digest(pdf),
        "pages": len(reader.pages),
        "semanticSha256": hashlib.sha256(normalized).hexdigest(),
    }


def finalize_stage(stage: Path, commit: str, comparison: dict[str, object] | None = None) -> dict[str, object]:
    if comparison is not None:
        (stage / "COMPARACION-DOBLE-CONSTRUCCION.json").write_text(
            json.dumps(comparison, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    ignored = {"MANIFEST-SHA256.json", "SHA256SUMS"}
    entries = []
    for item in sorted(path for path in stage.iterdir() if path.is_file() and path.name not in ignored):
        entries.append({"path": item.name, "bytes": item.stat().st_size, "sha256": digest(item)})
    manifest = {
        "schemaVersion": "1.0.0",
        "release": TAG,
        "status": "candidate-non-stable",
        "proposalIndependent": True,
        "officialStandard": False,
        "certified": False,
        "published": False,
        "commit": commit,
        "coreSha256": CORE_SHA256,
        "sourceDateEpoch": int(capture(["git", "show", "-s", "--format=%ct", commit], ROOT)),
        "files": entries,
        "humanGates": ["autorizar despliegue", "crear GitHub Release", "firmar o promover versión estable"],
    }
    (stage / "MANIFEST-SHA256.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (stage / "SHA256SUMS").write_text(
        "".join(f'{entry["sha256"]}  {entry["path"]}\n' for entry in entries), encoding="utf-8"
    )
    return manifest


def build_once(repository: Path, destination: Path, commit: str, epoch: str, reference_root: Path | None = None) -> dict[str, object]:
    destination.mkdir(parents=True, exist_ok=True)
    clone = destination / "clone"
    stage = destination / NAME
    run(["git", "clone", "--quiet", "--no-hardlinks", str(repository), str(clone)], destination)
    run(["git", "checkout", "--quiet", commit], clone)
    if capture(["git", "status", "--porcelain"], clone):
        raise RuntimeError("el clon dejó de estar limpio antes de construir")

    environment = os.environ.copy()
    environment.update({"SOURCE_DATE_EPOCH": epoch, "TZ": "UTC", "LC_ALL": "C.UTF-8", "LANG": "C.UTF-8"})
    if reference_root is not None:
        environment["COBRIA_REFERENCE_ROOT"] = str(reference_root)
    for package in ("replication", "sitio", "libro-cobria"):
        run(["npm", "ci", "--no-audit", "--no-fund", "--prefix", package], clone, environment)
    run(["npx", "playwright", "install", "chromium"], clone / "libro-cobria", environment)
    run(["make", "verificar-publicacion"], clone, environment)

    stage.mkdir(parents=True)
    pdf_report: dict[str, object] = {}
    for name in PDFS:
        source = clone / "output" / "pdf" / name
        if not source.is_file():
            raise RuntimeError(f"falta PDF canónico en construcción limpia: {name}")
        shutil.copy2(source, stage / name)
        pdf_report[name] = pdf_fingerprint(source)
    for relative in DOCUMENTS:
        shutil.copy2(clone / relative, stage / Path(relative).name)

    site_archive = stage / "COBRIA-sitio-estatico.zip"
    deterministic_zip(clone / "sitio" / "dist", site_archive, "sitio")
    create_source_archive(clone, commit, stage / "COBRIA-fuentes.tar.gz")
    create_sbom(clone, stage / "SBOM.cdx.json", commit)
    finalize_stage(stage, commit)
    deterministic_zip(stage, destination / f"{NAME}.zip", NAME)
    return {
        "commit": commit,
        "coreSha256": digest(clone / "specification" / "COBRIA-CORE-1.0.md"),
        "pdfs": pdf_report,
        "siteSha256": digest(site_archive),
        "sbomSha256": digest(stage / "SBOM.cdx.json"),
        "sourceSha256": digest(stage / "COBRIA-fuentes.tar.gz"),
    }


def compare(first: dict[str, object], second: dict[str, object]) -> dict[str, object]:
    problems: list[str] = []
    if first["commit"] != second["commit"]:
        problems.append("los commits difieren")
    if first["coreSha256"] != CORE_SHA256 or second["coreSha256"] != CORE_SHA256:
        problems.append("Core 1.0 no conserva la huella congelada")
    for name in PDFS:
        left = first["pdfs"][name]
        right = second["pdfs"][name]
        if left["pages"] != right["pages"] or left["semanticSha256"] != right["semanticSha256"]:
            problems.append(f"el contenido semántico de {name} no es reproducible")
    for key in ("siteSha256", "sbomSha256", "sourceSha256"):
        if first[key] != second[key]:
            problems.append(f"la salida {key} no es idéntica")
    return {
        "schemaVersion": "1.0.0",
        "release": TAG,
        "commit": first["commit"],
        "builds": 2,
        "automaticBlockers": problems,
        "decision": "pass" if not problems else "fail",
        "comparisonPolicy": {
            "pdf": "mismo texto normalizado y número de páginas; la huella binaria se conserva para auditoría",
            "siteSbomSources": "igualdad SHA-256 exacta",
        },
        "first": first,
        "second": second,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "output" / "release" / TAG))
    parser.add_argument("--reference-root", help="carpeta local con los repositorios de referencia; no se incluyen en el paquete")
    args = parser.parse_args()
    reference_root = Path(args.reference_root).resolve(strict=True) if args.reference_root else None
    if reference_root is not None and not reference_root.is_dir():
        raise SystemExit("la carpeta de referencias no es un directorio")
    output = Path(args.output).resolve()
    allowed = (ROOT / "output" / "release").resolve()
    if output == allowed or allowed not in output.parents:
        raise SystemExit("el destino debe ser un subdirectorio específico de output/release")
    if capture(["git", "status", "--porcelain"], ROOT):
        raise SystemExit("R9 exige confirmar los cambios y construir desde un commit con árbol limpio")
    commit = capture(["git", "rev-parse", "HEAD"], ROOT)
    epoch = capture(["git", "show", "-s", "--format=%ct", commit], ROOT)
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        raise SystemExit("el destino ya existe; elija otra carpeta para conservar construcciones anteriores")
    output.mkdir()

    with tempfile.TemporaryDirectory(prefix="cobria-r9-") as temporary:
        temp = Path(temporary)
        first = build_once(ROOT, temp / "build-a", commit, epoch, reference_root)
        second = build_once(ROOT, temp / "build-b", commit, epoch, reference_root)
        report = compare(first, second)
        report["referenceInputs"] = {
            "mode": "explicit-local-repositories" if reference_root else "declared-remote-or-sibling",
            "repositories": ["POSGUAPILES-1", "CRMHOTEL_NUEVO", "BSHandball"],
            "includedInArchive": False,
            "publicStandaloneReproduction": False,
            "note": "Las fases 21–25 requieren acceso a los repositorios y commits congelados en specification; no se omiten estas pruebas.",
        }
        if report["decision"] != "pass":
            raise SystemExit(json.dumps(report, ensure_ascii=False, indent=2))
        shutil.copytree(temp / "build-a" / NAME, output / NAME)
        stage = output / NAME
        finalize_stage(stage, commit, report)
        archive = output / f"{NAME}.zip"
        deterministic_zip(stage, archive, NAME)
        summary = {
            "release": TAG,
            "status": "candidate-built-not-published",
            "commit": commit,
            "archive": archive.name,
            "bytes": archive.stat().st_size,
            "sha256": digest(archive),
            "automaticBlockers": [],
            "humanPublicationPending": True,
            "referenceInputs": report["referenceInputs"],
        }
        (output / "BUILD-SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
