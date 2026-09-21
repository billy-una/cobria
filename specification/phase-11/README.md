# Manifiestos legibles por máquinas

Esta carpeta es una vista generada de fuentes canónicas de las fases 2–10. Los archivos usan sintaxis JSON válida dentro de `.yaml`, por lo que pueden leerse sin una dependencia YAML y siguen siendo compatibles con herramientas YAML.

Cada registro declara `id`, `source`, `version`, `owner`, `references` y `data`. `source` conserva la autoridad; el manifiesto no la reemplaza. Una referencia `test:` nombra un gate lógico y las demás referencias deben resolver a archivos del repositorio.

Regenerar:

```sh
python3 replication/scripts/generate-phase11-manifests.py
python3 replication/scripts/generate-phase11-manifests.py --check
```

No se editan manualmente los nueve archivos generados. Primero se cambia la fuente y después se regenera.
