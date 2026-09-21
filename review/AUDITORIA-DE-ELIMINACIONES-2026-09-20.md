# Auditoría de eliminaciones del repositorio COBRIA

**Fecha:** 20 de septiembre de 2026  
**Universo revisado:** 66 rutas marcadas como eliminadas respecto de `HEAD`  
**Resultado:** 51 restauradas, 3 recreadas con licencia vigente y 12 eliminaciones aceptadas.

## Criterios

- **Restaurar:** evidencia, protocolo, prueba, fuente o recurso todavía referenciado.
- **Recrear:** el propósito sigue vigente, pero el contenido anterior contradice la
  licencia o metadatos actuales.
- **Eliminar:** salida generada, marcador vacío o fuente editorial reemplazada.

## Restauradas: 51

### Estudio, prerregistro y revisión

- `human-study/CONSENT-DRAFT.md`
- `human-study/PROTOCOL.md`
- `human-study/TASKS.md`
- `human-study/data-template.csv`
- `preregistration/OSF-PREREGISTRATION.md`
- `review/RESPONSE-MATRIX.md`

Se conservan como material preparado, no como evidencia de ejecución humana.

### Libro y documento maestro

- `libro-cobria/assets/linaje-ia-v1.png`
- `libro-cobria/assets/repositorio-ambito-sin-felinos-v2.png`
- `libro-cobria/theme.css`
- `partes/parte-viii-anexos-reproducibilidad.tex`

Los recursos del libro continúan referenciados. El anexo vuelve a formar parte del
documento maestro en lugar de activar la nota de ausencia.

### Código, análisis y pruebas

- `replication/analysis/analyze.py`
- `replication/analysis/generate_context_figures.py`
- `replication/scripts/build-release-manifest.py`
- `replication/src/semirealistic-generator.mjs`
- `replication/tests/core.test.mjs`

Su eliminación reducía reproducibilidad o cobertura, aunque algunos flujos sean
históricos.

### Protocolos históricos

- `replication/protocol/PHASE2-AMENDMENT-001.md`
- `replication/protocol/PHASE3-AMENDMENT-001.md`
- `replication/protocol/preregistered-phase2.json`
- `replication/protocol/preregistered-phase3.json`

Las enmiendas y prerregistros no deben desaparecer después de observar resultados.

### Controles SQL históricos segregados

Se restauraron los 18 artefactos eliminados bajo
`replication/historical/sql-controls/`: informe del emulador, serie longitudinal,
manifiestos, datos crudos, resúmenes, efectos pareados, análisis, tabla, figura y tres
scripts. Permanecen fuera del corpus confirmatorio NoSQL, pero preservan la historia del
programa experimental.

### Evidencia NoSQL histórica

Se restauraron 14 artefactos bajo `replication/results/`: dos figuras contextuales,
cinco figuras de experimentos, cuatro manifiestos, datos crudos, resumen procesado y
tabla de resultados. La restauración conserva procedencia; no convierte estos datos en
evidencia confirmatoria vigente.

## Recreadas: 3

- `replication/LICENSE`: MIT fue sustituida por Apache-2.0.
- `replication/DATA-LICENSE`: CC0 fue sustituida por CC BY 4.0.
- `replication/.zenodo.json`: actualizado a `1.0.0-rc1`, Apache-2.0 y nota explícita
  sobre CC BY 4.0, firma, DOI y réplica pendientes.

El manifiesto de réplica fue regenerado y contiene las huellas de los 233 archivos
actuales del paquete.

## Eliminaciones aceptadas: 12

### Reemplazos editoriales

- `blind-main.tex`: reemplazado por `review/blind-article.tex`.
- `prelibro-catalogo-cobria.tex`: reemplazado por el libro HTML canónico y su generador.

### Marcadores innecesarios

- `build/.gitkeep`
- `output/pdf/.gitkeep`

Los directorios ya contienen artefactos o se crean durante la construcción.

### Salidas QA regenerables

- `output/qa/blind-cover.png`
- `output/qa/es-blind-cover.png`
- `output/qa/es-cover.png`
- `output/qa/phase2-cover.png`
- `output/qa/results-145.png`
- `output/qa/results-146.png`

Son capturas derivadas, no fuentes ni evidencia experimental primaria.

### Paquetes obsoletos

- `output/release/COBRIA-paquete-reproducible-espanol-v2.1.0.zip`
- `output/release/COBRIA-paquete-reproducible-fase-3.zip`

Fueron reemplazados por `output/release/phase18-transfer`, con manifiesto 1.1 y proceso
de verificación limpio.

## Estado para consolidación

Las eliminaciones restantes son deliberadas y justificadas. Antes del commit todavía
deben revisarse como conjunto los archivos nuevos y modificados, ejecutar todos los
gates y decidir el mensaje y alcance del commit. Esta auditoría no declara ejecutadas
las actividades humanas o externas pendientes.
