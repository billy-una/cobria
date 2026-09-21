# Estructura del monorepositorio COBRIA

## Fuente canónica

El repositorio público de COBRIA es <https://github.com/billy-una/cobria>. Desde esta
unificación, el material científico, pedagógico y web se conserva bajo una sola
historia Git.

```text
cobria/
├── specification/     # requisitos normativos y trazabilidad
├── replication/       # implementación, protocolos, pruebas y resultados
├── partes/             # capítulos del documento maestro
├── main.tex            # entrada del documento maestro
├── articulo-cobria.tex # artículo científico
├── libro-cobria/       # libro pedagógico y generadores editoriales
├── manuales/           # ecosistema, roadmap y prompts
├── sitio/              # página interactiva COBRIA
├── editorial/          # terminología y reglas editoriales
├── figuras/            # figuras compartidas
├── tablas/             # tablas compartidas
└── output/              # artefactos generados o paquetes de entrega
```

## Reglas de responsabilidad

- `specification/` es normativo; el libro y el sitio no pueden cambiar el Core.
- `replication/` conserva evidencia ejecutable y separa resultados históricos de los
  confirmatorios.
- `main.tex` y `articulo-cobria.tex` consumen evidencia, pero no son su fuente.
- `libro-cobria/` enseña mediante casos, ilustraciones y código neutral.
- `manuales/` describe el ecosistema general más allá de Core.
- `sitio/` publica una adaptación interactiva; no debe mantener cifras o requisitos
  contradictorios con las fuentes canónicas.
- Los artefactos generados deben poder reconstruirse desde fuentes versionadas.

## Repositorio anterior del sitio

La carpeta externa `COBRIA-atlas` se conserva temporalmente como respaldo. Su `.git`
no fue copiado; por ello `sitio/` pertenece al repositorio COBRIA y no es un submódulo
ni un repositorio anidado. Cuando la versión unificada haya sido confirmada y publicada,
el respaldo podrá archivarse mediante una decisión explícita.

## Construcciones independientes

La raíz ofrece comandos estables para personas, agentes de IA y automatización:

```sh
make ayuda
make verificar
make construir-maestro
make construir-articulo
make construir-sitio
```

Estos comandos son la interfaz del monorepositorio. Los comandos internos siguen
disponibles para diagnosticar cada producto por separado:

```sh
# Documento maestro
latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build main.tex

# Paquete de réplica
cd replication
npm ci
npm test

# Sitio
cd ../sitio
npm ci
npm test
```

Mantener comandos separados evita que el sitio afecte la reproducción científica y
permite que CI informe con precisión qué producto falló.
