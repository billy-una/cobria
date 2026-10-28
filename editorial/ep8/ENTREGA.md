# Decisión de alcance experimental EP8

EP8 se excluye justificadamente para la candidata educativa y el preprint acotado
elegidos en EP0. Se completa la decisión de alcance, no la investigación confirmatoria.
PC3 permanece pendiente y no se añaden observaciones, tablas ni gráficos de motores.

## Por qué no se ejecutan corridas nuevas

El artículo mantiene resultados históricos R7 con sus límites y pruebas posteriores
de alcance local. No afirma superioridad del contrato, rendimiento distribuido,
productividad humana ni calidad generativa. Por ello no se activa la condición de
entrada que exige ampliar las afirmaciones antes de ejecutar investigación nueva.
Esta exclusión no satisface las puertas de una versión estable.

El diagnóstico del 23 de octubre de 2026 observó 5,12 GiB disponibles frente al
mínimo previsto de 10 GiB. MongoDB, CouchDB y OpenSearch no estaban accesibles en
sus puertos locales. Es un diagnóstico de lectura, no una corrida: no se iniciaron
motores ni se modificó almacenamiento. Tampoco bastaría liberar espacio e iniciar
servicios: faltan conectores y ejecutor PC3 con comparaciones nativas equivalentes.

## Evidencia conservada

`decision.json` enlaza la decisión original de EP0, el diagnóstico y las condiciones
para retomar P1, P2, R1, S1 y A1. `build.mjs` comprueba los dos congelamientos PC2 y
las huellas históricas declaradas por EP6; genera `estado.json` y el texto compartido
`scope.tex`. Artículo y maestro muestran la misma exclusión. No cambia Core 1.0,
no reescribe crudos R7 y no llena celdas nuevas con datos históricos o sintéticos.

El diagnóstico se conserva también en `preflight-2026-10-23.json`, copia exacta del
registro local original. Así la decisión puede verificarse en un clon sin depender
de la carpeta ignorada `output/`; la copia no vuelve a consultar ni simula los motores.

## Reentrada futura

Antes de ampliar conclusiones debe decidirse el nuevo alcance, completar consultas,
índices, planes, conectores y ejecutor; verificar versiones, espacio y presupuestos;
registrar una enmienda si cambia el diseño congelado; ejecutar piloto; conservar
fallos y negativos; validar elegibilidad e integridad; regenerar el análisis desde
crudos; y reconciliar de nuevo los manuscritos. La réplica externa y la evaluación
con participantes continúan como trabajos diferentes.

```sh
make generar-ep8 verificar-ep8
make diagnosticar-pc3
```

El diagnóstico devuelve código 2 cuando faltan requisitos; no representa un fallo
de COBRIA ni una prueba de rendimiento. Los cuatro tests EP8 protegen contra
declarar ejecución o cierre estable a partir de esta exclusión.
