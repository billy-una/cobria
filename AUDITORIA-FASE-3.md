# Auditoría de fase 3 — Diccionarios y contratos de datos

## Resultado

La fase 3 queda **implementada y documentada** para un caso neutral de referencia. El
diccionario cubre niveles conceptual, lógico y físico, nueve atributos, un catálogo,
índices justificados, sensibilidad, retención, procedencia, responsables y migraciones.

## Entregables

| Entregable | Archivo |
|---|---|
| fuente canónica validable | `specification/phase-3/data-dictionary.yaml` |
| explicación conceptual/lógica/física | `specification/phase-3/DICCIONARIO-DATOS.md` |
| catálogos y migraciones | `specification/phase-3/CATALOGOS-Y-MIGRACIONES.md` |
| casos válidos e inválidos | `specification/phase-3/examples/` |
| decisión sobre claves compactas | `specification/ADR-0003-CLAVES-FISICAS-AISLADAS.md` |
| validador | `replication/scripts/validate-phase3.py` |

## Gate

Cada clave física del caso posee significado, regla, procedencia, versión y responsable,
además de los metadatos ampliados exigidos por el roadmap. `n8`, `a`, `b` y `c` están
aisladas detrás del Dater y no sustituyen nombres de dominio.

## Límites

- Este caso demuestra el formato, no modela todos los datos de los proyectos de origen.
- Los plazos de retención deben fijarse con contexto organizacional y legal real.
- La fase 4 decidirá separación, anidamiento y ciclo de vida de nodos adicionales.
- La fase 11 convertirá los manifiestos aprobados en un conjunto integral de máquina.

