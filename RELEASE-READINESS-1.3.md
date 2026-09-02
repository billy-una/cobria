# Estado de preparación COBRIA 1.3

Fecha de corte: 2 de septiembre de 2026.

## Cerrado localmente

- Publicación versionada con verificación de huella y rollback.
- Oráculo separado de la implementación y mutaciones negativas.
- Generador adversarial parametrizado con semillas, ámbitos, Unicode y esquemas.
- Autorización lógica diferenciada por ámbito y acción.
- CI para pruebas Node y verificación del paquete.
- SBOM CycloneDX derivado del lockfile.
- Trazabilidad actualizada para publicación, seguridad y catálogo.
- Paginación de OpenSearch para conjuntos mayores que 10.000 documentos.

## Pendiente externo

- Intercambio atómico y rollback bajo fallos en clústeres reales.
- ACL, autenticación, cifrado, canales laterales y pruebas de penetración.
- Réplica con MongoDB, CouchDB y OpenSearch desplegados en nodos reales.
- Comparación industrial independiente de CQRS, Event Sourcing e índices nativos.
- Depósito público con DOI, imágenes por digest y firma de artefactos.
- Revisión independiente, estudio humano y evaluación humana de IA.

La fase local no convierte estos pendientes en resultados ejecutados.
