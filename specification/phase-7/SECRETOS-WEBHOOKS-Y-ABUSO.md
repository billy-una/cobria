# Secretos, webhooks y resistencia al abuso

## Secretos

Los secretos se inyectan desde un gestor o identidad de carga. Nunca se guardan en Git, archivos de ejemplo, imágenes, errores, telemetría ni capturas. Cada secreto tiene propietario, alcance, fecha de rotación, consumidores y procedimiento probado de revocación. Las variables de entorno son transporte, no almacén permanente.

## Webhooks

Se conserva el cuerpo original hasta verificar firma; se valida algoritmo, identificador de clave y comparación constante. La marca temporal debe caer en una ventana corta. El identificador del evento implementa idempotencia. Solo se aceptan tipos conocidos, método y contenido esperados, y tamaño limitado. La respuesta no revela si existe un objeto interno.

## Abuso

Los límites se aplican por identidad y ámbito, no solo por dirección IP. Toda entrada tiene tamaño, cardinalidad, profundidad y tiempo máximos. Consultas, reconstrucciones, exportaciones y herramientas de IA poseen presupuesto y cancelación. Ante saturación se preservan canónicos y auditoría; se aplazan derivados reconstruibles.

La atestación de aplicación —por ejemplo App Check cuando se use Firebase— es una señal
adicional contra clientes automatizados no autorizados. No reemplaza identidad, capacidad,
ámbito, validación ni límites; el servidor decide incluso cuando la atestación es válida.
