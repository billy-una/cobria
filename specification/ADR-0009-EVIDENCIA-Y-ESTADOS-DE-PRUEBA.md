# ADR-0009 — Evidencia y estados de prueba explícitos

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Decisión

COBRIA distingue prueba disponible, ejecutada, simulada, parcial, planificada y externa. Toda entrega genera evidencia estructurada; `gate-only` nunca se describe como `deployed`. Logs usan lista positiva y SLO sin medición productiva se etiqueta como propuesto.

## Consecuencias

Los informes resultan menos espectaculares pero más auditables. Automatizar la evidencia exige mantener esquemas, comandos y responsables.
