# Catálogo operativo de COBRIA Engineering

## Flujo de una operación crítica

```text
interacción → estado de carga → frontera confiable
→ derivar actor/capacidad/ámbito → validar → comprobar idempotencia
→ aplicar autoridad → publicar derivados/outbox → auditar → responder
```

Ejemplo neutral: una brigada registra el traslado de insumos entre dos estaciones. La
interfaz envía intención y `requestId`, pero no decide existencias, actor ni ámbito. El
servidor relee fuentes autorizadas, aplica un único cambio y conserva evidencia.

## Flujo tolerante a desconexión

Una nota de campo no crítica puede clasificarse `offline-safe`. Un movimiento de saldo,
un permiso o una publicación autoritativa se clasifica `online-only`. Antes de guardar
un lote, el sistema examina todas sus rutas: si una no es segura, rechaza el lote completo.

La dead-letter no es una segunda base de datos ni una orden de reejecución. Es evidencia
acotada para diagnosticar y decidir de forma explícita.

## Flujo de entrega

```text
commit → pruebas → artefacto inmutable → preview → staging
→ humo + rollback ensayado → aprobación → producción → humo
```

La configuración cambia por ambiente, pero el artefacto no se recompila. La aprobación
no reemplaza las pruebas y las pruebas no reemplazan la autorización de publicación.

## Flujo de optimización

```text
problema observable → línea base → causa raíz → alternativa más simple
→ cambio mínimo → misma carga → regresiones/costo → conservar o retirar
```

Se miden latencia, dispersión, solicitudes, bytes, CPU, memoria, almacenamiento,
amplificación de escritura, recuperación y esfuerzo de mantenimiento según el riesgo.

## Flujo de evolución de legado

Primero se congela el crecimiento. Después se introduce una frontera, se mueven
responsabilidades pequeñas, se reducen consumidores y presupuesto, y finalmente se
elimina el archivo. “En migración” sin reducción verificable no es un estado de salida.
