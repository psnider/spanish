
type VerbFamily = "ar" | "er" | "ir"
type VerbMood = "Cnd" | "Imp" | "Ind" | "Sub"
type VerbTense = "Fut" | "Imp" | "Past" | "Pres"
type VerbTenseMood = "PresInd" | "PresSub" | "PastInd" | "PastImp" | "FutInd" | "FutCond" | "CmdPos" | "CmdNeg"

interface AspectsT<T> {
    // Used only for spelling change transforms
    PresInd?: T
    PresSub?: T

    PastInd?: T
    PastImp?: T

    FutInd?: T
    FutCond?: T

    CmdPos?: T
    CmdNeg?: T
}

interface ConjugationKeys<T> {
    "1s"?: T
    "2s"?: T
    "3s"?: T
    "1p"?: T
    "2p"?: T
    "3p"?: T
    "vos"?: T
}


type VerbRules = ConjugationKeys<string>

// The conjugated forms of a verb
// In a few cases for irregular verbs, there can be alternate forms for conjugation, e.g. haber,3s: ha,hay
// Such verbs never have derived verbs. 
// null indicates that the conjugation is disallowed, for example for weather verbs (llover) and commands.
type VerbForms = string | [string, string] | null
interface VerbConjugation {
    "1s"?: VerbForms
    "2s"?: VerbForms
    // haber,PresInd has ["hay", "ha"]
    "3s"?: VerbForms
    // ir,CmdPos has ["vayamos", "vamos"]
    "1p"?: VerbForms
    "2p"?: VerbForms
    "3p"?: VerbForms
    vos?: VerbForms
}

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

// // A set of changes that can be applied to a set of conjugations for a verb of a given mood and tense. 
// // This is used both for suffixes and stem change rules, and for fully conjugated forms.
// interface VerbConjugations {
//     "1s": string
//     "2s": string
//     "3s": string
//     "1p": string
//     "2p": string
//     "3p": string
// }

// A set of changes that can be applied to a set of conjugations for a verb of a given mood and tense. 
// This is used both for suffixes and stem change rules, and for fully conjugated forms.
type VerbConjugationChanges = VerbConjugation


export interface VerbConjugationRules<T> {
    participles?: {pres: string, past: string}
    aspects: AspectsT<T> 
}




// interface VerbConjugationChangesOverrides {
//     PresInd?: Partial<VerbConjugationChanges>
//     PastInd?: Partial<VerbConjugationChanges>
//     PastImp?: Partial<VerbConjugationChanges>
// }
// interface VerbConjugation_nonStandard extends VerbConjugationOverrides {
// }
// type VerbConjugationSuffixes = VerbConjugationChanges
// interface VerbConjugationSuffixesForMoodAndTense {
//     PresInd?: VerbConjugationSuffixes
//     PastInd?: VerbConjugationSuffixes
//     PastImp?: VerbConjugationSuffixes
// }

// type VerbConjugationSuffixChanges = Partial<VerbConjugationChanges>
// interface VerbConjugationChangesForMoodAndTense {  //OK
//     PresInd?: VerbConjugationSuffixChanges
//     PastInd?: VerbConjugationSuffixChanges
//     PastImp?: VerbConjugationSuffixChanges
// }
// interface StemChangePatterns extends VerbConjugationChangesForMoodAndTense {
// }

// interface SuffixesForRegularVerbFamily {
//     regular: VerbConjugationSuffixesForMoodAndTense
//     eer?: VerbConjugationSuffixesForMoodAndTense
// }
// export interface SuffixesForRegularVerbs {
//     ar: SuffixesForRegularVerbFamily
//     er: SuffixesForRegularVerbFamily
//     ir: SuffixesForRegularVerbFamily
// }

type StemChangeType = "e:i" | "e:ie" | "o:u" | "o:ue" | "u:ue"
type SuffixChangeType = "eer"

type ConjugationKey = "1s" | "2s" | "3s" | "1p" | "2p" | "3p"
// type VerbTenseMoodKey = "PresInd" |  "PastInd"


interface IrregularBase {
    // The name of the verb upon which this conjugation is based.
    // This is the name of the verb itself if it is the topmost verb, for example: "huir"
    // "huir" is also the base of "construir", which is formed by removing the "h", and adding "constr".
    base: string
    // The prefix to remove from the base verb, before adding the final prefix.
    remove?: string
    // The prefix to add to base verb after any prefix has been removed.
    add?: string
    // Indicates that the associated rules to change accents should be applied. 
    change_accents?: boolean
    individual_accents?: AspectsT<ConjugationKeys<string>>
}


interface ConjugationRules {
    unsupported?: boolean
    // another verb that serves as the model for conjugation for this verb
    // This is interesting, but may not be needed...
    model?: string
    // suffix_change_type?: SuffixChangeType    // TODO remove this if unnecessary
    stem_change_type?: StemChangeType
    stem_change_inclusions?: VerbTenseMood[]
    conjugate_only?: ConjugationKey[]
    irregular?: IrregularBase
    reflexive_only?: boolean
}


export interface VerbTextUsage_forTypographicalChange {
    text: string
    infinitive: string
}

