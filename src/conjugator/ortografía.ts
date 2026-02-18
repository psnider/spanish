import { Participles, TenseMood, VerbConjugation, VerbConjugationSuffixes } from ".";
import { applyToVerbForms } from "./lib.js";

// ============================================================
// REGLAS ORTOGRÁFICAS DE PRESERVACIÓN EN LA CONJUGACIÓN ESPAÑOLA
// Estas reglas NO son irregularidades.
// Son transformaciones productivas que preservan sonido o acento.
// Deben aplicarse después de formar el tema y antes de añadir tilde final.
// ============================================================


// ============================================================
// 1. PRESERVAR SONIDO CONSONÁNTICO FINAL DE LA RAÍZ
// Evitan que c/g/z cambien de sonido ante e o i.
// ============================================================

// c → qu
// preservar sonido /k/
// ejemplo: buscar → busqué
// condición:
//   raíz termina en "c"
//   terminación empieza con "e" o "i"


// g → gu
// preservar sonido /g/
// ejemplo: pagar → pagué
// condición:
//   raíz termina en "g"
//   terminación empieza con "e" o "i"


// z → c
// preservar sonido /θ/ o /s/
// ejemplo: empezar → empecé
// condición:
//   raíz termina en "z"
//   terminación empieza con "e" o "i"


// gu → gü
// preservar sonido /gw/
// ejemplo: averiguar → averigüé
// condición:
//   raíz termina en "gu"
//   terminación empieza con "e" o "i"


// ============================================================
// 2. PRESERVAR SONIDO VOCÁLICO (EVITAR DIPTONGOS INCORRECTOS)
// ============================================================

// i → í  (hiato obligatorio en participio)
// ejemplo: creer → creído
// condición:
//   tema termina en vocal
//   terminación empieza con "ido" o "ida"
// efecto:
//   marcar "í" con tilde


// i → y  (y epentética entre vocales)
// ejemplo:
//   leer → leyendo
//   leer → leyó
// condición:
//   tema termina en vocal
//   terminación empieza con "i"
// efecto:
//   reemplazar "i" por "y"


// ============================================================
// 3. CAMBIO ORTOGRÁFICO PRODUCTIVO EN PRETÉRITO (-ducir)
// preservar sonido velar fuerte
// ============================================================

// c → j
// ejemplo: conducir → conduje
// condición:
//   infinitivo termina en "-ducir"
//   antes de terminaciones del pretérito fuerte


// ============================================================
// 4. PRESERVAR ACENTUACIÓN (REGLAS GENERALES DEL ESPAÑOL)
// Estas reglas dependen de la estructura silábica final.
// ============================================================

// agregar tilde para preservar sílaba tónica
// ejemplo:
//   creido → creído
//   dimelo → dímelo


// hiato con vocal cerrada tónica siempre lleva tilde
// ejemplo:
//   leído
//   oído
//   creído


// ============================================================
// NOTAS DE ARQUITECTURA
// ============================================================

// Estas reglas:
//   - son completamente productivas
//   - no dependen de verbos específicos
//   - no deben almacenarse en la tabla de verbos
//   - pertenecen a un módulo ortográfico separado
//
// orden de ejecución:
//   1. formar tema morfológico
//   2. añadir terminación
//   3. aplicar reglas ortográficas de preservación
//   4. aplicar reglas generales de acentuación
//


// The form of a orthographical change rule.
// These rules are only applied to the conjugated forms of verbs.
export interface OrthographicalChangeRule {
    // A pattern describing what to replace.
    // The entire matching text will be replaced by the text described by "replacement".
    match_pattern: RegExp
    // A pattern describing the text that replaces what is matched by match_pattern.
    // A replacement pattern uses the syntax of MS VS Code, e.g.: "c$1"
    // This may contain one capture group index.
    // (The "$" indicates the index of the capture group from the RegExp.)
    replacement_pattern: string
}



// A mapping of the last 3 or 4 characters of an infinitive to the possible typographic change rule.
const infinitive_ending_sound_rules: {[ending: string]: string} = {
    quir: "preserve-hard-c-sound-of-q",
    guir: null,   // prevent -guir verbs from selecting -uir rules
    car: "preserve-hard-c-sound-of-c",
    cer: "preserve-soft-c-sound",
    cir: "preserve-soft-c-sound",
    gar: "preserve-hard-g-sound",
    ger: "preserve-soft-g-sound",
    gir: "preserve-soft-g-sound",
    uir: "u → uy (hiato)",
    zar: "replace-disallowed-ze-zi",
}


// FIX: linguist: are these patterns
// Verb changes made solely for phonetic reasons, and using changes in typography.
const orthographical_change_rules : {[rule_name: string]: OrthographicalChangeRule} = {
    "preserve-soft-c-sound": {
        // example: conocer,IndPres,s1: conoco => conozco
        // counter-example: hacer,IndPret,s3: hico !=> hizco
        // NOTE: this rule is only for verb terminations
        match_pattern: /c([aáoóuú](s|mos|is|n)?)$/u, 
        replacement_pattern: "zc$1"
    },
    "preserve-hard-c-sound-of-c": {
        // example: sacar,IndPret,s1: sacé => saqué
        match_pattern: /c([eéií](s|mos|is|n)?)$/u,
        replacement_pattern: "qu$1"
    },
    "preserve-soft-g-sound": {
        // example: elegir,IndPres,s1: eligo => elijo
        match_pattern: /g([aáoóuú](s|mos|is|n)?)$/u,
        replacement_pattern: "j$1"
    },
    "preserve-hard-g-sound": {
        // example: llegar,IndPret,s1: llegé => llegué
        match_pattern: /g([eéií](s|mos|is|n)?)$/u,
        replacement_pattern: "gu$1"
    },
    "replace-disallowed-ze-zi": {
        // Spanish doesn't have "ze", or "zi"
        // It does have "za" (zanahoria), "zo" (zoo), "zu" (azul)
        // example: empezar,IndPret,s1: empezé => empecé
        match_pattern: /z([eéií](s|mos|is|n)?)$/u,
        replacement_pattern: "c$1"
    },
    "preserve-hard-c-sound-of-q": {
        // example: delinquir,IndPres,s1: delinquo -> delinco
        match_pattern: /qu([o](s|mos|is|n)?)$/u,
        replacement_pattern: "c$1"
    },
    "u → uy (hiato)": {
        // example: fluir,IndPres,s1: fluo -> fluyo
        match_pattern: /u([aáeéoó](s|mos|is|n)?)$/u,
        replacement_pattern: "uy$1"
    }
}


// Apply any orthographical changes to the given part of a verb conjugation or participle derivation
export function applyOrthographicalChangesCommon(full_form: string, suffix: string, do_correct_dieresis: boolean): string | undefined {
    let changed = full_form
    if (do_correct_dieresis) {
        changed = correctDiéresis(changed)
    }
    // mantener hiato
    changed = changed.replace(/([aeo])i(ste|mos|steis|do)$/, "$1í$2")
    // vocal débil → y   after other vowel, but not after "gu" or "qu" which are considered a single consonants
    changed = changed.replace(/(?<![gq])([aeouü])i([eó])/, "$1y$2")
    // // u débil → y   after other vowel, but not after "gu" or "qu" which are considered a single consonants
    // changed = changed.replace(/(?<![gq])u([aeo])/, "y$1")
    // vocal débil → y   at start of word, e.g. "erguir", "oyer"
    changed = changed.replace(/^(?:(o)|i)e/, "$1ye")
    // changed = accentuate(full_form, suffix).  FAILED
    return changed
}


// Apply any orthographical changes to the given form of a verb conjugation.
export function applyOrthographicalChangesToConjugatedForm(infinitive: string, form: string, suffix: string, do_correct_dieresis: boolean): string {
    const rule = findInfinitiveBaseEndingSoundRule(infinitive)
    if (rule) {
        form = form.replace(rule.match_pattern, rule.replacement_pattern)
    }
    form = applyOrthographicalChangesCommon(form, suffix, do_correct_dieresis)
    return form
}


export function applyOrthographicalChangesForParticiples(participles: Participles, gerund_ending: string, do_correct_dieresis: boolean): Participles | undefined {
    const changes : Participles = {}
    const pres = applyOrthographicalChangesCommon(participles.pres, gerund_ending, do_correct_dieresis)
    const past = applyOrthographicalChangesCommon(participles.past, participles.past.slice(-3), do_correct_dieresis)
    if (pres && (pres !== participles.pres)) {
        changes.pres = pres
    }
    if (past && (past !== participles.past)) {
        changes.past = past
    }
    return changes
}


export function findInfinitiveBaseEndingSoundRule(infinitive: string) : OrthographicalChangeRule | undefined {
    let ending = infinitive.slice(-4)
    let rule_name = infinitive_ending_sound_rules[ending]
    if (rule_name === null) {
        return
    }
    if (!rule_name) {
        ending = infinitive.slice(-3)
        rule_name = infinitive_ending_sound_rules[ending]
    }
    if (rule_name) {
        const rule = orthographical_change_rules[rule_name]
        return rule
    }
}


export function correctDiéresis(conjugation: string) {
    // Order matters here: first resolve üi/ü + vowel, then restore güi/güí
    conjugation = conjugation.replace(/üi?([aáeéoó])/, "uy$1")
    return conjugation.replace(/gu([ií])/, "gü$1")
}


// @return The conjugated forms after applying the orthographical change rules.
// @param @output rules_applied Contains the names of the rules that were applied to the input verb.
// export function __getOrthographicChanges(stem: string, ending: string, form: string, do_correct_dieresis: boolean): string | undefined {
//     return
// }
export function getOrthographicChanges(infinitive: string, tense_mood: TenseMood, forms: VerbConjugation, suffixes: VerbConjugationSuffixes): VerbConjugation {
    const changes: VerbConjugation = {}
    const do_correct_dieresis = infinitive.includes("ü")
    for (const key in forms) {
        const gramatical_person = key as keyof VerbConjugation;
        const changed_forms = applyToVerbForms(forms[gramatical_person], (form: string, i: number) => {
            const suffixes_for_person = suffixes[gramatical_person]
            const suffix = suffixes_for_person[i] || suffixes_for_person[0] 
            return applyOrthographicalChangesToConjugatedForm(infinitive, form, suffix, do_correct_dieresis)
        })
        forms[gramatical_person] = changed_forms
    }
    return changes
}
