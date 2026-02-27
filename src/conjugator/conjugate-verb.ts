// Orden global de ejecución (pipeline)
// 1. Supletivo
//   si excepciones_léxicas.supletivo === true
//   - usar paradigma supletivo
//   - salir
    // 2. Selección de dominio
    //   determinar: IndPret / futuro / etc.
    // NOTE: that tema-pretérito, tema-futuro, tema-presente-yo apply to different tense/moods
    // 3. tema-pretérito
    //   si dominio ∈ ["IndPret", "SubImp", "SubFut"]
    //   y existe tema_pretérito
    //   - usarlo
    // 4. tema-futuro
    //   si dominio ∈ ["IndFut", "IndCond"]
    //   y existe tema_futuro
    //   - usarlo
    // 5. tema-presente-yo
    //   si dominio ∈ ["IndPres", "SubPres", "CmdPos"]
    //   y persona = 1s
    //   y existe tema_presente_yo
    //   - usarlo
// 6. alternancia-vocálica
//   si dominio ∈ presente / subj. pres. / imperativo
//   y existe alternancia_vocálica
//   y no se usó tema_presente_yo
//   - aplicar alternancia
// 7. tema regular
//   si ningún módulo anterior aplicó
//   - usar tema regular del infinitivo
// 8. terminaciones
//   añadir terminaciones morfológicas
// 9. ortografía
//   hiato / y / c-qu / g-gu / z-c / acentos
// 10. excepciones léxicas finales
//   - imperativo_tú
//   - vos
//   - participio / gerundio

import { MoodTense, VerbRulesApplied, VerbConjugation, VerbConjugationAnnotated, VerbConjugationStems, VerbConjugationSuffixes, VerbForms } from "."
import { getTemaConAlternanciaVocálica } from "./alternancia-vocálica.js"
import { applyToVerbForms, setStem } from "./lib.js"
import { moveStress, removeStress } from "./move-stress.js"
import { applyPrefixes } from "./prefixes.js"
import { getAncestorRuleSets, getRegularSuffixes, VerbAspectRules } from "./regular-verb-rules.js"
import { ConjugationAndDerivationRules, resolveConjugationClass } from "./resolve-conjugation-class.js"
import { getTemaFuturo } from "./tema-futuro.js"
import { getSuffixesForPresenteYo, getTemaPresenteYo } from "./tema-presente-yo.js"
import { getSuffixesForStrongPretérito, getTemaPretérito } from "./tema-pretérito.js"
import { getOrthographicChanges } from "./ortografía.js"
import { getAnnotations } from "./verbos-con-cambios-morfológicas.js"
import { getStemChanges } from "./stem-changes.js"


function accumulateChangedForms(base: VerbConjugation, updates: VerbConjugation) : VerbConjugation {
    const accumulated: VerbConjugation = {...base}
    for (const key in updates) {
        const gramatical_person = <keyof VerbConjugation> key
        if (accumulated[gramatical_person] !== null) {
            accumulated[gramatical_person] = updates[gramatical_person]
        }
    }
    return accumulated
}


export function getPreterite3PStem(conj_and_deriv_rules: ConjugationAndDerivationRules, infinitive: string) {
    // Must force _conjugateVerb to only consider the conjugable_infinitive
    const conj_and_derviv_rules_conjugable_only = {...conj_and_deriv_rules, infinitive: conj_and_deriv_rules.conjugable_infinitive}
    delete conj_and_derviv_rules_conjugable_only.prefixes
    // FIX: this call is very confusing when debugging. Is there a clean way to get jus the single IndPret.p3 form?
    const {forms} = _conjugateVerb(conj_and_derviv_rules_conjugable_only, "IndPret")
    // TODO: is this correct? assuming that there is only ONE form
    const ustedes_form = forms["p3"][0]
    const stem = ustedes_form.slice(0, -3)
    return stem
}



function getTemaRegular(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, ancestor_rule_sets: VerbAspectRules[]) : VerbConjugationStems {
    const {conjugable_infinitive} = conj_and_deriv_rules
    const use_infinitive = ancestor_rule_sets[0].add_suffix_to_infinitive || ancestor_rule_sets[1]?.add_suffix_to_infinitive
    const add_suffix_to_preterite_p3_stem = ancestor_rule_sets[0].add_suffix_to_preterite_p3_stem || ancestor_rule_sets[1]?.add_suffix_to_preterite_p3_stem
    const stress_last_char_of_p1_stem = ancestor_rule_sets[0].stress_last_char_of_p1_stem || ancestor_rule_sets[1]?.stress_last_char_of_p1_stem
    const stress_last_char_of_s123p3_stem = ancestor_rule_sets[0].stress_last_char_of_s123p3_stem || ancestor_rule_sets[1]?.stress_last_char_of_s123p3_stem
    let stem;
    if (use_infinitive) {
        stem = removeStress(conjugable_infinitive)
    } else if (add_suffix_to_preterite_p3_stem) {
        stem = getPreterite3PStem(conj_and_deriv_rules, conjugable_infinitive)
    } else {
        stem = conj_and_deriv_rules.conjugable_infinitive.slice(0, -2)
    }
    const temas = setStem(stem)
    if (stress_last_char_of_p1_stem || stress_last_char_of_s123p3_stem) {
        const stem_w_stressed_last_char = moveStress(stem, {to: stem.length - 1})
        const gramatical_persons: (keyof typeof temas)[] = []
        if (stress_last_char_of_s123p3_stem) {
            gramatical_persons.push("s1", "s2", "s3", "p3")
        }
        if (stress_last_char_of_p1_stem) {
            gramatical_persons.push("p1")
        }
        for (const gramatical_person of gramatical_persons) {
            temas[gramatical_person] = [stem_w_stressed_last_char]            
        }
    }
    return temas
}


function stressLastSylableOfP1Stem(temas: VerbConjugationStems) {
    const p1_stem = temas.p1[0]
    const last_index = p1_stem.length - 1
    const restressed = moveStress(p1_stem, {to: last_index})
    temas.p1 = [restressed]
}


// get the stems of conjugable_infinitive
export function getStems(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, ancestor_rule_sets: VerbAspectRules[], suffixes: VerbConjugation, rules_applied: VerbRulesApplied[]) : VerbConjugationStems {
    const {infinitive, verb_family, conjugable_infinitive} = conj_and_deriv_rules
    const tema_pretérito = conj_and_deriv_rules.morphological_rules?.tema_pretérito
    let temas: VerbConjugationStems
    // find the stems without prefixes
    switch (mood_tense) {
    case "IndPret":
        temas = getTemaPretérito(conj_and_deriv_rules, mood_tense)
        break;
    case "SubImp":
    case "SubFut":
        {
            // add_suffix_to_preterite_p3_stem
            const tema_pretérito_p3 = getPreterite3PStem(conj_and_deriv_rules, conjugable_infinitive)
            temas = setStem(tema_pretérito_p3)
            // stress_last_char_of_p1_stem
            stressLastSylableOfP1Stem(temas)
        }
        break;
    case "IndFut":
    case "IndCond":
        temas = getTemaFuturo(conj_and_deriv_rules, mood_tense)
        break;
    case "IndPres":
    case "SubPres":
    case "CmdPos":
    case "CmdNeg":
        {
            const do_use_alternancias = true    //!tema_pretérito
            const temas_alternancia = (do_use_alternancias ? getTemaConAlternanciaVocálica(conj_and_deriv_rules, mood_tense) : {})
            const temas_yo = getTemaPresenteYo(conj_and_deriv_rules, mood_tense)
            temas = accumulateChangedForms(temas_alternancia, temas_yo)
        }
        break;
    }
    const temas_regulares = getTemaRegular(conj_and_deriv_rules, mood_tense, ancestor_rule_sets)
    const temas_cambiados = getStemChanges({conjugable_infinitive, verb_family, mood_tense, suffixes})
    const regulares_con_temas_cambiados = accumulateChangedForms(temas_regulares, temas_cambiados)
    const stems = accumulateChangedForms(regulares_con_temas_cambiados, temas)
    rules_applied.push({stems})
    return stems
}


export function conjugateVerb(infinitive: string, mood_tense: MoodTense): VerbConjugationAnnotated {
    console.log(`conjugateVerb(${infinitive}, ${mood_tense})`)
    const conj_and_deriv_rules = resolveConjugationClass(infinitive)
    if (!conj_and_deriv_rules) {
        return undefined
    }
    const notes = getAnnotations(infinitive, conj_and_deriv_rules.modelo, mood_tense)
    const {forms, rules_applied} = _conjugateVerb(conj_and_deriv_rules, mood_tense)
    notes.rules_applied = rules_applied
    return { notes, forms }
}


// The regular_suffixes determine the forms. For example, if the suffix is missing for "s1", then that form is not produced.
// This also corrects stress accents according to standard Spanish stress rules.
export function appendSuffixesToStems(infinitive: string, stems: VerbConjugationStems, regular_suffixes: VerbConjugationSuffixes, rules_applied: VerbRulesApplied[]) {
    function combineStemWithSuffixes(stem: string, suffix_forms: VerbForms) {
        let original_form = stem + suffix_forms[0]
        const combined: VerbForms = [original_form]
        if (suffix_forms.length > 1) {
            original_form = stem + suffix_forms[1]
            combined.push(original_form)
        }
        return combined
    }
    let combined_stems_w_suffixes: VerbConjugation = {}
    const suffix_keys = <(keyof VerbConjugationSuffixes)[]> Object.keys(regular_suffixes)
    // if (stem_keys.length !== suffix_keys.length) {
    //     throw new Error(`infinitive=${infinitive} has stem_keys=${stem_keys} !== suffix_keys=${suffix_keys}`)
    // }
    for (const key of suffix_keys) {
        const gramatical_person = key as keyof typeof stems
        const stem_forms = stems[gramatical_person]
        const suffix_forms = regular_suffixes[gramatical_person]
        if (suffix_forms) {
            if (stem_forms && (stem_forms?.length !== 1)) {
                console.log(`expected stem_forms=${stem_forms} to have just one element`)
            }
            let stem = stem_forms?.[0]
            if (gramatical_person === "vos") {
                stem = stem || stems.s2[0]
            } 
            const combined = combineStemWithSuffixes(stem, suffix_forms)
            combined_stems_w_suffixes[gramatical_person] = combined
        }
    }
    rules_applied.push({combined_stems_w_suffixes})
    return combined_stems_w_suffixes
}


function getSuffixesForLexicalExceptions(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, forms_to_stress_last_char_of_stem?: (keyof VerbConjugation)[]) : VerbConjugationSuffixes {
    const exceptional_suffixes_for_mood_tense = {...conj_and_deriv_rules?.morphological_rules?.excepciones_léxicas?.reglas?.[mood_tense]?.suffixes}
    if (exceptional_suffixes_for_mood_tense && (forms_to_stress_last_char_of_stem?.length > 0)) {
        for (const gramatical_person of forms_to_stress_last_char_of_stem) {
            const exceptional_suffixes = exceptional_suffixes_for_mood_tense[gramatical_person]
            if (exceptional_suffixes) {
                const changed_forms = applyToVerbForms(exceptional_suffixes, (exceptional_suffix: string) => {
                    const unstressed = removeStress(exceptional_suffix)
                    return unstressed
                })
                exceptional_suffixes_for_mood_tense[gramatical_person] = changed_forms           
            }
        }
    }
    return exceptional_suffixes_for_mood_tense
}


function getPersonsTosStressLastCharOfStem(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense) : (keyof VerbConjugationStems)[] {
    const lexical_exceptions_for_suffixes_for_mood_tense = conj_and_deriv_rules?.morphological_rules?.excepciones_léxicas?.reglas?.[mood_tense]
    const stress_last_char_of_p1_stem = lexical_exceptions_for_suffixes_for_mood_tense?.stress_last_char_of_p1_stem
    const stress_last_char_of_s123p3_stem = lexical_exceptions_for_suffixes_for_mood_tense?.stress_last_char_of_s123p3_stem
    if (stress_last_char_of_p1_stem || stress_last_char_of_s123p3_stem) {
        const forms_to_stress_last_char_of_stem: (keyof VerbConjugationStems)[] = []
        if (stress_last_char_of_s123p3_stem) {
            forms_to_stress_last_char_of_stem.push("s1", "s2", "s3", "p3")
        }
        if (stress_last_char_of_p1_stem) {
            forms_to_stress_last_char_of_stem.push("p1")
        }
        return forms_to_stress_last_char_of_stem
    }
}


function getStemsForLexicalExceptions(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, stems: VerbConjugationStems, forms_to_stress_last_char_of_stem?: (keyof VerbConjugation)[]) : VerbConjugationStems {
    let exceptional_stems : VerbConjugationStems = {}
    const lexical_exceptions_for_suffixes_for_mood_tense = conj_and_deriv_rules?.morphological_rules?.excepciones_léxicas?.reglas?.[mood_tense]
    if (lexical_exceptions_for_suffixes_for_mood_tense?.tema) {
        exceptional_stems = setStem(lexical_exceptions_for_suffixes_for_mood_tense.tema)
    } else {
        const add_suffix_to_preterite_p3_stem = lexical_exceptions_for_suffixes_for_mood_tense?.add_suffix_to_preterite_p3_stem
        if (add_suffix_to_preterite_p3_stem) {
            // FIX: move this computation to resolveConjugationClass()
            const stem = getPreterite3PStem(conj_and_deriv_rules, conj_and_deriv_rules.conjugable_infinitive)
            exceptional_stems = setStem(stem)
        }
        if (forms_to_stress_last_char_of_stem?.length > 0) {
            for (const gramatical_person of forms_to_stress_last_char_of_stem) {
                const changed_forms = applyToVerbForms(stems[gramatical_person], (stem: string) => {
                    const stem_w_stressed_last_char = moveStress(stem, {to: stem.length - 1})
                    return stem_w_stressed_last_char
                })
                exceptional_stems[gramatical_person] = changed_forms           
            }
        }
    }
    return exceptional_stems
}


function getSuffixes(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, ancestor_rule_sets: VerbAspectRules[], rules_applied: VerbRulesApplied[]) {
    const regular_suffixes = getRegularSuffixes(conj_and_deriv_rules.conjugable_infinitive, mood_tense, ancestor_rule_sets)
    const strong_pretérito_suffixes = getSuffixesForStrongPretérito(conj_and_deriv_rules, mood_tense)
    const presente_yo_suffixes = getSuffixesForPresenteYo(conj_and_deriv_rules, mood_tense)
    const regular_w_pretérito = accumulateChangedForms(regular_suffixes, strong_pretérito_suffixes)
    const suffixes = accumulateChangedForms(regular_w_pretérito, presente_yo_suffixes)
    rules_applied.push({suffixes})
    return suffixes
}


function applyLexicalExceptions(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, stems: VerbConjugation, suffixes: VerbConjugation, rules_and_prefixes: VerbRulesApplied[]) : void {
    const rules_applied : VerbRulesApplied[] = []
    const forms_to_stress_last_char_of_stem = getPersonsTosStressLastCharOfStem(conj_and_deriv_rules, mood_tense)
    const lexical_exceptions_stems = getStemsForLexicalExceptions(conj_and_deriv_rules, mood_tense, stems, forms_to_stress_last_char_of_stem)
    for (const key in lexical_exceptions_stems) {
        const grammatical_person = <keyof typeof stems> key
        stems[grammatical_person] = lexical_exceptions_stems[grammatical_person]
    }
    if (Object.keys(lexical_exceptions_stems).length > 0) {
        rules_applied.push({lexical_exceptions_stems})
    }
    const lexical_exceptions_suffixes = getSuffixesForLexicalExceptions(conj_and_deriv_rules, mood_tense, forms_to_stress_last_char_of_stem)
    for (const key in lexical_exceptions_suffixes) {
        const grammatical_person = <keyof typeof lexical_exceptions_suffixes> key
        suffixes[grammatical_person] = lexical_exceptions_suffixes[grammatical_person]
    }
    if (Object.keys(lexical_exceptions_stems).length > 0) {
        rules_applied.push({lexical_exceptions_suffixes})
    }
}


function getLexicalSuplications(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, rules_applied: VerbRulesApplied[]) : VerbConjugation{
    const suplicaciones : VerbConjugation = {}
    const lexical_suplications = conj_and_deriv_rules?.morphological_rules?.excepciones_léxicas?.reglas?.[mood_tense]?.forms
    if (lexical_suplications) {
        for (const key in lexical_suplications) {
            const grammatical_person = <keyof VerbConjugation> key
            suplicaciones[grammatical_person] = lexical_suplications[grammatical_person]
        }
    }
    if (Object.keys(suplicaciones).length > 0) {
        rules_applied.push({suplicaciones})
    }
    return suplicaciones
}


function applyImperativoTú(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, formas_finales_sin_prefijos: VerbConjugation, rules_applied: VerbRulesApplied[]) : void {
    const {morphological_rules} = conj_and_deriv_rules
    let imperativo_tú = morphological_rules?.excepciones_léxicas?.imperativo_tú
    if (imperativo_tú && (mood_tense === "CmdPos")) {
        formas_finales_sin_prefijos.s2 = (Array.isArray(imperativo_tú) ? imperativo_tú : [imperativo_tú])
        rules_applied.push({imperativo_tú: {s2: formas_finales_sin_prefijos.s2}})
    }
}


// sylable with a single vowel/dipthong 
// "vio" -> "vió"
const accentable_single_vowel_sylable_regex = /^[^aeiou]+(a|e|i|o|u|ei)[ns]?$/
const accentable_two_vowel_sylable_regex = /^[^aeiou]+i(o)[ns]?$/


function maintainStressOnLastSylable(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense, formas_finales_sin_prefijos: VerbConjugation, rules_applied: VerbRulesApplied[]) {
    const derivations_preserve_stress = conj_and_deriv_rules?.morphological_rules?.excepciones_léxicas?.reglas?.[mood_tense]?.derivations?.preserve_stress_from_base
    if (derivations_preserve_stress) {
        const maintain_stressed_last_sylable: VerbConjugation = {}
        for (const grammatical_person of derivations_preserve_stress) {
            const formas = formas_finales_sin_prefijos[grammatical_person]
            const stressed = applyToVerbForms(formas, (form) => {
                let match = form.match(accentable_single_vowel_sylable_regex)
                if (!match) {
                    match = form.match(accentable_two_vowel_sylable_regex)
                }
                if (match) {
                    const vowels_index = form.indexOf(match[1])
                    // FIX: linguist: how to determine where to place the accent
                    const accented = moveStress(form, {to: vowels_index})
                    if (accented !== form) {
                        return accented
                    }
                }
            })
            formas[0] = stressed[0] || formas[0]
            if (formas.length === 2) {
                formas[1] = stressed[1] || formas[1]
            }
            if (stressed[0] || stressed[1]) {
                maintain_stressed_last_sylable[grammatical_person] = stressed
            }
        }
        if (Object.keys(maintain_stressed_last_sylable).length > 1) {
            rules_applied.push({maintain_stressed_last_sylable})
        }
    }
}


interface ConjugationResult {
    forms: VerbConjugation, 
    rules_applied: VerbRulesApplied[]
}


export function _conjugateVerb(conj_and_deriv_rules: ConjugationAndDerivationRules, mood_tense: MoodTense): ConjugationResult {
    const {infinitive, conjugable_infinitive, morphological_rules} = conj_and_deriv_rules
    const rules_applied: VerbRulesApplied[] = []
    const ancestor_rule_sets = getAncestorRuleSets(infinitive, mood_tense, rules_applied)
    // resolve suffixes first, as they help determine the forms used by getStems()
    const suffixes = getSuffixes(conj_and_deriv_rules, mood_tense, ancestor_rule_sets, rules_applied)
    // find the stems, including ste
    const stems = getStems(conj_and_deriv_rules, mood_tense, ancestor_rule_sets, suffixes, rules_applied)
    applyLexicalExceptions(conj_and_deriv_rules, mood_tense, stems, suffixes, rules_applied) 
    // 8. añadir terminaciones morfológicas
    const combined_stems_w_suffixes = appendSuffixesToStems(infinitive, stems, suffixes, rules_applied)
    // 9. ortografía
    const orthography = getOrthographicChanges(conj_and_deriv_rules.infinitive, mood_tense, combined_stems_w_suffixes, suffixes, rules_applied)
    const forms_w_orthoography = accumulateChangedForms(combined_stems_w_suffixes, orthography)
    // 11. Supletivo
    const suplicaciones = getLexicalSuplications(conj_and_deriv_rules, mood_tense, rules_applied) 
    const formas_finales_sin_prefijos = accumulateChangedForms(forms_w_orthoography, suplicaciones)
    // 10. excepciones léxicas finales
    applyImperativoTú(conj_and_deriv_rules, mood_tense, formas_finales_sin_prefijos, rules_applied)
    if (conj_and_deriv_rules.prefixes) {
        maintainStressOnLastSylable(conj_and_deriv_rules, mood_tense, formas_finales_sin_prefijos, rules_applied)
    }
    // add any prefixes to the stems
    const prefixed = applyPrefixes(conj_and_deriv_rules, formas_finales_sin_prefijos, rules_applied)
    const formas_finales = accumulateChangedForms(formas_finales_sin_prefijos, prefixed)

    // only show the "vos" form if it differs from "tú"
    if (formas_finales?.vos === null) {
            delete formas_finales.vos
    } else if (formas_finales.s2[0] === formas_finales?.vos?.[0]) {
        if (formas_finales.s2[1] === formas_finales?.vos?.[1]) {
            delete formas_finales.vos
        }
    }
    return {forms: formas_finales, rules_applied}
}

