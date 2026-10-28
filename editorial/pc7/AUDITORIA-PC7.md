# Edición local del libro y su reflejo web

Esta entrega unifica tipografías, comparte el glosario y añade comprobaciones de
contenido, geometría e interacción. No publica el sitio ni convierte en terminados
los experimentos PC3, la síntesis PC4 o la integración Firebase PC5 pendientes.

## Alcance y fuentes

Core 1.0, sus congelamientos y los resultados históricos no cambian. Las fuentes
editoriales alimentan libro y web; los PDF y HTML son derivados. No se activan
anuncios, seguimiento, servicios externos ni nuevas instrucciones para buscadores
o agentes. La historia personal conserva su página; las atribuciones de autoría
no se consideran contenido biográfico.

El glosario de dieciocho términos pasa a `editorial/glossary.json`: el libro lo
consume y la web lo muestra en `/mapa#glosario`, sin crear otra URL canónica.
El currículo sigue compartiendo 17 áreas, 85 lecciones, treinta patrones y sus
ejemplos. La revisión no convierte las tareas de diseño en código ejecutable.

## Tipografía reproducible

Inter se usa para lectura y Roboto Mono para código. Los originales, licencias OFL
íntegras y seis instancias estáticas están en `libro-cobria/fonts/` y
`sitio/public/fonts/`. `editorial/fonts.json` conserva revisión y huellas de los
originales; `editorial/fonts-static.json` identifica instancias, ejes y generador.
Las licencias de fuentes no se sustituyen por Apache ni CC BY del material propio.

Los archivos ya están incluidos: construir normalmente no necesita instalar fuentes
en el sistema ni descargarlas de Google. La hoja pública `/fonts/fonts.css` evita
que el empaquetador reescriba las rutas como archivos inexistentes bajo `_next`.
Las variables CSS con nombre Geist se conservan como alias compatibles de Inter
y COBRIA Mono; no representan una descarga o uso de Geist.

La escala del libro conserva texto base de 10,2 puntos, ejercicios de 10 y código
de 9 o más en las fichas. Los títulos de página usan 29 puntos, con ajuste local
de 27 para el taller largo de operación. La web adapta encabezados al ancho y
mantiene texto de lectura de 17 píxeles en sus páginas; no copia la escala de
impresión a una pantalla pequeña.

Para regenerar los recursos, desde la raíz, se pueden obtener los originales con
`node editorial/sync-fonts.mjs`. Las instancias se generan con Python y
`editorial/build-static-fonts.py`, usando los requisitos fijados en
`editorial/font-build-requirements.txt`. Esto es mantenimiento opcional, no un paso
obligatorio para una persona que empieza el tutorial.

## Problemas detectados y correcciones

- La página del taller de operación excedía la altura con Inter real. Se ajustaron
  encabezado y espacios locales, conservando texto, comandos y fuente de código.
- Se oscureció el coral del libro para textos pequeños. Las ilustraciones conservan
  proporción mediante contain; las portadas mantienen un recorte editorial deliberado.
- Algunas sustituciones contextuales de Inter aparecían como signos privados al
  extraer el PDF. Se desactivaron esas sustituciones y se generaron instancias
  estáticas. Se mantiene una normalización explícita entre dos apóstrofos equivalentes,
  además de espacios, saltos y NFC; no se ignoran discrepancias numéricas.
- El envoltorio de seguridad del Worker perdía la señal interna de archivos públicos
  de Vinext y el servidor respondía 200 sin bytes para fuentes. Se conserva la señal
  del objeto de respuesta, nunca un encabezado enviado por el cliente. Esta corrección
  no declara resuelta la incidencia independiente de streaming pendiente de PC8.

## Cobertura de comprobación

`make revisar-edicion-pc7` comprueba huellas y licencias y revisa los tres HTML con
navegador. El recorrido abarca 370 secciones del libro, 35 del cuaderno y 16 del
anexo, sus enlaces internos, IDs, imágenes, fuentes cargadas y desbordamientos.
También compara campos, pasos y código de las 85 lecciones con el currículo.

`python3 replication/scripts/review-pc7-pdf.py` extrae las 421 páginas de los tres
PDF. No detectó páginas vacías ni discrepancias en los textos de las 85 lecciones
y sus ejercicios bajo la normalización declarada. No es una comprobación semántica
de todo el contenido científico ni de todos los diagramas.

El sitio contrasta contenido de las 85 rutas y los dieciocho términos compartidos.
`review-pc7-site.mjs URL_LOCAL` comprueba anchos 320, 390 y 1440, desplegables con
teclado, fuentes locales, copiado y respuesta de error. La API de portapapeles se
simula; no se afirma acceso al portapapeles del sistema. Los informes, capturas y
registros se conservan en `output/review/pc7/`.

La ejecución interactiva aprobó 42 comprobaciones en los tres anchos, sin errores
de página ni solicitudes externas en el recorrido. La verificación general pasó
183 pruebas de réplica y 24 de renderizado del sitio, además de los talleres y
validadores previos. El informe editorial comprobó seis PDF y 139 rutas canónicas.
La excepción de lint para la hoja de fuentes es localizada y explica por qué se
conserva un enlace local sin transformación. No se desactiva la regla globalmente.

## Límites de cierre

La revisión geométrica es completa para esos tres HTML; la inspección visual es una
muestra de páginas y plantillas, no 421 páginas revisadas manualmente. Los PDF no
se declaran etiquetados ni conformes con PDF/UA. La prueba con lector de pantalla,
lectores principiantes y revisión independiente sigue siendo PC9. La construcción
de una copia temporal no equivale a clon Git limpio, CI remoto o publicación.
