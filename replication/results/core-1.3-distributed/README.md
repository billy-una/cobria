# Corrida distribuida COBRIA 1.3

Fecha: 3 de septiembre de 2026.

Se ejecutó una corrida de 30 documentos con el arnés corregido sobre MongoDB 8.0
y CouchDB 3.4 en contenedores Docker dentro de Colima x86_64. Ambas corridas
superaron P1, P2, R1, S1 y A1. Los archivos por motor contienen la salida cruda,
el resumen y el reporte.

OpenSearch 3.2.0 alcanzó estado `green` y murió durante la carga del índice con
`SIGILL` en `org.apache.lucene.util.compress.LZ4.readInt` bajo JDK 24 y emulación
x86_64. No se generó una corrida válida ni se mezcló este incidente con los datos.

Esta fase es un smoke test de integración, no una réplica confirmatoria: usa una
escala, una repetición, un nodo por motor y seguridad desactivada solo en el
contenedor local de OpenSearch.
