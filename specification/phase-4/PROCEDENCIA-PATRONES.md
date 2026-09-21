# Procedencia y neutralización de patrones de nodos

## Fuentes observadas

| Repositorio | Evidencia observada | Generalización permitida |
|---|---|---|
| [BSHandball](https://github.com/billy-una/BSHandball) | `diccionario de datos.txt` usa `nX`, `snX`, `lX` para fuentes, relaciones, índices, vistas, auditoría, IA y nodos operativos | la numeración necesita diccionario, dueño y clasificación; no define semántica universal |
| [CRMHotel](https://github.com/billy-una/CRMHOTEL) | referencia declarada para Daters, servicios, catálogos y capas | separar traducción física, acceso y coordinación; requiere congelar archivos/SHA en fase 0 |
| [POS Guápiles](https://github.com/billy-una/posguapiles) | referencia declarada para operación, inventario, índices y ambientes | modelar movimientos, balances e índices con autoridades distintas; requiere congelar archivos/SHA en fase 0 |

La fase 4 no copia modelos de negocio. Usa un caso ficticio de observaciones ambientales
para convertir tensiones repetidas en decisiones neutrales. Los commits completos y las
licencias continúan pendientes del cierre de fase 0; por ello estas fuentes son
antecedentes observados, no evidencia de universalidad.

## Adaptaciones COBRIA

- clasificar cada nodo como canónico, embebido, referencia, outbox, proyección o corte;
- declarar autoridad de escritura y reconstruibilidad por separado;
- incluir ámbito en rutas, índices, trabajo de fondo y pruebas negativas;
- exigir costo y retiro para derivados;
- impedir que el número físico sustituya el nombre lógico.

