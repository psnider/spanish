
interface Adverbio {
    // conj?: true
    // prep?: true
    // pron?: true
    // noun?: true
    // adj?: true
    // interj?: true
    comparativo?: true
    demostrativo?: true
    exclamativo?: true
    indefinido?: true
    interrogativo?: true
    relativo?: true
}
// Need a clear way to indicate the gendered forms, and any nuances of spelling

export const indice_de_adverbios: {[lemma: string]: Adverbio} = {
    abajo: {},
    acá: {},
    actualmente: {},
    adelante: {},
    además: {},
    ahí: {},
    ahora: {},
    allá: {},
    allí: {},
    ante: {},  // ,   // noun: true  // prep: true
    antes: {},
    aparte: {},  // ,   // noun: true  // adj: true
    apenas: {},
    aproximadamente: {},
    aquí: {},
    arriba: {},
    así: {},  // , conj: true  // adj: true
    atrás: {},
    aun: {},
    aún: {},
    ayer: {},  // noun: true
    bastante: {},  // , pron: true  // adj: true
    bajo: {},  // , ,   // noun: true  // prep: true  // adj: true
    bien: {},   // noun: true
    casi: {},
    cerca: {},  // noun: true
    como: {},  // conj: true
    completamente: {},
    cual: {},  // pron: true
    cuando: {relativo: true},  // conj: true  // prep: true
    cuanto: {},  // noun: true  // conj: true  // pron: true  // adj: true
    diferente: {},  // adj: true
    demasiado: {indefinido: true},  // adj: true
    dentro: {},
    después: {},
    donde: {relativo: true},  // prep: true
    dónde: {interrogativo: true},  // noun: true
    encima: {},
    entonces: {demostrativo: true},
    especialmente: {},
    exactamente: {},
    fácil: {},  // adj: true
    finalmente: {},
    fuera: {},
    fuerte: {},  // noun: true  // adj: true
    generalmente: {},
    hasta: {},  // prep: true
    hoy: {},  // noun: true
    igual: {},  // noun: true
    jamás: {},
    lejos: {},  // noun: true
    luego: {},  // conj: true
    mal: {},  // noun: true
    mientras: {},
    mismo: {},  // adj: true
    mitad: {},
    mucho: {indefinido: true},  // pron: true  // adj: true
    muy: {},
    nada: {},
    no: {},  // noun: true
    nomás: {},
    nunca: {},
    qué:      {exclamativo: true},  // pron: true  // adj: true
    quizá: {},
    realmente: {},
    según: {relativo: true},  // prep: true
    siempre: {},
    sí: {},  // noun: true  // pron: true
    siquiera: {},  // conj: true
    so: {},  // prep: true  // interj: true
    sólo: {},
    tal: {},  // pron: true  // adj: true
    también: {},
    tampoco: {},
    tan:  {comparativo: true, demostrativo: true},  // noun: true  // pron: true  // adj: true
    tanto:  {comparativo: true, demostrativo: true},  // noun: true  // pron: true  // adj: true
    tarde: {},  // noun: true
    todavía: {},
    totalmente: {},
    ya: {},  // interj: true
}

