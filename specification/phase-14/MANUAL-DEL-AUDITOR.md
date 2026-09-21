# Auditor automático e impacto

```sh
node replication/src/cli.mjs auditar --codigo /ruta/proyecto --json
node replication/src/cli.mjs impacto --archivo src/domain/entidad.mjs --raiz /ruta/proyecto --json
```

Cada hallazgo incluye regla, severidad, archivo, línea, explicación y remediación. El auditor omite dependencias instaladas y salidas de construcción. Un resultado limpio significa “ninguna regla implementada encontró un problema”, no seguridad ni corrección completas.

Las siete reglas cubren capas, claves físicas, proveedores, límites cloud, versión de catálogos, capacidades mínimas y trazabilidad requisito–prueba. El análisis de impacto sigue imports estáticos relativos directos; no interpreta inyección dinámica, alias de compilador ni reflexión.
