# Cierre de las fases 16 y 17

**Candidata:** COBRIA Ecosistema 1.0.0-rc1.  
**Naturaleza:** propuesta independiente, no estable, no oficial y no certificada.  
**Fecha de preparación:** 21 de septiembre de 2026.

## Fase 16 — candidata reproducible

La candidata incluye las fuentes exactas de un commit, seis PDF canónicos, SBOM,
licencias, cita, notas, guía de reproducción, matriz de trazabilidad, manifiesto y
huellas SHA-256. El ZIP usa orden, fechas y permisos normalizados.

```bash
make construir-rc1
make verificar-cierre-16
```

La segunda orden construye dos paquetes independientes y exige igualdad de sus resúmenes
y huellas. Una construcción se rechaza si el árbol de trabajo no está limpio.

## Fase 17 — revisión automática de la candidata

```bash
make verificar-cierre-17
```

La auditoría comprueba pruebas del Toolkit, sitio, lint, vulnerabilidades de producción,
integridad y metadatos PDF, doble construcción reproducible y limpieza del repositorio.
Sus resultados se escriben en `output/review/ecosistema-1.0.0-rc1/`.

## Límites humanos

Continúan pendientes la lectura editorial independiente, revisión técnica independiente,
prueba de transferencia con consentimiento, evaluación de claridad y certificación
profesional de accesibilidad PDF. No se inventan identidades ni dictámenes para cerrar
estas tareas. La fase 18 solo puede llamar estable a la propuesta cuando la autoridad
humana definida acepte los resultados y límites.
