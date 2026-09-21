# COBRIA — estado de Fases 0–3

Fecha de revisión: 2026-09-06.

Este archivo evita confundir **implementación disponible** con **evidencia ejecutada**. Una fase solo se marca `COMPLETA` cuando existen los artefactos que exige su propio contrato.

## Fase 0 — base, inventario y auditoría

**Estado: COMPLETA.**

Evidencia disponible:

- `AUDITORIA-PROFUNDA-2026-09-01.md`;
- especificación Core y matriz de trazabilidad;
- corpus de replicación y separación explícita de controles históricos SQL;
- inventario de límites locales frente a pendientes externos.

## Fase 1 — hardening local y contrato ejecutable

**Estado: COMPLETA EN LA RAMA `hardening-phase-0-1`.**

Cierre implementado:

- serialización canónica para huellas;
- conflicto explícito para misma revisión con contenido diferente;
- idempotencia para repetición idéntica;
- autorización integrada en las operaciones Core;
- publicación versionada con revisión monotónica y compare-and-swap;
- CAS en LokiJS, PouchDB, MongoDB, CouchDB y OpenSearch;
- pruebas de revisión, hash, autorización, publicación y escritor obsoleto;
- CI de integración para MongoDB, CouchDB y OpenSearch.

## Fase 2 — réplica confirmatoria P1/P2/R1

Contrato vigente: `replication/protocol/preregistered-phase2.json`.

**Estado: IMPLEMENTACIÓN DE EJECUCIÓN COMPLETA; EVIDENCIA CONFIRMATORIA PENDIENTE.**

Criterio obligatorio:

- motores documentales;
- P1, P2 y R1;
- escalas 1.000, 10.000 y 50.000;
- 10 ámbitos;
- 30 repeticiones por escala;
- ninguna celda puede declararse completa con menos observaciones.

Comando de cierre por motor:

```bash
COBRIA_ENGINE=mongodb npm run phase2:confirmatory
COBRIA_ENGINE=couchdb npm run phase2:confirmatory
```

El runner genera `PHASE-COMPLETION.json` únicamente después de verificar 90 corridas por motor y conformidad P1/P2/R1 en todas ellas.

## Fase 3 — réplica confirmatoria S1/A1/fallos

Contrato vigente: `replication/protocol/preregistered-phase3.json` y `replication/protocol/PHASE3-AMENDMENT-001.md`.

**Estado: IMPLEMENTACIÓN DE EJECUCIÓN COMPLETA; EVIDENCIA CONFIRMATORIA PENDIENTE.**

Criterio obligatorio:

- dos motores documentales;
- S1 y A1 conformes;
- evidencia de fallos/resultados negativos;
- manifiesto;
- índices congelados;
- orden de ejecución registrado;
- ninguna celda fallida puede reemplazarse silenciosamente.

Comando de cierre por motor:

```bash
COBRIA_ENGINE=mongodb npm run phase3:confirmatory
COBRIA_ENGINE=couchdb npm run phase3:confirmatory
```

El runner genera `PHASE-MANIFEST.json` únicamente si todas las corridas contienen S1/A1 conformes y evidencia negativa (`invalidRejected`, preservación de activa, rechazo de ámbito ausente/manipulado y abstención sin evidencia).

## Regla de cierre global 0–3

`0–3 COMPLETAS` requiere simultáneamente:

1. Fase 0 `COMPLETA`;
2. Fase 1 integrada y CI verde;
3. `PHASE-COMPLETION.json` válido para MongoDB y CouchDB en Fase 2;
4. `PHASE-MANIFEST.json` válido para MongoDB y CouchDB en Fase 3;
5. manifiesto de release regenerado después de incorporar los resultados.

Hasta que 3 y 4 existan, el repositorio no debe presentar Fases 2 y 3 como resultados ejecutados. Esta restricción preserva la diferencia entre preparación metodológica y evidencia observada.
