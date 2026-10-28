# Prácticas individuales del currículo

El currículo compartido contiene 85 lecciones en 17 áreas. Se conservan las 25
prácticas con comando real de primeros pasos, fundamentos, arquitectura, capas y
datos. Las otras 60 tienen ahora una tarea específica de diseño, solución explicada
y rúbrica de artefacto; no se anuncian como sesenta implementaciones ejecutables.

La fuente `editorial/lesson-practice.mjs` incorpora ejercicios sobre la reserva,
colibríes, ámbito, errores, publicación, seguridad, operación, documentación e IA.
El generador añade prerrequisitos, vocabulario, fuentes, pasos, expectativa, error,
recuperación, ejercicio, solución y rúbrica a cada lección. Los comandos existentes
conservan directorio y resultado esperado. Las fuentes no requieren repositorios
privados ni credenciales.

El libro añade 85 páginas de ejercicio; la edición generada tiene 370 páginas.
La web incorpora las mismas tareas y oculta la solución detrás de un desplegable
accesible. `replication/tests/pc6-curriculum.test.mjs` comprueba las 85 estructuras,
unicidad de ejercicios y existencia de fuentes. El test renderizado del sitio recorre
las 85 rutas y compara ejercicio y solución con el currículo.

`replication/scripts/review-pc6.mjs` comprueba geometría de las 85 páginas nuevas:
sin desbordamiento y tipografía nominal de 10 puntos. El primer intento detectó
redondeo de conversión CSS a 9,999975 puntos; se añadió tolerancia de 0,01 puntos,
sin reducir la fuente. Las capturas y el informe quedan en `output/review/pc6/`.

Este avance satisface cobertura de tareas, no validez pedagógica externa. Algunas
rúbricas y recuperaciones comparten estructura y requieren revisión con lectores;
sus respuestas no constituyen certificación. No se declara comprensión por
principiantes ni cierre científico dependiente de PC4. El estudio humano es PC9.

## Verificación de esta entrega

`make verificar COBRIA_SITE_ISOLATED=1` terminó correctamente tras corregir una
regla de lint en el nuevo test de rutas. La réplica pasó 182 pruebas; la aplicación
integral, 17. El sitio se instaló, construyó y probó en una copia temporal, no en
un clon Git limpio ni mediante publicación. El registro completo se conserva en
`output/review/pc6/verificacion-general.log`.

Maestro y artículo compilaron con bibliografía resuelta, con 199 y 15 páginas.
El validador editorial 14–15 comprobó los seis PDF y sus descargas; las nuevas
páginas de ejercicios y el capítulo científico modificado se renderizaron e
inspeccionaron. El libro conserva 370 páginas, el cuaderno 35 y el anexo 16.
Esto no constituye una inspección humana exhaustiva de todas las páginas.
