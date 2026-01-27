import { ConjugationRules, VerbConjugation, VerbConjugationAnnotated, VerbConjugationRules, VerbTenseMood } from ".";
import { getChangedAccents } from "./accent_changes.js";
import { getAnnotations, verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { applyIrregularConjugationRules, irregular_conjugations, VerbAspectConjugations } from "./irregular-conjugations.js";
import { conjugation_keys } from "./lib.js";
import { getRegularSuffixes, doAddSuffixToInfinitive, getVerbFamily } from "./regular-verb-rules.js";
import { getStemChanges } from "./stem-change-patterns.js";
import { getTypographicChanges } from "./typographical-rules.js";
import { findPrefixOfIrregularVerb } from "./find-prefix-of-irregular-verb.js";


export function combineRegularSuffixesAndStemChanges(infinitive: string, tense_mood: VerbTenseMood) : VerbConjugation {
    const regular_suffixes = getRegularSuffixes(infinitive, tense_mood)
    const add_suffix_to_infinitive = doAddSuffixToInfinitive(infinitive, tense_mood)
    const stem_changes = getStemChanges({infinitive, tense_mood})
    const verb_root = infinitive.slice(0, -2)
    let conjugation: VerbConjugation = {}
    conjugation_keys.forEach((key) => {
        const suffix = regular_suffixes[key]
        if (suffix != null) {
            if (typeof suffix !== "string") {
                throw new Error(`unexpected non-string suffix=${suffix} for infinitive=${infinitive}, tense_mood=${tense_mood}`)
            }    
            if (add_suffix_to_infinitive) {
                conjugation[key] = infinitive + suffix
            } else {
                const stem_change = stem_changes[key]
                if ((stem_change === undefined) || (typeof stem_change === "string")) {
                    conjugation[key] = (stem_change || verb_root) + suffix
                } else {
                    throw new Error(`unexpected non-string stem_change=${stem_change} for infinitive=${infinitive}, tense_mood=${tense_mood}`)
                }    
            }
        }
    })
    return conjugation
}


function getDerivedSpelling(infinitive: string, base_infinitive: string, tense_mood: VerbTenseMood, base_conjugation: VerbConjugation) : VerbConjugation {
    let base_infinitive_rules = verb_conjugation_rules[base_infinitive]
    const {conjugation_family, irregular} = base_infinitive_rules
    if (!base_infinitive_rules.conjugation_family) {
        throw new Error(`infinitive=${infinitive} with irregular base must have a conjugation_family`)
    }
    const conjugation_family_length = conjugation_family.length
    const base_prefix = irregular.base.slice(0, -conjugation_family_length)
    const infinitive_prefix = infinitive.slice(0, -conjugation_family_length)
    if (!infinitive_prefix) {
        throw new Error(`a derived infinitive=${infinitive} must add back to the irregular base=${irregular.base}`)
    }
    const derived_spelling: VerbConjugation = {}
    Object.keys(base_conjugation).forEach((conjugation_key: keyof VerbConjugation) => {
        const irregular_base_form = base_conjugation[conjugation_key]
        if (Array.isArray(irregular_base_form)) {
            throw new Error(`require single form for infinitive=${infinitive} tense_mood=${tense_mood} irregular_base_conjugated[${conjugation_key}]=${irregular_base_form}`)
        }
        let irregular_derived_conjugated: string = irregular_base_form
        if (base_prefix) {
            if (!irregular_derived_conjugated.startsWith(base_prefix)) {
                throw new Error (`irregular_base_form=${irregular_base_form} from infinitive=${infinitive} doesn't start with irregular_rules.irregular.remove=${base_prefix}"`)
            }
            irregular_derived_conjugated = irregular_base_form.slice(base_prefix.length)
        }
        irregular_derived_conjugated = infinitive_prefix + irregular_derived_conjugated
        derived_spelling[conjugation_key] = irregular_derived_conjugated
    })
    return derived_spelling
}


const conjugation_families: {[ending: string]: string} = {
    delinquir: "delinquir",    // prevents mismatch with "huir"
    tener: "tener",            // ChatGPT said that there are no modern "-tener" verbs that conjugate differently, but that the origin of the word could make a difference
    poner: "poner",            // ChatGPT said that all "-poner" verbs conjugate the same, that this is 100% reliable
    venir: "venir",            // ChatGPT said that all "-venir" verbs conjugate the same
    decir: "decir",            // ChatGPT said that all "-decir" verbs conjugate the same
    traer: "traer",            // ChatGPT said that all "-traer" verbs conjugate the same
    hacer: "hacer",            // ChatGPT said that all "-hacer" verbs conjugate the same
    oír: "oír",                // ChatGPT said that all "-oír" verbs conjugate the same
    eer: "leer",
    uir: "huir",
    // FIX: consider all of these
        //     -aer / -oer
        // -poner 
        // -decir 
        // -ducir
        // NO -acer
        // -acer / -ocer 
}



type ConjugationModel = "-ar" | "-er" | "-ir"
                      | "delinquir"
                      | "caber" | "caer" | "conducir" | "dar" | "decir" | "erguir" | "estar"
                      | "haber" | "hacer" | "huir" | "ir" | "jugar" | "leer" | "oír" | "poder" | "poner"
                      | "querer" | "saber" | "salir" | "seguir" | "ser"
                      | "tener"| "traer" | "vaciar" | "venir" | "ver"


interface ConjugationClass {
    infinitive: string
    model: ConjugationModel
    prefix?: string
    base: string
    rules?: ConjugationRules  // from verb_conjugation_rules[]: conjugation_family, irregular
    // FIX: only for debugging during development
    irregular_base?: string
    irregular_rules?: VerbConjugationRules<VerbAspectConjugations>  // from irregular_conjugations[]:
}


function detectMorphologicalModel(infinitive: string) {
    for (const conjugation_family in conjugation_families) {
        const conjugation_family_len = conjugation_family.length
        if ((infinitive.length >= conjugation_family_len) && infinitive.endsWith(conjugation_family)) {
            const model = <ConjugationModel> conjugation_families[conjugation_family]
            const prefix = infinitive.slice(0, -conjugation_family_len)
            const base = model
            return {model, prefix, base}
        }
    }
}


function getSpecialRules(base_infinitive: string) {
    // Is the infinitive regular or special (has derivation rules or is irregular)?
    const rules = verb_conjugation_rules[base_infinitive]
    const irregular_base = rules?.irregular?.base
    const irregular_rules = irregular_conjugations[base_infinitive] || (irregular_base && irregular_conjugations[irregular_base])
    return {rules, irregular_base, irregular_rules}
}


// Determine how to conjugate the given verb
function resolveConjugationClass(infinitive: string) : ConjugationClass {
    const verb_family = getVerbFamily(infinitive)
    if (!verb_family) {
        return undefined
    }
    let model: ConjugationModel = undefined
    let prefix = undefined
    let base = infinitive
    let {rules, irregular_base, irregular_rules} = getSpecialRules(infinitive)

    if (rules || irregular_rules) {
        // Is the verb composed of a prefix and a special base verb?
        const verb_components = findPrefixOfIrregularVerb(infinitive)
        if (verb_components.prefix) {
            prefix = verb_components.prefix
            base = verb_components.base
            model = <ConjugationModel> base
            ;({rules, irregular_base, irregular_rules} = getSpecialRules(base))
        } else {
            base = rules?.irregular?.base ?? base
            model = <ConjugationModel> base
        }
    } else {
        const family = detectMorphologicalModel(infinitive)
        if (family) {
            ;({model, prefix, base} = family)
            ;({rules, irregular_base, irregular_rules} = getSpecialRules(base))
        } else {
            model = <ConjugationModel> ("-" + verb_family)
        }
    }
    return {infinitive, model, prefix, base, rules, irregular_rules}
}


function conjugateBase(infinitive: string, tense_mood: VerbTenseMood): VerbConjugation {
    const regular = combineRegularSuffixesAndStemChanges(infinitive, tense_mood)
    const typography = getTypographicChanges(infinitive, regular)
    const regular_w_typography = {...regular, ...typography}
    const irregularities = applyIrregularConjugationRules(infinitive, tense_mood, regular_w_typography)
    const regular_w_typography_w_irregularities = { ...regular_w_typography, ...irregularities }
    const accents = getChangedAccents(infinitive, tense_mood, regular_w_typography_w_irregularities)
    const conjugated_forms = { ...regular_w_typography_w_irregularities, ...accents }
    return conjugated_forms
}


function applyDerivations(conjugation_class: ConjugationClass, tense_mood: VerbTenseMood, conjugated_forms: VerbConjugation) : VerbConjugation {
    const derived_spelling_changes = getDerivedSpelling(conjugation_class.infinitive, conjugation_class.base, tense_mood, conjugated_forms)
    const conjugated_forms_w_spelling = {...conjugated_forms, ...derived_spelling_changes}
    const infinitive_rules = verb_conjugation_rules[conjugation_class.infinitive]
    const accent_changes = infinitive_rules?.individual_accents?.[tense_mood]
    const conjugated_forms_w_spelling_w_accents = {...conjugated_forms_w_spelling, ...accent_changes}
    return  conjugated_forms_w_spelling_w_accents
}


export function conjugateVerb(infinitive: string, tense_mood: VerbTenseMood): VerbConjugationAnnotated {
    const conjugation_class = resolveConjugationClass(infinitive)
    if (!conjugation_class) {
        return undefined
    }
    const notes = getAnnotations(infinitive, tense_mood)
    let conjugated_forms = conjugateBase(conjugation_class.base, tense_mood)
    if (conjugation_class.base != infinitive) {
        // (prefijos, cambios gráficos, etc.)
        const derivations = applyDerivations(conjugation_class, tense_mood, conjugated_forms)
        const final_forms = { ...conjugated_forms, ...derivations }
        return {notes, forms: final_forms}
    } else {
        return {notes, forms: conjugated_forms}
    }
}
