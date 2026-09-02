# Infraestructura externa COBRIA 1.2

El archivo Compose fija familias de versiones y volúmenes separados para MongoDB, CouchDB y OpenSearch. Antes de una ejecución confirmatoria se deben reemplazar etiquetas por digestos, registrar Docker/host, iniciar el conjunto de réplica MongoDB, congelar índices y conservar la salida de salud.

Requisitos recomendados: 8 GB de RAM disponibles y 10 GB libres en disco. La réplica del 27 de agosto de 2026 se ejecutó secuencialmente por disponer de 8 GB de RAM física y una VM limitada a 3 GB. MongoDB 8.0 y CouchDB 3.4 completaron 90 corridas cada uno. OpenSearch 3.2.0 falló por un `SIGSEGV` de Java 24 bajo emulación x86_64; OpenSearch 2.19.3 con Java 21 completó 90 corridas como réplica de compatibilidad. Los resultados de 2.19.3 no deben atribuirse a 3.2.0.

La contraseña incluida es exclusivamente local. No debe utilizarse fuera de una máquina de prueba.
