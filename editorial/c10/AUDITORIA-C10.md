# Revisión del libro y la web

Responsable: Billy Jak Cordero Porras. Fecha: 2026-10-18.
Estado: revisión local asistida; no revisión independiente ni estudio con lectores.
Alcance: currículo de diecisiete partes, libro HTML/PDF y sitio local. Core 1.0,
resultados científicos y ZIP RC2 se conservan sin cambios.

## Hallazgos y correcciones

| Hallazgo observado | Cambio | Comprobación |
| --- | --- | --- |
| La búsqueda distingue acentos y no incluye los cinco talleres C5–C9 | Normalización y un índice textual compartido | `replication/tests/c10-reader.test.mjs` |
| El mapa de contenidos usa `/aprender/{módulo}`, que no es la ruta canónica de una parte | Generación con `module.route` | Prueba de las diecisiete correspondencias |
| Las personas deben recorrer páginas largas sin un índice de lecciones | Índice interno y regreso a la parte anterior | HTML renderizado y prueba de navegador |
| Los fragmentos orientativos pueden parecer programas completos | Tipo de código visible en las 85 lecciones | Conteos y HTML de módulos/lecciones |
| No existe una pregunta de repaso común en cada apertura | Diecisiete preguntas y respuestas compartidas | Registro de cobertura y renderizado |
| El código impreso usa 6,7 puntos y baja a 5,2 en ejemplos bilingües | 9 puntos y una página por lenguaje | Geometría y muestras PDF |
| La ampliación hace crecer algunas páginas al abrir respuestas | Mapa en dos páginas y ajustes de distribución sin reducir el cuerpo | Informe previo conservado y geometría final |
| El botón de copiar no maneja rechazo del portapapeles | Mensaje de recuperación, sin confirmar una copia fallida | Prueba interactiva con permiso denegado |
| El mapa web conserva rótulos ingleses de áreas | Nombres en español, preservando nombres propios | Inspección del mapa renderizado |
| La prueba interactiva no reconoce el nombre exacto del selector | Etiqueta explícita «Tipo» | Selección por nombre accesible y teclado |
| El manual se ensancha en móvil por el mínimo intrínseco del código | Columna con mínimo cero y contenido acotado | Navegador a 390 píxeles, sin desbordamiento horizontal |

Se distingue material generado de fuente editorial: no se editan `curriculum.json`
ni el libro HTML a mano. Las cuatro rutas de entrada y los repasos proceden de
`reader-guide.json`. La lectura de una imagen no crea un nuevo requisito Core.

## Evidencia y límites

`make verificar-c10` comprueba búsqueda, rutas, cobertura y estructura. La revisión
geométrica abre las respuestas, verifica las imágenes y comprueba enlaces internos,
IDs y tamaño del código. El informe anterior a corregir la paginación se conserva
en `output/review/c10/book-geometry-before-pagination.json`.

La revisión visual es por muestras de páginas afectadas, no una lectura humana de
todo el libro. La búsqueda no demuestra relevancia semántica y los repasos no prueban
transferencia. El PDF no se declara certificado o validado con tecnologías de apoyo.
La comprensión por lectores y la revisión externa permanecen pendientes.

Al finalizar las pruebas se observaron mensajes `ERR_STREAM_UNABLE_TO_PIPE` del
servidor local Vinext. Las catorce comprobaciones de página pasaron, pero no se aisló
la causa de esos flujos cerrados. Se conserva como seguimiento de ejecución y
portabilidad para C12, no como una certificación de operación del servidor.
