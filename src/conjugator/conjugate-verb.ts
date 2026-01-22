import { IrregularBase, VerbConjugation, VerbConjugationAnnotated, VerbTenseMood } from ".";
import { getChangedAccents } from "./accent_changes.js";
import { getAnnotations, verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { applyIrregularConjugationRules } from "./irregular-conjugations.js";
import { conjugation_keys } from "./lib.js";
import { getVerbFamily, getRegularSuffixes, doAddSuffixToInfinitive } from "./regular-verb-rules.js";
import { getStemChanges } from "./stem-change-patterns.js";
import { getTypographicChanges } from "./typographical-rules.js";


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



function getDerivedSpelling(infinitive: string, tense_mood: VerbTenseMood, irregular_base_conjugated: VerbConjugation, irregular: IrregularBase) : VerbConjugation {
    if (irregular.add || irregular.remove) {
        const derived_spelling: VerbConjugation = {}
        Object.keys(irregular_base_conjugated).forEach((conjugation_key: keyof VerbConjugation) => {
            const irregular_base_form = irregular_base_conjugated[conjugation_key]
            if (Array.isArray(irregular_base_form)) {
                throw new Error(`require single form for infinitive=${infinitive} tense_mood=${tense_mood} irregular_base_conjugated[${conjugation_key}]=${irregular_base_form}`)
            }
            let irregular_derived_conjugated: string = irregular_base_form
            if (irregular.remove) {
                if (!irregular_derived_conjugated.startsWith(irregular.remove)) {
                    throw new Error (`irregular_base_form=${irregular_base_form} from infinitive=${infinitive} doesn't start with irregular_rules.irregular.remove=${irregular.remove}"`)
                }
                irregular_derived_conjugated = irregular_base_form.slice(irregular.remove.length)
            }
            if (irregular.add) {
                irregular_derived_conjugated = irregular.add + irregular_derived_conjugated
            }
            derived_spelling[conjugation_key] = irregular_derived_conjugated
        })
        return derived_spelling
    } else {
        return {}
    }
}


// @param tense_mood The forms to conjugate, given by mood and tense. 
// @return The conjugated forms for the given verb.
// @note In some cases, only some forms are returned, such as for weather verbs.
//   For example, there is no form of "I rain".
export function conjugateVerb(infinitive: string, tense_mood: VerbTenseMood): VerbConjugationAnnotated {
    function getBaseInfinitive(infinitive: string) {
        // if ((infinitive.length > 3) && infinitive.endsWith("eer")) {
        //     return {irregular: {base: "huir", remove: "h", add: "infl"}}
        // }
        let irregular = verb_conjugation_rules[infinitive]?.irregular
        if (irregular) {
            const base_infinitive = irregular?.base
            if (base_infinitive && (infinitive !== base_infinitive)) {
                if (irregular.remove || irregular.add) {
                    return base_infinitive
                } else {
                    throw new Error(`irregular infinitive=${infinitive} with base must have spelling changes`)
                }
            }
        }
        return infinitive
    }
    const base_infinitive = getBaseInfinitive(infinitive)
    const base_regular_conjugation = combineRegularSuffixesAndStemChanges(base_infinitive, tense_mood)
    const base_corrected_typography = getTypographicChanges(base_infinitive, base_regular_conjugation)
    const base_corrected_regular_conjugation = {...base_regular_conjugation, ...base_corrected_typography}
    const base_irregular_conjugation = applyIrregularConjugationRules(base_infinitive, tense_mood, base_corrected_regular_conjugation)
    // use over-ride assignment pattern in case regular and irregular don't have exactly the same conjugations 
    const base_merged_conjugation = {...base_corrected_regular_conjugation, ...base_irregular_conjugation}
    const base_accent_changes = getChangedAccents(base_infinitive, tense_mood, base_merged_conjugation)
    const base_complete_conjugation: VerbConjugation = {...base_merged_conjugation, ...base_accent_changes}
    const notes = getAnnotations(infinitive, tense_mood)
    if (base_infinitive != infinitive) {
        const base_rules = verb_conjugation_rules[infinitive]
        const irregular_rules = base_rules.irregular
        const derived_spelling_changes = getDerivedSpelling(base_infinitive, tense_mood, base_complete_conjugation, irregular_rules)
        const derived_conjugation = {...base_complete_conjugation, ...derived_spelling_changes}
        const accent_changes = base_rules.individual_accents?.[tense_mood]
        const derived_accented_conjugation = {...derived_conjugation, ...accent_changes}
        return {notes, forms: derived_accented_conjugation}
    } else {
        return {notes, forms: base_complete_conjugation}
    }
}
