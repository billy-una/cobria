# Ensayo local de calidad rendimiento y recuperación

Requiere Node.js 22.13 o superior y Git para registrar identidad en la demostración.
Sin paquetes externos. Conserva archivos temporales con datos ficticios y no modifica
una base activa. Necesita las carpetas hermanas `ecosistema-app` y `operacion-documental`.

Desde la raíz:

```sh
npm test --prefix replication/examples/operacion-c6
npm start --prefix replication/examples/operacion-c6
npm run medir --prefix replication/examples/operacion-c6
```

Quince pruebas, un defecto deliberado aislado, una corrección que reutiliza la caché
existente, exportación y restauración a memoria, handler local y promoción/reversión
de referencias locales. No es despliegue de Functions, aprobación humana, recuperación
integral de servicio ni benchmark de motores NoSQL. El protocolo y su semilla se
registran en cada medición. Los archivos JSON de resultados se generan, no se editan.

Guía: `manuales/31-calidad-rendimiento-y-operacion.md`.
