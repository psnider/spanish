import { ConjugationRules, GrammaticalPerson, VerbConjugation, VerbConjugationAnnotated, VerbConjugationRules, VerbForms, VerbTenseMood } from ".";
import { getChangedAccents } from "./accent_changes.js";
import { getAnnotations, verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { applyIrregularConjugationRules, DerivationRule, irregular_conjugations, VerbAspectConjugations } from "./irregular-conjugations.js";
import { conjugation_keys } from "./lib.js";
import { getRegularSuffixes, doAddSuffixToInfinitive, getVerbFamily, doUsePreteriteStem } from "./regular-verb-rules.js";
import { getStemChanges } from "./stem-change-patterns.js";
import { getTypographicChanges } from "./typographical-rules.js";
import { findPrefixOfIrregularVerb } from "./find-prefix-of-irregular-verb.js";


function getPreterite3PStem(infinitive: string) {
    const conjugated_forms = conjugateVerb(infinitive, "IndPret")
    // TODO: is this correct? assuming that there is only ONE form
    const ustedes_form = conjugated_forms.forms["p3"][0]
    const stem = ustedes_form.slice(0, -3)
    return stem
}


export function combineRegularSuffixesAndStemChanges(infinitive: string, tense_mood: VerbTenseMood) : VerbConjugation {
    const regular_suffixes = getRegularSuffixes(infinitive, tense_mood)
    const add_suffix_to_infinitive = doAddSuffixToInfinitive(infinitive, tense_mood)
    const add_suffix_to_preterite_3p_stem = doUsePreteriteStem(infinitive, tense_mood)
    const preterite_3p_stem = (add_suffix_to_preterite_3p_stem ? getPreterite3PStem(infinitive) : undefined)
    const stem_changes = getStemChanges({infinitive, tense_mood})
    const verb_root = infinitive.slice(0, -2)
    let conjugation: VerbConjugation = {}
    conjugation_keys.forEach((key) => {
        const suffixes = regular_suffixes[key]
        if (suffixes != null) {
            suffixes.forEach((suffix) => {
                if (add_suffix_to_infinitive) {
                    const conjugated = infinitive + suffix
                    conjugation[key] = conjugation[key] || <VerbForms><unknown> []
                    conjugation[key].push(conjugated)
                } else if (add_suffix_to_preterite_3p_stem) {
                    let conjugated = preterite_3p_stem + suffix
                    if (key === "p1") {
                        const index = preterite_3p_stem.length - 1
                        conjugated = moveStress(conjugated, {to: index})
                    }
                    conjugation[key] = conjugation[key] || <VerbForms><unknown> []
                    conjugation[key].push(conjugated)
                } else {
                    const stem_change = stem_changes[key]
                    const conjugated = (stem_change || verb_root) + suffix
                    conjugation[key] = conjugation[key] || <VerbForms><unknown> []
                    conjugation[key].push(conjugated)
                }
            })
        }
    })
    if (conjugation.vos) {
        if (conjugation.vos === conjugation.s2) {
            throw new Error(`The form for vos should not be populated if it matches that of s2: infinitive=${infinitive} infinitive=${infinitive}`)
        }
    }
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
        const irregular_base_forms = base_conjugation[conjugation_key]
        if (irregular_base_forms) {
            irregular_base_forms.forEach((irregular_base_form) => {
                let irregular_derived_conjugated: string = irregular_base_form
                if (base_prefix) {
                    if (!irregular_derived_conjugated.startsWith(base_prefix)) {
                        throw new Error (`irregular_base_form=${irregular_base_form} from infinitive=${infinitive} doesn't start with irregular_rules.irregular.remove=${base_prefix}"`)
                    }
                    irregular_derived_conjugated = irregular_base_form.slice(base_prefix.length)
                }
                irregular_derived_conjugated = infinitive_prefix + irregular_derived_conjugated
                derived_spelling[conjugation_key] = derived_spelling[conjugation_key] || <VerbForms><unknown> []
                derived_spelling[conjugation_key].push(irregular_derived_conjugated)
            })
        }
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


const unaccented_vowels_to_accented = {
  a: "á", e: "é", i: "í", o: "ó", u: "ú"
}
const accented_vowels_to_unaccented = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u"
};



function moveStress(word: string, move: {from?: number, to?: number}) {
    function removeAccent(c: string) {
        return accented_vowels_to_unaccented[<keyof typeof accented_vowels_to_unaccented> c] ?? c
    } 
    function addAccent(c: string) {
        return unaccented_vowels_to_accented[<keyof typeof unaccented_vowels_to_accented> c] ?? c
    } 
    const chars = [...word]
    if (move.from != null) {
        chars[move.from] = removeAccent(chars[move.from])
    }
    if (move.to != null) {
        chars[move.to] = addAccent(chars[move.to])
    }
    return chars.join("")
}


const stressed_regex = /[áéíóú]/
const unstressed_regex = /[aeiou][bcdfghjklmnpqrstvwxyz]?$/
function findIndexOfStress(verb_form: string) : number {
    const match = verb_form.match(stressed_regex)
    if (match) {
        return match.index
    } else {
        const match = verb_form.match(unstressed_regex)
        return match.index
    }
}


function placeStressInVerbForm(verb_form: string, stress_index: number) : string {
    const old_stress_index = findIndexOfStress(verb_form)
    const moved = moveStress(verb_form, {from: old_stress_index, to: stress_index})
    return moved
}


function preserveStressFromBase(conjugation_class: ConjugationClass, conjugation: VerbConjugation, tense_mood: VerbTenseMood, grammatical_person: GrammaticalPerson, base_forms_for_person: VerbForms) : VerbForms {
    const conjugated_forms = conjugation[grammatical_person]
    if (!conjugated_forms) {
        throw new Error(`A derivation rule exists for a conjugation that doesn't have a rule for that grammatical_person=${grammatical_person}: infinitive=${conjugation_class.infinitive}`)
    }
    if (base_forms_for_person) {
        if (base_forms_for_person.length != conjugated_forms.length) {
            throw new Error(`A derivation rule exists for a conjugation that doesn't have the same number of conjugated and base forms: grammatical_person=${grammatical_person}: infinitive=${conjugation_class.infinitive}`)
        }
        const moved_stress_forms = <VerbForms><unknown> []
        base_forms_for_person.forEach((base_form, i) => {
            const base_stress_index = findIndexOfStress(base_form)
            const conjugated_form = conjugated_forms[i]
            // adjust stress_index for length of prefix
            const stress_index = base_stress_index + (conjugated_form.length - base_form.length)
            const moved_stress = placeStressInVerbForm(conjugated_form, stress_index)
            moved_stress_forms.push(moved_stress)
        })
        return moved_stress_forms
    }
}


function applyIrregularDerivationsRule(conjugation_class: ConjugationClass, conjugation: VerbConjugation, tense_mood: VerbTenseMood, grammatical_person: GrammaticalPerson, base_form_for_person: VerbForms, irregular_derivation_rule: DerivationRule) {
    if ((<DerivationRule>irregular_derivation_rule).preserve_stress_from_base) {
        return preserveStressFromBase(conjugation_class, conjugation, tense_mood, grammatical_person, base_form_for_person)
    }
}


function applyIrregularDerivationsRules(conjugation_class: ConjugationClass, conjugation: VerbConjugation, tense_mood: VerbTenseMood, irregular_rules: VerbAspectConjugations) : VerbConjugation {
    const irregular_derivations: VerbConjugation = {}
    if (irregular_rules?.derivations) {
        for (const [grammatical_person, irregular_derivation_rule] of Object.entries(irregular_rules.derivations) as [GrammaticalPerson, DerivationRule][]) {
            const base_form_for_person = irregular_rules.forms[grammatical_person]
            const irregular_derivation = applyIrregularDerivationsRule(conjugation_class, conjugation, tense_mood, grammatical_person, base_form_for_person, irregular_derivation_rule)
            irregular_derivations[grammatical_person] = irregular_derivation
        }
    }
    return irregular_derivations
}


// FIX: use conjugation_class, don't recalculate
function applyDerivations(conjugation_class: ConjugationClass, tense_mood: VerbTenseMood, conjugated_forms: VerbConjugation) : VerbConjugation {
    const derived_spelling_changes = getDerivedSpelling(conjugation_class.infinitive, conjugation_class.base, tense_mood, conjugated_forms)
    const forms_w_spelling = {...conjugated_forms, ...derived_spelling_changes}
    const infinitive_rules = verb_conjugation_rules[conjugation_class.infinitive]
    const accent_changes = infinitive_rules?.individual_accents?.[tense_mood]
    const forms_w_spelling_w_accents = {...forms_w_spelling, ...accent_changes}
    const irregular_rules = conjugation_class.irregular_rules.aspects[tense_mood]
    const irregular_derivations = applyIrregularDerivationsRules(conjugation_class, forms_w_spelling_w_accents, tense_mood, irregular_rules) 
    const forms_w_spelling_w_accents_w_irregular = {...forms_w_spelling_w_accents, ...irregular_derivations}
    return  forms_w_spelling_w_accents_w_irregular
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
