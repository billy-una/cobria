# Incidencias conocidas de COBRIA 1.0.0-rc2

1. La candidata no es una versión estable ni una certificación oficial.
2. La evidencia R7 es confirmatoria interna; una celda permanece no concluyente y se
   conserva como resultado negativo.
3. La revisión humana independiente, el doble cribado bibliográfico y el estudio de
   transferencia con participantes no pueden sustituirse con automatización.
4. La réplica externa debe ejecutarse en una computadora y por una persona distintas.
5. La equivalencia binaria de un PDF puede variar por metadatos o motor de impresión;
   R9 compara también texto normalizado y conteo de páginas.
6. El sitio desplegado puede permanecer temporalmente en RC1 hasta que una persona
   autorizada apruebe y ejecute la publicación de RC2.
7. Los experimentos documentales no prueban por sí solos escalabilidad distribuida,
   seguridad total, cumplimiento legal ni superioridad universal.
8. La cadena glob del sitio usa una sustitución local privada y limitada, no una
   distribución oficial de fast-glob. Requiere mantenimiento y revisión al cambiar
   consumidores; las fuentes, artefacto instalable y pruebas están en `sitio/vendor/`.
9. La salida local `sitio/dist` presentó directorios duplicados y bloqueo de preparación.
   La verificación funcional se ejecuta en una copia temporal cuando se usa
   `make verificar COBRIA_SITE_ISOLATED=1`. Esto no demuestra doble construcción
   desde un clon Git limpio ni repara el estado de esa carpeta original.
10. La doble construcción local aprobada del 17 de octubre necesitó repositorios de
    referencia externos al ZIP. Las fases 21–25 no son reproducibles por una persona
    sin acceso a esos repositorios y sus commits congelados. No se omiten para obtener
    una verificación verde. Véase `GUIA-REPRODUCCION-RC2.md`.
11. La configuración de CI posterior al commit candidato requiere el secreto
    `COBRIA_REFERENCE_TOKEN`, limitado a lectura de los repositorios de referencia.
    Su preparación local no demuestra una ejecución verde en GitHub Actions.
