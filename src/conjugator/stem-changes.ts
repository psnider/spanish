import { TenseMoodMap, GrammaticalPersons, TenseMood, VerbConjugation, VerbForms, StemChangeRuleId } from "./index.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";
import { InfinitiveClass, verbos_con_cambios_morfológicas } from "./verbos-con-cambios-morfológicas.js";

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



export const stem_change_descriptions: Record<StemChangeRuleId, StemChangeDescription> = {
    // FIX: linguist
    // It appears that this regex picks out the "e:ie" verbs: /([bcfhlmnprstv]|qu)e(br|l|mbl|n|nd|ns|nt|nz|r|rd|rn|rr|rt|s|st|v|z)[aei]r$/
    "e:ie": { from: "e", to: "ie", kind: "diphthongization" },
    "o:ue": { from: "o", to: "ue", kind: "diphthongization" },
    "u:ue": { from: "u", to: "ue", kind: "diphthongization" },
    // NO: pensar, perder, SÍ: sentir
    "e:i":  { from: "e", to: "i",  kind: "vowel raising", only_for_ir_verbs: true },
    // SÍ: dormir, poder (excepcional via gerundio_tema_cambio_excepcional)
    "o:u":  { from: "o", to: "u",  kind: "vowel raising", only_for_ir_verbs: true  },
    "i:í":  { from: "i", to: "í",  kind: "orthographic stress" },
    "u:ú":  { from: "u", to: "ú",  kind: "orthographic stress" },
}


type StemChangesForMoodTense = GrammaticalPersons<StemChangeRuleId>


export interface StemChangeRules extends TenseMoodMap<StemChangesForMoodTense> {
    // Used only for spelling change transforms
    allowed_transforms: StemChangeRuleId[]
    gerund_rule?: StemChangeRuleId
}


// The patterns used for stem changes.
// The form is: original_character : replacement_characters
// The changes apply to the last instance of the original_character in a verb stem (root form).
// Nota: 
// - ocurre solo en formas tónicas
// - excluye nosotros / vosotros
// - puede coexistir con yo en -g, pretérito fuerte, etc.
export const stem_change_patterns: {[stem_change_pattern_name: string]: StemChangeRules} = {
    "e:i": {
        // "pedir", "decir"
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
        // "pensar", "perder", "sentir"
        allowed_transforms: ["e:ie", "e:i"],
        gerund_rule: null,
        IndPres: {s1: "e:ie", s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
        SubPres: {s1: "e:ie", s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
        IndPret: {                        s3: "e:i",                          p3: "e:i"},
        CmdPos:  {            s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
        CmdNeg:  {            s2: "e:ie", s3: "e:ie",                         p3: "e:ie"},
    },
    "i:í": {
        allowed_transforms: ["i:í"],
        // FIX: linguist: figure out what this is exactly
    },
    // "o:u" is only used for vowel raising wihin "o:ue" verbs, and is not a pattern for stem changes generally
    "o:ue": {
        // "poder", "volver"
        allowed_transforms: ["o:ue", "o:u"],
        gerund_rule: "o:u",
        IndPres: {s1: "o:ue", s2: "o:ue", s3: "o:ue",                         p3: "o:ue"},
        IndPret: {                        s3: "o:u",                          p3: "o:u"},
        SubPres: {s1: "o:ue", s2: "o:ue", s3: "o:ue", p1: "o:u", p2: "o:u",   p3: "o:ue"},
        CmdPos:  {            s2: "o:ue", s3: "o:ue", p1: "o:u",              p3: "o:ue"},
        CmdNeg:  {            s2: "o:ue", s3: "o:ue", p1: "o:u", p2: "o:u",   p3: "o:ue"},
    },
    "u:ú": {
        // "reunir"
        // accent only, not an actual stem change
        allowed_transforms: ["u:ú"],
        gerund_rule: null,
        IndPres: {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú"},
        SubPres: {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú",    vos: "u:ú"},
        CmdPos:  {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú"},
        CmdNeg:  {s1: "u:ú", s2: "u:ú", s3: "u:ú",                            p3: "u:ú",    vos: "u:ú"},
    },
    "u:ue": {
        // "jugar" is the only verb with this stem change
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
export function getStemChangesFromRule(mood_tense: TenseMood, alternancia_vocálica: StemChangeRuleId) : StemChangesForMoodTense | undefined {
    if (alternancia_vocálica) {
        const stem_changes_for_type = stem_change_patterns[<keyof StemChangeRules> alternancia_vocálica]
        if (!stem_changes_for_type) {
            throw new Error(`stem_change_type=${alternancia_vocálica} does not exist in stem_change_patterns`)
        }
        const stem_changes = stem_changes_for_type[mood_tense]
        return stem_changes
    }
}


export function getStemChangeForGerrundFromRule(alternancia_vocálica: StemChangeRuleId) {
    if (alternancia_vocálica) {
        const stem_changes_for_type = stem_change_patterns[<keyof StemChangeRules> alternancia_vocálica]
        if (!stem_changes_for_type) {
            throw new Error(`stem_change_type=${alternancia_vocálica} does not exist in stem_change_patterns`)
        }
        return stem_changes_for_type.gerund_rule
    }
}


export function applyStemChangePattern(verb_part: string, stem_change_description: StemChangeDescription) : string {
    const i = verb_part.lastIndexOf(stem_change_description.from)
    if (i === -1) {
        const rule_id = `${stem_change_description.from}:${stem_change_description.to}`
        throw new Error(`can't apply stem_change_rule_id=${rule_id} to verb_part=${verb_part}`)
    }
    const changed_part = verb_part.slice(0,i) + stem_change_description.to + verb_part.slice(i + stem_change_description.from.length)
    return changed_part
}


// @return The root of each conjugation that should be used after applying any stem change.
// This is the unchanged root if there is no stem change.
// regular_suffixes: provides the grammatical persons to be conjugated, as well as the number of forms for each
export function getStemChanges(args: {conjugable_infinitive: string, verb_family: InfinitiveClass, tense_mood: TenseMood, suffixes: VerbConjugation}) : VerbConjugation {
    const {conjugable_infinitive, verb_family, tense_mood, suffixes} = args
    const verb_root = conjugable_infinitive.slice(0, -2)
    const conjugated_stems: VerbConjugation = {}
    const morphophonemic_conjugation_rules = verbos_con_cambios_morfológicas[conjugable_infinitive]
    const alternancia_vocálica = morphophonemic_conjugation_rules?.alternancia_vocálica
    const stem_change_rules = (alternancia_vocálica ? getStemChangesFromRule(tense_mood, alternancia_vocálica) : undefined)
    // const conjugate_only = morphophonemic_conjugation_rules?.conjugate_only
    if (stem_change_rules) {
        for (const key in suffixes) {
            const gramatical_person = key as keyof typeof suffixes
            let stem: string
            const stem_change_rule = stem_change_rules?.[gramatical_person]
            const do_apply_stem_change = true  // !conjugate_only || conjugate_only.includes(gramatical_person)
            if (stem_change_rule && do_apply_stem_change) {
                const rule_description = stem_change_descriptions[stem_change_rule]
                if (!rule_description.only_for_ir_verbs || verb_family === "-ir") {
                    stem = applyStemChangePattern(verb_root, rule_description)
                } else {
                    stem = verb_root
                }
            } else {

                stem = verb_root
            }
            const forms_count =  suffixes[gramatical_person]?.length
            if (forms_count) {
                conjugated_stems[gramatical_person] = <VerbForms> new Array(forms_count).fill(stem)
            }
        }
    }
    return conjugated_stems
}


// Get gerund with any stem changes.
export function applyStemChangeToGerundStem(args: {gerund_stem: string, verb_family: InfinitiveClass, gerundio_tema_cambio: StemChangeRuleId, excepcional: boolean}): string {
    const {verb_family, gerundio_tema_cambio, excepcional} = args
    let gerund_stem = args.gerund_stem
    // if (verb_family === "-ir") {
        if (gerundio_tema_cambio) {
            const stem_change_description = stem_change_descriptions[gerundio_tema_cambio]
            if (stem_change_description.kind !== "vowel raising") {
                throw new Error(`for gerund_stem=${gerund_stem} verb_family=${verb_family} expect stem_change_description.kind=${stem_change_description.kind} to be "vowel raising"`)
            }
            if (excepcional || !stem_change_description.only_for_ir_verbs || (verb_family === "-ir")) {
                gerund_stem = applyStemChangePattern(gerund_stem, stem_change_description)
            }
        }
    // }
    return gerund_stem
}

