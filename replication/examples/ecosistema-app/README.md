# Aplicación de referencia COBRIA

Ejemplo pequeño y neutral para aprender COBRIA sin depender de un motor de base de datos. El dominio registra observaciones de biodiversidad; la infraestructura en memoria puede sustituirse por MongoDB, CouchDB u otro almacén documental.

```bash
npm test
npm start
```

El ejemplo muestra una entidad canónica, capas explícitas, puerto de aplicación, Dater,
controlador neutral, composición con inyección, ámbito obligatorio, revisiones
monotónicas, idempotencia, autorización antes de leer, una proyección reconstruible y
pruebas de aislamiento. También incluye conjuntos analíticos reproducibles, separación de
tiempo válido/conocido, rechazo de fuga por entidad, recuperación por ámbito, citas,
abstención y evaluación de deriva sin autoridad de escritura. Aplicación no importa SDK
de un proveedor: las dependencias se conectan en composición.

El recorrido completo está en [GUIA-PASO-A-PASO.md](GUIA-PASO-A-PASO.md) y su trazabilidad
en [HITOS.json](HITOS.json).
