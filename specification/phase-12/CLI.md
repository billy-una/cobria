# COBRIA Toolkit CLI

La CLI funciona con Node.js 22, no requiere servicios externos para sus comandos documentales y conserva `verificar` para el arnés Core.

```sh
node replication/src/cli.mjs --ayuda
node replication/src/cli.mjs validar --json
node replication/src/cli.mjs explicar --id NODE-OBS-CANONICAL
node replication/src/cli.mjs contexto --id SEC-OP-001 --json
node replication/src/cli.mjs impacto --id ENT-OBSERVACION
node replication/src/cli.mjs auditar
node replication/src/cli.mjs medir --json
node replication/src/cli.mjs verificar --adaptador lokijs --salida /tmp/informe
node replication/src/cli.mjs informar --salida /tmp/cobria-informe --json
node replication/src/cli.mjs publicar --simular --ambiente staging --artefacto sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --json
```

`iniciar` es un alias en español de `init`. `informar` genera HTML y JSON. `publicar`
rechaza toda ejecución sin `--simular`: produce un plan de comprobaciones, realiza cero
mutaciones y no solicita credenciales.

`init --directorio RUTA` crea `.cobria/project.yaml` y un README solamente cuando no existe; nunca sobrescribe el manifiesto. Las salidas JSON son apropiadas para CI y agentes. La salida humana permanece en español.

## Códigos de proceso

| Código | Significado |
|---:|---|
| 0 | operación completada |
| 1 | contenido inválido o no conforme |
| 2 | uso, opción o argumento incorrecto |
| 3 | ruta o concepto no encontrado |
| 4 | conflicto que impediría sobrescribir |

Los errores poseen códigos estables `CLI_*`; el mensaje puede mejorar sin romper automatizaciones.
