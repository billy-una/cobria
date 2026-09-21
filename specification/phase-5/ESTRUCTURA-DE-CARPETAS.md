# Estructura de carpetas y ficha por archivo

## Árbol recomendado

```text
src/
├── domain/
│   ├── entities/
│   ├── values/
│   ├── policies/
│   └── errors/
├── application/
│   ├── use-cases/
│   ├── ports/
│   ├── contracts/
│   └── services/
├── presentation/
│   ├── controllers/
│   ├── presenters/
│   └── views-or-routes/
├── infrastructure/
│   ├── data/
│   │   ├── daters/
│   │   ├── repositories/
│   │   ├── providers/
│   │   └── migrations/
│   ├── integrations/
│   ├── observability/
│   └── security/
└── composition.(js|ts|py|java|go)
```

No es obligatorio crear carpetas vacías. En proyectos grandes se puede repetir este
árbol dentro de módulos verticales, siempre que las dependencias conserven la dirección.

## Ficha obligatoria para archivos relevantes

| Campo | Pregunta |
|---|---|
| Propósito | ¿Qué única responsabilidad justifica este archivo? |
| Capa | ¿Qué tipo de conocimiento puede contener? |
| Entrada/salida | ¿Qué contrato recibe y produce? |
| Dependencias | ¿Qué importa y por qué está permitido? |
| Datos | ¿Qué entidades, nodos o catálogos toca? |
| Seguridad | ¿Qué actor, capacidad y ámbito aplican? |
| Fallos | ¿Qué errores estables puede producir? |
| Pruebas | ¿Qué comportamiento y caso negativo lo cubren? |
| Responsable | ¿Quién revisa su evolución? |

## Ubicación de artefactos

| Artefacto | Capa | Señal de mala ubicación |
|---|---|---|
| entidad/valor | dominio | importa SDK o traduce JSON físico |
| caso de uso | aplicación | recibe `request/response` o forma rutas |
| puerto | aplicación | expone tipos del proveedor |
| Dater | infraestructura/datos | autoriza usuario o coordina transacción completa |
| repositorio | infraestructura/datos | contiene estados de UI o reglas no delegadas |
| controlador | presentación | consulta base directamente |
| catálogo de dominio | dominio o dato gobernado | constante duplicada en pantallas |
| configuración de proveedor | composición/infraestructura | leída desde dominio |
| factory/composición | raíz de composición | contiene reglas del negocio |

## Migración incremental desde legado

1. medir y congelar crecimiento del área heredada;
2. seleccionar un flujo, no toda la aplicación;
3. escribir una prueba de caracterización;
4. nombrar entrada, resultado y errores;
5. extraer regla de dominio;
6. declarar puerto desde aplicación;
7. envolver proveedor en adaptador y Dater;
8. conectar en composición;
9. conservar fachada temporal;
10. eliminar la fachada cuando no tenga consumidores.

