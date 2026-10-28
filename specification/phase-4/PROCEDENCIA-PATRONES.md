# Procedencia y neutralización de patrones de nodos

## Fuentes observadas

| Repositorio | Evidencia observada | Generalización permitida |
|---|---|---|
| [BSHandball](https://github.com/billy-una/BSHandball), `09c15acd14ab806abe436a8176ef3247c61a2df6` | `diccionario de datos.txt` usa `nX`, `snX`, `lX` para fuentes, relaciones, índices, vistas, auditoría, IA y nodos operativos | la numeración necesita diccionario, dueño y clasificación; no define semántica universal |
| [CRMHotel](https://github.com/billy-una/CRMHOTEL), `b7b0f8e83871df1220865931f53424d8dd39772c` | Daters, servicios, catálogos y capas | separar traducción física, acceso y coordinación |
| [POS Guápiles](https://github.com/billy-una/posguapiles), `ae8d63ce535ecff40059b49d8b8c9f050c353d96` | operación, inventario, índices y ambientes | modelar movimientos, balances e índices con autoridades distintas |

La fase 4 no copia modelos de negocio. Usa un caso ficticio de observaciones ambientales
para convertir tensiones repetidas en decisiones neutrales. Los commits completos y las
huellas están congelados por las fases 21–25. Ninguno de los tres commits declara una
licencia pública raíz: se observan en modo de solo lectura y no se copia ni relicencia su
código. Estas fuentes son antecedentes observados, no evidencia de universalidad.

## Adaptaciones COBRIA

- clasificar cada nodo como canónico, embebido, referencia, outbox, proyección o corte;
- declarar autoridad de escritura y reconstruibilidad por separado;
- incluir ámbito en rutas, índices, trabajo de fondo y pruebas negativas;
- exigir costo y retiro para derivados;
- impedir que el número físico sustituya el nombre lógico.
