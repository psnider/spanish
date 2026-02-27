import { MoodTense, VerbConjugationStems } from ".";
import { setStem } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";

//   - Futuro simple (todas las personas)
//   - Condicional simple (todas las personas)

const domains_tema_futuro: MoodTense[] = ["IndFut", "IndCond"]


export function getTemaFuturo(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense) : VerbConjugationStems | undefined {
    const tema_futuro = conj_and_deriv_rules.morphological_rules?.tema_futuro
    if (tema_futuro && domains_tema_futuro.includes(mood_tense)) {
        const temas = setStem(tema_futuro)
        return temas
    }
}
