# Auditoría de las 23 eliminaciones pendientes

Fecha: 16 de octubre de 2026. Base inspeccionada:
`7b5293db626aa71ed04fe552610260224a410518`.

## Alcance, autoridad y límites

Continuación del cierre local autorizado: conservar fuentes y procedencia antes de
consolidar el candidato. No se modifica Core 1.0, no se ejecutan experimentos ni se
publica. Restaurar datos desde Git conserva evidencia histórica; no representa una
nueva medición ni prueba su validez externa. La auditoría de septiembre no describe
el árbol de trabajo actual y no basta para aprobar estas eliminaciones.

## Recuperaciones: 17 rutas

Recuperadas del objeto Git de la base indicada, sin recalcular resultados:

- `preregistration/DEPOSIT-CHECKLIST.md`.
- `replication/historical/sql-controls/results/phase2/firebase-emulator/report.json`.
- `replication/historical/sql-controls/results/phase2/manifests/sqlite-2026-08-23T06-26-53-804Z.json`.
- `replication/historical/sql-controls/results/phase2/raw/persistent-sqlite.jsonl`.
- `replication/historical/sql-controls/results/phase3/raw/postgres.jsonl`.
- `replication/historical/sql-controls/scripts/run-postgres-phase3.mjs`.
- `replication/protocol/AMENDMENT-001.md`.
- `replication/protocol/PILOT-NOTES.md`.
- `replication/protocol/frozen-config.json`.
- `replication/results/figures/r2-incremental.tex`.
- `replication/results/raw/pilot.jsonl`.
- `replication/scripts/analyze-longitudinal.mjs`.
- `replication/scripts/run-ai-evaluation.mjs`.
- `replication/scripts/run-experiments.mjs`.
- `review/REVISION-CRITICA-ASISTIDA.md`.
- `review/RUBRICA-REVISION-CIEGA.md`.
- `review/SOLICITUD-REVISION-INDEPENDIENTE.md`.

Los dos últimos ejecutores de experimentos tienen una modificación posterior y
explícita: importan el modelo segregado `historical/memory-model/cobria.mjs` en lugar
de la ruta eliminada `src/cobria.mjs`. El contenido del modelo se conserva en su
archivo histórico. La revisión asistida no acredita revisión humana independiente;
la solicitud y la rúbrica tampoco demuestran que esta haya ocurrido.

Los controles SQL permanecen exclusivamente históricos y fuera del corpus NoSQL
actual. Sus scripts conservan rutas y dependencias antiguas y no se anuncian como
ejecutables vigentes. El análisis longitudinal depende de otro repositorio y de
objetos Git históricos; recuperar su archivo no elimina esa dependencia externa.

## Eliminaciones conservadas: 6 rutas

| Ruta | Justificación |
|---|---|
| `output/qa/phase2-results.png` | Captura derivada, no dato primario. |
| `output/qa/results-147.png` | Captura derivada, no dato primario. |
| `output/qa/results-148.png` | Captura derivada, no dato primario. |
| `output/qa/results-149.png` | Captura derivada, no dato primario. |
| `replication/src/cobria.mjs` | Modelo síncrono ya conservado en `historical/memory-model/`; no sustituir el núcleo actual. |
| `sitio/app/engineering/page.tsx` | Ruta anterior sustituida; el trabajador redirige `/engineering` a `/construir`. |

## Regresión y siguiente puerta

Se añade `replication/tests/script-entrypoints.test.mjs`: comprueba existencia de
entradas Node declaradas y los imports relativos de los dos ejecutores recuperados.
No ejecuta esos experimentos: sus salidas sobrescriben archivos de resultados.
Una prueba de existencia no garantiza reproducibilidad científica.

Verificación ejecutada tras la recuperación:

- Siete pruebas específicas aprobadas (cinco del modelo y dos de entradas).
- `make verificar COBRIA_SITE_ISOLATED=1`: código de salida cero; incluye 92 pruebas
  de réplica, 23 de aplicación neutral, 13 del adaptador de búsqueda de archivos
  y 11 del sitio construido, además de las demás puertas declaradas.
- `make verificar-integridad-paquete`: manifiesto regenerado y validado, 412 archivos.
- `git diff --check`: sin errores.

El sitio se verificó en una copia temporal conservada, no en un clon Git limpio.

Falta consolidar el conjunto completo de cambios y ejecutar las dos construcciones
desde el mismo commit limpio. La validación integral previa del árbol de trabajo
no acredita esa doble construcción ni permite anunciar un release reproducible.
