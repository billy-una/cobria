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

## Endurecimiento posterior a 1.3

- La huella SHA-256 se calcula sobre una serialización JSON canónica con claves de objeto ordenadas; el orden de propiedades ya no altera la identidad del documento.
- Una escritura con la misma revisión solo es idempotente cuando el contenido canónico coincide. Misma revisión con contenido distinto se rechaza como `COBRIA-REV-002`.
- El catálogo de publicación usa revisión lógica monotónica y compare-and-swap cuando el adaptador lo soporta. LokiJS, PouchDB, MongoDB, CouchDB y OpenSearch implementan CAS con el mecanismo nativo disponible.
- MongoDB condiciona el reemplazo a `payload.revision`; CouchDB/PouchDB usan sus revisiones de documento; OpenSearch usa `if_seq_no` e `if_primary_term`.
- `RepositorioCobria`, `ProyeccionCobria` y `PublicadorVersionado` pueden recibir `authorizer` y `principal` para aplicar autorización en la operación real, no únicamente en un helper aislado.
- Las pruebas cubren hash canónico, conflicto de misma revisión, idempotencia, escritor obsoleto, fallo de publicación y autorización integrada.
- CI mantiene los checks rápidos y añade smoke tests de integración para MongoDB, CouchDB y OpenSearch en contenedores, una corrida de 30 documentos por motor.

Estas mejoras endurecen el contrato funcional y la concurrencia del catálogo. No convierten la capa de aplicación en seguridad operacional completa: ACL del motor, autenticación del servicio, TLS/cifrado, gestión de secretos, canales laterales y pentesting siguen siendo gates de infraestructura externos.

## Estado de la fase 1.3

- Publicación versionada, verificación de huella y rollback: probado localmente con LokiJS.
- Autorización por ámbito: probado con permisos separados de lectura y escritura.
- Oráculo y datos adversariales: disponibles en `src/oracle.mjs` y `src/adversarial-generator.mjs`.
- CI: `.github/workflows/ci.yml` ejecuta pruebas, verificación de integridad y smoke tests distribuidos.
- SBOM: `npm run sbom` genera `SBOM.cdx.json` desde `package-lock.json`.
- Integración con clúster real, ACL del motor, red y servicios administrados: pendiente de infraestructura externa.
- OpenSearch recupera listados grandes mediante paginación `search_after`; la prueba local cubre más de 10.000 documentos.
- `run-distributed-core12.mjs` acepta `COBRIA_OUTPUT_DIR` para no sobrescribir resultados históricos.

Los perfiles CQRS, Event Sourcing e índice especializado se conservan como controles
experimentales; no se presentan como implementaciones industriales equivalentes.

## Ética y seguridad

Solo se utilizan datos sintéticos, semirrealistas anonimizados o emuladores. No se deben
publicar credenciales, identificadores personales ni información de organizaciones.
