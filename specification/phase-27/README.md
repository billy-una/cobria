# Fase 27 — expediente dimensional comparativo

Esta fase cruza la rúbrica de 24 dimensiones con los tres repositorios de referencia y
conserva la procedencia de los commits y archivos candidatos. El resultado es una cola de
72 decisiones para revisión semántica, no una calificación automática.

## Regla de honestidad

- Una coincidencia estructural propone dónde revisar; no demuestra una dimensión.
- Las 72 decisiones nacen como `pending-semantic-review`.
- No se calculan puntuaciones, rankings ni porcentajes de calidad.
- Los nombres identifican los casos reproducibles; no implican aval de sus equipos.
- La revisión operacional y humana continúa fuera del alcance de esta ejecución local.

## Reproducción

```bash
node replication/scripts/generate-phase27-dossier.mjs
make verificar-fase-27
```

El artefacto canónico es `evidence-dossier.json`. Cada celda conserva el contrato, la
dimensión, la evidencia candidata y la razón por la que todavía requiere interpretación.
