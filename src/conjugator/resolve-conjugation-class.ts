import { findProductiveVerbPrefix } from "./prefixes.js"
import { getInfinitiveClass } from "./regular-verb-rules.js"
import { ConjugationModel, InfinitiveClass, ReglasDeConjugaciónDeVerbo, verbos_con_cambios_morfológicas } from "./verbos-con-cambios-morfológicas.js"


interface Prefixes {
    conjugable_infinitive_prefix?: string
    conjugation_family_prefix?: string
    // Semantic prefixes (that produce new verbs).
    // This is informational only, and is a guess. 
    // These prefixes are found only though orthographic matches, which is not accurate.
    productive_prefixes?: string[]
}


// e.g.: descreer: {infinitive: "descreer", model: "leer", prefix: "des", conjugation_family_prefix: "cr", base_infinitive: "creer"}
export interface ConjugationAndDerivationRules {
    // The infinitive that this describes.
    infinitive: string
    // The infinitive that is left when any semantic prefixes have been removed.
    // Only specified if different from infinitive.
    // If the model is a conjugation family (it starts with a hyphen), then this is the infinitive that the conjugation family follows, e.g. "leer" for "-eer".
    conjugable_infinitive: string
    verb_family: InfinitiveClass
    model: ConjugationModel
    // true if this verb is part of a productive conjugation family, that is, it has an ending that classifies its conjugation, e.g. "-eer".
    is_conjugation_family?: boolean
    prefixes?: Prefixes
    morphological_rules?: ReglasDeConjugaciónDeVerbo  // from verbos_con_cambios_morfológicas[]
    // FIX: calculate IndPret,p3 stem here
}


// The minimum length of a verb that might have prefixes.
// Segun ChatGPT, hay solo un verbo de largo 2, "ir", que no puede tener prefijos.
// y solo hay estos de largo 3: dar, ser, ver, oír
const MIN_BASE_VERB_LENGTH = 3


const verbs_with_false_prefixes = new Set([
    "coser",
    "delinquir",
])


// This indicates the different components of a verb that are used to reconstruct it for conjugation.
// If the verb belongs to a conjugation_family, then: infinitive = prefix + conjugation_family_prefix + conjugation_family
// Otherwise: infinitive = prefix + base
export interface BaseWPrefix {
    // a semantic prefix
    prefixes?: string[]
    // If the infinitive belongs to a conjugation_family, then this is the part before the conjugation_family, but after the prefix.
    conjugation_family_prefix?: string
    // If the infinitive belongs to a conjugation_family,this is the conjugation_family.
    // Otherwise this is the base infinitive.
    base?: string
}



interface ConjugationFamilyMapping {
    model: ConjugationModel
    // NOTE: only one of base_infinitive and conjugation_family_infinitive may be set
    // The infinitive that remains after prefixes have been removed.
    // This is what is conjugated, prefixes will be reapplied afterwards.
    conjugable_infinitive?: string
    // // The infinitive that a conjugation family follows if the conjugation family itself is an incomplete ending of a verb.
    // conjugation_family_infinitive?: string
}


// longer keys must appear before shorter ones that match as a suffix.
const conjugation_families: {[conjugation_family: string]: ConjugationFamilyMapping} = {
    delinquir:  {model: "delinquir",  conjugable_infinitive: "delinquir"},  // prevents mismatch with "huir"
    erguir:     {model: "erguir",  conjugable_infinitive: "erguir"},        // prevents mismatch with "huir"
    seguir:     {model: "seguir",  conjugable_infinitive: "seguir"},        // prevents mismatch with "huir"
    caber:      {model: "caber",  conjugable_infinitive: "caber"},          // its own model
    caer:       {model: "caer",  conjugable_infinitive: "caer"},            // its own model
    estar:      {model: "estar",  conjugable_infinitive: "estar"},          // its own model
    haber:      {model: "haber",  conjugable_infinitive: "haber"},          // its own model
    jugar:      {model: "jugar",  conjugable_infinitive: "jugar"},          // its own model
    poder:      {model: "poder",  conjugable_infinitive: "poder"},          // its own model
    querer:     {model: "querer",  conjugable_infinitive: "querer"},        // its own model
    saber:      {model: "saber",  conjugable_infinitive: "saber"},          // its own model
    salir:      {model: "salir",  conjugable_infinitive: "salir"},          // its own model
    venir:      {model: "venir",  conjugable_infinitive: "venir"},          // ChatGPT said that all "-venir" verbs conjugate the same
    satisfacer: {model: "-acer",  conjugable_infinitive: "hacer"},          // prevents mismatch with "huir"
    tener:      {model: "tener",  conjugable_infinitive: "tener"},          // ChatGPT said that there are no modern "-tener" verbs that conjugate differently, but that the origin of the word could make a difference
    poner:      {model: "poner",  conjugable_infinitive: "poner"},          // ChatGPT said that all "-poner" verbs conjugate the same, that this is 100% reliable
    decir:      {model: "decir",  conjugable_infinitive: "decir"},          // ChatGPT said that all "-decir" verbs conjugate the same
    traer:      {model: "traer",  conjugable_infinitive: "traer"},          // ChatGPT said that all "-traer" verbs conjugate the same
    oír:        {model: "oír",    conjugable_infinitive: "oír"},            // ChatGPT said that all "-oír" verbs conjugate the same
    // NOTE: hacer verbs are a different family from -acer? e.g. "nacer"
    // FIX: change model from "-acer" to "hacer"
    hacer:      {model: "-acer",  conjugable_infinitive: "hacer"},          // ChatGPT said that all "-hacer" verbs conjugate the same
    ducir:      {model: "-ducir", conjugable_infinitive: "conducir"},       // ChatGPT said that all "-ducir" verbs conjugate like conducir
    eer:        {model: "-eer",   conjugable_infinitive: "leer"},           // ChatGPT said that all "-eer" verbs conjugate like leer
    uir:        {model: "-uir",   conjugable_infinitive: "huir"},           // ChatGPT said that all "-uir" verbs conjugate like huir
    // NOT valid conjugation families:
    // -iar NOT => vaciar, e.g.: cambiar, estudiar
    // FIX: linguistics: consider all of these
    //     -aer / -oer
    //     -ocer 
}


const unique_conjugations: {[conjugation_family: string]: ConjugationFamilyMapping} = {
    ir:         {model: "ir",   conjugable_infinitive: "ir"},                // its own model, and no prefixes exist
    dar:        {model: "dar",  conjugable_infinitive: "dar"},              // its own model
    ser:        {model: "ser",  conjugable_infinitive: "ser"},              // its own model
    ver:        {model: "ver",  conjugable_infinitive: "ver"},              // its own model
}



function detectConjugationFamilyByEnding(infinitive: string) {
    if (infinitive in unique_conjugations) {
        const model_w_base = conjugation_families[infinitive]
        return model_w_base
    } else {
        for (const conjugation_family in conjugation_families) {
            const conjugation_family_len = conjugation_family.length
            if (infinitive.endsWith(conjugation_family)) {
                const model_w_base = conjugation_families[conjugation_family]
                return model_w_base
            }
        }
    }
}


interface MorphophonemicRulesWithPrefixes extends ConjugationFamilyMapping{
    productive_prefixes?: string[]
    base: string
    morphological_rules?: ReglasDeConjugaciónDeVerbo
}


// Note that there is no way to know whether these are actual prefixes, especially the single char prefixes: "a", "o"
function findRulesAndProductiveVerbPrefixes(infinitive: string, model: ConjugationModel, is_conjugation_family: boolean) : MorphophonemicRulesWithPrefixes {
    let productive_prefixes: string[]
    let base = infinitive
    // NOTE: in case of a productive ending (has a hyphen), at least one more character is needed, so length is correct.
    const min_ending_length = (is_conjugation_family ? model.length : MIN_BASE_VERB_LENGTH)
    // stop as soon as a known verb is found, e.g. "acertar" is in morphophonemic_verb_conjugation_rules, but not "certar"
    let morphological_rules = verbos_con_cambios_morfológicas[infinitive]
    let do_look_for_prefix = !morphological_rules
    while (do_look_for_prefix && (base.length > min_ending_length)) {
        const prefix_found = findProductiveVerbPrefix(base, min_ending_length)
        if (prefix_found) {
            // FIX: probably need an alert if a new rule set is found...
            morphological_rules = verbos_con_cambios_morfológicas[prefix_found.remainder]
            productive_prefixes = productive_prefixes || []
            productive_prefixes.push(prefix_found.prefix)
            base = prefix_found.remainder
        }
        do_look_for_prefix = prefix_found && !morphological_rules
    }
    const model_w_base = unique_conjugations[base]
    return {productive_prefixes, base, morphological_rules, ...model_w_base}
}


interface DeterminecPrefixes {
    prefixes?: Prefixes
    morphological_rules?: ReglasDeConjugaciónDeVerbo
    conjugable_infinitive?: string
    model: ConjugationModel
}


function determinePrefixes(infinitive: string, conjugable_infinitive: string, model: ConjugationModel, is_conjugation_family: boolean) : DeterminecPrefixes {
    let conjugable_infinitive_prefix: string
    let conjugation_family_prefix: string
    let rules_and_prefixes = findRulesAndProductiveVerbPrefixes(infinitive, model, is_conjugation_family)
    conjugable_infinitive = rules_and_prefixes.conjugable_infinitive || conjugable_infinitive
    model = rules_and_prefixes.model || model
    const productive_prefixes = rules_and_prefixes.productive_prefixes
    const morphological_rules = rules_and_prefixes.morphological_rules
    let conjugable_infinitive_prefix_len : number
    if (is_conjugation_family) {
        const ending_len = (model.length - 1)
        if (productive_prefixes) {
            const prefix = productive_prefixes.join("")
            const remainder = infinitive.slice(prefix.length)
            if (remainder.length > ending_len) {
                conjugation_family_prefix = remainder.slice(0, -ending_len)
            } else {
                conjugation_family_prefix = productive_prefixes.pop()
            }
            conjugable_infinitive_prefix_len = infinitive.length - (conjugation_family_prefix.length + ending_len)
        } else {
            conjugation_family_prefix = infinitive.slice(0, -(model.length - 1))
        }
        const conjugable_infinitive_len = conjugation_family_prefix.length + ending_len
        conjugable_infinitive_prefix = infinitive.slice(0, -conjugable_infinitive_len)
    } else {
        if (rules_and_prefixes.base && (rules_and_prefixes.base.length < conjugable_infinitive.length)) {
            conjugable_infinitive = rules_and_prefixes.base
        }
        conjugable_infinitive_prefix = infinitive.slice(0, -conjugable_infinitive.length)
    }
    let prefixes : Prefixes
    if (productive_prefixes || conjugation_family_prefix || conjugable_infinitive_prefix) {
        prefixes = {}
        if (productive_prefixes) {
            prefixes.productive_prefixes = productive_prefixes
        }
        if (conjugation_family_prefix) {
            prefixes.conjugation_family_prefix = conjugation_family_prefix
        }
        if (conjugable_infinitive_prefix) {
            prefixes.conjugable_infinitive_prefix = conjugable_infinitive_prefix
        }
    } 
    return {prefixes, morphological_rules, conjugable_infinitive, model}
}

// ChatGPT says: Si ves un verbo que:
// - tiene prefijo claro (pre-, re-, con-, sub-, ante-, etc.)
// - termina como un verbo irregular fuerte
// 👉 Asume que se conjuga como el verbo base, hasta que alguien te demuestre lo contrario.
//    Funciona el 95 %+ del tiempo.
export function resolveConjugationClass(infinitive: string): ConjugationAndDerivationRules {
    // Separate any productive verb prefixes from this verb, and return the remainder as the base.
    // The base must be at least min_ending_length characters long as "ir" is the only shorter verb, and it cannot be previxed.
    // e.g. "prever" has a 3-char base infinitive.
    const verb_family = getInfinitiveClass(infinitive)
    if (!verb_family) {
        return undefined
    }
    let conjugable_infinitive = infinitive
    if (verbs_with_false_prefixes.has(infinitive)) {
        return {infinitive, conjugable_infinitive, verb_family, model: verb_family}
    }
    let model: ConjugationModel = verb_family
    let morphological_rules: ReglasDeConjugaciónDeVerbo
    let is_conjugation_family: boolean
    const model_w_base = detectConjugationFamilyByEnding(infinitive)
    if (model_w_base) {
        ;({model, conjugable_infinitive} = model_w_base)
        is_conjugation_family = (model[0] === "-")
        morphological_rules = verbos_con_cambios_morfológicas[conjugable_infinitive]
    }
    const prefixes_w_meta = determinePrefixes(infinitive, conjugable_infinitive, model, is_conjugation_family)
    const prefixes = prefixes_w_meta.prefixes
    model = prefixes_w_meta.model || model
    conjugable_infinitive = prefixes_w_meta.conjugable_infinitive || conjugable_infinitive
    if (morphological_rules !== prefixes_w_meta.morphological_rules) {
        if (!morphological_rules) {
            morphological_rules = prefixes_w_meta.morphological_rules
        }
    }
    return {infinitive, verb_family, model, is_conjugation_family, conjugable_infinitive, prefixes, morphological_rules}
}

