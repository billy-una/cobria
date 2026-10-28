#!/usr/bin/env python3
"""Compuerta reproducible del sitio público unificado de R6."""
from __future__ import annotations

import hashlib
import json
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "sitio"
PUBLIC = SITE / "public"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"R6: {message}")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


canonical = json.loads((ROOT / "editorial/canonical.json").read_text())
require(canonical["release"]["candidateDate"] == "2026-09-23", "falta la fecha canónica de la candidata")
require(sha256(ROOT / "specification/COBRIA-CORE-1.0.md") == "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179", "Core 1.0 cambió")

legacy_files = ["index.html", "recursos.html", "core.html", "core-1-1.html", "core-1-2.html", "caso.html", "rutas.html", "errores.html", "decidir.html", "historia.html", "privacidad.html", "styles.css", "app.js", "page.js"]
require(not any((PUBLIC / name).exists() for name in legacy_files), "quedan archivos raíz del prototipo histórico")
for route in ["core-1-1", "core-1-2", "caso", "rutas", "errores", "decidir"]:
    require(not (PUBLIC / route).exists(), f"queda publicada la ruta heredada {route}")

archive = (PUBLIC / "archivo/index.html").read_text()
require('name="robots" content="noindex,nofollow"' in archive and "Archivo histórico" in archive, "el archivo histórico no está advertido o desindexado")

sitemap = (PUBLIC / "sitemap.xml").read_text()
curriculum = json.loads((ROOT / "editorial/curriculum.json").read_text())
patterns = json.loads((PUBLIC / "catalogo.json").read_text())["items"]
routes = {"/", "/explorar", "/mapa", "/laboratorio", "/recursos", "/historia", "/privacidad"}
routes.update(module["route"] for module in curriculum["modules"])
routes.update(f"/patrones/{item['slug']}" for item in patterns)
routes.update(f"/aprender/{module['key']}/{index+1}" for module in curriculum["modules"] for index in range(len(module["lessons"])))
locations = [element.text for element in ET.fromstring(sitemap).findall("{*}url/{*}loc")]
require(all(urlparse(url).scheme == "https" and urlparse(url).netloc == "cobria-atlas.sectagpt.chatgpt.site" for url in locations), "origen inesperado en sitemap")
observed = [urlparse(url).path for url in locations]
require(len(observed) == len(set(observed)), "rutas duplicadas en sitemap")
require(set(observed) == routes, "el sitemap no corresponde exactamente a módulos, lecciones, patrones y rutas públicas")
require(not re.search(r"/(core-1-1|core-1-2|caso|rutas|errores|decidir|archivo)</loc>", sitemap), "el mapa indexa rutas retiradas")

manifest = json.loads((PUBLIC / "downloads/manifest.json").read_text())
require(len(manifest["items"]) == 6, "el manifiesto no contiene las seis descargas")
for item in manifest["items"]:
    public_file = PUBLIC / item["href"].lstrip("/")
    source_file = ROOT / item["source"]
    require(public_file.is_file() and source_file.is_file(), f"falta {item['id']}")
    require(public_file.stat().st_size == item["bytes"] and sha256(public_file) == item["sha256"], f"la descarga {item['id']} no coincide con su manifiesto")
    require(source_file.stat().st_size == item["sourceBytes"] and sha256(source_file) == item["sourceSha256"], f"la fuente {item['id']} no coincide con su manifiesto")

headers = (PUBLIC / "_headers").read_text()
worker = (SITE / "worker/index.ts").read_text()
for name in ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]:
    require(name in headers and name in worker, f"falta la protección {name}")

configuration = "\n".join((SITE / name).read_text() for name in ["package.json", "vite.config.ts"])
require(not re.search(r"sqlite|drizzle|\bD1\b", configuration, re.I), "queda configuración SQLite/D1 activa")

routes.add("/archivo/")
for html in [PUBLIC / "archivo/index.html", *sorted((PUBLIC / "patrones").glob("*/index.html"))]:
    for href in re.findall(r'href="([^"]+)"', html.read_text()):
        if href.startswith(("http:", "https:", "#")):
            continue
        clean = href.split("#", 1)[0]
        if clean.startswith("/downloads/"):
            require((PUBLIC / clean.lstrip("/")).is_file(), f"enlace roto {clean} en {html}")
        elif clean.startswith("/") and "." not in Path(clean).name:
            require(clean in routes or clean.rstrip("/") in routes, f"ruta interna rota {clean} en {html}")
        elif clean.startswith("/"):
            require((PUBLIC / clean.lstrip("/")).is_file(), f"recurso roto {clean} en {html}")

print("R6 válida: sitio unificado, descargas verificadas, archivo aislado y protecciones declaradas.")
