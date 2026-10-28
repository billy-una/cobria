# API y operación de la aplicación de referencia

El taller integral usa datos ficticios de una reserva y sesiones DEMO locales. No
implementa identidad productiva ni declara conformidad con OpenAPI por compartir
conceptos. Su ejecución no necesita acceso a los repositorios que inspiraron COBRIA.

| Operación | Taller | Contrato de referencia | Diferencia y decisión |
|---|---|---|---|
| Registrar y listar hechos | `/api/observaciones` | `specification/phase-10/openapi.json`, familia `/v1/ambitos/...` | Se conserva el taller; no es un alias normativo |
| Consultar un derivado | `/api/resumen` | Contratos Core de fuente y reconstrucción | Resumen en un agregado; sin alias distribuido |
| Recuperar evidencia | `/api/evidencia` | Procedencia y ámbito | Búsqueda léxica; no modelo generativo |
| Copia local | `/api/respaldo` | Recuperación operacional del ecosistema | Capacidad adicional; copia sin sesiones ni auditoría |
| Identidad | Bearer de un registro local del servidor | Identidad verificada según contrato aplicable | DEMO no equivale a JWT verificado |

## Trazar un registro y su recuperación

Desde la raíz: `npm test --prefix replication/examples/integral-c8` comprueba HTTP,
catálogo, autorización, Dater, LevelDB, concurrencia, revisión obsoleta, pérdida de
respuesta, copia, restauración, reconstrucción y reapertura en otro proceso. Las
pruebas PC5 añaden lector, brigadista, custodio y actor sin capacidades, todos con
rechazo en ámbito ajeno, y sesión vencida sin llamadas al repositorio.

`npm run verificar --prefix replication/examples/integral-c8` crea una copia propia
y restaura en otro motor nuevo. No se restaura encima de un motor existente. La
reconstrucción exige capacidad de operador y no está escondida en una lectura HTTP.
Consulte el mapa de archivos y el diccionario en
`manuales/33-aplicacion-integral-neutral.md` y `replication/examples/ecosistema-app/data/`.

## Cuándo separar nodos y documentos

El agregado limita cada ámbito a 1000 documentos, 1000 operaciones y 2 MiB; no es un
presupuesto de producción. Antes de alcanzarlo, mida tamaño, contención y tiempo de
validación. Si hay escrituras independientes frecuentes, separe hechos por identidad;
si el historial crece sin límite, separe operaciones por retención; si las consultas
repiten agregación costosa, evalúe índice nativo antes de una proyección.
Al dividir se pierde la confirmación conjunta de un único `put`: diseñe pendiente,
idempotencia, equivalencia, publicación y reparación antes de migrar. Nunca anuncie
atomicidad entre documentos por analogía con este taller.

## Functions reglas y staging

La plantilla `replication/templates/cloud-function/procesar-observacion.mjs` es un
punto de partida, no una Function desplegada. La autoridad sensible corresponde al
servidor: identidad verificada, capacidad, finalidad, ámbito e idempotencia antes del
efecto. Las reglas deben rechazar escritura directa a derivados y las rutas ajenas;
ocultar botones no aplica seguridad.

Para un adaptador Firebase futuro, use proyecto y datos sintéticos separados,
emuladores de Functions y Rules, casos positivos y negativos por rol y pruebas de
reintento, evento duplicado y denegación. Promueva un SHA y configuración identificada
a staging solo con autorización y verifique ambiente, headers, permisos y reversión.
Esta fase no entrega todavía ese adaptador ni pruebas de emulador; no se registra
como staging ejecutado. Los mensajes de auditoría locales tienen actor, capacidad,
ámbito, finalidad y resultado, pero su almacenamiento en memoria no es auditoría durable.
