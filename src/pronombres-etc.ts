// import "../conjugator/index"

import { Frecuencias, IrregularidadesOrtograficas } from "./index.js"


export type GrammaticalPersonDePronombre = "s1" | "s2" | "s3" | "p1" | "p2" | "p3" | "sp3"
export type GéneroDePronombre = "n" | "m" | "mf" | "mfn" | "mn" | "f"

interface Pronombre {
    sujeto?: true
    persona?: GrammaticalPersonDePronombre
    género: GéneroDePronombre
    solo_plural?: true
    demostrativo?: true
    relativo?: true
    // objeto directo
    od?: true
    // objeto indirecto
    oi?: true
    // objeto de preposición
    op?: true
    // noun?: true
    // adj?: true
    // adv?: true
    // conj?: true
    frecuencias?: Frecuencias
    irregularidades?: IrregularidadesOrtograficas 
    // formas/ortografías alternativos   
    alternativos?: IrregularidadesOrtograficas
    alternativo?: string
    comparativo?: true
    exclamativo?: true
    indefinido?: true
    interrogativo?: true
}

export const indice_de_pronombres: {[lemma: string]: Pronombre} = {
    yo:       { sujeto: true, persona: "s1", género: "mf"},
    tú:       { sujeto: true, persona: "s2", género: "mf"},
    vos:      { sujeto: true, persona: "s2", género: "mf"},
    usted:    { sujeto: true, persona: "s2", op: true, género: "mf"},
    él:       { sujeto: true, persona: "s3", op: true, género: "m"},
    ella:     { sujeto: true, persona: "s3", op: true, género: "f"},
    ello:     { sujeto: true, persona: "s3", op: true, género: "mn"},
    nosotros: { sujeto: true, persona: "p1", op: true, género: "n"},
    vosotros: { sujeto: true, persona: "p2", op: true, género: "n"},
    ustedes:  { sujeto: true, persona: "p2", op: true, género: "mf"},
    ellos:    { sujeto: true, persona: "p3", op: true, género: "mn"},
    ellas:    { sujeto: true, persona: "p3", op: true, género: "f"},

    ese:      {género: "mfn", demostrativo: true, irregularidades: {mpl: "esos", n: "eso"}, alternativos: {m: "ése", f: "ésa", n: "éso", mpl: "ésos", fpl: "ésas"}},
    este:     {género: "mfn", demostrativo: true, irregularidades: {mpl: "estos", n: "etso"}, alternativos: {m: "éste", f: "ésta", n: "ésto", mpl: "éstos", fpl: "éstas"}},
    aquel:    {género: "mfn", demostrativo: true, irregularidades: {f: "aquella", mpl: "aquellos", n: "aquello"}, alternativos: {m: "aquél", f: "aquélla", n: "aquéllo", mpl: "aquéllos", fpl: "aquéllas"}},
    le:       {género: "mfn", alternativo: "se"},
    me:       {género: "mf", od: true, persona: "s1"},
    te:       {género: "mf", od: true, persona: "s2"},
    lo:       {género: "mf", od: true, persona: "s3", irregularidades: {f: "la"}, alternativo: "se"},
    se:       {género: "mf", od: true, persona: "sp3"},
    nos:      {género: "mf", od: true, persona: "p1"},
    os:       {género: "mf", od: true, persona: "p2"},
    los:      {género: "mf", od: true, persona: "p3", irregularidades: {fpl: "las"}},

    mí:       {género: "n", op: true, persona: "s1"},
    conmigo:  {género: "n", op: true, persona: "s1"},
    ti:       {género: "n", op: true, persona: "s2"},
    contigo:  {género: "n", op: true, persona: "s2"},
    sí:       {género: "n", op: true, persona: "s3"},   // noun: true, adv: true,

    demasiado: {género: "mf", indefinido: true},  // adj: true

    mucho:    {género: "mf", indefinido: true},   // , adj: true, adv: true
    poco:     {género: "mf", indefinido: true},   // noun: true, adj: true, 
    que:      {género: "n", relativo: true},   // conj: true, 
    qué:      {género: "n", interrogativo: true, exclamativo: true},   // adj: true, adv: true

    quien:    {género: "n", relativo: true},
    quién:    {género: "n", indefinido: true, interrogativo: true, exclamativo: true},
    tal:      {género: "n"},   // adj: true, adv: true
    tan:      {género: "n", comparativo: true, demostrativo: true},   // , noun: true, adj: true, adv: true
    tanto:    {género: "mf", comparativo: true, demostrativo: true},   // noun: true, adj: true, adv: true, 
    uno:      { género: "mf", frecuencias: {f: 50}},   // noun: true, adj: true
    vario:    { género: "mf", solo_plural: true, indefinido: true},   // , noun: true
}


const pronombres_personales = {
    s1: "yo",
    s2: {
        es: "vos",
        mx: "tú"
    },
    s3: ["él", "ella", "usted"],
    p1: ["nosotros", "nosotras"],
    p2: {
        es: ["vosotros", "vosotras"],
        mx: "ustedes"
    },
    p3: ["ellos", "ellas", "ustedes"],
}


// demás: {adj: true, pron: true},


const objetos_directos = {
    s1: "me",
    s2: "te",
    s3: ["lo", "la"],
    p1: "nos",
    p2: "os",
    p3: ["los", "las"],
}

const objetos_indirectos = {
    s1: "me",
    s2: "te",
    s3: "le",
    p1: "nos",
    p2: "os",
    p3: "les",
}


// used with "a"+
const pronombres = {
    s1: "mí",
    s2: "ti",
    s3: ["él", "ella", "usted"],
    p1: "nos",
    p2: {
        es: ["vosotros", "vosotras"],
        mx: "ustedes"
    },
    p3: ["ellos", "ellas", "ustedes"],
}


const pronombres_reflexivos_y_recíprocos = {
    s1: "me",
    s2: "te",
    s3: "se",
    p1: "nos",
    p2: "os",
    p3: "se",
}


const preposición_pronominal = {
    s1: "conmigo",
    s2: "contigo",
    s3: "consigo",
    p3: "consigo",
}


const pronombres_relativos = {
    que: "que",
    cual: [ "cual", "cuales"],  // adv: true
    cuanto: ["cuanto", "cuanta", "cuantos", "cuantas"],
    //cuanto: {noun: true, adj: true, adv: true, conj: true},
    donde: "donde",
    quien: ["quien", "quienes"],
    cuyo: ["cuyo", "cuya", "cuyos", "cuyas"],
}


// n: neutro
const pronombres_demostrativos = {
    sm:	["éste", "ése", "aquél"],
    sf:	["ésta", "ésa", "aquélla"],
    sn: ["esto", "eso", "aquel", "aquello"],
    pm:	["éstos", "ésos" , "aquéllos"],
    pf:	["éstas", "ésas" , "aquéllas"],
}


const pronombres_posesivos = {
    s1: ["mío", "mía", "míos", "mías"],
    s2: ["tuyo", "tuya", "tuyos", "tuyas"],
    s3: ["suyo", "suya", "suyos", "suyas"],
    p1: ["nuestro", "nuestra", "nuestros", "nuestras"],
    p2: ["vuestro", "vuestra", "vuestros", "vuestras"],
    p3: ["suyo", "suya", "suyos", "suyas"],
}


const pronombres_interrogativos_y_exclamativos = {
    "qué": "qué",
    "quién": ["quién", "quiénes"],
    "cuál": ["cuál", "cuáles"],
    "cuánto": ["cuánto", "cuántos"],
    "cómo": "cómo", // adv: true, conj: true, noun: true
}


const pronombres_indefinidos = {
    un: ["un", "uno", "una", "unos", "unas"],
    "algún" : ["algún", "alguna", "algunos", "algunas"],
    "ningún": ["ningún", "ninguna", "ninguno", "ningunos", "ningunas"],
    "otro": ["otro", "otra", "otros", "otras"],
    "tanto": ["tanto", "tanta", "tantos", "tantas"],
    tal: "tal",
    mucho: "mucho",
    demasiado: "demasiado",
    escaso: "escaso",
    todo: "todo"
    // and more
}


const indefinidas_y_negativas = {
    "algo": {
        pos: "algo",
        neg: "nada"
    },
    "alguien": {pos: "alguien", neg: "nadie"},
    "siempre": {pos: "siempre", neg: ["nunca", "jamás" ,"nunca jamás"]},
    "también": {pos: "también", neg: "tampoco"},
    "algún": {
        pos: ["alguno", "alguna", "algunos", "algunas", "algún"],
        neg: ["ninguno", "ninguna", "ningunos", "ningunas", "ningún"],
    },
    o: {pos: "o", neg: "ni"}
}


// menos


