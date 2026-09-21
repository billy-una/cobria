# Auditoría de fase 4 — Nodos, agregados y almacenamiento NoSQL

## Resultado

La fase 4 queda **implementada y documentada** mediante una topología neutral de seis
nodos: canónico, embebido, catálogo de referencia, outbox, proyección de búsqueda y
corte analítico.

## Entregables

| Entregable | Archivo |
|---|---|
| manifiesto validable de nodos | `specification/phase-4/nodes.yaml` |
| manual de decisiones | `specification/phase-4/NODOS-Y-AGREGADOS.md` |
| matriz de lectura/escritura | `specification/phase-4/MATRIZ-LECTURA-ESCRITURA.md` |
| procedencia de patrones | `specification/phase-4/PROCEDENCIA-PATRONES.md` |
| ADR de topología | `specification/ADR-0004-TOPOLOGIA-POR-CICLO-DE-VIDA.md` |
| caso negativo y validador | `examples/invalid-node.json`, `validate-phase4.py` |

## Gate

Cada nodo declara necesidad, dueño, regla de escritura, identidad, ámbito, cardinalidad,
crecimiento, ciclo de vida, atomicidad, consultas, índices, retención, seguridad,
reconstrucción aplicable, pruebas y costos. El validador rechaza derivados sin
reconstrucción, nodos sin dueño/ámbito/pruebas y relaciones rotas.

## Límites

- El manifiesto es un caso neutral, no una migración automática de los proyectos base.
- Los índices son hipótesis de diseño hasta medirse con carga real.
- Las garantías atómicas y de consulta deben comprobarse por adaptador/motor.
- Los SHA y licencias exactos de referencias permanecen como gate de fase 0.

