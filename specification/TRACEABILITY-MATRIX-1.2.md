# Matriz integral de trazabilidad COBRIA 1.2

**Criterio:** “cubierta” significa que existe una comprobación automatizada en el alcance indicado; no equivale a certificación independiente.

| Requisito | Patrón o mecanismo | Implementación | Prueba | Evidencia | Amenaza principal | Documento | Cobertura |
|---|---|---|---|---|---|---|---|
| AUT-001 | Objeto canónico | `RepositorioCobria` | revisión de frontera | pruebas unitarias | escritura paralela no modelada | Core 1.1 § requisitos | parcial |
| ID-001 | Identidad documental estable | `documentoCobria` | identidad requerida | `core11.test.mjs` | migración entre proveedores pendiente | Core 1.1 | parcial |
| SCP-001 | Repositorio con ámbito | todos los adaptadores | S1 + mutante con fuga | informe de conformidad | canales laterales y ACL reales | Core 1.1; modelo formal | cubierta funcional |
| REV-001 | Revisión obsoleta rechazada | `RepositorioCobria.guardar` | fuera de orden | banco de fallos 30/30 | escrituras distribuidas | Core 1.1 | cubierta local |
| VSN-001 | Catálogo versionado | `PublicadorVersionado` | catálogo inválido + publicación/rollback | `core11.test.mjs`, banco de fallos 30/30 | lectura multiversión real | Core 1.1 | cubierta local |
| PRV-001 | Manifiesto de procedencia | manifiesto A1 | integridad de fuentes | A1 | firma externa y custodia | Core 1.1 | parcial |
| IDM-001 | Procesamiento idempotente | clave compuesta | entrega duplicada | banco de fallos 30/30 | al menos una vez en red | Core 1.1 | cubierta local |
| REC-001 | Reconstrucción total | candidato separado | R1 + eliminación total | conformidad y banco de fallos | recuperación física | Core 1.1 | cubierta funcional |
| EQV-001 | Reparación verificable | normalización y huella | candidata corrupta | R1 + prueba mutante | oráculo incompleto | modelo formal §6 | cubierta funcional |
| PUB-001 | Publicación por versión | `PublicadorVersionado` | huella incorrecta + rollback + fallo de catálogo | `core11.test.mjs` | carreras, intercambio atómico distribuido | Core 1.1 | cubierta local bajo fallo, atomicidad distribuida pendiente |
| OBS-001 | Auditoría narrativa | métricas del adaptador | presencia de métricas | resultados JSON | alertas operativas | Core 1.1 | parcial |
| RET-001 | Retiro de proyección | reconstruibilidad declarada | eliminación total | banco de fallos | retención y borrado legal | Core 1.1 | parcial |
| ANA-001 | Conjunto reproducible | materialización A1 | reconstrucción analítica | A1 | fuente externa mutable | Core 1.1 | cubierta funcional |
| AI-001 | Abstención con evidencia | regla A1 | ausencia de evidencia | A1 | evaluación humana y daño | Core 1.1 | parcial |
| SEC-001 | Recuperación limitada | `AutorizadorAmbito` + ámbitos separados | S1 + permisos read/write | `core11.test.mjs`, conformidad | autorización del motor | modelo de amenazas | cubierta lógica local |
| CON-001 experimental | Revisión de candidata vigente | reparación incremental | carrera reconstrucción/escritura | concurrencia 30/30 | clúster, consenso y red | modelo formal §5 | cubierta local |

## Uso de la matriz

Cada afirmación del artículo debe apuntar a una fila y conservar el calificativo de cobertura. Las filas parciales no pueden describirse como conformidad completa. Una revisión independiente debe intentar invalidar tanto la implementación como el oráculo.
