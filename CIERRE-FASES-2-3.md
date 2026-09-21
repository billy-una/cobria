# Cierre de las fases 2 y 3 del Ecosistema COBRIA

**Fecha:** 21 de septiembre de 2026  
**Release objetivo:** `ecosistema-1.0.0`  
**Alcance:** Fundamentos, rutas de aprendizaje, Layers y aplicación neutral

## Fase 2. Fundamentos y rutas por nivel

### Ejecutado

- Se amplió Fundamentos desde una introducción breve hasta una ruta inicial completa.
- Se añadió un caso neutral de observaciones comunitarias que continúa en otros módulos.
- Se diferenciaron problema, requisito, regla, invariante, entidad, valor, dato, función,
  módulo, caso de uso, contrato, repositorio, adaptador, proyección, prueba y despliegue.
- Se añadió el primer contrato sin tecnología y un repositorio en memoria.
- Se incorporaron casos correctos, negativos, señales de alerta y laboratorio.
- Se crearon rutas para principiantes, desarrolladores, diseño de datos, IA y agentes.
- Se amplió la página web de Fundamentos con ejemplo, pruebas y criterio de avance.

### Puerta

La ruta puede seguirse sin conocer Core ni instalar un motor. El gate comprueba secciones,
conceptos y presencia pública. La evaluación con lectores reales corresponde a la fase
de transferencia; no se afirma ejecutada.

## Fase 3. Layers y estructura de proyectos

### Ejecutado

- Se ampliaron cinco capas: dominio, aplicación, presentación, infraestructura y composición.
- Se documentaron once responsabilidades comprobables.
- Se aclaró que Dater es terminología COBRIA para traducción física y no un patrón universal.
- Se separaron Object, Dater, Repository, UseCase, Service, Catalog, Indexer y Connector.
- Se añadió estructura de carpetas, dependencias prohibidas y ficha por archivo.
- Se añadió un procedimiento de migración incremental desde legado.
- Se creó una matriz de responsabilidades con entrada, salida, exclusión y prueba.
- Se extendió `architecture.yaml` con Catalog, Indexer y Connector.
- Se actualizó el auditor de imports y responsabilidades.
- Se amplió la página web de Layers.

### Puerta

El manifiesto contiene once roles, el auditor confirma la dirección de imports y la
aplicación neutral continúa superando sus pruebas. Las carpetas son una referencia, no
una obligación ceremonial.

## Verificación

```sh
make verificar-cierre-2-3
python3 replication/scripts/validate-phase5.py
cd replication/examples/ecosistema-app && npm test
cd sitio && npm run lint && npm test
```

No se alteró COBRIA Core ni evidencia experimental.
