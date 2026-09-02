# Concurrencia y recursos COBRIA 1.2

30 repeticiones: **detección y reparación conformes**. Carreras con obsolescencia detectada: 30/30; reparaciones equivalentes: 30/30; documentos obsoletos (mediana): 100.

Memoria heap mediana: 2185728 bytes; CPU usuario mediana: 26443 μs; CPU sistema mediana: 1144 μs.

**Interpretación:** Una reconstrucción sobre una instantánea puede quedar obsoleta si coexiste con escrituras; COBRIA debe detectarlo antes de publicar o reparar por revisión.

**Límite:** Concurrencia de promesas sobre LokiJS en un proceso; no demuestra bloqueo, consenso, aislamiento transaccional ni comportamiento de red en un clúster.
