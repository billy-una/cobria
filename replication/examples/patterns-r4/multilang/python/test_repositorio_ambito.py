import unittest

from repositorio_ambito import AmbitoDenegado, RepositorioObservaciones


class RepositorioConAmbitoTest(unittest.TestCase):
    def setUp(self):
        self.repositorio = RepositorioObservaciones(
            [{"id": "obs-184", "ambito": "las-tablas", "especie": "quetzal"}]
        )

    def test_entrega_un_documento_del_ambito_autorizado(self):
        documento = self.repositorio.buscar("obs-184", "las-tablas")
        self.assertEqual(documento["especie"], "quetzal")

    def test_no_revela_si_el_documento_existe_en_otro_ambito(self):
        with self.assertRaises(AmbitoDenegado):
            self.repositorio.buscar("obs-184", "corcovado")

    def test_claves_reservadas_son_identificadores_y_no_propiedades(self):
        for clave in ['constructor', '__proto__', 'toString']:
            repositorio = RepositorioObservaciones([{'id': clave, 'ambito': 'sur'}])
            self.assertEqual(repositorio.buscar(clave, 'sur')['id'], clave)

    def test_copia_devuelta_no_modifica_el_documento_original(self):
        copia = self.repositorio.buscar('obs-184', 'las-tablas')
        copia['ambito'] = 'otra'
        self.assertEqual(self.repositorio.buscar('obs-184', 'las-tablas')['ambito'], 'las-tablas')


if __name__ == "__main__":
    unittest.main()
