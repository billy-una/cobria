# Fase 24 — revisión semántica independiente

La fase convierte las coincidencias textuales de la fase 23 en un protocolo refutable de
revisión humana. El paquete contiene tres muestras seudónimas, ocho contratos por muestra,
fragmentos acotados, rúbrica, esquema de respuesta y huellas SHA-256.

```bash
node replication/scripts/build-phase24-review-package.mjs
make verificar-fase-24
```

## Estado honesto

Se recibieron seis respuestas con atestación humana autodeclarada y corrección confirmada
por el coordinador. El acuerdo global es 0,875 y kappa de Cohen es 0,771. Los revisores
discrepan sobre ENG-007 en las tres muestras, por lo que la fase permanece pendiente de
adjudicación. El registro público no almacena ni verifica identidades personales.
