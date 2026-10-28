"""Contratos estructurales para el sitio que renderiza el currículo compartido.

No sustituye pruebas renderizadas ni evaluación de comprensión con participantes.
"""
import json
from pathlib import Path


def require_modules(root: Path, expected: dict[str, str], errors: list[str]) -> None:
    curriculum = json.loads((root / "editorial/curriculum.json").read_text(encoding="utf-8"))
    modules = {module["key"]: module for module in curriculum["modules"]}
    renderer = (root / "sitio/app/manual.tsx").read_text(encoding="utf-8")
    if "editorial/curriculum.json" not in renderer or "page.lessons.map" not in renderer:
        errors.append("el sitio no renderiza el currículo compartido")
    sitemap = (root / "sitio/public/sitemap.xml").read_text(encoding="utf-8")
    for key, route in expected.items():
        module = modules.get(key)
        if not module or module.get("route") != route:
            errors.append(f"módulo o ruta pública incorrectos: {key} {route}")
            continue
        wrapper = root / f"sitio/app/{route.lstrip('/')}/page.tsx"
        page = wrapper.read_text(encoding="utf-8") if wrapper.is_file() else ""
        standard_binding = f'kind="{key}"' in page
        inline_binding = all(token in page for token in ("editorial/curriculum.json", f'item.key === "{key}"', "learningModule.lessons.map"))
        if not standard_binding and not inline_binding:
            errors.append(f"la página {route} no selecciona el módulo {key}")
        if not all(module.get(field) for field in ("title", "project", "deliverable", "checkpoint", "outcomes")):
            errors.append(f"módulo incompleto: {key}")
        lessons = module.get("lessons", [])
        if len(lessons) < 5:
            errors.append(f"módulo sin la secuencia mínima: {key}")
        for index, lesson in enumerate(lessons, 1):
            if not all(lesson.get(field) for field in ("title", "situation", "simple", "steps", "example", "mistake", "evidence", "code")):
                errors.append(f"lección incompleta: {key}/{index}")
            if f"/aprender/{key}/{index}</loc>" not in sitemap:
                errors.append(f"lección no indexada: {key}/{index}")
