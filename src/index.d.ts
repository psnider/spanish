import { LemmaConceptID, PartOfSpeech, Region } from "../src_dict/index.js"
import { GéneroDeSustantivo } from "./sustantivos.ts"

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


// Cada palabra con la propiedad de género.
// n: neutro
// m: masculino, la ortografía no cambia, p.ej.: camino
// f: femenino, la ortografía no cambia, p.ej.: agua
// mf: masculino o femenino, la ortografía sí cambia en forma, sigue las normas ortograficas, p.ej.: el hijo, la hija
//     pero, acepta formas irregulares
export type GéneroDeForma = "n" | "m" | "f" | "mf"

// a: (ambos/común) masculino o femenino, con el mismo significado, la ortografía no cambia por genero, p.ej.: el/la turista
//    también por los pocos casos en que el genero cambia por región, p.ej.: el/la sartén
// v: (variable) el genero determina el significado, la ortografía no cambia por genero, p.ej.: la corte, el corte
// Note: el caso de "uno"/"una" es complejo:
//    "uno"/"una": como sustantive, adjetivo, o pronombre
//    "una": como la hora
// Note: No está claro cómo debe modelar estes siguientes ejemplos complejos:
//      alto/alta, blanco/blanca, cargo/carga
export type Género = GéneroDeForma | "a" | "v"


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



export type AtributosBase = {
    parte: PartOfSpeech
}

interface AtributosDeSustantivo extends AtributosBase {
    parte: "NOUN"
    género?: GéneroDeForma
    singular?: boolean
}


interface AtributosDeAdjetivo extends AtributosBase {
    parte: "ADJ"
    género?: GéneroDeForma
    singular?: boolean
}


export type AtributosDePalabra = AtributosBase | AtributosDeSustantivo | AtributosDeAdjetivo

export type IndiceDePalabrasAtribuidas = {[forma: string]: AtributosDePalabra[]} 


