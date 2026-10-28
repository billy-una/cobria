#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

required = [
    "ROADMAP-CIERRE-ECOSISTEMA-COBRIA.md",
    "ARCHIVO-Y-FUENTES-CANONICAS.md",
    "IDENTIDAD-ECOSISTEMA-COBRIA.md",
    "editorial/release-scope.json",
    "editorial/canonical.json",
    "editorial/products.json",
    "specification/MAPA-ECOSISTEMA.md",
    "specification/COBRIA-CORE-1.0.md",
]

missing = [name for name in required if not (ROOT / name).is_file()]
assert not missing, f"Faltan archivos de cierre 0-1: {missing}"

canonical = json.loads((ROOT / "editorial/canonical.json").read_text())
scope = json.loads((ROOT / "editorial/release-scope.json").read_text())
baseline_path = ROOT / scope["inventoryOutput"]
assert baseline_path.is_file(), f"Falta inventario regenerable: {scope['inventoryOutput']}"
baseline = json.loads(baseline_path.read_text())
products = json.loads((ROOT / "editorial/products.json").read_text())

expected_modules = {
    "Primeros pasos", "Fundamentos de software", "Arquitectura de software",
    "Capas, carpetas y responsabilidades", "Código, nombres y comentarios",
    "Bases de datos y diccionario de datos", "COBRIA Core", "Patrones de diseño",
    "API, experiencia e internacionalización", "Documentación y comunicación",
    "Seguridad y privacidad", "Calidad, pruebas y rendimiento",
    "Nube, ambientes y operaciones", "Analítica e inteligencia artificial",
    "Aplicación completa", "Herramientas para personas e IA",
    "Evidencia, evolución y publicación"
}
actual_modules = set(canonical["ecosystem"]["modules"])
assert actual_modules == expected_modules, (expected_modules - actual_modules, actual_modules - expected_modules)
assert canonical["ecosystem"]["moduleCount"] == len(actual_modules)
assert canonical["identity"]["ecosystemVersion"] == "1.0.0-rc2"
assert canonical["identity"]["coreVersion"] == "1.0"
assert canonical["release"] == {
    "tag": "ecosistema-1.0.0-rc2",
    "candidateDate": "2026-09-23",
    "stableTarget": "ecosistema-1.0.0",
    "status": "candidate-non-stable",
    "label": "Candidata pública RC2",
    "proposalIndependent": True,
    "officialCertification": False,
    "stablePublished": False,
}
assert scope["targetRelease"] == "ecosistema-1.0.0"
assert scope["candidateTag"] == canonical["release"]["tag"]
assert products["version"] == canonical["identity"]["ecosystemVersion"]
assert products["status"] == canonical["release"]["status"]
assert baseline["targetRelease"] == scope["targetRelease"]
assert baseline["protectedCore"]["sha256"] == baseline["canonicalHashes"][scope["protectedCore"]]

product_ids = {product["id"] for product in products["products"]}
assert set(scope["publicProducts"]).issubset(product_ids), set(scope["publicProducts"]) - product_ids

identity = (ROOT / "IDENTIDAD-ECOSISTEMA-COBRIA.md").read_text()
for term in ["propuesta independiente", "Pattern Design", "COBRIA Core", "Ecosistema 1.0"]:
    assert term in identity, f"Identidad incompleta: {term}"

manifesto = (ROOT / "MANIFESTO.md").read_text(encoding="utf-8")
resources = (ROOT / "sitio/app/recursos/page.tsx").read_text(encoding="utf-8")
assert "candidata pública `1.0.0-rc2`" in manifesto
assert "candidata no estable" in resources.lower()
assert "cobria.identity.ecosystemVersion" in resources

print("Fases de cierre 0-1 verificadas: inventario, fuentes, identidad, módulos y versiones coherentes.")
