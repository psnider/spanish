// El contenido lingüístico describe cómo funciona una palabra dentro de un idioma concreto. 
// Estos campos deben estar en el idioma del diccionario, para que hablantes nativos, 
// profesores y tutores puedan mantener las entradas sin necesitar conocimientos técnicos ni inglés especializado.
//
// Cuando un concepto local necesita conectarse con el sistema general, se usan identificadores globales 
// en inglés y se mantiene un mapeo local desde el idioma del diccionario. De este modo, 
// el diccionario sigue siendo fácil de editar para humanos y coherente para las computadoras.


// Diccionario españolo
// Los tipos de dato deben ser entendible por hispanohablantes.
// Solomente usa inglés para conceptos de la sistema general o de TypeScript.

import { LemmaConceptID, Region, SemanticDomain } from "../src_dict/common-all"

export type Genero = "m" | "f" | "mf" | "amb"


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




// Los IDs para los significados en el diccionario, cuando el genero los determina.
// Por ejemplo: "el corte" y "la corte".
interface SustantivoGeneroCambiaSignificado {
  m: LemmaConceptID[]
  f: LemmaConceptID[]
}


// Las regiones en que usa cada genero.
// Por ejemplo: "el sartén" y "la sartén".
interface SustantivoGeneroCambiaPorRegion {
  f: Region[]
  m: Region[]
}

// Solo especifica las formas irregulares.
// Por ejemplo: "el actor", "la actriz", "los actores", "las actrices"
interface Irregularidades {
  // singular
  f?: string
  m?: string
  // plural
  fpl?: string
  mpl?: string
}


interface Sustantivo {
  genero: Genero
  contable: boolean
  genero_cambia_significado?: SustantivoGeneroCambiaSignificado
  genero_cambia_region?: SustantivoGeneroCambiaPorRegion
  irregularidades?: Irregularidades
}


// Este objeto permite traducir los dominios de español a los dominios generales
// (los IDs globales deben estar en inglés, como en domain_ids)
export const es_domains_set: Record<string, SemanticDomain> = {
  "edificio": "building",
  "fruta": "fruit",
  "árbol": "tree",
  "planta": "plant",
  "persona": "person",
  "herramienta": "tool",
  "ropa": "clothing",
  "emoción": "emotion",
  "cuerpo": "anatomy",
  "objeto": "object",
  "lugar": "place",
  "idea": "idea",
  "evento": "event",
  "tecnología": "technology",
  "mineral": "mineral",
  "tiempo": "time",
  "verdura": "vegetable",
}
