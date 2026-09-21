# Trazabilidad de requisitos de fase 2

| Requisito | Objetivo | Caso | Componente | Prueba o gate | Estado |
|---|---|---|---|---|---|
| ECO-RF-001 | OBJ-01 | CU-01 | Build | inspección documental | planificada |
| ECO-RF-002 | OBJ-06 | CU-01 | Manifesto | escenario pequeño | planificada |
| ECO-RF-003 | OBJ-02 | CU-03 | Layers | validador fase 2 | ejecutada |
| ECO-RF-004 | OBJ-03, OBJ-04 | CU-02 | Data | gate fase 3 | planificada |
| ECO-RF-005 | OBJ-03 | CU-05, CU-06 | Core | P1/P2/R1/S1/A1 | parcial por perfil |
| ECO-RF-006 | OBJ-01, OBJ-04 | CU-04 | Documentation | auditoría ADR | planificada |
| ECO-RF-007 | OBJ-05, OBJ-08 | CU-06 | Quality/Evidence | validador fase 2 | ejecutada |
| ECO-RF-008 | OBJ-05 | CU-07 | Cloud/Operations | gate fase 8 | ejecutada en simulación |
| ECO-RF-009 | OBJ-05 | CU-08 | Security | gate fase 7 y S1 | ejecutada localmente |
| ECO-RF-010 | OBJ-05 | CU-07 | Operations | gate fase 9 | ejecutada localmente |
| ECO-RF-011 | OBJ-08 | CU-09 | Performance | gate fase 15 | parcial |
| ECO-RF-012 | OBJ-07 | CU-10 | AI Development | tareas ciegas | planificada |
| ECO-RF-013 | OBJ-06, OBJ-08 | CU-11 | Knowledge | gate fase 17 | planificada |
| ECO-RF-014 | OBJ-08 | CU-12 | Evidence | gate fase 18 | requiere terceros |
| ECO-RNF-001 | OBJ-06 | CU-11 | Knowledge | revisión editorial | planificada |
| ECO-RNF-002 | OBJ-08 | CU-11 | Evidence | matriz y enlaces | parcial |
| ECO-RNF-003 | OBJ-08 | CU-12 | Evidence | réplica interna/externa | parcial |
| ECO-RNF-004 | OBJ-04 | CU-05 | Core/adaptadores | conformidad multiamotor | parcial |
| ECO-RNF-005 | OBJ-05 | CU-08 | Security | gate fase 7 | ejecutada localmente |
| ECO-RNF-006 | OBJ-06 | CU-11 | API/UX | gate fase 10/17 | planificada |
| ECO-RNF-007 | OBJ-04 | CU-11 | Governance | revisión de versión | parcial |
| ECO-RNF-008 | OBJ-05 | CU-06, CU-11 | Quality | CI y Makefile | implementada |
| ECO-RNF-009 | OBJ-08 | CU-11, CU-12 | Manifesto/Evidence | auditoría de estados | parcial |
| ECO-RNF-010 | OBJ-04 | CU-11 | Knowledge | regeneración automática | planificada |

## Cobertura estructural

- Todos los requisitos poseen aceptación en `REQUISITOS-ECOSISTEMA.md`.
- Todos los requisitos se relacionan con objetivo, caso, componente y prueba o gate.
- “Planificada” no equivale a prueba superada.
- Los requisitos técnicos AUT-001…CON-001 continúan bajo Core y su matriz propia; no se
  renombran como requisitos generales del ecosistema.
