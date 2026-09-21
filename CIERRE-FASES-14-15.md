# Cierre de las fases 14 y 15

**Estado:** cierre automático aprobado; publicación y comprobaciones humanas se registran por separado.  
**Edición:** Ecosistema COBRIA 1.0, propuesta independiente.  
**Fecha:** 21 de septiembre de 2026.

## Fase 14 — cierre editorial

Se eliminó la idea de que un único PDF debía cumplir simultáneamente las funciones de
libro, taller y expediente técnico. La entrega canónica queda dividida en:

| Producto | Responsabilidad | Archivo canónico |
|---|---|---|
| Libro pedagógico | explicación, analogías, patrones, casos y ejemplos | `output/pdf/COBRIA-ecosistema-manual-completo.pdf` |
| Cuaderno de trabajo | estaciones, ejercicios y rúbrica de práctica | `output/pdf/COBRIA-cuaderno-de-trabajo.pdf` |
| Anexo técnico | trazabilidad del programa experimental | `output/pdf/COBRIA-anexo-tecnico.pdf` |
| Artículo | contribución científica y resultados acotados | `output/pdf/COBRIA-articulo-cientifico-actualizado.pdf` |
| Documento maestro | desarrollo metodológico integral | `output/pdf/COBRIA-documento-maestro-ecosistema.pdf` |
| Especificación | alcance, términos normativos y conformidad | `output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf` |

La construcción se ejecuta con `make construir-editorial`. Los seis archivos fueron
renderizados página por página y revisados mediante hojas de contacto, además de una
inspección ampliada de portada, páginas con ilustraciones y cierres. No se detectaron
páginas vacías, imágenes deformadas, recortes ni desbordamientos evidentes.

La revisión visual realizada no equivale a corrección profesional, revisión académica
independiente ni certificación de accesibilidad PDF. Esas tareas continúan requiriendo
personas con la autoridad y el perfil correspondientes.

## Fase 15 — sitio público coherente

La aplicación integra ahora:

- inicio del ecosistema y acceso a sus manuales;
- explorador de treinta patrones por texto, familia y nivel;
- mapa de relaciones entre módulos;
- laboratorio interactivo de ocho pasos;
- página específica de Core 1.0;
- fichas pedagógicas con código copiable y aviso personalizado;
- recursos canónicos, historia, privacidad y evidencia;
- metadatos Open Graph, Twitter, URL canónica y datos Schema.org;
- `sitemap.xml`, `robots.txt` y `llms.txt`;
- navegación adaptable, controles propios, contraste y enlace para saltar al contenido.

Los marcadores de publicidad se retiraron de la aplicación: no se reservará espacio ni
se cargará publicidad hasta disponer de una integración, consentimiento y política
adecuados. Los recursos históricos se conservan fuera del conjunto canónico.

## Puerta reproducible

La orden siguiente comprueba la presencia, metadatos y rango de páginas de los seis PDF,
las seis descargas, las rutas principales, el catálogo versionado, el sitemap y la
ausencia de marcadores publicitarios en la aplicación:

```bash
make verificar-cierre-14-15
```

Las pruebas del sitio se ejecutan además con:

```bash
cd sitio
npm run lint
npm test
```

## Límites y pendientes humanos

Este cierre no declara que COBRIA sea un estándar, una certificación ni una propuesta
completamente novedosa. Tampoco reemplaza revisión editorial independiente, validación
externa, estudio de transferencia con consentimiento, auditoría jurídica, evaluación
profesional de accesibilidad ni aprobación institucional. Cualquier afirmación futura
de ese tipo debe incorporar evidencia emitida por personas reales y conservar su
procedencia.
