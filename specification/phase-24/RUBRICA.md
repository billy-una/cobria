# Rúbrica semántica

- **supported:** el fragmento muestra responsabilidad, mecanismo o restricción suficiente para el contrato completo.
- **unsupported:** el fragmento contradice el contrato o evidencia un comportamiento incompatible.
- **insufficient:** el fragmento es ambiguo, parcial o no permite decidir.

La presencia de una palabra clave nunca basta por sí sola. El revisor debe explicar qué
actor, límite, estado o consecuencia observa. “Insufficient” es una respuesta informativa,
no un error del proyecto.

Para ENG-007, `supported` exige aislamiento del legado, control verificable contra nuevo
crecimiento y una condición o ruta de retiro. Si el fragmento solo demuestra una o dos de
esas propiedades, use `insufficient`.

Confianza: 1 especulativa, 2 baja, 3 moderada, 4 alta y 5 evidencia directa inequívoca.
