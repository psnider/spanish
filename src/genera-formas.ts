import assert from "node:assert"
import { AtributosDePalabra, AtributosSintetizados, IndiceDePalabrasAtribuidas } from "./index.js"
import { PartOfSpeech } from "../src_dict/index.js"


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

export function remueveAcentoDeTerminaciónDeEnclisis(forma: string) {
    function remueveAcento(c: string) {
        return map_acentado_a_inacentuado[c] || c
    }
    const anterior = forma.slice(0, -2)
    const terminación_0 = forma.slice(-2, -1)
    const terminación_1 = forma.slice(-1)
    const terminación_inacentado = remueveAcento(terminación_0) + remueveAcento(terminación_1)
    const removed = anterior + terminación_inacentado
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


export function añadaSiEsNuevo(formas: IndiceDePalabrasAtribuidas, forma: string, síntesis: AtributosSintetizados) {
    formas[forma] = formas[forma] || []
    for (let existente of formas[forma]) {
        if (síntesis === existente) {
            return
        }
    }
    formas[forma].push(síntesis)
}


// Las abreviaturas utilizadas por DLE
const atributos_con_valores_únicos = [ "género", "pluralidad" ]
const etiquetas_de_pronombres = [ "ger", "inf", "od", "oi", "op", "part",
                    "advers", "causal", "comp", "conc", "copulat", "dem", "distrib",
                    "excl", "indef", "indet", "interrog", "poses", "relat" ]

export function generaSíntetis(args: {parte?: PartOfSpeech, atributos: AtributosDePalabra}) : AtributosSintetizados {
    const {atributos} = args
    const {parte, ...resto} = atributos
    assert(args.parte || parte, `debe poner un valor a parte`)
    let síntesis: string = <string> (args.parte || parte)
    let etiquetas = ""
    const nombres_de_atributos = Object.keys(resto)
    for (let nombre of nombres_de_atributos) {
        if (atributos_con_valores_únicos.includes(nombre)) {
            const valor = atributos[<keyof AtributosDePalabra> nombre]
            if (valor) {
                síntesis += `,${valor}`
            }
        } else if (etiquetas_de_pronombres.includes(nombre)) {
            etiquetas += `,${nombre}`
        }
    }
    síntesis += etiquetas
    if (atributos.frecuencia) {
        síntesis += `,f=${atributos.frecuencia}`
    }
    return síntesis
}

