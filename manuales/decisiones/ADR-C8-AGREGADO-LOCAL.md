# Decisión del agregado documental local de la reserva

ID: ADR-C8-AGREGADO-LOCAL. Responsable: Billy Jak Cordero Porras.
Versión: 0.1.0. Fecha: 2026-10-18. Estado: implementada localmente; propuesta independiente.
Revisar si cambian límites, retención, concurrencia, motor o recuperación.

## Contexto

El caso C3 guarda el hecho y después registra la operación. Esos efectos separados
no garantizan confirmación conjunta. C8 necesita demostrar un reintento después de
perder la respuesta, con un motor documental real y un caso pequeño comprensible.

## Decisión

Usar un documento por ámbito en PouchDB/LevelDB: contiene hechos, operaciones
idempotentes y proyección. Un `put` condicionado por revisión confirma los tres.
Se relee ante conflicto y se permiten hasta ocho intentos. El dominio no importa
el SDK; `RegistrarDurable` solicita la capacidad a un puerto.

## Alternativas

Separar documentos como en C3 permite más independencia, pero requiere otra estrategia
para coordinar hechos e idempotencia. Transacciones de otro motor cambian proveedor y
complejidad operativa. Un registro de eventos permite derivación posterior, con trabajo
adicional de orden, publicación y recuperación. No se compararon aquí sus rendimientos.

## Consecuencias

La garantía queda dentro de un agregado. No abarca correo, cobros, otros ámbitos ni
fallos físicos del disco. Se limitan 1000 documentos, 1000 operaciones y 2 MiB. El
historial sin poda y la reescritura concentran el costo; leer verifica O(n) elementos.
No utilice este diseño como modelo universal de escalabilidad.

## Evidencia y revisión

`replication/examples/integral-c8/test/integracion.test.mjs` prueba reintento,
concurrencia, restauración y reconstrucción. `verificar.mjs` produce un recorrido
local con huellas. La reapertura es ordenada; no acredita caída eléctrica ni replicación.
Las sesiones y la auditoría en memoria no se incluyen en el respaldo.

Si el costo supera el presupuesto del caso, proponga otro ADR con mediciones,
alternativas y migración verificable. No amplíe silenciosamente los límites ni
reescriba este registro para ocultar la decisión anterior. Core 1.0 permanece congelado.
