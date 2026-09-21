# Actores y objetivos del ecosistema COBRIA

**Versión:** 1.0  
**Estado:** aprobado para la fase 2  
**Alcance:** ecosistema COBRIA; no modifica COBRIA Core 1.0

## Actores

| ID | Actor | Objetivo | Responsabilidad | Fuera de alcance |
|---|---|---|---|---|
| ACT-01 | persona programadora principiante | construir software comprensible sin memorizar una arquitectura completa | seguir el recorrido, declarar decisiones y ejecutar verificaciones | recibir una solución automática sin comprenderla |
| ACT-02 | persona desarrolladora | implementar y evolucionar módulos con fronteras explícitas | conservar contratos, pruebas y trazabilidad | adoptar todos los componentes COBRIA por defecto |
| ACT-03 | responsable de arquitectura | decidir estructuras, dependencias y compromisos | justificar alternativas, costos y límites | imponer tecnología sin requisito |
| ACT-04 | responsable de datos | gobernar identidad, significado, calidad, procedencia y ciclo de vida | mantener diccionarios, catálogos y migraciones | convertir cada lectura en una nueva copia |
| ACT-05 | responsable de seguridad y privacidad | limitar capacidades, ámbitos y exposición | modelar amenazas y comprobar casos negativos | declarar seguridad absoluta |
| ACT-06 | responsable de calidad | relacionar requisitos con pruebas y evidencia | distinguir prueba planificada, ejecutada y externa | sustituir revisión independiente |
| ACT-07 | responsable de operación | desplegar, observar, recuperar y retirar componentes | conservar ambientes, límites, alertas y runbooks | ocultar fallos detrás de reintentos ilimitados |
| ACT-08 | investigador o revisor | evaluar definiciones, método, evidencia y amenazas a la validez | reproducir, cuestionar y registrar resultados | aceptar afirmaciones sin fuente |
| ACT-09 | agente de inteligencia artificial | asistir cambios acotados con contexto y permisos mínimos | respetar contratos, archivos protegidos y criterios de aceptación | adquirir autoridad de dominio o aprobar su propio trabajo |
| ACT-10 | consumidor de documentación | aprender, buscar y aplicar una práctica pertinente | distinguir norma, evidencia y enseñanza | interpretar el libro como certificación |

## Objetivos del sistema

| ID | Objetivo observable | Indicador de logro |
|---|---|---|
| OBJ-01 | transformar una necesidad en decisiones implementables | existe una cadena actor → caso → requisito → aceptación |
| OBJ-02 | hacer explícitas responsabilidades y dependencias | cada componente obligatorio tiene dueño, frontera y requisito |
| OBJ-03 | gobernar datos y derivados sin autoridad paralela | la autoridad y los derivados están identificados y probados cuando aplica Core |
| OBJ-04 | permitir evolución controlada | contratos, versiones, migraciones y compatibilidad están declarados |
| OBJ-05 | integrar seguridad, calidad y operación desde el diseño | cada flujo sensible tiene controles, pruebas negativas y recuperación previstas |
| OBJ-06 | apoyar aprendizaje progresivo | una persona puede elegir una ruta y llegar a un ejemplo ejecutable |
| OBJ-07 | habilitar asistencia segura mediante IA | el agente recibe contexto, límites, comandos y aceptación verificables |
| OBJ-08 | preservar validez científica | toda cifra y conclusión puede rastrearse a protocolo, ejecución y limitación |

## Conflictos legítimos

- simplicidad frente a extensibilidad;
- latencia frente a frescura y costo;
- automatización frente a control humano;
- documentación exhaustiva frente a mantenimiento;
- aislamiento frente a consultas agregadas;
- rapidez de entrega frente a evidencia suficiente.

COBRIA no elimina estos conflictos: exige declararlos y tomar una decisión revisable.

