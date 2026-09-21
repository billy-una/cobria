# Runbook de incidentes

1. **Detectar y clasificar.** SEV-1 compromete confidencialidad/integridad amplia o impide operar; SEV-2 tiene impacto alto acotado; SEV-3 es degradación controlada; SEV-4 es hallazgo sin explotación.
2. **Preservar evidencia.** Registrar tiempo, detector, identidades, ámbitos, versiones y huellas. No copiar datos innecesarios ni alterar originales.
3. **Contener.** Revocar capacidad o secreto, aislar consumidor, detener publicación de derivados y conservar el canónico si es seguro.
4. **Erradicar y recuperar.** Corregir causa, reconstruir proyecciones desde fuentes verificadas, rotar credenciales, restaurar y comparar equivalencia.
5. **Comunicar.** Usar responsables y plazos definidos por la organización y la normativa aplicable; no especular.
6. **Aprender.** Elaborar cronología, impacto, controles fallidos, acciones con responsable/fecha y una nueva prueba de regresión.

Nunca se borra evidencia para “resolver” un incidente. Si la evidencia contiene datos restringidos, se limita su acceso y retención.
