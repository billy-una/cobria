# Trazabilidad de las afirmaciones científicas

Esta matriz distingue norma, implementación, observación y generalización. R7 es un
antecedente conservado; PC2 es validación funcional local; PC3 no tiene corridas nuevas.
La existencia de una prueba no sustituye su ejecución ni una revisión independiente.

| Afirmación | Requisito y fuente | Implementación | Prueba | Resultado disponible | Amenaza | Producto |
|---|---|---|---|---|---|---|
| La fuente conserva autoridad | Core 1.0, autoridad | `replication/src/pc2/contracts.mjs`, Processor | `replication/tests/pc2-contracts.test.mjs` | Local PouchDB, consultar salida del gate | Agregado único; no transacción entre colecciones | Maestro, artículo, libro |
| Una candidata se valida antes de publicar | PC2 R1; Core, reconstrucción | Publisher, mismo archivo | PC2 contratos: candidata, CAS, interrupción, reapertura | Local; no resultado nuevo de tres motores | Intercalados limitados; no prueba formal de linealizabilidad | Maestro, artículo |
| El ámbito se autoriza antes de leer | PC2 S1 | Gateway | PC2 contratos: rutas y caché | Rechazo local antes del acceso instrumentado | Sin prueba de canales laterales de tiempo | Artículo, seguridad |
| El consumidor puede abstenerse | PC2 A1 | Consumer y training | PC2 contratos: citas, fuga, abstención | Consumidor determinista, no LLM | No demuestra calidad de respuestas generativas | Maestro, IA |
| Ocho de nueve celdas históricas favorecieron lecturas derivadas | R7, protocolo original | `replication/src/conformance.mjs` | `replication/results/core-r7-confirmatory/*/raw.jsonl` | 270 observaciones históricas; no PC3 | Autor, infraestructura local, arnés anterior | Tablas R7, artículo |
| La réplica nueva permitirá una comparación pareada | PC2 y adenda análisis 01 | `replication/src/pc3/analysis.mjs` | `replication/tests/pc3-analysis.test.mjs` | Solo fixtures sintéticos del analizador | Sin ejecutor remoto completo ni datos nuevos | No publicar cifras PC3 |
| La propuesta es transferible a principiantes | Manifiesto M-12 | Currículo, aplicación y guías | Protocolo humano PC9 | Pendiente de estudio independiente | Familiaridad del autor y selección de participantes | Libro y web; no conclusión científica |

## Criterio de actualización

Una afirmación nueva incorpora ruta de datos crudos, versión del ejecutor, unidad,
ambiente y amenaza pertinente. No se sustituye una celda faltante por un resultado
histórico. Los informes de ejecución están en `output/review/`, no en esta matriz.
