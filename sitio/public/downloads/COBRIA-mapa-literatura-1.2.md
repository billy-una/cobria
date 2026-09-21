# Mapa de literatura COBRIA 1.2

Estado: búsqueda semilla reproducible; no se presenta como revisión sistemática concluida.

| Fuente primaria u oficial | Mecanismo estudiado | Relación con COBRIA | Diferencia que conserva la contribución |
|---|---|---|---|
| Chang et al. (2006), *Bigtable* — https://www.usenix.org/conference/osdi-06/bigtable-distributed-storage-system-structured-data | Datos distribuidos y diseño orientado a acceso | Justifica adaptar representaciones al patrón de consulta | No define el contrato conjunto de autoridad, ámbito, equivalencia, reconstrucción y retiro |
| DeCandia et al. (2007), *Dynamo* — https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf | Partición, disponibilidad y consistencia eventual | Explica costos y conflictos de réplicas distribuidas | COBRIA gobierna derivados de aplicación y no reemplaza consenso ni replicación del motor |
| Buneman, Khanna y Tan (2001), procedencia — https://homepages.inf.ed.ac.uk/opb/papers/ICDT2001.pdf | Origen de resultados | Sustenta procedencia verificable | COBRIA la integra con publicación, reconstrucción, alcance y ciclo de vida operacional |
| Lewis et al. (2020), RAG — https://arxiv.org/abs/2005.11401 | Recuperación no paramétrica con generación | Motiva citas, evidencia y control del contexto | COBRIA exige limitar por ámbito antes de similitud y abstenerse sin evidencia |
| MongoDB, arquitectura multiinquilino — https://www.mongodb.com/docs/atlas/build-multi-tenant-arch/ | Aislamiento lógico por identificador de inquilino | Sustenta el ámbito obligatorio en colecciones compartidas | COBRIA hace que el ámbito atraviese repositorios, cachés, proyecciones, analítica e IA |
| MongoDB, concurrencia — https://www.mongodb.com/docs/manual/faq/concurrency/ | Bloqueos y control de concurrencia del motor | Delimita qué debe delegarse al almacenamiento | COBRIA añade revisión monotónica y publicación segura en la capa arquitectónica |

## Cadena de búsqueda congelada

`("materialized view" OR CQRS OR "event sourcing" OR provenance OR "data contract") AND (NoSQL OR document) AND (rebuild OR reproducibility OR versioning OR multitenancy)`

## Reglas de interpretación

1. Cada similitud debe acompañarse de una diferencia verificable; no se usa la ausencia de una frase exacta para declarar novedad.
2. Las páginas de proveedor sustentan comportamiento o recomendación del producto, no prioridad científica.
3. arXiv se identifica como prepublicación cuando corresponda.
4. La revisión completa requiere dos personas para selección y extracción, resolución de desacuerdos y diagrama de flujo.
5. Hasta completar ese proceso, COBRIA se describe como síntesis normativa y contribución composicional.
