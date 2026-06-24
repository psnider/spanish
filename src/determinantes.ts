import { GéneroDeLema, IrregularidadesOrtograficas } from "./index.js"
import { Frecuencias } from "./index.js"


interface Determinante {
    género: GéneroDeLema
    pluralidad: "s" | "p"
    frecuencia: number
    apócope?: string
    indet?: true
    irregularidades?: IrregularidadesOrtograficas    
}


export const indice_de_determinantes: {[lemma: string]: Determinante} = {
    el:  {género: "m", pluralidad: "s", frecuencia: 8000 },
    los: {género: "m", pluralidad: "p", frecuencia: 1500},
    lo:  {género: "n", pluralidad: "s", frecuencia: 1200},
    la:  {género: "f", pluralidad: "s", frecuencia: 6000 },
    las: {género: "f", pluralidad: "p", frecuencia: 2000},

    un:   {género: "m", pluralidad: "s", apócope: "o", frecuencia: 3500, indet: true},
    uno:  {género: "m", pluralidad: "s", frecuencia: 300, indet: true},
    unos: {género: "m", pluralidad: "p", frecuencia: 500, indet: true},
    una:  {género: "f", pluralidad: "s", frecuencia: 4000, indet: true},
    unas: {género: "f", pluralidad: "p", frecuencia: 500, indet: true},
}
