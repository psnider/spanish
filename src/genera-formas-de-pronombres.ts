import { añadaSiEsNuevo, generaPlural, generaSíntetis, remueveUltimaAcento, vocales_acentados_al_final_regex } from "./genera-formas.js"
import { AtributosDePalabra, AtributosDePronombre, Frecuencias, GéneroDeForma, IndiceDePalabrasAtribuidas, IrregularidadesOrtograficas } from "./index.js"
import { indice_de_pronombres, Pronombre } from "./pronombres-etc.js"
import { géneros_de_forma, setFrecuencia } from "./lib.js"


function generaSingularYPluralDePronombre(formas: IndiceDePalabrasAtribuidas, base: string, género: GéneroDeForma, atributos: AtributosDePronombre, opciones: {solo_singular?: boolean, solo_plural?: boolean, irregularidades?: IrregularidadesOrtograficas, frecuencias?: Frecuencias}) : void {
    const {solo_singular, solo_plural, irregularidades, frecuencias} = opciones
    let forma = irregularidades?.[<keyof IrregularidadesOrtograficas> género] || base
    if (!solo_plural) {
        setFrecuencia(atributos, frecuencias)
        const síntesis = generaSíntetis({parte: "PRN", atributos: {...atributos, género, pluralidad: "s"}})
        añadaSiEsNuevo(formas, forma, síntesis)
    }
    if (!solo_singular) {
        const clave_plural = <keyof IrregularidadesOrtograficas> (género + "pl")
        forma = irregularidades?.[clave_plural] || (solo_plural ? forma : generaPlural(forma))
        setFrecuencia(atributos, frecuencias)
        const síntesis = generaSíntetis({parte: "PRN", atributos: {...atributos, género, pluralidad: "p"}})
        añadaSiEsNuevo(formas, forma, síntesis)
    }
}


function generaFormaFemeninaSingularDePronombre(lema: string, irregularidades?: {f?: string}) : string {
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


const orden_de_alternativos = ["m", "mpl", "f", "fpl", "n"]
function añadaAlternativos(formas: IndiceDePalabrasAtribuidas, atributos: AtributosDePronombre, alternativos: IrregularidadesOrtograficas, frecuencias?: Frecuencias) {
    for (let key of orden_de_alternativos) {
        const forma = alternativos[<keyof IrregularidadesOrtograficas> key]
        if (forma) {
            const género = <GéneroDeForma> key[0]
            const pluralidad = (key.length === 1) ? "s" : "p"
            const atributos_de_forma: AtributosDePronombre = {...atributos, género, pluralidad}
            setFrecuencia(atributos_de_forma, frecuencias)
            const síntesis = generaSíntetis({parte: "PRN", atributos: atributos_de_forma})
            añadaSiEsNuevo(formas, forma, síntesis)
        }
    }
}


export function generaFormasDePronombre(lema: string) : IndiceDePalabrasAtribuidas | undefined {
    if (lema === "quién") debugger
    const pronombre = indice_de_pronombres[lema]
    if (pronombre) {
        const {sujeto, géneros, solo_singular, solo_plural, apócope, frecuencias, irregularidades, alternativos, alternativo, ...resto} = pronombre
        const género: GéneroDeForma = (géneros_de_forma.includes(géneros) ? <GéneroDeForma> géneros : "mf")
        const atributos: AtributosDePronombre = {parte: "PRN", género, ...resto}
        let formas: IndiceDePalabrasAtribuidas = {}
        if (!solo_plural) {
            const hay_feminina = ((género === "f") || (género === "mf"))
            const femenina = hay_feminina && generaFormaFemeninaSingularDePronombre(lema, irregularidades)
            if (femenina) {
                generaSingularYPluralDePronombre(formas, lema, "m", atributos, {solo_singular, solo_plural, irregularidades, frecuencias})
                generaSingularYPluralDePronombre(formas, femenina, "f", atributos, {solo_singular, solo_plural, irregularidades,frecuencias})
            } else {
                generaSingularYPluralDePronombre(formas, lema, género, atributos, {solo_singular, solo_plural, irregularidades, frecuencias})
            }
        }
        if (!solo_singular) {
            generaSingularYPluralDePronombre(formas, lema, "m", atributos, {solo_singular, solo_plural, irregularidades, frecuencias})
            generaSingularYPluralDePronombre(formas, lema, "f", atributos, {solo_singular, solo_plural, irregularidades, frecuencias})
        }
        if ((géneros === "mf") && irregularidades?.n) {
            setFrecuencia(atributos, frecuencias)
            const síntesis = generaSíntetis({parte: "PRN", atributos: {...atributos, género: "n", pluralidad: "s"}})
            añadaSiEsNuevo(formas, irregularidades.n, síntesis)
        }
        if (apócope) {
            const forma_corta = lema.slice(0, -apócope.length)
            const atributos: AtributosDePalabra = {parte: "ADJ", género: "m", pluralidad: "s"}
            const síntesis = generaSíntetis({atributos})
            añadaSiEsNuevo(formas, forma_corta, síntesis)
        }
        if (alternativo) {
            setFrecuencia(atributos, frecuencias)
            const síntesis = generaSíntetis({parte: "PRN", atributos: {...atributos, género: "n", pluralidad: "s"}})
            añadaSiEsNuevo(formas, alternativo, síntesis)
        }
        if (alternativos) {
            añadaAlternativos(formas, atributos, alternativos, frecuencias)
        }
        return formas
    }
}

