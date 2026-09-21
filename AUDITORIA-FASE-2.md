# Auditoría de fase 2 — Requisitos, actores y decisiones

## Resultado

La fase 2 queda **implementada y documentada**. Se definieron 10 actores, 8 objetivos,
12 casos de uso, 14 requisitos funcionales y 10 no funcionales. Cada requisito posee
aceptación, prueba o gate y relación trazable.

## Entregables

| Entregable | Archivo |
|---|---|
| actores y objetivos | `specification/phase-2/ACTORES-Y-OBJETIVOS.md` |
| casos de uso | `specification/phase-2/CASOS-DE-USO.md` |
| requisitos y aceptación | `specification/phase-2/REQUISITOS-ECOSISTEMA.md` |
| matriz de trazabilidad | `specification/phase-2/TRAZABILIDAD.md` |
| decisión de doble nivel | `specification/ADR-0002-REQUISITOS-DOBLE-NIVEL.md` |
| validador estructural | `replication/scripts/validate-phase2.py` |

## Gate

- ningún componente obligatorio definido en fase 2 carece de requisito;
- ningún requisito carece de aceptación o prueba/gate declarado;
- las pruebas pendientes se identifican como planificadas;
- los requisitos del ecosistema no alteran COBRIA Core.

## Límites

El validador comprueba integridad documental, no calidad semántica ni ejecución de los
gates futuros. Las fases 3–18 deben sustituir estados planificados por evidencia real.
La revisión independiente sigue reservada para la fase 18.

