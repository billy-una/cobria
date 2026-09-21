# ADR-0007 — Capacidades mínimas, ámbito y finalidad

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Contexto

Un rol amplio o un filtro añadido al final permite fugas entre ámbitos y vuelve ambiguo el uso legítimo de los datos.

## Decisión

Cada operación sensible exige identidad, capacidad explícita, ámbito exacto y finalidad antes de acceder al repositorio. Los comodines no conceden acceso. Se registra una evidencia mínima de permiso o denegación sin incluir contenido ni credenciales.

## Consecuencias

La política es comprobable y uniforme, pero los llamadores deben transportar contexto y la organización debe gobernar capacidades y finalidades. La seguridad del despliegue sigue requiriendo identidad fuerte y controles del proveedor.
