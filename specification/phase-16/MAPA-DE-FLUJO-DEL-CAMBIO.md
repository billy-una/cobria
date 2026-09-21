# Mapa de flujo de un cambio asistido

```text
Solicitud
  → clasificar autoridad y alcance
  → cargar AGENTS.md + política + tarea
  → declarar plan de cambio
  → validar rutas, invariantes y pruebas
      ├─ inválido → explicar y detener escritura
      └─ válido   → editar fuente mínima
                     → ejecutar gate específico
                     → regenerar derivados autorizados
                     → make verificar
                     → informar evidencia y pendientes humanos
```

La dirección de autoridad es `especificación → implementación → evidencia → productos
editoriales`. La evidencia no se reescribe para coincidir con una conclusión y un derivado
editorial no se utiliza como fuente normativa.
