# Resultados COBRIA Core 1.0

Corridas ejecutadas: **180**.

Los resultados corresponden a motores NoSQL documentales embebidos. No representan latencia de servicios administrados, redes, regiones ni facturación.

| Motor | Escala | Corridas | P1 canónico (ms) | P1 proyección (ms) | R1 (ms) | Amplificación | Fugas | Conformidad |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| PouchDB | 100 | 30 | 3.659 | 1.421 | 11.347 | 2.0 | 0 | superada |
| PouchDB | 1000 | 30 | 24.803 | 9.252 | 79.907 | 2.0 | 0 | superada |
| PouchDB | 5000 | 30 | 125.400 | 42.365 | 361.921 | 2.0 | 0 | superada |
| LokiJS | 100 | 30 | 0.471 | 0.193 | 1.083 | 2.0 | 0 | superada |
| LokiJS | 1000 | 30 | 3.633 | 1.307 | 9.788 | 2.0 | 0 | superada |
| LokiJS | 5000 | 30 | 15.894 | 5.595 | 47.243 | 2.0 | 0 | superada |
