# Normas y evaluación de calidad en COBRIA

**Naturaleza:** guía de adopción y correspondencia temática; no es una norma ni una certificación.  
**Corte de consulta:** 16 de octubre de 2026.  
**Fuente estructurada:** `editorial/standards-map.json`.

## 1. Qué se incorpora del documento recibido

Roa Molina, Morales y Gutiérrez (2015), «Norma ISO/IEC 25000», TIA, 3(2), pp. 26–32,
es un artículo introductorio, no el texto de una norma ISO. Presenta SQuaRE, modelos,
medición, requisitos y evaluación. Su aporte útil es organizar la pregunta: qué
calidad necesita este producto, cómo medirla y cómo decidir con evidencia.

Se utiliza como antecedente bibliográfico, no como catálogo vigente ni autoridad
normativa. No se incorpora el PDF recibido al repositorio ni se reproducen sus figuras.
No se adopta su expresión «Fiabilidad = Calidad / Tiempo» como métrica: una medida
necesita definición operacional, unidad, población y condiciones de observación.
Tampoco se adoptan promesas de ahorro o garantías de calidad sin evaluación propia.

Las fichas oficiales consultadas distinguen ISO/IEC 25010:2023 (producto) y
25019:2023 (calidad en uso). Por tanto no se traslada el modelo de ocho características
descrito en 2015 como si fuera el modelo actual. ISO/IEC 25040:2024 reemplaza la
edición 2011. Un borrador no se trata como una edición publicada. ISO/IEC 25023:2016
figura publicada y en revisión: su correspondencia con modelos posteriores requiere
análisis, no se supone automática.

## 2. Tres cosas diferentes

1. **Orientación temática:** COBRIA selecciona una práctica útil a partir del alcance
   público de una referencia. Es el estado de esta integración.
2. **Evaluación de conformidad:** requiere texto aplicable autorizado, edición y
   enmiendas, alcance, cláusulas, evidencia suficiente y evaluación de brechas.
3. **Certificación:** es un proceso independiente cuando corresponda; no surge de
   pasar las pruebas de COBRIA, instalar un paquete o citar ISO.

No se revisaron los textos íntegros de pago de todas las normas. Las asociaciones
de esta guía son interpretaciones de diseño COBRIA, no transcripciones de cláusulas.
No se compran normas ni se copian documentos protegidos automáticamente. Las normas
de sistemas de gestión se refieren a una organización y su sistema de gestión, no a
una propiedad que pueda certificarse añadiendo una función al código.

Core 1.0 y C1/C2/C3 no cambian. Una correspondencia con ISO no acredita conformidad
Core y superar Core no acredita ISO. Ningún requisito ISO nuevo se declara aquí.

## 3. Referencias por área y primera aplicación

| Área | Referencias consultadas | Aplicación COBRIA propuesta | Evidencia que falta producir por proyecto |
|---|---|---|---|
| Calidad, Core y rendimiento | ISO/IEC 25000:2014, 25010:2023, 25023:2016, 25030:2019, 25040:2024 | seleccionar atributos, requisitos medibles y plan de evaluación | medidas con carga, ambiente, límites y decisión |
| Datos, catálogos y analítica | ISO/IEC 25012:2008, 25024:2015 | calidad de datos, reglas del diccionario, completitud y coherencia | resultados por población, tratamiento de nulos y procedencia |
| Arquitectura, capas y patrones | ISO/IEC/IEEE 42010:2022 | interesados, preocupaciones, vistas, decisiones y alternativas | descripción de arquitectura revisable; un árbol de carpetas no basta |
| Construcción y requisitos | ISO/IEC/IEEE 29148:2018 | necesidad, requisito verificable y trazabilidad | aceptación acordada y gestión de cambios |
| Documentación | ISO/IEC/IEEE 15289:2019 | propósito, audiencia, responsable y vigencia de cada documento | inventario y revisión de contenido; no solo existencia de README |
| Pruebas y evidencia | ISO/IEC/IEEE 29119-2:2021 | planificar, seguir y cerrar las pruebas según riesgo | condiciones, resultados, anomalías y límites de cobertura |
| Seguridad y suministro | ISO/IEC 27001:2022; NIST SP 800-218, versión 1.1 | riesgos, controles, dependencias, respuesta y verificación de cambios | decisiones, responsables y pruebas; el escáner no sustituye el análisis |
| Privacidad | ISO/IEC 27701:2025 | finalidad, inventario, minimización, retención y atención de solicitudes | evaluación organizacional y técnica contextual; no dictamen legal |
| API, UX y calidad en uso | ISO/IEC 25019:2023; WCAG 2.2 | tareas reales y objetivo de accesibilidad con alcance declarado | teclado, lector, zoom, errores y estudio con usuarios cuando corresponda |
| Nube, Engineering y operación | ISO/IEC 20000-1:2018 | servicio, cambios, incidentes, entrega y recuperación | simulacros, mediciones de servicio y responsables reales |
| IA y agentes | ISO/IEC 42001:2023, 23894:2023 | inventario de IA, riesgo, supervisión, abstención y retiro | evaluación contextual, incidentes, seguimiento y controles de herramientas |
| Toolkit y publicaciones | referencias aplicables anteriores | validar estructura y enlazar evidencia de cada decisión | revisión semántica; una CLI no certifica una norma |

El registro estructurado conserva edición, fuente oficial, áreas, prioridad, práctica,
evidencia esperada y límite. Las fuentes oficiales son ISO, IEEE, W3C y NIST; no se
utiliza un portal comercial de resúmenes como organismo emisor.

## 4. Método sencillo: de «rápido y seguro» a una evaluación

1. Identifique usuarios, tarea, riesgo y contexto. Por ejemplo: una guardaparques
   registra una observación con conectividad intermitente.
2. Elija pocos atributos importantes: corrección, tiempo de respuesta, aislamiento,
   recuperación y facilidad de completar la tarea.
3. Escriba un requisito con identidad, responsable, población, método, unidad, umbral
   y justificación. Fije las condiciones antes de medir.
4. Diseñe casos correctos, negativos y de fallo. Registre exclusiones.
5. Ejecute sobre un SHA y configuración conocidos. Conserve datos crudos y herramienta.
6. Compare con el criterio acordado y publique aprobado, rechazado, pendiente o no
   aplicable justificado. La ausencia de evidencia no significa aprobado.
7. Revise el resultado y abra acciones. Repita después de un cambio material.

Esta secuencia es una adaptación didáctica COBRIA. No reproduce literalmente el proceso
o las cláusulas de ISO/IEC 25040. No calcule un promedio global que esconda una fuga de
ámbito o una pérdida de datos debajo de una buena latencia.

## 5. Ejemplo neutral de plan, no resultado ejecutado

| ID local | Pregunta | Medida y contexto | Criterio ilustrativo | Evidencia |
|---|---|---|---|---|
| CAL-001 | ¿El resumen significa lo mismo que el registro? | diferencias lógicas entre fuente y candidata del mismo ámbito y revisión | cero diferencias según verificador congelado | lista de diferencias y manifiesto |
| CAL-002 | ¿La lectura responde a tiempo? | p95 en ms; carga, red, calentamiento y concurrencia declarados | <=500 ms bajo la carga acordada | observaciones, percentiles y ambiente |
| CAL-003 | ¿Un ámbito puede ver otro? | documentos cruzados en el conjunto adverso definido | cero cruces; rechazo antes del acceso | casos positivos/negativos y resultado |
| CAL-004 | ¿Los datos tienen procedencia válida? | registros válidos / registros inspeccionados; informar faltantes y denominador | 100% del lote ficticio, no de datos desconocidos | reporte del diccionario y lote |
| CAL-005 | ¿La tarea se puede completar con teclado? | recorrido completo con foco, mensajes y recuperación de errores | sin bloqueo de teclado en ese recorrido | protocolo manual, navegador y hallazgos |

Los umbrales son decisiones del ejemplo, no valores impuestos por ISO. El último caso
no demuestra por sí solo WCAG 2.2 AA. Completar tareas no acredita automáticamente
calidad en uso para todas las poblaciones.

## 6. Contrato mínimo de una ficha de evaluación

```json
{
  "id": "CAL-002",
  "referencia": "ISO/IEC 25010:2023",
  "relacion": "orientacion-tematica-no-conformidad",
  "responsable": "equipo-de-calidad",
  "contexto": "reserva-ficticia; carga y red por congelar",
  "medida": "p95 de lectura",
  "unidad": "ms",
  "criterio": "<=500 bajo carga declarada",
  "estado": "pendiente",
  "evidencia": []
}
```

Antes de ejecutar se añaden SHA, artefacto, configuración, población, semilla cuando
aplique, herramienta y fecha. Después se enlazan datos, cálculo, decisión, limitaciones
y revisión. El validador de esta incorporación comprueba estructura y trazabilidad
documental; no comprueba por sí mismo la calidad del software evaluado.

## 7. Adopción por prioridad

**Primero:** requisitos y evaluación SQuaRE, datos, arquitectura, pruebas, accesibilidad
y desarrollo seguro. Vincularlos a trabajo existente evita crear carpetas ceremoniales.

**Después, según riesgo:** gobierno de privacidad, servicios e IA. Un proyecto sin IA
puede justificar no aplicabilidad del perfil de IA; no necesita inventar un modelo.

**Antes de afirmar conformidad:** obtener acceso al texto autorizado de la edición
elegida, revisar enmiendas y alcance, establecer matriz de cláusulas y brechas y realizar
la evaluación competente que corresponda. La fecha de consulta no congela para siempre
el estado de una norma. Revisar el registro antes de cada release.

## 8. Fuentes y límites académicos

El registro incluye enlaces directos a las fichas oficiales y fecha de consulta.
El artículo aportado se cita como antecedente de 2015, no como fuente de las ediciones
2023–2025. La incorporación no agrega resultados a P1/P2/R1/S1/A1 ni sustenta porcentajes
de mejora. Libro, sitio y manuscritos deben conservar esa misma distinción.

## 9. Verificación de esta integración

El 16 de octubre de 2026 se ejecutaron las tres pruebas estructurales del registro,
`make verificar` y la validación editorial R5, con resultado aprobado. Después de
las compilaciones finales se repitió `make verificar-sitio`: lint, construcción y
10 pruebas aprobadas, incluida la presentación de referencias por área. La réplica
incluye ahora 90 pruebas; son pruebas locales, no nuevas corridas científicas.

Se regeneraron el maestro (199 páginas), el artículo (15) y el libro (250), además
del cuaderno y anexo mediante su exportador existente. Se inspeccionaron visualmente
la lección 12.5, las cinco páginas nuevas de referencias y las páginas modificadas de
los manuscritos. No se afirma revisión visual integral de todas las páginas.

No se evaluaron cláusulas completas, no se emitió certificación, no se modificó Core
y no se desplegó el sitio. No se repitió en esta tarea la auditoría de dependencias:
el bloqueo previo de publicación no se considera resuelto por estas pruebas.
