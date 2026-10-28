import java.util.HashMap;
import java.util.Map;

/** Patrón 10: una clave repetida solo es válida para la misma carga. */
// @book-start
public final class ProcesamientoIdempotente {
    public record Resultado(String eventoId, boolean aplicado, boolean repetido) {}

    private final Map<String, String> procesados = new HashMap<>();

    public Resultado procesar(String eventoId, String cargaCanonica) {
        if (eventoId == null || eventoId.isBlank() || cargaCanonica == null) {
            throw new IllegalArgumentException("El evento y la carga son obligatorios");
        }
        String huellaAnterior = procesados.get(eventoId);
        if (huellaAnterior != null && !huellaAnterior.equals(cargaCanonica)) {
            throw new IllegalStateException("La clave ya protege otra carga");
        }
        boolean repetido = huellaAnterior != null;
        procesados.put(eventoId, cargaCanonica);
        return new Resultado(eventoId, !repetido, repetido);
    }
// @book-end

    public static void main(String[] args) {
        var procesador = new ProcesamientoIdempotente();
        try {
            procesador.procesar("nulo", null);
            throw new AssertionError("Se aceptó una carga nula");
        } catch (IllegalArgumentException esperado) {
            // El registro no puede confundir ausencia con una carga previamente guardada.
        }
        for (String id : new String[]{"constructor", "__proto__", "toString"}) {
            if (!procesador.procesar(id, "carga").aplicado() || !procesador.procesar(id, "carga").repetido()) {
                throw new AssertionError("La clave reservada no fue idempotente");
            }
        }
        var primera = procesador.procesar("sensor-17:8842", "humedad=86");
        var repetida = procesador.procesar("sensor-17:8842", "humedad=86");
        if (!primera.aplicado() || !repetida.repetido()) {
            throw new AssertionError("La repetición conforme no fue idempotente");
        }
        try {
            procesador.procesar("sensor-17:8842", "humedad=40");
            throw new AssertionError("Se aceptó una clave reutilizada con otra carga");
        } catch (IllegalStateException esperado) {
            // Caso adverso esperado.
        }
    }
}
