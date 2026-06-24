import { PartOfSpeech } from "../src_dict/index.js"
import { IrregularidadesOrtograficasDeSustantivos, SustantivoExcepcional, indice_de_sustantivos } from "./sustantivos.js"
import { AtributosDePalabra, GéneroDeForma, IndiceDePalabrasAtribuidas } from "./index.js"
import { añadaSiEsNuevo, generaPlural, generaSíntetis, remueveUltimaAcento, vocales_acentados_al_final_regex } from "./genera-formas.js"
import { géneros_de_forma, setFrecuencia } from "./lib.js"
import assert from "assert"


function generaFormaFemeninaSingularDeSustantivo(lema: string, irregularidades?: {f?: string}) : string {
    if (irregularidades?.f) {
        return irregularidades.f
    } else {
        const len = lema.length
        if (lema.endsWith("ez")) {
            return lema + "a"
        } else if ("eo".includes(lema.slice(-1))) {
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
        const atributos: AtributosDePalabra = {parte, género: género_de_forma, pluralidad: "s"}
        setFrecuencia(atributos, frecuencias)
        const síntesis = generaSíntetis({atributos})
        añadaSiEsNuevo(formas, forma, síntesis)
    }
    // TODO: es posible utilizar reglas de acentuación en lugar de irregularidades, vea "imágenes"
    const clave_plural = <keyof IrregularidadesOrtograficasDeSustantivos> (género_de_forma + "pl")
    let plural = (irregularidades?.[clave_plural]) || (solo_plural ? base : generaPlural(base))
    const atributos: AtributosDePalabra = {parte, género: género_de_forma, pluralidad: "p"}
    setFrecuencia(atributos, frecuencias)
    const síntesis = generaSíntetis({atributos})
    añadaSiEsNuevo(formas, plural, síntesis)
}


function añadaFormasDeSustantivo(formas: IndiceDePalabrasAtribuidas, lema: string, parte: PartOfSpeech, sustantivo: SustantivoExcepcional) {
    const {género, solo_plural, frecuencias, irregularidades} = sustantivo
    switch (género) {
        case "m":
        case "f":
            // if (irregularidades) {
            //     console.log(`lema=${lema} tiene irregularidades inesperadas`)
            // }
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
            //     const atributos: AtributosDePalabra = {parte, género: "n", pluralidad: "s"}
            //     añadaSiEsNuevo(formas, irregularidades.n, atributos)
            // }
            break
        case "a":
        case "v":
            // if (irregularidades) {
            //     console.log(`lema=${lema} tiene irregularidades inesperadas`)
            // }
            generaSingularYPluralDeSustantivo(formas, lema, parte, "m", sustantivo)
            generaSingularYPluralDeSustantivo(formas, lema, parte, "f", sustantivo)
            break
    }
}


// la pared, la mano,
const terminaciones_femininas_regex = /((a|á|e|o)s?)|((d|l|ión|o|r|z)(es)?)$/


function verificaConsistenciaDeEspecificación(lema: string, sustantivo: SustantivoExcepcional) {
    const género_de_sustantivo = sustantivo.género
    for (let id_restrigindo of sustantivo.significados) {
        const componentes = id_restrigindo.id.split(",")
        const forma = componentes[0]
        const género_de_forma = componentes[1]
        if (género_de_forma === "f") {
            if (género_de_sustantivo !== "a") {
                if (lema !== forma) {
                    const match = forma.match(terminaciones_femininas_regex)
                    assert(match, `${lema} (femenina) tiene una forma incongruente: ${forma}`)
                }
            }
        } else {
            assert(lema === forma, `${lema} tiene una forma incongruente: ${forma}`)
        }
    }
}


export function generaFormasDeSustantivo(lema: string) : IndiceDePalabrasAtribuidas {
    const sustantivo = indice_de_sustantivos[lema]
    let formas: IndiceDePalabrasAtribuidas = {}
    if (sustantivo) {
        verificaConsistenciaDeEspecificación(lema, sustantivo)
        añadaFormasDeSustantivo(formas, lema, "NOU", {...sustantivo})
        if (sustantivo.adicional) {
            añadaFormasDeSustantivo(formas, lema, "NOU", {...sustantivo.adicional})
        }
    }
    let necesita_f = (sustantivo.género !== "m")
    let necesita_m = (sustantivo.género !== "f")
    let tiene_f = false
    let tiene_m = false
    const género_de_sustantivo = sustantivo.género
    for (let forma in formas) {
        const ids = formas[forma]
        for (let id of ids) {
            const componentes = id.split(",")
            const género_de_forma = componentes[1]
            if (género_de_forma !== "f") {
                tiene_m = true
            }
            if (género_de_forma !== "m") {
                tiene_f = true
            }
        }
    }
    assert(!necesita_f || tiene_f, `${lema} necesita una forma feminina`)
    assert(!necesita_m || tiene_m, `${lema} necesita una forma masculina`)
    return formas
}
