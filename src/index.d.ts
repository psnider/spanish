import { MoodTense } from "conjugador-espanol"
import { PartOfSpeech } from "../src_dict/index.js"



export type GrammaticalPersonDePronombre = "s1" | "s2" | "s3" | "p1" | "p2" | "p3" | "sp3"


// La propiedad de género de una forma de una palabra en el contexto de una oración.
// n: neutro
// m: masculino, la ortografía no cambia, p.ej.: camino
// f: femenino, la ortografía no cambia, p.ej.: agua
// mf: masculino o femenino, la ortografía no cambia en forma, sigue las normas ortograficas, p.ej.: el hijo, la hija
//     pero, acepta formas irregulares
export type GéneroDeForma = "n" | "m" | "f" | "mf"

// El género en el contexto de los propiedades de un lema.
// Note que "n", "m", "f" siguen con la misma significado con GéneroDeForma, pero "mf" cambia ligeramente.
// mf: masculino o femenino, la ortografía si cambia en forma, sigue las normas ortograficas, p.ej.: el hijo, la hija
// a: (ambos/común) masculino o femenino, con el mismo significado, la ortografía no cambia por genero, p.ej.: el/la turista
//    también por los pocos casos en que el genero cambia por región, p.ej.: el/la sartén
// v: (variable) el genero determina el significado, la ortografía no cambia por genero, p.ej.: la corte, el corte
// Note: el caso de "uno"/"una" es complejo:
//    "uno"/"una": como sustantive, adjetivo, o pronombre
//    "una": como la hora
// Note: No está claro cómo debe modelar estes siguientes ejemplos complejos:
//      alto/alta, blanco/blanca, cargo/carga
export type GéneroDeLema = GéneroDeForma | "a" | "v"


// Solo especifica las formas irregulares.
// Por ejemplo: "el actor", "la actriz" (las formas plurales son normales)
export interface IrregularidadesOrtograficas {
  // singular
  f?: string
  // Es posible que no necesite esta forma, como es la del lema
  m?: string
  // plural
  fpl?: string
  mpl?: string
  // neutro
  // Solamente para demostrativos como "eso"
  n?: string
  npl?: string
}


// Frecuencia del uso de una palabra.
// Numero de usos por 100,000 palabras, aproximadamente 400 páginas de 250 palabras por página.
// Debe llenar este campo con los resultados de analísis real.
export interface Frecuencias {
    general?: number
    m?: number
    mp?: number
    f?: number
    fp?: number
    mf?: number
    mfp?: number
    n?: number
    np?: number
}


export interface AtributosBase {
    parte: PartOfSpeech
    frecuencia?: number
}


interface AtributosDeSustantivo extends AtributosBase, Pick<AtributosConValores, "género" | "pluralidad"> {
    parte: "NOU" | "nou"
}

interface AtributosDeNombrePropio extends AtributosBase, Pick<AtributosConValores, "género"> {
    parte: "NAM" | "nam"
}

interface AtributosDePronombre extends AtributosBase, Pick<AtributosConValores, "género" | "pluralidad" | "persona">, Pick<Etiquetas, "od" | "oi"> {
    parte: "PRN"
}

interface AtributosDeAdjetivo extends AtributosBase, Pick<AtributosConValores, "género" | "pluralidad"> {
    parte: "ADJ" | "adj"
}

interface AtributosDeAdverbio extends AtributosBase {
    parte: "ADV" | "adv"
}

interface AtributosDeDeterminante extends AtributosBase, Pick<AtributosConValores, "género" | "pluralidad"> {
    parte: "DET"
}

interface AtributosDePreposición extends AtributosBase {
    parte: "ADP"
}

export interface AtributosDeConjuncciónCoordinante extends AtributosBase {
    parte: "CON"
}


export interface AtributosDeConjuncciónSubordinativa extends AtributosBase {
    parte: "SUB"
}

interface ComponenteDeContracción {
  palabra: string
  atributos: AtributosDePalabra
}

interface AtributosDeContracción extends AtributosBase {
    parte: "CTN" | "ctn"
    expandido: ComponenteDeContracción[]
}


interface AtributosDeInterjección extends AtributosBase {
    parte: "INT" | "int"
}


// FIX: esto es en conflicto con los resultados del conjugador
// FIX: simplifica o elimina
interface AtributosDeVerbo extends AtributosBase {
    parte: "VRB" | "vrb"
    deriv?: "inf" | "ger" | "part"
    modo_tiempo?: MoodTense
}


interface AtributosDeOnomatopeya extends AtributosBase {
    parte: "ONO" | "ono"
}


interface AtributosDePuntuación extends AtributosBase {
    parte: "PNC"
}


interface AtributosDeDesconocido extends AtributosBase {
    parte: "UNK"
}



export interface AtributosConValores {
    parte?: PartOfSpeech
    género?: GéneroDeForma
    pluralidad?: "s" | "p"
    persona?: GrammaticalPersonDePronombre | "2"
    deriv?: "inf" | "ger" | "part"
    expandido?: ComponenteDeContracción[]
    frecuencia?: number
}


export interface Etiquetas {
    // Estos etiquetas vienen de análisis
    ger?: true,    // gerundio
    inf?: true,    // infinitivo
    od?: true,     // objeto directo
    oi?: true,     // objeto indirecto
    op?: true,     // objeto de preposici´øn
    part?: true,   // participio
    // Estos campos vienen descripciones de lemas en diccionarios, y se deletrean como en el DLE
    advers?: true,    // adversativo
    causal?: true,    // causal
    comp?: true,      // comparativo
    conc?: true,      // concesivo
    copulat?: true,   // copulativo
    dem?: true,       // demostrativo
    dim?: true,       // diminutivo
    distrib?: true,   // distributivo
    excl?: true,      // exclamativo
    indef?: true,     // indefinido
    indet?: true,     // indeterminado
    interrog?: true,  // interrogativo
    poses?: true,     // posesivo
    // ref?: true,    // reflexivo
    relat?: true,     // relativo
}


export type AtributosDePalabra = AtributosConValores & Etiquetas

// = AtributosDePronombre & AtributosDePreposición & AtributosDeDeterminante & 
//                 AtributosDeConjuncciónCoordinante & AtributosDeConjuncciónSubordinativa &
//                 AtributosDeSustantivo & AtributosDeAdjetivo & AtributosDeAdverbio & AtributosDeVerbo &
//                 AtributosDeContracción & AtributosDeInterjección & AtributosDeOnomatopeya & 
//                 AtributosDeNombrePropio &
//                 AtributosDePuntuación & AtributosDeDesconocido



// Los atributos esenciales en forma de un string.
// Empece con el PartOfSpeech, y otros atributos están separados por comas. 
// Cada PartOfSpeech tiene su propioo formato especifico.
// En general los atributos son similar con los en diccionarios, o con terminos en lingüistica.
// Los campos comunes son los de AtributosConValores:
//   género: m | f | n
//   pluralidad: s | p
//   frecuencia: f=NUMERO
//   verbo derivación: inf | ger | part
//   verbo modo y tiempo: IndPres | IndImp | IndPret | IndFut | IndCond | SubPres  | SubImp  | SubFut | CmdPos | CmdNeg
//   persona: s1 | s2 | s3 | p1 | p2 | p3 | vos | sp3
//   objeto directo: od
//   objeto indirecto: oi
//   objeto de preposición: op
// También hay atributos menos común que son los de Etiquetas:
//   adversativo: advers
//   causal: caus
//   comparativo: comp
//   concesivo: conces
//   copulativo: cop
//   demostrativo: dem
//   distributivo: dist
//   exclamativo: excl
//   indefinido: indef
//   indeterminado: indet
//   interrogativo: interr
//   posesivo: pos
//   reflexivo: ref
//   relativo: rel
//
// La forma por contracciones es: "CTN=" LISTA_DE_PALABRAS_CON_ATRIBUTOS
//   LISTA_DE_PALABRAS_CON_ATRIBUTOS := PALABRA_CON_ATRIBUTOS [ "+" PALABRA_CON_ATRIBUTOS ]*
//   PALABRA_CON_ATRIBUTOS := PALABRA ":" AtributosSintetizados
//   p.ej.: CTN,f=100;dár:vrb,inf;me:PRN,oi;lo:PRN,od
export type  AtributosSintetizados = string
export type IndiceDePalabrasAtribuidas = {[forma: string]: AtributosSintetizados[]} 

