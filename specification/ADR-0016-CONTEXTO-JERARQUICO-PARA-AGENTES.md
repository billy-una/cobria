# ADR-0016 — Contexto jerárquico para agentes

**Estado:** aceptada  
**Fecha:** 2026-09-20

## Decisión

COBRIA combina `AGENTS.md` jerárquicos para orientación humana con una política JSON para
validación. Cada tarea declara rutas, invariantes y pruebas. Los planes fuera de alcance se
rechazan antes de modificar archivos.

## Consecuencias

El contexto es portable y verificable, pero no reemplaza revisión humana en producción,
seguridad, ética, publicación o cambios incompatibles.
