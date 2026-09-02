# Paquete de réplica NoSQL de COBRIA

## Extensión 1.1

La implementación de referencia añade un núcleo independiente del proveedor,
adaptadores por inyección para MongoDB y HTTP para CouchDB, requisitos trazables,
modelo de amenazas y estadística bootstrap. Los adaptadores distribuidos son código
ejecutable, pero no se atribuyen resultados mientras no se conecten a servidores reales
y se registre su topología.

Ejecute `npm test` para los contratos locales y `npm run statistics` para regenerar
p50, p95, p99, MAD e intervalos bootstrap. El protocolo completo está en
`PROTOCOL-1.1.md`.

Este directorio conserva el protocolo activo para evaluar COBRIA exclusivamente sobre
motores NoSQL documentales. Los artefactos de pilotos anteriores quedan fuera del corpus
confirmatorio y no sustentan cifras del artículo, la tesis ni el libro.

## Experimentos activos

- `P1`: consulta canónica indexada frente a proyección de cobertura.
- `P2`: operaciones, bytes, eventos y convergencia de escritura.
- `R1`: reconstrucción total, incremental y publicación por versión.
- `S1`: aislamiento multiinquilino y recuperación autorizada.
- `A1`: conjuntos reproducibles, fragmentos con evidencia y deriva.

## Matriz mínima

Cada experimento debe ejecutarse en dos motores documentales, tres escalas, diez ámbitos
y treinta corridas válidas por celda. Se congelan índices, semilla, región, forma de los
documentos, orden de cargas, calentamiento, criterios de descarte y versión del código.

## Motores y estado Core 1.0

La primera réplica congelada utiliza PouchDB 9.0.0 y LokiJS 1.5.12. Se ejecutaron dos
motores, tres escalas y treinta corridas por celda: 180 corridas en total. Las seis
celdas superaron conjuntamente P1, P2, R1, S1 y A1. Los datos crudos, resúmenes y macros
generadas se encuentran en `results/nosql-core-1.0/`.

Ejecute `npm ci && npm run all` para reconstruir pruebas, corridas y reporte. Estos
resultados corresponden a motores embebidos y no representan redes, regiones, cuotas o
facturación administrada.

Los controles exploratorios con SQLite y PostgreSQL se preservan únicamente en
`historical/sql-controls/`; están fuera del corpus confirmatorio NoSQL.

## Ética y seguridad

Solo se utilizan datos sintéticos, semirrealistas anonimizados o emuladores. No se deben
publicar credenciales, identificadores personales ni información de organizaciones.
