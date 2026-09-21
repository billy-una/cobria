# Agentes en la aplicación neutral

Las dependencias apuntan hacia el dominio. Presentación traduce protocolo; aplicación
orquesta; dominio conserva reglas; infraestructura implementa puertos; `composition.mjs`
conecta todo. Las claves físicas solo aparecen en el Dater/adaptador. Toda operación lleva
contexto de actor, capacidad, ámbito y finalidad. Ejecute `npm test`.
