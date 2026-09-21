# Matriz integral de trazabilidad COBRIA

Generada automáticamente. Filas: 16.

| Requisito | Patrón | Implementación | Prueba | Resultado | Amenaza | Documento |
|---|---|---|---|---|---|---|
| AUT-001 | Objeto canónico | RepositorioCobria | frontera de escritura | cubierta local | escritura paralela externa | Core 1.1 |
| ID-001 | Identidad documental estable | documentoCobria | identidad requerida | cubierta local | migración entre proveedores | Core 1.1 |
| SCP-001 | Repositorio con ámbito | adaptadores NoSQL | S1 y mutante con fuga | cubierta funcional | ACL y canales laterales | Core 1.1; modelo de amenazas |
| REV-001 | Revisión obsoleta rechazada | RepositorioCobria.guardar | entrega fuera de orden | 30/30 local | escritura distribuida | Core 1.1 |
| VSN-001 | Catálogo versionado | PublicadorVersionado | publicación y reversión | cubierta local | lectura multiversión real | Core 1.1 |
| PRV-001 | Manifiesto de procedencia | manifiesto A1 | integridad de fuentes | cubierta funcional | custodia y firma externa | Core 1.1 |
| IDM-001 | Procesamiento idempotente | clave compuesta | entrega duplicada | 30/30 local | entrega de red al menos una vez | Core 1.1 |
| REC-001 | Reconstrucción total | candidata separada | R1 y eliminación total | cubierta funcional | recuperación física | Core 1.1 |
| EQV-001 | Reparación verificable | normalización y huella | candidata corrupta | cubierta funcional | oráculo incompleto | Modelo formal 1.2 |
| PUB-001 | Publicación por versión | PublicadorVersionado | fallo antes del intercambio | cubierta local bajo fallo | atomicidad distribuida | Core 1.1 |
| OBS-001 | Auditoría narrativa | métricas del adaptador | presencia de métricas | parcial | alertas operativas reales | Core 1.1 |
| RET-001 | Retiro de proyección | procedimiento de retiro | eliminación y reconstrucción | parcial | retención y borrado legal | Core 1.1 |
| ANA-001 | Conjunto reproducible | materialización A1 | reconstrucción analítica | cubierta funcional | fuente externa mutable | Core 1.1 |
| AI-001 | Abstención con evidencia | regla A1 | ausencia de evidencia | parcial | evaluación humana y daño | Core 1.1 |
| SEC-001 | Recuperación limitada | AutorizadorAmbito | S1 y permisos | cubierta lógica local | autorización del motor | Modelo de amenazas 1.1 |
| CON-001 | Revisión de candidata vigente | reparación incremental | carrera reconstrucción/escritura | 30/30 local | clúster, consenso y red | Modelo formal 1.2 |
