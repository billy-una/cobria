# Matriz de trazabilidad de la candidata

| Entregable | Autoridad | Fuente | Puerta automática | Límite principal |
|---|---|---|---|---|
| Especificación | normativa | `specification/` | validadores de conformidad | no es estándar oficial |
| Artículo | síntesis científica | `articulo-cobria.tex` | compilación y cifras registradas | revisión editorial externa pendiente |
| Documento maestro | desarrollo científico | `main.tex`, `partes/` | compilación y trazabilidad | no sustituye evaluación institucional |
| Libro | pedagógica | `libro-cobria/` | renderizado, páginas y metadatos | accesibilidad PDF no certificada |
| Cuaderno | práctica pedagógica | `libro-cobria/` | renderizado y metadatos | no emite certificación |
| Anexo técnico | trazabilidad | `libro-cobria/` | renderizado y fuentes | contiene estados, no validaciones inventadas |
| Sitio | navegación pedagógica | `sitio/` | compilación, lint y pruebas | publicidad deshabilitada |
| Toolkit | verificación | `replication/src/` | pruebas automatizadas | no reemplaza revisión profesional |
| Evidencia | empírica | `replication/results/` | regeneración y manifiestos | evidencia externa incompleta |

El flujo de autoridad es: **especificación → implementación → evidencia → síntesis
científica → productos pedagógicos**. Un producto posterior no puede modificar una regla
normativa ni elevar el estado de una evidencia.
