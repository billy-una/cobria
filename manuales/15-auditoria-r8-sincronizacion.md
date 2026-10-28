# Auditoría R8: sincronización científica y editorial

## Dictamen

La compuerta automática R8 queda cerrada para la evidencia interna disponible. El
artículo, el documento maestro, el libro y el sitio consumen un derivado común generado
desde `replication/results/core-r7-statistics/summary.json`. La especificación normativa
permanece separada de la narrativa experimental y Core 1.0 conserva su huella congelada.

## Fuente única y productos

`replication/scripts/sync-editorial.mjs` verifica la completitud de R7 y genera:

- `editorial/generated/evidence-r7.json` y `evidence-r7.tex`;
- la copia pedagógica para el libro;
- el JSON público y el módulo TypeScript para el sitio;
- afirmaciones clasificadas con fuente y productos permitidos.

Las cifras compartidas son 270 observaciones confirmatorias internas, tres motores,
tres escalas, treinta corridas por celda y 630 observaciones de alternativas. Las
versiones, arquitecturas y huellas de los eventos crudos también viajan en el derivado.

## Resultado que no se ocultó

OpenSearch 3.2.0 con `n=100` es no concluyente para la comparación de lectura. El
artículo, el maestro, el libro y el sitio lo presentan junto con el alcance de la
inferencia. Las otras ocho celdas favorables no se convierten en una afirmación de
superioridad universal.

## Límites vigentes

Esta fase no cierra la réplica externa independiente, el estudio de transferencia ni el
doble cribado bibliográfico. Tampoco convierte la microcomparación algorítmica de 630
observaciones en evidencia de rendimiento distribuido. COBRIA continúa como propuesta
independiente y candidata no estable.

## Reproducción

```bash
make verificar-r7
make sincronizar-editorial
make verificar-r8
make verificar
```
