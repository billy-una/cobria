# Repositorios de referencia y procedencia

Estos repositorios son fuentes empíricas y ejemplos de ingeniería usados para observar estructuras recurrentes. No implican que COBRIA haya inventado cada patrón ni que todo su código forme parte de la especificación.

| Repositorio | Enlace Git | Uso en COBRIA |
|---|---|---|
| COBRIA | [billy-una/cobria](https://github.com/billy-una/cobria) | Especificación, investigación, artículo, documento maestro, libro, implementación y resultados. |
| BSHandball | [billy-una/BSHandball](https://github.com/billy-una/BSHandball) | Datos deportivos fechados, servicios, catálogos, eventos, analítica y evolución arquitectónica. |
| CRMHotel | [billy-una/CRMHOTEL](https://github.com/billy-una/CRMHOTEL) | Capas, operación hotelera, documentos, servicios, Daters, catálogos y responsabilidades. |
| POS Guápiles | [billy-una/posguapiles](https://github.com/billy-una/posguapiles) | Inventario, ventas, operación comercial, consistencia y flujos de aplicación. |
| BIOSVA | [billy-una/BIOSVA](https://github.com/billy-una/BIOSVA) | Nodos `nX/snX/lX`, atributos compactos, Functions, capacidades, auditoría, seguridad y gobierno. |

## Estado local observado

| Repositorio | Rama local | Commit observado |
|---|---|---|
| COBRIA | `main` | `0c2b747` |
| BSHandball | `codex/inventory-production-cutover-20260907` | `11625980` |
| CRMHotel | `main` | `d57d388d` |
| POS Guápiles | `main` | `c61c37577d6c50ec02fc038394f8fffbcd13286c` (20 de septiembre de 2026) |
| BIOSVA | `main` | `2a68195` |

Estos SHA describen el checkout local auditado, no garantizan por sí solos la última
versión del remoto. Antes de publicar evidencia se debe ejecutar `git fetch`, registrar
el SHA completo y comprobar licencia y ruta exacta.

El sitio interactivo se mantiene localmente en `COBRIA-atlas` y actualmente utiliza un
remoto privado de publicación de Sites. No se presenta como repositorio público GitHub.

## Registro mínimo de una observación

```yaml
repository: https://github.com/billy-una/BIOSVA
commit: <sha-verificado>
path: docs/architecture/arquitectura-nosql-v11.md
observedElement: ownership de nodos por módulo
classification: evidencia estructural
adaptation: regla neutral propuesta para COBRIA
limitations: un proyecto no demuestra validez universal
```

## Separación editorial

- **Especificación:** contratos neutrales sin nombres de proyectos.
- **Artículo:** perfiles anonimizados y método de observación.
- **Documento maestro:** trazabilidad metodológica detallada.
- **Libro:** ejemplos pedagógicos neutrales inspirados en problemas recurrentes.
- **Sitio:** enlaces públicos sin datos sensibles ni credenciales.

## Versiones reproducibles

Antes de una publicación formal se debe congelar un commit de cada repositorio utilizado. Una URL a `main` facilita navegar, pero no conserva el estado observado. El manifiesto de réplica debe registrar SHA, fecha, archivos incluidos y licencia comprobada.
