# Integración COBRIA Data y Core

## Separación de autoridad

Data enseña decisiones de modelado y operación. Core define obligaciones solo cuando una
implementación declara conformidad sobre canónicos y derivados documentales NoSQL.

## Flujo de conformidad

```text
diccionario lógico
  → nodo y contrato físico
  → Dater
  → puerto de adaptador
  → adaptador documental
  → P1, P2, R1, S1 y A1
  → informe con alcance y limitaciones
```

## Adaptadores disponibles

| Adaptador | Uso | Dependencia | Estado responsable |
|---|---|---|---|
| LokiJS | ejecución local en memoria/archivo | paquete local | funcional, no distribuido |
| PouchDB | ejecución documental local | paquete local | funcional, no equivale a CouchDB remoto |
| MongoDB | integración real | servicio MongoDB | requiere ejecución registrada |
| CouchDB | integración real | servicio HTTP CouchDB | requiere ejecución registrada |
| OpenSearch | índice/proyección documental | servicio OpenSearch | no sustituye autoridad canónica |

El número de adaptadores implementados no prueba portabilidad por sí solo. Cada motor
necesita contrato, versión, configuración, resultados y amenazas documentadas.

## Declaración permitida

Un informe local puede declarar “C1/C2/C3 funcional en este arnés y configuración”. No
puede declarar certificación, seguridad de producción, superioridad o validación externa.
