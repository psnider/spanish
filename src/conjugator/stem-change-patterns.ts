import { ConjugationRules, VerbConjugation, VerbRules, VerbTenseMood, VerbTenseMoodKey } from ".";
import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { conjugation_keys } from "./lib.js";



export interface StemChangeRules {
    // Used only for spelling change transforms
    transforms?: string[]
    PresInd?: VerbRules
    PresSub?: VerbRules

    PastInd?: VerbRules
    PastImpInd?: VerbRules
    PastCond?: VerbRules
    
    FutInd?: VerbRules
    CmdPos?: VerbRules
    CmdNeg?: VerbRules
}


// The patterns used for stem changes.
// The form is: original_character : replacement_characters
// The changes apply to the last instance of the original_character in a verb stem (root form).
export const stem_change_patterns: {[stem_change_pattern_name: string]: StemChangeRules} = {
    "o:ue": {
        transforms: ["o:ue", "o:u"],
        PresInd: {"1s": "o:ue", "2s": "o:ue", "3s": "o:ue", "3p": "o:ue"},
        PastInd: {"3s": "o:u", "3p": "o:u"},
    },
    "e:i": {
        transforms: ["e:i"],
        PresInd: {"1s": "e:i", "2s": "e:i", "3s": "e:i", "3p": "e:i"},
        PastInd: {"3s": "e:i", "3p": "e:i"},
    },
    "e:ie": {
        transforms: ["e:ie", "e:i"],
        PresInd: {"1s": "e:ie", "2s": "e:ie", "3s": "e:ie", "3p": "e:ie"},
        PastInd: {"3s": "e:i", "3p": "e:i"},
    },
    "u:ue": {
        transforms: ["u:ue"],
        PresInd: {"1s": "u:ue", "2s": "u:ue", "3s": "u:ue", "3p": "u:ue"},
    },
}


// Get any stem change patterns for the given verb mood and tense.
// @return Stem change patterns for those conjugated forms for which they exist.
//   For example: getStemChanges("PresInd", {stem_change_type: "o:ue"}):
//     {"1s": "o:ue", "2s": "o:ue", "3s": "o:ue", "3p": "o:ue"},
function getStemChangesFromRule(mood_tense: VerbTenseMood, irregular_rules?: ConjugationRules) : VerbConjugation | undefined {
    const stem_change_type = irregular_rules?.stem_change_type
    if (stem_change_type) {
        const stem_changes_for_type = stem_change_patterns[<keyof StemChangeRules> stem_change_type]
        if (stem_changes_for_type) {
            if (irregular_rules.stem_change_inclusions?.includes(<VerbTenseMoodKey> mood_tense)) {
                const stem_changes = stem_changes_for_type[mood_tense]
                return stem_changes
            }
        }
    }
    return {}
}



// @return The root that should be used after applying any stem change.
// This is the unchanged root if there is no stem change.
export function getStemChanges(args: {infinitive: string, tense_mood: VerbTenseMood}) : VerbConjugation {
    const {infinitive, tense_mood} = args
    const verb_root = infinitive.slice(0, -2)
    let conjugated_stems: VerbConjugation = {}
    conjugation_keys.forEach((key: keyof VerbConjugation) => {conjugated_stems[key] = verb_root})
    let conjugation_rules = verb_conjugation_rules[infinitive]
    if (conjugation_rules) {
        const stem_changes = getStemChangesFromRule(tense_mood, conjugation_rules)
        const valid_conjugation_keys = conjugation_rules?.conjugate_only || conjugation_keys
        conjugation_keys.forEach((conjugation_key: keyof(VerbConjugation)) => {
            const stem_change = stem_changes[conjugation_key]
            if (stem_change && valid_conjugation_keys.includes(conjugation_key)) {
                if (typeof stem_change == "string") {
                    const [unchanged, changed] = stem_change.split(":")
                    const i = verb_root.lastIndexOf(unchanged)
                    if (i === -1) {
                        throw new Error(`can't apply stem_change=${stem_change} to verb_root=${verb_root}`)
                    }
                    const changed_root = verb_root.slice(0,i) + changed + verb_root.slice(i + unchanged.length)
                    conjugated_stems[conjugation_key] = changed_root
                } else {
                    throw new Error(`unexpect stem_change=${stem_change} for verb_root=${verb_root} conjugation_key=${conjugation_key}`)
                }
            }
        })            
    }
    return conjugated_stems
}

