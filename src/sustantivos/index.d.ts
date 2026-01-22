import {LemmaConceptID, Region} from "../../src_dict/_index.ts"
import {Genero} from "../_index.ts"

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
  genero_cambia_significado?: SustantivoGeneroCambiaSignificado
  genero_cambia_region?: SustantivoGeneroCambiaPorRegion
  irregularidades?: Irregularidades
  contable: boolean
}
