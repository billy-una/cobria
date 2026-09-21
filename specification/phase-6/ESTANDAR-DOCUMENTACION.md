# Estándar de documentación COBRIA

## Propósito

La documentación conserva aquello que el código no expresa con seguridad: propósito,
contexto, decisiones, contratos, riesgos, operación, evidencia, responsabilidad y
vigencia. No debe repetir línea por línea la implementación.

## Metadatos mínimos

Todo documento canónico declara, dentro del archivo o del registro documental:

- responsable;
- versión;
- estado: propuesto, estable, congelado, obsoleto o archivado;
- fecha o condición de revisión;
- fuente y productos derivados cuando corresponda.

`documentation.yaml` funciona como registro central para artefactos canónicos. Un archivo
sin responsable o vigencia no puede presentarse como fuente estable.

## Jerarquía de README

### Raíz

Explica propósito, alcance, productos, estructura, comandos principales, estados de
evidencia, licencia, contribución y responsable.

### Módulo

Explica responsabilidad, contratos, dependencias permitidas, datos, seguridad, pruebas,
operación y ejemplos. No repite la introducción completa del repositorio.

### Paquete o herramienta

Describe instalación, entradas, salidas, códigos de retorno, ejemplos válidos e
inválidos y compatibilidad.

## ADR

Se crea cuando una decisión cambia frontera, contrato, proveedor, garantía, riesgo o
costo significativo. Un ADR conserva contexto, alternativas reales, decisión,
consecuencias y condición de revisión. No se reescribe para ocultar una decisión previa;
se sustituye mediante otro ADR.

## API y eventos

Un contrato documenta versión, autenticación, autorización, ámbito, idempotencia,
paginación, entrada, salida, errores estables, límites, compatibilidad y ejemplos. Un
evento añade productor, consumidor, orden, duplicados, reintentos, cola de fallos y
retención.

## Diagramas

Todo diagrama tiene propósito, alcance, fecha/versión, leyenda y fuente editable. Un
diagrama no sustituye contratos ni pruebas. Si deja de coincidir con la fuente canónica,
se marca obsoleto o se regenera.

## Runbooks

Un runbook se prueba como procedimiento, no solo se revisa como texto. Debe permitir
identificar impacto, diagnosticar, mitigar, recuperar, verificar y escalar sin depender
de secretos incrustados o memoria del autor.

## Deuda trazable

`TODO`, `FIXME` y `HACK` solo se permiten con identificador de seguimiento, motivo,
responsable o equipo y condición de retiro. Una nota vaga no sustituye un requisito.

