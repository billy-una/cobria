# Catálogos y migraciones de datos

## Catálogo versionado

Un catálogo COBRIA declara identificador, versión, responsable, vigencia, valores,
sustituciones y política para desconocidos. El código solo no conserva significado:
`AVE-003` requiere saber qué edición lo interpretó.

Políticas permitidas para desconocidos:

- **rechazar:** cuando el dato inválido no debe entrar;
- **cuarentena:** conservar entrada aislada para resolución;
- **mapear a desconocido:** solo si el dominio acepta pérdida explícita de precisión;
- **aceptar provisional:** exige estado, responsable y fecha de resolución.

No se debe cambiar el significado de un código publicado. Se crea una nueva versión y se
declara sustitución o migración.

## Plan de migración del ejemplo

### Esquema 1 → 2

**Cambio:** añadir `catalogoVersion` (`g`).  
**Precondición:** la versión aplicable puede determinarse por fecha y manifiesto
congelado.  
**Transformación:** resolver edición, validar `especieCodigo` y escribir `g`.  
**Caso incierto:** enviar a cuarentena; no elegir la versión más reciente por defecto.  
**Poscondición:** todo documento v2 contiene una versión resoluble.  
**Reversión:** conservar respaldo/manifestación v1 y reporte de asignaciones.

### Esquema 2 → 3

**Cambio:** añadir `procedencia` (`i`) con tiempo conocido.  
**Precondición:** existe fuente confiable de auditoría o entrada.  
**Transformación:** construir `fuenteId`, `registradoEn` y `metodo`; minimizar datos
personales.  
**Caso incierto:** marcar procedencia histórica incompleta; no inventarla.  
**Poscondición:** documentos nuevos requieren procedencia completa y los históricos
declaran su limitación.  
**Reversión:** no eliminar la evidencia original; retirar solo el campo materializado.

## Procedimiento seguro

1. congelar versión, consulta, catálogo y conteo de entrada;
2. ejecutar simulación sin escritura;
3. separar válidos, inválidos y ambiguos;
4. escribir candidata o aplicar lotes idempotentes;
5. verificar identidad, ámbito, revisión, conteo y muestras semánticas;
6. publicar la nueva versión sin vaciar la activa;
7. conservar manifiesto, métricas, errores y decisión;
8. retirar la versión previa únicamente tras la ventana acordada.

## Compatibilidad

Un lector puede soportar varias versiones durante una ventana explícita. Un escritor
produce una sola versión actual. La migración ocurre en el Dater o en una herramienta
dedicada; las pantallas y reglas de dominio no interpretan `a`, `b`, `c` ni `n8`.

