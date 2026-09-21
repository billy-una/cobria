# Observabilidad, SLI, SLO y alertas

Observabilidad combina logs estructurados, métricas y trazas mediante `traceId`. Los logs explican eventos; las métricas permiten agregación; las trazas relacionan pasos. Ninguna señal contiene payload, credenciales o datos personales.

Los SLO incluidos son propuestas iniciales, no resultados de producción. Deben recalibrarse con línea base y necesidad del usuario. Una alerta requiere condición accionable, severidad, responsable y runbook; no se alerta por cada métrica.

Se registran especialmente: resultado por operación, latencia, reintentos, profundidad y edad de cola, dead-letter, frescura, verificación de proyección, denegaciones por ámbito, consumo y costo. La cardinalidad se limita: identificadores de documento y mensajes libres no son etiquetas métricas.

La salud distingue proceso vivo, servicio listo y dependencias degradadas. Un endpoint verde no demuestra integridad; el humo verifica también autorización, idempotencia y equivalencia.
