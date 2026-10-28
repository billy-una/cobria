"""Patrón 03: el ámbito se valida antes de entregar un documento."""


class AmbitoDenegado(ValueError):
    pass


class RepositorioObservaciones:
    def __init__(self, documentos):
        self._documentos = {documento["id"]: dict(documento) for documento in documentos}

    def buscar(self, observacion_id, ambito_solicitado):
        if not ambito_solicitado:
            raise AmbitoDenegado("El ámbito es obligatorio")
        documento = self._documentos.get(observacion_id)
        if documento is None or documento["ambito"] != ambito_solicitado:
            raise AmbitoDenegado("El documento no pertenece al ámbito autorizado")
        return dict(documento)
