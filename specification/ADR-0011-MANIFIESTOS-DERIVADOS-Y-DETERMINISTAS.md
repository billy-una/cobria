# ADR-0011 — Manifiestos derivados y deterministas

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Decisión

Los manifiestos de máquina son vistas deterministas de documentos y contratos existentes. Cada concepto lleva identidad, fuente, versión, responsable y referencias. Los manifiestos no se editan como una segunda autoridad.

## Consecuencias

Humanos, CI y agentes pueden cargar contexto uniforme y detectar enlaces rotos. Todo cambio de fuente exige regeneración; el gate falla si el resultado confirmado está desactualizado.
