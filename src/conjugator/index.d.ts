
type VerbFamily = "ar" | "er" | "ir"
type VerbMood = "Cnd" | "Imp" | "Ind" | "Sub"
type VerbTense = "Fut" | "Imp" | "Past" | "Pres"
type VerbTenseMood = "PresInd" | "PresSub" | "PastInd" | "PastImpInd" | "PastCond" | "FutInd" | "CmdPos" | "CmdNeg"

interface VerbRules {
    "1s"?: string
    "2s"?: string
    "3s"?: string
    "1p"?: string
    "2p"?: string
    "3p"?: string
}

// The conjugated forms of a verb
// In a few cases for irregular verbs, there can be alternate forms for conjugation, e.g. haber,3s: ha,hay
// Such verbs never have derived verbs. 
// null indicates that the conjugation is disallowed, for example for weather verbs (llover) and commands.
interface VerbConjugation {
    "1s"?: string | [string, string] | null
    "2s"?: string | [string, string] | null
    "3s"?: string | [string, string]
    "1p"?: string | null
    "2p"?: string | null
    "3p"?: string | [string, string] | null
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


export interface VerbConjugationRules {
    // Used only for spelling change transforms
    PresInd?: VerbFormConjugationRules
    PresSub?: VerbFormConjugationRules

    PastInd?: VerbFormConjugationRules
    PastImpInd?: VerbFormConjugationRules
    PastCond?: VerbFormConjugationRules

    FutInd?: VerbFormConjugationRules

    CmdPos?: VerbFormConjugationRules
    CmdNeg?: VerbFormConjugationRules
}


// The rules for conjugating a single form of a verb, such as: "PresInd", "PastImpInd"
interface VerbFormConjugationRules {
    // A list of keys that lead to the base form of this conjugation
    // Normally, the verb form is shared, in which case, only a single key is specified.
    // But in cases in which the shared conjugation is found in a different verb form, then both are provided. 
    base?: VerbFamily | VerbTenseMood
    // true if the suffixes should be appended to the infinitive form, otherwise they are appended to the root/stem.
    add_suffix_to_infinitive?: boolean
    suffixes?: VerbConjugationChanges
    // lists valid transforms, used to check for typos
    // spelling?: {
    //     pattern: RegExp,
    //     suffixes: VerbConjugationChanges
    // }
    change_accents?: VerbConjugationChanges
}



// interface VerbConjugationChangesOverrides {
//     PresInd?: Partial<VerbConjugationChanges>
//     PastInd?: Partial<VerbConjugationChanges>
//     PastImpInd?: Partial<VerbConjugationChanges>
// }
// interface VerbConjugation_nonStandard extends VerbConjugationOverrides {
// }
// type VerbConjugationSuffixes = VerbConjugationChanges
// interface VerbConjugationSuffixesForMoodAndTense {
//     PresInd?: VerbConjugationSuffixes
//     PastInd?: VerbConjugationSuffixes
//     PastImpInd?: VerbConjugationSuffixes
// }

// type VerbConjugationSuffixChanges = Partial<VerbConjugationChanges>
// interface VerbConjugationChangesForMoodAndTense {  //OK
//     PresInd?: VerbConjugationSuffixChanges
//     PastInd?: VerbConjugationSuffixChanges
//     PastImpInd?: VerbConjugationSuffixChanges
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
type VerbTenseMoodKey = "PresInd" |  "PastInd"


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
}


interface ConjugationRules {
    unsupported?: boolean
    // another verb that serves as the model for conjugation for this verb
    // This is interesting, but may not be needed...
    model?: string
    // suffix_change_type?: SuffixChangeType    // TODO remove this if unnecessary
    stem_change_type?: StemChangeType
    stem_change_inclusions?: VerbTenseMoodKey[]
    conjugate_only?: ConjugationKey[]
    irregular?: IrregularBase
    reflexive_only?: boolean
}


export interface VerbTextUsage_forTypographicalChange {
    text: string
    infinitive: string
}

