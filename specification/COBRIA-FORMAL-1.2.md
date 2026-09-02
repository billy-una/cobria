# Modelo formal mínimo de COBRIA 1.2

**Estado:** complemento técnico experimental. No modifica COBRIA Core 1.0 ni convierte el borrador 1.1 en norma estable.

## 1. Dominios

Sea `D` el conjunto de documentos canónicos, `P_v` una proyección de versión `v`, `A` el conjunto de ámbitos, `I` el conjunto de identidades estables y `R = ℕ⁺` el conjunto de revisiones. Cada documento canónico es una tupla:

`d = (id, ámbito, revisión, versiónEsquema, contenido)`.

Una transformación versionada `T_v` produce cero o una representación derivada por documento: `T_v : D → P_v ∪ {∅}`. La selección `Q` determina qué documentos deben aparecer.

## 2. Invariantes verificables

1. **Identidad:** `id(d)` no depende del motor ni de la ubicación física.
2. **Ámbito:** toda lectura o escritura aporta `a ∈ A`; un resultado de ámbito `a` no contiene elementos de otro ámbito.
3. **Monotonía de revisión:** una escritura aceptada para `(id, a)` no reduce su revisión.
4. **Autoridad única:** modificar `P_v` no altera `D`; solo `D` acepta cambios autoritativos.
5. **Procedencia:** cada `p ∈ P_v` identifica al menos origen, revisión fuente y versión de transformación.
6. **Equivalencia:** una candidata solo es publicable si `E(P_v, T_v(Q(D))) = verdadero`.
7. **Publicación segura:** si falla la construcción o verificación, la versión activa anterior permanece legible.
8. **Idempotencia:** aplicar dos veces la misma entrega lógica deja el mismo estado observable.
9. **Reconstruibilidad:** eliminar `P_v` no destruye la capacidad de producirla desde las fuentes declaradas.
10. **Abstención:** una salida automatizada sin evidencia autorizada suficiente no afirma un resultado.

## 3. Precondiciones y poscondiciones

### Guardar un documento canónico

- Precondiciones: identidad y ámbito no vacíos; revisión positiva; el ámbito declarado coincide con la operación.
- Poscondiciones: el documento queda visible únicamente en su ámbito; una revisión menor que la existente es rechazada; no se modifica una proyección activa.

### Reconstruir una proyección

- Precondiciones: fuentes, versión de transformación, ámbito y criterio de equivalencia están congelados.
- Poscondiciones: se crea una candidata separada; la candidata equivale al resultado esperado; la versión activa no cambia durante la construcción.

### Publicar una candidata

- Precondiciones: construcción completa, equivalencia superada y revisión de fuentes vigente.
- Poscondiciones: los lectores resuelven una única versión activa; el cambio deja evidencia; un fallo previo conserva la versión anterior.

## 4. Máquina de estados

`AUSENTE → CONSTRUYENDO → CANDIDATA → VERIFICADA → PUBLICADA → RETIRADA`

- `CONSTRUYENDO → FALLIDA`: interrupción o error de transformación.
- `CANDIDATA → RECHAZADA`: equivalencia falsa, revisión fuente obsoleta o ámbito contradictorio.
- `FALLIDA` y `RECHAZADA` no pueden transicionar directamente a `PUBLICADA`.
- Solo `VERIFICADA → PUBLICADA` cambia el puntero activo.
- `PUBLICADA → RETIRADA` exige conservar o declarar la fuente reconstruible.

## 5. Aislamiento declarado

COBRIA no presupone transacciones distribuidas. Una reconstrucción toma una instantánea lógica `S`. Si `D` cambia después de `S`, la candidata es obsoleta. Antes de publicar se DEBE comparar el vector o marca de revisión de fuentes; alternativamente se DEBE aplicar una reparación incremental y repetir `E`. La prueba local de concurrencia demuestra detección y reparación, no aislamiento de clúster.

## 6. Criterio de equivalencia

La igualdad física de bytes no es obligatoria. El proyecto debe congelar una función `N` de normalización y una relación `E`. El criterio mínimo usado por el arnés es:

`E(P, D) ⇔ hash(N(P)) = hash(N(T_v(Q(D))))`.

`N` ordena por identidad y conserva únicamente los campos semánticos declarados. Para búsquedas, agregaciones o modelos analíticos se requieren además consultas testigo, tolerancias numéricas y reglas de cobertura.

## 7. Propiedades aún no demostradas

Este modelo no prueba consenso, serialización, atomicidad entre regiones, confidencialidad frente a canales laterales ni disponibilidad bajo partición. Esas propiedades pertenecen al motor, al despliegue y al perfil operativo, y requieren experimentos externos.
