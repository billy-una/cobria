# Modelo de amenazas COBRIA 1.1

## Activos

Documentos canónicos, identidades, revisiones, catálogos, proyecciones, manifiestos analíticos, índices vectoriales, credenciales, registros de auditoría y procedimientos de reconstrucción.

## Fronteras de confianza

1. Entrada frente al dominio canónico.
2. Dominio canónico frente a tareas de proyección.
3. Ámbito autorizado frente a otros ámbitos.
4. Evidencia recuperada frente a modelos de IA.
5. Versión candidata frente a versión publicada.

## Amenazas y controles

| ID | Amenaza | Consecuencia | Controles COBRIA | Verificación |
|---|---|---|---|---|
| T-01 | Confusión entre organizaciones | Lectura o escritura cruzada | SCP-001, SEC-001 | S1 y consultas negativas |
| T-02 | Edición directa de un derivado | Autoridades paralelas | AUT-001 | Escritura fuera de frontera |
| T-03 | Repetición de eventos | Duplicados y conteos falsos | IDM-001 | Reentrega de la misma revisión |
| T-04 | Revisión fuera de orden | Regresión del estado visible | REV-001 | Secuencia 3, 1, 2 |
| T-05 | Proyección manipulada | Decisiones sobre datos falsos | PRV-001, EQV-001 | Huella y equivalencia |
| T-06 | Fallo durante publicación | Ventana vacía o mezcla de versiones | PUB-001 | Interrupción controlada |
| T-07 | Envenenamiento analítico | Modelo o informe no reproducible | ANA-001 | Manifiesto y partición temporal |
| T-08 | Recuperación vectorial no autorizada | Fuga semántica entre ámbitos | SEC-001, AI-001 | Corpus cruzado adversarial |
| T-09 | Evidencia insuficiente | Respuesta plausible sin respaldo | AI-001 | Abstención y citas válidas |
| T-10 | Herramienta de agente excesiva | Cambios fuera de autoridad | AUT-001, SCP-001 | Permisos mínimos y simulación |
| T-11 | Eliminación incompleta | Persistencia en derivados | RET-001, REC-001 | Retiro y reconstrucción sin sujeto |
| T-12 | Dependencia del proveedor | Imposibilidad de migrar | ID-001, VSN-001 | Migración entre adaptadores |

## Riesgo residual

COBRIA reduce errores arquitectónicos, pero no reemplaza cifrado, autenticación, control de acceso, copias de seguridad, consenso distribuido ni evaluación de seguridad del motor. Cada implementación DEBE documentar esos controles externos.

