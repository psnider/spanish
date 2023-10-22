
type VerbFamily = "ar" | "er" | "ir"
type VerbMood = "Cnd" | "Imp" | "Ind" | "Sub"
type VerbTense = "Fut" | "Imp" | "Past" | "Pres"
type VerbMoodTense = "IndPres" | "IndPast"

// A set of changes that can be applied to a set of conjugations for a verb of a given mood and tense. 
// This is used both for suffixes and stem change rules.
interface VerbConjugationChanges {
    "1s": string
    "2s": string
    "3s": string
    "1p": string
    "2p": string
    "3p": string
}
// In a few cases for irregular verbs, there can be alternate forms for conjugation, e.g. haber,3s: ha,hay
// Such verbs never have derived verbs. 
interface VerbConjugation {
    "1s": string | [string, string]
    "2s": string | [string, string]
    "3s": string | [string, string]
    "1p": string
    "2p": string
    "3p": string | [string, string]
}

interface VerbConjugationOverrides {
    IndPres?: Partial<VerbConjugation>
    IndPast?: Partial<VerbConjugation>
}
interface VerbConjugationChangesOverrides {
    IndPres?: Partial<VerbConjugationChanges>
    IndPast?: Partial<VerbConjugationChanges>
}
interface VerbConjugation_nonStandard extends VerbConjugationOverrides {
    change_accents?: VerbConjugationChangesOverrides
}
type VerbConjugationSuffixes = VerbConjugationChanges
interface VerbConjugationSuffixesForMoodAndTense {
    IndPres?: VerbConjugationSuffixes
    IndPast?: VerbConjugationSuffixes
}

type VerbConjugationSuffixChanges = Partial<VerbConjugationChanges>
interface VerbConjugationChangesForMoodAndTense {  //OK
    IndPres?: VerbConjugationSuffixChanges
    IndPast?: VerbConjugationSuffixChanges
}
interface StemChangePatterns extends VerbConjugationChangesForMoodAndTense {
    // lists valid transforms, used to check for typos
    transforms: string[]
}

interface SuffixesForRegularVerbFamily {
    regular: VerbConjugationSuffixesForMoodAndTense
    eer?: VerbConjugationSuffixesForMoodAndTense
}
export interface SuffixesForRegularVerbs {
    ar: SuffixesForRegularVerbFamily
    er: SuffixesForRegularVerbFamily
    ir: SuffixesForRegularVerbFamily
}

type StemChangeType = "e:i" | "e:ie" | "o:u" | "o:ue" | "u:ue"
type SuffixChangeType = "eer"

type ConjugationKey = "1s" | "2s" | "3s" | "1p" | "2p" | "3p"
type VerbMoodTenseKey = "IndPres" |  "IndPast"


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


interface ConjugationChanges {
    unsupported?: boolean
    // another verb that serves as the model for conjugation for this verb
    model?: string
    suffix_change_type?: SuffixChangeType
    stem_change_type?: StemChangeType
    stem_change_inclusions?: VerbMoodTenseKey[]
    conjugate_only?: ConjugationKey[]
    irregular?: IrregularBase
    reflexive_only?: boolean
}


export interface VerbTextUsage_forTypographicalChange {
    text: string
    infinitive: string
}


// A filter for selecting the verbs for which a rule may apply.
export interface TypographicalChangeRuleFilter {
    // The last characters of the infinitive.
    // The match succeeds if any of these endings match VerbTextUsage_forTypographicalChange.infinitive. 
    infinitive_endings?: string[]
    // TODO: remove these if it seems they have no application.
    // NOTE: these were used originally, but were later determined to be too narrowing, and unnecessary for the know transformations.
    // // Indicates the last characters of the verb root.
    // verb_root_ending?: string
    // // The verb conjugation group: "ar", "er", "ir"
    // // May be used for any value of apply_to, but it is redundant if infinitive_ending is used).
    // // The match succeeds if any of these endings match VerbTextUsage_forTypographicalChange.infinitive. 
    // verb_families?: VerbFamily[]
    // // The verb mood+tense combinations to which this filter applies.
    // // The match succeeds if any of these endings match VerbTextUsage_forTypographicalChange.mood_tense. 
    // mood_tenses?: VerbMoodTense[]
    // // The match succeeds if any of these endings match VerbTextUsage_forTypographicalChange.conjugation_key. 
    // conjugation_keys?: Array<keyof VerbConjugation>
}


// The form of a typographical change rule.
// These rules are only applied to the conjugated forms of verbs.
export interface TypographicalChangeRule {
    // The name of this rule, used for reporting
    name: string
    // An empty filter means that all verbs will be checked.
    filter: TypographicalChangeRuleFilter
    change: {
        // A pattern describing what to replace.
        // The entire matching text will be replaced by the text described by "replacement".
        match_pattern: RegExp
        // A pattern describing the text that replaces what is matched by match_pattern.
        // A replacement pattern uses the syntax of MS VS Code, e.g.: "c$1"
        // This may contain one capture group index.
        // (The "$" indicates the index of the capture group from the RegExp.)
        replacement_pattern: string
    }
}

