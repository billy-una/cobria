package publicacionversionada

import "testing"

func TestProponeUnaCandidataSinPersistir(t *testing.T) {
	resultado, err := Publicar("cobertura-v6", "cobertura-v7", true)
	if err != nil || resultado.ActivaPropuesta != "cobertura-v7" || resultado.RollbackPropuesto != "cobertura-v6" || resultado.Persistida {
		t.Fatalf("publicación inesperada: %#v, %v", resultado, err)
	}
}

func TestRechazaUnaCandidataSinVerificar(t *testing.T) {
	if _, err := Publicar("cobertura-v6", "cobertura-v7", false); err == nil {
		t.Fatal("se aceptó una candidata sin verificar")
	}
}
