# Fase 20 — Laboratorio COBRIA Engineering

**Estado:** implementado y ejecutado localmente  
**Relación:** implementa ejemplos de `ENG-001..ENG-008`; no modifica COBRIA Core 1.0

## Objetivo

Demostrar que los contratos de fase 19 pueden expresarse como componentes pequeños,
neutrales y sometidos a aceptación y rechazo sin Firebase, navegador ni servicios reales.

## Implementación

`replication/examples/engineering-lab/` contiene:

- controlador de estado operativo y deduplicación concurrente;
- frontera autoritativa con ámbito, capacidad, idempotencia y auditoría;
- política offline y cola acotada con dead-letter;
- gate de promoción por digest;
- telemetría sanitizada, acotada y no bloqueante;
- presupuesto de reducción de legado.

## Gate

```bash
make verificar-fase-20
```

El gate exige nueve pruebas aprobadas, cobertura de los ocho contratos, ausencia de
dependencias externas y límites honestos. La ejecución local no acredita comportamiento
distribuido, rollback real, accesibilidad humana ni disponibilidad productiva.

El sitio presenta esta distinción en `/engineering`; los resultados siguen perteneciendo
al laboratorio local y no se convierten en afirmaciones de producción.
