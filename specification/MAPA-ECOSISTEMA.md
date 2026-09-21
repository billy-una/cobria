# Mapa canónico del ecosistema COBRIA

**Versión:** 1.0  
**Decisión de alcance:** ADR-0001

| Parte | Responsabilidad | Naturaleza | Fuente principal |
|---|---|---|---|
| COBRIA Manifesto | principios, vocabulario y límites generales | gobernanza | `MANIFESTO.md` |
| COBRIA Core | conformidad de datos canónicos y derivados NoSQL | normativa | `COBRIA-CORE-1.0.md` |
| COBRIA Data | diccionarios, contratos, nodos, catálogos y migraciones | manual | `manuales/04-bases-de-datos.md` |
| COBRIA Layers | capas, fronteras, puertos, adaptadores y composición | manual | `manuales/02-layers.md` |
| COBRIA Pattern Design | patrones, mecanismos, relaciones y costos | catálogo pedagógico | manual de patrones y libro |
| COBRIA Build | recorrido para construir un proyecto | manual | `manuales/07-build.md` |
| COBRIA Documentation | README, ADR, comentarios, lenguaje y vigencia | manual planificado | roadmap, fase 6 |
| COBRIA Security | seguridad, privacidad, capacidades y suministro | manual y controles | roadmap, fase 7 |
| COBRIA Cloud & Operations | ambientes, Functions, despliegue y recuperación | manual planificado | roadmap, fases 8–9 |
| COBRIA Quality | pruebas, conformidad, observabilidad y resiliencia | método y herramientas | `replication/` |
| COBRIA API & UX | integración, interfaz, accesibilidad e i18n | manual planificado | roadmap, fase 10 |
| COBRIA Performance | medición, costo y optimización responsable | método experimental | artículo y `replication/` |
| COBRIA Analytics & AI | datos reproducibles, procedencia, abstención y agentes | manual y experimento | `manuales/06-analitica-ia.md` |
| COBRIA Toolkit | esquemas, CLI, generadores, auditor y plantillas | herramientas | roadmap, fases 11–14 |
| COBRIA Evidence | trazabilidad, protocolos, resultados y amenazas | evidencia científica | `replication/` y `specification/` |
| COBRIA Knowledge | artículo, maestro, libro, sitio y recursos | publicación | fuentes editoriales y `sitio/` |
| COBRIA Engineering | UX operativa, autoridad, resiliencia, entrega, observabilidad, costo y evolución | manual y contratos verificables | `specification/phase-19/` y `manuales/13-engineering.md` |

## Dependencias permitidas

```text
Manifesto ──orienta──> manuales y herramientas
Core ──define conformidad──> pruebas Core
Evidencia ──sustenta──> artículo y conclusiones
Manuales ──explican──> Core, patrones y prácticas generales
Sitio/libro ──publican──> contenido derivado de fuentes canónicas
```

El flujo inverso no es normativo: una analogía del libro, una pantalla del sitio o una
plantilla no puede cambiar Core ni convertir un resultado preliminar en evidencia.

## Estados de madurez

- **Propuesto:** diseño sin aceptación o prueba suficiente.
- **Documentado:** explicación revisable y fuente identificada.
- **Implementado:** existe código o configuración inspeccionable.
- **Ejecutado:** existe resultado producido por una ejecución registrada.
- **Validado externamente:** un tercero independiente reprodujo o evaluó el resultado.
- **Normativo:** una versión estable define requisitos de conformidad.
