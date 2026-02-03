import { morphophonemic_verb_conjugation_rules } from "./conjugation-rules-per-verb.js"
import { ConjugationFamily, ConjugationModel, ConjugationRules, VerbConjugationRules, VerbFamily } from "./index"
import { irregular_conjugations, VerbAspectConjugations } from "./irregular-conjugations.js"
import { MIN_BASE_VERB_LENGTH } from "./lib.js"
import { getVerbFamily } from "./regular-verb-rules.js"


// e.g.: descreer: {infinitive: "descreer", model: "leer", prefix: "des", conjugation_family_prefix: "cr", base_infinitive: "creer"}
export interface ConjugationAndDerivationRules {
    // The infinitive that this describes.
    infinitive: string
    // The infinitive that is left when any semantic prefixes have been removed.
    // Only specified if different from infinitive.
    // If the model is a conjugation family (it starts with a hyphen), then this is the infinitive that the conjugation family follows, e.g. "leer" for "-eer".
    conjugable_infinitive: string
    verb_family: VerbFamily
    model: ConjugationModel
    // true if this verb is part of a productive conjugation family, that is, it has an ending that classifies its conjugation, e.g. "-eer".
    is_conjugation_family?: boolean
    // Semantic prefixes (that produce new verbs).
    prefixes?: string[]
    conjugation_family_prefix?: string
    morphophonemic_rules?: ConjugationRules  // from morphophonemic_verb_conjugation_rules[]: conjugation_family, irregular
    irregular_rules?: VerbConjugationRules<VerbAspectConjugations>  // from irregular_conjugations[]:
}

// Prefixes that precede irregular verbs.
// This isn't a list of all known prefixes.
// These are in order of: first letter, then longest first when there is a prefix match.
// Each entry has a comment giving one example that shows the use of the prefix.
const verb_prefixes = [
    "ante",     // anteponer
    "auto",     // autoregular, NO irregular
    "abs",      // abstener, abstraer
    "a",        // atener, atraer, avenir
    "ben",      // bendecir
    "contra",   // contradecir, contrahacer, contraponer
    "com",      // componer
    "con",      // contener, contraer, condecir, convenir
    "co",       // cooperar, NO irregular
    "desa",     // (des + a ) desavenir
    "des",      // desavenir, deshacer, desoír
    "de",       // detener, detraer
    "dis",      // distraer
    "entre",    // entreoír
    "en",
    "extra",
    "ex",       // extraer
    "hiper",
    "im",       // imponer
    "inter",    // interponer, intervenir
    "in",
    "mal",      // maldecir
    // mantener
    "micro",
    "mini",
    "mono",
    "multi",
    // oponer
    // obtener
    "post",
    "pos",     // posponer
    "pre",     // predecir, prevenir
    "pro",     // proponer, provenir
    "retro",
    "re",      // rehacer, reponer, retener, retraer
    "semi",
    "sobre",   // sobresalir, sobrevenir
    "sos",     // sostener
    // suponer
    "sub",
    "super",   // superponer
    // sustraer
    "trans",
    "ultra",
]


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
    // The infinitive that a conjugation family follows if the conjugation family itself is an incomplete ending of a verb.
    conjugation_family_infinitive?: string
}


// longer keys must appear before shorter ones that match as a suffix.
const conjugation_families: {[ending: string]: ConjugationFamilyMapping} = {
    delinquir: {model: "delinquir",  conjugable_infinitive: "delinquir"},  // prevents mismatch with "huir"
    erguir:    {model: "erguir",  conjugable_infinitive: "erguir"},        // prevents mismatch with "huir"
    seguir:    {model: "seguir",  conjugable_infinitive: "seguir"},        // prevents mismatch with "huir"
    tener:     {model: "tener",  conjugable_infinitive: "tener"},          // ChatGPT said that there are no modern "-tener" verbs that conjugate differently, but that the origin of the word could make a difference
    poner:     {model: "poner",  conjugable_infinitive: "poner"},          // ChatGPT said that all "-poner" verbs conjugate the same, that this is 100% reliable
    venir:     {model: "venir",  conjugable_infinitive: "venir"},          // ChatGPT said that all "-venir" verbs conjugate the same
    decir:     {model: "decir",  conjugable_infinitive: "decir"},          // ChatGPT said that all "-decir" verbs conjugate the same
    traer:     {model: "traer",  conjugable_infinitive: "traer"},          // ChatGPT said that all "-traer" verbs conjugate the same
    oír:       {model: "oír",    conjugable_infinitive: "oír"},            // ChatGPT said that all "-oír" verbs conjugate the same
    hacer:     {model: "-acer",  conjugable_infinitive: "hacer"},          // ChatGPT said that all "-hacer" verbs conjugate the same
    ducir:     {model: "-ducir", conjugable_infinitive: "conducir"},       // ChatGPT said that all "-ducir" verbs conjugate like conducir
    eer:       {model: "-eer",   conjugable_infinitive: "leer"},           // ChatGPT said that all "-eer" verbs conjugate like leer
    uir:       {model: "-uir",   conjugable_infinitive: "huir"},           // ChatGPT said that all "-uir" verbs conjugate like huir
    // NOT valid conjugation families:
    // -iar NOT => vaciar, e.g.: cambiar, estudiar
    // FIX: consider all of these
        //     -aer / -oer
        // -poner 
        // -decir 
        // -ducir
        // NO -acer
        // -acer / -ocer 
}


function detectMorphologicalModel(infinitive: string) {
    for (const conjugation_family in conjugation_families) {
        const conjugation_family_len = conjugation_family.length
        if ((infinitive.length >= conjugation_family_len) && infinitive.endsWith(conjugation_family)) {
            const model_w_base = conjugation_families[conjugation_family]
            return model_w_base
        }
    }
}

interface MormorphophonemicRules_w_Prefixes {
    prefixes?: string[]
    base: string
    morphophonemic_rules?: ConjugationRules
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
    function findProductiveVerbPrefix(verb_part: string, min_ending_length: number) : {prefix?: string, remainder: string} {
        for (const prefix of verb_prefixes) {
            if (verb_part.startsWith(prefix)) {
              const tail = verb_part.slice(prefix.length)
              if (tail.length >= min_ending_length) {
                  return {prefix, remainder: tail}
              }
            }
        }
    }
    function findProductiveVerbPrefixes(infinitive: string, model: ConjugationModel, is_conjugation_family: boolean) : MormorphophonemicRules_w_Prefixes {
        let prefixes: string[]
        let base = infinitive
        // NOTE: in case of a productive ending (has a hyphen), at least one more character is needed, so length is correct.
        const min_ending_length = (is_conjugation_family ? model.length : MIN_BASE_VERB_LENGTH)
        // stop as soon as a known verb is found, e.g. "acertar" is in morphophonemic_verb_conjugation_rules, but not "certar"
        let morphophonemic_rules = morphophonemic_verb_conjugation_rules[infinitive]
        let do_look_for_prefix = !morphophonemic_rules
        while (do_look_for_prefix && (base.length > min_ending_length)) {
            const prefix_found = findProductiveVerbPrefix(base, min_ending_length)
            if (prefix_found) {
                morphophonemic_rules = morphophonemic_verb_conjugation_rules[prefix_found.remainder]
                prefixes = prefixes || []
                prefixes.push(prefix_found.prefix)
                base = prefix_found.remainder
            }
            do_look_for_prefix = prefix_found && !morphophonemic_rules
        }
        return {prefixes, base, morphophonemic_rules}
    }
    const verb_family = getVerbFamily(infinitive)
    if (!verb_family) {
        return undefined
    }
    let conjugable_infinitive = infinitive
    if (verbs_with_false_prefixes.has(infinitive)) {
        return {infinitive, conjugable_infinitive, verb_family, model: verb_family}
    }
    let model: ConjugationModel = verb_family
    let prefixes: string[]
    let morphophonemic_rules: ConjugationRules
    let is_conjugation_family: boolean
    const model_w_base = detectMorphologicalModel(infinitive)
    if (model_w_base) {
        ;({model, conjugable_infinitive} = model_w_base)
        is_conjugation_family = (model[0] === "-")
        morphophonemic_rules = morphophonemic_verb_conjugation_rules[conjugable_infinitive]
    }
    let prefixes_found = findProductiveVerbPrefixes(infinitive, model, is_conjugation_family)
    prefixes = prefixes_found.prefixes
    let conjugation_family_prefix: string
    if (!is_conjugation_family) {
        conjugable_infinitive = prefixes_found.base
        morphophonemic_rules = prefixes_found.morphophonemic_rules
    } else {
        if (prefixes) {
            const prefix = prefixes.join("")
            const remainder = infinitive.slice(prefix.length)
            const ending_len = (model.length - 1)
            if (remainder.length > ending_len) {
                conjugation_family_prefix = remainder.slice(0, -ending_len)
            } else {
                conjugation_family_prefix = prefixes.pop()
            }
        } else {
            conjugation_family_prefix = infinitive.slice(0, -(model.length - 1))
        }
    }
    let irregular_rules = irregular_conjugations[morphophonemic_rules?.irregular?.base]
    if (irregular_rules) {
        model = irregular_rules.conjugation_family || <ConjugationModel>  morphophonemic_rules?.irregular?.base
        if (!is_conjugation_family) {
            is_conjugation_family = (model[0] === "-")
            if (is_conjugation_family) {
                conjugation_family_prefix = infinitive.slice(0, -(model.length - 1))
            }
        }
        conjugable_infinitive = morphophonemic_rules?.irregular?.base
    }
    return {infinitive, verb_family, model, is_conjugation_family, conjugable_infinitive, prefixes, conjugation_family_prefix, morphophonemic_rules, irregular_rules}
}

