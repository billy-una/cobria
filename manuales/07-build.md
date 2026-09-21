# COBRIA Build: programa completo

El ejemplo ejecutable está en `replication/examples/ecosistema-app`. Registra observaciones comunitarias sin depender de un motor comercial.

## Etapas

1. Entidad `Observacion` con invariantes.
2. Puerto `RepositorioObservaciones` implícito por contrato de métodos.
3. Adaptador documental en memoria.
4. Caso de uso `RegistrarObservacion`.
5. Autorización por actor, acción y ámbito.
6. Idempotencia mediante clave y huella de entrada.
7. Proyección `ResumenPorEspecie` reconstruible.
8. Controlador de presentación con resultados explícitos.
9. Pruebas felices, negativas, de repetición y reconstrucción.

## Ejecutar

```sh
cd replication/examples/ecosistema-app
npm test
npm start
```

## Criterios de aceptación

- Una observación válida queda en su ámbito.
- Un actor sin acceso es rechazado antes de escribir.
- Repetir la misma clave no duplica el efecto.
- Reutilizar la clave con otro contenido es rechazado.
- Una revisión vieja no reemplaza la actual.
- La proyección puede eliminarse y reconstruirse.
- La proyección reconstruida equivale al resultado esperado.
