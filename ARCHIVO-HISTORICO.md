# Archivo histórico y conservación

## Regla

Los productos públicos canónicos se determinan mediante `editorial/products.json` y la
etiqueta de release. Un archivo antiguo, borrador o experimento puede conservar valor
histórico, pero no compite con el producto vigente ni se publica como descarga principal.

## Clasificación

| Clase | Ejemplos | Uso |
|---|---|---|
| Fuente normativa | `specification/` | define conformidad y contratos |
| Fuente editorial | `main.tex`, `articulo-cobria.tex`, `libro-cobria/`, `sitio/` | genera productos públicos |
| Evidencia | `replication/results/`, análisis y trazabilidad | sostiene afirmaciones limitadas |
| Candidata | paquete `ecosistema-1.0.0-rc1` | revisión y reproducción |
| Histórico | prelibros, borradores y paquetes de fases anteriores | consulta, no autoridad vigente |

Una corrección nunca reemplaza silenciosamente evidencia anterior. Se genera una nueva
versión, se registran origen y huella, y se conserva la anterior fuera de las descargas
canónicas. `ARCHIVO-Y-FUENTES-CANONICAS.md` contiene la política detallada de autoridad.

