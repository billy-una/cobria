#!/usr/bin/env python3
"""Normaliza metadatos editoriales sin alterar el contenido de las páginas."""
from pathlib import Path
import sys
from pypdf import PdfReader, PdfWriter

path = Path(sys.argv[1])
title = sys.argv[2]
subject = sys.argv[3]
reader = PdfReader(path)
writer = PdfWriter()
writer.append_pages_from_reader(reader)
writer.add_metadata({
    "/Title": title,
    "/Author": "Billy Jak Cordero Porras",
    "/Subject": subject,
    "/Keywords": "COBRIA, arquitectura de software, patrones, NoSQL, software verificable",
    "/Creator": "COBRIA Ecosistema 1.0",
})
temporary = path.with_suffix(".metadata.pdf")
with temporary.open("wb") as handle:
    writer.write(handle)
temporary.replace(path)
