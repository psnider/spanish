// Objetivo del módulo cambio-tema-presente-yo.ts
//   Dado:
//   - un infinitivo
//   - su entrada ReglasDeConjugaciónDeVerbo
//   producir (o no) un tema alternativo para:
//   - presente indicativo (1s)
//   - presente subjuntivo (todas)
//   - imperativo (usted / ustedes)// Reglas claras de la transformación
// 1. Condición de activación
//   si existe tema_presente_yo
//   Nada más.
//   No dependas de tiempo ni modo.
// 2. Valor del tema
//   const tema = reglas.tema_presente_yo
//   string → tema único (teng, dig, salg)
//   [string, string] → variante condicionada (si ya lo usas)
// 3. Formas que sí usan este tema
//   Usa tema_presente_yo para:
//   - Presente indicativo: 1ª singular
//   - Presente subjuntivo: todas las personas
//   - Imperativo afirmativo:
//     - usted
//     - ustedes
//     - Imperativo negativo (vía subjuntivo)
// 4. Formas que nunca lo usan
//   No aplicar a:
//   - imperfecto
//   - pretérito
//   - futuro
//   - condicional
//   - infinitivo
//   - participio
//   - gerundio
//   (Regla dura, sin excepciones)
// 5. Interacción con alternancia vocálica
//   Orden obligatorio:
//   - Seleccionar tema_presente_yo
//   - No aplicar alternancia_vocálica encima de ese tema
//   Ejemplo:
//   - decir → dig- (no díg-, no deg-)
//   - tener → teng- (no tiéng-)
// 6. Interacción con ortografía
//   Este módulo:
//   - no pone acentos
//   - no inserta y
//   - no cambia grafías
//   Eso va después, en ortografía.


// function stub() {
    // if (tema_presente_yo && contexto ∈ dominio_presente) {
    //     usar tema_presente_yo
    // } else {
    //     usar tema_regular
    // }
// }


//   si dominio ∈ presente / subj. pres. / imperativo
//   y persona = 1s
//   y existe tema_presente_yo
//   - usarlo

import { TenseMood, VerbConjugationStems, VerbForms } from ".";
import { setStem } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";



//   - Presente indicativo: 1ª singular
//   - Presente subjuntivo: todas las personas
//   - Imperativo afirmativo:
//     - usted
//     - ustedes
//     - Imperativo negativo (vía subjuntivo)

export function getTemaPresenteYo(conj_and_deriv_rules: ConjugationAndDerivationRules, tense_mood: TenseMood) : VerbConjugationStems | undefined {
    const tema_presente_yo = conj_and_deriv_rules.morphological_rules?.tema_presente_yo
    if (tema_presente_yo) {
        let temas
        switch (tense_mood) {
        case "IndPres":
            temas = setStem(tema_presente_yo, ["s1"])
            return temas
        case "SubPres":
        case "CmdNeg":
            temas = setStem(tema_presente_yo)
            return temas
        case "CmdPos":
            temas = setStem(tema_presente_yo, ["s3", "p1", "p3"])
            return temas
        }
    }
}


export function getSuffixesForPresenteYo(conj_and_deriv_rules: ConjugationAndDerivationRules, tense_mood: TenseMood) : VerbConjugationStems | undefined {
    const sufijo_presente_yo = conj_and_deriv_rules.morphological_rules?.sufijo_presente_yo
    if (sufijo_presente_yo) {
        switch (tense_mood) {
        case "IndPres":
            const sufijos: VerbConjugationStems = {s1: [sufijo_presente_yo]}
            return sufijos
        }
    }
}
