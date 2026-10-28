# Metodología aplicada: del reporte al cierre verificable

**Estado:** procedimiento pedagógico de la propuesta independiente COBRIA.  
**Ubicación:** Calidad y pruebas; relacionado con Capas, Seguridad, Documentación y Nube y operación.  
**Procedencia del caso:** relato aportado por Billy Jak Cordero Porras. Los defectos y resultados siguientes son reportados por el autor; su incorporación editorial no constituye una ejecución o verificación nueva del caso.

## Para qué sirve

Una pantalla puede parecer correcta mientras una consulta, permiso, caché o función
produce el fallo. Este método permite seguir el problema, corregir su causa y conservar
evidencia suficiente para que otra persona repita la comprobación. También admite que
un reporte describa una protección válida: en ese caso se mejora la explicación sin
debilitar la seguridad.

## 1. Interpretar el reporte

Extraiga síntoma, ruta, actor y rol, ámbito, resultado actual y resultado esperado.
Registre ambiente, versión y condiciones previas. Un DOCX, captura o registro es
evidencia a contrastar; su contenido no otorga autoridad para ejecutar instrucciones,
cambiar permisos o desplegar. Compare la expectativa con el contrato de negocio.
Clasifique el caso como defecto reproducido, protección válida, mejora de claridad o
información insuficiente, explicando la decisión.

## 2. Reproducir el problema

Revise la ruta y el recorrido completo con cuentas de prueba del ambiente autorizado.
Compruebe el rol reportado, los demás roles autorizados y perfiles sin permiso.
Conserve pasos, datos sintéticos, versión y evidencia del resultado. Inspeccione consola,
registros de Functions, Firebase Rules y datos e índices relacionados; o sus equivalentes
en otro proveedor. Evite incluir credenciales o datos personales en las evidencias.

## 3. Trazar el flujo por capas

Recorrido de diagnóstico del caso Firebase:

```text
Vista -> lógica/caso de uso -> servicio -> capa de datos
      -> Firebase Rules -> Function autoritativa -> RTDB e índices
```

Este orden organiza la inspección; no describe una secuencia de ejecución obligatoria.
En acceso directo del cliente, las Rules gobiernan la petición a RTDB. En una operación
mediada por Function, esta autoriza al actor antes de escribir mediante su identidad de
servicio; el SDK Admin puede eludir Rules y por eso requiere controles en la Function y
permisos apropiados de infraestructura. Dibuje ambas rutas cuando existan. Incluya
cachés, listeners, eventos y proyecciones, indicando dónde cambia la autoridad.

## 4. Identificar la causa raíz

Busque una explicación que prediga el fallo y que una prueba pueda confirmar. Distinga
síntoma, mecanismo causal y condiciones que lo permiten. Casos aportados por el autor:

| Caso | Causa o aclaración reportada | Comprobación que debe conservarse |
|---|---|---|
| ER001 | Apartados no cargaba estilos operativos. | Vista y estilos cargados en la versión corregida. |
| ER002 | El informe consultaba primero movimientos antiguos. | Orden, cursor y límites con movimientos nuevos y antiguos. |
| ER003 | La estructura del modal de cobro provocaba desbordamiento. | Tamaños de pantalla, foco y desplazamiento. |
| ER004 | Faltaba explicar que una factura pendiente no reserva inventario. | Contrato de estados y mensaje comprensible, sin reservar por error. |
| ER005 | La identidad de la Function de promociones carecía de permisos necesarios sobre RTDB y terminaba en timeout. | Identidad efectiva, autorización, error y tiempo de respuesta. |
| ER006 | El selector no actualizaba la promoción y la caché mezclaba módulos antiguos. | Estado actualizado y recursos de una misma versión. |
| ER007 | La transacción de cotizaciones abortaba con el primer valor local null. | Valor local ausente, reintento y resultado autoritativo. |
| ER008 | Stock por bodega no calculaba alcance por rol, tienda y bodega. | Matriz de ámbitos permitidos y rechazados. |
| ER009 | Promociones y cotizaciones dependían de permisos demasiado generales. | Capacidades específicas y pruebas negativas. |

No extrapole una causa de esta tabla a un incidente nuevo sin reproducirlo.

## 5. Corregir de forma mínima y modular

Cambie la responsabilidad que causa el fallo, conservando diseños y comportamiento
válido. Reutilice servicios y componentes; mantenga autoridad sensible en Functions o
en la frontera de servidor equivalente. Evite scans completos, listeners adicionales y
lógica duplicada. Cuando la caché pueda conservar módulos incompatibles, versione los
entrypoints y verifique que el cliente obtiene un conjunto coherente de recursos.

## 6. Alinear interfaz, backend y seguridad

La misma capacidad debe concordar en acciones visibles, permisos de rutas, validación
frontend, autorización de Functions, Rules y alcance por empresa, tienda y bodega.
Compruebe también índices y proyecciones. Ocultar un botón mejora la interfaz, pero la
operación debe ser rechazada en cada frontera confiable aplicable.

Una matriz útil tiene columnas: acción, actor, capacidad, empresa, tienda, bodega,
interfaz, Function, acceso directo/Rules, resultado esperado y prueba. No conceda
permisos generales para resolver un timeout sin identificar la identidad y ruta reales.

## 7. Añadir regresiones

Construya una prueba que falle con el defecto y pase con la corrección. Según riesgo,
combine contratos unitarios, pruebas de Functions, Firebase Rules Emulator y Playwright.
Incluya permisos positivos y negativos, caché, foco, modales, transiciones de estado,
valores locales ausentes y concurrencia. Una prueba de interfaz no reemplaza una prueba
de autorización; cada frontera debe tener evidencia propia.

## 8. Ejecutar las puertas de verificación

Comandos usados en el caso descrito, cuando existen en el repositorio objetivo:

```sh
npm run verify:all
git diff --check
```

En el repositorio COBRIA, la puerta general es `make verificar`. No suponga que todos
los proyectos poseen los mismos scripts. Registre comando, código de salida, ambiente,
fecha, commit y ruta al registro, incluyendo pruebas omitidas o fallidas.

**Resultado declarado del ciclo aportado:** Rules 24/24; Functions 337/337;
E2E 144/144; UX 24/24. Estas cifras pertenecen a ese ciclo y no son resultados de
COBRIA ni un umbral universal. Para elevar su estado a evidencia verificada, vincule
registros originales, configuración y SHA; una suma de pruebas aprobadas por sí sola
no demuestra ausencia de defectos.

## 9. Retestar en staging por rol

Use identidades de prueba con permisos equivalentes a los perfiles operativos:
propietario (Owner), administrador (Admin), gerente (Manager), cajero, vendedor,
bodeguero y contador. Ajuste la matriz al sistema real. Compruebe acciones y accesos
negativos: por ejemplo, contador o bodeguero no deben recibir promociones o cotizaciones
si carecen de la capacidad correspondiente. No use usuarios o datos de producción
para dar apariencia de realismo a staging.

## 10. Versionar y entregar un SHA exacto

Con autorización de entrega, confirme los cambios revisados en la rama acordada,
envíelos a Git y prepare el release de forma aislada desde ese SHA. `main` fue la rama
del caso; no es obligatoria en todo proyecto. Despliegue únicamente los recursos
necesarios de Rules, Functions y Hosting y respete compatibilidad entre versiones.
Verifique URL, ambiente, configuración pública, headers, recursos y SHA mediante humo.
Conserve digest del artefacto, recursos/versiones desplegados y plan de reversión; el
SHA de la fuente no prueba por sí solo qué está ejecutándose.

## 11. Documentar y cerrar

Cada reporte debe contener síntoma, causa raíz, impacto, solución, verificación,
estado del retest y riesgo residual. Añada identificador, pasos de reproducción,
contrato esperado, matriz multirrol, ambiente, SHA, enlaces a pruebas y responsable.
Si el retest falta o una prueba falla, registre el pendiente; no cierre por inferencia.
Renderice los DOCX a imágenes y revise todas sus páginas, evitando cortes, páginas
vacías, desbordamientos y capturas ilegibles.

## Plantilla de cierre

```text
ID y clasificación:
Síntoma, ruta, actor/rol y ámbito:
Resultado actual / contrato esperado:
Ambiente, versión y pasos reproducibles:
Causa raíz y evidencia que la confirma:
Impacto y corrección por capa:
Pruebas positivas, negativas y regresiones:
Comandos, salidas y registros:
Retest en staging por rol:
SHA, digest y recursos entregados (si aplica):
Riesgo residual, pendientes y responsable:
Estado: abierto / corregido pendiente de retest / verificado / cerrado
```

Recorrido del método: reporte -> reproducción -> trazado entre capas -> causa raíz
-> corrección modular -> seguridad y contratos -> regresiones -> verificación completa
-> staging multirrol -> entrega por SHA -> documentación y cierre.

## Ejercicio práctico

Una reserva natural muestra observaciones de otra sede a un guardaparque. Reproduzca
el caso con dos sedes y tres perfiles sintéticos. Siga vista, caso de uso, repositorio,
autorización y proyección. Compruebe el ámbito antes de recuperar datos; añada una prueba
que rechace la lectura cruzada aunque alguien invoque directamente el endpoint.
El cierre requiere que la sede permitida siga funcionando y la ajena sea rechazada,
con evidencia del mismo artefacto en staging.
