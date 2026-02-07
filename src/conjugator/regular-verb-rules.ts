import { VerbConjugation, VerbConjugationChanges, TenseMood, VerbConjugationRules, InfinitiveClass } from ".";


interface VerbAspectModifications {
    // stem selection: only one of these may be selected
    // The default behavior is to append the 'suffixes' to the root or stem.
    // The next two fields can change that behavior.
    // true if the suffixes should be appended to the infinitive form.
    add_suffix_to_infinitive?: boolean
    // true if the stress should be placed on the last sylable of the stem of the 3rd-person plural form.
    add_suffix_to_preterite_p3_stem?: boolean

    // prosody
    // true if the last sylable of the 1st-person plural form a verb stem must be accented.
    stress_last_sylable_of_p1_stem?: boolean
}

// The rules for conjugating a single form of a verb, such as: "IndPres", "IndImp"
interface VerbAspectRules extends VerbAspectModifications {
    // - an InfinitiveClass is used for cross-family inheritance
    // - a TenseMood is used for a different tense in the same family
    base?: InfinitiveClass | TenseMood

    // morphology
    suffixes?: VerbConjugationChanges
}


// The suffixes used by all standard verb conjugations.
// That is, those that are not irregular.
// Note that even irregular verbs often use these suffixes for most forms.
export const regular_verb_suffixes: { [ending: string]: VerbConjugationRules<VerbAspectRules> } = {
    "-ar": {    // ar: like "amar"
        conjugation_classes: ["-ar"],
        participle_rules: { pres: {suffix: "ando"}, past: {suffix: "ado"}},
        aspects: {
            IndPres: { suffixes: { s1: ["o"],   s2: ["as"],   s3: ["a"],   p1: ["amos"],   p2: ["áis"],    p3: ["an"],  vos: ["ás"] } },
            IndImp:  { suffixes: { s1: ["aba"], s2: ["abas"], s3: ["aba"], p1: ["ábamos"], p2: ["abais"],  p3: ["aban"] } },
            IndPret: { suffixes: { s1: ["é"],   s2: ["aste"], s3: ["ó"],   p1: ["amos"],   p2: ["asteis"], p3: ["aron"] } },
            IndFut:  { add_suffix_to_infinitive: true, 
                       suffixes: { s1: ["é"],   s2: ["ás"],   s3: ["á"],   p1: ["emos"],   p2: ["éis"],    p3: ["án"] } },
            IndCond: { add_suffix_to_infinitive: true, 
                       suffixes: { s1: ["ía"],  s2: ["ías"],  s3: ["ía"],  p1: ["íamos"],  p2: ["íais"],   p3: ["ían"] } },
            SubPres: { suffixes: { s1: ["e"],   s2: ["es"],   s3: ["e"],   p1: ["emos"],   p2: ["éis"],    p3: ["en"] } },
            SubImp:  { add_suffix_to_preterite_p3_stem: true, stress_last_sylable_of_p1_stem: true,
                       suffixes: { s1: ["ra",    "se"],    s2: ["ras",  "ses"],  s3: ["ra",  "se"], 
                                   p1: ["ramos", "semos"], p2: ["rais", "seis"], p3: ["ran", "sen"]} },
            SubFut:  { add_suffix_to_preterite_p3_stem: true, stress_last_sylable_of_p1_stem: true,
                       suffixes: { s1: ["re"],  s2: ["res"],  s3: ["re"],  p1: ["remos"],  p2: ["reis"],   p3: ["ren"]} },
            CmdPos:  { suffixes: { s1: null,    s2: ["a"],    s3: ["e"],   p1: ["emos"],   p2: ["ad"],     p3: ["en"],  vos: ["á"] } },
            CmdNeg:  { base: "SubPres", 
                       suffixes: { s1: null } },
        }
    },
    "-er": {   // er: like "temer"
        conjugation_classes: ["-er"],
        participle_rules: { pres: {suffix: "iendo"}, past: {suffix: "ido"}},
        aspects: {
            IndPres: { suffixes: { s1: ["o"],   s2: ["es"],   s3: ["e"],   p1: ["emos"],   p2: ["éis"], p3: ["en"], vos: ["és"] } },
            IndImp:  { suffixes: { s1: ["ía"],  s2: ["ías"],  s3: ["ía"],  p1: ["íamos"],  p2: ["íais"], p3: ["ían"] } },
            IndPret: { suffixes: { s1: ["í"],   s2: ["iste"], s3: ["ió"],  p1: ["imos"],   p2: ["isteis"], p3: ["ieron"] } },
            IndFut:  { base: "-ar" },
            IndCond: { base: "-ar" },
            SubPres: { suffixes: { s1: ["a"],   s2: ["as"],   s3: ["a"],   p1: ["amos"],   p2: ["áis"], p3: ["an"] } },
            SubImp:  { base: "-ar" },
            SubFut:  { base: "-ar" },
            CmdPos:  { suffixes: { s1: null,    s2: ["e"],    s3: ["a"],   p1: ["amos"],   p2: ["ed"], p3: ["an"], vos: ["é"] } },
            CmdNeg:  { base: "SubPres", suffixes: { s1: null } },
        }
    },
    "-ir": {    // ir: like "partir"
        conjugation_classes: ["-ir"],
        // participle_rules: { base: "-er" },
        participle_rules: { pres: {suffix: "iendo"}, past: {suffix: "ido"}},
        aspects: {
            IndPres: { base: "-er", suffixes: {                            p1: ["imos"],   p2: ["ís"],             vos: ["ís"] } },
            IndImp:  { base: "-er" },
            IndPret: { base: "-er" },
            IndFut:  { base: "-ar" },
            IndCond: { base: "-ar" },
            SubPres: { base: "-er" },
            SubImp:  { base: "-ar" },
            SubFut:  { base: "-ar" },
            CmdPos:  { base: "-er", suffixes: {                                            p2: ["id"],             vos: ["í"] } },
            CmdNeg:  { base: "-er" },
        }
    }
}


const verb_terminations = ["ar", "er", "ir"]


export function getInfinitiveClass(infinitive: string) : InfinitiveClass {
    let verb_termination = infinitive.slice(-2)
    if (verb_termination === "ír") {
        verb_termination = "ir"
    }
    if (verb_terminations.includes(verb_termination)) {
        return <InfinitiveClass>('-' + verb_termination)        
    }
}


const verb_families = ["-ar", "-er", "-ir"]


function getParentVerb(conjugation_rules: VerbAspectRules, verb_family: InfinitiveClass, tense_mood: TenseMood) {
    const base = conjugation_rules.base
    const base_is_infinitive_class = verb_families.includes(base)
    verb_family = base_is_infinitive_class ? <InfinitiveClass> base : verb_family
    tense_mood  = base_is_infinitive_class ? tense_mood : <TenseMood> base
    conjugation_rules = regular_verb_suffixes[verb_family].aspects[tense_mood]
    return {conjugation_rules, verb_family, tense_mood}    
}


// Get the rule sets that form the conjugation ancestry of this verb.
export function getAncestorRuleSets(infinitive: string, tense_mood: TenseMood) : VerbAspectRules[] {
    let verb_family = getInfinitiveClass(infinitive)
    let conjugation_rules = regular_verb_suffixes[verb_family].aspects[tense_mood]
    const rule_sets: VerbAspectRules[] = [conjugation_rules]
    while (conjugation_rules.base) {
        const base_rules = getParentVerb(conjugation_rules, verb_family, tense_mood)
        ;({conjugation_rules, verb_family, tense_mood} = base_rules)
        rule_sets.unshift(conjugation_rules)
    }
    if (["CmdPos","CmdNeg"].includes(tense_mood)) {
        const last_rule_set = rule_sets[rule_sets.length - 1]
        if (last_rule_set?.suffixes) {
            last_rule_set.suffixes.s1 = null
        }
    }
    return rule_sets
}


function modificationIsRequired(infinitive: string, tense_mood: TenseMood, modification: keyof VerbAspectModifications) {
    const rule_sets = getAncestorRuleSets(infinitive, tense_mood)
    return rule_sets[0]?.[modification]
}


export function doAddSuffixToInfinitive(infinitive: string, tense_mood: TenseMood) {
    return modificationIsRequired(infinitive, tense_mood, "add_suffix_to_infinitive")
}



export function doUsePreteriteP3Stem(infinitive: string, tense_mood: TenseMood) {
    return modificationIsRequired(infinitive, tense_mood, "add_suffix_to_preterite_p3_stem")
}


export function doStressLastSylableOfP1Stem(infinitive: string, tense_mood: TenseMood) {
    return modificationIsRequired(infinitive, tense_mood, "stress_last_sylable_of_p1_stem")
}


// Get the suffixes for the given verb family, mood, and tense, applying a suffix change if one is given. 
// @return The set of suffixes for all of the conjugated forms.
// For example: getSuffixes("creer", "IndPret", "eer")
//    {s1: ["í"], s2: ["íste"], s3: ["yó"], p1: ["ímos"], p2: ["ísteis"], p3: ["yeron"]}
export function getRegularSuffixes(infinitive: string, tense_mood: TenseMood /* , suffix_change_type?: SuffixChangeType */) : VerbConjugationChanges {
    const rule_sets = getAncestorRuleSets(infinitive, tense_mood)
    let accumulated_suffixes: VerbConjugationChanges = {...rule_sets[0].suffixes}
    rule_sets.slice(1).forEach((rule_set) => {
        if (rule_set.suffixes) {
            const conjugation_keys = Object.keys(rule_set.suffixes)
            conjugation_keys.forEach((conjugation_key: keyof VerbConjugation) => {
                const ancestor_suffix = rule_set.suffixes[conjugation_key]
                const accumulated_suffix = accumulated_suffixes[conjugation_key]
                if (accumulated_suffix == null) {
                    // do not update a form that has been set to null, as that indicates an invalid form
                } else if (ancestor_suffix == null) {
                    // if ancestor is null, it overwrites a possibly specified form
                    accumulated_suffixes[conjugation_key] = null
                } else {
                    accumulated_suffixes[conjugation_key] = <any> ancestor_suffix
                }
            })
        }
    })
    return accumulated_suffixes
}

