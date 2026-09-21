#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

required = [
    "ROADMAP-CIERRE-ECOSISTEMA-COBRIA.md",
    "ARCHIVO-Y-FUENTES-CANONICAS.md",
    "IDENTIDAD-ECOSISTEMA-COBRIA.md",
    "editorial/release-scope.json",
    "editorial/generated/release-baseline.json",
    "editorial/canonical.json",
    "editorial/products.json",
    "specification/MAPA-ECOSISTEMA.md",
    "specification/COBRIA-CORE-1.0.md",
]

missing = [name for name in required if not (ROOT / name).is_file()]
assert not missing, f"Faltan archivos de cierre 0-1: {missing}"

canonical = json.loads((ROOT / "editorial/canonical.json").read_text())
scope = json.loads((ROOT / "editorial/release-scope.json").read_text())
baseline = json.loads((ROOT / "editorial/generated/release-baseline.json").read_text())
products = json.loads((ROOT / "editorial/products.json").read_text())

expected_modules = {
    "Manifesto", "Fundamentos", "Layers", "Pattern Design", "Data", "Core",
    "API & UX", "Security", "Quality", "Performance", "Cloud & Operations",
    "Analytics & AI", "Engineering", "Build", "Toolkit", "Evidence", "Knowledge"
}
actual_modules = set(canonical["ecosystem"]["modules"])
assert actual_modules == expected_modules, (expected_modules - actual_modules, actual_modules - expected_modules)
assert canonical["ecosystem"]["moduleCount"] == len(actual_modules)
assert canonical["identity"]["ecosystemVersion"] == "1.0.0"
assert canonical["identity"]["coreVersion"] == "1.0"
assert scope["targetRelease"] == "ecosistema-1.0.0"
assert baseline["targetRelease"] == scope["targetRelease"]
assert baseline["protectedCore"]["sha256"] == baseline["canonicalHashes"][scope["protectedCore"]]

product_ids = {product["id"] for product in products["products"]}
assert set(scope["publicProducts"]).issubset(product_ids), set(scope["publicProducts"]) - product_ids

identity = (ROOT / "IDENTIDAD-ECOSISTEMA-COBRIA.md").read_text()
for term in ["propuesta independiente", "Pattern Design", "COBRIA Core", "Ecosistema 1.0"]:
    assert term in identity, f"Identidad incompleta: {term}"

print("Fases de cierre 0-1 verificadas: inventario, fuentes, identidad, módulos y versiones coherentes.")
