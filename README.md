# COBRIA — investigación y ecosistema pedagógico

Proyecto LaTeX del trabajo:

> **COBRIA: diseño y evaluación de una arquitectura de datos canónicos y
> proyecciones reconstruibles para sistemas NoSQL multiinquilino orientados a
> minería de datos e inteligencia artificial**

## Estructura

El plan operativo de entrega pública vigente es
[EP0 a EP12](ROADMAP-ENTREGA-PUBLICA-COBRIA.md), basado en la auditoría del 19 de octubre
de 2026. Corrige profundidad pedagógica, coherencia científica y divergencia entre
alojamiento y fuentes. Planificar una fase no equivale a ejecutarla ni autoriza publicación.
La [entrega EP0](editorial/ep0/ENTREGA.md) conserva el alcance confirmado, veinte
incidencias y la matriz de productos. `make capturar-ep0` registra fuentes y estado
público en un corte nuevo; no construye, corrige ni despliega los productos.

La [entrega EP1](editorial/ep1/ENTREGA.md) prepara la reparación web y las descargas:
validada localmente, **sin despliegue ni cierre público**. Para construir o verificar,
active un entorno Python e instale `python -m pip install -r requirements-build.txt`.
`make verificar-ep1` prueba las regresiones; `make auditar-ep1-local
COBRIA_EP1_SITE=/ruta/absoluta/sitio-construido` prueba HTTP con Workers local.

El cierre pedagógico anterior sigue [C0 a C15](ROADMAP-CIERRE-C0-C15.md).
Las correcciones de la revisión profunda se ejecutan con el
[roadmap correctivo PC0 a PC11](ROADMAP-CORRECTIVO-COBRIA.md), vinculado a ese cierre.
PC0 incorpora [inventario e integridad exacta](editorial/pc0/AUDITORIA-PC0.md):
`make generar-manifiesto-paquete` regenera explícitamente y `make verificar-pc0`
comprueba sin corregir el manifiesto conservado.
PC1 documenta la [revisión de los treinta ejemplos](editorial/pc1/AUDITORIA-PC1.md),
sus regresiones y la diferencia entre propuestas locales y efectos persistidos.
PC2 prepara [el protocolo de evaluación nuevo](editorial/pc2/AUDITORIA-PC2.md),
con contratos P1–A1 y congelamiento local; no reutiliza las cifras R7 como resultados nuevos.
PC3–PC6 registran [preparación experimental](editorial/pc3/AUDITORIA-PC3.md),
[correcciones científicas](editorial/pc4/AUDITORIA-PC4.md),
[pruebas multirrol](editorial/pc5/AUDITORIA-PC5.md) y
[85 prácticas individuales](editorial/pc6/AUDITORIA-PC6.md).
No están cerradas las corridas remotas, la integración Firebase ni la validación humana.
PC7 añade [tipografías locales, glosario compartido y revisión de edición](editorial/pc7/AUDITORIA-PC7.md).
`make revisar-edicion-pc7` comprueba las fuentes y geometría del libro, cuaderno y anexo.
PC8 incorpora [construcción pública y portabilidad](editorial/pc8/AUDITORIA-PC8.md):
`make construir-publico` no necesita los repositorios observados;
`make verificar-referencias-autorizadas` mantiene esa auditoría separada.
La CI remota del candidato final sigue pendiente de ejecución y observación.
PC9 y PC10 añaden [protocolo y guía de revisión](editorial/pc9/GUIA-REVISION.md)
y [preparación de entrega](editorial/pc10/ENTREGA-Y-PUBLICACION.md).
`make preparar-pc9-pc10` genera un ZIP editorial identificado y un registro de
bloqueantes; no equivale a distribución ejecutable final, revisión humana o publicación.
Las [fases 11 y 12 del ecosistema](editorial/ecosistema-11-12/ENTREGA.md) incorporan
un recorrido integrado de Build y la comprobación del Toolkit instalado fuera del
checkout. `make verificar-ecosistema-11-12` comprueba aplicación y diccionario;
`make probar-instalacion-toolkit` comprueba la distribución local.
Las [fases 13 y 14 del ecosistema](editorial/ecosistema-13-14/ENTREGA.md) añaden
trazabilidad científica generada, réplica funcional acotada y conservación de
estructura semántica en la edición PDF. No cierran las corridas remotas nuevas,
la revisión humana ni la revisión visual integral pendiente.
Las [fases 15 y 16 del ecosistema](editorial/ecosistema-15-16/ENTREGA.md) añaden
entradas por necesidad, auditoría de navegador con umbrales explícitos y candidata
interna desde dos construcciones. No autorizan publicar ni sustituyen el commit
final revisado y su CI remota.
Las [fases 17 y 18 del ecosistema](editorial/ecosistema-17-18/ENTREGA.md) incorporan
revisión del ZIP por huella, restauración e inventario de sus fuentes, consulta de
los cuatro bloqueos de dependencias y decisión de publicación retenida. La revisión
automática no equivale a revisión independiente; una corrección posterior exige
otra candidata y CI del SHA final.
La [auditoría C0](editorial/c0/AUDITORIA-C0.md) conserva una línea base de las 17
áreas, evidencias, brechas y criterios pendientes. La cobertura estructural no
equivale a comprensión por lectores ni a una edición terminada.

- `main.tex`: documento maestro, configuración y elementos preliminares.
- `portada.tex`: portada editable.
- `partes/`: ocho partes principales del maestro y antecedentes segregados.
- `articulo-cobria.tex`: versión condensada para evaluación como artículo.
- `editorial/DICCIONARIO-TERMINOLOGICO.md`: vocabulario técnico preferido en español.
- `editorial/data-lessons.json`: fuente vigente de las cinco lecciones de Datos;
  reemplaza para ese módulo las entradas iniciales de `pedagogy.json` y
  `pedagogy-extension.json`. `build-curriculum.mjs` genera el currículo compartido:
  no se edita `curriculum.json` a mano.
- `editorial/architecture-lessons.json`: fuente vigente de Arquitectura y Capas,
  con pruebas de un mismo registro. `data/arquitectura.json` de la aplicación
  documenta las responsabilidades por archivo y alimenta el mapa del libro y la web.
- `replication/`: protocolos, implementación neutral, resultados y análisis automático.
- `replication/examples/ecosistema-app/`: aplicación neutral ejecutable y probada.
- `manuales/`: fundamentos, capas, patrones, datos, calidad, operación, IA y guía de construcción.
- `manuales/25-normas-y-evaluacion-de-calidad.md` y `editorial/standards-map.json`:
  adopción temática de SQuaRE y referencias oficiales por área, sin certificación implícita.
- `manuales/24-organizacion-y-operacion-del-proyecto.md`: organización, contratos de datos,
  límites, offline, UX, Functions, observabilidad y entrega con evidencia.
- `replication/examples/operacion-documental/`: mecanismos pequeños ejecutables de operación
  y sus pruebas, sin credenciales ni infraestructura remota.
- `MANIFESTO.md`: principios, vocabulario, límites y promesa responsable del ecosistema.
- `ROADMAP-CIERRE-ECOSISTEMA-COBRIA.md`: plan de cierre que integra todas las partes
  COBRIA, el catálogo de patrones, el Toolkit, la evidencia y los productos públicos.
- `IDENTIDAD-ECOSISTEMA-COBRIA.md`: definición, promesa, audiencias, nombres y versiones.
- `ARCHIVO-Y-FUENTES-CANONICAS.md`: clasificación y autoridad de fuentes, derivados,
  evidencia, paquetes de revisión e históricos.
- `LICENSE`, `LICENSE-CODE.txt`, `LICENSE-CONTENT.md`, `LICENSES.md`, `NOTICE` y
  `PROVENANCE.md`: derechos, exclusiones y
  procedencia verificable del código, textos, datos, ilustraciones y referencias.
- `archivo/artefactos/`: construcciones antiguas conservadas fuera de las rutas canónicas.
- `MAINTENANCE.md`, `CONTRIBUTING.md` y `SECURITY.md`: mantenimiento, colaboración y
  reporte responsable de vulnerabilidades.
- `CHANGELOG.md`, `CITATION.cff` y `ROADMAP-1.X.md`: historia, cita y evolución pública.
- `PUBLICATION-READINESS-1.0.0.md`: puerta honesta entre candidata y versión estable.
- `specification/MAPA-ECOSISTEMA.md`: responsabilidades y dependencias entre productos COBRIA.
- `specification/phase-2/`: actores, casos de uso, requisitos y trazabilidad del ecosistema.
- `specification/phase-3/`: diccionario de datos, catálogos, migraciones y ejemplos validables.
- `specification/phase-4/`: nodos, agregados, topología, propiedad y decisiones NoSQL.
- `specification/phase-5/`: capas, responsabilidades, estructura e imports permitidos.
- `specification/phase-6/`: documentación, comentarios, errores, i18n, tiempo y unidades.
- `specification/phase-7/`: amenazas, capacidades, privacidad, secretos, suministro e incidentes.
- `specification/phase-8/`: ambientes, desplegables, promoción, rollback y recuperación.
- `specification/phase-9/`: estrategia de pruebas, observabilidad, SLO, alertas y evidencia.
- `specification/phase-10/`: contratos de API/eventos, UX, responsive y accesibilidad.
- `specification/phase-11/`: nueve manifiestos generados y legibles por herramientas.
- `specification/phase-12/`: JSON Schema, contrato y códigos del COBRIA Toolkit CLI.
- `specification/phase-13/`: quince generadores idempotentes y plantillas relacionadas.
- `specification/phase-14/`: auditor estático explicable, reglas, límites y fixtures.
- `specification/phase-15/`: plan comparativo, presupuestos y manual de costo y sostenibilidad.
- `specification/phase-16/`: política, contexto y límites verificables para agentes de IA.
- `specification/phase-17/`: fuente canónica y sincronización de productos editoriales.
- `specification/phase-18/`: réplica externa, revisión, transferencia y publicación responsable.
- `specification/phase-19/`: COBRIA Engineering, operación, resiliencia, entrega, rendimiento y evolución.
- `specification/phase-20/`: laboratorio ejecutable de los contratos COBRIA Engineering.
- `specification/phase-21/`: piloto reproducible de adopción estructural en POS Guápiles.
- `specification/phase-22/`: manifiesto y motor genérico para evaluar adopción Engineering desde Git.
- `specification/phase-23/`: comparación reproducible de transferencia Engineering en tres repositorios.
- `specification/phase-24/`: protocolo ciego de revisión semántica independiente y acuerdo entre revisores.
- `specification/phase-25/` a `phase-36/`: calibración, revisión independiente, operación controlada, réplica externa, síntesis y preparación responsable de publicación.
- `editorial/canonical.json`: identidad, versiones y afirmaciones compartidas con evidencia.
- `editorial/products.json`: autoridad, fuente, construcción y salida de cada producto.
- `referencias.bib`: bibliografía compartida por todas las partes.
- `figuras/`: futuras figuras externas.
- `tablas/`: futuros datos o tablas auxiliares.
- `build/`: archivos de compilación ignorados.
- `specification/COBRIA-ECOSISTEMA-2.0-PROPUESTA.md`: arquitectura editorial del ecosistema.
- `libro-cobria/`: edición pedagógica completa generada desde código.
- `sitio/`: sitio interactivo COBRIA, incorporado al mismo repositorio y conservando su configuración de publicación.

COBRIA Core 1.0 permanece como núcleo normativo congelado. Los manuales del
ecosistema amplían la enseñanza y la aplicación práctica sin convertir cada
recomendación general de software en un requisito de conformidad Core.

El alcance y la separación entre norma, evidencia y enseñanza están fijados por
`specification/ADR-0001-ALCANCE-ECOSISTEMA.md`.

Cada nueva parte debe crearse como un archivo independiente dentro de `partes/` e
incluirse desde `main.tex`.

## Compilación

La [preparación EP10](editorial/ep10/ENTREGA.md) distingue instantánea local,
reconstrucción doble, revisión de distribución y CI del SHA aprobado. Su recibo
no autoriza una release ni convierte el árbol de trabajo en un commit aprobado.

La [edición EP9](editorial/ep9/ENTREGA.md) añade seis lecturas HTML con índice,
fórmulas MathML y transcripciones de diagramas; documenta el etiquetado de siete
PDF y sus límites. La prueba con tecnología de apoyo y la lectura humana siguen
pendientes; no hay declaración PDF/UA ni publicación.

La [revisión EP7](editorial/ep7/ENTREGA.md) comparte 46 referencias entre los
productos, documenta correcciones, consultas y procedencia y conserva el cribado
humano pendiente. `make generar-ep7 verificar-ep7` comprueba derivados sin red;
la consulta nueva de enlaces requiere `node editorial/ep7/check-links.mjs --refresh`.
La [decisión EP8](editorial/ep8/ENTREGA.md) excluye justificadamente experimentos
nuevos para el preprint acotado elegido, **sin cerrar PC3**. `make verificar-ep8`
comprueba el alcance y los congelamientos; no ejecuta motores ni inventa corridas.

La [reconciliación EP6](editorial/ep6/ENTREGA.md) comparte resumen, conclusión y
límites entre artículo y maestro. `make generar-ep6 verificar-ep6` comprueba las
afirmaciones principales contra sus fuentes; `make revisar-edicion-ep6` contrasta
los PDF firmados y el artículo ciego. R7 no valida retrospectivamente PC2 y PC3
continúa sin observaciones confirmatorias nuevas.

Sin experiencia previa, empieza por [De una idea a tu primera prueba](manuales/35-programar-desde-cero.md).
La [entrega EP3](editorial/ep3/ENTREGA.md) desarrolla un caso completo por cada una
de las 17 áreas, comparte sus fuentes con libro y web y revisa la clasificación de
las treinta fichas. `make verificar-ep3` ejecuta ejemplos y rechazos en una copia
nueva; las decisiones de diseño se entregan con rúbrica, no como validación humana.
La [entrega EP2](editorial/ep2/ENTREGA.md) comparte diez unidades entre manual,
libro y web (`/comenzar/desde-cero`). `make verificar-ep2` reproduce los cambios,
fallos y recuperaciones desde una copia nueva; no equivale a validación con lectores.

Para aprender desde cero, empieza por [Tu primer proyecto](manuales/26-primer-proyecto-paso-a-paso.md).

Para elegir un mecanismo sin confundir ejemplos con requisitos, consulta
[Core y patrones en la práctica](manuales/29-core-y-patrones-en-la-practica.md).
Cada patrón dispone de alternativa, costo, caso adverso y límite de demostración.
Solo necesita Node y npm; no requiere instalar bases de datos ni las herramientas
editoriales. `make verificar-c1` comprueba la ruta inicial en una copia nueva y
distingue su ejecución local de una prueba con lectores reales.

Continúa con [Datos desde cero](manuales/27-datos-desde-cero.md): `make verificar-c2`
comprueba cinco prácticas del diccionario, Dater, catálogos, consulta y migración.
El taller local no crea índices ni cambia los adaptadores remotos de la aplicación.

Después sigue [Construir un registro por capas](manuales/28-arquitectura-y-capas-paso-a-paso.md).
Las prácticas iniciales solo necesitan Node; `make verificar-c3` añade el análisis
sintáctico del grafo y requiere las dependencias de réplica (`npm ci --prefix replication`).

El taller [Del formulario al permiso comprobado](manuales/30-api-ux-seguridad-y-privacidad.md)
conecta esas capas mediante HTTP local y una interfaz con estados observables.
`make verificar-c5` comprueba aceptación, rechazo y coherencia editorial; no requiere
instalar paquetes para el servidor. Las sesiones son DEMO, no autenticación de producción.

Continúe con [Calidad, rendimiento y operación](manuales/31-calidad-rendimiento-y-operacion.md).
`make verificar-c6` reproduce un defecto de caché aislado, comprueba la lectura
autorizada y ensaya exportación, restauración y reversión locales. El microensayo de
consulta tiene protocolo propio; no sustituye los experimentos científicos ni un despliegue.

[Analítica e IA con procedencia](manuales/32-analitica-e-ia-con-procedencia.md)
añade dos cortes temporales, exclusiones, fuga por entidad, citas y abstención.
`make verificar-c7` ejecuta el taller y conserva los desaciertos de diez consultas
sintéticas. No entrena modelos ni llama a proveedores externos de IA.

[Documentación y herramientas prácticas](manuales/34-documentacion-y-herramientas-practicas.md)
conecta un tutorial ejecutable, la referencia CLI, el ADR del agregado y la recuperación
local. `make verificar-c9` comprueba el recorrido y sus límites; no completa por sí solo
el contrato de negocio de los esqueletos generados.

La [guía para recorrer libro y web](manuales/35-como-recorrer-el-libro-y-la-web.md)
explica rutas de entrada, búsqueda, tipos de fragmento y repaso. `make verificar-c10`
comprueba su coherencia local; no sustituye evaluación con lectores.

Desde la raíz, la interfaz recomendada es:

```sh
make ayuda
make verificar
```

Si la salida generada `sitio/dist` está bloqueada por el entorno local, se puede
comprobar el sitio en una copia temporal conservada, con instalación real desde
lockfile, lint, construcción y las mismas pruebas:

```sh
make verificar COBRIA_SITE_ISOLATED=1
```

Este modo no borra la salida original, no copia secretos `.env*` ni cachés y no
representa un clon Git limpio o una release reproducible. La puerta de publicación
y su auditoría completa de dependencias permanecen independientes y obligatorias.

El `Makefile` funciona como puerta de entrada común, pero conserva aisladas las
dependencias científicas, editoriales y web.

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build main.tex
```

El PDF resultante queda en `build/main.pdf`. El artículo se compila sustituyendo
`main.tex` por `articulo-cobria.tex` y utilizando un directorio de salida separado.

El sitio se valida de forma independiente desde `sitio/`:

```sh
cd sitio
npm ci
npm test
```

La investigación, la especificación, el libro y el sitio comparten este repositorio,
pero mantienen construcciones separadas para que una dependencia web no afecte la
reproducibilidad del paquete científico.

Los PDF publicados por el sitio se generan fuera de `sitio/` y se sincronizan con
`make sincronizar-descargas`. Las copias dentro de `sitio/public/downloads/` son
artefactos de construcción ignorados por Git; sus fuentes y versiones canónicas
permanecen en el nivel raíz.

## Campos por completar

C8 añade la [aplicación integral local](manuales/33-aplicacion-integral-neutral.md):
formulario, HTTP y motor documental real, sin alterar Core 1.0 ni publicar el sitio.
El alcance y sus límites están separados de los resultados científicos históricos.

La candidata RC2 fue construida dos veces desde clones limpios del commit `cf59f07`.
El registro automático `review/RC2-LOCAL-2026-10-17.json` conserva las huellas y los
límites de esa verificación. No se publicó. Las referencias locales utilizadas no
están incluidas en el ZIP; consulte `GUIA-REPRODUCCION-RC2.md` y
`PUBLICATION-READINESS-1.0.0.md` para distinguir construcción local, CI y validación externa.

Antes de una entrega institucional deberán definirse tutor, programa, universidad y
tipo de trabajo, si corresponden. La revisión independiente y el estudio con personas
no se presentan como ejecutados mientras dependan de intervención humana.
