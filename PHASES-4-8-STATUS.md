# COBRIA — Fases 4 a 8

Fecha de corte: 6 de septiembre de 2026.

Este documento convierte los pendientes externos ya declarados por COBRIA en cinco fases con criterios de cierre verificables. Una fase que depende de revisores, participantes, nodos externos o depósitos autenticados no se marca como completada sin esa evidencia.

## Fase 4 — revisión independiente

**Objetivo:** someter especificación, paquete y resultados a personas que no hayan redactado el código, la especificación ni la evidencia.

**Preparado internamente:**
- protocolo `review/INDEPENDENT-REVIEW-1.1.md`;
- rúbrica ciega;
- matriz de respuesta;
- gate machine-readable en `replication/protocol/phases-4-8.json`.

**Cierre externo requerido:** al menos un dictamen independiente, una réplica externa ejecutada y cero hallazgos mayores abiertos.

**Estado:** instrumentada; pendiente de terceros.

## Fase 5 — estudio humano y evaluación humana de IA

**Objetivo:** medir mantenibilidad/comprensión y evaluar la evidencia de IA con personas reales.

**Preparado internamente:** protocolo cruzado, consentimiento borrador, tareas, plantilla de datos y validaciones de cierre.

**Cierre externo requerido:** mínimo piloto de cuatro participantes reales, consentimiento, aprobación/exención ética cuando corresponda, análisis congelado y al menos una evaluación humana de IA. Los datos sintéticos no sirven para cerrar esta fase.

**Estado:** instrumentada; pendiente de participantes y autorización ética cuando corresponda.

## Fase 6 — réplica distribuida real

**Objetivo:** salir del smoke local y ejecutar la matriz congelada en nodos reales con al menos MongoDB y CouchDB.

**Preparado internamente:** runners confirmatorios de fases 2/3, infraestructura reproducible, CAS por motor, manifiestos y gate de entorno.

**Cierre externo requerido:** `environmentType=real-nodes`, matrices completas conformes en dos motores, prueba de fallo/rollback y cero violaciones de ámbito.

**Estado:** instrumentada; pendiente de infraestructura real y ejecución completa.

## Fase 7 — comparación industrial y transferencia

**Objetivo:** comparar COBRIA con mecanismos industriales y verificar que terceros puedan implementar C2 desde la especificación.

**Preparado internamente:** estudio de transferencia, mapa de literatura, método de adopción y criterios machine-readable.

**Cierre externo requerido:** comparación independiente que incluya CQRS, Event Sourcing e índices nativos; mínimo seis desarrolladores en tres equipos; implementación sin asistencia del autor y análisis de divergencias/defectos.

**Estado:** instrumentada; pendiente de equipos externos y comparación ejecutada.

## Fase 8 — release archivado, citable y firmado

**Objetivo:** producir una versión pública inmutable y verificable.

**Preparado internamente:** `CITATION.cff`, metadatos Zenodo, SBOM, release manifest y checklist OSF/Zenodo.

**Cierre externo requerido:** release público, DOI real, firmas verificadas, imágenes por digest y eliminación de placeholders de DOI del `CITATION.cff` y manuscrito.

**Estado:** instrumentada; pendiente de cuentas externas autorizadas y depósito.

## Comprobación automática

Desde `replication/`:

```bash
npm run phases:4-8:check
```

El comando devuelve código distinto de cero mientras falte evidencia real. Esto impide que documentación o archivos vacíos conviertan una fase externa en un resultado supuestamente ejecutado.

## Evidencia esperada

Los nombres y requisitos mínimos de los archivos de evidencia están congelados en `replication/protocol/phases-4-8.json`. La evidencia externa debe conservar fecha, versión/commit evaluado, responsable independiente o entorno, resultado negativo cuando exista y trazabilidad al artefacto original.
