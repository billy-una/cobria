# COBRIA — investigación y ecosistema pedagógico

Proyecto LaTeX del trabajo:

> **COBRIA: diseño y evaluación de una arquitectura de datos canónicos y
> proyecciones reconstruibles para sistemas NoSQL multiinquilino orientados a
> minería de datos e inteligencia artificial**

## Estructura

- `main.tex`: documento maestro, configuración y elementos preliminares.
- `portada.tex`: portada editable.
- `partes/`: ocho partes del documento maestro.
- `articulo-cobria.tex`: versión condensada para evaluación como artículo.
- `editorial/DICCIONARIO-TERMINOLOGICO.md`: vocabulario técnico preferido en español.
- `replication/`: protocolos, implementación neutral, resultados y análisis automático.
- `replication/examples/ecosistema-app/`: aplicación neutral ejecutable y probada.
- `manuales/`: fundamentos, capas, patrones, datos, calidad, operación, IA y guía de construcción.
- `MANIFESTO.md`: principios, vocabulario, límites y promesa responsable del ecosistema.
- `ROADMAP-CIERRE-ECOSISTEMA-COBRIA.md`: plan de cierre que integra todas las partes
  COBRIA, el catálogo de patrones, el Toolkit, la evidencia y los productos públicos.
- `IDENTIDAD-ECOSISTEMA-COBRIA.md`: definición, promesa, audiencias, nombres y versiones.
- `ARCHIVO-Y-FUENTES-CANONICAS.md`: clasificación y autoridad de fuentes, derivados,
  evidencia, paquetes de revisión e históricos.
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

Desde la raíz, la interfaz recomendada es:

```sh
make ayuda
make verificar
```

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

Antes de una entrega institucional deberán definirse tutor, programa, universidad y
tipo de trabajo, si corresponden. La revisión independiente y el estudio con personas
no se presentan como ejecutados mientras dependan de intervención humana.
