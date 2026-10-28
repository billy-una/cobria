# Aplicación de referencia COBRIA

El [recorrido por capas C3](../../../manuales/28-arquitectura-y-capas-paso-a-paso.md)
continúa el mismo registro y admite un repositorio inyectado en `crearAplicacion`.
Desde la raíz: `node replication/examples/ecosistema-app/src/demo-capas.mjs`.
La variante documental usa Map y Dater v1: no es otro motor ni un despliegue remoto.

El [taller de datos C2](../../../manuales/27-datos-desde-cero.md) añade un diccionario
local, catálogos, consulta acotada y migración pura v1 a v2. Se ejecuta desde la raíz:
`node replication/examples/ecosistema-app/src/demo-datos.mjs`. No cambia la composición
en memoria ni hace que los adaptadores existentes escriban el formato 2.

Ejemplo pequeño y neutral para aprender COBRIA sin depender de un motor de base de datos. El dominio registra observaciones de biodiversidad; la infraestructura en memoria puede sustituirse por MongoDB, CouchDB u otro almacén documental.

```bash
cd replication/examples/ecosistema-app
npm test
npm start
```

El cambio de carpeta anterior parte de la raíz de COBRIA. Desde otra ubicación,
abre primero esa raíz. No hay dependencias externas que instalar para esta aplicación.
La ruta inicial completa está en [Tu primer proyecto](../../../manuales/26-primer-proyecto-paso-a-paso.md).
La demo usa identidad sintética y memoria; no autentica usuarios reales ni conserva
datos después de cerrar el proceso.

El ejemplo muestra una entidad canónica, capas explícitas, puerto de aplicación, Dater,
controlador neutral, composición con inyección, ámbito obligatorio, revisiones
monotónicas, idempotencia, autorización antes de leer, una proyección reconstruible y
pruebas de aislamiento. También incluye conjuntos analíticos reproducibles, separación de
tiempo válido/conocido, rechazo de fuga por entidad, recuperación por ámbito, citas,
abstención y evaluación de deriva sin autoridad de escritura. Aplicación no importa SDK
de un proveedor: las dependencias se conectan en composición.

El recorrido completo está en [GUIA-PASO-A-PASO.md](GUIA-PASO-A-PASO.md) y su trazabilidad
en [HITOS.json](HITOS.json).
