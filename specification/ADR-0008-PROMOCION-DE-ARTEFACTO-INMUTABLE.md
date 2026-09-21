# ADR-0008 — Promoción de artefacto inmutable

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Decisión

COBRIA construye una vez y promueve el mismo digest por preview, staging y producción. Cada ambiente tiene proyecto, identidad y datos separados. Producción requiere `main`, evidencia de staging, humo y rollback disponible.

## Consecuencias

Se reduce la diferencia entre lo probado y lo publicado y se hace auditable el rollback. La configuración debe inyectarse de forma validada y compatible; los secretos nunca forman parte del artefacto.
