# Runbook de rollback y recuperación

1. Detener promociones y clasificar el impacto.
2. Comparar digest desplegado, configuración y migraciones con la evidencia aprobada.
3. Si el error es de código o configuración, promover el artefacto anterior inmutable; no reconstruirlo.
4. Si existen escrituras incompatibles, detener escritores, aplicar la ruta de compatibilidad probada y preservar canónicos.
5. Retirar proyecciones afectadas y reconstruirlas desde fuentes verificadas.
6. Ejecutar humo: salud, idempotencia, ámbito, lectura y equivalencia.
7. Reabrir tráfico gradualmente y observar errores, latencia, colas y costo.
8. Registrar cronología, causa, pérdida o no de datos y prueba de regresión.

Recuperación de desastre restaura primero identidad, secretos, catálogos y canónicos; después índices y proyecciones reconstruibles. Una copia restaurada permanece aislada hasta validar ámbito, revisión, huellas, retención y punto objetivo. El ejercicio debe medir RTO y RPO en fase 9; aquí solo se define el procedimiento.
