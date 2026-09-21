# Requisitos de COBRIA Engineering

Estos requisitos pertenecen al ecosistema de ingeniería y no amplían COBRIA Core 1.0.

| ID | Área | Obligación | Aceptación observable | Prueba | Responsable |
|---|---|---|---|---|---|
| ENG-001 | UX operativa | Todo flujo asíncrono **DEBE** representar reposo, carga, éxito, vacío, error y reintento; una acción no **DEBE** aplicarse dos veces por interacción accidental. | Los seis estados pueden provocarse y el doble envío produce un solo efecto. | componente, teclado y E2E | equipo de producto |
| ENG-002 | autoridad | Una operación crítica **DEBE** derivar actor, capacidad y ámbito en una frontera confiable; validar, aplicar idempotencia y conservar auditoría. | Entradas repetidas no duplican y un ámbito ajeno se rechaza antes de escribir. | contrato, seguridad e integración | equipo de aplicación |
| ENG-003 | resiliencia | Cada operación **DEBE** declarar `offline-safe` u `online-only`; las colas **DEBEN** tener capacidad, TTL, intentos, backoff y dead-letter acotados. | Un lote con una operación crítica no se encola parcialmente; los agotados son inspeccionables sin reproducción automática. | política y fallo inyectado | equipo de plataforma |
| ENG-004 | entrega | Staging y producción **DEBEN** promover el mismo artefacto inmutable, ligado a commit, configuración, evidencia, aprobación y rollback. | El digest coincide, el respaldo es verificable y un gate faltante produce NO-GO. | gate de release y humo | responsable de release |
| ENG-005 | observabilidad | La telemetría **DEBE** ser acotada, no bloquear negocio y excluir secretos e identificadores personales o comerciales innecesarios. | Fallar al reportar no altera el caso de uso; nombres y atributos superan la política de privacidad. | contrato y análisis de campos | equipo de operación |
| ENG-006 | rendimiento y costo | Toda optimización **DEBE** registrar línea base, presupuesto, cambio mínimo, beneficio, regresiones y costo total. | Existe comparación antes/después con carga congelada; no se afirma porcentaje sin datos. | benchmark y presupuesto | responsable del módulo |
| ENG-007 | evolución | Un componente heredado en retiro **DEBE** quedar sin crecimiento, detrás de una frontera y con consumidores, presupuesto y condición de eliminación conocidos. | El gate impide nuevas responsabilidades y registra reducción o excepción justificada. | arquitectura y presupuesto de mantenibilidad | equipo mantenedor |
| ENG-008 | incidentes | Toda corrección material **DEBE** registrar síntoma, causa raíz, impacto, solución, verificación, riesgo residual y revisión afectada. | Otra persona puede reproducir el diagnóstico y localizar la prueba que evita la regresión. | auditoría documental | responsable del incidente |

## Regla transversal

Un equipo adopta solo los contratos correspondientes a sus riesgos. Añadir colas,
telemetría, proyecciones o ambientes sin necesidad observable contradice la sencillez de
COBRIA. Cada mecanismo declara también cuándo puede retirarse.
