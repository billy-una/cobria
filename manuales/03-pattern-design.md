# COBRIA Pattern Design

**Versión:** 1.0  
**Estado:** catálogo pedagógico central del Ecosistema 1.0  
**Alcance:** patrones y antipatrones; no sustituye las obligaciones de COBRIA Core

## Propósito

Pattern Design organiza soluciones recurrentes por el problema que resuelven, las fuerzas
que equilibran, sus costos y la evidencia que permite evaluarlas. Un nombre interno de
clase no convierte una práctica en patrón. COBRIA distingue:

- patrón reconocido y adaptado;
- composición COBRIA de mecanismos conocidos;
- mecanismo técnico;
- contrato verificable;
- convención local;
- antipatrón observado.

La procedencia se declara en cada ficha. El catálogo no afirma que Repository, Data
Mapper, CQRS, Outbox, índices o vistas materializadas sean invenciones de COBRIA.

## Cómo elegir un patrón

1. Describa el problema observable sin nombrar una solución.
2. Identifique fuerzas: simplicidad, autoridad, latencia, consistencia, costo y cambio.
3. Mida la línea base cuando la decisión afecte rendimiento.
4. Considere primero la alternativa más sencilla.
5. Seleccione un patrón solo si su contexto coincide.
6. Escriba contrato, caso negativo, prueba y condición de retiro.
7. Revise patrones relacionados para evitar una solución aislada.

## Familias del catálogo

| Familia | Pregunta |
|---|---|
| Modelado documental | ¿Dónde viven identidad, tiempo, versión y reglas? |
| Seguridad por ámbito | ¿Cómo se evita mezclar límites organizacionales? |
| Catálogos y vocabularios | ¿Cómo permanece estable el significado? |
| Proyecciones de lectura | ¿Cómo se optimiza sin crear otra autoridad? |
| Reconstrucción | ¿Cómo se regenera, verifica y repara un derivado? |
| Eventos y consistencia | ¿Cómo se controlan repetición, orden y convergencia? |
| Gobernanza del ciclo de vida | ¿Cómo se decide, publica, mide y retira? |
| Analítica reproducible | ¿Cómo se conserva un corte verificable sin fuga? |
| IA con procedencia | ¿Cómo se recupera, actúa y responde con evidencia? |

Estas familias se relacionan además con creación/configuración, estructura, comportamiento,
persistencia, concurrencia, interfaz, seguridad, operación y analítica. La primera taxonomía
describe el contenido actual; la segunda permite compararlo con catálogos generales.

## Plantilla obligatoria de ficha

1. identidad, nombre, familia, tipo y estado;
2. explicación en una frase;
3. problema observable;
4. contexto y fuerzas;
5. cuándo usar y cuándo evitar;
6. estructura y participantes;
7. secuencia o contrato mínimo;
8. ejemplo neutral completo;
9. código práctico por lenguaje cuando aporta valor;
10. caso negativo y antipatrones;
11. consecuencias y costos;
12. pruebas y evidencia esperada;
13. seguridad y privacidad;
14. operación y observabilidad;
15. migración, recuperación y retiro;
16. patrones relacionados;
17. ejercicio con resultado esperado;
18. procedencia y fuentes conceptuales.

El catálogo enriquecido se genera en `editorial/generated/pattern-catalog.json`. Las
fichas web y del libro deben derivar de esa estructura durante el cierre editorial.

## Doce patrones de entrada

| Patrón | Tensión | Participantes | Prueba decisiva |
|---|---|---|---|
| Objeto de dominio válido | datos sin reglas | entidad, valor | construcción inválida rechazada |
| Caso de uso pequeño | controladores con negocio | entrada, interactor, resultado | dependencia sustituible |
| Repositorio semántico | persistencia expuesta | puerto, repositorio | mismo contrato en memoria y NoSQL |
| Mapeador documental | forma física invade dominio | entidad, Dater, documento | ida y vuelta conserva semántica |
| Catálogo versionado | códigos cambian significado | catálogo, entrada, versión | lectura histórica correcta |
| Composición raíz | dependencias ocultas | factories, adaptadores | grafo explícito |
| Proyección dirigida por consulta | N+1 o documento ancho | fuente, proyector, consulta | equivalencia y costo medido |
| Mutación con propietario único | varias rutas cambian lo mismo | agregado, transacción | carrera no rompe invariante |
| Outbox transaccional | commit sin efecto externo | entidad, outbox, worker | reinicio no pierde efecto |
| Worker con fencing | trabajador obsoleto completa | claim, token, estado | token anterior rechazado |
| Estado asíncrono de interfaz | UX ambigua | estado, vista, acción | carga, vacío, error y éxito |
| Evidencia ligada a versión | “funciona en mi máquina” | commit, gate, informe | resultado identifica código |

Los treinta patrones especializados en datos, reconstrucción, analítica e IA aparecen en
el catálogo canónico. Estos doce patrones de entrada conectan COBRIA con programación y
arquitectura general sin ampliar artificialmente Core.

## Ejemplo completo: Cola de salida transaccional

### Problema y fuerzas

Guardar un documento y enviar después un mensaje abre una ventana de pérdida. Enviar
primero puede publicar algo que finalmente no se guardó. Se equilibran atomicidad local,
entrega eventual, duplicados, latencia, almacenamiento y operación del trabajador.

### Contexto

Úselo cuando una mutación autorizada debe producir un efecto externo que no cabe en la
misma transacción. Evítelo cuando toda la operación cabe en una transacción local o el
efecto puede calcularse bajo demanda sin riesgo.

### Estructura y secuencia

```text
caso de uso
  → guardar autoridad + mensaje pendiente en una mutación
  → commit
worker
  → reclamar con token
  → ejecutar efecto idempotente
  → completar si conserva el token vigente
```

### Caso negativo

El trabajador A reclama revisión 2. Su lease vence y B reclama revisión 3. A termina
tarde. La finalización de A se rechaza porque su fence dejó de ser vigente.

### Pruebas

- reiniciar después del commit no pierde el mensaje;
- repetir entrega no duplica el efecto;
- un token antiguo no completa;
- otro ámbito no reclama el mensaje;
- una cola detenida expone atraso y alerta.

### Costos y retiro

Añade estados, almacenamiento, monitoreo, limpieza y pruebas. Se retira únicamente cuando
no quedan productores, pendientes ni consumidores y existe una alternativa comprobada.

## Antipatrones transversales

- patrón ceremonial sin problema observable;
- Service, Manager o Utils como contenedor sin responsabilidad;
- proyección editable convertida en autoridad;
- ámbito añadido después de consultar;
- reintento sin idempotencia;
- caché sin identidad, versión o retiro;
- evento sin propietario, versión o política de duplicados;
- IA que siempre responde aunque no exista evidencia;
- optimización sin línea base ni condición de reversión;
- copiar un patrón por popularidad sin evaluar contexto.

## Relaciones

Las relaciones admitidas son: **requiere**, **complementa**, **alternativa**, **especializa**,
**prepara**, **protege** y **entra en tensión con**. Una ficha no se limita a una lista de
nombres: explica por qué existe la relación.

## Criterio de avance

El catálogo se considera publicable cuando todas sus fichas poseen los dieciocho campos,
las relaciones apuntan a patrones existentes, el código puede copiarse, los casos negativos
son comprobables y la procedencia no confunde composición con novedad absoluta.
