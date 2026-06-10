import { PartOfSpeech } from "../src_dict/index.js"
import { IrregularidadesOrtograficasDeSustantivos, SustantivoExcepcional, indice_de_sustantivos } from "./sustantivos.js"
import { AtributosDePalabra, GéneroDeForma, IndiceDePalabrasAtribuidas } from "./index.js"
import { añadaSiEsNuevo, generaPlural, remueveUltimaAcento, vocales_acentados_al_final_regex } from "./genera-formas.js"
import { géneros_de_forma, setFrecuencia } from "./lib.js"


function generaFormaFemeninaSingularDeSustantivo(lema: string, irregularidades?: {f?: string}) : string {
    if (irregularidades?.f) {
        return irregularidades.f
    } else {
        const len = lema.length
        if ("eo".includes(lema.slice(-1))) {
            const root = lema.slice(0, -1)
            return root + "a"
        } else if (lema.match(vocales_acentados_al_final_regex)) {
            const sin_acento = remueveUltimaAcento(lema) + "a"
            return sin_acento
        } else if ("nr".includes(lema.slice(-1))) {
            return lema + "a"
        } else {
            return lema
        }
    }
}


function generaSingularYPluralDeSustantivo(formas: IndiceDePalabrasAtribuidas, base: string, parte: PartOfSpeech, género_de_forma: GéneroDeForma, sustantivo: SustantivoExcepcional) : void {
    const {frecuencias, solo_plural, irregularidades} = sustantivo
    if (!solo_plural) {
        const forma = irregularidades?.[<keyof IrregularidadesOrtograficasDeSustantivos> género_de_forma] || base
        const atributos: AtributosDePalabra = {parte, género: género_de_forma, singular: true}
        setFrecuencia(atributos, frecuencias)
        añadaSiEsNuevo(formas, forma, atributos)
    }
    // if (!incontable) {   // paraced que cada sustantivo incontable puede ser plural en el contexto de tipos
        let plural = (solo_plural ? base : generaPlural(base))
        const atributos: AtributosDePalabra = {parte, género: género_de_forma, singular: false}
        setFrecuencia(atributos, frecuencias)
        añadaSiEsNuevo(formas, plural, atributos)
    // }
}


function añadaFormasDeSustantivo(formas: IndiceDePalabrasAtribuidas, lema: string, parte: PartOfSpeech, sustantivo: SustantivoExcepcional) {
    const {género, solo_plural, frecuencias, irregularidades} = sustantivo
    switch (género) {
        case "m":
        case "f":
            if (irregularidades) {
                console.log(`lema=${lema} tiene irregularidades inesperadas`)
            }
            generaSingularYPluralDeSustantivo(formas, lema, parte, género, sustantivo)
            break
        case "mf":
            const femenina = generaFormaFemeninaSingularDeSustantivo(lema, irregularidades)
            if (femenina !== lema) {
                generaSingularYPluralDeSustantivo(formas, lema, parte, "m", sustantivo)
                generaSingularYPluralDeSustantivo(formas, femenina, parte, "f", sustantivo)
            } else {
                generaSingularYPluralDeSustantivo(formas, lema, parte, "mf", sustantivo)
            }
            // if (irregularidades?.n) {
            //     const atributos: AtributosDePalabra = {parte, género: "n", singular: true}
            //     añadaSiEsNuevo(formas, irregularidades.n, atributos)
            // }
            break
        case "a":
        case "v":
            if (irregularidades) {
                console.log(`lema=${lema} tiene irregularidades inesperadas`)
            }
            generaSingularYPluralDeSustantivo(formas, lema, parte, "mf", sustantivo)
            break
    }
}

export function generaFormasDeSustantivo(lema: string) : IndiceDePalabrasAtribuidas {
    const sustantivo = indice_de_sustantivos[lema]
    let formas: IndiceDePalabrasAtribuidas = {}
    if (sustantivo) {
        añadaFormasDeSustantivo(formas, lema, "NOU", {...sustantivo})
        if (sustantivo.adicional) {
            añadaFormasDeSustantivo(formas, lema, "NOU", {...sustantivo.adicional})
        }
    }
    return formas
}
