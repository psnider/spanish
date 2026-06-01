import assert from "node:assert"
import { AtributosBase, AtributosDePalabra, IndiceDePalabrasAtribuidas } from "./index.js"


const vocales = "aáeéiíoóuú"


const map_acentado_a_inacentuado: {[acentado: string]: string} = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u"
}
export function remueveUltimaAcento(forma: string) {
    const acentado = forma.slice(-2, -1)
    const inacentado = map_acentado_a_inacentuado[acentado]
    assert(inacentado, `forma=${forma} debo tener vocal acentado`)
    const removed = forma.slice(0, -2) + inacentado + forma.slice(-1)
    return removed
}


export const vocales_acentados_al_final_regex = /[áéíóú][ns]$/


export function generaPlural(forma: string) : string {
    let plural: string
    if (forma.endsWith("z")) {
        plural = forma.slice(0,-1) + "ces"
    } else if (forma.match(vocales_acentados_al_final_regex)) {
        plural = remueveUltimaAcento(forma) + "es"
    } else {
        const terminación = (vocales.includes(forma.slice(-1)) ? "s" : "es")
        plural = forma + terminación
    }
    return plural
}


function atributosEqual<T extends AtributosBase>(lhs: T, rhs: T) : boolean {
    if (lhs.parte !== rhs.parte) return false
    // estas comparaciones funcionan aun los campos no existan
    if ((<any> lhs)?.género !== (<any> rhs)?.género) return false
    if ((<any> lhs)?.singular !== (<any> rhs)?.singular) return false
    return true
}

export function añadaSiEsNuevo(formas: IndiceDePalabrasAtribuidas, forma: string, atributos: AtributosDePalabra) {
    const lista = formas[forma]
    if (lista) {
        for (let i in lista) {
            if (atributosEqual(atributos, lista[i])) {
                return
            }
        }
    } else {
        formas[forma] = formas[forma] || []
    }
    formas[forma].push(atributos)
}
