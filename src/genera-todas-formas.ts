import { PartOfSpeech } from "../src_dict/index.js"
import { indice_de_adverbios } from "./adverbios.js"
import { generaFormasDeAdjetivo } from "./genera-formas-de-adjetivos.js"
// import { generaFormasDeArtículo } from "./genera-formas-de-artículos.js"
import { generaFormasDeSustantivo } from "./genera-formas-de-sustantivos.js"
import { IndiceDePalabrasAtribuidas } from "./index.js"
import { indice_de_sustantivos } from "./sustantivos.js"


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
    for (let lema in indice_de_sustantivos) {
        const formas = generaFormasDeAdjetivo(lema)
        for (let forma in formas) {
            todas_formas[forma] = todas_formas[forma] || []
            todas_formas[forma].push(...formas[forma])
        }
    }
}


function generaTodosFormasDeAdverbios(todas_formas: IndiceDePalabrasAtribuidas) {
    const parte: PartOfSpeech = "ADV"
    for (let lema in indice_de_adverbios) {
        const adverbio = indice_de_adverbios[lema]
        const adverbio_copy = {...adverbio, parte}
        // Los adverbios no cambian
        todas_formas[lema] = todas_formas[lema] || []
        todas_formas[lema].push(adverbio_copy)
    }
}


// function generaTodosFormasDeArtículos(todas_formas: IndiceDePalabrasAtribuidas) {
//     for (let lema in indice_de_sustantivos) {
//         const formas = generaFormasDeArtículo(lema)
//         for (let forma in formas) {
//             todas_formas[forma] = todas_formas[forma] || []
//             todas_formas[forma].push(...formas[forma])
//         }
//     }
// }


function generaTodasFormasDeTodasPalabras() {
    const todas_formas: IndiceDePalabrasAtribuidas = {}
    generaTodosFormasDeSustantivos(todas_formas)
    generaTodosFormasDeAdjetivos(todas_formas)
    generaTodosFormasDeAdverbios(todas_formas)
    // generaTodosFormasDeArtículos(todas_formas)
}


