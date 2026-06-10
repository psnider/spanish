interface Adverbio {
    parte: "ADV"
    comparativo?: true
    demostrativo?: true
    exclamativo?: true
    indefinido?: true
    interrogativo?: true
    relativo?: true
}


export const indice_de_adverbios: {[lemma: string]: Adverbio} = {
    abajo: {parte: "ADV"},
    acá: {parte: "ADV"},
    actualmente: {parte: "ADV"},
    adelante: {parte: "ADV"},
    además: {parte: "ADV"},
    ahí: {parte: "ADV"},
    ahora: {parte: "ADV"},
    allá: {parte: "ADV"},
    allí: {parte: "ADV"},
    ante: {parte: "ADV"},  // ,   // noun: true  // prep: true
    antes: {parte: "ADV"},
    aparte: {parte: "ADV"},  // ,   // noun: true  // adj: true
    apenas: {parte: "ADV"},
    aproximadamente: {parte: "ADV"},
    aquí: {parte: "ADV"},
    arriba: {parte: "ADV"},
    así: {parte: "ADV"},  // , conj: true  // adj: true
    atrás: {parte: "ADV"},
    aun: {parte: "ADV"},
    aún: {parte: "ADV"},
    ayer: {parte: "ADV"},  // noun: true
    bastante: {parte: "ADV"},  // , pron: true  // adj: true
    bajo: {parte: "ADV"},  // , ,   // noun: true  // prep: true  // adj: true
    bien: {parte: "ADV"},   // noun: true
    casi: {parte: "ADV"},
    cerca: {parte: "ADV"},  // noun: true
    como: {parte: "ADV"},  // conj: true
    completamente: {parte: "ADV"},
    cual: {parte: "ADV"},  // pron: true
    cuando: {parte: "ADV", relativo: true},  // conj: true  // prep: true
    cuanto: {parte: "ADV"},  // noun: true  // conj: true  // pron: true  // adj: true
    diferente: {parte: "ADV"},  // adj: true
    demasiado: {parte: "ADV", indefinido: true},  // adj: true
    dentro: {parte: "ADV"},
    después: {parte: "ADV"},
    donde: {parte: "ADV", relativo: true},  // prep: true
    dónde: {parte: "ADV", interrogativo: true},  // noun: true
    encima: {parte: "ADV"},
    entonces: {parte: "ADV", demostrativo: true},
    especialmente: {parte: "ADV"},
    exactamente: {parte: "ADV"},
    fácil: {parte: "ADV"},  // adj: true
    finalmente: {parte: "ADV"},
    fuera: {parte: "ADV"},
    fuerte: {parte: "ADV"},  // noun: true  // adj: true
    generalmente: {parte: "ADV"},
    hasta: {parte: "ADV"},  // prep: true
    hoy: {parte: "ADV"},  // noun: true
    igual: {parte: "ADV"},  // noun: true
    jamás: {parte: "ADV"},
    lejos: {parte: "ADV"},  // noun: true
    luego: {parte: "ADV"},  // conj: true
    mal: {parte: "ADV"},  // noun: true
    mientras: {parte: "ADV"},
    mismo: {parte: "ADV"},  // adj: true
    mitad: {parte: "ADV"},
    mucho: {parte: "ADV", indefinido: true},  // pron: true  // adj: true
    muy: {parte: "ADV"},
    nada: {parte: "ADV"},
    no: {parte: "ADV"},  // noun: true
    nomás: {parte: "ADV"},
    nunca: {parte: "ADV"},
    qué:        {parte: "ADV", exclamativo: true},  // pron: true  // adj: true
    quizá: {parte: "ADV"},
    realmente: {parte: "ADV"},
    según: {parte: "ADV", relativo: true},  // prep: true
    siempre: {parte: "ADV"},
    sí: {parte: "ADV"},  // noun: true  // pron: true
    siquiera: {parte: "ADV"},  // conj: true
    so: {parte: "ADV"},  // prep: true  // interj: true
    sólo: {parte: "ADV"},
    tal: {parte: "ADV"},  // pron: true  // adj: true
    también: {parte: "ADV"},
    tampoco: {parte: "ADV"},
    tan:  {parte: "ADV", comparativo: true, demostrativo: true},  // noun: true  // pron: true  // adj: true
    tanto:  {parte: "ADV", comparativo: true, demostrativo: true},  // noun: true  // pron: true  // adj: true
    tarde: {parte: "ADV"},  // noun: true
    todavía: {parte: "ADV"},
    totalmente: {parte: "ADV"},
    ya: {parte: "ADV"},  // interj: true
}

