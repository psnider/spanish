import { PartOfSpeech } from "../src_dict/index.js"
import { GéneroDeSustantivo, IrregularidadesOrtograficasDeSustantivos, indice_de_sustantivos } from "./sustantivos.js"
import { indice_de_artículos } from "./artículos.js"
import { AtributosDePalabra, GéneroDeForma, IndiceDePalabrasAtribuidas } from "./index.js"
import { añadaSiEsNuevo, generaPlural, remueveUltimaAcento, vocales_acentados_al_final_regex } from "./genera-formas.js"



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


function generaSingularYPluralDeSustantivo(formas: IndiceDePalabrasAtribuidas, base: string, parte: PartOfSpeech, opciones: {género: GéneroDeForma, incontable?: boolean, solo_plural?: boolean, irregularidades?: IrregularidadesOrtograficasDeSustantivos}) : void {
    const {género, incontable, solo_plural, irregularidades} = opciones
    if (!solo_plural) {
        const forma = irregularidades?.[<keyof IrregularidadesOrtograficasDeSustantivos> género] || base
        const atributos: AtributosDePalabra = {parte, género, singular: true}
        añadaSiEsNuevo(formas, forma, atributos)
    }
    if (!incontable) {
        let plural = (solo_plural ? base : generaPlural(base))
        const atributos: AtributosDePalabra = {parte, género, singular: false}
        añadaSiEsNuevo(formas, plural, atributos)
    }
}


function añadaFormasDeSustantivo(formas: IndiceDePalabrasAtribuidas, lema: string, parte: PartOfSpeech, opciones: {género?: GéneroDeSustantivo, solo_plural?: true, irregularidades?: IrregularidadesOrtograficasDeSustantivos}) {
    const {género, solo_plural, irregularidades} = opciones
    switch (género) {
        case "m":
        case "f":
            if (irregularidades) {
                console.log(`lema=${lema} tiene irregularidades inesperadas`)
            }
            generaSingularYPluralDeSustantivo(formas, lema, parte, {género, solo_plural, irregularidades})
            break
        case "mf":
            const femenina = generaFormaFemeninaSingularDeSustantivo(lema, irregularidades)
            if (femenina !== lema) {
                generaSingularYPluralDeSustantivo(formas, lema, parte, {género: "m", solo_plural, irregularidades})
                generaSingularYPluralDeSustantivo(formas, femenina, parte, {género: "f", solo_plural, irregularidades})
            } else {
                generaSingularYPluralDeSustantivo(formas, lema, parte, {género: "mf", solo_plural, irregularidades})
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
            generaSingularYPluralDeSustantivo(formas, lema, parte, {género: "mf", solo_plural})
            break
    }
}

export function generaFormasDeSustantivo(lema: string) : IndiceDePalabrasAtribuidas {
    const sustantivo = indice_de_sustantivos[lema]
    let formas: IndiceDePalabrasAtribuidas = {}
    if (sustantivo) {
        añadaFormasDeSustantivo(formas, lema, "NOUN", {...sustantivo})
        if (sustantivo.adicional) {
            añadaFormasDeSustantivo(formas, lema, "NOUN", {...sustantivo.adicional})
        }
    }
    return formas
}
