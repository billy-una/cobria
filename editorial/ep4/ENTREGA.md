# Proyecto conductor reproducible

Estado: candidata educativa local; Core 1.0 no se modifica. No publicada.

El proyecto sigue siendo el registro de observaciones de una reserva. No cambia
de dominio al pasar de memoria a disco. El recorrido ejecutable conecta las
implementaciones existentes; no presenta memoria y persistencia como equivalentes
en atomicidad. Memoria enseña las fronteras; C8 confirma hecho, operación y resumen
en una misma revisión de un agregado documental PouchDB 9.0.0 con LevelDB.

## Ejecutar desde una copia del repositorio

Requisitos: Node 22.13 o posterior, npm y espacio para dependencias y bases temporales.
Desde la raíz:

```sh
npm ci --prefix replication
node replication/examples/integral-c8/recorrido-ep4.mjs
node replication/examples/integral-c8/recorrido-ep4.mjs 4
node --test replication/tests/ep4-recorrido.test.mjs
npm test --prefix replication/examples/integral-c8
```

La salida JSON indica el directorio temporal conservado para inspección, los siete
hitos, cuatro rechazos, fuentes y huellas. Los puertos HTTP son locales y efímeros;
se cierran incluso si falla una comprobación. El programa crea bases nuevas, no
reutiliza ni sobrescribe una instalación del lector. Es código ejecutable JavaScript,
no pseudocódigo ni una traducción equivalente a cuatro lenguajes.

## Hitos y responsabilidades

| Hito | Archivo responsable | Efecto comprobado |
| --- | --- | --- |
| Memoria | `ecosistema-app/src/composition.mjs` | El mismo documento pasa por dominio y caso de uso |
| API y permisos | `integral-c8/composition.mjs`, `api-ux-c5/server.mjs` | Catálogo desconocido se rechaza; ámbito ajeno se deniega |
| Escritura durable | `integral-c8/application/registrar-durable.mjs` | Valida dominio y catálogo antes del puerto atómico |
| Motor y proyección | `integral-c8/infrastructure/repositorio-pouch.mjs` | Fuente, idempotencia y resumen se confirman juntos |
| Traducción física | `ecosistema-app/src/infrastructure/data/observacion-dater.mjs` | Claves físicas no aparecen en el contrato público |
| Analítica descriptiva | `integral-c8/recorrido-ep4.mjs` | Total local con identidad, ámbito, revisión y huella de fuente |
| Recuperación | `analitica-c7/taller.mjs` | Cita con huella o abstención, sin autoridad de escritura |
| Recuperación operativa | `integral-c8/recorrido-ep4.mjs` | Reapertura, reentrega, restauración y reconstrucción equivalentes |

Las rutas de la tabla son relativas a `replication/examples/`. La composición une
las capas: no se introduce una dependencia del dominio hacia el SDK. El catálogo
utilizado es `integral-c8/catalogo.json`, edición `aves-c8-v1`. La forma física sigue
siendo versión 1; una revisión del hecho no equivale a una edición del catálogo.

## Ejercicio y solución verificable

Registre tres colibríes y después ejecute otra copia del recorrido con cuatro.
Antes de ejecutarla, prediga qué cambia: cantidad canónica, total del resumen,
total analítico y huellas. Prediga también qué permanece: una observación, una
operación, ámbito e identidad. Cada ejecución usa una base nueva: no simula una
actualización sobre la anterior.

Solución: el parámetro cambia la entrada del mismo flujo; las pruebas verifican
totales 3 y 4. La reentrega con la misma clave conserva el estado; cambiar la
cantidad reutilizando esa clave devuelve 409. Una nueva revisión de negocio necesita
su propia clave y revisión, no alterar la respuesta anterior. La cantidad cero,
negativa, fraccionaria o no numérica se rechaza antes de abrir el motor.

El recorrido también intenta una especie desconocida, un ámbito no autorizado y
un respaldo manipulado. Compara el estado antes y después de los rechazos; un
resultado verde sin estas comparaciones no bastaría para demostrar ausencia de efectos.

## Límites de adopción

Las sesiones DEMO no autentican personas. La analítica aquí es descriptiva y no
habilita entrenamiento: el documento original no contiene consentimiento ni tiempo
de conocimiento. No se inventan estos atributos para alimentar C7. Un conjunto de
entrenamiento requiere el contrato explícito y los controles temporales de ese taller.
La recuperación es léxica, no razona sobre atributos ausentes como salud del animal.

Un agregado admite hasta 1000 documentos y 1000 operaciones, con límite de 2 MiB.
Cada lectura valida el agregado completo; no es un índice distribuido ni una promesa
de escalabilidad. No hay transacción entre ámbitos, prueba de pérdida eléctrica,
clúster, nube, Firebase Emulator, staging ni producción en este recorrido. Las copias
no incluyen sesiones o auditoría operacional. Las huellas comprueban integridad,
no firma ni autenticidad frente a un atacante que pueda reemplazar contenido y hash.

Código bajo Apache-2.0 según la licencia del repositorio; textos y datos se rigen
por sus licencias específicas, no se relicencian mediante esta guía.

## Estado de cierre

El capítulo del libro y la ruta `/comenzar/proyecto-integral` derivan de esta guía;
el código mostrado se extrae del programa real con su SHA-256. El PDF breve incluye
las mismas instrucciones, responsabilidades, ejercicio y límites. Las pruebas de
conformidad científica no se sustituyen por este recorrido funcional.

Los registros de cierre se conservan en `output/review/ep4/`. La revisión
independiente y la publicación siguen separadas de las comprobaciones locales.

Cierre local del 23 de octubre de 2026: 7 pruebas EP4 y 17 pruebas C8 aprobadas;
la copia con dependencias propias repite las 6 pruebas funcionales EP4 y las 17 C8.
La construcción aislada del sitio y `make verificar COBRIA_SITE_ISOLATED=1` terminaron
correctamente. El navegador local pasó 53 comprobaciones, con copiado fiel y sin
desbordamiento horizontal a 390 y 320 píxeles.

Evidencias: `output/review/ep4/COPIA.json`, `PDF.json`, `pruebas-finales.log`,
`verificacion-final.log` y `local-1792773403608/RESULTADO.json`. El PDF breve tiene
6 páginas; el capítulo ocupa las páginas 34–38 del manual de 456 páginas.
La inspección visual comprende las páginas nuevas, no una nueva revisión de las
456 páginas ni una certificación PDF/UA.

Para regenerar: `node libro-cobria/build-book.mjs`,
`node libro-cobria/export-pdf.mjs --ep4` y `make revisar-edicion-ep4`.
Los PDF se sincronizan con el procedimiento existente de descargas. La generación
del sitio consume `recorrido.json`; después de cambiar guía o código hay que
regenerarlo con `node editorial/ep4/build.mjs` antes de construir la web.
