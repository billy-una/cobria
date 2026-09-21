# Archivo y fuentes canónicas de COBRIA

**Aplicación:** cierre del Ecosistema 1.0  
**Relación normativa:** esta política no modifica COBRIA Core.

## Fuente y derivado

| Producto | Fuente canónica | Derivado público |
|---|---|---|
| Identidad y afirmaciones | `editorial/canonical.json` | textos sincronizados |
| Especificación | `specification/` | especificación navegable y paquete descargable |
| Artículo | `articulo-cobria.tex` | `output/pdf/COBRIA-articulo-cientifico-actualizado.pdf` |
| Documento maestro | `main.tex`, `portada.tex`, `partes/` | `output/pdf/COBRIA-documento-maestro-ecosistema.pdf` |
| Libro | `libro-cobria/` | `output/pdf/COBRIA-ecosistema-manual-completo.pdf` |
| Sitio | `sitio/app/` y recursos canónicos seleccionados | `sitio/dist/` |
| Toolkit | `replication/src/`, esquemas y plantillas | paquete instalable e informes |
| Evidencia | protocolos, configuración, scripts y `replication/results/` | tablas y figuras generadas |

Un PDF, una carpeta `dist`, una captura, un ZIP o una tabla generada no adquiere
autoridad sobre su fuente. La corrección se realiza en la fuente y después se regenera.

## Clasificación del material

- **Fuente:** se revisa, versiona y utiliza para construir productos.
- **Evidencia:** solo cambia mediante el protocolo o generador declarado.
- **Generado:** puede regenerarse y no se edita a mano.
- **Paquete de revisión:** conserva un corte para terceros, pero no es fuente vigente.
- **Histórico:** versión reemplazada que se guarda fuera de las descargas principales.
- **Borrador:** material visible solo en áreas de trabajo y rotulado como tal.

## Política de archivo

1. La descarga pública presenta una sola versión canónica de cada producto.
2. Los nombres `borrador`, `prelibro`, `auditado`, `ampliado` y números anteriores no se
   mezclan con la edición estable.
3. Los materiales reemplazados se trasladarán a un archivo histórico durante el cierre;
   no se eliminarán mientras su procedencia o utilidad no haya sido revisada.
4. `build/`, `tmp/`, QA visual y distribuciones web son derivados regenerables.
5. Los paquetes entregados a revisores conservan manifiesto, fecha y huellas.
6. Los resultados experimentales nunca se reclasifican ni se corrigen manualmente.
7. Antes de mover o retirar un archivo se comprobarán referencias entrantes.

## Regla de publicación

Una publicación debe indicar nombre, versión, fecha, estado, licencia, fuente y
limitaciones. “Publicado” significa accesible sin autenticación; “validado” exige la
evidencia correspondiente y no es sinónimo de “compilado”.

## Estado del corte inicial

El árbol de trabajo contiene una integración extensa posterior al commit registrado.
Por seguridad, la fase 0 no confirma, descarta ni traslada esos cambios. El inventario
regenerable queda en `editorial/generated/release-baseline.json`. La selección de commits
y la creación de la rama o etiqueta candidata deberán realizarse cuando este inventario
sea revisado y el árbol represente deliberadamente el Ecosistema 1.0.
