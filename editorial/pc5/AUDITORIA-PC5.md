# Aplicación y comprobación multirrol

PC5 amplía la aplicación C8 existente, sin crear una segunda aplicación ni llamarla
producción. El recorrido conserva formulario, controlador, caso de uso, autorización,
catálogo, dominio, Dater, PouchDB/LevelDB, proyección, reconstrucción y evidencia.

`replication/examples/integral-c8/test/pc5-roles.test.mjs` añade cuatro perfiles con
comprobación positiva y negativa de lectura, escritura y copia. Cada perfil es
rechazado en otra reserva. Una sesión vencida recibe 401 en todas las rutas y la
instrumentación confirma cero accesos al repositorio.

La suite integral pasó 17 pruebas locales, incluyendo las doce anteriores de
concurrencia, clave repetida, conflicto, fallo antes/después de persistir, copia,
restauración, reconstrucción y reinicio en otro proceso. Las bases son temporales
y ficticias; no se ensaya una cuenta de producción ni un servidor remoto.

`MAPA-API-Y-OPERACION.md` conserva las diferencias `/api` frente al contrato `/v1`,
la identidad DEMO y los límites de 1000 documentos, 1000 operaciones y 2 MiB por
agregado. Explica qué se pierde al separar documentos y qué debe diseñarse entonces.

PC5 sigue parcial: no se implementó todavía la conexión Firebase con emuladores de
Rules/Functions ni un despliegue staging. La auditoría es en memoria y la copia no
recupera sesiones o configuración completa. Estas limitaciones no desaparecen porque
las pruebas del taller pasen.
