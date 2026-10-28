# Taller local de analítica y recuperación con procedencia

Con Node.js 22.13 o superior, desde la raíz de COBRIA:

```sh
npm test --prefix replication/examples/analitica-c7
npm start --prefix replication/examples/analitica-c7
npm run evaluar --prefix replication/examples/analitica-c7
```

Sin paquetes externos ni proveedor. Necesita la carpeta hermana `ecosistema-app`.
Doce pruebas y diez consultas sintéticas. Conserva un falso positivo y un falso negativo.
No ejecuta un LLM ni entrena un modelo; no es certificación de seguridad o calidad de IA.

| Archivo | Responsabilidad |
|---|---|
| `taller.mjs` | Cortes, exclusiones, fuga, manifiesto, recuperación acotada y herramienta de lectura |
| `fixtures.json` | Datos y etiquetas didácticos, sin personas ni anotación externa |
| `protocolo.json` | Cortes, umbral y versión anteriores a la evaluación |
| `evaluar.mjs` | Métricas con denominadores explícitos y huellas de fuentes |
| `demo.mjs` | Recorrido local sin escrituras autoritativas |
| `test/taller.test.mjs` | Casos conformes, rechazo y límites observables |

La fuente editorial compartida es `editorial/c7/workshop.json`. Guía:
`manuales/32-analitica-e-ia-con-procedencia.md`.
