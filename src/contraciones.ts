import { AtributosDeContracción, AtributosDePalabra } from "./index.js"



export const indice_de_contracciones: {[lemma: string]: AtributosDeContracción} = {
    al: {parte: "CTN", expandido: [{palabra: "a", atributos: {parte: "ADP"}}, {palabra: "el", atributos: {parte: "DET", género: "m", singular: true}}]},
    del: {parte: "CTN", expandido: [{palabra: "de", atributos: {parte: "ADP"}}, {palabra: "el", atributos: {parte: "DET", género: "m", singular: true}}]},
}

