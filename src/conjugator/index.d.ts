
type VerbFamily = "-ar" | "-er" | "-ir"
type VerbMood = "Cnd" | "Imp" | "Ind" | "Sub"
type VerbTense = "Fut" | "Imp" | "Past" | "Pres"
type VerbTenseMood = "IndPres" | "IndImp" | "IndPret" | "IndFut" | "IndCond" | "SubPres"  | "SubImp"  | "SubFut" | "CmdPos" | "CmdNeg"


interface Participles {
    pres: string
    past: string
}


interface AspectsT<T> {
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


// The conjugated forms of a verb
// In a few cases for irregular verbs, there can be alternate forms for conjugation, e.g.:
// - haber,IndPres,s2 has ["hay", "ha"]
// - ir,CmdPos,p1 has ["vayamos", "vamos"]
// And all forms of SubImp have two forms: -ra and -se 
// - amar,SubImp,p1 has ["amara", "amase"]
// null indicates that the conjugation is disallowed, for example for weather verbs (llover) and commands, or the s1 forms of Commands.
type VerbForms = [string] | [string, string] | null

type VerbConjugation = GrammaticalPersons<VerbForms>
interface VerbConjugationAnnotation {
    // filled in for returned conjugations.
    tense_mood?: VerbTenseMood
    // set if verb is unknown and results are a best guess
    unconfirmed?: boolean
}

interface VerbConjugationAnnotated {
    notes: VerbConjugationAnnotation
    forms: VerbConjugation
}


// A set of changes that can be applied to a set of conjugations for a verb of a given mood and tense. 
// This is used both for suffixes and stem change rules, and for fully conjugated forms.
type VerbConjugationChanges = VerbConjugation


// The conjugation clases of verbs.
// These may be presented to users, so they are in Spanish.
// The classes apply in a strict order, which is indicated in the comments.
type ConjugationClass = "atómico verdadero"  // Nivel 0 - Bloqueo (cancela todo: no prefijos, no deducción, no herencia)
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
    stem?: string
    // suffix that appends to standard stem
    suffix?: string
    // full form in case of irregular form
    full?: string
}

export interface ParticipleRules {
    pres?: ParticipleRule
    past?: ParticipleRule
}


// A family of verbs that conjugate the same depending on the termination.
// A preceding hyphen indicates that the form is not a verb itself.
type ConjugationFamily = "-acer" | "decir" | "-ducir" | "-eer" | "-iar" | "oír" | "poner" | "seguir" | "tener" | "traer" | "-uir"

export interface VerbConjugationRules<T> {
    conjugation_classes: ConjugationClass[]
    // The suffix of a family of verbs based on spelling that identifies these this pattern.
    // Only specified for the canonical verb, to which all others in the family refer.
    conjugation_family?: ConjugationFamily
    participle_rules?: ParticipleRules
    aspects: AspectsT<T> 
}


type StemChangeRuleId = "e:i" | "e:ie" | "o:u" | "o:ue" | "u:ú" | "u:ue"
type SuffixChangeType = "eer"

// This must match conjugation_keys[]
type GrammaticalPerson = "s1" | "s2" | "s3" | "p1" | "p2" | "p3" | "vos"


interface IrregularBase {
    // The name of the verb upon which this conjugation is based.
    // This is the name of the verb itself if it is the topmost verb, for example: "huir"
    // "huir" is also the base of "construir", which is formed by removing the "h", and adding "constr".
    base: string
}



// The model of conjugation.
// Note that some models are not verbs themselves, but are productive verb endings. These are marked with a leading hyphen.
export type ConjugationModel = VerbFamily | ConjugationFamily
                    | "delinquir"
                    | "caber" | "caer" | "dar" | "erguir" | "estar"
                    | "haber" | "ir" | "jugar" | "poder"
                    | "querer" | "saber" | "salir" | "ser"
                    | "venir" | "ver"


interface ConjugationRules {
    // another verb that serves as the model for conjugation for this verb
    // This is interesting, but may not be needed...
    model?: string
    // suffix_change_type?: SuffixChangeType    // TODO remove this if unnecessary
    stem_change_rule_id?: StemChangeRuleId
    // The verb VerbTenseMood's that have a stem change.
    // Note that this is not dependent on other verb construction relationships, so if the stem change occurs in a VerbTenseMood, it must be listed here.
    stem_change_inclusions?: VerbTenseMood[]
    conjugate_only?: GrammaticalPerson[]
    irregular?: IrregularBase
    individual_accents?: AspectsT<GrammaticalPersons<VerbForms>>
}


export interface VerbTextUsage_forTypographicalChange {
    text: string
    infinitive: string
}
