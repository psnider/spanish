import { VerbConjugation } from ".";
import { applyToVerbForms, conjugation_keys } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";


export function applyPrefixes(conj_and_derviv_rules: ConjugationAndDerivationRules, conjugated_forms: VerbConjugation) : VerbConjugation {
    const {infinitive, model, conjugable_infinitive, is_conjugation_family, conjugation_family_prefix} = conj_and_derviv_rules
    const prefixed_forms: VerbConjugation = {}
    if (infinitive != conjugable_infinitive) {
        if (is_conjugation_family) {
            const base_prefix_len = conjugable_infinitive.length - (model.length - 1)
            const prefixes = conj_and_derviv_rules.prefixes?.join("") || ""
            const prefix = prefixes + (conjugation_family_prefix || "")
            conjugation_keys.forEach((gramatical_person: keyof VerbConjugation) => {
                const verb_forms = conjugated_forms[gramatical_person]
                applyToVerbForms(conjugated_forms, prefixed_forms, gramatical_person, (form: string) => {
                    form = prefix + form.slice(base_prefix_len)
                    return form
                })
            })
            return prefixed_forms
        } else {
            const prefix_len = infinitive.length - conjugable_infinitive.length
            const prefix = infinitive.slice(0, prefix_len)
            conjugation_keys.forEach((gramatical_person: keyof VerbConjugation) => {
                const verb_forms = conjugated_forms[gramatical_person]
                applyToVerbForms(conjugated_forms, prefixed_forms, gramatical_person, (form: string) => {
                    return prefix + form
                })
            })
        }
    }
    return prefixed_forms
}
