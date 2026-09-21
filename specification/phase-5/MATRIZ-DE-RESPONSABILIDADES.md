# Matriz de responsabilidades COBRIA Layers

| Rol | Capa | Entrada | Salida | No posee | Prueba mínima |
|---|---|---|---|---|---|
| Object | dominio | valores | entidad/valor válido | persistencia | invariantes |
| UseCase | aplicación | entrada/contexto | resultado estable | HTTP/SDK | éxito y rechazo |
| Service | dominio/aplicación | colaboradores | política coordinada | utilidades arbitrarias | regla entre objetos |
| Catalog | dominio/dato gobernado | código/versión | significado | texto de UI | versión desconocida |
| Repository | infraestructura tras puerto | identidad/ámbito | agregado | estados UI | contrato por adaptador |
| Dater | infraestructura/datos | objeto/documento | traducción | autorización | ida y vuelta |
| Connector | infraestructura | solicitud técnica | respuesta normalizada | regla de negocio | fallo de red |
| Indexer | infraestructura/proyección | fuentes | derivado candidato | autoridad | equivalencia |
| Controller | presentación | protocolo | respuesta visible | consulta directa | traducción de errores |
| Registry | composición | implementaciones | grafo | localización oculta | sustitución |
| Composition Root | composición | configuración | aplicación | reglas nuevas | configuración inválida |

La tabla clasifica responsabilidades, no impone una clase por fila. Dos roles pueden
compartir archivo si sus fronteras siguen visibles y comprobables.
