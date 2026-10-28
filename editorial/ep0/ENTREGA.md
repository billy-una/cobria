# Línea base y alcance de la entrega pública

EP0 registra el punto de partida de libro, artículo, maestro y web sin corregirlos.
La primera meta elegida por el usuario el 19 de octubre de 2026 es una **candidata
educativa y un preprint con límites claros**. La decisión no autoriza despliegue,
release, cambios en Core, uso de secretos ni promoción estable.

## Fuentes de seguimiento

- `alcance.json`: decisión confirmada en chat, afirmaciones admitidas y excluidas.
- `incidencias.json`: veinte hallazgos con ubicación, prioridad, impacto, acción,
  responsable propuesto, dependencia, fase y criterio de aceptación.
- `productos.json`: ocho grupos de productos, sus fuentes y derivados, comprobaciones
  disponibles, brechas y cambios que invalidan una prueba anterior.

No se atribuye a ninguna persona externa haber aceptado un rol. Los responsables
son funciones propuestas. La matriz cubre los hallazgos de la auditoría, no garantiza
que no existan defectos adicionales. La descripción de dependencias complementa
`editorial/products.json`; no afirma ser un grafo exhaustivo de todos los imports.

## Registrar una captura

Desde la raíz del repositorio:

```sh
make verificar-ep0
make capturar-ep0
```

La captura guarda una carpeta nueva fechada en `output/review/ep0/`. No sobrescribe
una anterior ni crea un alias que confunda cortes. El programa no acepta otro dominio
ni rutas arbitrarias. Solo consulta anónimamente el sitio COBRIA y lee el repositorio.

El resultado incluye:

| Registro | Qué acredita | Qué no acredita |
|---|---|---|
| `FUENTES.json` | Rutas existentes de Git no ignoradas, tamaños y huellas; exclusiones y eliminaciones | Revisión de secretos o permiso para distribuir historia |
| `BASELINE.json` | HEAD, rama, cambios locales, seis PDF, metadatos, descargas y respuestas públicas fechadas | Árbol limpio, publicación aprobada, accesibilidad o calidad científica |
| `MANIFIESTO-DESCARGAS-LOCAL.json` | Copia exacta del manifiesto local del corte | Que el público reciba esos mismos archivos |
| `http/` | Bytes públicos de HTML, JSON y texto capturados, con huellas | Interacción del navegador o funcionamiento de código cliente |
| `RECIBO.json` | Integridad de los archivos guardados | Firma, identidad de revisor o validación externa |

Las descargas PDF remotas se recorren para calcular tamaño y SHA-256; no se guardan
copias adicionales. Las cabeceras conservadas se limitan a tipo, seguridad, caché y
ETag; se excluyen cookies y cabeceras de sesión. Un fallo de red, respuesta excesiva
o metadatos no disponibles deja la captura incompleta, no un éxito supuesto.

Un 404 observado es evidencia válida del defecto y no impide terminar la captura.
La comparación pública se hace contra las descargas locales, que pueden estar
optimizadas; no se compara por error el PDF de impresión con su versión web comprimida.

El SHA desplegado permanece **no acreditado** si el proveedor no lo expone de manera
verificable. Un título viejo o una huella distinta muestra divergencia, pero no identifica
por sí solo su causa: EP1 debe localizar si procede de archivo estático, caché o despliegue.

## Separación de evidencia anterior

Los recibos disponibles de las fases 16–18 se identifican por huella como antecedentes.
No se atribuyen sus aprobaciones al árbol actual. Si faltan, se registra su ausencia.
Las observaciones de maquetación y claridad de la auditoría siguen abiertas; EP0 no
repite una revisión visual ni inventa una evaluación con lectores.

No se modifican crudos, resultados históricos, congelamientos PC2, Core 1.0 ni PDF.
El programa de captura únicamente produce registros diagnósticos en su carpeta de salida.
La regeneración explícita del manifiesto de réplica, cuando cambian herramientas o pruebas,
identifica ese árbol de herramientas y no altera un paquete histórico.

## Cuándo queda cerrada EP0

1. La decisión de alcance conserva la respuesta auténtica del usuario.
2. Las veinte incidencias tienen acción o justificación y criterio de aceptación.
3. La matriz de productos identifica autoridad, fuente, derivado, prueba y límites.
4. Una captura real termina como `captura-completa-con-incidencias-no-corregidas`,
   con inventario y recibo; ningún fallo se interpreta como corrección.
5. Pasan las regresiones específicas y la verificación general del repositorio.

Cerrar EP0 significa **línea base registrada**, no productos listos. No cierra ninguna
de las veinte incidencias ni las puertas humanas o de publicación.

## Siguiente trabajo

EP1 utiliza la captura para diagnosticar la divergencia real y preparar reparación y
reversión. No debe desplegar con esta autorización. EP2 y EP6 pueden comenzar con
el recorrido pedagógico y la reconciliación científica sin esperar una publicación.
La decisión preliminar permite acotar el preprint a evidencia histórica; no permite
exagerarla ni dar PC3 por ejecutada. La versión estable mantiene sus requisitos separados.
