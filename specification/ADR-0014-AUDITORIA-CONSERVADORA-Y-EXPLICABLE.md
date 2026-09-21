# ADR-0014 — Auditoría conservadora y explicable

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Decisión

El auditor aplica reglas acotadas, produce ubicación y remediación y conserva fixtures positivos/negativos. No declara corrección global ni acepta supresiones inline sin decisión trazable.

## Consecuencias

Los hallazgos son revisables y CI puede bloquear regresiones conocidas. El análisis sintáctico ligero no sustituye AST por lenguaje ni revisión de seguridad.
