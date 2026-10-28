# Reproducir el defecto antes de optimizar

Dos reservas tienen una observación con el mismo identificador. Una caché que usa solo ese identificador devuelve el dato de la primera reserva a la segunda. El resultado es rápido y equivocado: medir su latencia no convierte el sistema en una mejora.

## Antes de empezar

Sabes ejecutar una prueba y comprobar ausencia de efectos. Una caché guarda temporalmente una lectura para reutilizarla.

## Vocabulario

- Regresión: Fallo que reaparece al cambiar algo.
- Línea base: Comportamiento contra el que se compara una alternativa.
- Presupuesto: Límite explícito de tiempo, memoria o costo.

## Resolver el problema

El fixture defectuoso reproduce el cruce de ámbito de forma aislada. La lectura segura usa una clave con ámbito y política y autoriza incluso cuando la caché ya tiene el resultado. Dos lecturas autorizadas del mismo recurso cargan una vez; una lectura sin permiso se rechaza. El contador muestra trabajo evitado, no una cifra universal de rendimiento.

Para hablar de tiempo usa el protocolo de medir.mjs: calentamiento, orden de pares, repeticiones y resultados crudos. Compara resultados equivalentes, misma carga y misma frescura. Un índice añade construcción y almacenamiento; una proyección añade también mantenimiento y recuperación. La notación O describe crecimiento, no milisegundos ni facturación.

## Seguir el ejemplo

1. Observa esperado y obtenido en el fixture de caché defectuosa.
2. Ejecuta dos lecturas permitidas y cuenta cargas reales.
3. Retira permiso después del acierto: la caché no debe saltarse autorización.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs calidad
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function calidad() {
  const defecto = await reproducirDefectoCache();
  assert.notEqual(defecto.esperado, defecto.obtenido);
  let cargas = 0;
  const lectura = crearLecturaSegura({
    reloj: () => 0, // Reloj controlado: aquí contamos cargas, no medimos latencia.
    cargar: async (ambito) => {
      cargas++;
      return [{ ambito }];
    },
  });
  await lectura.leer('reserva-sur', contexto());
  await lectura.leer('reserva-sur', contexto());
  await assert.rejects(
    () => lectura.leer('reserva-sur', { ...contexto(), permisos: [] }),
    { codigo: 'ACCESS_DENIED' },
  );
  assert.equal(cargas, 1);
  return {
    defectoReproducido: defecto.causa,
    cargasParaDosLecturas: cargas,
    autorizacionEnCache: true,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "defectoReproducido": "clave-sin-ambito",
  "cargasParaDosLecturas": 1,
  "autorizacionEnCache": true
}
```

## Alternativa y costo

Una lectura directa acotada es preferible si ya cumple el presupuesto y la frescura. La caché no es una obligación del método.

Además de bytes y tiempo, considera invalidación, límites de entradas, antigüedad y operación. El costo de mantener una copia puede superar el ahorro de lectura.

## Caso adverso y recuperación

Comparar una consulta fresca con una caché vieja y afirmar que la segunda es superior mezcla resultados distintos. El número rápido no responde la misma pregunta.

Primero comprueba equivalencia y aislamiento. Después repite el ensayo con límites declarados y conserva los desaciertos, sin eliminar corridas desfavorables.

## Tu ejercicio

Redacta un presupuesto de lectura por reserva con frescura y memoria máximas. Compara consulta directa, índice y caché indicando qué medición falta para elegir.

## Solución explicada

El presupuesto debe expresar una carga y un percentil, por ejemplo un objetivo contextual de p95, no un resultado ya observado. Añade atraso permitido, bytes, escrituras de mantenimiento y tiempo de recuperación. Primero descarta resultados incorrectos; luego compara alternativas bajo ese presupuesto. Si falta medición, la elección queda provisional.

## Revisar la entrega

- La corrección conserva autorización en aciertos.
- Se distingue contador de cargas de medición de latencia.
- La comparación incluye frescura y costo de mantenimiento.

## Continuar

Prepara recuperación y promoción sin confundir un ensayo local con desplegar en la nube.

Fuentes del proyecto:

- [operacion.mjs](../../replication/examples/operacion-c6/operacion.mjs)
- [protocolo.json](../../replication/examples/operacion-c6/protocolo.json)
- [31-calidad-rendimiento-y-operacion.md](../../manuales/31-calidad-rendimiento-y-operacion.md)

