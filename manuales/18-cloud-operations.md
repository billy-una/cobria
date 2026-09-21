# COBRIA Cloud y Operations

**Versión:** 1.0  
**Estado:** guía estable; no afirma un despliegue productivo inexistente  
**Fuentes verificables:** `specification/phase-8/` y `specification/phase-9/`

## Propósito

Operar es mantener el comportamiento esperado durante promoción, carga, degradación,
fallos, recuperación y retiro. La nube es un medio intercambiable; COBRIA aplica a
Firebase, otros proveedores administrados o infraestructura propia.

## Ambientes

| Ambiente | Datos | Función |
|---|---|---|
| local | sintéticos | desarrollo rápido |
| test | sintéticos efímeros | automatización repetible |
| preview | sintéticos o anonimización verificada | revisar un cambio |
| staging | sintéticos o anonimización verificada | ensayar promoción y rollback |
| producción | reales según finalidad y retención | servir tráfico autorizado |
| recuperación | respaldo cifrado y restringido | restaurar continuidad |

Los ambientes son cuentas, identidades y datos aislados; no sufijos de una colección. Los
alias de Firebase son ejemplos y nunca contienen credenciales. Enmascarar una pantalla no
anonimiza una base de datos.

## Construir una vez y promover

El pipeline produce un artefacto inmutable con huella, SBOM y procedencia. El mismo
artefacto pasa por test, preview, staging y producción. La configuración se inyecta por
ambiente y se valida antes de promover. Recompilar elimina la equivalencia.

```text
commit → pruebas → artefacto y huella → preview → staging
       → humo y observación → producción gradual → verificar o revertir
```

## Inventario de desplegables

Toda Function, webhook, tarea, worker o consumidor declara contrato, ámbito, región,
memoria, timeout, concurrencia, idempotencia, reintentos, dead-letter, secretos, permisos,
métricas, límites de costo, recuperación y responsable. Los reintentos no son infinitos y
la dead-letter no sustituye una alerta ni un procedimiento de reproceso.

## Migraciones y compatibilidad

Una migración declara versiones aceptadas, pasos idempotentes, ventana de compatibilidad,
validación, rollback y efecto sobre índices y proyecciones. Primero se despliegan lectores
compatibles, después escritores nuevos y finalmente se retira la versión anterior.

## Observabilidad

Los logs usan campos permitidos y excluyen payload, tokens, secretos y datos personales.
Las métricas evitan etiquetas de cardinalidad ilimitada. Las trazas conservan `traceId`.
Cada servicio declara salud, degradación segura, recuperación, responsable y runbook.

Los SLI mínimos cubren disponibilidad válida, latencia, frescura, integridad de publicación
y recuperación. Un SLO es propuesta hasta medirse en el entorno real. Toda alerta enlaza
responsable, severidad y runbook.

## Respaldo, restauración y desastre

Un respaldo solo cuenta cuando se restaura en aislamiento y se verifican huella, ámbito,
revisión, retención y punto objetivo. Se recuperan primero identidad, secretos, catálogos y
canónicos; después índices y proyecciones. RPO y RTO se miden durante el simulacro.

## Costos y retiro

Cada desplegable limita instancias, concurrencia, tiempo, memoria y presupuesto. El retiro
revoca tráfico, identidades y secretos; drena colas; conserva evidencia obligatoria; elimina
datos según retención y confirma que no quedan consumidores ocultos.

## Laboratorio

1. Configure staging y producción separados sin secretos en Git.
2. Promueva la misma huella a preview y staging.
3. Fuerce un fallo de Function y compruebe reintento acotado y dead-letter.
4. Ejecute humo y active rollback.
5. Restaure un respaldo en aislamiento y mida RPO/RTO.
6. Simule degradación de una proyección sin perder el canónico.
7. Retire un desplegable y compruebe identidades, colas, alertas y costo residual.

**Criterio de avance:** un ambiente de prueba puede observarse, degradarse, recuperarse y
retirarse sin credenciales o datos personales en documentación pública. La ejecución real
conserva evidencia; una simulación se etiqueta como simulación.
