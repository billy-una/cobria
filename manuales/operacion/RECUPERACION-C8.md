# Recuperación local del cuaderno de la reserva

Responsable: Billy Jak Cordero Porras. Versión: 0.1.0. Estado: procedimiento local.
Ambiente: demostración C8 con datos ficticios. Revisar al cambiar persistencia o respaldo.
Ensayo automatizado: `node replication/examples/integral-c8/verificar.mjs`.

## Síntoma e impacto

Un 503 después de guardar no permite concluir si la escritura ocurrió. Un resumen
inválido puede impedir leer aunque exista el hecho. Detenga nuevas correcciones
manuales: subir la revisión a ciegas podría introducir otro cambio de negocio.

## Precondiciones y permisos

Ejecute desde la raíz con Node 22.13 o superior y `npm ci --prefix replication`.
Use únicamente su directorio de taller. Reabrir requiere su marcador C8; no abra
directorios arbitrarios. Respaldo exige `observaciones:respaldar`; reconstrucción
exige `observaciones:reconstruir`. La interfaz no concede esa última capacidad.

## Diagnóstico y mitigación

Conserve la entrada y su clave idempotente. Si la página sigue abierta y no editó
el cuerpo, reintente Guardar; después consulte los documentos y la proyección.
La misma clave recupera el resultado original. Si recargó y perdió la clave,
consulte el hecho: no incremente la revisión solo para vencer un conflicto.

Si la sesión caducó, cierre y reabra con la orden `--reanudar` y la ruta exacta
impresas por el taller. Utilice la nueva sesión. No comparta sesiones en capturas,
reportes ni repositorios. Si el motor está bloqueado, no borre sus archivos de bloqueo:
compruebe qué proceso propio lo usa y cierre ese proceso ordenadamente.

## Recuperación ensayada

```sh
node replication/examples/integral-c8/verificar.mjs
npm test --prefix replication/examples/integral-c8
```

El primer comando crea una base ficticia nueva, registra, exporta a archivo exclusivo,
cierra, reabre, repite la operación y restaura en otra base nueva. No actúa sobre la
base donde ocurrió su incidente. La restauración rechaza un destino con agregado
existente. Se compara la huella completa y se reconstruye el resumen desde canónicos.

El segundo ejecuta también el caso de resumen manipulado en su base temporal propia.
Comprueba rechazo sin permiso y reparación sin cambiar hechos ni operaciones.
La reconstrucción es una llamada autorizada local, no una ruta GET de escritura.

## Verificación

El informe debe indicar `reopenVerified`, `restoreVerified` y `rebuildVerified` en
`true`, con una observación, una operación y conteo de colibríes igual a 3.
La suite debe pasar sus doce pruebas. Esto prueba el procedimiento automático en
bases nuevas; no demuestra recuperación del incidente original ni mide RPO/RTO de producción.

## Escalamiento y evidencia

Si fallan las comprobaciones o la fuente es inválida, deténgase. Conserve directorio,
error, versión y huellas; solicite revisión del responsable antes de intervenir la base.
No edite canónicos, no elimine el destino y no rebaje permisos para forzar la reparación.
El respaldo contiene datos y claves de operación: no lo publique aunque no tenga sesiones.

La copia incluye hechos, operaciones y proyección, no configuración completa, sesiones
ni auditoría. La huella no es firma. Caída eléctrica, corrupción del disco, nube y
replicación requieren otros ensayos. Registre el resultado negativo y la siguiente
acción; no marque recuperación completa por haber obtenido un HTTP 200.
