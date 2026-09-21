# COBRIA Build: aplicación de referencia

**Versión:** 1.0  
**Proyecto:** observaciones ambientales comunitarias  
**Código:** `replication/examples/ecosistema-app/`

## Propósito

COBRIA Build une el ecosistema en un proyecto pequeño, neutral y ejecutable. No copia
nombres, reglas ni datos privados de los repositorios estudiados. Su dominio registra
observaciones de biodiversidad y construye lecturas y evidencia reconstruibles.

## Recorrido completo

1. describir necesidad, actores, finalidad y límites;
2. convertirlos en requisitos y casos negativos;
3. modelar `Observacion` y sus invariantes;
4. separar dominio, aplicación, infraestructura, presentación y composición;
5. traducir claves físicas exclusivamente mediante `ObservacionDater`;
6. persistir por un puerto intercambiable;
7. autorizar actor, capacidad, ámbito y finalidad;
8. aplicar revisión e idempotencia;
9. exponer errores RFC 9457 y listados por cursor;
10. reconstruir una proyección verificable;
11. crear conjunto analítico reproducible;
12. recuperar evidencia por ámbito y abstenerse;
13. ejecutar pruebas, gates y ensayo operacional;
14. documentar retiro, límites y pendientes externos.

Cada hito, evidencia y comando aparece en `HITOS.json` y `GUIA-PASO-A-PASO.md` dentro de
la aplicación.

## Ejecutar

```bash
cd replication/examples/ecosistema-app
npm test
npm start
```

La demostración usa memoria para ser accesible. Los adaptadores MongoDB y CouchDB prueban
el mismo contrato mediante dobles controlados; la conformidad con motores reales pertenece
al paquete experimental y no se atribuye a esta demostración.

## Qué aprende una persona o agente

- dónde vive cada responsabilidad;
- por qué el dominio no importa SDK;
- cómo evitar duplicados y revisiones obsoletas;
- cómo impedir cruces de ámbito;
- cuándo usar índice o proyección;
- cómo reconstruir una lectura;
- cómo producir analítica sin fuga;
- cómo limitar IA a evidencia autorizada;
- cómo distinguir ejecución local, infraestructura real y validación humana.

## Ejercicios

1. Añada un catálogo versionado de especies.
2. Cree un adaptador documental sin cambiar casos de uso.
3. Añada una proyección mensual y su prueba de equivalencia.
4. Diseñe un estado offline sin convertir caché en autoridad.
5. Introduzca una violación de ámbito y compruebe que falla antes del repositorio.
6. Agregue una característica analítica con unidad y versión.

Las soluciones deben conservar dependencias hacia adentro, códigos estables, pruebas
negativas y procedencia. No se acepta una solución que solo “funcione” en el caso feliz.

**Criterio de avance:** otra persona puede ejecutar los comandos, recorrer los catorce
hitos y obtener las mismas pruebas sin consultar los proyectos originales.
