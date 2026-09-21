# Rúbrica de adopción Engineering

| Estado | Significado | Evidencia mínima |
|---|---|---|
| ausente | no se localizó el contrato | búsqueda, ruta y límite documentados |
| documentado | existe una decisión revisable | responsable, versión y aceptación |
| implementado-local | código y prueba estructural disponibles | commit, archivo y huella |
| ejecutado-controlado | gate ejecutado en ambiente registrado | salida, configuración y revisión |
| validado-operacionalmente | comportamiento observado en ambiente objetivo | artefacto, humo, métricas y recuperación |
| transferido | tercero lo comprende y reproduce | protocolo y registro independiente |

El promedio no compensa una brecha crítica. Autoridad, aislamiento, rollback o
privacidad pendientes deben permanecer visibles aunque otros contratos estén completos.
