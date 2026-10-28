# EP9 — Edición y formatos de lectura

Fecha: 25 de octubre de 2026. Alcance: candidata educativa y preprint acotado,
propuesta independiente. Trabajo local, sin publicación ni declaración de versión
estable. Autoridad normativa: `specification/`; Core 1.0 y los resultados
experimentales permanecen congelados.

## Cambios y retest

| Hallazgo | Ubicación | Corrección y comprobación |
|---|---|---|
| Rótulos superpuestos en el esquema de inteligencia | Maestro, página física 90, figura 15.1 | Nodo de políticas en una tercera fila; conexiones fuera de las cajas. Ampliación a 1400 px y nueva derivación SVG y transcripción. |
| Tres advertencias de anchura en tablas | Especificación, tabla de estados y trazabilidad | Redistribución de columnas y cortes de rutas con `xurl`. Compilación sin `Overfull`, conservando identificadores y requisitos. |
| Figuras contenedoras sin nombre alternativo | Libro: 39 contenedores del árbol estructural | Nombre obtenido del pie de figura; se conservan las alternativas de las imágenes. El PDF final no contiene figuras sin `/Alt` o `/ActualText`. |
| Falta de índice de términos | Libro, nueva página física 455 | Dieciocho términos enlazados al glosario y orientación por partes; destinos comprobados en HTML. |
| Cuatro referencias a ecuaciones rotas en la conversión | Lectura HTML del maestro | Destinos explícitos para ecuaciones y expresiones alineadas; cero enlaces internos rotos. |
| Jerarquías de encabezados y tablas de impresión inadecuadas para lectura continua | Seis lecturas HTML | Un H1, niveles consecutivos, cabeceras de columna, regiones desplazables por teclado y salto al contenido. Texto visible preservado en la transformación HTML. |
| Concordancias y declaración de casos imprecisas | Maestro, partes I–V y declaración inicial | Correcciones de género y formulación de dos inventarios originales y un perfil complementario. No cambia la evidencia. |
| Afirmación demasiado amplia de accesibilidad | Datos de edición del libro | Se sustituye por un alcance declarado; se separan etiquetado, comprobaciones automáticas y evaluación pendiente con tecnología de apoyo. |

La sinopsis, audiencia, guía de uso, glosario y referencias se conservan. Las
referencias compartidas de EP7 continúan siendo una revisión exploratoria; no se
transforman en una revisión sistemática ni en doble cribado humano por esta edición.

## Formatos y límites

| Producto | Páginas PDF | Etiquetas PDF | Alternativa HTML pública preparada |
|---|---:|---|---|
| Libro | 469 | Sí | `/lecturas/libro.html` |
| Cuaderno | 35 | Sí | `/lecturas/cuaderno.html` |
| Anexo | 16 | Sí | `/lecturas/anexo.html` |
| Artículo | 17 | No | `/lecturas/articulo.html` |
| Maestro | 205 | No | `/lecturas/maestro.html` |
| Especificación candidata | 23 | No | `/lecturas/especificacion.html` |
| Artículo para revisión ciega | 17 | No | Derivado técnico privado; excluido del catálogo público |

Las fórmulas científicas se convierten a MathML. Los diagramas proceden del mismo
TikZ e incluyen transcripciones de nodos, conexiones, dirección y rótulos. La
conversión no implica que la posición o el color comuniquen información accesible
por sí solos. Las fuentes y salidas científicas se verifican mediante SHA-256.

La igualdad de texto comprobada corresponde a la adaptación de cada HTML fuente
a su presentación continua. **No es una prueba formal de equivalencia entre todos
los objetos PDF y HTML**, ni una certificación de lectura matemática. La revisión
de extracción, diagramas, citas y resúmenes complementa esa comprobación.

Se rasterizaron las 782 páginas. La inspección de todas las hojas de contacto
busca cortes, cajas solapadas, páginas vacías y continuidad de la maquetación;
se amplían diagramas y páginas de riesgo. Esta revisión macro por el asistente
**no equivale a una corrección humana palabra por palabra**. Las huellas y el
alcance se conservan en `output/review/ep9/render/REGISTRO.json` y en el registro
de inspección de esta carpeta.

Quedan pendientes la prueba con lector de pantalla, orden efectivo de lectura de
los PDF, pronunciación de fórmulas y comprensión con personas. No se declara
PDF/UA ni accesibilidad integral. EP9 tiene implementación y verificación técnica
local; su cierre integral sigue condicionado a esas comprobaciones.

## Reproducir

Usar Python con `requirements-build.txt`, el entorno Node fijado por cada
`package-lock.json`, TeX y Poppler. El navegador puede indicarse mediante
`COBRIA_BROWSER_BIN`; no se exige una ruta de equipo particular.

```sh
node libro-cobria/build-book.mjs
make construir-maestro construir-articulo construir-articulo-ciego construir-especificacion
node libro-cobria/export-pdf.mjs --ep9
python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-ecosistema-manual-completo.pdf "COBRIA: patrones, capas, datos y software verificable" "Manual pedagógico de la propuesta independiente COBRIA"
python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-cuaderno-de-trabajo.pdf "COBRIA: cuaderno de trabajo" "Ejercicios de la propuesta independiente COBRIA"
python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-anexo-tecnico.pdf "COBRIA: anexo técnico" "Material de consulta de la propuesta independiente COBRIA"
python3 editorial/ep9/scientific_html.py
node sitio/scripts/sync-downloads.mjs
make verificar-ep9
node editorial/ep9/browser.mjs
python3 editorial/ep9/audit.py final
python3 editorial/ep9/render.py
make generar-manifiesto-paquete
make verificar COBRIA_SITE_ISOLATED=1
git diff --check
```

La regeneración científica requiere **Pandoc 3.12.1** y `latex`/`dvisvgm`.
`COBRIA_PANDOC_BIN` permite seleccionar el ejecutable. En esta ejecución se
verificó el archivo oficial `pandoc-3.12.1-arm64-macOS.zip` con SHA-256
`c2146cf33a583f3ac93eccddf1bb662371d5cfcce1aad1c87ad860cca1435d46`.
El ejecutable no se incorpora al repositorio. La construcción ordinaria del sitio
usa los derivados versionados en `generated/` y rechaza fuentes divergentes;
no necesita descargar Pandoc ni ejecutar TeX.

La comprobación local terminó aprobada: `make verificar COBRIA_SITE_ISOLATED=1`,
34 pruebas del HTML construido, cinco regresiones del empaquetador, paridad de
85 lecciones y cero enlaces internos rotos en las seis lecturas. El registro de
inspección se vincula a las huellas de los PDF: una nueva compilación requiere
actualizar la evidencia y repetir la inspección correspondiente antes de validarlo.

La ruta `/recursos` ofrece los seis formatos. Las nuevas rutas estáticas pasan por
el Worker y sus cabeceras. No se despliega la web en esta fase. EP10 conserva el
trabajo de identificar una candidata por SHA, reconstruirla desde clones limpios
y observar su CI; el diagnóstico aislado local no sustituye ese cierre.
