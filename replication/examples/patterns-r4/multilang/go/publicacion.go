package publicacionversionada

import "errors"

// Resultado propone un cambio; no realiza persistencia ni un intercambio atómico.
type Resultado struct {
	ActivaPropuesta   string
	Anterior          string
	RollbackPropuesto string
	Persistida        bool
}

func Publicar(activa, candidata string, verificada bool) (Resultado, error) {
	if !verificada {
		return Resultado{}, errors.New("la candidata no fue verificada")
	}
	if activa == "" || candidata == "" || activa == candidata {
		return Resultado{}, errors.New("las versiones deben ser distintas y explícitas")
	}
	return Resultado{ActivaPropuesta: candidata, Anterior: activa, RollbackPropuesto: activa, Persistida: false}, nil
}
