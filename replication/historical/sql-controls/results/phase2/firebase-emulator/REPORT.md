# Informe de ejecución en emuladores Firebase

Fecha: 2026-08-23. Entorno: Firebase Auth Emulator y Realtime Database Emulator.

La ejecución conjunta inicial falló en la primera aserción de la suite de jugadores
(HTTP 401 en vez de 201). Repetirla con `AUTH_SESSION_CHECK_REVOKED=false` produjo el
mismo resultado. La causa fue una discrepancia del arnés: cada suite valida tokens con
un `projectId` propio, mientras una ejecución conjunta inicia un único proyecto.

| Suite | Proyecto del emulador | Pruebas | Resultado |
|---|---|---:|---|
| Players HTTP | `bshandball-players-http-test` | 1 | 1 aprobada |
| Seasons HTTP | `bshandball-seasons-http-test` | 4 | 4 aprobadas |
| Participation HTTP | `bshandball-participation-http-test` | 3 | 3 aprobadas |

Resultado definitivo: 8/8 pruebas aprobadas con tokens reales del emulador. Esto valida
los contratos incluidos, no constituye una auditoría exhaustiva ni una medición de
producción.

