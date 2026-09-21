# Fase 19 — COBRIA Engineering

**Estado:** implementada y verificable localmente  
**Alcance:** ecosistema pedagógico y operativo; no modifica COBRIA Core 1.0

## Propósito

COBRIA Engineering convierte prácticas de construcción y operación en contratos que una
persona o un agente de IA puede aplicar y comprobar. Une UX operativa, autoridad de
negocio, trabajo sin conexión, observabilidad, entrega, rendimiento, costo, mantenimiento
de legado e incidentes sin confundir esas prácticas con conformidad COBRIA Core.

## Entregables

- `REQUISITOS-ENGINEERING.md`: ocho requisitos con aceptación y prueba.
- `PATRONES-OPERATIVOS.md`: catálogo pedagógico y ejemplos neutrales.
- `engineering-patterns.json`: representación legible por herramientas.
- `MODELO-DE-ADOPCION.md`: recorrido gradual y criterio de salida.
- `PROCEDENCIA-POSGUAPILES.md`: observaciones trazables y límites de generalización.
- `status.json`: estado honesto de la fase.
- `replication/scripts/validate-phase19.py`: gate automático.

## Gate

La fase es válida cuando los ocho contratos poseen identidad, problema, obligación,
aceptación, prueba, responsable, costo y criterio de retiro; libro, sitio, manuales y
roadmap reconocen COBRIA Engineering; y ninguna observación contextual se presenta como
resultado universal.

## Límites

La validación local demuestra consistencia documental y cobertura estructural. No
demuestra disponibilidad, rendimiento, seguridad o recuperación en producción. Esas
afirmaciones requieren infraestructura, incidentes controlados y revisión independiente.
