# UX, estados y formularios

Cada recorrido define estado inicial, carga, vacío, éxito, error recuperable, error definitivo, sin permiso y desconectado. El estado no se comunica solo por color. Los errores se ubican junto al campo, se resumen al inicio y conservan la entrada válida.

Todo campo posee etiqueta visible, ayuda asociada cuando haga falta, tipo/autocomplete apropiado y mensaje con relación programática. Los botones describen la acción; durante envío informan progreso sin mover el foco y evitan duplicados mediante lógica, no solo deshabilitación visual.

La navegación conserva encabezado, enlace para saltar, título único, jerarquía de encabezados, ubicación actual y regreso predecible. En móvil no se eliminan rutas: se envuelven o desplazan de manera operable. Modales deben atrapar foco, cerrarse con Escape, devolver foco y no ocultar contenido a lectores.

La internacionalización separa texto, fecha, número y unidad; no concatena oraciones ni presupone longitud. Los estados RTL quedan como prueba futura si se incorpora un idioma correspondiente.
