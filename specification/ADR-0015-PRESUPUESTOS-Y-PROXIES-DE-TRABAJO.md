# ADR-0015 — Presupuestos y proxies de trabajo

**Estado:** aceptada  
**Fecha:** 2026-09-19

## Contexto

La latencia sola favorece copias especializadas sin representar costo total. CPU y bytes
pueden observarse localmente, pero no equivalen a energía o emisiones.

## Decisión

COBRIA exige presupuestos previos, percentiles y dispersión; compara alternativas bajo la
misma carga y denomina `workProxy` al indicador compuesto. Se prohíbe describirlo como
energía. Los resultados locales llevan limitación explícita y los presupuestos fallidos
se conservan como evidencia.

## Consecuencias

Las recomendaciones son condicionales y reproducibles. Una evaluación ambiental formal
necesita instrumentación y fronteras adicionales.
