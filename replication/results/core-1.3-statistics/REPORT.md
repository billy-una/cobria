# Estadística confirmatoria COBRIA Core 1.3

**Estado:** preliminar-incompleto.

Los tiempos describen esta máquina y configuración; no son parámetros universales.

## Celdas ausentes

- mongodb/5000: 20/30 corridas
- couchdb/100: archivo ausente
- couchdb/1000: archivo ausente
- couchdb/5000: archivo ausente
- opensearch/100: archivo ausente
- opensearch/1000: archivo ausente
- opensearch/5000: archivo ausente

| Motor | n | Métrica | Corridas | p50 | IC95 % mediana | p95 | p99 |
|---|---:|---|---:|---:|---:|---:|---:|
| mongodb | 100 | consulta_canónica_ms | 30 | 13.201 | [12.990, 14.215] | 23.442 | 44.846 |
| mongodb | 100 | consulta_proyección_ms | 30 | 13.349 | [12.699, 14.552] | 24.023 | 44.667 |
| mongodb | 100 | reconstrucción_ms | 30 | 76.656 | [74.206, 81.784] | 107.515 | 226.198 |
| mongodb | 1000 | consulta_canónica_ms | 30 | 78.701 | [70.131, 84.935] | 198.739 | 259.440 |
| mongodb | 1000 | consulta_proyección_ms | 30 | 66.344 | [60.904, 83.337] | 122.423 | 172.117 |
| mongodb | 1000 | reconstrucción_ms | 30 | 609.643 | [552.107, 651.143] | 1097.063 | 1515.104 |
| mongodb | 5000 | consulta_canónica_ms | 20 | 664.209 | [571.748, 787.721] | 1111.442 | 1136.885 |
| mongodb | 5000 | consulta_proyección_ms | 20 | 615.797 | [440.822, 766.885] | 998.358 | 1003.983 |
| mongodb | 5000 | reconstrucción_ms | 20 | 5466.462 | [4837.871, 6485.049] | 8720.399 | 9315.992 |

## Comparaciones pareadas

| Motor | n | Diferencia media ms | Razón mediana | dz | p | p Holm |
|---|---:|---:|---:|---:|---:|---:|
| mongodb | 100 | -0.367 | 0.994 | -0.040 | 0.7737 | 0.7737 |
| mongodb | 1000 | -15.327 | 0.884 | -0.384 | 0.0105 | 0.0315 |
| mongodb | 5000 | -59.227 | 0.910 | -0.271 | 0.2359 | 0.4718 |
