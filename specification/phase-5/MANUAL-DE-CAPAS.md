# Manual COBRIA de capas y responsabilidades

## Objetivo

Las capas hacen explícita la dirección del conocimiento. No buscan aumentar carpetas,
sino evitar que el dominio conozca la pantalla, que un controlador posea transacciones o
que una base de datos decida reglas de negocio.

## Regla principal

```text
Presentación ──> Aplicación ──> Dominio
Infraestructura ──> Aplicación y Dominio
Composición ──> todas, únicamente para conectarlas
```

La aplicación define las capacidades que necesita. Infraestructura las implementa. El
dominio permanece en el centro y no importa detalles externos.

## Dominio

Contiene entidades, objetos de valor, políticas, estados y errores de dominio. Una
entidad protege invariantes incluso si se crea desde una API, una migración o una prueba.

No debe conocer HTTP, HTML, Firebase, MongoDB, CouchDB, rutas `nX`, variables de entorno,
archivos ni relojes globales. Cuando necesita tiempo, identidad aleatoria o una política
externa, recibe el valor o utiliza una capacidad declarada por aplicación.

## Aplicación

Un caso de uso representa una intención: registrar, verificar, reconstruir, retirar. Su
entrada y resultado son estables. Coordina dominio y puertos, delimita la transacción y
comprueba autorización antes de tocar recursos.

Un puerto describe lo que aplicación necesita (`guardar`, `listar`, `publicar`), no la
API completa de un proveedor. No debe contener rutas físicas ni tipos del SDK.

## Presentación

Un controlador transforma solicitud, evento o interacción en una entrada de caso de uso
y convierte el resultado en una respuesta. Valida forma de protocolo, no invariantes de
dominio. Distingue carga, éxito, vacío, conflicto, acceso denegado y fallo inesperado.

La presentación nunca forma consultas de base de datos ni escribe nodos directamente.

## Infraestructura

Implementa puertos mediante memoria, red, archivos, MongoDB, CouchDB, Firebase u otro
proveedor. Aquí viven SDK, autenticación técnica, reintentos, serialización, métricas,
relojes y criptografía.

### Dater

Traduce entre objeto lógico y documento físico. Conoce `n8`, `a`, `b`, `c`, versiones y
migraciones. Valida la forma de persistencia y llama al constructor de dominio cuando
corresponda. No consulta, autoriza ni decide el flujo.

### Repositorio

Encapsula identidad, ámbito, consultas, revisión y unidad de persistencia. Usa el Dater y
el proveedor. No decide estados de interfaz ni inventa reglas de negocio.

### Servicio

Un servicio de dominio coordina una política sin dueño natural entre objetos. Un servicio
de aplicación puede encapsular una capacidad transversal. “Service” no debe convertirse
en una carpeta de funciones sin responsabilidad.

## Composición

La raíz de composición selecciona implementaciones, lee configuración y construye el
grafo. Es el único lugar que debería decir “este puerto usa MongoDB” o “esta huella usa
SHA-256”. Las dependencias son parámetros visibles, no servicios globales ocultos.

## Flujo completo

```text
solicitud
  → controlador
  → caso de uso
  → entidad/política
  → puerto repositorio
  → adaptador repositorio
  → Dater
  → proveedor NoSQL
```

La lectura vuelve en sentido inverso. Cada frontera traduce su propio lenguaje y conserva
errores estables.

## Cuándo simplificar

Un programa pequeño puede combinar archivos, pero no responsabilidades. Puede existir un
solo archivo con dominio y caso de uso si las fronteras siguen claras; no necesita una
interfaz por cada función. Extraiga una capa física cuando exista cambio independiente,
proveedor sustituible, prueba aislada o riesgo que controlar.

