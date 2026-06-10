import assert from "assert"
import { deconstruyeIDDeFormaConjugada, generaIndiceDeFormasConjugadas } from "conjugador-espanol"
import { PartOfSpeech } from "../src_dict/index.js"
import { indice_de_adverbios } from "./adverbios.js"
import { indice_de_determinantes } from "./determinantes.js"
import { indice_de_conjunciones } from "./conjunciones.js"
import { indice_de_contracciones } from "./contraciones.js"
import { generaFormasDeAdjetivo } from "./genera-formas-de-adjetivos.js"
import { generaFormasDeSustantivo } from "./genera-formas-de-sustantivos.js"
import { AtributosBase, AtributosDeDeterminante, AtributosDePalabra, AtributosDePronombre, AtributosDeVerbo, GéneroDeForma, IndiceDePalabrasAtribuidas } from "./index.js"
import { indice_de_interjecciones } from "./interjecciones.js"
import { indice_de_onomatopeya } from "./onomatopeya.js"
import { indice_de_preposiciones } from "./preposiciones.js"
import { indice_de_pronombres } from "./pronombres-etc.js"
import { indice_de_sustantivos } from "./sustantivos.js"
import { indice_de_adjetivos } from "./adjetivos.js"
import { géneros_de_forma, setFrecuencia } from "./lib.js"


function generaTodosFormasDeSustantivos(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_sustantivos) {
        const formas = generaFormasDeSustantivo(lema)
        for (let forma in formas) {
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(...formas[forma])
        }
    }
}


function generaTodosFormasDeAdjetivos(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_adjetivos) {
        const formas = generaFormasDeAdjetivo(lema)
        for (let forma in formas) {
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(...formas[forma])
        }
    }
}


function generaTodosFormasDeAdverbios(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_adverbios) {
        const adverbio = indice_de_adverbios[lema]
        const adverbio_copia = {...adverbio}
        // Los adverbios no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(adverbio_copia)
    }
}


function generaTodosFormasDePreposiciones(todas_formas: IndiceDePalabrasAtribuidas) {
    const parte: PartOfSpeech = "ADP"
    for (let lema in indice_de_preposiciones) {
        const preposición = indice_de_preposiciones[lema]
        const preposición_copia = {parte, ...preposición}
        // Los preposiciones no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(preposición_copia)
    }
}


function generaTodosFormasDeDeterminantes(todas_formas: IndiceDePalabrasAtribuidas) {
    const parte: PartOfSpeech = "DET"
    for (let lema in indice_de_determinantes) {
        const determinante = indice_de_determinantes[lema]
        //  Cómo puede asignar un tipo diferente a determinante_copia
        const { género: género_de_lema, ...resto } = determinante;
        const género: GéneroDeForma = (géneros_de_forma.includes(género_de_lema) ? <GéneroDeForma> género_de_lema : "mf")
        const atributos: AtributosDeDeterminante = {parte, género, ...resto}
        // Los artículos no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(atributos)
    }
}


function generaTodosFormasDePronombres(todas_formas: IndiceDePalabrasAtribuidas) {
    const parte: PartOfSpeech = "PRN"
    for (let lema in indice_de_pronombres) {
        const pronombre = indice_de_pronombres[lema]
        //  Cómo puede asignar un tipo diferente a determinante_copia
        const { género: género_de_lema, frecuencias, ...resto } = pronombre;
        const género: GéneroDeForma = (géneros_de_forma.includes(género_de_lema) ? <GéneroDeForma> género_de_lema : "mf")
        const pronombre_copia: AtributosDePronombre = {parte, género, ...resto}
        // Los pronombres no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(<AtributosDePronombre> pronombre_copia)

    }
}



function generaTodosFormasDeConjunciones(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_conjunciones) {
        const conjunción = indice_de_conjunciones[lema]
        const {cambio_por_sandhi} = conjunción
        todas_formas[lema] = todas_formas[lema] || []
        for (let parte of conjunción.partes) {
            // Los conjunciones no cambian, pero puede tener multiples usos
            // Nota de implementación: va a reemplazar el campo parte: "SCONJ"
            let conjunción_copia = <AtributosBase> {parte, ...conjunción}
            delete (<any> conjunción_copia).partes
            delete (<any> conjunción_copia).cambio_por_sandhi
            todas_formas[lema].push(conjunción_copia)
            if (cambio_por_sandhi) {
                todas_formas[cambio_por_sandhi] = todas_formas[cambio_por_sandhi] || []
                todas_formas[cambio_por_sandhi].push(conjunción_copia)
            }
        }
    }
}



function generaTodosFormasDeContracciones(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_contracciones) {
        const contracción = indice_de_contracciones[lema]
        const contracción_copia = {...contracción}
        // Los artículos no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(contracción_copia)
    }
}


function generaTodosFormasDeInterjecciones(todas_formas: IndiceDePalabrasAtribuidas) {
    const parte: PartOfSpeech = "INT"
    for (let lema in indice_de_interjecciones) {
        const interjeccion = indice_de_interjecciones[lema]
        const interjeccion_copia = {parte, ...interjeccion}
        // Los artículos no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(interjeccion_copia)
    }
}


function generaTodosFormasDeOnomatopeya(todas_formas: IndiceDePalabrasAtribuidas) {
    const parte: PartOfSpeech = "ONO"
    for (let lema in indice_de_onomatopeya) {
        const onomatopeya = indice_de_onomatopeya[lema]
        const onomatopeya_copia = {parte, ...onomatopeya}
        // Los artículos no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(onomatopeya_copia)
    }
}


function generaTodosFormasDeOVerbos(todas_formas: IndiceDePalabrasAtribuidas) {
    const formas_de_verbos = generaIndiceDeFormasConjugadas()
    for (let forma in formas_de_verbos) {
        const ids = formas_de_verbos[forma]
        for (let id of ids) {
            const partes = deconstruyeIDDeFormaConjugada(id)
            let atributos: AtributosDeVerbo = {parte: "VRB", ...partes}
            if (!partes.uso) {
                delete atributos.uso
            }
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(atributos)
        }
    }
}


function ordenaPorFrecuencia(todas_formas: IndiceDePalabrasAtribuidas) {
    function cmpFrecuenciaAscendiente(lhs: AtributosDePalabra, rhs: AtributosDePalabra) {
        if (!lhs.frecuencia && !rhs.frecuencia) {
            return 0
        } else {
            const lhs_frecuencia = lhs.frecuencia || 1
            const rhs_frecuencia = rhs.frecuencia || 1
            return (rhs_frecuencia - lhs_frecuencia)
        }
    }
    for (let forma in todas_formas) {
        const formas = todas_formas[forma]
        formas.sort((lhs, rhs) => {
            return cmpFrecuenciaAscendiente(lhs, rhs)
        })
    }
}


export function generaTodasFormasDeTodasPalabras() : IndiceDePalabrasAtribuidas {
    const todas_formas: IndiceDePalabrasAtribuidas = {}
    generaTodosFormasDeSustantivos(todas_formas)
    generaTodosFormasDeAdjetivos(todas_formas)
    generaTodosFormasDeAdverbios(todas_formas)
    generaTodosFormasDePronombres(todas_formas)
    generaTodosFormasDePreposiciones(todas_formas)
    generaTodosFormasDeDeterminantes(todas_formas)
    generaTodosFormasDeConjunciones(todas_formas)
    generaTodosFormasDeInterjecciones(todas_formas)
    generaTodosFormasDeOnomatopeya(todas_formas)
    generaTodosFormasDeContracciones(todas_formas)
    generaTodosFormasDeOVerbos(todas_formas)
    ordenaPorFrecuencia(todas_formas)
    return todas_formas
}


