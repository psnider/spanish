import { TenseMoodMap, ConjugationRules, GrammaticalPersons, Participles, VerbConjugation, InfinitiveClass, TenseMood, GrammaticalPerson, VerbForms } from ".";
import { morphophonemic_verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { applyToVerbForms } from "./lib.js";

// e→ie, o→ue (sílabas tónicas)
// e→i, o→u (solo -ir, sílaba átona)
// u→ú, i→í (hiato)
type StemChangeKind = "diphthongization" | "vowel raising" | "orthographic stress"


export interface StemChangeDescription {
  from: string
  to: string
  kind: StemChangeKind
  only_for_ir_verbs?: boolean
}


export const stem_change_descriptions: Record<string, StemChangeDescription> = {
    // FIX: linguist
    // It appears that this regex picks out the "e:ie" verbs: /([bcfhlmnprstv]|qu)e(br|l|mbl|n|nd|ns|nt|nz|r|rd|rn|rr|rt|s|st|v|z)[aei]r$/
  "e:ie": { from: "e", to: "ie", kind: "diphthongization" },
  "o:ue": { from: "o", to: "ue", kind: "diphthongization" },
  "u:ue": { from: "u", to: "ue", kind: "diphthongization" },
  "e:i":  { from: "e", to: "i",  kind: "vowel raising", only_for_ir_verbs: true },
  "o:u":  { from: "o", to: "u",  kind: "vowel raising", only_for_ir_verbs: true },
  "u:ú":  { from: "u", to: "ú",  kind: "orthographic stress" },
}

type StemChangeRuleId = keyof typeof stem_change_descriptions



type StemChangesForMoodTense = GrammaticalPersons<StemChangeRuleId>

export interface StemChangeRules extends TenseMoodMap<StemChangesForMoodTense> {
    // Used only for spelling change transforms
    allowed_transforms: StemChangeRuleId[]
    gerund_rule?: StemChangeRuleId
}


// The patterns used for stem changes.
// The form is: original_character : replacement_characters
// The changes apply to the last instance of the original_character in a verb stem (root form).
export const stem_change_patterns: {[stem_change_pattern_name: string]: StemChangeRules} = {
    "e:i": {
        allowed_transforms: ["e:i"],
        gerund_rule: "e:i",
        IndPres: {s1: "e:i",  s2: "e:i",  s3: "e:i",                          p3: "e:i"},
        IndPret: {                        s3: "e:i",                          p3: "e:i"},
        SubPres: {s1: "e:i",  s2: "e:i",  s3: "e:i",  p1: "e:i",  p2: "e:i",  p3: "e:i"},
        SubImp:  {s1: "e:i",  s2: "e:i",  s3: "e:i",  p1: "e:i",  p2: "e:i",  p3: "e:i"},
        SubFut:  {s1: "e:i",  s2: "e:i",  s3: "e:i",  p1: "e:i",  p2: "e:i",  p3: "e:i"},
        CmdPos:  {            s2: "e:i",  s3: "e:i",  p1: "e:i",              p3: "e:i",    vos: null},
        CmdNeg:  {            s2: "e:i",  s3: "e:i",  p1: "e:i",  p2: "e:i",  p3: "e:i"},
    },
    "e:ie": {
        allowed_transforms: ["e:ie", "e:i"],
        gerund_rule: null,
        IndPres: {s1: "e:ie", s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
        SubPres: {s1: "e:ie", s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
        // IndPret: {s1: "e:i", s2: "e:i", s3: "e:i", p1: "e:i", p2: "e:i", p3: "e:i"},
        IndPret: {                        s3: "e:i",                          p3: "e:i"},
        IndFut:  {s1: "e:ie", s2: "e:ie", s3: "e:ie", p1: "e:ie", p2: "e:ie", p3: "e:ie"},
        CmdPos:  {            s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
        CmdNeg:  {            s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
    },
    // "o:u" is only used for vowel raising wihin "o:ue" verbs, and is not a pattern for stem changes generally
    "o:ue": {
        allowed_transforms: ["o:ue", "o:u"],
        gerund_rule: "o:u",
        IndPres: {s1: "o:ue", s2: "o:ue", s3: "o:ue",                         p3: "o:ue"},
        IndPret: {                        s3: "o:u",                          p3: "o:u"},
        SubPres: {s1: "o:ue", s2: "o:ue", s3: "o:ue", p1: "o:u", p2: "o:u",   p3: "o:ue"},
        CmdPos:  {            s2: "o:ue", s3: "o:ue", p1: "o:u",              p3: "o:ue"},
        CmdNeg:  {            s2: "o:ue", s3: "o:ue", p1: "o:u", p2: "o:u",   p3: "o:ue"},
    },
    "u:ú": {
        allowed_transforms: ["u:ú"],
        gerund_rule: null,
        IndPres: {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú"},
        SubPres: {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú",    vos: "u:ú"},
        CmdPos:  {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú"},
        CmdNeg:  {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú",    vos: "u:ú"},
    },
    // "jugar" is the only verb with this stem change
    "u:ue": {
        allowed_transforms: ["u:ue"],
        gerund_rule: null,
        IndPres: {s1: "u:ue", s2: "u:ue", s3: "u:ue",                         p3: "u:ue"},
        SubPres: {s1: "u:ue", s2: "u:ue", s3: "u:ue",                         p3: "u:ue"},
        CmdPos:  {            s2: "u:ue", s3: "u:ue",                         p3: "u:ue"},
        CmdNeg:  {            s2: "u:ue", s3: "u:ue",                         p3: "u:ue"},
    },
}


// Get any stem change patterns for the given verb mood and tense.
// @return Stem change patterns for those conjugated forms for which they exist.
//   For example: getStemChanges("IndPres", {stem_change_type: "o:ue"}):
//     {s1: "o:ue", s2: "o:ue", s3: "o:ue", p3: "o:ue"},
function getStemChangesFromRule(infinitive: string, mood_tense: TenseMood, morphophonemic_conjugation_rules?: ConjugationRules) : StemChangesForMoodTense | undefined {
    const stem_change_type = morphophonemic_conjugation_rules?.stem_change_rule_id
    if (stem_change_type) {
        const stem_changes_for_type = stem_change_patterns[<keyof StemChangeRules> stem_change_type]
        if (!stem_changes_for_type) {
            throw new Error(`stem_change_type=${stem_change_type} does not exist in stem_change_patterns`)
        }
        const stem_changes = stem_changes_for_type[mood_tense]
        return stem_changes
    }
}


function applyStemChangePattern(verb_part: string, verb_family: InfinitiveClass, stem_change_rule_id: StemChangeRuleId) : string {
    const rule_description = stem_change_descriptions[stem_change_rule_id]
    if (rule_description.only_for_ir_verbs && verb_family !== "-ir") {
        return verb_part
    } else {
        const i = verb_part.lastIndexOf(rule_description.from)
        if (i === -1) {
            throw new Error(`can't apply stem_change_rule_id=${stem_change_rule_id} to verb_part=${verb_part}`)
        }
        const changed_part = verb_part.slice(0,i) + rule_description.to + verb_part.slice(i + rule_description.from.length)
        return changed_part
    }
}


// @return The root that should be used after applying any stem change.
// This is the unchanged root if there is no stem change.
// regular_suffixes: provides the grammatical persons to be conjugated, as well as the number of forms for each
export function getStems(args: {conjugable_infinitive: string, verb_family: InfinitiveClass, tense_mood: TenseMood, regular_suffixes: VerbConjugation}) : VerbConjugation {
    const {conjugable_infinitive, verb_family, tense_mood, regular_suffixes} = args
    const verb_root = conjugable_infinitive.slice(0, -2)
    const conjugated_stems: VerbConjugation = {}
    const morphophonemic_conjugation_rules = morphophonemic_verb_conjugation_rules[conjugable_infinitive]
    const stem_change_rules = (morphophonemic_conjugation_rules ? getStemChangesFromRule(conjugable_infinitive, tense_mood, morphophonemic_conjugation_rules) : undefined)
    const conjugate_only = morphophonemic_conjugation_rules?.conjugate_only
    for (const key in regular_suffixes) {
        const gramatical_person = key as keyof typeof regular_suffixes
        let stem: string
        const stem_change_rule = stem_change_rules?.[gramatical_person]
        const do_apply_stem_change =  !conjugate_only || conjugate_only.includes(gramatical_person)
        if (stem_change_rule && do_apply_stem_change) {
            stem = applyStemChangePattern(verb_root, verb_family, stem_change_rule)
        } else {
            stem = verb_root
        }
        const forms_count = regular_suffixes[gramatical_person]?.length
        if (forms_count) {
            conjugated_stems[gramatical_person] = <VerbForms> new Array(forms_count).fill(stem)
        }
    }
    return conjugated_stems
}


// Get gerund with any stem changes.
export function applyStemChangeToGerundStem(args: {gerund_stem: string, verb_family: InfinitiveClass, stem_change_rule_id: StemChangeRuleId}): string {
    const {verb_family, stem_change_rule_id} = args
    let gerund_stem = args.gerund_stem
    if (verb_family === "-ir") {
        const stem_change_rules = stem_change_patterns[stem_change_rule_id]
        const gerund_rule = stem_change_rules.gerund_rule
        if (gerund_rule) {
            const stem_change_description = stem_change_descriptions[gerund_rule]
            if (stem_change_description.kind !== "vowel raising") {
                throw new Error(`for gerund_stem=${gerund_stem} verb_family=${verb_family} expect stem_change_description.kind=${stem_change_description.kind} to be "vowel raising"`)
            }
            gerund_stem = applyStemChangePattern(gerund_stem, verb_family, gerund_rule)
        }
    }
    return gerund_stem
}


