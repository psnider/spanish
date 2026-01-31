import { AspectsT, ConjugationRules, GrammaticalPersons, VerbConjugation, VerbTenseMood } from ".";
import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { conjugation_keys } from "./lib.js";


type StemChangesForMoodTense = GrammaticalPersons<string>

export interface StemChangeRules extends AspectsT<StemChangesForMoodTense> {
    // Used only for spelling change transforms
    transforms?: string[]
}


// The patterns used for stem changes.
// The form is: original_character : replacement_characters
// The changes apply to the last instance of the original_character in a verb stem (root form).
export const stem_change_patterns: {[stem_change_pattern_name: string]: StemChangeRules} = {
    "e:i": {
        transforms: ["e:i"],
        IndPres: {s1: "e:i", s2: "e:i", s3: "e:i",                             p3: "e:i"},
        IndPret: {s3: "e:i", p3: "e:i"},
        SubPres: {s1: "e:i", s2: "e:i", s3: "e:i", p1: "e:i", p2: "e:i", p3: "e:i"},
        SubImp:  {s1: "e:i", s2: "e:i", s3: "e:i", p1: "e:i", p2: "e:i", p3: "e:i"},
        SubFut:  {s1: "e:i", s2: "e:i", s3: "e:i", p1: "e:i", p2: "e:i", p3: "e:i"},
        CmdPos:  {           s2: "e:i", s3: "e:i", p1: "e:i",            p3: "e:i", vos: null},
        CmdNeg:  {           s2: "e:i", s3: "e:i", p1: "e:i", p2: "e:i", p3: "e:i"},
    },
    "e:ie": {
        transforms: ["e:ie", "e:i"],
        IndPres: {s1: "e:ie", s2: "e:ie", s3: "e:ie", p3: "e:ie"},
        SubPres: {s1: "e:ie", s2: "e:ie", s3: "e:ie", p3: "e:ie"},
        IndPret: {s1: "e:i", s2: "e:i", s3: "e:i", p1: "e:i", p2: "e:i", p3: "e:i"},
        IndFut:  {s1: "e:ie", s2: "e:ie", s3: "e:ie", p1: "e:ie", p2: "e:ie", p3: "e:ie"},
        CmdPos:  {              s2: "e:ie", s3: "e:ie",                             p3: "e:ie"},
        CmdNeg:  {              s2: "e:ie", s3: "e:ie",                             p3: "e:ie"},
    },
    "o:ue": {
        transforms: ["o:ue", "o:u"],
        IndPres: {s1: "o:ue", s2: "o:ue", s3: "o:ue",                          p3: "o:ue"},
        IndPret: {                        s3: "o:u",                           p3: "o:u"},
        SubPres: {s1: "o:ue", s2: "o:ue", s3: "o:ue",                          p3: "o:ue"},
        CmdPos:  {            s2: "o:ue", s3: "o:ue",                          p3: "o:ue"},
        CmdNeg:  {            s2: "o:ue", s3: "o:ue",                          p3: "o:ue"},
    },
    "u:ú": {
        transforms: ["u:ú"],
        IndPres: {s1: "u:ú", s2: "u:ú", s3: "u:ú",                                  p3: "u:ú"},
        SubPres: {s1: "u:ú", s2: "u:ú", s3: "u:ú",                                  p3: "u:ú",    vos: "u:ú"},
        CmdPos:  {s1: "u:ú", s2: "u:ú", s3: "u:ú",                                  p3: "u:ú"},
        CmdNeg:  {s1: "u:ú", s2: "u:ú", s3: "u:ú",                                  p3: "u:ú",    vos: "u:ú"},
    },
    "u:ue": {
        transforms: ["u:ue"],
        IndPres: {s1: "u:ue", s2: "u:ue", s3: "u:ue", p3: "u:ue"},
        SubPres: {s1: "u:ue", s2: "u:ue", s3: "u:ue", p3: "u:ue"},
        CmdPos:  {              s2: "u:ue", s3: "u:ue",                             p3: "u:ue"},
        CmdNeg:  {              s2: "u:ue", s3: "u:ue",                             p3: "u:ue"},
    },
}


// Get any stem change patterns for the given verb mood and tense.
// @return Stem change patterns for those conjugated forms for which they exist.
//   For example: getStemChanges("IndPres", {stem_change_type: "o:ue"}):
//     {s1: "o:ue", s2: "o:ue", s3: "o:ue", p3: "o:ue"},
function getStemChangesFromRule(infinitive: string, mood_tense: VerbTenseMood, irregular_rules?: ConjugationRules) : StemChangesForMoodTense | undefined {
    const stem_change_type = irregular_rules?.stem_change_type
    if (stem_change_type) {
        const stem_changes_for_type = stem_change_patterns[<keyof StemChangeRules> stem_change_type]
        if (stem_changes_for_type) {
            if (irregular_rules.stem_change_inclusions?.includes(mood_tense)) {
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
    conjugation_keys.forEach((key: keyof VerbConjugation) => {conjugated_stems[key] = [verb_root]})
    let conjugation_rules = verb_conjugation_rules[infinitive]
    if (conjugation_rules) {
        const stem_changes = getStemChangesFromRule(infinitive, tense_mood, conjugation_rules)
        const valid_conjugation_keys = conjugation_rules?.conjugate_only || conjugation_keys
        conjugation_keys.forEach((conjugation_key: keyof(VerbConjugation)) => {
            const stem_change = stem_changes[conjugation_key]
            if (stem_change && valid_conjugation_keys.includes(conjugation_key)) {
                // if (stem_change.length != 1) {
                //     throw new Error(`unexpect stem_change=${stem_change} for verb_root=${verb_root} conjugation_key=${conjugation_key}`)
                // }
                const [unchanged, changed] = stem_change.split(":")
                const i = verb_root.lastIndexOf(unchanged)
                if (i === -1) {
                    throw new Error(`can't apply stem_change=${stem_change} to verb_root=${verb_root}`)
                }
                const changed_root = verb_root.slice(0,i) + changed + verb_root.slice(i + unchanged.length)
                conjugated_stems[conjugation_key] = [changed_root]
            }
        })            
    }
    return conjugated_stems
}

