#!/usr/bin/env python3
"""Puerta local para el cierre editorial (14) y web (15)."""

from pathlib import Path
import json
import re
import sys

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "output" / "pdf"
PUBLIC = ROOT / "sitio" / "public"

EXPECTED = {
    # Edición compartida: 85 lecciones, prácticas de operación y referencias;
    # mismo intervalo acotado que el validador R5 vigente, no un límite abierto.
    # C3 añade diez prácticas y un mapa; el conteo de contratos se prueba aparte.
    # C5 añade una página de taller HTTP, comprobada estructuralmente por R5.
    # C6 añade una página operacional, comprobada estructuralmente por R5.
    # C7 añade una página analítica, comprobada estructuralmente por R5.
    # C8 añade una página de integración real, comprobada estructuralmente por R5.
    # C9 añade una página documental, comprobada estructuralmente por R5.
    # C10 añade guía de lectura y tres páginas para separar lenguajes, sin reducir fuente.
    # Edición EP9 inspeccionada: 469 páginas; el conteo no sustituye la paridad
    # de las 85 lecciones, verificada por review-pc7-pdf.py.
    "COBRIA-ecosistema-manual-completo.pdf": (469, 469, "COBRIA: patrones, capas, datos y software verificable"),
    "COBRIA-cuaderno-de-trabajo.pdf": (8, 40, "COBRIA: cuaderno de trabajo"),
    "COBRIA-anexo-tecnico.pdf": (8, 40, "COBRIA: anexo técnico"),
    "COBRIA-articulo-cientifico-actualizado.pdf": (8, 30, "Contratos reconstruibles"),
    "COBRIA-documento-maestro-ecosistema.pdf": (150, 240, "COBRIA: diseño y evaluación"),
    "COBRIA-especificacion-ecosistema-1.0.pdf": (20, 60, "COBRIA Ecosistema 1.0"),
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
catalog = json.loads((PUBLIC / "catalogo.json").read_text(encoding="utf-8"))
if catalog.get("schemaVersion") != "1.0.0" or len(catalog.get("items", [])) != 30:
    fail("catálogo sin versión 1.0.0 o sin las 30 fichas")

# La cardinalidad se deriva de las rutas canónicas vigentes y del catálogo, en
# vez de conservar un umbral histórico que incluía páginas ya retiradas.
origin = "https://cobria-atlas.sectagpt.chatgpt.site"
canonical_routes = [
    "", "comenzar", "comenzar/desde-cero", "comenzar/proyecto-integral", "fundamentos", "arquitectura", "capas", "codigo", "documentacion", "patrones-diseno", "datos", "api-ux",
    "seguridad", "calidad", "operaciones", "ia", "construir", "herramientas",
    "evidencia", "explorar", "mapa", "laboratorio", "recursos",
    "core", "historia", "privacidad",
]
expected_urls = {f"{origin}/{route}" for route in canonical_routes}
expected_urls.update(
    f"{origin}/patrones/{item['slug']}" for item in catalog["items"]
)
curriculum = json.loads((ROOT / "editorial/curriculum.json").read_text(encoding="utf-8"))
workbook = PdfReader(PDF / "COBRIA-cuaderno-de-trabajo.pdf")
printed_solutions = " ".join(" ".join(page.extract_text() or "" for page in workbook.pages).split())
for lab in curriculum["labs"]:
    if lab["id"] in {"LAB-05", "LAB-06", "LAB-07", "LAB-08"}:
        if " ".join(lab["solution"].split()) not in printed_solutions:
            fail(f"{lab['id']}: solución oculta o incompleta en el PDF del cuaderno")
expected_urls.update(f"{origin}/aprender/{module['key']}/{index+1}" for module in curriculum["modules"] for index in range(len(module["lessons"])))
actual_urls = set(re.findall(r"<loc>([^<]+)</loc>", sitemap))
if sitemap.count("<loc>") != len(actual_urls):
    fail("sitemap con URL duplicadas")
if actual_urls != expected_urls:
    missing_urls = sorted(expected_urls - actual_urls)
    extra_urls = sorted(actual_urls - expected_urls)
    fail(f"sitemap incoherente; faltan={missing_urls}, sobran={extra_urls}")
url_count = len(actual_urls)

print(f"OK sitio: {url_count} URL, 30 fichas y {len(DOWNLOADS)} descargas canónicas")
print("CIERRE AUTOMÁTICO 14-15: APROBADO")
