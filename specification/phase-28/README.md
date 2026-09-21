# Fase 28 — revisión dimensional ciega

La Fase 28 transforma las 72 preguntas de la fase anterior en dos formularios ciegos e
independientes. Su propósito es preparar una revisión humana reproducible; no completar
ni sustituir esa revisión.

## Diseño

- Tres muestras seudónimas: `M-01`, `M-02` y `M-03`.
- Ocho contratos y tres dimensiones por muestra.
- Dos revisores, con 72 decisiones cada uno: 144 juicios esperados.
- Decisiones permitidas: `supported`, `unsupported` e `insufficient`.
- Confianza de 1 a 5 y justificación obligatoria por dimensión.
- Atestación humana, independencia y conflicto de interés sin valores precargados.
- Clave de identidad excluida del paquete entregable.

```bash
make preparar-revision-fase-28
make verificar-fase-28
```

El gate solo demuestra que el instrumento está completo, ciego y vacío. No demuestra que
la revisión haya ocurrido ni permite declarar certificación o validación externa.
