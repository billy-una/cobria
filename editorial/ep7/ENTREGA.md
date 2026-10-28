# Bibliografía compartida y procedencia EP7

EP7 completa una revisión exploratoria dirigida para la candidata educativa y el
preprint acotado. Artículo, maestro, libro y las 17 áreas del sitio utilizan un corpus
común de 46 referencias. No se declara revisión sistemática ni doble cribado concluido.

## Fuentes y método

`referencias.bib` conserva la identidad bibliográfica; `selection.json` registra doce
registros de búsqueda, seis exclusiones o sustituciones, cinco correcciones documentadas
y seis comparaciones por mecanismo. Se siguieron DOI, títulos y fuentes primarias.
Las consultas web no equivalen a exportar resultados completos de ACM, IEEE o Springer.
No se infieren conteos totales ni un diagrama de selección exhaustivo del buscador.

`link-check.json` conserva fecha, URL solicitada y final, estado, tamaño y SHA de la
respuesta. Los metadatos de DOI proceden de Crossref o DataCite; las discrepancias
importantes se contrastaron con páginas editoriales o manuscritos originales. No se
redistribuyen los textos íntegros obtenidos. Los intentos anteriores se conservan al
reconsultar registros concretos. Un HTTP 200 no demuestra lectura ni exactitud; los
403 no se etiquetan como enlaces comprobados sin restricción.

El corte registra 35 respuestas satisfactorias y 11 restricciones HTTP 403. Los
17 DOI tienen consulta de metadatos satisfactoria. Esto no implica texto completo
disponible para las 46 obras. Las fichas ISO se distinguen del texto normativo; la
documentación viva de motores no acredita la versión instalada en un experimento.

## Correcciones principales

- Aulbach: autores y DOI de la comparación de esquemas flexibles corregidos.
- Ni: la referencia atribuida a Yaish correspondía a otro trabajo; se corrigieron
  autores, DOI, clave bibliográfica y citas activas.
- Anya Li: autoría completa y categoría de la versión arXiv corregidas.
- Hevner: paginación contrastada con los metadatos editoriales.
- Roa: se conserva la autoría y paginación del PDF; su discrepancia con la ficha
  OJS se explica, sin resolverla silenciosamente a favor de una de las dos.

Las comparaciones describen aportes, costos, relación con COBRIA y límites. No
asignan carencias universales a CQRS, procedencia o vistas materializadas. Los
antecedentes sobre esquemas SaaS no se presentan como experimentos documentales COBRIA.

## Paridad editorial

`build.mjs` genera `references.json`, `method.tex`, `comparison.tex`, `REVISION.md`
y `provenance-audit.json`. El artículo y el maestro comparten método y comparación;
el libro enlaza lecturas desde cada parte y presenta la bibliografía completa.
`sitio/app/topic-references.tsx` consume ese mismo JSON, sin copiar otra lista manual.
Los títulos originales se mantienen para localizar las publicaciones. La estructura
autor-fecha de las referencias pedagógicas no se anuncia como certificación APA.

## Procedencia y derechos

Se comprueban bytes y SHA de 32 recursos visuales o históricos, sus copias y 20
archivos de fuentes locales. Las imágenes asistidas por IA conservan la declaración
de origen del inventario anterior, pero aquí no se acreditan sus recibos de generación,
modelo, fecha ni prompt originales. La huella prueba identidad del archivo, no autoría
ni exclusividad. Las fuentes mantienen OFL; los recursos de terceros y las obras
citadas conservan sus derechos. Código propio, texto y datos siguen el mapa de
licencias existente, sin extenderlo a los repositorios observados.

## Reproducción

```sh
make generar-ep7 verificar-ep7
node editorial/ep7/check-links.mjs --refresh
node editorial/ep7/check-links.mjs --refresh --only=gupta1995materialized
make construir-maestro construir-articulo construir-articulo-ciego
node libro-cobria/build-book.mjs
node libro-cobria/export-pdf.mjs --ep7
make sincronizar-descargas
make verificar COBRIA_SITE_ISOLATED=1
```

La consulta de red es explícita y cambia la captura; después debe regenerarse EP7.
La comprobación habitual `--check` es sin red y no reescribe derivados. Para imprimir
puede establecerse `COBRIA_BROWSER_BIN` con un navegador local compatible. Los
registros de esta entrega se conservan en `output/review/ep7/`.

## Verificación local y edición

Pasaron ocho pruebas EP7 y cuatro EP8, además de la verificación general. La última
integración web pasó lint, construcción y 33 pruebas de HTML construido en copia
aislada; su recibo está en `output/review/site-check/cobria-site-check-cGw019/`.
La regresión editorial EP3 volvió a contrastar las 17 áreas y las treinta fichas.
Los tres PDF científicos conservan el resumen y conclusión compartidos de EP6;
la copia ciega sigue sin identidad personal en el texto y metadatos comprobados.

Se corrigió la fragmentación de las aperturas del libro que producía páginas con
solo un borde. No se ocultó texto ni se redujo la tipografía. El contraste comprueba
46 títulos, 17 enlaces temáticos y ausencia de páginas vacías. Se inspeccionan las
aperturas, bibliografía, comparación y método afectados; no se atribuye una nueva
revisión visual integral de todos los capítulos. EP9 conserva esa tarea.

Artículo y copia ciega: 17 páginas cada uno. Maestro: 205 páginas. Libro: 468 páginas.
El cambio de paginación del libro responde a referencias nuevas y eliminación de
fragmentaciones de sus aperturas, no a pérdida de lecciones. No se publicó el sitio.

El cierre final de `make verificar COBRIA_SITE_ISOLATED=1` terminó con código cero;
se conserva en `output/review/ep7/verificacion-cierre.log`. El manifiesto de réplica
comprueba 575 archivos. `DESCARGAS-VERIFICADAS.json` contrasta las seis descargas
locales con fuentes y manifiesto, incluidas las tres actualizadas por EP7.

## Pendientes de otras fases

El cribado y extracción independientes por personas reales continúan pendientes.
Las fuentes no recuperadas íntegramente no se presentan como leídas en su totalidad.
El inventario no sustituye revisión jurídica, accesibilidad con tecnología de apoyo
ni inspección editorial integral EP9. No se publica, confirma o promueve una release
desde el árbol local con cambios previos.
