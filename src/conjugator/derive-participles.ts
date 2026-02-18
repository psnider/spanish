import { Participles } from "."
import { applyOrthographicalChangesForParticiples } from "./ortografía.js"
import { regular_verb_suffixes } from "./regular-verb-rules.js"
import { ConjugationAndDerivationRules, resolveConjugationClass } from "./resolve-conjugation-class.js"
import { applyStemChangeToGerundStem, stem_change_patterns } from "./stem-changes.js"
import { ReglasDeConjugaciónDeVerbo } from "./verbos-con-cambios-morfológicas.js"


function getRegularParticiples(conj_and_deriv_rules: ConjugationAndDerivationRules) : Participles {
    const {infinitive, verb_family, is_conjugation_family, prefixes, conjugable_infinitive, morphological_rules} = conj_and_deriv_rules
    const conjugable_base = conjugable_infinitive || infinitive
    const stem = conjugable_base.slice(0, -2)
    const participle_rules = regular_verb_suffixes[verb_family].participle_rules
    let pres = stem + participle_rules.pres.suffix
    let past = stem + participle_rules.past.suffix
    if (infinitive !== conjugable_infinitive) {
        if (is_conjugation_family) {
            const clase_conjugacional = morphological_rules.clase_conjugacional
            const base_prefix_length = conjugable_infinitive.length - (clase_conjugacional.length - 1)
            const conjugation_family_prefix = conj_and_deriv_rules.prefixes?.conjugation_family_prefix
            if (!conjugation_family_prefix) {
                throw new Error(`Missing conjugation_family_prefix for infinitive=${infinitive}`)
            }
            pres = conjugation_family_prefix + pres.slice(base_prefix_length)
            past = conjugation_family_prefix + past.slice(base_prefix_length)
            const prefixes_len = infinitive.length - (conjugation_family_prefix.length + conjugable_infinitive.length - base_prefix_length)
            if (prefixes_len > 0) {
                const prefix = infinitive.slice(0, prefixes_len)
                pres = prefix + pres
                past = prefix + past
            }
        } else {
            const prefix_len = infinitive.length - conjugable_infinitive.length
            const prefix = infinitive.slice(0, prefix_len)
            pres = prefix + pres
            past = prefix + past
        }
    }
    return {pres, past}
}


function getParticiosExcepcionales (conj_and_deriv_rules: ConjugationAndDerivationRules) {
    const {infinitive, conjugable_infinitive, prefixes, morphological_rules} = conj_and_deriv_rules

    const prefix_len = infinitive.length - conjugable_infinitive.length
    const prefix = infinitive.slice(0, prefix_len)
    const excepciones_lexicas = morphological_rules?.excepciones_lexicas
    let participios_excepcionales: Participles = {}
    if (excepciones_lexicas?.gerundio) {
        participios_excepcionales.pres = prefix + excepciones_lexicas?.gerundio
    }
    if (excepciones_lexicas?.participio) {
        participios_excepcionales.past = prefix + excepciones_lexicas?.participio
    }
    if (participios_excepcionales.pres || participios_excepcionales.past) {
        return participios_excepcionales
    }
}


function getOrthographicChangesForParticiples(conj_and_deriv_rules: ConjugationAndDerivationRules, regulares: Participles) : Participles | undefined {
    const {infinitive, verb_family, morphological_rules} = conj_and_deriv_rules
    const alternancia_vocálica = morphological_rules?.alternancia_vocálica
    let accumulated: Participles = {...regulares}
    const do_correct_diéresis = infinitive.includes("ü")
    const gerund_ending_len = ((verb_family === "-ar") ? 4 : 5)
    const gerund_ending = regulares.pres.slice(-gerund_ending_len)
    let gerund_stem = regulares.pres.slice(0, -gerund_ending_len)
    if (alternancia_vocálica) {
        let gerundio_tema_cambio = morphological_rules?.excepciones_lexicas?.gerundio_tema_cambio_excepcional
        const excepcional = !!gerundio_tema_cambio
        if (!excepcional) {
            const stem_change_rules = stem_change_patterns[alternancia_vocálica]
            gerundio_tema_cambio = stem_change_rules.gerund_rule
        }
        if (gerundio_tema_cambio) {
            gerund_stem = applyStemChangeToGerundStem({gerund_stem, verb_family, gerundio_tema_cambio, excepcional})
        }
        accumulated.pres = gerund_stem + gerund_ending
    }
    const orthographical_changes = applyOrthographicalChangesForParticiples(accumulated, gerund_ending, do_correct_diéresis)
    accumulated = {...accumulated, ...orthographical_changes}
    if (accumulated.pres === regulares.pres) {
      delete accumulated.pres
    }
    if (accumulated.past === regulares.past) {
      delete accumulated.past
    }
    return accumulated
}


function _deriveParticiples(conj_and_deriv_rules: ConjugationAndDerivationRules) : Participles {
    const { morphological_rules } = conj_and_deriv_rules
    const participios_excepcionales = getParticiosExcepcionales(conj_and_deriv_rules)
    if (participios_excepcionales?.pres && participios_excepcionales?.past) {
        return participios_excepcionales
    }
    const regular = getRegularParticiples(conj_and_deriv_rules)
    // 9. ortografía
    const typography = getOrthographicChangesForParticiples(conj_and_deriv_rules, regular)
    const regular_w_typography = {...regular, ...typography}
    const final_forms = {...regular_w_typography, ...participios_excepcionales}
    return final_forms
}


export function deriveParticiples(infinitive: string): Participles {
    console.log(`deriveParticiples(${infinitive})`)
    const conj_and_deriv_rules = resolveConjugationClass(infinitive)
    if (!conj_and_deriv_rules) {
        return undefined
    }
    let participles = _deriveParticiples(conj_and_deriv_rules)
    return participles
}
