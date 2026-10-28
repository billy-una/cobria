# Taller local de API y experiencia de usuario

Puente HTTP real hacia la aplicación de `../ecosistema-app`, con sesiones DEMO
temporales inyectadas en el servidor y documentos en memoria. No es un servidor
desplegable ni un nuevo motor evaluado.

Desde la raíz de COBRIA, con Node.js 22.13 o superior:

```sh
npm start --prefix replication/examples/api-ux-c5
npm test --prefix replication/examples/api-ux-c5
```

No requiere paquetes externos para servir o probar HTTP. No copie solo esta carpeta:
también necesita la aplicación hermana. La guía completa está en
`manuales/30-api-ux-seguridad-y-privacidad.md`.

| Archivo | Responsabilidad | No le corresponde |
|---|---|---|
| `demo.mjs` | Crear sesión aleatoria de 30 minutos y abrir loopback | Autenticar personas reales |
| `server.mjs` | Traducir HTTP, validar frontera y obtener contexto de sesión | Reescribir reglas del dominio |
| `public/index.html` | Campos etiquetados y explicación de privacidad | Decidir permisos |
| `public/app.js` | Estados, petición, reintento y presentación como texto | Persistir sesión o documento |
| `public/style.css` | Contraste, foco y adaptación móvil | Crear controles de autorización |
| `test/http.test.mjs` | Aceptación y rechazo sobre sockets locales | Demostrar producción o concurrencia atómica |
| `verificar-interfaz.mjs` | Recorrido automatizado con Playwright | Sustituir revisión con lector de pantalla |

El mapa C3 conserva sus 27 archivos de la aplicación original; este puente vive fuera
de su `src` y depende de su composición pública. El dominio y la aplicación no importan
HTTP, HTML ni el taller. La fuente compartida libro/web es `editorial/c5/workshop.json`.

Las sesiones y sus documentos se pierden al cerrar. No use credenciales reales ni
datos personales. La captura opcional de interfaz se toma después de vaciar el token.
