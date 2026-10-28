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

`generar diccionario --nombre Observaciones --directorio RUTA [--simular]` genera
un diccionario JSON editable, no un manifiesto de fase 11 ni un índice físico.
`generar modulo` admite también el tipo como argumento posicional; no se puede repetir
mediante `--tipo`. El diccionario preserva ediciones humanas y deja las claves físicas
sin asignar hasta diseñar el Dater. Sus errores estables son
`CLI_DICTIONARY_NAME_INVALID` (uso) y `CLI_GENERATOR_CONFLICT` (contenido divergente).

El paquete instalable incluye manifiestos y esquemas preparados mediante `prepack`.
Cuando no existe el checkout fuente, la CLI consulta esos recursos; las referencias
describen su procedencia y no prometen que sus archivos fuente completos estén instalados.

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

## Controles de entrada y salida C9

Responsable: COBRIA Toolkit. Alcance: contrato de herramienta, no requisito de Core.
Aceptación local: `replication/tests/c9-toolkit.test.mjs`.

- C9-CLI-01: una opción sin valor o repetida y un tamaño fuera de 1–100000 se
  rechazan con salida 2 antes de ejecutar el comando.
- C9-CLI-02: inicialización y generación rechazan enlaces detectados en su destino;
  generación simulada comprueba el plan sin crear archivos ni directorios.
- C9-CLI-03: los informes existentes se rechazan con salida 4 antes de escribir.

Estos controles no ofrecen aislamiento contra cambios concurrentes del sistema de
archivos ni una transacción de múltiples artefactos. Un generador produce un
esqueleto genérico, no una solución de dominio ni una decisión semántica validada.
