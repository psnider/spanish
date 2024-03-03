import { VerbConjugation, VerbConjugationChanges, VerbConjugationRules, VerbFormConjugationRules, VerbTenseMood } from ".";


type VerbFamily = "ar" | "er" | "ir"
const verb_families = ["ar", "er", "ir"]



// The suffixes used by all standard verb conjugations.
// That is, those that are not irregular.
// Note that even irregular verbs often use these suffixes for most forms.
export const regular_verb_suffixes: {[ending: string]: VerbConjugationRules} = {
    ar: {    // ar: like "amar"
        PresInd:  {suffixes: {"1s": "o", "2s": "as", "3s": "a", "1p": "amos", "2p": "áis", "3p": "an"}},
        PresSub:  {suffixes: {"1s": "e", "2s": "es", "3s": "e",  "1p": "emos", "2p": "éis", "3p": "en"}},
        PastInd:  {suffixes: {"1s": "é", "2s": "aste", "3s": "ó",  "1p": "amos", "2p": "asteis", "3p": "aron"}},
        PastImpInd:  {suffixes: {"1s": "ba", "2s": "bas", "3s": "ba",  "1p": "ábamos", "2p": "abais", "3p": "aban"}},
        PastCond: {add_suffix_to_infinitive: true, suffixes: {"1s": "ía", "2s": "ías", "3s": "ía", "1p": "íamos", "2p": "íais", "3p": "ían"}},
        FutInd:   {add_suffix_to_infinitive: true, suffixes: {"1s": "é", "2s": "ás", "3s": "á", "1p": "emos", "2p": "éis", "3p": "án"}},
        CmdPos:   {suffixes: {"1s": null, "2s": "a", "3s": "e",  "1p": "emos", "2p": "ad", "3p": "en"}},
        CmdNeg:   {base: "PresSub", suffixes: {"1s": null}},
    },
    er: {   // er: like "temer"
        PresInd: {suffixes: {"1s": "o", "2s": "es", "3s": "e", "1p": "emos", "2p": "éis", "3p": "en"}},
        PresSub: {suffixes: {"1s": "a", "2s": "as", "3s": "a",  "1p": "amos", "2p": "áis", "3p": "an"}},
        PastInd: {suffixes: {"1s": "í", "2s": "iste", "3s": "ió", "1p": "imos", "2p": "isteis", "3p": "ieron"}},
                //   spelling: {
                //     pattern: /eer$/,
                //     suffixes: { "1s": "í", "2s": "íste", "3s": "yó", "1p": "ímos", "2p": "ísteis", "3p": "yeron"}
                //  }},
        PastImpInd:  {suffixes: {"1s": "ía", "2s": "ías", "3s": "ía",  "1p": "íamos", "2p": "íais", "3p": "ían"}},
        PastCond:  {base: "ar"},
        FutInd:  {base: "ar"},
        CmdPos:  {suffixes: {"1s": null, "2s": "e", "3s": "a",  "1p": "amos", "2p": "ed", "3p": "an"}},
        CmdNeg:  {base: "PresSub", suffixes: {"1s": null}},
    },
    ir: {    // ir: like "partir"
        PresInd: {base: "er", suffixes: {"1p": "imos", "2p": "ís"}},
        PresSub: {base: "er"},
        PastInd: {base: "er"},
        PastImpInd: {base: "er"},
        PastCond:  {base: "ar"},
        FutInd:  {base: "ar"},
        CmdPos:  {base: "er", suffixes: {"2p": "id"}},
        CmdNeg:  {base: "er"},
    }
}


export function getVerbFamily(infinitive: string) {
    let verb_family = infinitive.slice(-2)
    if (verb_family === "ír") {
        verb_family = "ir"
    }
    return <VerbFamily> verb_family
}


function getBase(conjugation_rules: VerbFormConjugationRules, verb_family: VerbFamily, tense_mood: VerbTenseMood) {
    const base_is_verb_family = verb_families.includes(conjugation_rules.base)
    if (base_is_verb_family) {
        // different verb family, same tense_mood
        verb_family = <VerbFamily> conjugation_rules.base
        conjugation_rules = regular_verb_suffixes[verb_family][<keyof VerbConjugationRules> tense_mood]
        return {conjugation_rules, verb_family, tense_mood}    
    } else {  // base is tense_mood
        // same verb family, different tense_mood
        tense_mood = <VerbTenseMood> conjugation_rules.base
        conjugation_rules = regular_verb_suffixes[verb_family][tense_mood]
        return {conjugation_rules, verb_family, tense_mood}    
    }

}

function getRuleSets(infinitive: string, tense_mood: VerbTenseMood) : VerbFormConjugationRules[] {
    let verb_family = getVerbFamily(infinitive)
    let conjugation_rules = regular_verb_suffixes[verb_family][<keyof VerbConjugationRules> tense_mood]
    const rule_sets: VerbFormConjugationRules[] = [conjugation_rules]
    while (conjugation_rules.base) {
        const base_rules = getBase(conjugation_rules, verb_family, tense_mood)
        ;({conjugation_rules, verb_family, tense_mood} = base_rules)
        rule_sets.unshift(conjugation_rules)
    }
    return rule_sets
}


export function doAddSuffixToInfinitive(infinitive: string, tense_mood: VerbTenseMood) {
    const verb_family = getVerbFamily(infinitive)
    const conjugation_rules = regular_verb_suffixes[verb_family][<keyof VerbConjugationRules> tense_mood]
    const rule_sets = getRuleSets(infinitive, tense_mood)
    return rule_sets[0].add_suffix_to_infinitive
}



// Get the suffixes for the given verb family, mood, and tense, applying a suffix change if one is given. 
// @return The set of suffixes for all of the conjugated forms.
// For example: getSuffixes("creer", "PastInd", "eer")
//    {"1s":"í", "2s":"íste", "3s":"yó", "1p":"ímos", "2p":"ísteis", "3p":"yeron"}
export function getRegularSuffixes(infinitive: string, tense_mood: VerbTenseMood /* , suffix_change_type?: SuffixChangeType */) : VerbConjugationChanges {
    // let spelling_change_rules: VerbFormConjugationRules["spelling"]
    const rule_sets = getRuleSets(infinitive, tense_mood)
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
    //     // make a local copy (to prevent polluting the source data)
    //     if (base_conjugation_rules.spelling) {
    //         spelling_change_rules = {...base_conjugation_rules.spelling}
    //     }
    // } else {
    //     suffixes = {...conjugation_rules.suffixes}
    //     if (conjugation_rules.spelling) {
    //         spelling_change_rules = {...conjugation_rules.spelling}
    //     }
    // }
    // if (spelling_change_rules) {
    //     if (infinitive.match(spelling_change_rules.pattern)) {
    //         suffixes = {...suffixes, ...spelling_change_rules.suffixes}
    //     }
    // }
    // return suffixes
}

