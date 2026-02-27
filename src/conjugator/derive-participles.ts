import { Participios, ParticipleRulesApplied, VerbRulesApplied } from "."
import { applyOrthographicalChangesForParticiples } from "./ortografía.js"
import { regular_verb_suffixes } from "./regular-verb-rules.js"
import { ConjugationAndDerivationRules, resolveConjugationClass } from "./resolve-conjugation-class.js"
import { applyStemChangeToGerundStem, stem_change_patterns } from "./stem-changes.js"
import { InfinitiveClass } from "./verbos-con-cambios-morfológicas"


function applyInfinitivePrefix(form: string, conj_and_deriv_rules: ConjugationAndDerivationRules): string {
    const {infinitive, conjugable_infinitive, prefixes, morphological_rules} = conj_and_deriv_rules
    if (infinitive === conjugable_infinitive) {
        return form
    }
    let basePrefixLen = 0
    if (prefixes?.conjugation_family_prefix) {
        const clase = morphological_rules.clase_conjugacional
        basePrefixLen = conjugable_infinitive.length - (clase.length - 1)
    }
    const infinitivePrefixLen = infinitive.length - conjugable_infinitive.length + basePrefixLen
    const infinitivePrefix = infinitive.slice(0, infinitivePrefixLen)
    return infinitivePrefix + form.slice(basePrefixLen)
}


function getRegularParticiples(conj_and_deriv_rules: ConjugationAndDerivationRules, rules_applied: ParticipleRulesApplied[]): Participios {
    const {conjugable_infinitive, verb_family} = conj_and_deriv_rules
    const stem = conjugable_infinitive.slice(0, -2)
    const suffixes = regular_verb_suffixes[verb_family].participle_rules
    const gerundio_base = stem + suffixes.pres.suffix
    const participio_base = stem + suffixes.past.suffix
    const regular: Participios = {gerundio: gerundio_base, participio: participio_base}
    rules_applied.push({regular})
    if (conj_and_deriv_rules.prefixes) {
        const prefixed: Participios = {}
        const gerundio_prefixed = applyInfinitivePrefix(gerundio_base, conj_and_deriv_rules)
        if (gerundio_prefixed !== gerundio_base) {
            prefixed.gerundio = gerundio_prefixed
        }
        const participio_prefixed =  applyInfinitivePrefix(participio_base, conj_and_deriv_rules)
        if (participio_prefixed !== participio_base) {
            prefixed.participio = participio_prefixed
        }
        if (Object.keys(prefixed).length > 0) {
            rules_applied.push({prefixed})
        }
        return {...regular, ...prefixed}
    } else {
        return regular
    }
}


function getParticipiosExcepcionales(rules: ConjugationAndDerivationRules, rules_applied: ParticipleRulesApplied[]): Participios | undefined {
    const excepciones_léxicas = rules.morphological_rules?.excepciones_léxicas
    if (!excepciones_léxicas) return
    const {gerundio, participio} = excepciones_léxicas
    if (gerundio || participio) {
        rules_applied.push({excepciones_léxicas: {gerundio, participio}})
        const result: Participios = {}
        const prefixed: Participios = {}
        if (excepciones_léxicas.gerundio) {
            result.gerundio = applyInfinitivePrefix(excepciones_léxicas.gerundio, rules)
            if (result.gerundio !== excepciones_léxicas.gerundio) {
                prefixed.gerundio = result.gerundio
            }
        }
        if (excepciones_léxicas.participio) {
            result.participio = applyInfinitivePrefix(excepciones_léxicas.participio, rules)
            if (result.participio !== excepciones_léxicas.participio) {
                prefixed.participio = result.participio
            }
        }
        if (Object.keys(prefixed).length > 0) {
            rules_applied.push({prefixed})
        }
        return result
    }
}


function getOrthographicChangesForParticiples(rules: ConjugationAndDerivationRules, regulares: Participios, rules_applied: ParticipleRulesApplied[]): Participios | undefined {
    function splitGerund(form: string, verb_family: InfinitiveClass) {
        const len = verb_family === "-ar" ? 4 : 5
        return {
            gerund_stem: form.slice(0, -len),
            ending: form.slice(-len)
        }
    }
    const {infinitive, verb_family, morphological_rules} = rules
    const alternancia = morphological_rules?.alternancia_vocálica
    const {gerund_stem, ending} = splitGerund(regulares.gerundio, verb_family)
    const excepcion = morphological_rules?.excepciones_léxicas?.gerundio_tema_cambio_excepcional
    const gerundio_tema_cambio = excepcion ?? stem_change_patterns[alternancia!]?.gerund_rule
    const excepcional = !!excepcion
    const gerundio = gerundio_tema_cambio
            ? applyStemChangeToGerundStem({gerund_stem, verb_family, gerundio_tema_cambio,excepcional, rules_applied}) + ending
            : regulares.gerundio
    const do_correct_diéresis = infinitive.includes("ü")
    const orthographical_changes = applyOrthographicalChangesForParticiples({...regulares, gerundio}, ending, do_correct_diéresis, rules_applied)
    const result = {...regulares, gerundio, ...orthographical_changes}
    if (result.gerundio === regulares.gerundio) delete result.gerundio
    if (result.participio === regulares.participio) delete result.participio
    return result
}


function _deriveParticiples(rules: ConjugationAndDerivationRules): {participles: Participios, rules_applied: ParticipleRulesApplied[]} {
    const rules_applied: ParticipleRulesApplied[] = []
    const excepcionales = getParticipiosExcepcionales(rules, rules_applied)
    if (excepcionales?.gerundio && excepcionales?.participio) {
        return {participles: excepcionales, rules_applied}
    }
    const regulares = getRegularParticiples(rules, rules_applied)
    const ortográficos = getOrthographicChangesForParticiples(rules, regulares, rules_applied)
    const final_forms = {...regulares, ...ortográficos, ...excepcionales}
    return {participles: final_forms, rules_applied}
}


export function deriveParticiples(infinitive: string): {participles: Participios, rules_applied: ParticipleRulesApplied[]} {
    console.log(`deriveParticiples(${infinitive})`)
    const conj_and_deriv_rules = resolveConjugationClass(infinitive)
    if (!conj_and_deriv_rules) {
        return undefined
    }
    let {participles, rules_applied} = _deriveParticiples(conj_and_deriv_rules)
    return {participles, rules_applied}
}
