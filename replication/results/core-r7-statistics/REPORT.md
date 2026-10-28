# Evidencia confirmatoria interna R7

**Estado:** confirmatorio-completo-interno.

resultados internos de un nodo por motor; no generalizables.

Observaciones disponibles: 270.

## Corrección contractual

| Motor | Observaciones | P1/P2/R1/S1/A1 conformes |
|---|---:|:---:|
| mongodb | 90 | sí |
| couchdb | 90 | sí |
| opensearch | 90 | sí |

## Comparación pareada de lectura

| Motor | n | corridas | razón p50 | diferencia media ms | dz | fracción favorable | p Holm |
|---|---:|---:|---:|---:|---:|---:|---:|
| mongodb | 100 | 30 | 0.930 | -2.446 | -0.305 | 0.93 | 0.0004 |
| mongodb | 1000 | 30 | 0.869 | -15.484 | -0.376 | 0.93 | 0.0004 |
| mongodb | 5000 | 30 | 0.843 | -48.206 | -0.573 | 0.83 | 0.0011 |
| couchdb | 100 | 30 | 0.512 | -58.535 | -1.817 | 1.00 | 0.0004 |
| couchdb | 1000 | 30 | 0.372 | -581.855 | -2.592 | 1.00 | 0.0004 |
| couchdb | 5000 | 30 | 0.358 | -2923.388 | -2.648 | 1.00 | 0.0004 |
| opensearch | 100 | 30 | 0.940 | 0.020 | 0.002 | 0.57 | 0.9930 |
| opensearch | 1000 | 30 | 0.714 | -9.238 | -0.774 | 0.93 | 0.0004 |
| opensearch | 5000 | 30 | 0.452 | -42.439 | -1.645 | 1.00 | 0.0004 |

## Resultados negativos, no favorables o no concluyentes

- opensearch n=100: la diferencia media no favoreció la proyección; la comparación no fue concluyente tras el ajuste de Holm (razón 0.940; p Holm 0.9930).

## Comparación de alternativas

Se conservaron 630 observaciones de 7 estrategias: cobria, cqrs, events, materialized-view, native-index, projection-without-contract, single-document.
microcomparación algorítmica en un proceso Node.js; no demuestra rendimiento distribuido.

## Límites

CPU y RSS describen el proceso cliente; RSS es el máximo acumulado del proceso y no memoria aislada por corrida. El tamaño físico depende del motor y no es directamente comparable entre proveedores. Las corridas usan un nodo local y no incluyen red, clúster ni servicio administrado. La réplica externa, transferencia humana y revisión bibliográfica doble permanecen pendientes.
