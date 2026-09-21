# Checklist de entrega

- [ ] Destino y proyecto coinciden con el ambiente solicitado.
- [ ] Identidad de carga pertenece únicamente a ese ambiente.
- [ ] Rama cumple la política.
- [ ] Digest del artefacto es inmutable y coincide en toda la promoción.
- [ ] Variables se validaron por nombre y esquema, sin imprimir valores.
- [ ] Reglas de datos, IAM y red fueron probadas.
- [ ] Pruebas y gate de seguridad pasaron.
- [ ] Staging usa datos sintéticos o anonimización verificada.
- [ ] Migración es compatible hacia adelante y atrás.
- [ ] Humo incluye caso positivo y denegación entre ámbitos.
- [ ] Artefacto y procedimiento de rollback están disponibles.
- [ ] Métricas, alertas, cuotas y presupuesto están activos.
- [ ] Se conserva evidencia con actor, tiempo, SHA y digest.
