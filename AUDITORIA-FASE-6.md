# Auditoría de fase 6 — Documentación, comentarios y lenguaje

## Resultado

La fase 6 queda **implementada y documentada** en el estándar y ejemplo neutral. Se
definieron cinco tipos documentales, un registro de fuentes canónicas, normas de
comentarios, internacionalización, fechas, monedas, unidades, códigos de error, README y
runbooks.

## Entregables

| Entregable | Archivo |
|---|---|
| registro documental | `specification/phase-6/documentation.yaml` |
| estándar documental | `specification/phase-6/ESTANDAR-DOCUMENTACION.md` |
| comentarios y docstrings | `specification/phase-6/COMENTARIOS-Y-DOCSTRINGS.md` |
| lenguaje, i18n y unidades | `specification/phase-6/LENGUAJE-I18N-Y-UNIDADES.md` |
| catálogo de errores | `specification/phase-6/ERROR-CATALOG.json` |
| plantillas | `PLANTILLA-README.md`, `PLANTILLA-RUNBOOK.md` |
| ADR | `specification/ADR-0006-ERRORES-Y-TEXTOS-SEPARADOS.md` |
| implementación y validador | ejemplo neutral, `validate-phase6.py` |

## Gate

Los comentarios documentan motivos y deuda trazable; las fuentes canónicas registradas
poseen responsable, versión, estado y revisión. El ejemplo ya no clasifica errores por
frases: usa códigos estables y presentación localiza el mensaje.

## Límites

- El registro cubre las fuentes canónicas principales, no cada documento histórico.
- La propagación editorial completa al artículo, maestro, libro y sitio corresponde a
  fase 17; por eso no se declara cierre global de toda la biblioteca documental.
- Traducciones adicionales a español requieren revisión lingüística humana cuando sean
  publicadas para audiencias específicas.

