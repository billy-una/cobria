# Estadística ampliada COBRIA 1.1

No se eliminaron valores atípicos. IC 95 % con 4 000 remuestras bootstrap de la mediana y semilla 20260824.

| Motor | N | Métrica | p50 ms | p95 ms | p99 ms | MAD ms | IC95 mediana ms |
|---|---:|---|---:|---:|---:|---:|---|
| LokiJS | 100 | canónica | 0.144 | 0.186 | 0.507 | 0.012 | [0.138, 0.150] |
| LokiJS | 100 | proyección | 0.052 | 0.068 | 0.075 | 0.005 | [0.048, 0.055] |
| LokiJS | 100 | reconstrucción | 0.659 | 0.868 | 1.147 | 0.039 | [0.629, 0.696] |
| LokiJS | 1000 | canónica | 1.262 | 1.457 | 3.307 | 0.020 | [1.252, 1.300] |
| LokiJS | 1000 | proyección | 0.409 | 0.481 | 0.494 | 0.003 | [0.408, 0.414] |
| LokiJS | 1000 | reconstrucción | 6.446 | 8.687 | 9.748 | 0.147 | [6.400, 6.736] |
| LokiJS | 5000 | canónica | 6.977 | 8.218 | 8.324 | 0.191 | [6.904, 7.180] |
| LokiJS | 5000 | proyección | 2.216 | 3.050 | 3.498 | 0.072 | [2.151, 2.273] |
| LokiJS | 5000 | reconstrucción | 45.932 | 50.859 | 51.731 | 1.206 | [45.260, 46.864] |
| PouchDB | 100 | canónica | 1.166 | 3.175 | 4.713 | 0.112 | [1.092, 1.259] |
| PouchDB | 100 | proyección | 0.433 | 0.687 | 0.765 | 0.031 | [0.416, 0.463] |
| PouchDB | 100 | reconstrucción | 8.283 | 10.829 | 12.252 | 0.711 | [7.821, 8.900] |
| PouchDB | 1000 | canónica | 13.584 | 15.332 | 16.373 | 0.453 | [13.334, 13.881] |
| PouchDB | 1000 | proyección | 4.709 | 5.596 | 10.445 | 0.245 | [4.493, 4.774] |
| PouchDB | 1000 | reconstrucción | 89.291 | 103.224 | 152.037 | 2.787 | [88.090, 92.876] |
| PouchDB | 5000 | canónica | 69.287 | 74.213 | 75.752 | 0.826 | [68.925, 70.460] |
| PouchDB | 5000 | proyección | 23.063 | 24.857 | 25.195 | 0.840 | [22.708, 23.884] |
| PouchDB | 5000 | reconstrucción | 499.896 | 521.530 | 558.877 | 7.464 | [495.701, 502.708] |
