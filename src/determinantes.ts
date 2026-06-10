import { GéneroDeLema, IrregularidadesOrtograficas } from "./index.js"
import { Frecuencias } from "./index.js"


interface Determinante {
    género: GéneroDeLema
    singular: boolean
    frecuencia: number
    apócope?: string
    // noun?: true
    // pron?: true
    determinante?: true
    indeterminado?: true
    irregularidades?: IrregularidadesOrtograficas    
}


export const indice_de_determinantes: {[lemma: string]: Determinante} = {
    el:  {género: "m", singular: true, frecuencia: 8000 },
    los: {género: "m", singular: false, frecuencia: 1500},
    lo:  {género: "n", singular: false, frecuencia: 1200},
    la:  {género: "f", singular: true, frecuencia: 6000 },
    las: {género: "f", singular: false, frecuencia: 2000},

    un:   {género: "m", singular: true, apócope: "o", frecuencia: 3500, indeterminado: true},
    uno:  {género: "m", singular: true, frecuencia: 300, indeterminado: true},
    unos: {género: "m", singular: false, frecuencia: 500, indeterminado: true},
    una:  {género: "f", singular: true, frecuencia: 4000, indeterminado: true},
    unas: {género: "f", singular: false, frecuencia: 500, indeterminado: true},
}
