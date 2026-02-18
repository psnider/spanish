import { VerbConjugation, VerbForms } from ".";
import { applyToVerbForms } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";


// Prefixes that precede irregular verbs.
// This isn't a list of all known prefixes.
// These are in order of: first letter, then longest first when there is a prefix match.
// Each entry has a comment giving one example that shows the use of the prefix.
const verb_prefixes = [
    "ante",     // anteponer
    "auto",     // autoregular, NO irregular
    "abs",      // abstener, abstraer
    "ad",       // advenir
    // "a",        // atener, atraer, avenir BUT matches amar
    "ben",      // bendecir
    "contra",   // contradecir, contrahacer, contraponer
    "com",      // componer
    "con",      // contener, contraer, condecir, convenir
    "co",       // cooperar, NO irregular
    "desa",     // (des + a ) desavenir
    "des",      // desavenir, deshacer, desoír
    "de",       // detener, detraer
    "dis",      // distraer
    "entre",    // entreoír
    "en",
    "extra",
    "ex",       // extraer
    "hiper",
    "im",       // imponer
    "inter",    // interponer, intervenir
    "in",
    "mal",      // maldecir
    // mantener
    "micro",
    "mini",
    "mono",
    "multi",
    // oponer
    // obtener
    "post",
    "pos",     // posponer
    "pre",     // predecir, prevenir
    "pro",     // proponer, provenir
    "retro",
    "re",      // rehacer, reponer, retener, retraer
    "semi",
    "sobre",   // sobresalir, sobrevenir
    "sos",     // sostener
    // suponer
    "sub",
    "super",   // superponer
    // sustraer
    "trans",
    "ultra",
]


export function findProductiveVerbPrefix(verb_part: string, min_ending_length: number) : {prefix?: string, remainder: string} | undefined{
    for (const prefix of verb_prefixes) {
        if (verb_part.startsWith(prefix)) {
            const tail = verb_part.slice(prefix.length)
            if (tail.length >= min_ending_length) {
                return {prefix, remainder: tail}
            }
        }
    }
}


// Return prefixed forms, or undefined if there are no prefixes.
export function applyPrefixes(conj_and_deriv_rules: ConjugationAndDerivationRules, conjugated_forms: VerbConjugation) : VerbConjugation | undefined {
    const {infinitive, model, conjugable_infinitive, is_conjugation_family} = conj_and_deriv_rules
    if (infinitive !== conjugable_infinitive) {
        const prefixed_forms: VerbConjugation = {}
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
        return prefixed_forms
    }
}


export function applyPrefixesToSingleForm(conj_and_deriv_rules: ConjugationAndDerivationRules, form: string) : string | undefined {
    const {infinitive, model, conjugable_infinitive, is_conjugation_family} = conj_and_deriv_rules
        const conjugation_family_model_len = model.length - 1
        const infinitive_prefix_len = infinitive.length - (is_conjugation_family ? conjugation_family_model_len : conjugable_infinitive.length)
        const infinitive_prefix = infinitive.slice(0, infinitive_prefix_len)
        const len_unused_prefix_of_conjugation_family = conjugable_infinitive.length - conjugation_family_model_len
        if (is_conjugation_family) {
            form = form.slice(len_unused_prefix_of_conjugation_family)
        }
        return infinitive_prefix + form
}
