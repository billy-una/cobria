# COBRIA Fundamentos

**Versión:** 1.0  
**Estado:** estable para la ruta inicial del Ecosistema 1.0  
**Audiencia:** personas que comienzan, agentes de IA y equipos que necesitan compartir lenguaje

## Resultado de aprendizaje

Al finalizar, el lector puede tomar una necesidad pequeña, distinguir datos y reglas,
escribir un contrato, ubicar responsabilidades y diseñar una prueba antes de escoger un
proveedor. No necesita conocer COBRIA Core ni una base de datos específica.

## De una necesidad a una responsabilidad

Una aplicación comienza con una decisión que alguien necesita tomar, no con una colección
o una pantalla. La secuencia mínima es:

1. describir actor, necesidad y resultado observable;
2. identificar reglas que siempre deben cumplirse;
3. modelar conceptos sin tecnología;
4. asignar cada responsabilidad a una capa;
5. diseñar entradas, resultados y errores;
6. elegir almacenamiento según consultas y garantías;
7. escribir pruebas antes de optimizar;
8. medir, desplegar, observar y poder regresar.

## Un ejemplo que crecerá con el lector

Una comunidad registra observaciones de aves para conocer qué especies aparecen en cada
zona. Una persona autorizada indica especie, cantidad, lugar y fecha. El sistema rechaza
cantidades imposibles, conserva el ámbito y evita duplicar una operación repetida.

> Como persona observadora autorizada quiero registrar un avistamiento en mi zona para
> que la comunidad consulte información confiable sin mezclar otros ámbitos.

### Criterios de aceptación

- una entrada válida recibe identidad y revisión;
- una cantidad menor que uno se rechaza;
- una persona sin acceso a la zona no puede leer ni escribir;
- repetir la misma operación no crea otra observación;
- el resultado indica éxito o un código de error estable.

## Vocabulario esencial

| Concepto | Pregunta práctica | Ejemplo neutral |
|---|---|---|
| Problema | ¿Qué situación necesita mejorar? | Registros dispersos que no pueden verificarse |
| Requisito | ¿Qué debe poder hacer una persona? | Registrar una observación |
| Regla de negocio | ¿Qué decisión pertenece al problema? | La cantidad debe ser positiva |
| Invariante | ¿Qué nunca puede quedar falso? | La revisión no retrocede |
| Entidad | ¿Qué mantiene identidad al cambiar? | Observación `obs-42` |
| Objeto de valor | ¿Qué se define por contenido? | Coordenada o cantidad |
| Dato | ¿Qué hecho se representa? | Especie y fecha |
| Función | ¿Qué transformación delimitada realiza? | Normalizar una fecha |
| Módulo | ¿Qué responsabilidad cohesiva reúne? | Registro de observaciones |
| Caso de uso | ¿Qué intención completa se ejecuta? | `RegistrarObservacion` |
| Contrato | ¿Qué entra, sale y puede fallar? | Entrada, resultado y errores |
| Repositorio | ¿Cómo accede la aplicación a entidades? | `guardar`, `buscarPorId` |
| Adaptador | ¿Cómo se conecta un proveedor? | MongoDB, CouchDB o memoria |
| Proyección | ¿Qué forma optimiza una lectura? | Resumen por especie y zona |
| Prueba | ¿Qué evidencia puede refutar un error? | Rechazar un ámbito contradictorio |
| Despliegue | ¿Cómo llega una versión a un ambiente? | Promover a staging |

## Diferencias que evitan errores

### Dato no es regla

`cantidad = 3` es un dato. “La cantidad debe ser positiva” es una regla. Si la regla solo
vive en un formulario, una API o importación puede ignorarla.

### Objeto no es documento físico

El objeto usa nombres comprensibles. El documento puede usar una forma compacta y
versionada. Un Dater traduce entre ambas; el dominio no habla con claves `a`, `b` o `n8`.

### Función no es caso de uso

Una función calcula o transforma. Un caso de uso completa una intención, coordina
responsabilidades y expresa fallos. No toda función merece una clase.

### Error esperado no es fallo inesperado

Entrada inválida, permiso denegado y revisión obsoleta tienen códigos estables. Una
desconexión es un fallo de infraestructura. El consumidor debe saber si corregir,
reintentar o solicitar ayuda.

## Primer contrato

```text
operación: registrarObservacion
entrada: id, ámbito, especie, cantidad, fecha
precondiciones: actor, capacidad, ámbito y cantidad positiva
resultado: observación con identidad y revisión 1
errores: entrada inválida, acceso denegado, conflicto de idempotencia
evidencia: caso válido, regla, aislamiento e idempotencia
```

## Primer diseño sin proveedor

```text
RepositorioObservaciones: guardar, buscarPorId
RegistrarObservacion: autorizar, construir entidad, guardar y responder
RepositorioMemoria: implementar el puerto para pruebas y aprendizaje
```

Comenzar con memoria permite comprender la decisión sin instalar una base. MongoDB o
CouchDB implementan después el mismo puerto sin cambiar el caso de uso.

## Pruebas antes de optimizar

| Caso | Entrada | Resultado esperado |
|---|---|---|
| feliz | observación válida y actor autorizado | revisión 1 |
| regla | cantidad 0 | `OBS_QUANTITY_INVALID` |
| seguridad | actor de otra zona | `ACCESS_DENIED` y cero escrituras |
| repetición | misma clave y contenido | mismo resultado, un documento |
| conflicto | misma clave y contenido diferente | `IDEMPOTENCY_CONFLICT` |

## Señales de alerta

- La pantalla escribe directamente en la base.
- Un objeto conoce rutas físicas del proveedor.
- Un servicio autoriza usando solo datos enviados por el cliente.
- La misma regla aparece en varios botones y endpoints.
- Una lista recupera un documento adicional por cada fila.
- Un error visible contiene trazas o secretos.
- Una prueba solo demuestra el caso feliz.
- Se crea una proyección antes de medir o considerar un índice.

## Laboratorio inicial

1. Escriba una necesidad sin mencionar tecnología.
2. Identifique actor, resultado y dos reglas.
3. Dibuje una entidad y un objeto de valor.
4. Defina entrada, resultado y tres errores.
5. Implemente un repositorio en memoria.
6. Pruebe caso feliz, regla y acceso denegado.
7. Explique qué cambiaría al sustituir memoria por una base documental.

**Criterio de avance:** otra persona puede leer el contrato, ejecutar las pruebas y
explicar dónde vive cada regla sin consultar al autor.

## Rutas siguientes

- Para separar responsabilidades: **COBRIA Layers**.
- Para persistencia: **COBRIA Data**.
- Para tensiones repetidas: **COBRIA Pattern Design**.
- Para aplicar el recorrido: **COBRIA Build**.
- Core aparece cuando autoridad, derivados o reconstrucción NoSQL requieren conformidad.
