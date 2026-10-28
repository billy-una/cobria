# Auditoría R7: evidencia confirmatoria interna

## Dictamen

La puerta automática de R7 está cerrada para evidencia interna. Esto significa que el
protocolo congelado puede regenerar y verificar resultados locales; no significa que
COBRIA sea un estándar, que supere siempre a otras arquitecturas ni que exista todavía
validación externa.

## Diseño ejecutado

- MongoDB, CouchDB y OpenSearch: 30 repeticiones para 100, 1.000 y 5.000 documentos.
- Total distribuido: 270 observaciones medidas después de dos calentamientos por tamaño.
- Orden: aleatorio determinista por motor, con semilla congelada.
- Aislamiento: colección, base o índice exclusivo por repetición.
- Contratos: P1, P2, R1, S1 y A1 en cada observación.
- Alternativas: 630 observaciones de siete estrategias y tres tamaños.

OpenSearch 3.2.0 se ejecutó finalmente en ARM nativo. La incidencia anterior bajo x86
emulado se conserva como limitación de plataforma y no se transformó en una observación.
CouchDB sufrió una interrupción externa durante la primera ejecución; el arnés conservó
solo las unidades completas y reanudó las pendientes.

## Lectura responsable

El informe generado registra percentiles p50, p95 y p99, MAD, IQR, intervalo bootstrap
de la mediana, comparación pareada, tamaño de efecto y corrección de Holm. OpenSearch
con 100 documentos no ofreció una diferencia concluyente después del ajuste. Por ello,
la evidencia no autoriza afirmar superioridad universal.

CPU y memoria corresponden al proceso cliente; RSS es un máximo acumulado, no una
medición aislada por corrida. El almacenamiento físico depende del formato y la
compactación de cada motor. Las 630 alternativas son una microcomparación algorítmica
en Node.js y no una prueba distribuida.

## Reproducción

```bash
make analizar-r7
make verificar-r7
```

Fuentes de máquina:

- `replication/protocol/r7-confirmatory.json`
- `replication/results/core-r7-confirmatory/`
- `replication/results/core-r7-statistics/summary.json`
- `replication/results/core-r7-statistics/summary.csv`
- `replication/results/core-r7-statistics/paired-ratios.svg`

## Puertas abiertas

Permanecen pendientes una réplica externa independiente, un estudio de transferencia
con participantes y consentimiento apropiado, y el doble cribado bibliográfico. Esas
actividades pertenecen a validación humana/externa y no se simulan con archivos locales.
