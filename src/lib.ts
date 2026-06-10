import { AtributosDePalabra, Frecuencias } from "./index.js"

export const géneros_de_forma = ["m", "f", "mf", "n"]


export function setFrecuencia(atributos: AtributosDePalabra, frecuencias?: Frecuencias) {
    if (frecuencias) {
        if (frecuencias.general) {
            atributos.frecuencia = frecuencias.general
        } else {
            const género = (<any> atributos).género
            if (género) {
                let clave = género
                if ("singular" in atributos) {
                    if (! atributos.singular) {
                        clave += "p"
                    }
                }
                atributos.frecuencia = frecuencias?.[<keyof Frecuencias> clave] || 1
            }
        }
    }
}


