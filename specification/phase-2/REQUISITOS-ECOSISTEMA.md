# Requisitos verificables del ecosistema COBRIA

**Versión:** 1.0  
**Naturaleza:** requisitos del ecosistema; no sustituyen requisitos de COBRIA Core 1.0

Cada requisito contiene una aceptación observable. Las pruebas marcadas como
**planificadas** no se presentan como ejecutadas.

## Requisitos funcionales

### ECO-RF-001 — Registrar una necesidad
**Actor:** ACT-01, ACT-02.  
**Componente:** COBRIA Build.  
**Dato:** necesidad, actor, resultado, restricción.  
**Amenaza:** solución guiada por tecnología.  
**Aceptación:** dado un proyecto nuevo, se puede rastrear al menos una necesidad hasta
un caso de uso y un requisito con criterio de aceptación.  
**Prueba:** inspección de trazabilidad (planificada).

### ECO-RF-002 — Seleccionar adopción mínima
**Actor:** ACT-03.  
**Componente:** Manifesto y mapa del ecosistema.  
**Dato:** nivel, módulos aplicables, exclusiones.  
**Amenaza:** arquitectura ceremonial.  
**Aceptación:** cada módulo adoptado posee justificación; los no aplicables pueden
excluirse sin perder conformidad Core.  
**Prueba:** escenario de proyecto pequeño (planificada).

### ECO-RF-003 — Asignar responsabilidades
**Actor:** ACT-03.  
**Componente:** COBRIA Layers.  
**Dato:** componente, responsable, frontera, dependencias.  
**Amenaza:** reglas duplicadas o sin dueño.  
**Aceptación:** ningún componente declarado obligatorio carece de responsable, frontera
y requisito asociado.  
**Prueba:** validador documental de fase 2.

### ECO-RF-004 — Definir datos y contratos
**Actor:** ACT-04.  
**Componente:** COBRIA Data.  
**Dato:** diccionario, contrato, catálogo y migración.  
**Amenaza:** claves físicas sin significado o cambios incompatibles.  
**Aceptación:** cada dato publicado declara significado, tipo, obligatoriedad, ámbito,
versión y responsable.  
**Prueba:** fase 3 (planificada).

### ECO-RF-005 — Separar autoridad y derivados
**Actor:** ACT-04.  
**Componente:** COBRIA Core.  
**Dato:** objeto canónico, índice o proyección.  
**Amenaza:** fuente paralela de verdad.  
**Aceptación:** una implementación que reclame Core identifica autoridad y supera el
perfil de conformidad declarado.  
**Prueba:** P1, P2, R1, S1 y A1 según perfil.

### ECO-RF-006 — Registrar una decisión
**Actor:** ACT-03.  
**Componente:** gobernanza documental.  
**Dato:** contexto, alternativas, decisión, consecuencias.  
**Amenaza:** decisión irreversible sin motivo.  
**Aceptación:** toda decisión que cambie una frontera, contrato o dependencia estructural
tiene ADR enlazado al requisito que la originó.  
**Prueba:** auditoría de ADR (planificada).

### ECO-RF-007 — Relacionar requisito y prueba
**Actor:** ACT-06.  
**Componente:** COBRIA Quality y Evidence.  
**Dato:** requisito, prueba, estado, resultado.  
**Amenaza:** requisitos sin comprobación o pruebas sin propósito.  
**Aceptación:** todo requisito posee al menos una aceptación y una prueba existente o
marcada explícitamente como planificada.  
**Prueba:** `validate-phase2.py`.

### ECO-RF-008 — Gestionar ambientes
**Actor:** ACT-07.  
**Componente:** COBRIA Cloud & Operations.  
**Dato:** ambiente, cuenta, región, variables y política de datos.  
**Amenaza:** despliegue o datos en destino incorrecto.  
**Aceptación:** local, pruebas, preview, staging y producción pueden distinguirse sin
credenciales incrustadas y con reglas de promoción.  
**Prueba:** fase 8 (planificada).

### ECO-RF-009 — Verificar seguridad por flujo
**Actor:** ACT-05.  
**Componente:** COBRIA Security.  
**Dato:** actor, capacidad, ámbito, finalidad, control y auditoría.  
**Amenaza:** acceso cruzado o privilegio excesivo.  
**Aceptación:** cada operación sensible posee al menos un caso permitido y uno rechazado.  
**Prueba:** fase 7 (planificada); S1 cubre el aislamiento lógico Core.

### ECO-RF-010 — Observar y recuperar
**Actor:** ACT-07.  
**Componente:** COBRIA Operations.  
**Dato:** evento, métrica, alerta, runbook y punto de recuperación.  
**Amenaza:** fallo silencioso o recuperación improvisada.  
**Aceptación:** cada servicio operativo declara señal de salud, responsable, degradación
y procedimiento de recuperación o retiro.  
**Prueba:** fase 9 (planificada).

### ECO-RF-011 — Medir alternativas
**Actor:** ACT-06.  
**Componente:** COBRIA Performance.  
**Dato:** carga, configuración, muestra, distribución y costo.  
**Amenaza:** optimización basada en una medición aislada.  
**Aceptación:** una recomendación de rendimiento identifica línea base, alternativa,
p50, p95, p99, dispersión, recursos y limitaciones.  
**Prueba:** fase 15; parte disponible en `replication/`.

### ECO-RF-012 — Gobernar asistencia de IA
**Actor:** ACT-09.  
**Componente:** COBRIA AI Development.  
**Dato:** contexto, capacidad, archivos protegidos, comandos y aceptación.  
**Amenaza:** cambio fuera de autoridad o evidencia inventada.  
**Aceptación:** el agente puede explicar límites, modificar solo el alcance autorizado y
abstenerse si falta información crítica.  
**Prueba:** tareas ciegas de fase 16 (planificadas).

### ECO-RF-013 — Publicar productos coherentes
**Actor:** ACT-08, ACT-10.  
**Componente:** COBRIA Knowledge.  
**Dato:** fuente canónica, versión, naturaleza y artefacto.  
**Amenaza:** contradicción entre especificación, artículo, libro y sitio.  
**Aceptación:** cada producto indica si es normativo, científico o pedagógico y no
publica cifras sin fuente resoluble.  
**Prueba:** fase 17 (planificada).

### ECO-RF-014 — Preparar validación externa
**Actor:** ACT-08.  
**Componente:** COBRIA Evidence.  
**Dato:** versión, paquete, protocolo, consentimiento y resultado.  
**Amenaza:** simular independencia o generalizar evidencia interna.  
**Aceptación:** revisión y transferencia externas permanecen pendientes hasta recibir
evidencia identificada de terceros.  
**Prueba:** fase 18 (requiere personas externas).

## Requisitos no funcionales

### ECO-RNF-001 — Comprensibilidad
**Aceptación:** términos canónicos se enlazan al glosario y cada ficha explica propósito,
problema, decisión y consecuencias.  
**Prueba:** revisión editorial de fase 17 (planificada).

### ECO-RNF-002 — Trazabilidad
**Aceptación:** toda afirmación normativa o empírica posee identificador y fuente; toda
fuente derivada identifica su origen.  
**Prueba:** matriz de trazabilidad y enlaces automáticos (parcial).

### ECO-RNF-003 — Reproducibilidad
**Aceptación:** una ejecución científica registra versión, configuración, semilla,
ambiente, entradas y resultados sin depender de pasos secretos.  
**Prueba:** paquete `replication/` (cubierta local; réplica externa pendiente).

### ECO-RNF-004 — Portabilidad conceptual
**Aceptación:** los contratos de alto nivel no requieren un proveedor específico y al
menos dos adaptadores pueden aplicar el mismo perfil cuando corresponda.  
**Prueba:** pruebas de adaptadores locales y distribuidos disponibles.

### ECO-RNF-005 — Seguridad por defecto
**Aceptación:** ejemplos no contienen secretos, rechazan ausencia de ámbito cuando aplica
y usan capacidades mínimas.  
**Prueba:** auditoría de fase 7 (planificada).

### ECO-RNF-006 — Accesibilidad
**Aceptación:** documentación y sitio permiten teclado, ampliación al 200 %, contraste
legible, estructura semántica y alternativas textuales pertinentes.  
**Prueba:** auditoría de fase 10/17 (planificada).

### ECO-RNF-007 — Evolución compatible
**Aceptación:** cada artefacto canónico declara versión y estado; cambios incompatibles
generan versión mayor o ADR explícito.  
**Prueba:** revisión de versiones (parcial).

### ECO-RNF-008 — Construcción limpia
**Aceptación:** una copia limpia puede verificar réplica y sitio mediante comandos
documentados, sin archivos personales ni secretos.  
**Prueba:** CI y `make verificar` (implementado localmente).

### ECO-RNF-009 — Honestidad epistémica
**Aceptación:** los documentos distinguen propuesto, documentado, implementado,
ejecutado, validado externamente y normativo.  
**Prueba:** auditoría editorial de estados (parcial).

### ECO-RNF-010 — Mantenibilidad
**Aceptación:** una modificación canónica identifica derivados afectados, responsable y
pruebas; no requiere editar cifras duplicadas manualmente.  
**Prueba:** automatización de fase 17 (planificada).

