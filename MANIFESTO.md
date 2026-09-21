# Manifiesto COBRIA 1.0

**Estado:** estable para el ecosistema editorial y pedagógico  
**Autor:** Billy Jak Cordero Porras  
**Repositorio canónico:** <https://github.com/billy-una/cobria>  
**Relación normativa:** este manifiesto no sustituye ni amplía COBRIA Core 1.0

## Propósito

COBRIA es un ecosistema abierto para ayudar a personas y agentes de inteligencia
artificial a diseñar, construir, comprender, probar, asegurar, desplegar, operar y
evolucionar software. Su especialización científica, COBRIA Core, gobierna datos
canónicos y representaciones reconstruibles en sistemas documentales NoSQL.

COBRIA organiza prácticas conocidas en un método explícito, trazable y verificable.
No afirma haber inventado las capas, los repositorios, los catálogos, CQRS, las vistas
materializadas, los índices, los eventos ni los controles de seguridad que integra.
Su contribución debe evaluarse por la composición, los contratos, la evidencia y la
capacidad de transferencia, no por una pretensión de novedad absoluta.

## Promesa

Una decisión COBRIA debe poder:

1. explicarse en lenguaje sencillo;
2. rastrearse hasta una necesidad y una fuente;
3. comprobarse mediante criterios observables;
4. ejecutarse sin confundir autoridad con optimización;
5. corregirse o retirarse con un procedimiento conocido;
6. ser comprendida por otra persona sin depender de conocimiento oculto del autor.

## Principios

### M-01. La necesidad precede a la tecnología

Ninguna base de datos, nube, patrón, capa o modelo de IA se adopta por moda. Toda
elección responde a un requisito, explicita alternativas y conserva su costo.

### M-02. Cada responsabilidad tiene una frontera

Dominio, aplicación, presentación, persistencia, infraestructura y composición poseen
responsabilidades distintas. Una frontera existe para hacer visible el cambio, no para
crear carpetas ceremoniales.

### M-03. La autoridad de los datos es explícita

Cada hecho mutable tiene una representación autorizada. Índices, cachés, resúmenes,
vectores, conjuntos analíticos y respuestas de IA no se convierten silenciosamente en
fuentes paralelas de verdad.

### M-04. Toda optimización declara su costo

Una representación adicional se justifica con carga y métricas. Latencia, frescura,
almacenamiento, amplificación de escritura, recuperación y mantenimiento se consideran
en conjunto. Cuando un índice suficiente resuelve el problema, se prefiere la opción
más simple.

### M-05. Lo derivado debe poder explicarse y retirarse

Una proyección declara fuentes, transformación, versión, ámbito, frescura, responsable
y procedimiento de reconstrucción o retiro. Este principio se vuelve obligación de
conformidad únicamente cuando COBRIA Core así lo indique.

### M-06. El ámbito acompaña a la operación

El límite organizacional, de seguridad o privacidad no se añade al final. Identidad,
consultas, cachés, registros, tareas e integraciones conservan el ámbito pertinente.

### M-07. Los contratos evolucionan con versión

Datos, API, catálogos, eventos y configuraciones cambian mediante contratos explícitos,
compatibilidad declarada y migraciones repetibles; nunca por suposiciones invisibles.

### M-08. La evidencia es parte del producto

Pruebas, resultados, configuración, semillas, ambiente y limitaciones acompañan a la
afirmación que sostienen. “Documentado”, “implementado”, “ejecutado” y “validado por
terceros” son estados diferentes.

### M-09. La seguridad y la privacidad son propiedades del flujo

Cada operación sensible identifica actor, capacidad, ámbito, finalidad y evidencia de
auditoría. Se aplican mínimo privilegio, validación de frontera y pruebas negativas.

### M-10. La operación comienza durante el diseño

Despliegue, observabilidad, límites, recuperación, costos y retiro se diseñan antes de
producción. Un componente sin forma de diagnóstico o recuperación está incompleto.

### M-11. La IA asesora; no hereda autoridad

Un modelo puede clasificar, resumir, recuperar o recomendar. Sus entradas conservan
procedencia; sus herramientas tienen capacidades mínimas; sus respuestas admiten
abstención. La IA no sustituye autorización, consentimiento ni revisión independiente.

### M-12. La documentación debe permitir transferencia

El código explica cómo; la documentación conserva propósito, decisiones, invariantes,
riesgos y operación. Un nombre o comentario sirve al lector y no oculta una mala
separación de responsabilidades.

### M-13. La automatización debe ser reversible y verificable

Generadores, migraciones y agentes muestran qué cambiarán, no sobrescriben trabajo sin
consentimiento y producen pruebas y trazabilidad junto con el código.

### M-14. La sencillez es una decisión técnica

COBRIA no exige todas sus partes en todos los proyectos. Se adopta el nivel mínimo que
controle el riesgo real; la complejidad añadida debe demostrar un beneficio.

### M-15. Las afirmaciones tienen límites

Un resultado local no demuestra comportamiento distribuido. Una prueba automática no
equivale a validación humana. Un caso de referencia no demuestra universalidad. Los
resultados negativos y las amenazas a la validez también se conservan.

## Regla de decisión COBRIA

Antes de introducir un componente, el equipo responde:

1. ¿Qué problema observable resuelve?
2. ¿Quién es responsable y quién puede cambiarlo?
3. ¿Qué dato o contrato consume y produce?
4. ¿Qué frontera de ámbito, seguridad o privacidad aplica?
5. ¿Cómo se prueba el comportamiento correcto y el rechazo incorrecto?
6. ¿Cómo se observa, recupera, migra y retira?
7. ¿Qué alternativa más simple se descartó y por qué?

Si una respuesta importante permanece desconocida, la decisión queda como propuesta,
no como práctica aprobada.

## Niveles de obligación

| Palabra | Significado |
|---|---|
| **DEBE / NO DEBE** | requisito obligatorio dentro del documento normativo que la utiliza |
| **DEBERÍA / NO DEBERÍA** | recomendación fuerte; una excepción requiere justificación |
| **PUEDE** | opción permitida, nunca requisito implícito |
| **Propone** | idea pendiente de aceptación o evidencia |
| **Observa** | hallazgo contextual que no se generaliza automáticamente |

Estas palabras solo crean conformidad cuando aparecen en una especificación normativa.
En el libro y los manuales expresan orientación pedagógica.

## Lo que COBRIA no promete

COBRIA no garantiza por sí sola rendimiento, seguridad, disponibilidad, cumplimiento
legal, corrección de un modelo de IA ni éxito comercial. Tampoco reemplaza análisis de
dominio, pruebas en infraestructura real, revisión profesional, evaluación ética o
decisiones humanas responsables.

## Adopción responsable

El material puede estudiarse, adaptarse y aplicarse de acuerdo con la licencia del
repositorio. Quien lo adopta debe comprobar su contexto, tecnologías, obligaciones
legales y amenazas. La conformidad con COBRIA Core se declara únicamente al superar el
conjunto de requisitos y pruebas correspondiente; utilizar una recomendación del libro
no constituye certificación.

