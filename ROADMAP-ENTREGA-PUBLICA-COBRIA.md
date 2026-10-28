# Roadmap de entrega pública de COBRIA

**Fecha:** 19 de octubre de 2026  
**Estado:** plan pendiente de ejecución, basado en la auditoría de productos y alojamiento  
**Responsable editorial:** Billy Jak Cordero Porras  
**Repositorio:** <https://github.com/billy-una/cobria>  
**Alcance:** libro, artículo, documento maestro, web y entrega reproducible  
**Naturaleza:** propuesta independiente; no certificación ni estándar oficial

## Resultado y relación con los planes anteriores

La entrega debe permitir que una persona encuentre la versión correcta, aprenda con
ejemplos desarrollados, reproduzca los recorridos anunciados y distinga evidencia de
propuestas. Compilar, tener cientos de páginas o superar pruebas estructurales no basta.

Este es el plan operativo vigente para remediar la auditoría del 19 de octubre. No
reinicia ni declara terminadas las fases del ecosistema, PC, C o R. Conserva sus
implementaciones y evidencias; reabre los criterios de producto que no se han satisfecho.
La arquitectura objetivo sigue en `ROADMAP-CIERRE-ECOSISTEMA-COBRIA.md` y la historia
de remediación permanece en `ROADMAP-REMEDIACION-PUBLICA-1.0.md`.

Se usa el prefijo **EP** para evitar confundir esta secuencia con fases anteriores.
Todas las fases comienzan **pendientes**: la existencia de antecedentes no las aprueba.
Este plan no autoriza desplegar, publicar una release, usar secretos o crear etiquetas.
Core 1.0 permanece congelado. El alcance activo de datos y experimentos sigue siendo
NoSQL; el material SQL histórico no se reincorpora a los productos vigentes.

## Línea base que debe conservarse

La auditoría observó:

- portada pública anterior al enfoque completo y otras rutas con la aplicación nueva;
- manifiesto público de descargas con respuesta 404 y enlace público a tesis con 404;
- huellas públicas de libro, artículo y maestro distintas de sus copias locales actuales;
- cabeceras de seguridad ausentes en las respuestas públicas comprobadas;
- 85 lecciones, 25 con ejecución declarada y 60 sin ella; estas últimas no son
  necesariamente defectuosas, pero no se presentan como tutoriales ejecutables;
- lecciones breves, rúbricas repetidas y soluciones que todavía no desarrollan una respuesta;
- discrepancia de dos frente a tres perfiles y distinta precisión científica entre
  resúmenes y conclusiones; PC3 sigue sin observaciones confirmatorias nuevas;
- código fuera del margen en una página del maestro y revisión visual integral pendiente;
- candidata interna verificada, árbol principal con cambios sin confirmar y CI final pendiente.

Son observaciones del corte indicado, no garantías sobre el alojamiento futuro. EP0
guardará evidencia reproducible de su estado al iniciar. No se reconstruyen registros
faltantes ni se atribuyen las observaciones a una revisión humana independiente.

## Dos metas de publicación

### Entrega educativa y científica preliminar

Libro y web utilizables, maestro reconciliado y artículo como preprint de alcance
limitado. Puede describir R7 como evidencia histórica bajo su arnés, sin afirmar
validación de contratos posteriores, superioridad universal o eficacia educativa.
Debe superar correcciones técnicas, integridad, licencias, revisión editorial acordada
y autorización humana. El estado de candidata y los pendientes se muestran claramente.

### Entrega estable según el compromiso del proyecto

Además de lo anterior, exige las revisiones humanas, cribado, transferencia, réplica
externa y autorización que mantiene el roadmap del ecosistema. Un resultado local no
cierra esas puertas. DOI, ISBN, depósito o certificaciones no son requisitos generales
para compartir la propuesta y no se inventan para aparentar formalidad.

Los nuevos experimentos son obligatorios si se mantienen afirmaciones que los necesitan;
no se convierten en un bloqueo artificial para divulgar resultados anteriores bien delimitados.

## Orden y dependencias

| Fase | Resultado principal | Depende de | Participación |
|---|---|---|---|
| EP0 | Línea base y alcance de entrega | — | Asistida; decisiones editoriales del responsable |
| EP1 | Corrección de la divergencia web preparada | EP0 | Técnica; despliegue separado y autorizado |
| EP2 | Recorrido inicial completo y evaluable | EP0 | Editorial y técnica |
| EP3 | Desarrollo de las 17 áreas y catálogo | EP2 | Editorial y técnica |
| EP4 | Proyecto incremental y ejemplos comprobados | EP2; iterativa con EP3 | Técnica y pedagógica |
| EP5 | Web que refleja el libro desarrollado | EP1; iterativa con EP3–EP4 | Técnica y editorial |
| EP6 | Artículo y maestro reconciliados | EP0 | Científica y editorial |
| EP7 | Bibliografía y procedencia trazables | EP0; acompaña EP3 y EP6 | Asistida y revisión humana |
| EP8 | Evaluación nueva si el alcance la requiere | EP6–EP7, contratos congelados | Experimental; externa cuando corresponda |
| EP9 | Edición y accesibilidad de la candidata | EP3–EP7; EP8 si aplica | Automática y visual/manual |
| EP10 | Candidata final reproducible y CI observada | EP9 | Técnica; confirmación de cambios autorizada |
| EP11 | Recepción y aceptación de revisiones | EP10 | Personas y equipos externos |
| EP12 | Publicación exacta y mantenimiento | EP10; EP11 según la meta | Autorización humana y comprobación pública |

EP6 y EP7 pueden avanzar mientras se desarrolla el libro. No se esperan todos los
capítulos para corregir una afirmación científica. EP3 y EP4 trabajan por entregas
verticales: explicación, ejemplo, prueba y reflejo web juntos, no cuatro colecciones separadas.

## EP0 Congelar el alcance y registrar la línea base

**Implementación y decisión de alcance:** [entrega EP0](editorial/ep0/ENTREGA.md).
El usuario eligió candidata educativa y preprint; no autorizó publicación estable ni
despliegue. Las capturas fechadas en `output/review/ep0/` determinan la evidencia del
corte. La finalización de la captura no cierra las incidencias de las fases siguientes.

**Trabajo:** inventariar las fuentes canónicas, fuentes pedagógicas, PDF, descargas,
rutas, versión desplegada, huellas y cambios locales. Registrar las incidencias con
ubicación, impacto, prioridad, dependencia y criterio de retest. Elegir explícitamente
la meta de entrega; no fijar un número de páginas como objetivo de calidad.

**Entregables:** inventario fechado, matriz de incidencias, matriz fuente–producto–prueba
y decisión de alcance. Identificar qué antecedentes siguen siendo válidos y cuáles
requieren repetición después de cambiar fuentes.

**Cierre:** cada hallazgo de esta auditoría tiene responsable propuesto, corrección o
justificación y prueba de aceptación. No hay porcentajes de avance deducidos de archivos.

## EP1 Preparar la reparación de la publicación divergente

**Entrega local:** [diagnóstico, evidencia y plan de reversión](editorial/ep1/ENTREGA.md).
Estado: preparada y probada localmente; pendiente de publicación autorizada y contraste público.

**Trabajo:** localizar qué sirve cada ruta pública: aplicación, archivo estático,
redirección, caché o versión anterior. Corregir la causa, no solo el título visible.
Preparar una aplicación única, recursos canónicos y manifiesto. Resolver la ruta de
tesis mediante enlace canónico o redirección deliberada. Aplicar cabeceras mediante
el mecanismo real del alojamiento y comprobar que no rompan scripts, fuentes ni descargas.

**Entregables:** corrección local probada, mapa de rutas y cachés, plan de despliegue
dirigido, reversión y comparación pública por huellas. No sobrescribir archivos históricos.

**Cierre local:** rutas previstas y seis descargas pasan en una construcción nueva.
**Cierre público:** únicamente tras un despliegue autorizado, acceso anónimo, manifiesto
200, enlaces correctos, cabeceras verificadas y descargas idénticas al paquete aprobado.
Hasta entonces EP1 se registra como preparada, no resuelta públicamente.

## EP2 Construir una entrada que una persona principiante pueda seguir

**Entrega:** [piloto ejecutable y protocolo con lectores](editorial/ep2/ENTREGA.md).
La reproducción automática y la validación pedagógica se registran por separado.

**Trabajo:** desarrollar un recorrido piloto en el proyecto neutral existente:
problema, dato, variable, condición, función, objeto, archivo, módulo, error y prueba.
Introducir cada término antes de exigirlo. Conservar los controles del programa, pero
explicar progresivamente identidad, ámbito, autorización e idempotencia.

Cada unidad incluye explicación suficiente, ejemplo resuelto, modificación por el
lector, salida observable, fallo provocado y recuperación específica. Ejecutar una
prueba ya escrita no sustituye aprender a escribir o modificar el programa.

**Entregables:** capítulo inicial completo, archivos ejecutables, resultados esperados,
ejercicios y soluciones desarrolladas. Este piloto fija el nivel de detalle para las demás áreas.

**Cierre automático:** el recorrido se reproduce desde una carpeta nueva con las
instrucciones entregadas. **Cierre pedagógico:** lector principiante realiza la tarea
y se registran atascos y correcciones; si no participa, permanece pendiente.

## EP3 Desarrollar el libro por áreas

**Implementación local:** [casos por área y evidencia](editorial/ep3/ENTREGA.md).
La revisión editorial y las pruebas locales se distinguen de lectura independiente,
profundidad validada con principiantes y publicación.

Mantener las 17 áreas; mejorar profundidad y continuidad antes de añadir otras.

| Área | Desarrollo que debe quedar disponible |
|---|---|
| Primeros pasos | Instalación, editor, terminal, primer programa, cambios y errores recuperables |
| Fundamentos | Datos, funciones, módulos, estado, contratos y pruebas con ejemplos pequeños |
| Arquitectura | Alternativas simples, decisiones y evolución de una aplicación concreta |
| Capas y carpetas | Árbol real, responsabilidades por archivo, imports permitidos y cambios entre capas |
| Código y comentarios | Antes/después de nombres, funciones, comentarios, errores, idioma, tiempo y unidades |
| Datos | Diccionario desde cero, nodos, atributos físicos, Dater, catálogos, consultas, índices y migraciones |
| Core | Autoridad, ámbito, revisión, procedencia, equivalencia y reconstrucción sin ampliar la norma |
| Patrones | Contexto, fuerzas, implementación real, fallo, costo, alternativa y cuándo no usar |
| API y experiencia | Formulario, contratos, estados, accesibilidad e internacionalización completos |
| Documentación | Tutorial, referencia, explicación, guía operativa, ADR y documentación de código |
| Seguridad | Amenaza, control y pruebas positivas/negativas; límites de las sesiones de demostración |
| Calidad y rendimiento | Reproducción, regresión, medición justa, presupuestos y decisiones de optimización |
| Nube y operación | Ambientes, Functions, permisos, límites, staging, promoción, reversión y recuperación |
| Analítica e IA | Datos reproducibles, fuga, características, recuperación, citas, abstención y límites del modelo |
| Aplicación completa | Recorrido incremental que integra las áreas sin ocultar pasos de configuración |
| Herramientas | Instalación y uso del Toolkit, generadores, auditoría y lectura de sus errores |
| Evidencia y evolución | Versiones, trazabilidad, límites, mantenimiento y retirada de decisiones |

**Entregables:** capítulos desarrollados desde fuentes compartidas. Revisar los treinta
patrones especializados y los patrones de entrada: distinguir patrones reconocidos,
adaptaciones, contratos y convenciones. No copiar contenido de otros catálogos ni
prometer cobertura de todos los patrones generales si no se desarrolla.

**Cierre:** cada área tiene problema trabajado, explicación, ejemplo completo apropiado,
decisión alternativa, caso adverso y ejercicio con solución específica. Un ejercicio de
diseño puede evaluarse por un artefacto y una rúbrica; no necesita un comando artificial.
La cantidad de palabras o páginas solo sirve para detectar brechas, no para aprobar calidad.

## EP4 Completar el proyecto conductor y sus ejemplos

**Estado al 23 de octubre de 2026:** completada localmente para la candidata educativa.
Fuentes, alcance y evidencias en `editorial/ep4/ENTREGA.md` y `estado.json`.
No equivale a publicación, revisión humana ni reproducción externa.

**Trabajo:** evolucionar la aplicación neutral existente desde memoria hasta persistencia
NoSQL, API, autorización, catálogo, proyección, reconstrucción y operación. Añadir analítica
y recuperación con procedencia sin atribuirle calidad de un LLM si no lo utiliza.
Guardar hitos reproducibles del mismo proyecto, no crear aplicaciones incompatibles por capítulo.

Cada ejemplo declara archivos, requisitos, entradas, salidas, pruebas, límites y licencia.
Los fragmentos se identifican como ejecutables, extractos o pseudocódigo. Explicar tipos
y auxiliares referenciados. Mantener una implementación de referencia completa y añadir
Python, Java o Go solo con implementación y pruebas equivalentes; no exigir cuatro
traducciones para aparentar amplitud. Presentar claramente la cobertura real por lenguaje.

**Entregables:** hitos, mapa de responsabilidades, ejemplos y soluciones probadas.
Para Firebase o nube, separar simulación, emuladores, staging y producción; no tratar
sesiones DEMO como autenticación real. Accesos y gastos requieren autorización específica.

**Cierre:** otra copia ejecuta los hitos y sus casos adversos según instrucciones.
Los ejercicios muestran cambios realizados y efectos comprobables, no solo resultados verdes.

## EP5 Reflejar el libro en una web pedagógica

**Estado al 23 de octubre de 2026:** completada para la candidata educativa local.
Recorridos, progreso voluntario, búsqueda ampliada y paridad libro–web–ejemplo;
evidencias y límites en `editorial/ep5/ENTREGA.md` y `estado.json`.
La publicación y la evaluación con lectores no se consideran realizadas.

**Trabajo:** consumir las mismas unidades desarrolladas, sin resumirlas de nuevo en
fichas mínimas. Integrar entradas por nivel y problema, progreso local, búsqueda,
mapas, patrones relacionados y enlace de cada ejemplo a su hito. Conservar tipografía
legible, contraste, teclado, móvil, movimiento reducido y copiado con aviso accesible.

La historia personal permanece en su sección, sin dispersarla en las lecciones.
Usar naturaleza y comunidad costarricenses con ilustraciones pertinentes y sin jaguares.
No añadir anuncios o seguimiento sin la integración, privacidad y autorización correspondientes.
SEO y recursos para agentes describen contenido real; no introducen instrucciones manipuladoras.

**Entregables:** rutas de lectura completas, recursos versionados y matriz de paridad
libro–web–ejemplo. Definir presupuestos de rendimiento antes de aprobar la candidata.

**Cierre:** paridad semántica sin duplicación manual divergente; recorridos completos
en móvil y escritorio, búsqueda útil, enlaces y descargas válidos y pruebas de teclado.
La comprobación del alojamiento se conserva separada de las pruebas locales.

## EP6 Reconciliar artículo y documento maestro

**Estado local (2026-10-23): completada para el preprint acotado.** Artículo,
maestro y copia ciega reconciliados; seis pruebas específicas y verificación general
superadas. Véanse `editorial/ep6/ENTREGA.md` y `editorial/ep6/estado.json`.
No equivale a publicación, réplica externa ni validación experimental nueva.

**Trabajo:** elegir una contribución científica principal y su alcance real. Clasificar
cada afirmación por norma, implementación, prueba funcional, experimento histórico,
experimento nuevo o evaluación externa. Aclarar en resumen, método y conclusiones que
R7 no valida retrospectivamente los contratos posteriores PC2. No confundir A1 con
calidad generativa ni el ensayo algorítmico con rendimiento distribuido.

Corregir dos frente a tres perfiles, denominaciones, tablas y encabezados de
generalización. El maestro conserva una narración vigente; los antecedentes se separan,
sin pedir al lector que decida qué capítulo invalida a otro. El artículo resume la
contribución científica, no todo el ecosistema pedagógico. Mantener anonimización coherente.

**Entregables:** artículo y maestro reconciliados, registro de afirmaciones con sus
fuentes y amenazas, tablas regeneradas cuando cambien entradas autorizadas.

**Cierre:** título, resumen, resultados, discusión y conclusiones sostienen el mismo
alcance. Ninguna cifra nueva sin crudos y ningún resultado del arnés antiguo se
presenta como validación de controles que no ejecutó. PC3 sin datos sigue explícito.

## EP7 Completar bibliografía y procedencia

**Estado local (2026-10-23): revisión exploratoria dirigida implementada.** Corpus
compartido de 46 referencias, seis comparaciones, correcciones bibliográficas y
procedencia contrastada. Véase `editorial/ep7/ENTREGA.md`. Doble cribado y revisión
jurídica no se declaran completados; no es revisión sistemática concluida.

**Trabajo:** ejecutar y registrar la búsqueda prevista, distinguir artículos, normas,
prepublicaciones y documentación oficial. Comparar mecanismos concretos y no deducir
novedad de no encontrar la palabra COBRIA. Integrar citas por tema en el libro y el
sitio y referencias completas coherentes con artículo y maestro.

Verificar enlaces, autorías, ediciones y correspondencia cita–referencia. Completar
procedencia de ilustraciones, fuentes, datos y código; conservar licencias originales.
La asistencia de IA no se registra como selección independiente de una persona.

**Entregables:** registros de búsqueda y exclusión, tabla comparativa, bibliografía
compartida y registro de procedencia. Doble cribado y adjudicación reales cuando se
reclame revisión sistemática o se cierre la puerta estable correspondiente.

**Cierre:** afirmaciones relevantes respaldadas, referencias resolubles y selección
descrita con su alcance real. Sin doble cribado, no se presenta como revisión sistemática concluida.

## EP8 Ejecutar investigación nueva cuando corresponda

**Decisión para esta entrega (2026-10-23): excluida justificadamente.** El objetivo
EP0 es candidata educativa y preprint acotado. `editorial/ep8/decision.json` registra
la exclusión y condiciones de reentrada; `editorial/ep8/ENTREGA.md` explica el alcance.
PC3 continúa pendiente: ninguna corrida nueva ni puerta estable se declara cerrada.

**Condición de entrada:** decisión explícita de sostener afirmaciones que exceden R7.
Si se elige preprint acotado, registrar la exclusión justificada de esta fase para esa
entrega, sin declarar ejecutados experimentos ni cerrar puertas estables por ello.

**Trabajo:** completar conectores y ejecutor PC3, congelar consultas e índices nativos
equivalentes, cargas, presupuestos, entorno, calentamiento y orden antes de medir.
Comparar canónico indexado, proyección y alternativas pertinentes con el mismo resultado.
Medir actualización, recuperación y costo total, no solo lectura de una colección menor.
Respetar el diseño congelado: cualquier cambio exige enmienda previa y no se oculta.

Ejecutar piloto, resolver fallos del arnés y producir las corridas previstas por P1,
P2, R1, S1 y A1. Guardar fallos y negativos y regenerar análisis, intervalos, efectos,
tablas y gráficos. La evaluación de un modelo generativo requiere protocolo propio.

**Cierre:** dataset elegible, entorno y crudos verificables, análisis reproducible y
afirmaciones revisadas en EP6. La ejecución del autor no sustituye réplica externa.

## EP9 Terminar edición y accesibilidad

**Avance local del 25-10-2026:** implementación editorial y lecturas HTML verificadas;
véase [entrega EP9](editorial/ep9/ENTREGA.md). Siete PDF regenerados, índice de consulta,
diagramas corregidos, inspección macro por página y seis formatos HTML con navegación
de teclado. El cierre integral sigue pendiente de tecnología de apoyo y lectura humana;
no se declara PDF/UA, publicación ni versión estable.

**Trabajo:** revisar todas las páginas de los PDF finales, incluidas tablas, código,
figuras, bibliografía y saltos. Corregir desbordamientos como el observado en el
maestro; registrar página, defecto, corrección y retest. Revisar ortografía y lenguaje
sin traducir títulos originales ni identificadores de APIs de forma incorrecta.

Completar sinopsis, audiencia, uso del libro, glosario, índice de consulta y referencias.
No inflar la obra con páginas repetitivas ni ocultar contenido para superar geometría.
Comprobar etiquetado, orden de lectura, navegación y textos alternativos. Declarar
qué PDF está etiquetado; no afirmar PDF/UA sin evaluación. Para formatos inaccesibles,
entregar una alternativa HTML equivalente y verificarla, no usarla como excusa para ignorar fallos.

**Cierre:** registro de inspección integral, cero defectos bloqueantes conocidos y
retests de las páginas corregidas. Axe, geometría o estructura etiquetada por sí solos
no certifican accesibilidad ni comprensión. Teclado y tecnología de apoyo se prueban aparte.

## EP10 Construir una candidata realmente identificada

**Preparación local del 28-10-2026:** [procedimiento EP10](editorial/ep10/ENTREGA.md)
con inventario, instantánea sin historia y doble construcción. El resultado efectivo
se consulta en `editorial/ep10/recibo.json`; no se presume aprobación, CI del SHA
ni autorización para distribuir las fuentes. La consulta remota conservada en
`editorial/ep10/ci-observada.json` no acredita esta candidata.

**Trabajo:** revisar los cambios existentes sin descartarlos y confirmar un SHA final
mediante el flujo autorizado. Instalar bloqueos, construir dos veces en clones limpios,
ejecutar la puerta pública sin repositorios privados y observar CI remota del mismo SHA.
Conservar inventarios, equivalencia declarada, SBOM, auditorías y recibos.

Crear un paquete público saneado; no redistribuir automáticamente el bundle interno
con toda su historia. Revisar privacidad y derechos también en salidas y metadatos.
Identificar versión, fecha, estado, autoridad, limitaciones y huellas de los seis PDF.

**Cierre:** los archivos entregables corresponden al SHA aprobado y sus construcciones;
CI observada, reproducción pública comprobada y archivo revisado. No se reutiliza una
aprobación de bytes distintos. Fechas y serialización PDF pueden variar: declarar
criterios de equivalencia sin prometer identidad binaria no comprobada.

## EP11 Recibir y evaluar evidencia humana y externa

**Trabajo:** entregar la candidata identificada a revisión técnica y editorial; medir
comprensión con principiantes mediante tareas y criterios acordados. Cuando corresponda,
ejecutar transferencia con consentimiento, doble cribado y réplica externa con sus protocolos.
Recibir originales, conflictos, asistencia y límites; conservar desacuerdos y retests.

Completar el flujo de aceptación hoy ausente: evidencia recibida, evaluación del
responsable, aceptación o rechazo justificado y vínculo a la candidata. Comprobar
que el procedimiento acepta evidencia completa y rechaza simulaciones, huellas
distintas y registros incompletos; no basta un rechazo incondicional ni una bandera JSON.

**Cierre:** matriz por puerta con evidencia auténtica y decisión razonada. Una revisión
asistida por IA se identifica como tal. No inventar revisores ni equiparar identidad
declarada con independencia demostrada. Un cambio material posterior invalida la
aprobación afectada y vuelve a EP9–EP10; el responsable determina el alcance del nuevo retest.

## EP12 Publicar los mismos archivos y mantenerlos

**Entrada:** autorización humana explícita para la meta elegida. La candidata preliminar
no se denomina estable ni evita sus advertencias. La etiqueta estable exige las puertas
del compromiso vigente; este plan no las elimina ni las marca cumplidas.

**Trabajo:** publicar versión del repositorio, sitio y descargas con los artefactos
aprobados; guardar SHA, versión de alojamiento, fecha, huellas y autorización. Comprobar
desde acceso anónimo las rutas críticas, cabeceras, manifiesto, seis PDF y redirecciones.
Un fallo mantiene la promoción retenida o activa la reversión acordada.

Confirmar responsable de mantenimiento, contacto de seguridad, incidencias, notas de
versión, actualización de dependencias y periodicidad de comprobación de enlaces y
descargas. Las metas de respuesta comunitaria no se presentan como SLA garantizado.
Programar comprobaciones futuras solo si se solicitan; el roadmap no crea automatizaciones.

**Cierre:** público y repositorio coinciden por versión y huellas, no hay enlaces
principales rotos y se conserva un recibo de publicación verificable. Los pendientes
permitidos se muestran; las afirmaciones no exceden la evidencia. El mantenimiento
continúa, sin prometer un estado permanente de software “100 % optimizado”.

## Evidencia y seguimiento de cada fase

Cada fase registra objetivo, alcance, archivos, autoridad, invariantes, pruebas,
resultados, riesgos y trabajo humano pendiente, conforme a la política de agentes.
Mantener estados separados: pendiente, en curso, preparada localmente, ejecutada,
revisada externamente y autorizada para publicación. Solo usar los estados pertinentes.

Un registro de cierre incluye:

- código y nombre de fase, fecha, entradas y huellas;
- hallazgos cubiertos y pendientes;
- cambios y evidencia anterior conservada;
- comandos o método de inspección, salida y artefactos;
- decisión frente al criterio de aceptación y responsable que la toma;
- límite de validez y fases que deben repetirse si cambia una entrada.

Se reutilizan los comandos existentes cuando correspondan:

```sh
make ayuda
make verificar-ecosistema-17-18
make verificar
```

La documentación de pruebas específicas vive junto a su implementación. No se inventan
metas `make verificar-epN` hasta implementarlas y probarlas. `make verificar` es una
condición técnica necesaria, no la aprobación del libro ni la autorización para publicar.

## Definición de entrega lista para el público

| Producto | Condición de aceptación |
|---|---|
| Libro | Progresión entendible, temas desarrollados, ejemplos y soluciones específicos, edición y navegación revisadas |
| Artículo | Contribución delimitada, método y resultados consistentes, límites desde el resumen y réplica identificable |
| Maestro | Una narración vigente, casos y cifras reconciliados, anexos históricos separados y edición sin defectos bloqueantes |
| Web | Reflejo del contenido desarrollado, rutas y accesibilidad verificadas, una versión y descargas exactas |
| Entrega común | Licencias, procedencia, SHA final, CI observada, revisión apropiada, autorización y recibo público |

**Primer paso ejecutable:** EP0 y después EP1 para preparar la reparación de la
divergencia pública. El desarrollo de contenido comienza por EP2; no se salta a
rellenar las 85 lecciones antes de comprobar la calidad del recorrido piloto.
