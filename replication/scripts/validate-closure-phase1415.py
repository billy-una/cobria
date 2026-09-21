#!/usr/bin/env python3
"""Puerta local para el cierre editorial (14) y web (15)."""

from pathlib import Path
import json
import sys

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "output" / "pdf"
PUBLIC = ROOT / "sitio" / "public"

EXPECTED = {
    "COBRIA-ecosistema-manual-completo.pdf": (180, 250, "COBRIA: patrones, capas, datos y software verificable"),
    "COBRIA-cuaderno-de-trabajo.pdf": (8, 40, "COBRIA: cuaderno de trabajo"),
    "COBRIA-anexo-tecnico.pdf": (8, 40, "COBRIA: anexo técnico"),
    "COBRIA-articulo-cientifico-actualizado.pdf": (8, 30, "Contratos reconstruibles"),
    "COBRIA-documento-maestro-ecosistema.pdf": (150, 240, "COBRIA: diseño y evaluación"),
    "COBRIA-especificacion-ecosistema-1.0.pdf": (2, 20, "COBRIA Ecosistema 1.0"),
}

DOWNLOADS = {
    "COBRIA-libro-web.pdf",
    "COBRIA-cuaderno.pdf",
    "COBRIA-anexo-tecnico.pdf",
    "COBRIA-articulo.pdf",
    "COBRIA-documento-maestro.pdf",
    "COBRIA-especificacion.pdf",
}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


for name, (minimum, maximum, title_fragment) in EXPECTED.items():
    path = PDF / name
    if not path.is_file():
        fail(f"falta {path.relative_to(ROOT)}")
    reader = PdfReader(path)
    pages = len(reader.pages)
    title = str((reader.metadata or {}).get("/Title", ""))
    if not minimum <= pages <= maximum:
        fail(f"{name}: {pages} páginas fuera de [{minimum}, {maximum}]")
    if title_fragment not in title:
        fail(f"{name}: metadato Title inesperado: {title!r}")
    print(f"OK PDF {name}: {pages} páginas")

download_dir = PUBLIC / "downloads"
actual_downloads = {path.name for path in download_dir.glob("*.pdf")}
missing = DOWNLOADS - actual_downloads
if missing:
    fail(f"descargas canónicas ausentes: {sorted(missing)}")
if "COBRIA-tesis.pdf" in actual_downloads:
    fail("COBRIA-tesis.pdf continúa compitiendo con el documento maestro")

required_routes = [
    "core/page.tsx", "explorar/page.tsx", "mapa/page.tsx", "laboratorio/page.tsx",
    "recursos/page.tsx", "historia/page.tsx", "privacidad/page.tsx", "evidencia/page.tsx",
]
for route in required_routes:
    if not (ROOT / "sitio" / "app" / route).is_file():
        fail(f"ruta de aplicación ausente: app/{route}")

app_text = "\n".join(path.read_text(encoding="utf-8") for path in (ROOT / "sitio" / "app").rglob("*.tsx"))
if "ad-slot" in app_text or "ad-space" in app_text:
    fail("la aplicación todavía contiene marcadores de publicidad")

sitemap = (PUBLIC / "sitemap.xml").read_text(encoding="utf-8")
url_count = sitemap.count("<url>")
if url_count < 55:
    fail(f"sitemap incompleto: {url_count} URL")

catalog = json.loads((PUBLIC / "catalogo.json").read_text(encoding="utf-8"))
if catalog.get("schemaVersion") != "1.0.0" or len(catalog.get("items", [])) != 30:
    fail("catálogo sin versión 1.0.0 o sin las 30 fichas")

print(f"OK sitio: {url_count} URL, 30 fichas y {len(DOWNLOADS)} descargas canónicas")
print("CIERRE AUTOMÁTICO 14-15: APROBADO")
