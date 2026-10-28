# Reconciliación científica del artículo y el documento maestro

## Alcance y autoridad

EP6 reconcilia la candidata educativa y el preprint locales. La contribución principal
es el contrato reconstruible con ámbito explícito: una composición especificada y
refutable, no la invención de repositorios, vistas, eventos o procedencia. Core 1.0,
los protocolos congelados y los datos crudos no se modifican. No se ejecutan motores
ni se generan observaciones confirmatorias nuevas.

## Cambios científicos

El artículo y el maestro consumen `synthesis.tex` y `evidence-table.tex`, derivados de
`build.mjs` y del registro `claims.json`. Comparten resumen, conclusión, límites de
R7 y distinción de análisis. `traceability.json` y `TRAZABILIDAD.md` relacionan nueve
afirmaciones principales con clasificación, fuentes, huellas y amenazas. No se
presentan como inventario exhaustivo de cada frase o revisión independiente.

La evidencia se separa en norma, observación estructural, experimento histórico,
implementación/prueba funcional, experimento nuevo pendiente y evaluación externa
pendiente. Se mantienen las cantidades R7 y sus tablas generadas: 270 corridas,
nueve celdas, ocho comparaciones favorables y OpenSearch n=100 no concluyente. Se
verifican los tres archivos crudos por huella y los treinta registros por celda;
también se verifican las 630 observaciones crudas del microensayo, sin reanalizarlas
como datos de motores distribuidos.

La revisión del ejecutor R7 delimita qué significan sus etiquetas. P1 filtra en el
cliente la lista canónica; no compara una consulta nativa óptima. P2 no prueba
atomicidad de dos escrituras. R1 no acredita un alias persistido mediante CAS. S1
no evalúa un proveedor de identidad. A1 no evalúa la respuesta de un LLM. Compartir
los nombres P1–A1 no permite atribuir a R7 los oráculos posteriores de PC2.

PC2 conserva pruebas locales PouchDB y sus congelamientos. PC3 continúa sin datos
confirmatorios nuevos. La prueba primaria exacta de signos de su adenda se distingue
de la permutación histórica R7; las consultas internas no se tratan como réplicas.
No se aplican retrospectivamente los criterios nuevos para producir otras cifras R7.

Los dos inventarios originales se identifican como A/N1 y B/N2; el perfil comercial
N3 es una observación complementaria posterior, de profundidad distinta. No se
inventó un tercer inventario equivalente ni una muestra de equipos independientes.
Los objetivos H1–H9 quedan identificados como exploratorios, distintos de HN1–HN5.
Los escenarios de rendimiento E-S/E-A/E-I ya no reutilizan los nombres de los niveles
normativos C1/C2/C3. El artículo resume los diez invariantes, no solo seis.

## Organización y edición

Las 180 corridas embebidas iniciales se trasladan a antecedentes segregados, después
del manual de réplica. Las plantillas y códigos del archivo metodológico inicial se
rotulan como antecedentes, no como protocolo vigente. El lector no debe deducir qué
capítulo invalida otro. Se corrigen saltos de los preliminares, desbordamientos de
tablas, una ecuación, un fragmento y una figura conservando proporciones.

La versión ciega se deriva del mismo artículo con el indicador de anonimización y
se conserva aparte: no se le aplica el normalizador que asigna el nombre del autor
a los documentos firmados. La comprobación automática de nombres y metadatos no
garantiza anonimato frente a búsquedas ni sustituye revisión de una persona intermediaria.

## Reproducción

Desde la raíz, con Node, TeX Live/latexmk, biber y las dependencias Python declaradas:

```sh
make generar-ep6
make construir-articulo construir-maestro construir-articulo-ciego
make verificar-ep6 revisar-edicion-ep6
make verificar COBRIA_SITE_ISOLATED=1
```

`build.mjs --check` comprueba sin actualizar derivados. Las compilaciones dependen
del generador para evitar resúmenes antiguos. El validador PDF comprueba los tres
derivados frente al resumen y la conclusión de la fuente, normalizando espacios,
ligaduras, guiones de fin de línea y folios aislados. No se confunde igualdad textual
con validación visual, corrección científica o certificación PDF/UA.

Los resultados y las imágenes de inspección se conservan en `output/review/ep6/`.
Artículo firmado y copia ciega: 16 páginas cada uno; maestro: 204 páginas. Se
inspeccionan planchas de todas las páginas y ampliaciones de las secciones afectadas;
no es evaluación independiente ni revisión académica externa de todo el contenido.

## Cierre local verificado

El 23 de octubre de 2026 se superaron las seis pruebas específicas EP6,
`make verificar COBRIA_SITE_ISOLATED=1`, la validación del manifiesto de réplica
y la comprobación de congelamiento PC2. Los registros están en
`output/review/ep6/`: `pruebas-finales.log`, `verificacion-completa.log`,
`congelamiento-pc2.log`, `PDF.json` y `descargas.log`.
Se inspeccionaron las planchas de todas las páginas y ampliaciones de resultados.
Las descargas locales del artículo y maestro se sincronizaron; no se publicó el sitio.

## Pendientes externos y de otras fases

La ampliación bibliográfica sistemática pertenece a EP7. La réplica externa, el
estudio de transferencia y el doble cribado requieren participación humana real.
La publicación del sitio y el envío a una sede no se realizan con esta fase. El
repositorio conserva cambios previos sin confirmar; compilar desde ese árbol no
equivale a una release Git reproducible.
