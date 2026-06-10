import { Frecuencias } from "./index.js"

interface Preposición {
    // adj?: true
    // adv?: true
    // conj?: true
    // noun?: true
    // interj?: true
    frecuencia?: number
}

export const indice_de_preposiciones: {[lemma: string]: Preposición} = {
    a: { frecuencia: 5500 },   // noun: true
    ante: { frecuencia: 30 },   // noun: true
    bastante: { frecuencia: 1000 },   // adj: true, adv: true
    bajo: { frecuencia: 20 },   // adj: true, adv: true
    cabe: { frecuencia: 1000 },   // noun: true
    con: { frecuencia: 2000 },
    contra: { frecuencia: 0.01 },   // noun: true
    cuando: { frecuencia: 1000 },   // adj: true, adv: true
    de: { frecuencia: 8700 },
    desde: { frecuencia: 100 },
    donde: { frecuencia: 1000 },   // adv: true
    durante: { frecuencia: 100 },
    en: { frecuencia: 5200 },
    entre: { frecuencia: 200 },
    hacia: { frecuencia: 40 },
    hasta: { frecuencia: 100 },   // adv: true
    mediante: { frecuencia: 50 },
    para: { frecuencia: 900 },
    por: { frecuencia: 1700 },
    según: { frecuencia: 30 },   // adv: true
    sin: { frecuencia: 150 },
    so: { frecuencia: 0.01 },   // adv: true, interj: true
    sobre: { frecuencia: 150 },
    tras: { frecuencia: 1000 },   // noun: true
    versus: { frecuencia: 5 },
    vía: { frecuencia: 5 },   // noun: true
}

