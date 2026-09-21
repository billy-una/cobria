# Procedencia contextual: POS Guápiles

**Repositorio observado:** <https://github.com/billy-una/posguapiles>  
**Rama:** `main`  
**Commit local completo:** `c61c37577d6c50ec02fc038394f8fffbcd13286c`  
**Fecha de observación:** 20 de septiembre de 2026

## Elementos observados

| Fuente | Observación contextual | Adaptación neutral COBRIA |
|---|---|---|
| `AGENTS.md` | línea continua O1–O7, autoridad, gates, límites offline y release | contratos ENG-001 a ENG-008 |
| `documentacion/DEVELOPMENT/AI_ENGINEERING_PLAYBOOK.md` | medir, encontrar causa, cambiar lo mínimo, verificar y documentar | Optimización con presupuesto |
| `documentacion/OPERATIONS/RELEASE_PROMOTION_RUNBOOK.md` | evidencia de release ligada a SHA y artefactos | Promoción ligada al artefacto |
| `src/public/dataLayer/offline/` | política y manejo acotado de trabajo pendiente | Cola fuera de línea gobernada |
| `functions/lib/projection-outbox.js` | finalización recuperable de derivados | autoridad transaccional y outbox |
| `test/` y `functions/test/` | contratos de arquitectura, seguridad, UX y mantenimiento | pruebas estructurales y negativas |

## Límite de inferencia

Un repositorio demuestra que las prácticas pueden coexistir en ese contexto; no prueba
que sean nuevas, universales ni suficientes. COBRIA las relaciona con prácticas conocidas,
las neutraliza y exige aceptación observable. No se copiaron datos comerciales, secretos,
nombres de nodos ni reglas particulares del negocio.
