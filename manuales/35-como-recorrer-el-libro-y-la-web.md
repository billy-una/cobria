# Cómo recorrer el libro y la web

COBRIA se puede aprender por partes. Comience con una observación ficticia de la reserva,
explique su regla y compruebe un caso permitido y uno rechazado. Después añada las
responsabilidades que necesite, sin desplegar infraestructura para leer una primera lección.

Responsable: Billy Jak Cordero Porras. Edición local 0.1.0, propuesta independiente.
Revisar al cambiar el currículo, los ejemplos o las rutas del sitio. La fuente común
de orientación y repaso es `editorial/c10/reader-guide.json`.

## Elegir una entrada

Si está comenzando, abra `/comenzar` y continúe por fundamentos, arquitectura, capas
y datos. El primer caso funciona en memoria. La persistencia real local está en el
taller de `/construir`; no confunda ambos alcances.

Si ya programa, puede consultar código, datos, API, seguridad y construcción según
su necesidad. Para mantener un sistema, revise documentación, calidad, operaciones
y herramientas. Para analítica e IA, comprenda antes datos, autoridad, cortes y procedencia.
Las cuatro rutas son atajos de consulta, no requisitos de un curso ni garantías de dominio.

El libro abre con el mapa de sus diecisiete partes y una guía de lectura. La web
presenta esas mismas partes y permite abrir cada lección por separado. Use el índice
«En esta parte» para saltar a una lección y el enlace de regreso para revisar lo anterior.

## Buscar un tema

En `/explorar`, escriba `ambito`: debe encontrar los mismos resultados que con `ámbito`.
Puede combinar palabras, por ejemplo `pouchdb disco`, y seleccionar el tipo «Taller».
El resultado conduce al recorrido de persistencia local; leer la web no abre una base
ni registra datos en el sitio público.

El índice reúne lecciones, patrones, laboratorios, prácticas y cinco talleres. La
búsqueda es textual, no semántica: si no encuentra algo, use una palabra más general,
quite el filtro o vuelva a la guía. «Limpiar búsqueda» restablece los resultados y
devuelve el foco al campo. Las consultas no se envían a un proveedor de IA.

## Distinguir qué se puede ejecutar

Un **contrato orientativo** muestra una idea o regla. Un **fragmento de lectura guiada**
puede depender de otros tipos y funciones. Ninguno implica que copiar unas líneas
produzca una aplicación completa.

Cuando exista una práctica verificable, siga su directorio, requisitos, comando y
resultado esperado. En los patrones impresos cada lenguaje tiene espacio propio y
un enlace a su fuente y prueba. Hay referencia TypeScript para los treinta patrones;
los otros lenguajes aparecen únicamente donde existe una prueba correspondiente.

Si el navegador no permite copiar, el botón debe explicarlo: seleccione el código
y cópielo manualmente. No interprete una confirmación visual como prueba de que el
código funciona; ejecútelo en el proyecto y ambiente indicados.

## Practicar y comprobar

Al finalizar cada parte, responda la pregunta de repaso antes de desplegar la
respuesta orientativa. Explique qué entrada usaría y qué rechazo esperaría. Después
complete un laboratorio relacionado y conserve entrada, comando, salida y límite.

El libro impreso muestra las respuestas completas porque el papel no permite
desplegarlas. En HTML y en la web se abren con un control de detalles. Una respuesta
orientativa no es la única solución posible ni una calificación automática.

## Leer las ilustraciones y los límites

Las imágenes de naturaleza ayudan a recordar una responsabilidad; no sustituyen un
contrato ni representan componentes reales del motor. Una leyenda explica qué relación
importa. El recorte artístico de portada tiene otro propósito que una figura técnica.

La revisión local comprueba carga, texto alternativo, enlaces, tamaño de código y
distribución de secciones. Las pruebas de navegador y las muestras visuales no
certifican accesibilidad con tecnologías de apoyo ni comprensión por principiantes.
Esa evaluación con personas sigue separada en C13. C11 conserva la reconciliación
científica del maestro, la especificación y el artículo.

## Revisar después de editar

Desde la raíz, con Node.js y las dependencias editoriales instaladas:

```sh
make verificar-c10
node replication/scripts/review-reader-c10.mjs
```

El segundo comando requiere Playwright y Chromium disponibles. Revisa el HTML
generado con respuestas abiertas y geometría de impresión; guarda un informe en
`output/review/c10/`. No equivale a una lectura manual de todas las páginas del PDF.
Renderice las páginas afectadas y revise la web en un navegador antes de entregar.
