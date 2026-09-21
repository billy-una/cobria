# Caso completo COBRIA 1.2: observaciones del bosque

## Situación

Una red comunitaria registra observaciones de fauna. El expediente documental es la autoridad; un índice facilita búsquedas y un conjunto fechado alimenta análisis. El caso usa información ficticia y no representa una organización real.

## 1. Documento canónico

```json
{
  "id": "observacion-0042",
  "scope": "bosque-sur",
  "revision": 3,
  "schemaVersion": 2,
  "eventTime": "2026-08-24T14:10:00-06:00",
  "species": "colibri-garganta-fuego",
  "location": {"sector": "sendero-rio"},
  "status": "verificada"
}
```

La identidad no depende de colección o proveedor. `scope` participa en claves y consultas. Solo el repositorio canónico cambia reglas o estado.

## 2. Contrato de proyección

`K = <observaciones, indexarTexto@2, catalogoEspecies@7, bosque-sur, busqueda@4, 5min, mismaCobertura, reconstruirTotal, equipoDatos>`

La proyección contiene `sourceId`, `sourceRevision`, `scope`, versión de transformación, texto normalizado y huella. No acepta ediciones autoritativas.

## 3. Publicación inicial

La tarea construye `busqueda-candidate-v4`, compara cobertura contra la consulta congelada y cambia el alias activo únicamente si pasa. Los lectores nunca observan una colección vacía.

## 4. Fallo provocado

Se elimina la proyección activa. El documento canónico y el catálogo permanecen. La alerta registra versión ausente, responsable y punto de recuperación. No se intenta reconstruir desde una copia incompleta.

## 5. Reconstrucción

1. Congelar corte canónico y versiones.
2. Crear candidata separada.
3. Transformar cada documento de su ámbito.
4. Comparar conteo, identidades, revisiones y consulta semántica.
5. Repetir una muestra para comprobar idempotencia.
6. Publicar mediante alias.
7. Conservar manifiesto, duración, huellas y decisión.

## 6. Resultado observable

La búsqueda vuelve a producir las mismas observaciones autorizadas. La reconstrucción puede repetirse; una revisión 2 llegada tarde no reemplaza la revisión 3. Una consulta para `bosque-norte` devuelve cero documentos, sin revelar qué existe en `bosque-sur`.

## 7. Proyección analítica

El corte declara fuentes, ventana, catálogo, exclusiones, semilla, transformación y partición temporal. El conjunto de prueba comienza después del último tiempo de entrenamiento. Una nueva versión del catálogo produce otro conjunto, no una modificación silenciosa.

## 8. Recuperación para IA

El ámbito filtra candidatos antes de similitud. Cada fragmento conserva documento y revisión. Si no hay evidencia suficiente, la respuesta se abstiene y declara qué información falta sin mencionar documentos ajenos.

## 9. Evidencia final

- Manifiesto firmado o con huella.
- Resultado de P1, P2, R1, S1 y A1.
- Tiempos p50/p95/p99 y uso de recursos.
- Causa del fallo.
- Versión publicada.
- Procedimiento de retiro.

