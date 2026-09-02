# Resultados COBRIA Core 1.0

Corridas ejecutadas: **180**.

Los resultados corresponden a motores NoSQL documentales embebidos. No representan latencia de servicios administrados, redes, regiones ni facturación.

| Motor | Escala | Corridas | P1 canónico (ms) | P1 proyección (ms) | R1 (ms) | Amplificación | Fugas | Conformidad |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| PouchDB | 100 | 30 | 1.186 | 0.440 | 8.376 | 2.0 | 0 | superada |
| PouchDB | 1000 | 30 | 13.589 | 4.719 | 89.301 | 2.0 | 0 | superada |
| PouchDB | 5000 | 30 | 69.291 | 23.131 | 500.070 | 2.0 | 0 | superada |
| LokiJS | 100 | 30 | 0.145 | 0.052 | 0.663 | 2.0 | 0 | superada |
| LokiJS | 1000 | 30 | 1.263 | 0.409 | 6.452 | 2.0 | 0 | superada |
| LokiJS | 5000 | 30 | 7.026 | 2.220 | 46.011 | 2.0 | 0 | superada |
