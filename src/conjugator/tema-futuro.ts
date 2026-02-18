// Objetivo del módulo
//   Seleccionar un tema especial de futuro / condicional cuando exista.
// 1. Condición de activación
//   - si existe tema_futuro
//   Nada más.
// 2. Dominio de aplicación
//   Usar tema_futuro para:
//   - Futuro simple (todas las personas)
//   - Condicional simple (todas las personas)
// 3. Base de aplicación
//   Este tema de reglas.tema_futuro:
//   - reemplaza al infinitivo regular
//   - no se combina con otros temas
//   - no se modifica aquí
// 4. Terminaciones
//   Este módulo no añade terminaciones.
//   El motor añade:
//   - futuro: -é, -ás, -á, -emos, -éis, -án
//   - condicional: -ía, -ías, -ía, -íamos, -íais, -ían
// 5. Exclusiones duras
//   No aplicar nunca a:
//   - presente (indicativo / subjuntivo)
//   - imperfecto
//   - pretérito
//   - imperativo
//   - infinitivo
//   - participio
//   - gerundio
// 6. Interacción con otros módulos
//   Orden obligatorio:
//   - ¿supletivo? → salir
//   - ¿tema_futuro? → usarlo
//   - Si no, usar infinitivo regular
//   Nunca combinar con:
//   - tema_pretérito
//   - tema_presente_yo
//   - alternancia_vocálica


// function stub() {
// if (tema_futuro && contexto ∈ dominio_futuro) {
//     usar tema_futuro
// } else {
//     usar infinitivo
// }
// }
import { TenseMood, VerbConjugationStems } from ".";
import { setStem } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";

//   - Futuro simple (todas las personas)
//   - Condicional simple (todas las personas)

const domains: TenseMood[] = ["IndFut", "IndCond"]


export function getTemaFuturo(conj_and_deriv_rules: ConjugationAndDerivationRules, tense_mood: TenseMood) : VerbConjugationStems | undefined {
    const tema_futuro = conj_and_deriv_rules.morphological_rules?.tema_futuro
    if (tema_futuro && domains.includes(tense_mood)) {
        const temas = setStem(tema_futuro)
        return temas
    }
}
