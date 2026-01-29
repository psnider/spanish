import { VerbConjugation, VerbConjugationChanges, VerbTenseMood, VerbConjugationRules } from ".";


type VerbFamily = "ar" | "er" | "ir"
const verb_families = ["ar", "er", "ir"]



// The rules for conjugating a single form of a verb, such as: "IndPres", "IndImp"
interface VerbAspectSuffixRules {
    // A list of keys that lead to the base form of this conjugation
    // Normally, the verb form is shared, in which case, only a single key is specified.
    // But in cases in which the shared conjugation is found in a different verb form, then both are provided. 
    base?: VerbFamily | VerbTenseMood
    // true if the suffixes should be appended to the infinitive form, otherwise they are appended to the root/stem.
    add_suffix_to_infinitive?: boolean
    suffixes?: VerbConjugationChanges
}


// The suffixes used by all standard verb conjugations.
// That is, those that are not irregular.
// Note that even irregular verbs often use these suffixes for most forms.
export const regular_verb_suffixes: { [ending: string]: VerbConjugationRules<VerbAspectSuffixRules> } = {
    ar: {    // ar: like "amar"
        conjugation_classes: [],
        aspects: {
            IndPres: { suffixes: { s1: "o", s2: "as", s3: "a", p1: "amos", p2: "áis", p3: "an" } },
            SubPres: { suffixes: { s1: "e", s2: "es", s3: "e", p1: "emos", p2: "éis", p3: "en" } },
            IndPret: { suffixes: { s1: "é", s2: "aste", s3: "ó", p1: "amos", p2: "asteis", p3: "aron" } },
            IndImp: { suffixes: { s1: "aba", s2: "abas", s3: "aba", p1: "ábamos", p2: "abais", p3: "aban" } },
            IndFut: { add_suffix_to_infinitive: true, suffixes: { s1: "é", s2: "ás", s3: "á", p1: "emos", p2: "éis", p3: "án" } },
            IndCond: { add_suffix_to_infinitive: true, suffixes: { s1: "ía", s2: "ías", s3: "ía", p1: "íamos", p2: "íais", p3: "ían" } },
            CmdPos: { suffixes: { s1: null, s2: "a", s3: "e", p1: "emos", p2: "ad", p3: "en" } },
            CmdNeg: { base: "SubPres", suffixes: { s1: null } },
        }
    },
    er: {   // er: like "temer"
        conjugation_classes: [],
        aspects: {
            IndPres: { suffixes: { s1: "o", s2: "es", s3: "e", p1: "emos", p2: "éis", p3: "en" } },
            SubPres: { suffixes: { s1: "a", s2: "as", s3: "a", p1: "amos", p2: "áis", p3: "an" } },
            IndPret: { suffixes: { s1: "í", s2: "iste", s3: "ió", p1: "imos", p2: "isteis", p3: "ieron" } },
            //   spelling: {
            //     pattern: /eer$/,
            //     suffixes: { s1: "í", s2: "íste", s3: "yó", p1: "ímos", p2: "ísteis", p3: "yeron"}
            //  }},
            IndImp: { suffixes: { s1: "ía", s2: "ías", s3: "ía", p1: "íamos", p2: "íais", p3: "ían" } },
            IndFut: { base: "ar" },
            IndCond: { base: "ar" },
            CmdPos: { suffixes: { s1: null, s2: "e", s3: "a", p1: "amos", p2: "ed", p3: "an" } },
            CmdNeg: { base: "SubPres", suffixes: { s1: null } },
        }
    },
    ir: {    // ir: like "partir"
        conjugation_classes: [],
        aspects: {
            IndPres: { base: "er", suffixes: { p1: "imos", p2: "ís" } },
            SubPres: { base: "er" },
            IndPret: { base: "er" },
            IndImp: { base: "er" },
            IndFut: { base: "ar" },
            IndCond: { base: "ar" },
            CmdPos: { base: "er", suffixes: { p2: "id" } },
            CmdNeg: { base: "er" },
        }
    }
}


export function getVerbFamily(infinitive: string) {
    let verb_family = infinitive.slice(-2)
    if (verb_family === "ír") {
        verb_family = "ir"
    }
    if (verb_family !== "ar" && verb_family !== "er" && verb_family !== "ir") {
        console.log(`invalid infinitive=${infinitive}`)
        verb_family = undefined
    }
    return <VerbFamily> verb_family
}


function getParentVerb(conjugation_rules: VerbAspectSuffixRules, verb_family: VerbFamily, tense_mood: VerbTenseMood) {
    const base_is_verb_family = verb_families.includes(conjugation_rules.base)
    if (base_is_verb_family) {
        // different verb family, same tense_mood
        verb_family = <VerbFamily> conjugation_rules.base
        conjugation_rules = regular_verb_suffixes[verb_family].aspects[tense_mood]
        return {conjugation_rules, verb_family, tense_mood}    
    } else {  // base is tense_mood
        // same verb family, different tense_mood
        tense_mood = <VerbTenseMood> conjugation_rules.base
        conjugation_rules = regular_verb_suffixes[verb_family].aspects[tense_mood]
        return {conjugation_rules, verb_family, tense_mood}    
    }
}


// Get the rule sets that form the conjugation ancestry of this verb.
export function getAncestorRuleSets(infinitive: string, tense_mood: VerbTenseMood) : VerbAspectSuffixRules[] {
    let verb_family = getVerbFamily(infinitive)
    let conjugation_rules = regular_verb_suffixes[verb_family].aspects[tense_mood]
    const rule_sets: VerbAspectSuffixRules[] = [conjugation_rules]
    while (conjugation_rules.base) {
        const base_rules = getParentVerb(conjugation_rules, verb_family, tense_mood)
        ;({conjugation_rules, verb_family, tense_mood} = base_rules)
        rule_sets.unshift(conjugation_rules)
    }
    if (["CmdPos","CmdNeg"].includes(tense_mood)) {
        const last_rule_set = rule_sets[rule_sets.length - 1]
        last_rule_set.suffixes.s1 = null
    }
    return rule_sets
}


export function doAddSuffixToInfinitive(infinitive: string, tense_mood: VerbTenseMood) {
    const rule_sets = getAncestorRuleSets(infinitive, tense_mood)
    return rule_sets[0].add_suffix_to_infinitive
}


// Get the suffixes for the given verb family, mood, and tense, applying a suffix change if one is given. 
// @return The set of suffixes for all of the conjugated forms.
// For example: getSuffixes("creer", "IndPret", "eer")
//    {s1:"í", s2:"íste", s3:"yó", p1:"ímos", p2:"ísteis", p3:"yeron"}
export function getRegularSuffixes(infinitive: string, tense_mood: VerbTenseMood /* , suffix_change_type?: SuffixChangeType */) : VerbConjugationChanges {
    // let spelling_change_rules: VerbAspectSuffixRules["spelling"]
    const rule_sets = getAncestorRuleSets(infinitive, tense_mood)
    let suffixes: VerbConjugation = {...rule_sets[0].suffixes}
    rule_sets.slice(1).forEach((rule_set) => {
        if (rule_set.suffixes) {
            const conjugation_keys = Object.keys(rule_set.suffixes)
            conjugation_keys.forEach((conjugation_key: keyof VerbConjugation) => {
                if (suffixes[conjugation_key] == null) {
                    // do not update a form that has been set to null, as that indicates an invalid form
                } if (rule_set.suffixes[conjugation_key] == null) {
                    suffixes[conjugation_key] = null
                } else if (suffixes[conjugation_key] == null) {
                    suffixes[conjugation_key] = <any> rule_set.suffixes[conjugation_key]
                } else if (typeof suffixes[conjugation_key] === "string") {
                    if (typeof rule_set.suffixes[conjugation_key] === "string") {
                        suffixes[conjugation_key] = <string> rule_set.suffixes[conjugation_key]
                    } else {
                        throw new Error(`mixed types string != ? for suffixes[conjugation_key]=${suffixes[conjugation_key]} and rule_set.suffixes[conjugation_key]=${rule_set.suffixes[conjugation_key]}`)
                    }
                } else if (Array.isArray(suffixes[conjugation_key])) {
                    if (Array.isArray(rule_set.suffixes[conjugation_key])) {
                        suffixes[conjugation_key] = <any> rule_set.suffixes[conjugation_key]
                    } else {
                        throw new Error(`mixed types Array != ? for suffixes[conjugation_key]=${suffixes[conjugation_key]} and rule_set.suffixes[conjugation_key]=${rule_set.suffixes[conjugation_key]}`)
                    }
                } else {
                    throw new Error(`mixed types ? != ? for suffixes[conjugation_key]=${suffixes[conjugation_key]} and rule_set.suffixes[conjugation_key]=${rule_set.suffixes[conjugation_key]}`)
                }
            })
        }
    })
    return suffixes
}

