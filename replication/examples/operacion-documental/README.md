# Operación documental de una reserva natural

Ejemplo neutral, escrito para COBRIA, de mecanismos de operación observados en sistemas
NoSQL. No contiene código copiado de los proyectos de referencia ni necesita Firebase,
credenciales, paquetes externos o un despliegue.

Desde la raíz de COBRIA:

```sh
npm test --prefix replication/examples/operacion-documental
npm start --prefix replication/examples/operacion-documental
```

La demostración produce una sola lectura concurrente, una sola acción local, un borrador
encolado y telemetría sin campos personales. La escritura sensible offline se rechaza.

## Responsabilidades

| Archivo | Responsabilidad | Límites |
|---|---|---|
| `src/data/cache-lecturas.mjs` | TTL, deduplicación, ámbito/política y límites de memoria | Autorizar antes de consultarla; invalidar tras escritura/cambio de sesión; no cancela una petición ya entregada a un consumidor. |
| `src/data/cola-offline.mjs` | Preflight del lote, capacidad y vencimiento | Borradores locales exclusivamente; no sincroniza ni autoriza escrituras remotas. |
| `src/application/accion-unica.mjs` | Doble ejecución local en vuelo | El servidor todavía necesita identidad de operación e idempotencia. |
| `src/data/telemetria-acotada.mjs` | Métricas de vocabulario cerrado y cola acotada | No es un recolector remoto, un SLO ni una medida de ahorro. |
| `src/application/verificar-entrega.mjs` | Concordancia de SHA, digest y frescura | Valida registros, no su autenticidad; los registros de test son sintéticos. |
| `src/demo.mjs` | Composición y demostración | Datos ficticios de una reserva. |
| `test/operacion.test.mjs` | Concurrencia, límites, rechazos y consistencia | Pruebas funcionales locales; no evaluación de infraestructura distribuida. |

Cada consumidor recibe copias independientes de la caché. Invalidar no permite que una
respuesta antigua repueble la entrada nueva. La política de autorización tiene versión
en la clave, pero sigue siendo necesario evaluar permisos vigentes antes de leer.

La comprobación de entrega exige cinco registros por candidato. Cada organización debe
definir su procedimiento real de aprobación, verificación de respaldo, restauración,
promoción y autenticidad de evidencias; este ejemplo no realiza esas actividades.
