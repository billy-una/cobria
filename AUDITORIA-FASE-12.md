# Auditoría de cierre — fase 12

**Fecha:** 2026-09-19. **Alcance:** JSON Schema y CLI COBRIA Toolkit.

## Resultado

Existen un esquema base y nueve especializaciones JSON Schema 2020-12. La CLI conserva la conformidad Core e incorpora `init`, `validar`, `explicar`, `contexto`, `impacto`, `auditar` y `medir`. Ofrece ayuda española, salida humana/JSON y códigos de proceso 0–4.

Las pruebas ejecutan los comandos positivos, concepto inexistente, inicialización no destructiva y `npm pack --dry-run` desde un paquete limpio. El gate comprueba además que los esquemas generados no estén desactualizados.

## Límite

La validación incorporada cubre el contrato común que usa COBRIA sin añadir dependencias. Antes de publicar los esquemas como estándar interoperable se recomienda ejecutar una segunda implementación JSON Schema y pruebas de vocabularios/formatos. `auditar` en esta fase revisa manifiestos; las reglas estáticas de código pertenecen a la fase 14.
