import { GrammaticalPerson, MoodTense, Uso } from "conjugador-espanol"
import { LemmaConceptID, PartOfSpeech, Region } from "../src_dict/index.js"
import { GéneroDeSustantivo } from "./sustantivos.ts"
import { GrammaticalPersonDePronombre } from "./pronombres-etc.ts"

// Propiedades principales de los sustantivos en español
//   1. Género (masculino / femenino)
//     A) La mayoría de los sustantivos en español tienen género fijo:
//       masculino: el perro, el árbol, el problema
//       femenino: la casa, la piel, la noche
//       Señales típicas (no reglas absolutas):
//       -o → masculino (el carro)
//       -a → femenino (la ventana)
//       -ción / -sión / -dad / -tud → femenino
//       -ma griego → masculino (el sistema, el idioma)
//     B) Algunos se usan con cualquier género apropiados:
//       artista, estudiante,
//     B) Algunas tienen género ambiguo:
//       mar
//     C) Algunas cambian por región:
//       sartén
//     D) Algunas tienen significados diferentes para cada genero:
//       capital, cometa, guía, order, cura, frente, pendiente, parte,
//   2. Número (singular / plural)
//      A) Reglas generales:
//        Vocal final: +s → casa / casas
//        Consonante final: +es → papel / papeles
//        Final en -z: cambia z → c + es → luz / luces


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


interface AtributosDeSustantivo extends AtributosBase {
    parte: "NOU" | "nou"
    género?: GéneroDeForma
    singular?: boolean
}


interface AtributosDeNombrePropio extends AtributosBase {
    parte: "NAM" | "nam"
    género?: GéneroDeForma
}

interface AtributosDePronombre extends AtributosBase {
    parte: "PRN"
    género?: GéneroDeForma
    persona?: GrammaticalPersonDePronombre
    // objeto directo
    od?: true
    // objeto indirecto
    oi?: true
}



interface AtributosDeAdjetivo extends AtributosBase {
    parte: "ADJ" | "adj"
    género?: GéneroDeForma
    singular?: boolean
}


interface AtributosDeAdverbio extends AtributosBase {
    parte: "ADV" | "adv"
}


interface AtributosDeDeterminante extends AtributosBase {
    parte: "DET"
    género?: GéneroDeForma
    singular?: boolean
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
    expandido?: ComponenteDeContracción[]
}


interface AtributosDeInterjección extends AtributosBase {
    parte: "INT" | "int"
}



interface AtributosDeVerbo extends AtributosBase {
    parte: "VRB" | "vrb"
    infinitivo?: string
    forma?: "inf" | "ger" | "part"
    modo_tiempo?: MoodTense 
    persona?: GrammaticalPerson
    uso?: Uso
}


interface AtributosDeOnomatopeya  extends AtributosBase {
    parte: "ONO" | "ono"
}


interface AtributosDePuntuación  extends AtributosBase {
    parte: "PNC"
}


interface AtributosDeDesconocido  extends AtributosBase {
    parte: "UNK"
}


export type AtributosDePalabra = AtributosBase | AtributosDeSustantivo | AtributosDeNombrePropio | AtributosDeAdjetivo | AtributosDeDeterminante | AtributosDePronombre | AtributosDePreposición | AtributosDeConjuncciónCoordinante | AtributosDeConjuncciónSubordinativa | AtributosDeContracción | AtributosDeVerbo | AtributosDeOnomatopeya | AtributosDePuntuación | AtributosDeDesconocido

export type IndiceDePalabrasAtribuidas = {[forma: string]: AtributosDePalabra[]} 

