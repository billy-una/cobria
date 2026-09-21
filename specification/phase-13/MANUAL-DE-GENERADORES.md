# Manual de generadores

Los generadores crean un punto de partida, no una implementación terminada. Cada tipo produce cuatro piezas relacionadas: código neutral, prueba negativa/positiva, documento de contrato y manifiesto. El responsable queda `POR-DEFINIR` para impedir que una herramienta invente autoridad.

```sh
node replication/src/cli.mjs generar \
  --tipo entidad --nombre Observacion \
  --directorio /ruta/proyecto --json
```

Tipos: proyecto, módulo, entidad, valor, caso de uso, puerto, adaptador, Dater, nodo, catálogo, Function, evento, ADR, prueba y runbook.

Antes de escribir se comparan los cuatro destinos. Si existen y son idénticos, el resultado es `unchanged`. Si alguno difiere, todo el comando falla con `CLI_GENERATOR_CONFLICT` y no sobrescribe. Los nombres aceptan letras, números, espacios, guiones y guion bajo; cualquier intento de introducir ruta o código se rechaza.

Después de generar, una persona debe completar propósito, contrato, propietario, errores, ámbito y aceptación. La fase 14 auditará reglas estáticas adicionales.
