# Auditoría editorial integral de COBRIA

**Fecha de corte:** 23 de septiembre de 2026  
**Estado:** candidata pública independiente; no estable, no oficial y no certificada  
**Alcance:** documento maestro, artículo, libro, cuaderno, anexo técnico, currículo y sitio

## Resultado

La brecha editorial detectada quedó corregida en las fuentes locales. COBRIA dispone de
una ruta pública única de 17 partes, 85 lecciones y 30 laboratorios. El libro y el sitio
consumen `editorial/curriculum.json`; `editorial/content-map.json` enlaza cada parte con
sus lecciones, laboratorios, fuentes, punto de control y ubicación pública.

Las fases internas de investigación no forman parte de la ruta de aprendizaje. Se
conservan en el anexo técnico. La especificación sigue siendo normativa; el artículo
presenta contribución y evidencia; el maestro conserva método; el libro y el sitio
enseñan; el cuaderno permite practicar.

## Productos reconstruidos

| Producto | Resultado local |
|---|---:|
| Libro integral | 231 páginas |
| Cuaderno de trabajo | 34 páginas |
| Artículo científico | 14 páginas |
| Documento maestro | 197 páginas |
| Anexo técnico | 16 páginas |
| Sitio | 24 rutas editoriales, 85 lecciones y 30 patrones indexables |

## Comprobaciones ejecutadas

- Currículo: 17 partes, cinco lecciones por parte, 85 lecciones y 30 laboratorios.
- Réplica: 87 pruebas aprobadas, cero fallos.
- Sitio: lint aprobado, construcción limpia y ocho pruebas de publicación aprobadas.
- Evidencia: R7 y R8 regeneradas y sincronizadas sin cambiar resultados.
- PDF: 492 páginas renderizadas e inspeccionadas; sin imágenes recortadas ni desbordes
  editoriales observados.
- Libro: no contiene el mapa heredado de once módulos ni las fases internas en el cuerpo
  pedagógico.

## Límites que permanecen abiertos

La corrección editorial no equivale a validación externa. Continúan pendientes los actos
que requieren autoridad o participación ajena: revisión humana independiente, estudio
con participantes y consentimiento, réplica por otra persona en otra computadora,
firma de release y depósito o publicación pública. Ninguno se completó ni se simuló en
esta auditoría.

## Reproducción

```bash
node editorial/build-curriculum.mjs
make construir-editorial
make sincronizar-descargas
make verificar
```

La publicación solo debe promoverse después de revisar los bloqueadores declarados por
la fase 36 y confirmar de forma humana el contenido, las licencias y el destino público.
