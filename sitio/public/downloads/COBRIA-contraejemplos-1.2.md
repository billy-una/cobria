# Contraejemplos COBRIA 1.2

## C1. Proyección editable

**Error:** una interfaz corrige directamente el índice de búsqueda. **Efecto:** nadie sabe si manda el expediente o el índice. **Corrección:** cerrar esa escritura y emitir un comando al repositorio canónico. Viola AUT-001.

## C2. Ámbito añadido al final

**Error:** recuperar por similitud y después filtrar organización. **Efecto:** cachés, conteos o trazas pueden revelar candidatos ajenos. **Corrección:** aplicar ámbito antes de recuperar. Viola SCP-001 y SEC-001.

## C3. Revisión obsoleta

**Error:** aceptar revisión 2 después de publicar revisión 3. **Efecto:** regresión silenciosa. **Corrección:** condición monotónica y registro del rechazo. Viola REV-001.

## C4. Índice vectorial sin manifiesto

**Error:** reemplazar incrustaciones sin registrar modelo, corpus o corte. **Efecto:** resultados imposibles de reproducir. **Corrección:** nueva versión con fuentes y huellas. Viola PRV-001 y ANA-001.

## C5. Conjunto con fuga temporal

**Error:** barajar antes de separar entrenamiento y prueba cuando el futuro influye en variables. **Efecto:** evaluación optimista. **Corrección:** partición temporal congelada y prueba negativa. Viola ANA-001.

## C6. Reconstruir desde la copia dañada

**Error:** completar una proyección corrupta usando sus propios datos. **Efecto:** propagar corrupción. **Corrección:** reconstruir desde fuentes canónicas y catálogos declarados. Viola REC-001.

## C7. Publicación que vacía lectores

**Error:** borrar la colección activa antes de generar la nueva. **Efecto:** indisponibilidad y mezcla parcial. **Corrección:** candidata separada, verificación y alias. Viola PUB-001.

## C8. IA que siempre responde

**Error:** generar aunque no haya evidencia autorizada. **Efecto:** afirmaciones plausibles sin respaldo. **Corrección:** umbral y abstención útil. Viola AI-001.

