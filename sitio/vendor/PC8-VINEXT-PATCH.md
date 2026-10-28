# Corrección local del envío de respuestas

El proyecto fija Vinext `1.0.0-beta.10`. El script de instalación
`scripts/patch-vinext-pc8.mjs` aplica una transformación versionada a
`dist/server/prod-server.js`; no necesita editar manualmente `node_modules`.

La fuente original tiene SHA-256
`fe8c1e29328f72315f5c5193e411f4c800860d46c6b14d48e5a048447cca8e2a`.
El resultado tiene SHA-256
`2c2759a293ff7a80f3b7e6f499d6b71565d628e3b10b1c0098e3881fcc30548a`
(revisión `COBRIA-PC8-stream-v3`, EP10).
Una segunda instalación es idempotente y una fuente desconocida detiene la
instalación. Cambiar de versión requiere revisar y actualizar explícitamente
la corrección; no se aplica a ciegas a otro archivo del proveedor.

Antes de enviar, un destino destruido o terminado cancela la fuente. El envío
espera el resultado del pipeline. Los cierres de destino con códigos de desconexión
enumerados se tratan como cancelación; otros errores se propagan al servidor.
No se sustituyen todas las excepciones por éxito ni se silencia el registro global.

EP10 normaliza la política de caché recibida a la grafía `Cache-Control` antes de
mezclarla con las cabeceras estáticas del proveedor, tanto en la caché en memoria
como en lecturas de disco. Así Node no combina esa directiva por defecto con un
`cache-control` distinto. Se verifica en respuestas 200 y 304, además de fuentes,
lecturas HTML y manifiestos servidos por el servidor real.

`npm run test:stream` comprueba integridad, repetición, rechazo de código desconocido,
destino cerrado, HTTP, compresión, cancelación tardía, error del productor y continuidad.
La sonda C12 conserva su identidad histórica y ahora comprueba el caso corregido.
La regresión del servidor Vinext completo se ejecuta además mediante
`replication/scripts/review-pc8-server.mjs` contra una construcción local.

La fuente de Vinext conserva su licencia MIT y el aviso de Cloudflare incluido
por el paquete. Esta corrección es local a COBRIA, no se atribuye al proveedor ni
se presenta como revisión o aceptación por sus mantenedores.
