# COBRIA Quality y Performance

**Versión:** 1.0  
**Estado:** guía estable; las cifras conservan el alcance de su protocolo  
**Fuentes verificables:** `specification/phase-9/` y `specification/phase-15/`

## Propósito

Calidad significa aportar evidencia proporcional al riesgo. Rendimiento significa mejorar
una métrica relevante sin ocultar costos en escritura, almacenamiento, recuperación,
operación o mantenimiento. Ninguna prueba aislada demuestra la calidad total y ningún
microbenchmark demuestra superioridad arquitectónica.

## Del requisito a la evidencia

Cada requisito enlaza riesgo, prueba, resultado, ambiente, commit y limitación. Los estados
permitidos distinguen planeado, parcial, ejecutado localmente, ejecutado por perfil y
validación externa. Una ausencia permanece pendiente; no se rellena con una afirmación.

## Pruebas según el cambio

| Cambio | Pruebas mínimas |
|---|---|
| regla de dominio | unidad, contrato y casos negativos |
| adaptador | contrato, integración, motor real y resiliencia |
| esquema | unidad, migración, compatibilidad y rollback |
| API o interfaz | contrato, E2E, accesibilidad y humo |
| política de seguridad | autorización, abuso y no divulgación |
| despliegue | integración, seguridad, humo y rollback |
| proyección o índice | equivalencia, motor real, rendimiento y reconstrucción |

Unitarias, integración y E2E no forman una pirámide rígida: su proporción depende del
riesgo y costo. Las pruebas de mutación evalúan si las aserciones detectan cambios; las de
concurrencia buscan carreras, duplicados y revisiones obsoletas.

## Protocolo de rendimiento

Antes de medir se congelan pregunta, alternativas, datos, tamaños, semilla, número de
corridas, calentamiento, orden, ambiente y presupuestos. Se conserva cada observación y se
publican p50, p95, p99, MAD e IQR. Cuando el diseño lo permite se añaden intervalos de
confianza, comparaciones pareadas y tamaño de efecto.

El estudio local disponible contiene 630 observaciones: 7 estrategias, 3 tamaños y 30
corridas. Es una microcomparación algorítmica de un proceso, sin red ni facturación real;
no prueba rendimiento distribuido ni superioridad universal de COBRIA.

## Alternativas obligatorias

Compare documento único, índice nativo, vista materializada, CQRS, reconstrucción mediante
eventos, proyección sin contratos COBRIA y COBRIA cuando autoridad, ámbito y reconstrucción
sean requisitos reales. Si un índice satisface la lectura, otra representación puede ser
complejidad injustificada.

## Costo total

Mida latencia, construcción, recuperación, CPU, memoria, almacenamiento, amplificación de
escritura, tráfico, facturación y esfuerzo de cambio. `cpuMs`, bytes y `workProxy` son
indicadores computacionales, no consumo energético ni emisiones. Una afirmación ambiental
requiere medición física y frontera metodológica publicada.

## Presupuestos y regresiones

Un presupuesto se define antes de observar el resultado y se versiona con la carga. Si se
incumple, se bloquea la afirmación correspondiente; no se concluye automáticamente que la
arquitectura sea incorrecta. Cambiar el presupuesto exige justificación.

## Laboratorio

1. Relacione diez requisitos con riesgos y pruebas.
2. Introduzca una mutación y confirme que una prueba falla.
3. Compare documento único, índice y proyección con datos idénticos.
4. Ejecute calentamiento y aleatorice el orden.
5. Examine p50, p95, p99 y dispersión, no solo el promedio.
6. Mida escritura, almacenamiento y recuperación.
7. Documente cuándo la opción sencilla gana.

**Criterio de avance:** cada afirmación cuantitativa enlaza protocolo, configuración,
commit, observaciones, análisis, amenaza y documento; los costos contrarios permanecen
visibles.
