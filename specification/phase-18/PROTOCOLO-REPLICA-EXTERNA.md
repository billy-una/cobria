# Protocolo de réplica externa

## Independencia

La persona ejecutora no debe haber creado el arnés ni recibir instrucciones privadas del
autor. Debe registrar sistema operativo, arquitectura, versiones, commit, fecha, comandos,
errores y cualquier desviación antes de observar los resultados esperados.

## Procedimiento

1. Obtener el paquete por un canal público o mediante una persona intermediaria.
2. Verificar las huellas SHA-256 del manifiesto.
3. Instalar dependencias desde archivos de bloqueo.
4. Ejecutar `make verificar` sin modificar código.
5. Ejecutar P1, P2, R1, S1 y A1 en infraestructura disponible.
6. Conservar salida completa, configuración y resultados negativos.
7. Entregar un informe con código de replicador y conflicto de interés.

## Resultado

Coincidencia, coincidencia parcial o no coincidencia. Un fallo no se elimina: se clasifica
como defecto, diferencia ambiental, ambigüedad o desviación del protocolo. Solo una persona
externa puede cambiar el estado `P18-REPLICATION` mediante evidencia fechada.
