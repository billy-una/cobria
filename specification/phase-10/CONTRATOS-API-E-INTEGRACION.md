# Contratos de API e integración

La API se versiona en la ruta y conserva códigos de dominio estables. Autenticación identifica; autorización verifica capacidad, ámbito y finalidad. `X-Cobria-Scope` debe coincidir con ruta y credencial: nunca sustituye el control del servidor.

Las escrituras requieren `Idempotency-Key`; repetir la misma clave y entrada devuelve el resultado, mientras una entrada distinta produce conflicto. GET puede reintentarse con retroceso exponencial y jitter. POST solo se reintenta con la misma clave. Cada operación declara timeout y devuelve `429` con orientación de espera o `503` temporal sin detalles internos.

Los errores usan `application/problem+json` basado en RFC 9457, con tipo, título, estado, código estable y `traceId`. No exponen stack, consulta, credencial o existencia de objetos fuera del ámbito.

La paginación usa cursor opaco, límite máximo 100 y orden estable. Añadir campos opcionales es compatible; eliminar, renombrar, cambiar significado o volver obligatorio un campo exige nueva versión o ventana de transición.

Los eventos usan outbox o mecanismo reconciliable, identificador idempotente, ámbito, revisión de fuente, esquema, tiempo y traza. No se promete orden global. Webhooks siguen la firma y antirrepetición de fase 7.
