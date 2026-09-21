# Auditoría de cierre — Fase 1

## Entregables

| Entregable | Estado | Evidencia |
|---|---|---|
| Manifiesto | completado | `MANIFESTO.md` |
| Glosario canónico | completado | `editorial/GLOSARIO-CANONICO.md` |
| Mapa del ecosistema | completado | `specification/MAPA-ECOSISTEMA.md` |
| ADR de alcance | aceptado | `specification/ADR-0001-ALCANCE-ECOSISTEMA.md` |
| Niveles normativos | completado | Manifiesto, sección “Niveles de obligación” |
| Afirmaciones prohibidas | completado | Manifiesto, “Lo que COBRIA no promete” y M-15 |

## Contradicciones encontradas y resolución

1. **Arquitectura específica frente a ecosistema general.** Se resuelve mediante
   ADR-0001: COBRIA es el ecosistema; Core conserva el alcance NoSQL normativo.
2. **Norma frente a enseñanza.** `DEBE` solo genera conformidad dentro de documentos
   normativos. Manuales, libro y sitio no amplían Core.
3. **Madurez ambigua.** Se fijan seis estados; implementado, ejecutado y validado
   externamente dejan de tratarse como equivalentes.
4. **Novedad absoluta.** Se prohíbe presentarla como invención total; la contribución
   declarada es una composición formalizada y evaluable.
5. **Nombre Atlas.** Se limita a metáfora navegacional; el nombre del producto es COBRIA.

## Comprobación del gate

Las fuentes canónicas ya permiten resolver alcance, vocabulario y niveles de obligación.
No se modificó Core 1.0. Queda pendiente propagar automáticamente estos términos hacia
todas las páginas y capítulos en la fase 17; por ello la fase 1 queda **implementada y
documentada**, pero no se declara cerrada editorialmente hasta completar esa comprobación
integral y reproducible.

## Riesgos pendientes

- textos históricos pueden conservar alias o formulaciones anteriores;
- Core 1.1 y 1.2 continúan como borradores/complementos experimentales;
- la revisión independiente corresponde a la fase 18 y no se simula aquí.

