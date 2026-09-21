# COBRIA AI & Analytics

## Analítica reproducible

Un conjunto de datos declara fuentes, ámbitos, corte temporal, transformaciones, parámetros, semilla, exclusiones, versiones y huellas. La partición se diseña por entidad y tiempo antes de calcular métricas para impedir fuga.

```json
{
  "fuentes": [{"coleccion":"observaciones","ambito":"bosque-sur","revisionMaxima":840}],
  "transformacion": {"nombre":"rasgos-especie","version":"2.1.0"},
  "particion": {"estrategia":"entidad-tiempo","entrenamientoHasta":"2026-06-30"},
  "semilla": 12026,
  "evidencia": {"huella":"sha256:..."}
}
```

## IA como consumidora gobernada

Un modelo o agente no se convierte en autoridad por producir una respuesta. La recuperación ocurre después de autorización y antes de similitud; cada fragmento conserva procedencia. Si la evidencia es insuficiente, el sistema se abstiene.

## Controles mínimos

- consentimiento y propósito;
- versión de modelo y prompt;
- registro de herramientas permitidas;
- ámbito de cada recuperación;
- citas verificables;
- umbral y causa de abstención;
- retroalimentación sin convertirla automáticamente en verdad;
- evaluación por grupos y periodos;
- detección de deriva;
- rollback de modelo;
- auditoría de decisiones y costos.

## Qué no demuestra A1

A1 demuestra reproducibilidad del producto analítico y gobierno de evidencia. No demuestra calidad generativa, ausencia de sesgo, seguridad frente a ataques, utilidad humana ni conveniencia ética. Esas propiedades requieren evaluaciones separadas y, cuando corresponda, participantes y consentimiento.
