// import "../conjugator/index"

import { AtributosDePalabra, AtributosDePronombre, Frecuencias, GéneroDeForma, IrregularidadesOrtograficas } from "./index.js"


export type GéneroDePronombre = GéneroDeForma | "a"

type PronombreBase = Pick<AtributosDePalabra, "persona" | "dem" | "relat" | "od" | "oi" | "op" | "comp" | "excl" | "indef" | "interrog" >
export interface Pronombre extends PronombreBase {
    sujeto?: true
    géneros: GéneroDePronombre
    solo_singular?: true
    solo_plural?: true
    // El valor indica cual porción del sufijo debe remover.
    apócope?: string
    frecuencias?: Frecuencias
    irregularidades?: IrregularidadesOrtograficas 
    // formas/ortografías alternativos   
    alternativos?: IrregularidadesOrtograficas
    alternativo?: string
}


export const indice_de_pronombres: {[lemma: string]: Pronombre} = {
    yo:       { géneros: "a", solo_singular: true, sujeto: true, persona: "s1", },
    tú:       { géneros: "a", solo_singular: true, sujeto: true, persona: "s2"},
    vos:      { géneros: "a", solo_singular: true, sujeto: true, persona: "s2"},
    usted:    { géneros: "a", sujeto: true, persona: "2", op: true },
    él:       { géneros: "mf", persona: "s3", irregularidades: {f: "ella", mpl: "ellos", n: "ello"}}, // regular: fpl: "ellas", 
    // él:       { sujeto: true, persona: "s3", op: true, géneros: "m"},
    // ello:     { sujeto: true, persona: "s3", op: true, géneros: "n"},
    // ella:     { sujeto: true, persona: "s3", op: true, géneros: "f"},
    // ellos:    { sujeto: true, persona: "p3", op: true, géneros: "m"},
    // ellas:    { sujeto: true, persona: "p3", op: true, géneros: "f"},
    nosotros: { géneros: "mf", solo_plural: true, sujeto: true, persona: "p1", op: true, irregularidades: {fpl: "nosotras"}},
    vosotros: { géneros: "mf", solo_plural: true, sujeto: true, persona: "p2", op: true, irregularidades: {fpl: "vosotras"}},
    quien:    { géneros: "n", relat: true},
    quién:    { géneros: "n", indef: true, interrog: true, excl: true, irregularidades: {npl: "quiénes"}},

    alguien:  { géneros: "n", solo_singular: true, indef: true},
    nadie:    { géneros: "n", solo_singular: true, indef: true},
    alguno:   {géneros: "mf", indef: true },
    algo:     {géneros: "n", indef: true },
    ninguno:   {géneros: "mf", solo_singular: true, indef: true },


    ese:      { géneros: "mf", dem: true, irregularidades: {mpl: "esos", n: "eso"}, alternativos: {m: "ése", f: "ésa", n: "éso", mpl: "ésos", fpl: "ésas"}},
    este:     { géneros: "mf", dem: true, irregularidades: {mpl: "estos", n: "etso"}, alternativos: {m: "éste", f: "ésta", n: "ésto", mpl: "éstos", fpl: "éstas"}},
    aquel:    { géneros: "mf", dem: true, irregularidades: {f: "aquella", mpl: "aquellos", n: "aquello"}, alternativos: {m: "aquél", f: "aquélla", n: "aquéllo", mpl: "aquéllos", fpl: "aquéllas"}},
    le:       { géneros: "a", alternativo: "se"},
    me:       { géneros: "a", od: true, persona: "s1"},
    te:       { géneros: "a", od: true, persona: "s2"},
    lo:       { géneros: "mf", od: true, persona: "s3", irregularidades: {f: "la"}, alternativo: "se"},
    se:       { géneros: "a", od: true, persona: "sp3"},
    nos:      { géneros: "a", od: true, persona: "p1"},
    os:       { géneros: "a", od: true, persona: "p2"},
    los:      { géneros: "mf", od: true, persona: "p3", irregularidades: {fpl: "las"}},

    mí:       { géneros: "n", op: true, persona: "s1"},
    conmigo:  { géneros: "n", op: true, persona: "s1"},
    ti:       { géneros: "n", op: true, persona: "s2"},
    contigo:  { géneros: "n", op: true, persona: "s2"},
    sí:       { géneros: "n", op: true, persona: "s3"},   // noun: true, adv: true,

    demasiado: { géneros: "mf", indef: true},  // adj: true

    mucho:    { géneros: "mf", indef: true},   // , adj: true, adv: true
    poco:     { géneros: "mf", indef: true},   // noun: true, adj: true, 
    que:      { géneros: "n", relat: true},   // conj: true, 
    qué:      { géneros: "n", interrog: true, excl: true},   // adj: true, adv: true

    tal:      { géneros: "n"},   // adj: true, adv: true
    tan:      { géneros: "n", comp: true, dem: true},   // , noun: true, adj: true, adv: true
    tanto:    { géneros: "mf", apócope: "to", comp: true, dem: true},   // noun: true, adj: true, adv: true, 
    uno:      { géneros: "mf", frecuencias: {f: 50}},   // noun: true, adj: true
    varios:   { géneros: "mf", solo_plural: true, indef: true, irregularidades: {fpl: "varias"}},   // , noun: true
    todo:     { géneros: "mf", indef: true},

    cuál:     { géneros: "mf", indef: true, interrog: true},
    cuánto:   { géneros: "mf", interrog: true},
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


