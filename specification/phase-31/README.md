# Fase 31 — validación operacional controlada

Esta fase prepara cinco ensayos para observar mecanismos COBRIA Engineering en staging o
un ambiente controlado autorizado. COBRIA continúa siendo una propuesta independiente:
el instrumento no despliega, no toca producción y no declara resultados sin evidencia.

## Escenarios

1. `OP-01`: promoción y rollback del mismo artefacto.
2. `OP-02`: reintento acotado, idempotencia y dead-letter.
3. `OP-03`: telemetría privada y no bloqueante.
4. `OP-04`: restauración y reconstrucción equivalente.
5. `OP-05`: aislamiento de ámbito durante fallos.

Cada escenario declara hipótesis, inyección, resultado esperado, condición de aborto,
responsable y evidencia obligatoria. La ejecución DEBE usar datos ficticios o autorizados,
registrar digest y ambiente y conservar tanto resultados positivos como fallos.

```bash
make generar-plantilla-fase-31
make verificar-fase-31
```

**Estado actual:** protocolo preparado, 0/5 escenarios ejecutados y cero validación
operacional. La ejecución real requiere ambiente, cuenta y responsable autorizados.
