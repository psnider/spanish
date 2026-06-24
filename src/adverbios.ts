import { AtributosDePalabra } from "./index.js"

interface Adverbio extends Pick<AtributosDePalabra, "comp" | "dem" | "distrib" | "excl" | "frecuencia" | "indef" | "interrog" | "relat" > {
}


export const indice_de_adverbios: {[lemma: string]: Adverbio} = {
    abajo: {},
    acá: {},
    actualmente: {},
    adelante: {},
    además: {},
    adentro: {},
    afuera: {},
    ahí: {},
    ahora: {},
    allá: {},
    allí: {},
    algo: {indef: true },
    alrededor:    {},
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
    claro: {},
    como: {},  // conj: true
    completamente: {},
    cual: {},  // pron: true
    cuál: {},
    cuando: {relat: true},  // conj: true  // prep: true
    cuándo: {interrog: true, excl: true, distrib: true},
    cuanto: {},  // noun: true  // conj: true  // pron: true  // adj: true
    cuánto: { excl: true },
    debajo: {},
    diferente: {},  // adj: true
    demasiado: {indef: true},  // adj: true
    dentro: {},
    después: {},
    donde: {relat: true},  // prep: true
    dónde: {interrog: true},  // noun: true
    detrás: {},
    encima: {},
    entonces: {dem: true},
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
    incluso: {},
    jamás: {},
    lejos: {},  // noun: true
    luego: {},  // conj: true
    mal: {},  // noun: true
    mientras: {},
    mismo: {},  // adj: true
    mitad: {},
    mucho: {indef: true},  // pron: true  // adj: true
    muy: {},
    nada: {},
    no: {frecuencia: 1000},  // noun: true
    nomás: {},
    nunca: {},
    peor: {},
    primo: {},
    qué:        {excl: true},  // pron: true  // adj: true
    quizá: {},
    quizás: {},
    rápido:    {},
    raro: {},
    re:  {},  // Riop. re=muy
    realmente: {},
    ruidosamente: {},
    según: {relat: true},  // prep: true
    seguro: {},
    siempre: {},
    sí: {},  // noun: true  // pron: true
    siquiera: {},  // conj: true
    so: {},  // prep: true  // interj: true
    sólo: {},
    tal: {},  // pron: true  // adj: true
    también: {},
    tampoco: {},
    tan:  {comp: true, dem: true},  // noun: true  // pron: true  // adj: true
    tanto:  {comp: true, dem: true},  // noun: true  // pron: true  // adj: true
    tarde: {},  // noun: true
    todavía: {},
    totalmente: {},
    ya: {},  // interj: true
}

