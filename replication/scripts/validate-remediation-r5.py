#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "specification/COBRIA-CORE-1.0.md"
BOOK = ROOT / "libro-cobria/index.html"
CSS = ROOT / "libro-cobria/theme.css"
PDF = ROOT / "output/pdf/COBRIA-ecosistema-manual-completo.pdf"
FROZEN_CORE_SHA256 = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"
ERRORS: list[str] = []


class BookParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: list[dict[str, str | None]] = []
        self.ids: list[str] = []
        self.has_main = False
        self.has_nav_label = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "img":
            self.images.append(values)
        if values.get("id"):
            self.ids.append(str(values["id"]))
        if tag == "main" and values.get("id") == "contenido-principal":
            self.has_main = True
        if tag == "nav" and values.get("aria-label") == "Contenido del libro":
            self.has_nav_label = True


def fail(message: str) -> None:
    ERRORS.append(message)


if hashlib.sha256(CORE.read_bytes()).hexdigest() != FROZEN_CORE_SHA256:
    fail("COBRIA Core 1.0 cambió respecto a su huella congelada")

html = BOOK.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")
parser = BookParser()
parser.feed(html)

checks = {
    'class="book-page beginner-practice"': 25,
    'class="book-page lesson-practice-page"': 85,
    'class="book-page data-dictionary"': 1,
    'class="book-page architecture-map"': 1,
    'class="book-page api-workshop"': 1,
    'class="book-page operation-workshop"': 1,
    'class="book-page analytics-workshop"': 1,
    'class="book-page integral-workshop"': 1,
    'class="book-page documentation-workshop"': 1,
    'class="book-page beginner-lesson"': 85,
    'class="pattern ': 30,
    'class="book-page learning-page"': 30,
    'class="book-page code-page"': 33,
    'class="book-page reader-guide-page"': 1,
    'class="book-page family-opening"': 9,
    "Fuente y prueba: TypeScript": 30,
}
for marker, expected in checks.items():
    actual = html.count(marker)
    if actual != expected:
        fail(f"{marker!r}: se esperaban {expected} apariciones y se hallaron {actual}")

for obsolete in ("mechanism-page", "decision-page", "reference-page", 'class="lab-page"', "Once módulos conectados", "Fase 23 ·"):
    if obsolete in html:
        fail(f"persiste la página repetitiva {obsolete}")

required_ids = {
    "datos-edicion", "como-usar",
    "mapa-modulos", "contenido", "casos-guiados", "glosario", "bibliografia",
}
missing_ids = sorted(required_ids - set(parser.ids))
if missing_ids:
    fail(f"faltan anclas de navegación: {missing_ids}")
if len(parser.ids) != len(set(parser.ids)):
    fail("el HTML contiene identificadores duplicados")
if not parser.has_main or not parser.has_nav_label:
    fail("la alternativa HTML no expone main y navegación accesible")
for image in parser.images:
    if not (image.get("src") and image.get("alt", "").strip()):
        fail(f"imagen sin src o texto alternativo: {image}")

required_text = [
    "COBRIA: patrones, capas, datos y software verificable",
    "Edición ecosistema 1.0.0-rc2",
    "Candidata pública RC2; propuesta independiente no estable",
    "Creative Commons Atribución 4.0 Internacional (CC BY 4.0)",
    "Procedencia visual",
    "PDF y HTML de lectura con alcance de accesibilidad declarado",
]
for text in required_text:
    if text not in html:
        fail(f"falta la identidad editorial: {text}")

for forbidden in ("jaguar", "ISBN", "depósito legal"):
    if forbidden.lower() in html.lower():
        fail(f"el libro contiene el término prohibido {forbidden!r}")

for link in re.findall(r'href="(https://github\.com/billy-una/cobria/blob/main/[^"]+)"', html):
    relative = link.split("/blob/main/", 1)[1]
    if not (ROOT / relative).is_file():
        fail(f"el enlace de código no corresponde a un archivo local: {relative}")
if html.count("/blob/main/") != 33:
    fail("los 30 ejemplos TypeScript y los tres ejemplos multilenguaje no están enlazados")

if "overflow: hidden" in re.search(r"\.code-grid pre \{([^}]*)\}", css, re.S).group(1):
    fail("el código todavía puede recortarse por overflow oculto")
if "max-height" in css:
    fail("el CSS todavía limita la altura del código")

if not PDF.is_file() or PDF.stat().st_size < 100_000:
    fail("el PDF principal no existe o parece incompleto")
else:
    try:
        from pypdf import PdfReader

        pages = len(PdfReader(str(PDF)).pages)
        # EP9 añade índice y conserva las lecciones y prácticas comprobadas arriba.
        if pages != 469:
            fail(f"el libro tiene {pages} páginas; se esperaba la edición EP9 inspeccionada de 469 páginas")
    except Exception as exc:
        fail(f"no se pudo inspeccionar el PDF: {exc}")

if ERRORS:
    print("R5 no conforme:")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print("R5 conforme: 17 partes, 85 lecciones, 9 familias, 30 patrones y 30 ejemplos enlazados; HTML accesible y PDF coherente.")
