import { Género, IrregularidadesOrtograficas } from "./index.js"

interface Artículo {
    género: Género
    noun?: true
    pron?: true
    determinante?: true
    irregularidades?: IrregularidadesOrtograficas    
}


export const indice_de_artículos: {[lemma: string]: Artículo} = {
    el: {género: "mf",  irregularidades: {f: "la", mpl: "los", fpl: "las", n: "lo"}},   // noun: true, pron: true,
    un: {género: "mf",  irregularidades: {f: "una", mpl: "unos", fpl: "unas"}},   // noun: true, pron: true,
}
