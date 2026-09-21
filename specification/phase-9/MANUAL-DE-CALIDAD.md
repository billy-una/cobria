# Manual de calidad y estrategia de pruebas

La calidad se decide según el cambio y su riesgo. Una prueba unitaria no reemplaza contrato, motor real, accesibilidad, resiliencia o humo. `quality.json` relaciona siete tipos de cambio con las verificaciones mínimas y conserva por separado lo disponible, ejecutado, parcial, planificado y dependiente de terceros.

Todo requisito posee una prueba o gate nombrado, pero una referencia no significa que haya sido ejecutada. La evidencia registra comando, tiempo, revisión, ambiente, resultado y limitaciones. Un omitido produce estado incompleto, nunca aprobación.

La pirámide se usa como guía de costo, no como excusa: muchas pruebas rápidas protegen reglas; pruebas de contrato protegen fronteras; integración y motores reales protegen adaptadores; E2E protege recorridos críticos; rendimiento, resiliencia, seguridad, migración, accesibilidad y humo cubren cualidades diferentes.

Los datos de prueba son sintéticos y deterministas cuando sea posible. Cada fallo corregido añade regresión. Las pruebas inestables se aíslan, miden y corrigen; no se reintentan hasta ocultarlas.
