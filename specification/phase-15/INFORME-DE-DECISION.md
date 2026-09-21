# Informe de decisión de la fase 15

La comparación incluye siete estrategias, tres tamaños y treinta repeticiones por celda:
630 observaciones. La proyección COBRIA añade un manifiesto verificable frente a la
proyección sin contrato; por ello no se espera que sea siempre la alternativa mínima.

El resultado debe leerse desde `replication/results/core-1.3-alternatives/summary.json`,
que contiene estadísticas y evaluación de presupuestos, y no copiando cifras a mano.
La prueba local permite rechazar presupuestos y detectar regresiones. No permite afirmar
superioridad universal ni estimar consumo energético real.

La recomendación se conserva condicional:

1. use una única representación o un índice cuando cumplen el requisito;
2. use una proyección simple si su inconsistencia puede tolerarse y gobernarse;
3. use COBRIA cuando también necesita procedencia, ámbito, versión, verificación,
   reconstrucción y retiro;
4. retire la proyección cuando su beneficio observado no compense costo y riesgo.
