# EP3 Desarrollo de los casos por área

## Alcance y autoridad

Implementación editorial local para candidata educativa y preprint. Mantiene las
17 áreas y 85 lecciones, añade un caso desarrollado a cada área y conserva el mismo
proyecto conductor. No cambia Core 1.0, artículo, maestro ni protocolos científicos.
No autoriza publicar, desplegar, confirmar cambios o crear una versión estable.

Cada capítulo introduce vocabulario y un problema antes del código; explica la
decisión, muestra un ejemplo apropiado y compara alternativa y costo. Incluye caso
adverso, recuperación, ejercicio y solución específica con tres criterios de revisión.
La profundidad no se aprueba por contar páginas: las pruebas solo comprueban las
relaciones que pueden automatizarse. La comprensión y utilidad requieren lectores.

## Fuentes y derivados

- `editorial/ep3/chapters.mjs`: los diecisiete casos y sus rúbricas.
- `editorial/ep3/pattern-review.mjs`: revisión argumentada de treinta fichas y cuatro
  entradas. No altera silenciosamente sus tipos previos ni afirma novedad absoluta.
- `replication/examples/ecosistema-app/taller-areas/`: doce ejemplos que reutilizan
  dominio, aplicación, Dater y talleres existentes de operación y analítica.
- `editorial/ep3/build.mjs`: extrae funciones reales, conserva huellas y genera
  `areas.json` y los capítulos de `manuales/areas/`.
- `libro-cobria/build-book.mjs`: intercala el caso dentro de cada parte y conserva
  las lecciones anteriores. Genera también `casos-por-areas.html`.
- `sitio/app/area-workshop.tsx`: refleja los mismos casos dentro de las rutas de
  las diecisiete áreas, con índice, copiado y soluciones por teclado.

Trece áreas usan doce casos ejecutables: Capas y API observan el mismo controlador
desde responsabilidades distintas. Primeros pasos, Documentación, Aplicación
completa y Herramientas trabajan un artefacto de requisitos, documentación, integración
o generación; sus rúbricas están preparadas, no calificadas automáticamente.
Primeros pasos conserva además el recorrido ejecutable EP2.

## Qué se revisó de los patrones

Las treinta fichas mantienen contexto, fuerzas, implementación, fallo, costo,
alternativa y límites en sus fuentes previas. La revisión nueva distingue patrones
reconocidos, adaptaciones, contratos, mecanismos, convenciones, heurísticas y una
propuesta experimental. Para cada ficha conserva el tipo anterior y las fuentes de
sus ejemplos. No promete cubrir todos los patrones generales de objetos.

Referencias primarias consultadas para los antecedentes reconocidos:

- [Repositorio](https://martinfowler.com/eaaCatalog/repository.html).
- [Mapeador de datos](https://martinfowler.com/eaaCatalog/dataMapper.html).
- [Procesamiento idempotente](https://microservices.io/post/microservices/patterns/2020/10/16/idempotent-consumer.html).
- [Bandeja de salida transaccional](https://microservices.io/patterns/data/transactional-outbox.html).
- [Separación de lectura y escritura](https://martinfowler.com/bliki/CQRS.html).
- [Vistas materializadas](https://learn.microsoft.com/en-us/azure/architecture/patterns/materialized-view).

Las explicaciones son propias; no se copiaron ilustraciones ni contenido de catálogos.
Dater es una adaptación local de traducción y a–h una convención del diccionario.
crearAplicacion no se presenta como Factory Method solo por crear un objeto.

## Cómo verificar

`make generar-ep3` reconstruye los derivados de contenido.
`make verificar-ep3` ejecuta las regresiones y crea una copia nueva de los ejemplos,
sin paquetes externos ni secretos. Comprueba las salidas con cantidad tres y cuatro,
y el rechazo de cero donde se construye una observación. El caso de calidad mide
cargas, no latencia; no exige una cantidad que ese caso no utiliza.

Los recibos se guardan en `output/review/ep3/` con fuentes, huellas, comandos, salidas
y estados. Es copia local, no clon Git limpio ni réplica externa. La simulación de
roles no es identidad real ni estudio con personas.

`node libro-cobria/export-pdf.mjs --ep3` exporta libro y selección por áreas.
`make revisar-edicion-ep3` contrasta el texto extraído de los PDF con problemas,
código, ejercicios, soluciones y revisiones de fichas. La revisión visual y la prueba
de Workers tienen recibos separados; no certifican PDF/UA ni revisión independiente.

## Resultado técnico del 19 de octubre de 2026

- `make verificar COBRIA_SITE_ISOLATED=1` terminó con código 0. Registro:
  `output/review/ep3/verificacion-completa.log`.
- `make verificar-ep3`: 28 regresiones aprobadas, doce casos y 35 ejecuciones desde
  carpeta nueva. Recibo: `output/review/ep3/cobria-ep3-areas-GMRHfq.json`.
- Sitio: instalación y lint, 15 comprobaciones previas y 30 pruebas de HTML
  renderizado aprobadas. Se conservan las 140 rutas canónicas anteriores.
- Workers y navegador: 70 comprobaciones aprobadas, con los diecisiete casos,
  clasificación de treinta fichas, copiado, teclado y anchos de 390 y 320 píxeles.
  Recibo: `output/review/ep3/local-1792450168828/RESULTADO.json`.
  Se repite con `node replication/scripts/audit-ep1-local.mjs /ruta/sitio --ep3`
  contra una construcción local. No publica.
- PDF: 59 páginas en la selección por áreas y 451 en el libro completo. El contraste
  conserva problemas, código, ejercicios, soluciones y treinta revisiones, sin páginas
  vacías; huellas en `output/review/ep3/PDF.json`.
- Revisión visual: panorámica de las 59 páginas nuevas y muestras ampliadas de Datos,
  Seguridad, Calidad, Operación, IA y clasificación. No se afirma revisión integral de
  las otras 392 páginas ni certificación PDF/UA.
- Descargas locales sincronizadas: libro web de 16 341 972 bytes, con compresión de
  imágenes con pérdida y original separado. Se conservan texto, dimensiones y
  estructuras comprobadas por el optimizador, sin prometer equivalencia visual exacta.
- Manifiesto de réplica válido: 566 archivos del árbol de trabajo, no un ZIP histórico.
  `git diff --check` sin incidencias. Core mantiene SHA-256
  `9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179`.

Se conservaron los intentos negativos: faltaba integrar la plantilla propia de
Evidencia; una fuente bibliográfica saltaba a una página casi vacía; la copia aislada
capturó un PDF temporal durante otra sincronización. Se corrigieron la integración,
la ubicación de fuentes y el filtro de temporales, sin borrar las evidencias.

Las huellas del ejemplo de Evidencia usan JSON.stringify: comparan esa serialización,
no prometen canonicalización semántica independiente del orden de propiedades.
Las cuatro rúbricas de diseño siguen preparadas, no calificadas por personas.

## Límites y continuación

EP4 debe profundizar los hitos integrados y la persistencia del proyecto conductor.
EP5 completa navegación y descubrimiento de contenido. EP6 reconcilia la contribución
científica; este desarrollo pedagógico no aporta nuevas cifras experimentales.
La operación remota, autenticación productiva y comprensión por participantes no se
declaran ejecutadas por este trabajo editorial.
