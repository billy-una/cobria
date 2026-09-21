# Fase 29 — ingesta y acuerdo dimensional

Esta fase implementa la recepción conservadora de los dos formularios preparados en la
Fase 28 y el cálculo reproducible de acuerdo observado y kappa de Cohen. COBRIA continúa
siendo una propuesta independiente: el cálculo describe consistencia entre revisores y no
produce certificación, aprobación o verdad automática.

## Estados

1. `prepared-awaiting-human-responses`: existen menos de dos formularios completos; las
   métricas permanecen en `null`.
2. `proposal-review-pair-processed`: dos respuestas auténticas, completas, distintas y sin
   conflicto declarado fueron pareadas en sus 72 dimensiones.

## Reglas

- Los originales se conservan sin modificación en `responses/`.
- Se rechazan autorrevisión, respuestas incompletas, dimensiones desalineadas y conflictos.
- Los desacuerdos se publican como pares; nunca se borran mediante el promedio.
- Los fixtures sintéticos prueban el algoritmo y no cuentan como personas ni evidencia.
- La adjudicación pertenece a una fase posterior.

```bash
make procesar-respuestas-fase-29
make verificar-fase-29
```
