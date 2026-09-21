#!/usr/bin/env python3
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
errors = []

def run(command, cwd=ROOT):
    result = subprocess.run(command, cwd=cwd, capture_output=True, text=True)
    if result.returncode:
        errors.append(result.stdout.strip() or result.stderr.strip() or f"falló {' '.join(command)}")
    return result

run(["node", "replication/scripts/generate-pattern-catalog.mjs"])

taxonomy = json.loads((ROOT / "specification/pattern-taxonomy.json").read_text())
catalog = json.loads((ROOT / "editorial/generated/pattern-catalog.json").read_text())
required = set(taxonomy["requiredFields"])
names = {item["nombre"] for item in catalog["items"]}

if catalog["itemCount"] != 30 or len(catalog["items"]) != 30:
    errors.append("el catálogo no contiene 30 patrones")
if set(catalog["families"]) != set(taxonomy["families"]):
    errors.append("familias del catálogo y taxonomía no coinciden")
for item in catalog["items"]:
    missing = required - set(item)
    if missing:
        errors.append(f"{item.get('slug')}: faltan {sorted(missing)}")
    if set(item.get("codigo", {})) != {"TypeScript", "Python", "Java", "Go"}:
        errors.append(f"{item.get('slug')}: ejemplos multilenguaje incompletos")
    for relation in item.get("relaciones", []):
        if relation.get("target") not in names:
            errors.append(f"{item.get('slug')}: relación rota {relation}")

patterns_manual = (ROOT / "manuales/03-pattern-design.md").read_text()
for marker in ("Familias del catálogo", "Plantilla obligatoria", "Antipatrones transversales", "Criterio de avance"):
    if marker not in patterns_manual:
        errors.append(f"Pattern Design no contiene {marker}")

data_manual = (ROOT / "manuales/04-bases-de-datos.md").read_text()
for marker in ("Construir el diccionario desde cero", "a`–`h", "Decidir si separar un nodo", "Core como nivel avanzado", "Adaptadores y conformidad", "Laboratorio Data"):
    if marker not in data_manual:
        errors.append(f"Data no contiene {marker}")

run(["python3", "replication/scripts/validate-phase3.py"])
run(["python3", "replication/scripts/validate-phase4.py"])

for adapter in ("lokijs", "pouchdb"):
    with tempfile.TemporaryDirectory(prefix=f"cobria-{adapter}-") as output:
        result = run([
            "node", "replication/src/cli.mjs", "verificar", "--adaptador", adapter,
            "--tamano", "30", "--salida", output, "--json"
        ])
        report_path = Path(output) / "informe.json"
        if result.returncode == 0 and report_path.is_file():
            report = json.loads(report_path.read_text())
            if report.get("specification") != "COBRIA Core 1.0":
                errors.append(f"{adapter}: especificación incorrecta")
            if report.get("profile") not in {"C1 FUNCIONAL", "C2 FUNCIONAL", "C3 FUNCIONAL"}:
                errors.append(f"{adapter}: perfil inválido {report.get('profile')}")
        elif not report_path.is_file():
            errors.append(f"{adapter}: no produjo informe")

if errors:
    print("Fases de cierre 4-5 inválidas:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print("Fases de cierre 4-5 válidas: 30 patrones completos, 9 familias, Data validado y 2 adaptadores locales conformes.")
