# Preparación experimental y límites pendientes

PC3 no está cerrada. No hay observaciones confirmatorias nuevas ni tablas de
rendimiento PC3; R7 conserva intactos sus datos y su interpretación histórica.

## Alcance y autoridad

Se permite diagnóstico local, implementación y pruebas sintéticas. No se modifica
Core, los congelamientos PC2, las corridas R7 ni almacenamiento de producción.
`make diagnosticar-pc3` comprueba los dos congelamientos, espacio y versiones de los
tres servicios de loopback; conserva cada diagnóstico con identidad propia en
`output/review/pc3/`. Su código de salida 2 indica requisitos no satisfechos.

El diagnóstico de esta sesión encontró 13,1 GiB libres y MongoDB, CouchDB y
OpenSearch inaccesibles. El cliente Docker instalado tampoco conecta con un daemon.
No se instaló otro motor ni se reemplazaron los resultados por mediciones de memoria.

## Implementación entregada

`replication/src/pc3/analysis.mjs` implementa análisis por treinta corridas pareadas,
diez tiempos por ruta, prueba primaria exacta congelada, ajuste Holm para nueve
celdas completas, bootstrap de parejas, sensibilidad por cambio de signos,
intervalos puntuales, razón, dz, percentiles, MAD e IQR. Varianza nula produce
dz nulo con motivo. Celdas incompletas y tiempos no positivos se rechazan.

Las pruebas sintéticas admiten igualdad, mejora y empeoramiento; no son resultados
de motores. Los parámetros y supuestos proceden del protocolo PC2 y su adenda;
el analizador aún no acredita integridad de archivos de corrida ni elegibilidad
confirmatoria de un dataset completo.

La función de almacenamiento del adaptador MongoDB conserva BSON como tamaño
lógico y devuelve tamaño físico nulo con motivo. No se reescriben los archivos
históricos que usaron otra etiqueta; no deben interpretarse como medición de disco.

## Pendientes para cerrar

1. Conectores nuevos al puerto PC2 con consultas, índices y planes nativos reales.
2. Ejecutor aislado por corrida, inventario del ambiente y huellas antes de medir.
3. Arranque verificado de las versiones congeladas y piloto de instrumentación.
4. Ejecución de las 270 corridas, incidentes conservados y fallos no excluidos.
5. Validación de datasets, análisis de nueve celdas y tablas/gráficos desde crudos.

Reactivar motores no completa automáticamente estos trabajos. La réplica externa
y la infraestructura distribuida conservan sus requisitos separados.

## Comprobaciones

Desde la raíz: `make verificar-pc3` ejecuta siete pruebas del análisis y semántica
del almacenamiento; `make verificar-pc2` comprueba los contratos y congelamientos.
Los registros de verificación no atribuyen estos resultados a una revisión humana.
