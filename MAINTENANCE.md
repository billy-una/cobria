# Política de mantenimiento de COBRIA

**Estado:** vigente para la candidata pública 1.0.0-rc1  
**Naturaleza:** propuesta independiente; no constituye estándar ni certificación.

## Versiones mantenidas

| Línea | Estado | Alcance |
|---|---|---|
| Core 1.0 | congelada | correcciones editoriales que no cambien requisitos |
| Ecosistema 1.0.0-rc1 | candidata pública | correcciones, reproducción y revisión externa |
| Ecosistema 1.0.0 | bloqueada | requiere las puertas humanas y externas declaradas |
| Core 1.1/1.2 | experimental | no sustituye Core 1.0 |

Se usa versionado semántico para el ecosistema. Un parche corrige sin cambiar contratos;
una versión menor añade contenido compatible; una versión mayor puede cambiar contratos.
Core solo cambia mediante ADR, nueva versión y revisión humana explícita.

## Flujo de cambio

1. Registrar una incidencia con problema, contexto y evidencia reproducible.
2. Identificar la autoridad afectada: especificación, implementación, evidencia o editorial.
3. Proponer la alternativa más sencilla y documentar costos y riesgos.
4. Añadir o actualizar pruebas antes de promover el cambio.
5. Ejecutar la puerta específica y `make verificar`.
6. Registrar el cambio en `CHANGELOG.md` y, si altera una decisión, mediante ADR.

Las metas de respuesta son clasificar una incidencia crítica en siete días y una normal
en treinta. Son objetivos de mantenimiento comunitario, no un acuerdo de nivel de servicio.

## Compatibilidad, retiro y conservación

Una obsolescencia se anuncia en al menos una versión menor y declara sustituto, migración
y fecha prevista de retiro. La evidencia no se reescribe: una corrección produce un nuevo
artefacto y conserva el anterior como histórico. Los resultados negativos también se
mantienen.

## Criterio de evolución 1.x

COBRIA 1.x se guiará por incidencias reproducibles, experiencias de adopción y revisión
externa. No se añadirán módulos, patrones o páginas únicamente para aumentar volumen. Un
cambio incompatible se reservará para Core o Ecosistema 2.0.

