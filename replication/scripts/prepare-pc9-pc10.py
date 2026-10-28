"""Prepara entregas locales; no publica ni acredita participación externa."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import zipfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
PDFS = ["COBRIA-ecosistema-manual-completo.pdf", "COBRIA-cuaderno-de-trabajo.pdf",
        "COBRIA-anexo-tecnico.pdf", "COBRIA-articulo-cientifico-actualizado.pdf",
        "COBRIA-documento-maestro-ecosistema.pdf", "COBRIA-especificacion-ecosistema-1.0.pdf"]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def response_errors(data):
    """Valida completitud declarativa, nunca autenticidad humana."""
    errors = []
    for key in ("candidateDigest", "participantCode", "task", "conflicts", "consentReceipt",
                "startedAt", "finishedAt", "environment", "coordinatorVerification"):
        if not data.get(key):
            errors.append("Falta " + key)
    if data.get("type") != "human" or data.get("independentWork") is not True:
        errors.append("No declara participación humana independiente")
    for key in ("observations", "evidence"):
        if not isinstance(data.get(key), list) or not data[key]:
            errors.append("Falta evidencia en " + key)
    digest = data.get("candidateDigest", "")
    if not isinstance(digest, str) or len(digest) != 64 or any(c not in "0123456789abcdef" for c in digest):
        errors.append("Huella de candidata inválida")
    return errors


def verify_archive(target):
    with zipfile.ZipFile(target) as archive:
        names = archive.namelist()
        if sum(item.file_size for item in archive.infolist()) > 512 * 1024**2:
            raise ValueError("Paquete supera el presupuesto de 512 MiB")
        if len(names) != len(set(names)):
            raise ValueError("Entradas duplicadas")
        manifest = json.loads(archive.read("MANIFEST.json"))
        entries = manifest["files"]
        if "candidateDigest" in manifest and manifest["candidateDigest"] != sha(json.dumps(entries, sort_keys=True, separators=(",", ":")).encode()):
            raise ValueError("Huella de candidata distinta del inventario")
        if len(entries) != len({e["path"] for e in entries}) or set(names) != {"MANIFEST.json", *[e["path"] for e in entries]}:
            raise ValueError("Inventario incompleto o duplicado")
        for item in entries:
            name = item["path"]
            if name.startswith("/") or "\\" in name or any(p in ("", ".", "..") for p in name.split("/")):
                raise ValueError("Ruta inválida")
            data = archive.read(name)
            if len(data) != item["bytes"] or sha(data) != item["sha256"]:
                raise ValueError("Archivo alterado: " + name)
        return manifest


def prepare():
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    dirty = bool(subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT))
    # Subconjunto explícito de revisión: no promete ser el paquete ejecutable completo.
    paths = [ROOT / p for p in ("MANIFESTO.md", "LICENSE", "LICENSES.md", "PROVENANCE.md",
             "README.md", "ROADMAP-CORRECTIVO-COBRIA.md")]
    for folder in ("editorial/pc9", "specification/core-1.0", "manuales"):
        directory = ROOT / folder
        if directory.exists():
            paths.extend(p for p in directory.rglob("*") if p.is_file())
    paths.append(ROOT / "specification/COBRIA-CORE-1.0.md")
    paths.extend(ROOT / "output/pdf" / name for name in PDFS)
    payload = {}
    for p in sorted(set(paths)):
        relative = p.relative_to(ROOT).as_posix()
        if any(parent.is_symlink() for parent in [p, *p.parents]):
            raise ValueError("Enlace rechazado: " + relative)
        data = p.read_bytes()
        if p.suffix == ".pdf" and not data.startswith(b"%PDF-"):
            raise ValueError("PDF inválido: " + relative)
        payload[relative] = data
    entries = [{"path": p, "bytes": len(d), "sha256": sha(d)} for p, d in sorted(payload.items())]
    digest = sha(json.dumps(entries, sort_keys=True, separators=(",", ":")).encode())
    manifest = {"schemaVersion": "1.0.0", "kind": "subconjunto-editorial-para-revision-no-release-ejecutable",
                "sourceHead": head, "workingTreeDirty": dirty, "candidateDigest": digest,
                "published": False, "humanValidationAsserted": False, "files": entries}
    folder = ROOT / "output/review/pc9" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    folder.mkdir(parents=True, exist_ok=False)
    target = folder / "COBRIA-revision-PC9.zip"
    with zipfile.ZipFile(target, "x", zipfile.ZIP_DEFLATED) as archive:
        for p, data in sorted(payload.items()):
            archive.writestr(p, data)
        archive.writestr("MANIFEST.json", json.dumps(manifest, ensure_ascii=False, indent=2))
    verify_archive(target)
    receipt = {"candidateDigest": digest, "sourceHead": head, "workingTreeDirty": dirty,
               "archive": str(target.relative_to(ROOT)), "archiveSha256": sha(target.read_bytes()),
               "documents": len(PDFS), "status": "preparada-no-publicable", "published": False,
               "blockers": ["PC9 sin observaciones nuevas verificadas", "CI remota del SHA final pendiente",
                            "Árbol sin commit final" if dirty else "Autorización de publicación pendiente",
                            "Recompilación final de seis PDF y cotejo con fuente congelada pendientes",
                            "Paquete de revisión es subconjunto; no sustituye distribución ejecutable ni sitio",
                            "Despliegue y cotejo público pendientes"],
               "authorization": {"authorizedBy": None, "candidateSha256": None, "scope": None, "date": None}}
    (folder / "PC10-preparacion.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(receipt, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", type=Path)
    parser.add_argument("--response", type=Path)
    args = parser.parse_args()
    if args.verify:
        print(json.dumps(verify_archive(args.verify), ensure_ascii=False, indent=2))
    elif args.response:
        errors = response_errors(json.loads(args.response.read_text()))
        print(json.dumps({"errors": errors, "authenticityVerified": False}, ensure_ascii=False, indent=2))
        raise SystemExit(1 if errors else 0)
    else:
        prepare()
