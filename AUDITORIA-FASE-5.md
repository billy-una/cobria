# Auditoría de fase 5 — Arquitectura, capas y repositorio

## Resultado

La fase 5 queda **implementada y documentada**. Se formalizaron cinco capas y ocho
responsabilidades. El ejemplo neutral ahora demuestra entidad, caso de uso, puerto,
Dater, repositorio, controlador, infraestructura criptográfica y composición.

## Entregables

| Entregable | Archivo |
|---|---|
| manifiesto de arquitectura | `specification/phase-5/architecture.yaml` |
| manual de capas | `specification/phase-5/MANUAL-DE-CAPAS.md` |
| árbol y ficha por archivo | `specification/phase-5/ESTRUCTURA-DE-CARPETAS.md` |
| reglas de dependencia | `specification/phase-5/REGLAS-DE-DEPENDENCIA.md` |
| procedencia | `specification/phase-5/PROCEDENCIA-ARQUITECTONICA.md` |
| ADR | `specification/ADR-0005-DEPENDENCIAS-HACIA-ADENTRO.md` |
| aplicación demostrativa | `replication/examples/ecosistema-app/` |
| validador | `replication/scripts/validate-phase5.py` |

## Gate

Dominio y aplicación no dependen de UI, rutas físicas ni SDK. El cálculo criptográfico
se trasladó desde aplicación a infraestructura y se inyecta en composición. El validador
comprueba dirección de imports y busca alias físicos fuera de infraestructura.

## Límites

- El análisis estático actual cubre imports ESM del ejemplo neutral, no todos los
  lenguajes o imports dinámicos.
- La conformidad arquitectónica de proyectos de referencia requiere una auditoría
  separada; su estructura inspiró el manual, pero no se declara validada.
- Seguridad, ambientes y observabilidad se profundizan en fases 7–9.

