# COBRIA Quality y Operations

## Pirámide de evidencia

1. Formato y análisis estático.
2. Pruebas de dominio y casos de uso.
3. Contratos de repositorios y adaptadores.
4. Reglas de seguridad y emuladores.
5. Concurrencia, idempotencia y fallos.
6. Integración y E2E.
7. Rendimiento con percentiles y recursos.
8. Staging sobre el commit candidato.
9. Aprobación humana y promoción.
10. Verificación y rollback de producción.

## Definición de terminado

Una característica termina cuando comportamiento, permisos, datos, concurrencia, errores, observabilidad, documentación, migración y rollback poseen evidencia proporcional al riesgo.

## Gate local único

```text
verificar arquitectura
-> verificar contratos
-> ejecutar unitarias
-> ejecutar reglas y emuladores
-> ejecutar concurrencia
-> ejecutar integración/E2E
-> revisar dependencias y presupuestos
-> guardar informe ligado al commit
```

## Observabilidad responsable

Los registros deben incluir versión de esquema, momento, nivel, operación, correlación y ámbito autorizado; deben excluir secretos y datos personales innecesarios. La telemetría no puede bloquear una venta, reserva o registro principal ni crecer sin límite.

## Offline

No toda operación se puede encolar. Dinero, inventario, cierres, permisos y decisiones irreversibles suelen requerir conexión. Una política central clasifica rutas; si una parte del lote es solo-en-línea, se rechaza el lote completo antes de crear efectos parciales.

## Producción

La ruta es `verificar local -> desplegar staging -> verificar staging -> aprobación -> producción -> verificar`. Una calificación promedio alta no compensa una falla de seguridad, pérdida de datos o ausencia de rollback.
