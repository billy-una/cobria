# Capacidades y reglas por nodo

La autorización se evalúa antes del repositorio. No se aceptan permisos implícitos ni `*`. Toda operación sensible declara actor, capacidad, ámbito y finalidad. El resultado se audita con una lista positiva que excluye documento, token, secreto y clave de idempotencia.

Las capacidades usan `recurso:acción`: `observaciones:leer`, `observaciones:escribir`, `proyecciones:publicar`, `catalogos:administrar`, `analitica:construir` y `auditoria:leer`. Los nombres de proveedor no forman parte del contrato.

Las reglas normativas de cada nodo están en `security.json`. En particular, el canónico solo cambia mediante caso de uso; el dato fechado es inmutable; la proyección tiene un único escritor y puede retirarse; el catálogo fija versión; la salida se confirma o reconcilia; el conjunto analítico conserva procedencia y ventana de retención.

Un agente de IA es un actor, no una excepción: recibe una identidad de carga, capacidades mínimas, herramientas enumeradas, presupuesto, ámbito y finalidad. Toda acción con efecto externo necesita una política explícita; una recomendación del modelo nunca sustituye la autorización.
