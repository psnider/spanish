import { GrammaticalPerson, Participles, VerbConjugation, VerbConjugationAnnotated, VerbForms, VerbTenseMood } from ".";
import { correctDiéresis, getChangedAccents } from "./accent_changes.js";
import { getAnnotations, morphophonemic_verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { applyIrregularConjugationRules, DerivationRule, VerbAspectConjugations } from "./irregular-conjugations.js";
import { applyToVerbForms, conjugation_keys } from "./lib.js";
import { applyPrefixes } from "./prefixes.js";
import { getRegularSuffixes, doAddSuffixToInfinitive, doUsePreteriteP3Stem, doStressLastSylableOfP1Stem, regular_verb_suffixes } from "./regular-verb-rules.js";
import { ConjugationAndDerivationRules, resolveConjugationClass } from "./resolve-conjugation-class.js";
import { applyStemChangeToGerundStem, getStemChanges } from "./stem-changes.js";
import { getTypographicChanges } from "./typographical-rules.js";


function getPreterite3PStem(infinitive: string) {
    const conjugated_forms = conjugateVerb(infinitive, "IndPret")
    // TODO: is this correct? assuming that there is only ONE form
    const ustedes_form = conjugated_forms.forms["p3"][0]
    const stem = ustedes_form.slice(0, -3)
    return stem
}


export function combineRegularSuffixesAndStemChanges(conj_and_derviv_rules: ConjugationAndDerivationRules, tense_mood: VerbTenseMood) : VerbConjugation {
    const {conjugable_infinitive, verb_family} = conj_and_derviv_rules
    const regular_suffixes = getRegularSuffixes(conjugable_infinitive, tense_mood)
    const add_suffix_to_infinitive = doAddSuffixToInfinitive(conjugable_infinitive, tense_mood)
    const add_suffix_to_preterite_p3_stem = doUsePreteriteP3Stem(conjugable_infinitive, tense_mood)
    const stress_last_sylable_of_p1_stem = doStressLastSylableOfP1Stem(conjugable_infinitive, tense_mood)
    const preterite_p3_stem = (add_suffix_to_preterite_p3_stem ? getPreterite3PStem(conjugable_infinitive) : undefined)
    const stem_changes = getStemChanges({conjugable_infinitive, verb_family, tense_mood})
    const verb_root = conjugable_infinitive.slice(0, -2)
    let conjugation: VerbConjugation = {}
    conjugation_keys.forEach((key) => {
        const suffixes = regular_suffixes[key]
        if (suffixes != null) {
            suffixes.forEach((suffix) => {
                let conjugated: string
                if (add_suffix_to_infinitive) {
                    conjugated = conjugable_infinitive + suffix
                } else if (add_suffix_to_preterite_p3_stem) {
                    conjugated = preterite_p3_stem + suffix
                    if (stress_last_sylable_of_p1_stem && (key === "p1")) {
                        const index = preterite_p3_stem.length - 1
                        conjugated = moveStress(conjugated, {to: index})
                    }
                } else {
                    const stem_change = stem_changes[key]
                    let stem = (stem_change || verb_root)
                    if (stress_last_sylable_of_p1_stem && (key === "p1")) {
                        const index = stem.length - 1
                        conjugated = moveStress(conjugated, {to: index})
                    }
                    conjugated = stem + suffix
                }
                conjugation[key] = conjugation[key] || <VerbForms><unknown> []
                conjugation[key].push(conjugated)
            })
        }
    })
    if (conjugation.vos) {
        if (conjugation.vos === conjugation.s2) {
            throw new Error(`The form for vos should not be populated if it matches that of s2: conjugable_infinitive=${conjugable_infinitive} infinitive=${conj_and_derviv_rules.infinitive}`)
        }
    }
    return conjugation
}


// function getDerivedSpelling(conj_and_derviv_rules: ConjugationAndDerivationRules, tense_mood: VerbTenseMood, base_conjugation: VerbConjugation) : VerbConjugation {
// //     const {infinitive, conjugable_infinitive, morphophonemic_rules, irregular_rules} = conj_and_derviv_rules
// //     if (!irregular_rules.conjugation_family) {
// //         throw new Error(`infinitive=${infinitive} with irregular base must have a conjugation_family`)
// //     }
// //  const conjugation_family_length = irregular_rules.conjugation_family.length
// //     const base_prefix = conjugable_infinitive.slice(0, -conjugation_family_length)
// //     const infinitive_prefix = infinitive.slice(0, -conjugation_family_length)
// //     if (!infinitive_prefix) {
// //         throw new Error(`a derived infinitive=${infinitive} must add back to the irregular base=${conjugable_infinitive}`)
// //     }
//     const derived_spelling: VerbConjugation = {}
//     Object.keys(base_conjugation).forEach((grammatical_person: keyof VerbConjugation) => {
//         const base_forms = base_conjugation[grammatical_person]
//         if (base_forms) {
//             base_forms.forEach((base_form) => {
//                 let irregular_derived_conjugated: string = base_form
//                 if (base_prefix) {
//                     if (!irregular_derived_conjugated.startsWith(base_prefix)) {
//                         throw new Error (`irregular_base_form=${base_form} from infinitive=${infinitive} doesn't start with irregular_rules.irregular.remove=${base_prefix}"`)
//                     }
//                     irregular_derived_conjugated = base_form.slice(base_prefix.length)
//                 }
//                 irregular_derived_conjugated = infinitive_prefix + irregular_derived_conjugated
//                 derived_spelling[grammatical_person] = derived_spelling[grammatical_person] || <VerbForms><unknown> []
//                 derived_spelling[grammatical_person].push(irregular_derived_conjugated)
//             })
//         }
//     })
//     return derived_spelling
// }


function conjugateBase(conj_and_derviv_rules: ConjugationAndDerivationRules, tense_mood: VerbTenseMood): VerbConjugation {
    const {conjugable_infinitive} = conj_and_derviv_rules
    const regular = combineRegularSuffixesAndStemChanges(conj_and_derviv_rules, tense_mood)
    const typography = getTypographicChanges(conjugable_infinitive, regular)
    const regular_w_typography = {...regular, ...typography}
    const irregularities = applyIrregularConjugationRules(conjugable_infinitive, tense_mood, regular_w_typography)
    const regular_w_typography_w_irregularities = { ...regular_w_typography, ...irregularities }
    const accents = getChangedAccents(conjugable_infinitive, tense_mood, regular_w_typography_w_irregularities)
    const conjugated_forms = { ...regular_w_typography_w_irregularities, ...accents }
    return conjugated_forms
}


const unaccented_vowels_to_accented = {
  a: "á", e: "é", i: "í", o: "ó", u: "ú"
}
const accented_vowels_to_unaccented = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u"
};


function removeAccent(c: string) {
    return accented_vowels_to_unaccented[<keyof typeof accented_vowels_to_unaccented> c] ?? c
} 


function moveStress(word: string, move: {from?: number, to?: number}) {
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
// FIX: add remaining dipthongs
const unstressed_dipthong_regex = /(ei)[bcdfghjklmnpqrstvwxyz]?$/
function findIndexOfStress(verb_form: string) : number {
    let match = verb_form.match(stressed_regex)
    if (match) {
        return match.index
    } else {
        match = verb_form.match(unstressed_dipthong_regex)
        if (match) {
            return match.index
        } else {
            match = verb_form.match(unstressed_regex)
            if (match) {
                return match.index
            }
        }
    }
}


function placeStressInVerbForm(verb_form: string, stress_index: number) : string {
    const old_stress_index = findIndexOfStress(verb_form)
    const moved = moveStress(verb_form, {from: old_stress_index, to: stress_index})
    return moved
}


function preserveStressFromBase(conj_and_derviv_rules: ConjugationAndDerivationRules, conjugation: VerbConjugation, tense_mood: VerbTenseMood, grammatical_person: GrammaticalPerson, base_forms_for_person: VerbForms) : VerbForms {
    const conjugated_forms = conjugation[grammatical_person]
    if (!conjugated_forms) {
        throw new Error(`A derivation rule exists for a conjugation that doesn't have a rule for that grammatical_person=${grammatical_person}: infinitive=${conj_and_derviv_rules.infinitive}`)
    }
    if (base_forms_for_person) {
        if (base_forms_for_person.length != conjugated_forms.length) {
            throw new Error(`A derivation rule exists for a conjugation that doesn't have the same number of conjugated and base forms: grammatical_person=${grammatical_person}: infinitive=${conj_and_derviv_rules.infinitive}`)
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


function applyIrregularDerivationsRule(conj_and_derviv_rules: ConjugationAndDerivationRules, conjugation: VerbConjugation, tense_mood: VerbTenseMood, grammatical_person: GrammaticalPerson, base_form_for_person: VerbForms, irregular_derivation_rule: DerivationRule) {
    if ((<DerivationRule>irregular_derivation_rule).preserve_stress_from_base) {
        return preserveStressFromBase(conj_and_derviv_rules, conjugation, tense_mood, grammatical_person, base_form_for_person)
    }
}


function applyIrregularDerivationsRules(conj_and_derviv_rules: ConjugationAndDerivationRules, conjugation: VerbConjugation, conjugated_base_forms: VerbConjugation, tense_mood: VerbTenseMood, irregular_rules: VerbAspectConjugations) : VerbConjugation {
    const irregular_derivations: VerbConjugation = {}
    if (irregular_rules?.derivations) {
        for (const [grammatical_person, irregular_derivation_rule] of Object.entries(irregular_rules.derivations) as [GrammaticalPerson, DerivationRule][]) {
            const base_form_for_person = conjugated_base_forms[grammatical_person]
            const irregular_derivation = applyIrregularDerivationsRule(conj_and_derviv_rules, conjugation, tense_mood, grammatical_person, base_form_for_person, irregular_derivation_rule)
            irregular_derivations[grammatical_person] = irregular_derivation
        }
    }
    return irregular_derivations
}


function removeHiatusStressFromAfterDipthong(form: string) {
    const index = form.indexOf("gui")
    if (index !== -1) {
        const accented_ch = form[index + "gui".length] 
        const unaccented_ch = removeAccent(accented_ch)
        form = form.replace(`gui` + accented_ch, `gui` + unaccented_ch)
    }
    return form
}

function applyDerivations(conj_and_derviv_rules: ConjugationAndDerivationRules, tense_mood: VerbTenseMood, conjugated_base_forms: VerbConjugation) : VerbConjugation {
    // const derived_spelling_changes = getDerivedSpelling(conj_and_derviv_rules, tense_mood, conjugated_forms)
    // const forms_w_spelling = {...conjugated_forms, ...derived_spelling_changes}
    // FIX: correct naming here
    const forms_w_spelling = conjugated_base_forms
    // FIX: this should be conjugable_infinitive?
    const infinitive_rules = morphophonemic_verb_conjugation_rules[conj_and_derviv_rules.infinitive]
    const accent_changes = infinitive_rules?.individual_accents?.[tense_mood]
    const forms_w_spelling_w_accents = {...forms_w_spelling, ...accent_changes}
    let forms_ready_for_prefixing = forms_w_spelling_w_accents
    const irregular_rules = conj_and_derviv_rules.irregular_rules?.aspects[tense_mood]
    if (irregular_rules) {
        const irregular_derivations = applyIrregularDerivationsRules(conj_and_derviv_rules, forms_w_spelling_w_accents, conjugated_base_forms, tense_mood, irregular_rules) 
        const forms_w_spelling_w_accents_w_irregular = {...forms_w_spelling_w_accents, ...irregular_derivations}
        forms_ready_for_prefixing =  forms_w_spelling_w_accents_w_irregular
    }
    const prefixed_forms = applyPrefixes(conj_and_derviv_rules, forms_ready_for_prefixing) 
    const final_forms = {...forms_ready_for_prefixing, ...prefixed_forms}
    // FIX: this is hacked-up code
    // repair accents
    if (conj_and_derviv_rules.infinitive === "guiar") {
        // rule: remove hiatus that breaks the dipthong from vaciar forms
        if (["IndPres","IndPret","SubPres","CmdPos","CmdNeg"].includes(tense_mood)) {
            conjugation_keys.forEach((gramatical_person: keyof VerbConjugation) => {
                applyToVerbForms(final_forms, final_forms, gramatical_person, removeHiatusStressFromAfterDipthong)
            })
        }
    }
    return final_forms
}


export function conjugateVerb(infinitive: string, tense_mood: VerbTenseMood): VerbConjugationAnnotated {
    console.log(`conjugateVerb(${infinitive}, ${tense_mood})`)
    const conj_and_derviv_rules = resolveConjugationClass(infinitive)
    if (!conj_and_derviv_rules) {
        return undefined
    }
    const notes = getAnnotations(infinitive, tense_mood)
    let conjugated_base_forms = conjugateBase(conj_and_derviv_rules, tense_mood)
    if (conj_and_derviv_rules.conjugable_infinitive != infinitive) {
        // (prefijos, familia de conjugación, cambios gráficos, etc.)
        const derivations = applyDerivations(conj_and_derviv_rules, tense_mood, conjugated_base_forms)
        const final_forms = { ...conjugated_base_forms, ...derivations }
        return {notes, forms: final_forms}
    } else {
        return {notes, forms: conjugated_base_forms}
    }
}


function getParticiples(conj_and_derviv_rules: ConjugationAndDerivationRules) : Participles {
    const {verb_family, prefixes, infinitive, conjugable_infinitive, is_conjugation_family, morphophonemic_rules, irregular_rules} = conj_and_derviv_rules
    let pres: string
    let past: string
    if (irregular_rules) {
        const {conjugation_family, participle_rules} = irregular_rules
        pres = participle_rules.pres.full
        past = participle_rules.past.full
        if (conjugation_family && (infinitive != conjugable_infinitive)) {
            const ending_length = conjugation_family.length - (conj_and_derviv_rules.is_conjugation_family ? 1 : 0)
            const base_prefix = (conjugation_family ? conjugable_infinitive.slice(0, -ending_length) : "")
            const conjugation_family_prefix = conj_and_derviv_rules.conjugation_family_prefix || ""
            pres = conjugation_family_prefix + pres.slice(base_prefix.length)
            past = conjugation_family_prefix + past.slice(base_prefix.length)
        }
    } else {
        // verb is standard regular, but might have a stem change
        const conjugable_base = conjugable_infinitive || infinitive
        const stem = conjugable_base.slice(0, -2)
        let gerund_stem = stem
        const stem_change_rule_id = morphophonemic_rules?.stem_change_rule_id
        if (stem_change_rule_id) {
            gerund_stem = applyStemChangeToGerundStem({gerund_stem, verb_family, stem_change_rule_id})
        }
        const participle_rules = regular_verb_suffixes[verb_family].participle_rules
        pres = gerund_stem + participle_rules.pres.suffix
        past = stem + participle_rules.past.suffix
        pres = correctDiéresis(pres)
        past = correctDiéresis(past)
    }
    if ((infinitive !== conjugable_infinitive) && !is_conjugation_family) {
        const prefix_len = infinitive.length - conjugable_infinitive.length
        const prefix = infinitive.slice(0, prefix_len)
        pres = prefix + pres
        past = prefix + past
    } else if (prefixes) {
        const prefix = prefixes.join("")
        pres = prefix + pres
        past = prefix + past
    }
    return {pres, past}
}


export function deriveParticiples(infinitive: string): Participles {
    console.log(`deriveParticiples(${infinitive})`)
    const conj_and_derviv_rules = resolveConjugationClass(infinitive)
    if (!conj_and_derviv_rules) {
        return undefined
    }
    let participles = getParticiples(conj_and_derviv_rules)
    // if (conjugation_class.base != infinitive) {
    //     // (prefijos, cambios gráficos, etc.)
    //     const derivations = applyDerivations(conjugation_class, tense_mood, conjugated_forms)
    //     const final_forms = { ...conjugated_forms, ...derivations }
    //     return {notes, forms: final_forms}
    // } else {
    //     return {notes, forms: conjugated_forms}
    // }
    return participles
}

