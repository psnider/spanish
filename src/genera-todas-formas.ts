import { derivaAdjetivosDeParticipios, generaIndiceDeFormasConjugadas } from "conjugador-espanol"
import { indice_de_adverbios } from "./adverbios.js"
import { indice_de_determinantes } from "./determinantes.js"
import { indice_de_conjunciones } from "./conjunciones.js"
import { indice_de_contracciones } from "./contracciones.js"
import { generaFormasDeAdjetivo } from "./genera-formas-de-adjetivos.js"
import { generaFormasDeSustantivo } from "./genera-formas-de-sustantivos.js"
import { AtributosDeContracción, AtributosDeDeterminante, AtributosDePronombre, AtributosSintetizados, GéneroDeForma, IndiceDePalabrasAtribuidas } from "./index.js"
import { indice_de_interjecciones } from "./interjecciones.js"
import { indice_de_onomatopeya } from "./onomatopeya.js"
import { indice_de_preposiciones } from "./preposiciones.js"
import { indice_de_pronombres } from "./pronombres-etc.js"
import { indice_de_sustantivos } from "./sustantivos.js"
import { indice_de_adjetivos } from "./adjetivos.js"
import { géneros_de_forma } from "./lib.js"
import { generaSíntetis } from "./genera-formas.js"
import { generaFormasDePronombre } from "./genera-formas-de-pronombres.js"
import assert from "assert"


function generaTodosFormasDeSustantivos(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_sustantivos) {
        const formas = generaFormasDeSustantivo(lema)
        for (let forma in formas) {
            const sustantivo = formas[forma]
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(...formas[forma])
        }
    }
}


function generaTodosFormasDeAdjetivos(todas_formas: IndiceDePalabrasAtribuidas) {
    const adjetivos_de_participios = derivaAdjetivosDeParticipios()
    for (let adjetivo of adjetivos_de_participios) {
        assert( ! indice_de_adjetivos[adjetivo.adj], `inesperado adjetivo=${adjetivo.adj}, que proviene de un verbo como participio pasado, cuales son dervidos por derivaAdjetivosDeParticipios()`)
        indice_de_adjetivos[adjetivo.adj] = {géneros: "mf"}
    }
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
        todas_formas[lema] = todas_formas[lema] || []
        // Los adverbios no cambian
        const síntesis = generaSíntetis({parte: "ADV", atributos: adverbio})
        todas_formas[lema].push(síntesis)
    }
}


function generaTodosFormasDePreposiciones(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_preposiciones) {
        const preposición = indice_de_preposiciones[lema]
        // Los preposiciones no cambian
        const síntesis = generaSíntetis({parte: "ADP", atributos: preposición})
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(síntesis)
    }
}


function generaTodosFormasDeDeterminantes(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_determinantes) {
        const determinante = indice_de_determinantes[lema]
        //  Cómo puede asignar un tipo diferente a determinante_copia
        const { género: género_de_lema, ...resto } = determinante;
        const género: GéneroDeForma = (géneros_de_forma.includes(género_de_lema) ? <GéneroDeForma> género_de_lema : "mf")
        const atributos: AtributosDeDeterminante = {parte: "DET", género, ...resto}
        // Los artículos no cambian
        const síntesis = generaSíntetis({parte: "DET", atributos})
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(síntesis)
    }
}


function generaTodosFormasDePronombres(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_pronombres) {
        // const pronombre = indice_de_pronombres[lema]
        //  Cómo puede asignar un tipo diferente a determinante_copia
        // const { género: género_de_lema, frecuencias, ...resto } = pronombre;
        // const género: GéneroDeForma = (géneros_de_forma.includes(género_de_lema) ? <GéneroDeForma> género_de_lema : "mf")
        // const atributos: AtributosDePronombre = {parte: "PRN", género, ...resto}
        const formas = generaFormasDePronombre(lema)
        for (let forma in formas) {
            const síntesis = formas[forma]
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(...síntesis)
        }
    }
}


function generaTodosFormasDeConjunciones(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_conjunciones) {
        const conjunción = indice_de_conjunciones[lema]
        const {cambio_por_sandhi} = conjunción
        todas_formas[lema] = todas_formas[lema] || []
        // Nota de implementación: va a reemplazar el campo parte: "CON", "SUB"
        for (let parte of conjunción.partes) {
            // Los conjunciones no cambian, pero puede tener multiples usos
            const síntesis = generaSíntetis({parte, atributos: conjunción})
            todas_formas[lema].push(síntesis)
            if (cambio_por_sandhi) {
                todas_formas[cambio_por_sandhi] = todas_formas[cambio_por_sandhi] || []
                todas_formas[cambio_por_sandhi].push(síntesis)
            }
        }
    }
}


export function generaListaDePalabrasConAtributos(atributos: AtributosDeContracción) : string {
    let lista = ""
    for (let porción of atributos.expandido) {
        const {palabra, atributos} = porción
        const síntesis = generaSíntetis({atributos})
        const carácter_separador = lista ? "+" : "="
        lista += `${carácter_separador}${palabra}:${síntesis}`
    }
    return lista
}


function generaTodosFormasDeContracciones(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_contracciones) {
        const contracción = indice_de_contracciones[lema]
        // Los contracciones no cambian
        // FIX: crea function
        const lista = generaListaDePalabrasConAtributos(contracción)
        // FIX: apoya frecuencia
        const síntesis = `CTN${lista}`
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(síntesis)
    }
}


function generaTodosFormasDeInterjecciones(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_interjecciones) {
        const interjeccion = indice_de_interjecciones[lema]
        // Los artículos no cambian
        const síntesis = generaSíntetis({parte: "INT", atributos: interjeccion})
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(síntesis)
    }
}


function generaTodosFormasDeOnomatopeya(todas_formas: IndiceDePalabrasAtribuidas) {
    for (let lema in indice_de_onomatopeya) {
        const onomatopeya = indice_de_onomatopeya[lema]
        const síntesis = generaSíntetis({parte: "ONO", atributos: onomatopeya})
        // Los artículos no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(síntesis)
    }
}


function generaTodosFormasDeVerbos(todas_formas: IndiceDePalabrasAtribuidas) {
    function esInfinitivo(id: string) {
        return id.includes(",inf")
    }
    function remueveInfinitivo(id: string, forma: string) {
        id = id.replace(forma + ",", "")
        return id
    }
    const formas_de_verbos = generaIndiceDeFormasConjugadas()
    for (let forma in formas_de_verbos) {
        const ids = formas_de_verbos[forma]
        for (let id of ids) {
            if (esInfinitivo(id)) {
                id = remueveInfinitivo(id, forma)
            }
            let síntesis = "VRB," + id
            // const partes = deconstruyeIDDeFormaConjugada(id)
            // let atributos: AtributosDeVerbo = {parte: "VRB", ...partes}
            // if (!partes.uso) {
            //     delete atributos.uso
            // }
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(síntesis)
        }
    }
}


function ordenaPorFrecuencia(todas_formas: IndiceDePalabrasAtribuidas) {
    function determinaFrecuencia(atrs: AtributosSintetizados) {
        const match = atrs.match(/f=([\d\.]+)/)
        if (match) {
            return parseInt(match[1])
        } else {
            return 1
        }
    }
    function cmpFrecuenciaAscendiente(lhs: AtributosSintetizados, rhs: AtributosSintetizados) {
        const lhs_frecuencia = determinaFrecuencia(lhs)
        const rhs_frecuencia = determinaFrecuencia(rhs)
        return (rhs_frecuencia - lhs_frecuencia)
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
    generaTodosFormasDeVerbos(todas_formas)
    ordenaPorFrecuencia(todas_formas)
    return todas_formas
}

