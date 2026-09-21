# Registro de riesgos de dependencias

**Última observación:** 2026-09-21 mediante `npm audit --json` en `replication/`.

| ID | Componente | Severidad informada | Exposición en COBRIA | Decisión temporal | Condición de cierre |
|---|---|---:|---|---|---|
| SUP-001 | `pouchdb` → `uuid` | moderada en observación del 19 de septiembre | adaptador de experimentación y pruebas | mitigada mediante resolución controlada a `uuid 11.1.1`; conservar pruebas | reabrir si cambia lockfile, exposición o asesoría |

La asesoría observada fue `GHSA-w5hq-g745-h8pq` (“missing buffer bounds check” en UUID).
La sugerencia automática de cambiar PouchDB a `6.3.2` constituía un retroceso mayor y no
se aplicó. El lockfile actual resuelve `uuid 11.1.1`; la suite de réplica conserva pruebas
para PouchDB. La auditoría del 21 de septiembre informó cero vulnerabilidades conocidas.
Esto describe únicamente ese lockfile, registro y momento; no demuestra ausencia total.

**Responsable:** mantenimiento de réplica. **Próxima revisión:** al cambiar dependencias o,
como máximo, 2026-10-21. Cualquier cambio de exposición, prueba de explotación o aumento
de severidad reabre la decisión inmediatamente.
