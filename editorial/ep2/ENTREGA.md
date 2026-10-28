# EP2 Recorrido inicial para aprender modificando código

## Alcance

Diez unidades introducen problema, dato, variable, condición, función, objeto,
archivo, módulo, error y prueba, en ese orden. El lector copia la aplicación neutral
existente, no instala dependencias y modifica archivos reales antes de avanzar a
las capas. Los controles de la aplicación no se eliminan para facilitar el ejemplo.

La fuente editorial es `editorial/ep2/recorrido.mjs`. El generador lee el código desde
`replication/examples/ecosistema-app/taller-inicial/` y produce:

- `manuales/35-programar-desde-cero.md`: capítulo completo, instrucciones, ejercicios,
  salidas y soluciones razonadas.
- `editorial/ep2/recorrido.json`: mismo contenido para la web.
- `libro-cobria/primeros-pasos.html` y capítulo dentro del libro completo.
- `output/pdf/COBRIA-primeros-pasos.pdf`: edición independiente del capítulo.
- `/comenzar/desde-cero`: página con índice, ejemplos copiables, fallos, recuperación
  y soluciones desplegables. `/comenzar` enlaza este inicio sin exigir experiencia.

El currículo previo de 17 áreas y 85 lecciones se conserva; este piloto es su entrada,
no una nueva área ni una redefinición del Core. Artículo, maestro y resultados
experimentales no adquieren nuevas afirmaciones por añadir enseñanza.

## Contrato del cambio

Objetivo: que el inicio exija escribir y modificar, no solamente ejecutar pruebas ajenas.
Autoridad: implementación editorial local de EP2 para candidata educativa y preprint.
Invariantes: Core intacto; actor, finalidad, capacidad, ámbito e idempotencia presentes
en el primer registro; claves físicas fuera del taller; sin producción ni secretos.
La identidad es sintética y la memoria se reinicia al terminar. El ejemplo secuencial
no garantiza transacciones, autenticación ni corrección concurrente.

## Reproducción automática

Desde la raíz de COBRIA, `make verificar-ep2` ejecuta las regresiones y el recorrido.
`node replication/scripts/verify-ep2-start.mjs` crea una carpeta temporal nueva y copia
solo fuentes, datos, pruebas y configuración de la aplicación. No instala paquetes ni
modifica los originales. No es un clon Git limpio ni una réplica externa.

Por cada unidad comprueba el ejemplo, aplica exactamente el cambio explicado,
provoca el fallo y reproduce su recuperación. Los fallos semánticos pueden terminar
con código cero: se compara su salida, no se confunde ausencia de excepción con
corrección. La prueba propia debe ejecutar un caso; cero pruebas no aprueba el paso.
Además se rechazan ámbito ajeno, capacidad ausente y contenido diferente bajo la
misma clave de idempotencia. Al terminar se ejecuta la suite de la copia restaurada.

Los recibos `output/review/ep2/cobria-ep2-inicio-*.json` conservan huellas de fuentes,
comandos, salida, errores y estado de cada ejecución. No convierten resultados
locales en resultados de personas. La verificación de sitio y edición se registra
por separado en esa misma carpeta.

## Resultado técnico del 19 de octubre de 2026

- `make verificar COBRIA_SITE_ISOLATED=1`: código de salida 0; registro en
  `output/review/ep2/verificacion-completa.log`.
- Cuatro regresiones editoriales; diez unidades, 43 ejecuciones del recorrido y
  46 pruebas de aplicación en copia nueva. Recibo de cierre:
  `output/review/ep2/cobria-ep2-inicio-NW40Yz.json`.
- Sitio: instalación y lint, 15 pruebas previas y 29 de HTML renderizado aprobadas;
  140 rutas canónicas, sin eliminar las 85 lecciones anteriores.
- Workers y navegador real: 56 comprobaciones aprobadas, incluida copia con aviso,
  soluciones por teclado, navegación por índice y ausencia de desbordamiento global
  a 390 y 320 píxeles. Recibo: `output/review/ep2/local-1792446690087/RESULTADO.json`.
  Repetir con `node replication/scripts/audit-ep1-local.mjs /ruta/absoluta/sitio --ep2`
  contra una copia ya construida. No despliega.
- `make revisar-edicion-ep2`: texto, código, ejercicios y soluciones presentes en
  ambos PDF; capítulo de 24 páginas y libro completo de 393, sin páginas vacías.
  Huellas y tamaños en `output/review/ep2/PDF.json`.
- Revisión visual: panorámica de las 24 páginas del capítulo y muestras ampliadas
  de preparación, lectura de archivo, registro y prueba. Imágenes en
  `output/review/ep2/visual/`. No equivale a revisar las otras 369 páginas del libro
  ni a certificar PDF/UA.
- Descargas locales sincronizadas: el libro web ocupa 15 757 748 bytes. Las imágenes
  se recomprimen con pérdida, sin cambiar dimensiones ni texto; el original conserva
  su propia huella. El manifiesto de réplica verifica 559 archivos.
- `git diff --check` sin incidencias. Core conserva SHA-256
  `9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179`.

Se conservan intentos fallidos: faltaba crear el destino del manual en la copia
aislada; una prueba contaba también texto serializado de React y esperaba el total
anterior de rutas; faltaba mostrar un código de rechazo al lector. El primer ensayo
de navegador detectó además desbordamiento a 320 píxeles y una petición de navegación
cancelada durante recargas del propio ensayo. Se corrigieron el ajuste de texto y
botones y la secuencia de navegación; el retest conservado terminó sin errores de
cliente ni solicitudes fallidas. El recibo negativo no se eliminó.

## Validación pedagógica pendiente

Usar `editorial/ep2/LECTURA-PILOTO.md` para una sesión voluntaria con una persona que
no conozca el programa. La tarea final se intenta sin solución ni ayuda del autor.
Registrar atascos por unidad y distinguir ayuda para instalar de ayuda para entender
o escribir código. No completar identidades, consentimiento, tiempos ni respuestas
mediante una IA. No declarar cierre pedagógico hasta recibir evidencia real.

## Construcción y límites

`make generar-ep2` regenera el capítulo y sus datos. `npm run build --prefix libro-cobria`
regenera el HTML del libro; `node libro-cobria/export-pdf.mjs --ep2` exporta el libro y
el capítulo. La sincronización de descargas y su manifiesto se realiza con el flujo
existente, conservando una copia web dentro del presupuesto del alojamiento.

No hubo despliegue, push, etiqueta estable ni cambio del Core. La reparación pública
de EP1 sigue pendiente. Este piloto fija una referencia de detalle; no demuestra que
las otras diecisiete áreas ya alcancen el mismo nivel.
