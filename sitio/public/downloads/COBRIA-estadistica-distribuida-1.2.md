# Estadística distribuida COBRIA 1.2

Se analizaron 270 corridas históricas (30 por motor y escala). Los intervalos describen esta muestra y configuración; no generalizan a otros despliegues.

| Motor | n | p50 canónica | p95/p99 canónica | p50 proyección | p95/p99 proyección | cociente p50 [IC95%] | fracción proyección más rápida |
|---|---:|---:|---:|---:|---:|---:|---:|
| mongodb | 100 | 8.749 | 10.840/12.111 | 7.815 | 8.590/45.903 | 0.887 [0.876, 0.921] | 0.93 |
| mongodb | 1000 | 39.910 | 45.809/48.691 | 34.431 | 41.390/66.836 | 0.869 [0.850, 0.886] | 0.93 |
| mongodb | 5000 | 157.856 | 202.770/337.946 | 129.272 | 148.335/155.778 | 0.799 [0.785, 0.816] | 1.00 |
| couchdb | 100 | 98.830 | 122.742/126.911 | 54.119 | 84.756/105.832 | 0.538 [0.513, 0.588] | 0.97 |
| couchdb | 1000 | 1024.590 | 5358.140/9541.115 | 440.260 | 1926.804/2838.180 | 0.387 [0.356, 0.411] | 1.00 |
| couchdb | 5000 | 4298.485 | 6763.587/7284.836 | 1477.093 | 1963.194/2806.881 | 0.362 [0.354, 0.375] | 1.00 |
| opensearch | 100 | 178.381 | 276.384/303.220 | 167.058 | 320.576/482.501 | 0.985 [0.853, 1.097] | 0.50 |
| opensearch | 1000 | 200.557 | 437.809/493.415 | 168.733 | 304.543/373.045 | 0.747 [0.704, 0.854] | 0.90 |
| opensearch | 5000 | 450.837 | 763.056/993.661 | 250.173 | 369.338/429.224 | 0.528 [0.505, 0.571] | 1.00 |

El cociente menor que 1 favorece la lectura proyectada. No se interpreta causalmente fuera del protocolo ni como clasificación universal de motores.
