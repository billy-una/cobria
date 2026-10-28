# EP1 — reparación web preparada, no publicada

Fecha: 19 de octubre de 2026. Meta: candidata educativa y preprint.
No constituye versión estable, revisión independiente ni autorización de despliegue.

## Diagnóstico y límites

La línea base EP0 conserva una portada pública anterior, `/comenzar` y el
manifiesto de descargas ausentes, seis PDF distintos de los locales y cabeceras
faltantes. No se ha identificado el SHA exacto que sirve el alojamiento.
La consulta de solo lectura del proyecto `appgprj_6a8c90f343608191bc81a55e0cc6cf34`
confirmó su URL pública y última versión guardada 18, actualizada el
21 de septiembre de 2026. **Última versión guardada no significa versión desplegada
ni identifica una reversión segura.** No se guardaron credenciales en esta entrega.

La configuración local anterior no declaraba el enlace ASSETS ni ejecución previa
del Worker. El servicio de recursos podía evitar el tratamiento de cabeceras.
Ahora las rutas de aplicación pasan por el Worker; solo las familias explícitas de
archivos pasan a ASSETS. Esto elimina localmente el sombreado por un índice estático;
no demuestra por sí solo cuál fue la causa exacta de la publicación anterior.
Referencia: [orden de ejecución de Workers y recursos](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/).

El ensayo real encontró además un bloqueo que las pruebas simuladas no detectaban:
el PDF web del libro, de 43 065 024 bytes, superaba el límite de 25 MiB por archivo
que rechazó Workers. El fallo queda conservado en
`output/review/ep1/local-1792440451894/`. La copia web nueva ocupa 15 555 413 bytes,
conserva 370 páginas y recomprime ocho ilustraciones RGB con JPEG de calidad 92,
sin remuestreo. Es compresión **con pérdida en imágenes**, no del texto vectorial.
El original permanece separado e intacto. Se comprueban texto, enlaces, destinos,
marcadores, geometría y presencia de estructuras declaradas; esto no certifica PDF/UA
ni reemplaza la revisión visual completa del libro.

## Rutas y cachés

La política ejecutable está en `sitio/worker/routing-policy.json`.

| Familia | Responsable | Caché y resultado |
| --- | --- | --- |
| `/`, `/comenzar`, `/explorar`, `/recursos`, `/mapa`, `/laboratorio` | Aplicación mediante Worker | HTML 200, `no-cache`, cabeceras de seguridad |
| `/downloads/manifest.json` y seis PDF canónicos | ASSETS mediante Worker | 200; huella y tamaño exactos; revalidación obligatoria |
| `/downloads/COBRIA-tesis.pdf` | Worker | 308 al documento maestro, sin duplicar PDF |
| Alias históricos enumerados | Worker | 308 al destino canónico |
| Fuentes, imágenes, recursos de construcción y datos enumerados | ASSETS mediante Worker | Cabeceras de seguridad; sin sustituir rutas de aplicación |
| `/archivo/` | Archivo histórico explícito | No indexable; no se mezcla con páginas actuales |
| `/index.html`, `/recursos.html`, rutas y archivos inexistentes | Aplicación o ASSETS según familia | 404 real, no portada 200 de sustitución |

Los generadores detienen la construcción ante páginas estáticas antiguas o una
copia ambigua de tesis. No las eliminan ni archivan silenciosamente. Las descargas
registran tanto la huella de la fuente como la de la copia web.

## Evidencia local

**Cierre:** `make verificar COBRIA_SITE_ISOLATED=1` terminó con código 0;
registro conservado en `output/review/ep1/verificacion-completa.log`.
La construcción final incluye 28 pruebas de HTML renderizado aprobadas.
`git diff --check` terminó sin incidencias. Entorno de esta ejecución: Node 24.2.0,
Python 3.13.9, pypdf 6.10.2 y Pillow 11.3.0.

- Construcción aislada con instalación, lint, pruebas, compilación y HTML renderizado:
  `output/review/ep1/construccion-aislada.log` (diagnóstico, no clon Git limpio):
  15 pruebas previas y 27 de HTML renderizado aprobadas. La prueba posterior de
  presupuesto de recursos se registra en la verificación general de cierre.
- Workers real, HTTP y navegador: `output/review/ep1/local-1792440849319/RESULTADO.json`:
  **47 comprobaciones aprobadas**. Incluye las seis descargas, manifiesto, redirecciones,
  cabeceras, ausencia de sombreado, búsqueda, copia y aviso, y fuentes.
- `make verificar-ep1`: regresiones de política, preservación de archivos y PDF.
- Dependencias Python fijadas en `requirements-build.txt`; usar un entorno virtual.
- Repetir HTTP contra una copia ya construida con `make auditar-ep1-local
  COBRIA_EP1_SITE=/ruta/absoluta/sitio`.

La evidencia de ejecución es local. No se cierra ninguna incidencia pública de EP0
por inferencia ni se presenta este diagnóstico como CI remota observada.
La primera verificación general conservada en `output/review/ep1/verificacion-intento-1.log`
se detuvo por una huella estadística distinta: dos valores de efecto `dz` cambiaron
en las últimas cifras de coma flotante al regenerarse en este entorno Python.
No cambiaron los datos crudos. Se regeneró explícitamente el manifiesto; la igualdad
binaria entre versiones distintas de Python sigue siendo un aspecto que EP10 debe
controlar mediante un entorno fijado, no mediante tolerancias en las huellas.
La muestra visual inspeccionada comprende portada y páginas 244, 249 y 250;
la comparación original/derivado de la página 249 incluye una ilustración recomprimida.
Las imágenes de comprobación se conservan en `output/review/ep1/pdf-visual/`.

El original del libro conserva SHA-256
`5d1ba8fd1a45809724c40c1bce6c9e39f4b096ccaa56571c96bc78426a2e66f5`;
la copia web tiene SHA-256
`5b9e748ab99f570732c773dea667339f83e478a99142b6088611417dfc2fbb3e`.

## Publicación dirigida — pendiente de autorización

1. Congelar una candidata revisada con SHA, manifiesto y huellas de los seis PDF.
   Antes de ello se exige EP10: un árbol con cambios pendientes no es un release.
2. Identificar el despliegue anterior realmente activo y conservar su identificador,
   configuración y manifiesto. Si no existe una reversión verificable, detenerse.
3. Construir desde esa candidata, comprobar que ningún recurso exceda 25 MiB y
   ejecutar las pruebas de Workers local. No copiar solo HTML ni solo `dist/client`:
   la unidad comprende Worker, configuración y recursos de la misma construcción.
4. Con autorización expresa, dirigir la publicación únicamente al proyecto citado,
   preservando acceso público. No cambiar dominio, permisos o secretos incidentalmente.
5. En una sesión anónima contrastar las rutas de la tabla, redirecciones 308,
   manifiesto 200, MIME, cabeceras, navegación y seis huellas/tamaños contra el paquete
   aprobado. `make capturar-ep0` sirve de captura complementaria desde ese checkout;
   revisar redirecciones por su estado esperado, no exigirles 200.
6. Conservar recibo con hora, ID desplegado, SHA, manifiesto y resultados. Solo entonces
   registrar cierre público. Los enlaces funcionales no sustituyen el contraste binario.

## Reversión

Si falla una ruta crítica, una descarga, la seguridad o la concordancia del paquete,
restaurar **el despliegue previo identificado y autorizado**, no suponer que la versión
guardada 18 es ese despliegue. No reconstruir bytes nuevos bajo una etiqueta antigua.
Repetir controles anónimos y guardar el recibo del fallo y la reversión; mantener EP1
como pendiente. No borrar evidencia histórica ni alterar el Core congelado.

## Lo que EP1 no resuelve

Profundidad pedagógica, reconciliación científica, revisión externa, accesibilidad
integral del libro y candidata Git limpia siguen en fases posteriores. No hubo
despliegue, push, etiqueta ni afirmación de publicación estable en esta fase.
