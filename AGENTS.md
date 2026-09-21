# Instrucciones para agentes en COBRIA

## Antes de cambiar

1. Lea `MANIFESTO.md`, `README.md` y el `AGENTS.md` más cercano al archivo objetivo.
2. Consulte `specification/phase-16/agent-policy.json` y declare alcance, autoridad y pruebas.
3. Use español en documentación y mensajes visibles. No invente evidencia ni resultados.

## Límites esenciales

- `specification/` es la fuente normativa; libro, sitio, artículo y tesis son derivados editoriales.
- El dominio no depende de UI, infraestructura, SDK ni claves físicas.
- Las claves compactas `a`–`h` se traducen exclusivamente en Daters o adaptadores de datos.
- Ámbito, identidad, revisión, procedencia y autoridad no se omiten para simplificar ejemplos.
- No escriba en producción, no use secretos reales y no ejecute operaciones destructivas.
- No edite resultados experimentales a mano: regénere los artefactos con su comando declarado.

## Cierre de un cambio

Ejecute el gate más pequeño pertinente y finalmente `make verificar`. Informe archivos
modificados, pruebas ejecutadas, limitaciones y cualquier validación humana pendiente.
