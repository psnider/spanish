import { VerbConjugation, VerbConjugationAnnotated, VerbTenseMood } from ".";
import { getChangedAccents } from "./accent_changes.js";
import { getAnnotations, verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { applyIrregularConjugationRules } from "./irregular-conjugations.js";
import { conjugation_keys } from "./lib.js";
import { getRegularSuffixes, doAddSuffixToInfinitive } from "./regular-verb-rules.js";
import { getStemChanges } from "./stem-change-patterns.js";
import { getTypographicChanges } from "./typographical-rules.js";
import { findPrefixOfIrregularVerb } from "./find-prefix-of-irregular-verb.js";


export function combineRegularSuffixesAndStemChanges(infinitive: string, tense_mood: VerbTenseMood) : VerbConjugation {
    const regular_suffixes = getRegularSuffixes(infinitive, tense_mood)
    const add_suffix_to_infinitive = doAddSuffixToInfinitive(infinitive, tense_mood)
    const stem_changes = getStemChanges({infinitive, tense_mood})
    const verb_root = infinitive.slice(0, -2)
    let conjugation: VerbConjugation = {}
    conjugation_keys.forEach((key) => {
        const suffix = regular_suffixes[key]
        if (suffix != null) {
            if (typeof suffix !== "string") {
                throw new Error(`unexpected non-string suffix=${suffix} for infinitive=${infinitive}, tense_mood=${tense_mood}`)
            }    
            if (add_suffix_to_infinitive) {
                conjugation[key] = infinitive + suffix
            } else {
                const stem_change = stem_changes[key]
                if ((stem_change === undefined) || (typeof stem_change === "string")) {
                    conjugation[key] = (stem_change || verb_root) + suffix
                } else {
                    throw new Error(`unexpected non-string stem_change=${stem_change} for infinitive=${infinitive}, tense_mood=${tense_mood}`)
                }    
            }
        }
    })
    return conjugation
}


function getDerivedSpelling(infinitive: string, base_infinitive: string, tense_mood: VerbTenseMood, base_conjugation: VerbConjugation) : VerbConjugation {
    let base_infinitive_rules = verb_conjugation_rules[base_infinitive]
    const {conjugation_family, irregular} = base_infinitive_rules
    if (!base_infinitive_rules.conjugation_family) {
        throw new Error(`infinitive=${infinitive} with irregular base must have a conjugation_family`)
    }
    const conjugation_family_length = conjugation_family.length
    const base_prefix = irregular.base.slice(0, -conjugation_family_length)
    const infinitive_prefix = infinitive.slice(0, -conjugation_family_length)
    if (!infinitive_prefix) {
        throw new Error(`a derived infinitive=${infinitive} must add back to the irregular base=${irregular.base}`)
    }
    const derived_spelling: VerbConjugation = {}
    Object.keys(base_conjugation).forEach((conjugation_key: keyof VerbConjugation) => {
        const irregular_base_form = base_conjugation[conjugation_key]
        if (Array.isArray(irregular_base_form)) {
            throw new Error(`require single form for infinitive=${infinitive} tense_mood=${tense_mood} irregular_base_conjugated[${conjugation_key}]=${irregular_base_form}`)
        }
        let irregular_derived_conjugated: string = irregular_base_form
        if (base_prefix) {
            if (!irregular_derived_conjugated.startsWith(base_prefix)) {
                throw new Error (`irregular_base_form=${irregular_base_form} from infinitive=${infinitive} doesn't start with irregular_rules.irregular.remove=${base_prefix}"`)
            }
            irregular_derived_conjugated = irregular_base_form.slice(base_prefix.length)
        }
        irregular_derived_conjugated = infinitive_prefix + irregular_derived_conjugated
        derived_spelling[conjugation_key] = irregular_derived_conjugated
    })
    return derived_spelling
}


const conjugation_families: {[ending: string]: string} = {
    delinquir: "delinquir",    // prevents mismatch with "huir"
    eer: "leer",
    uir: "huir"
    // FIX: consider all of these
        //     -aer / -oer
        // -tener 
        // -poner 
        // -decir 
        // -ducir
        // NO -acer
        // -acer / -ocer 
}


// @param tense_mood The forms to conjugate, given by mood and tense. 
// @return The conjugated forms for the given verb.
// @note In some cases, only some forms are returned, such as for weather verbs.
//   For example, there is no form of "I rain".
export function conjugateVerb(infinitive: string, tense_mood: VerbTenseMood): VerbConjugationAnnotated {
    function getBaseInfinitive(infinitive: string): string {
        // if the infinitive is irregular, use its description
        let irregular = verb_conjugation_rules[infinitive]?.irregular
        if (irregular) {
            if (!irregular.base) {
                throw new Error (`irregular infinitive=${irregular.base} doesn't specify an irregular.base`)
            }
            return irregular.base
        } else {
            // otherwise, look for prefix pattern with an irregular base
            const verb_components = findPrefixOfIrregularVerb(infinitive)
            if (verb_components.prefix) {
                irregular = verb_conjugation_rules[verb_components.base]?.irregular
            }
            if (!irregular) {
                for (const conjugation_family in conjugation_families) {
                    const conjugation_family_len = conjugation_family.length
                    if ((verb_components.base.length >= conjugation_family_len) && verb_components.base.endsWith(conjugation_family)) {
                        return conjugation_families[conjugation_family]
                    }
                }
            }
            return infinitive
        }        
    }
    const base_infinitive = getBaseInfinitive(infinitive)
    const base_regular_conjugation = combineRegularSuffixesAndStemChanges(base_infinitive, tense_mood)
    const base_corrected_typography = getTypographicChanges(base_infinitive, base_regular_conjugation)
    const base_corrected_regular_conjugation = {...base_regular_conjugation, ...base_corrected_typography}
    const base_irregular_conjugation = applyIrregularConjugationRules(base_infinitive, tense_mood, base_corrected_regular_conjugation)
    // use over-ride assignment pattern in case regular and irregular don't have exactly the same conjugations 
    const base_merged_conjugation = {...base_corrected_regular_conjugation, ...base_irregular_conjugation}
    const base_accent_changes = getChangedAccents(base_infinitive, tense_mood, base_merged_conjugation)
    const base_accented_conjugation: VerbConjugation = {...base_merged_conjugation, ...base_accent_changes}
    const notes = getAnnotations(infinitive, tense_mood)
    if (base_infinitive != infinitive) {
        // console.log(`(base_infinitive=${base_infinitive} != infinitive=${infinitive})`)
        const derived_spelling_changes = getDerivedSpelling(infinitive, base_infinitive, tense_mood, base_accented_conjugation)
        const derived_conjugation = {...base_accented_conjugation, ...derived_spelling_changes}
        const infinitive_rules = verb_conjugation_rules[infinitive]
        const accent_changes = infinitive_rules?.individual_accents?.[tense_mood]
        const derived_accented_conjugation = {...derived_conjugation, ...accent_changes}
        return {notes, forms: derived_accented_conjugation}
    } else {
        return {notes, forms: base_accented_conjugation}
    }
}
