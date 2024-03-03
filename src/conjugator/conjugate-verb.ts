import { VerbConjugation, VerbConjugationAnnotated, VerbTenseMood } from ".";
import { applyAccentChanges } from "./accent_changes.js";
import { getAnnotations } from "./conjugation-rules-per-verb.js";
import { applyIrregularConjugationRules } from "./irregular-conjugations.js";
import { conjugation_keys } from "./lib.js";
import { getVerbFamily, getRegularSuffixes, doAddSuffixToInfinitive } from "./regular-verb-rules.js";
import { getStemChanges } from "./stem-change-patterns.js";
import { applyTypographicalChangeRules } from "./typographical-rules.js";


function combineRegularSuffixesAndStemChanges(infinitive: string, tense_mood: VerbTenseMood) : VerbConjugation {
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


// @param tense_mood The forms to conjugate, given by mood and tense. 
// @return The conjugated forms for the given verb.
// @note In some cases, only some forms are returned, such as for weather verbs.
//   For example, there is no form of "I rain".
export function conjugateVerb(infinitive: string, tense_mood: VerbTenseMood): VerbConjugationAnnotated {
    const regular_conjugation = combineRegularSuffixesAndStemChanges(infinitive, tense_mood)
    const corrected_typography = applyTypographicalChangeRules(infinitive, regular_conjugation)
    const corrected_regular_conjugation = {...regular_conjugation, ...corrected_typography}
    const irregular_conjugation = applyIrregularConjugationRules(infinitive, tense_mood, corrected_regular_conjugation)
    const spelled_conjugation = {...corrected_regular_conjugation, ...irregular_conjugation}
    const accent_changes = applyAccentChanges(infinitive, tense_mood, spelled_conjugation)
    const complete_conjugation: VerbConjugation = {...spelled_conjugation, ...accent_changes}
    const notes = getAnnotations(infinitive, tense_mood)
    const annotated_conjugation = {notes, forms: complete_conjugation}
    return annotated_conjugation
}

