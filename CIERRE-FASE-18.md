# Cierre automatizable de la fase 18

La fase 18 deja preparado el sistema de publicación y mantenimiento, pero no declara una
versión estable. Esta distinción aplica la regla de COBRIA que separa **preparado**,
**ejecutado** y **validado externamente**.

## Entregables preparados

- políticas de mantenimiento, contribución y seguridad;
- registro de cambios, cita canónica y archivo histórico;
- roadmap 1.x basado en adopción y evidencia;
- formularios públicos para defectos, patrones y reproducciones;
- puerta automática que valida la candidata y bloquea la etiqueta estable prematura.

## Verificación

```bash
make verificar-cierre-18
make verificar
```

El resultado correcto de la primera orden es `candidata-publica-estable-bloqueada`: los
controles automáticos pasan y las tareas humanas aparecen como pendientes. El informe
generado se guarda en `output/review/ecosistema-1.0.0/publication-readiness.json`.
`make preparar-estable` aplica una segunda barrera: termina con rechazo explícito hasta
que los hitos humanos y externos posean evidencia auténtica.

## Trabajo humano pendiente

La lectura independiente, el doble cribado, la transferencia con consentimiento, la
réplica externa y la autorización de publicación no pueden cerrarse mediante generación
de texto o pruebas locales. Hasta recibir evidencia válida, no se crea la etiqueta
`ecosistema-1.0.0` ni se presenta COBRIA como estándar, certificación o validación oficial.
