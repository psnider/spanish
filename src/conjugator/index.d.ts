import { VerbAspectRules } from "./regular-verb-rules.js"
import { ModeloConjugacional, VerboClaseConjugacional } from "./verbos-con-cambios-morfológicas.js"

// FIX: nomenclature: InfinitiveThemeVowelClass, or ConjugationClass, or InfinitiveConjugationClass
type MoodTense = "IndPres" | "IndImp" | "IndPret" | "IndFut" | "IndCond" | "SubPres"  | "SubImp"  | "SubFut" | "CmdPos" | "CmdNeg"


interface Participios {
    gerundio?: string
    participio?: string
}


interface MoodTenseMap<T> {
    IndPres?: T
    IndImp?: T
    IndPret?: T
    IndFut?: T
    IndCond?: T

    SubPres?: T
    SubImp?: T
    SubFut?: T

    CmdPos?: T
    CmdNeg?: T
}


// Person-number notation:
// s = singular, p = plural
// s1 = 1st person singular, p2 = 2nd person plural, etc.
// Keys of GrammaticalPersons<T>
// This must match conjugation_keys[]
type GrammaticalPerson = "s1" | "s2" | "s3" | "p1" | "p2" | "p3" | "vos"


interface GrammaticalPersons<T> {
    s1?: T
    s2?: T
    s3?: T
    p1?: T
    p2?: T
    p3?: T
    // The absence of "vos" implies that it is the same as the "s2" form.
    vos?: T
}


// The conjugated forms of a verb, or null if the form is disallowed.
// Two forms occur for:
// - alternations (e.g. SubImp: -ra / -se)
//   - amar,SubImp,p1 has ["amara", "amase"]
// - genuine lexical variants:
//   - haber,IndPres,s2 has ["hay", "ha"]
//   - ir,CmdPos,p1 has ["vayamos", "vamos"]
// null occurs for weather verbs (llover) and commands, and for the s1 forms of Commands.
type VerbForms = [string] | [string, string] | null

type VerbConjugation = GrammaticalPersons<VerbForms>
interface VerbConjugationAnnotation {
    version: string
    license: string
    modelo: ModeloConjugacional
    // filled in for returned conjugations.
    mood_tense?: MoodTense
    // The non regular rules applied to this verb
    rules_applied?: any[]
}

interface VerbConjugationAnnotated {
    notes: VerbConjugationAnnotation
    forms: VerbConjugation
}


// A set of changes that can be applied to a set of conjugations for a verb of a given mood and tense. 
// This is used both for suffixes and stem change rules, and for fully conjugated forms.
type VerbConjugationChanges = VerbConjugation

// A set of stems for a conjugation.
type VerbConjugationStems = VerbConjugation
type VerbConjugationSuffixes = VerbConjugation

// The conjugation clases of verbs.
// These may be presented to users, so they are in Spanish.
type ConjugationClass = 
    // Nivel 0 - Bloqueo (cancela todo: no prefijos, no deducción, no herencia)
      "atómico verdadero"
    // Nivel 1 — Raíz base
    | "pretérito: raíz corta"
    | "futuro: raíz especial"
    // Nivel 2 — Alternancia vocálica
    | "presente: diptongo e → i"
    | "presente: diptongo e → ie"
    | "presente: diptongo o → ue"
    // Nivel 3 — Sufijación regular, no es una clase, es implícito: -ar, -er, -ir
    | "-ar"
    | "-er"
    | "-ir"
    // Nivel 4 — Ortografía
    | "u → ü (diéresis)"
    | "u → y (hiato)"
    | "hiato → y (fonológico)"
    // Nivel 5 - Excepciones puntuales
    | "presente: -go 1.ª p"
    | "presente: -oy 1.ª p"


export interface ParticipleRule {
    // suffix that appends to standard stem
    suffix?: string
    // full form in case of irregular form
    full?: string
}

export interface ParticipleRules {
    pres?: ParticipleRule
    past?: ParticipleRule
}


// Rules describing how a verb (or model) realizes its paradigm.
// T usually represents either suffixes, stem changes, or full forms.
export interface VerbConjugationRules<T> {
    conjugation_classes: ConjugationClass[]
    // The suffix of a family of verbs based on spelling that identifies this conjugation.
    // Only specified for the canonical verb, to which all others in the family refer.
    conjugation_family?: VerboClaseConjugacional
    stem_change_rule_id?: StemChangeRuleId
    participle_rules?: ParticipleRules
    aspects: MoodTenseMap<T> 
}


export type StemChangeRuleId = "e:i" | "e:ie" | "i:í" | "o:u" | "o:ue" | "u:ú" | "u:ue"
type SuffixChangeType = "eer"


export interface VerbRulesApplied {
    ancestor_rule_sets?: VerbAspectRules[]
    suffixes?: VerbConjugation
    stems?: VerbConjugation
    lexical_exceptions_stems?: VerbConjugation
    lexical_exceptions_suffixes?: VerbConjugation
    combined_stems_w_suffixes?: VerbConjugation
    orthography?: VerbConjugation
    suplicaciones?: VerbConjugation
    imperativo_tú?: VerbConjugation
    maintain_stressed_last_sylable?: VerbConjugation
    prefixed?: VerbConjugation
}

export interface ParticipleRulesApplied {
    regular?: Participios
    excepciones_léxicas?: Participios
    prefixed?: Participios
    gerund_stem_change?: string
    orthography?: Participios
}


