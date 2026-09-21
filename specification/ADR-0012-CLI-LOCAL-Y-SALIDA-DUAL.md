# ADR-0012 — CLI local y salida dual

**Estado:** aceptada. **Fecha:** 2026-09-19.

## Decisión

La CLI usa Node.js, opera localmente sobre manifiestos y ofrece salida humana en español o JSON. Los códigos `CLI_*` y códigos de proceso son estables. `init` falla antes de sobrescribir y los esquemas siguen JSON Schema 2020-12.

## Consecuencias

Personas, CI y agentes comparten una interfaz. La validación estructural propia evita una dependencia de ejecución; la conformidad completa con JSON Schema debe probarse además con validadores estándar externos cuando se publique el paquete.
