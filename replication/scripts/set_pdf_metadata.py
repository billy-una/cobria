#!/usr/bin/env python3
"""Normaliza metadatos editoriales sin alterar el contenido de las páginas."""
from pathlib import Path
import sys
import json
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject

path = Path(sys.argv[1])
if path.is_symlink() or not path.is_file():
    raise SystemExit('PDF de entrada no regular')
title = sys.argv[2]
subject = sys.argv[3]
reader = PdfReader(path)
canonical = json.loads((Path(__file__).resolve().parents[2] / 'editorial/canonical.json').read_text()) if (Path(__file__).resolve().parents[2] / 'editorial/canonical.json').exists() else None
writer = PdfWriter()
# Conservar árbol semántico, destinos y navegación; copiar solo páginas los pierde.
writer.clone_document_from_reader(reader)
writer._root_object[NameObject('/Lang')] = TextStringObject('es')
writer.add_metadata({
    "/Title": title,
    "/Author": "Billy Jak Cordero Porras",
    "/Subject": subject,
    "/Keywords": "COBRIA, arquitectura de software, patrones, NoSQL, software verificable",
    "/Creator": "COBRIA Ecosistema " + (canonical['identity']['ecosystemVersion'] if canonical else '1.0'),
})
temporary = path.with_suffix(".metadata.pdf")
if temporary.exists() or temporary.is_symlink():
    raise SystemExit('La salida temporal ya existe; no se sobrescribe')
with temporary.open("wb") as handle:
    writer.write(handle)
temporary.replace(path)
