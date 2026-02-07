// FIX: nomenclature: InfinitiveThemeVowelClass, or ConjugationClass, or InfinitiveConjugationClass
type InfinitiveClass = "-ar" | "-er" | "-ir"
type TenseMood = "IndPres" | "IndImp" | "IndPret" | "IndFut" | "IndCond" | "SubPres"  | "SubImp"  | "SubFut" | "CmdPos" | "CmdNeg"


interface Participles {
    pres: string
    past: string
}


interface TenseMoodMap<T> {
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
    model: ConjugationModel
    // filled in for returned conjugations.
    tense_mood?: TenseMood
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

// FIX: nomenclature: 
// lexeme-based classes: tener, etc

//
// Inflectional subclass
// (-uir verbs, -ger/-gir verbs, -cer/-cir verbs, -iar/-uar verbs…)
// "uir" | "ger_gir" | "cer_cir" | "iar_uar" | "none"

// Irregular paradigm class
// (tener-class, venir-class, decir-class, poner-class…)

// → Morphophonological subclasses
// -uir verbs (huir, construir, concluir…)
// → predictable y insertion

// -ger / -gir (escoger, dirigir…)
// → predictable j in yo

// -cer / -cir (conocer, conducir…)
// → predictable zc in yo

// -iar / -uar (enviar, actuar…)
// → predictable stress shifts (with dialect variation)



// A family of verbs that conjugate the same depending on the termination.
// A preceding hyphen indicates that the form is not a verb itself.
type ConjugationFamily = "-acer" | "decir" | "-ducir" | "-eer" | "-iar" | "oír" | "poner" | "seguir" | "tener" | "traer" | "-uir"


// Rules describing how a verb (or model) realizes its paradigm.
// T usually represents either suffixes, stem changes, or full forms.
export interface VerbConjugationRules<T> {
    conjugation_classes: ConjugationClass[]
    // The suffix of a family of verbs based on spelling that identifies this conjugation.
    // Only specified for the canonical verb, to which all others in the family refer.
    conjugation_family?: ConjugationFamily
    participle_rules?: ParticipleRules
    aspects: TenseMoodMap<T> 
}


type StemChangeRuleId = "e:i" | "e:ie" | "o:u" | "o:ue" | "u:ú" | "u:ue"
type SuffixChangeType = "eer"



// The model of conjugation.
// Note that some models are not verbs themselves, but are productive verb endings. These are marked with a leading hyphen.
export type ConjugationModel = InfinitiveClass | ConjugationFamily
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
    conjugate_only?: GrammaticalPerson[]
    // The name of the verb upon which this conjugation is based.
    // This is the name of the verb itself if it is the topmost verb, for example: "huir"
    // "huir" is also the base of "construir", which is formed by removing the "h", and adding "constr".
    irregular_base?: string
    individual_accents?: TenseMoodMap<GrammaticalPersons<VerbForms>>
}

