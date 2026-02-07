import { VerbConjugation, VerbForms } from ".";
import { applyToVerbForms } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";


// Return any prefixed forms.
// This does not return any unmodified forms.
export function applyPrefixes(conj_and_deriv_rules: ConjugationAndDerivationRules, conjugated_forms: VerbConjugation) : VerbConjugation {
    const {infinitive, model, conjugable_infinitive, is_conjugation_family, conjugation_family_prefix} = conj_and_deriv_rules
    const prefixed_forms: VerbConjugation = {}
    if (infinitive !== conjugable_infinitive) {
        // The text difference between the infinitive and the conjugable_infinitive gives the prefix,
        // except for when the conjugation is for a conjugation_family, in which case, the prefix of the conjugable_infinitive must be removed first.
        const conjugation_family_model_len = model.length - 1
        const infinitive_prefix_len = infinitive.length - (is_conjugation_family ? conjugation_family_model_len : conjugable_infinitive.length)
        const infinitive_prefix = infinitive.slice(0, infinitive_prefix_len)
        const len_unused_prefix_of_conjugation_family = conjugable_infinitive.length - conjugation_family_model_len
        for (const key in conjugated_forms) {
            const grammatical_person = key as keyof typeof conjugated_forms
            prefixed_forms[grammatical_person] = applyToVerbForms(conjugated_forms[grammatical_person], (form: string) => {
                if (is_conjugation_family) {
                    form = form.slice(len_unused_prefix_of_conjugation_family)
                }
                return infinitive_prefix + form
            })
        }
    }
    return prefixed_forms
}
