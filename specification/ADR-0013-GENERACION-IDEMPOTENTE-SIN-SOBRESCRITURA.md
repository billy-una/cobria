# ADR-0013 — Generación idempotente sin sobrescritura

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Decisión

Cada generador calcula primero sus cuatro artefactos. Un destino idéntico se conserva; uno divergente detiene la operación con código 4. Los nombres siguen una gramática cerrada y las plantillas no incluyen SDK ni proveedor.

## Consecuencias

La automatización puede repetirse sin destruir trabajo humano y deja trazabilidad uniforme. No fusiona cambios ni decide reglas de dominio; esas tareas permanecen bajo revisión humana.
