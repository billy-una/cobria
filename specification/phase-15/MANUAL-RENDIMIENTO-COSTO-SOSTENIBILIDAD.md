# Manual de rendimiento, costo y sostenibilidad

## Regla de decisión

COBRIA no adopta una proyección porque una consulta aislada sea más rápida. Primero se
comprueban autoridad, equivalencia, ámbito y reconstrucción; luego se comparan una sola
representación, índice nativo, vista materializada, CQRS, eventos, proyección simple y
COBRIA bajo la misma carga.

## Protocolo mínimo

Antes de ejecutar se congelan tamaño, número de corridas, datos, consulta, ambiente,
presupuesto y alternativas. Se publican p50, p95, p99, MAD e IQR. También se registran
construcción, recuperación, CPU, memoria, almacenamiento y amplificación de escritura.
Los valores atípicos no se eliminan silenciosamente.

## Costo total

La decisión considera costo de lectura, escritura, almacenamiento, reconstrucción,
operación, evolución y retiro. Una proyección debe poder reconstruirse y retirarse. El
índice es preferible cuando satisface el requisito sin crear otra representación con
autoridad aparente.

## Sostenibilidad sin afirmaciones falsas

`cpuMs`, bytes y `workProxy` son indicadores de trabajo computacional, no mediciones de
energía ni emisiones. Para afirmar consumo energético se requiere medidor, frontera del
sistema, mezcla eléctrica, duración y método publicados. COBRIA conserva esa evaluación
como trabajo externo y no convierte un proxy en carbono estimado.

## Interpretación responsable

El benchmark local identifica compromisos algorítmicos y regresiones del arnés. No
predice latencia, disponibilidad ni facturación de MongoDB, CouchDB, OpenSearch o un
servicio administrado. Las decisiones productivas requieren repetir el protocolo con
red, concurrencia, persistencia, fallos y precios reales.
