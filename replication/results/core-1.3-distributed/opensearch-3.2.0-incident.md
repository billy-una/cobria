# Incidente OpenSearch 3.2.0

- Plataforma: Colima sobre macOS Apple silicon, VM `linux/amd64`.
- Imagen: `opensearchproject/opensearch:3.2.0`.
- JDK: Temurin 24.0.2 incluido en la imagen.
- Estado previo: clúster `green`, un nodo, HTTP disponible.
- Fase del fallo: carga bulk de una corrida de 30 documentos.
- Señal: `SIGILL` en `org.apache.lucene.util.compress.LZ4.readInt`.
- Clasificación: incompatibilidad de plataforma/emulación; no es resultado de conformidad.

La repetición debe ejecutarse en ARM64 nativo o con una combinación JDK/imagen
soportada antes de incorporar cifras de OpenSearch al corpus confirmatorio.
