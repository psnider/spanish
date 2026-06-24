import { indice_de_adjetivos, IrregularidadesOrtograficasDeAdjetivos, Pluralidad } from "./adjetivos.js"
import { añadaSiEsNuevo, generaPlural, generaSíntetis, remueveUltimaAcento, vocales_acentados_al_final_regex } from "./genera-formas.js"
import { AtributosDePalabra, GéneroDeForma, IndiceDePalabrasAtribuidas } from "./index.js"
import { IrregularidadesOrtograficasDeSustantivos } from "./sustantivos.js"


function generaSingularYPluralDeAdjetivo(formas: IndiceDePalabrasAtribuidas, base: string, género: GéneroDeForma, opciones: {pluralidad?: Pluralidad, irregularidades?: IrregularidadesOrtograficasDeAdjetivos}) : void {
    const {pluralidad, irregularidades} = opciones
    if (pluralidad !== "p") {
        const forma = irregularidades?.[<keyof IrregularidadesOrtograficasDeAdjetivos> género] || base
        const atributos: AtributosDePalabra = {parte: "ADJ", género, pluralidad: "s"}
        const síntesis = generaSíntetis({atributos})
        añadaSiEsNuevo(formas, forma, síntesis)
    }
    if (pluralidad !== "s") {
        const clave_plural = <keyof IrregularidadesOrtograficasDeAdjetivos> (género + "pl")
        if (irregularidades?.[clave_plural]) {
            const atributos: AtributosDePalabra = {parte: "ADJ", género, pluralidad: "p"}
            const síntesis = generaSíntetis({atributos})
            añadaSiEsNuevo(formas, irregularidades[clave_plural], síntesis)
        } else {
            let plural = generaPlural(base)
            const atributos: AtributosDePalabra = {parte: "ADJ", género, pluralidad: "p"}
            const síntesis = generaSíntetis({atributos})
            añadaSiEsNuevo(formas, plural, síntesis)
        }
    }
}


function generaFormaFemeninaSingularDeAdjetivo(lema: string, irregularidades?: {f?: string}) : string {
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
        } else {
            return lema + "a"
        }
    }
}


export function generaFormasDeAdjetivo(lema: string) : IndiceDePalabrasAtribuidas {
    const adjectivo = indice_de_adjetivos[lema]
    let formas: IndiceDePalabrasAtribuidas = {}
    if (adjectivo) {
        const {géneros, pluralidad, apócope, irregularidades} = adjectivo    
        const femenina = ((géneros === "n") ? lema : generaFormaFemeninaSingularDeAdjetivo(lema, irregularidades))
        if (femenina !== lema) {
            generaSingularYPluralDeAdjetivo(formas, lema, "m", {...adjectivo})
            generaSingularYPluralDeAdjetivo(formas, femenina, "f", {...adjectivo})
        } else {
            generaSingularYPluralDeAdjetivo(formas, lema, géneros, {...adjectivo})
        }
        if ((géneros === "mf") && irregularidades?.n) {
            const atributos: AtributosDePalabra = {parte: "ADJ", género: "n", pluralidad: "s"}
            const síntesis = generaSíntetis({atributos})
            añadaSiEsNuevo(formas, irregularidades.n, síntesis)
        }
        if (apócope) {
            const atributos: AtributosDePalabra = {parte: "ADJ", género: "m", pluralidad: "s"}
            const síntesis = generaSíntetis({atributos})
            añadaSiEsNuevo(formas, apócope, síntesis)
        }
    }
    return formas
}

