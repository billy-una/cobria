# Réplica distribuida COBRIA Core 1.2

Fecha de cierre: 27 de agosto de 2026.

Se conservaron 270 corridas históricas: tres motores, tres escalas y treinta repeticiones por celda. Todas superaron P1, P2, R1, S1 y A1 bajo el oráculo anterior. No se presentan como certificación vigente; deben repetirse con el arnés corregido. En ninguna corrida histórica se recuperaron documentos de un ámbito ajeno.

| Motor y versión | n | corridas | P1–A1 | canónica mediana ms | proyección mediana ms | R1 mediana ms | cruces |
|---|---:|---:|:---:|---:|---:|---:|---:|
| MongoDB 8.0 | 100 | 30 | sí | 8,749 | 7,815 | 83,412 | 0 |
| MongoDB 8.0 | 1.000 | 30 | sí | 39,910 | 34,431 | 653,424 | 0 |
| MongoDB 8.0 | 5.000 | 30 | sí | 157,856 | 129,272 | 3.179,603 | 0 |
| CouchDB 3.4 | 100 | 30 | sí | 98,830 | 54,119 | 296,230 | 0 |
| CouchDB 3.4 | 1.000 | 30 | sí | 1.024,590 | 440,260 | 2.985,222 | 0 |
| CouchDB 3.4 | 5.000 | 30 | sí | 4.298,485 | 1.477,093 | 12.844,488 | 0 |
| OpenSearch 2.19.3 | 100 | 30 | sí | 178,381 | 167,058 | 511,445 | 0 |
| OpenSearch 2.19.3 | 1.000 | 30 | sí | 200,557 | 168,733 | 851,417 | 0 |
| OpenSearch 2.19.3 | 5.000 | 30 | sí | 450,837 | 250,173 | 2.998,821 | 0 |

## Protocolo efectivo

- VM Colima x86_64, 2 CPU y aproximadamente 3 GB de RAM.
- Carga y reconstrucción mediante operaciones por lotes nativas; P2 conserva dos escrituras individuales observables.
- Los datos crudos se guardan en JSONL y los resúmenes por motor en JSON y Markdown.
- Los tiempos son propiedades de esta máquina, configuración y arnés; no son parámetros universales ni una clasificación general de motores.

## Incidentes y decisiones

1. El prepiloto de MongoDB usó escrituras individuales. Se conservó en `prepilot-individual-mongodb` y se excluyó de la tabla confirmatoria.
2. OpenSearch 3.2.0 con Java 24 sufrió un `SIGSEGV` bajo emulación x86_64. El intento queda registrado como incompatibilidad de plataforma, no como fallo COBRIA.
3. La creación de una VM ARM nativa falló antes del arranque porque el host no pudo resolver `release-assets.githubusercontent.com`.
4. Se ejecutó OpenSearch 2.19.3 con Java 21 como réplica de compatibilidad. Sus resultados no se atribuyen a 3.2.0.
5. Los motores se ejecutaron secuencialmente para respetar el límite de memoria y evitar interferencia entre servicios.

## Interpretación

La evidencia documenta el comportamiento histórico de tres adaptadores dentro del arnés anterior. No prueba conformidad vigente, disponibilidad regional, particiones de red, consenso, seguridad exhaustiva ni desempeño administrado. La siguiente réplica técnica debe ejecutar el arnés corregido, probar OpenSearch 3.2.0 en ARM nativo o infraestructura externa y añadir cargas concurrentes multiusuario.
