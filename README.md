# COBRIA — documento maestro

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
- `referencias.bib`: bibliografía compartida por todas las partes.
- `figuras/`: futuras figuras externas.
- `tablas/`: futuros datos o tablas auxiliares.
- `build/`: archivos de compilación ignorados.

Cada nueva parte debe crearse como un archivo independiente dentro de `partes/` e
incluirse desde `main.tex`.

## Compilación

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build main.tex
```

El PDF resultante queda en `build/main.pdf`. El artículo se compila sustituyendo
`main.tex` por `articulo-cobria.tex` y utilizando un directorio de salida separado.

## Campos por completar

Antes de una entrega institucional deberán definirse tutor, programa, universidad y
tipo de trabajo, si corresponden. La revisión independiente y el estudio con personas
no se presentan como ejecutados mientras dependan de intervención humana.
