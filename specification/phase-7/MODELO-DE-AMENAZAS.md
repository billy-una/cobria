# Modelo de amenazas de la fase 7

## Alcance

Este modelo protege documentos canónicos, derivados, catálogos, identidades, secretos, evidencia y artefactos. Las fronteras son cliente–API, API–aplicación, aplicación–adaptador, adaptador–motor NoSQL, emisor–webhook y construcción–registro. No supone que la red, el cliente, un agente automatizado o una proyección sean confiables.

## Método

Cada amenaza se expresa como activo, atacante, frontera, condición, impacto, prevención, detección, respuesta y prueba negativa. El catálogo estructurado está en `security.json`; el modelo previo de investigación continúa en `THREAT-MODEL-1.1.md` y esta fase añade controles operables.

| Amenaza | Activo | Prevención | Detección | Respuesta | Evidencia |
|---|---|---|---|---|---|
| Lectura o escritura entre ámbitos | documentos | capacidad y ámbito exactos | denegación auditada | revocar identidad y revisar accesos | SEC-NEG-001/002 |
| Escalamiento mediante comodín | autorización | capacidades explícitas | ACCESS_DENIED | corregir política | SEC-NEG-003 |
| Manipulación de ruta o ámbito | adaptador NoSQL | gramática cerrada del ámbito | SCOPE_INVALID | bloquear solicitud | prueba `ámbitos manipulados` |
| Repetición alterada | canónico | idempotencia ligada a huella | conflicto estable | investigar emisor | SEC-NEG-004 |
| Escritura directa de derivados | proyección | único escritor técnico | divergencia de huella | retirar y reconstruir | conformidad COBRIA |
| Filtración de secreto | credenciales | gestor externo y lista positiva de logs | escaneo y alerta | revocar, rotar, investigar | gate de suministro |
| Webhook falsificado o repetido | casos de uso | firma, tiempo e idempotencia | contador de rechazo | bloquear origen y rotar | prueba del adaptador |
| Agotamiento de recursos | disponibilidad | cuotas, límites y cancelación | saturación por actor/ámbito | degradación segura | prueba de carga fase 10 |
| Dependencia comprometida | construcción | lockfile, SBOM y procedencia | revisión continua | aislar artefacto y actualizar | SBOM + runbook |
| Retención excesiva | privacidad | ventana por clase/finalidad | inventario vencido | borrar y verificar | informe de retención |

## Riesgo residual

El ejemplo neutral verifica la política en proceso; una producción debe añadir identidad fuerte, cifrado administrado, políticas del proveedor, pruebas de red, restauración, rotación real y monitoreo. Una prueba unitaria no demuestra que un despliegue esté protegido.
