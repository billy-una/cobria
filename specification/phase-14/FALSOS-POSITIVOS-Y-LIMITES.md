# Falsos positivos, supresiones y límites

- `AUD-001`: nombres de carpetas no estándar pueden ocultar una capa; configure primero la estructura COBRIA.
- `AUD-002`: solo reconoce `documento.a`…`h`; ejemplos narrativos y acceso calculado requieren revisión manual.
- `AUD-003`: wrappers con otro nombre de paquete pueden escapar; un import de tipos podría señalarse aunque no ejecute SDK.
- `AUD-004`: la configuración puede residir en IaC externo; enlácela o adapte la regla, no silencie el límite.
- `AUD-005`: un archivo cuyo nombre contiene “catalog” puede no ser catálogo de dominio.
- `AUD-006`: `*` en un formato no relacionado con permisos queda fuera si la propiedad no se llama `permissions`.
- `AUD-007`: una prueba descrita con otro encabezado será señalada; estandarice antes de suprimir.

No se implementan comentarios de supresión en esta fase. Una excepción se documenta mediante ADR y configuración futura para evitar que `// ignore` oculte deuda. Los fixtures positivo y negativo acompañan cada evolución de regla.
