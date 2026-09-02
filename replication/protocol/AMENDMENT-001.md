# Enmienda metodológica 001

- Fecha: 2026-08-20.
- Momento: posterior a la primera ejecución completa y anterior al análisis inferencial.
- Alcance: instrumentación de P2/P3; no modifica hipótesis, perfiles, tamaños, repeticiones ni umbrales.
- Hallazgo: las proyecciones simuladas compartían un único espacio de claves. P3 medía una sola representación sobrescrita y P2 confundía actualizaciones sucesivas de la misma representación con proyecciones independientes.
- Corrección: cada proyección usa un almacén y un administrador independientes; todas se construyen antes de medir la escritura; la medición suma escrituras y bytes de los almacenes derivados.
- Cobertura detectada durante la auditoría: el ejecutor inicial tampoco materializaba P4, P5, EV1, M1, AI4, AI6 y AI7 aunque el protocolo los enumeraba. Se añadieron antes de la corrida analítica definitiva. P4 se declara explícitamente como concurrencia cooperativa del event loop, no como carga multinúcleo; AI4 usa recuperación sintética y no evaluación humana de respuestas generadas.
- Decisión: se descarta íntegramente la primera corrida completa y se repite toda la matriz. El archivo reemplazado puede identificarse por el manifiesto `full-2026-08-20T17-19-18-454Z` y el hash registrado en él.
- Integridad: la enmienda no fue motivada por el signo o la significación de los resultados, sino por una violación observable del constructo ``número de proyecciones''.
- Control AI4: el primer análisis mostró una consulta sin elementos relevantes en un perfil, lo que hacía trivial la precisión. Se reemplazó por una consulta de estado activo garantizada por el generador y se descartó esa corrida completa antes de redactar resultados.
