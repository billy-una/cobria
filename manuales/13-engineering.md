# COBRIA Engineering

Este manual ayuda a convertir una arquitectura comprensible en software operable. No
añade obligaciones a COBRIA Core: aplica contratos generales de ingeniería según el
riesgo del proyecto.

## ENG-001 — Estado operativo explícito

Una pantalla asíncrona modela reposo, carga, éxito, vacío, error y reintento. Mientras
procesa una intención, bloquea únicamente la acción que podría duplicarla, conserva foco
y explica el resultado.

## ENG-002 — Autoridad transaccional

El cliente expresa intención; una frontera confiable deriva actor, capacidad y ámbito,
relee fuentes autorizadas, valida, aplica idempotencia, actualiza derivados y audita.

## ENG-003 — Cola fuera de línea gobernada

Cada operación se clasifica `offline-safe` u `online-only`. La cola declara capacidad,
TTL, intentos y backoff. La dead-letter permite diagnóstico, nunca reproducción ciega.

## ENG-004 — Promoción ligada al artefacto

Preview, staging y producción reciben el mismo digest. El gate conserva commit,
configuración, pruebas, respaldo, aprobación, humo y rollback.

## ENG-005 — Telemetría privada y no bloqueante

Logs y métricas usan nombres sanitizados, colas acotadas y agregación. No transportan
secretos, rutas completas ni identificadores de negocio innecesarios. Si fallan, el caso
de uso continúa.

## ENG-006 — Optimización con presupuesto

```text
medir → localizar causa → elegir alternativa simple → cambio mínimo
→ repetir carga → revisar regresiones y costo → conservar o retirar
```

Una mejora no se declara con intuición. Registra carga, ambiente, p50/p95/p99 cuando
corresponda, solicitudes, bytes, recursos, amplificación, recuperación y mantenimiento.

## ENG-007 — Estrangulamiento verificable de legado

El componente heredado queda `no-growth`, detrás de una frontera y con consumidores
conocidos. Cada extracción reduce tamaño, responsabilidades o dependencias; llegar a cero
consumidores habilita su retiro.

## ENG-008 — Incidente como conocimiento

Un registro de incidente conserva síntoma observable, causa raíz, impacto, solución,
pruebas, revisión afectada y riesgo residual. La cronología distingue hechos de hipótesis.

## Lista de salida

- [ ] Los estados operativos pueden provocarse y probarse.
- [ ] Actor, capacidad y ámbito se derivan en una frontera confiable.
- [ ] Las operaciones offline tienen política explícita y límites.
- [ ] El mismo artefacto recorre todos los ambientes.
- [ ] La observabilidad no filtra información ni bloquea negocio.
- [ ] Cada optimización posee línea base y presupuesto.
- [ ] El legado en retiro deja de crecer y pierde consumidores.
- [ ] Cada incidente material deja una prueba de regresión.

Fuente normativa de esta fase: `specification/phase-19/`. El caso contextual que ayudó a
refinar estos contratos está documentado con commit y límites de inferencia; los ejemplos
de este manual permanecen neutrales.

## Piloto de adopción

La fase 21 aplicó la rúbrica al commit
`303890830433f5019818a1b4fd696b9e33b45392` de POS Guápiles. Los ocho contratos
encontraron evidencia estructural reproducible, pero ninguno se presentó como validado
operacionalmente. Esta separación evita confundir archivos y pruebas locales con staging,
producción, rollback, accesibilidad o transferencia humana.

## Evaluación dirigida por manifiesto

La fase 22 separa el conocimiento del proyecto y el motor. Un archivo JSON declara la
revisión Git y la evidencia de `ENG-001..ENG-008`; el evaluador lee esos objetos sin
ejecutar código ni mezclar modificaciones locales. Rutas absolutas, `..`, contratos
duplicados o revisiones distintas se rechazan antes de evaluar.
