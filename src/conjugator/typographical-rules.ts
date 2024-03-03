import { VerbConjugation, VerbConjugationAnnotated } from ".";
import { conjugation_keys } from "./lib.js";



// The form of a typographical change rule.
// These rules are only applied to the conjugated forms of verbs.
export interface TypographicalChangeRule {
    // A pattern describing what to replace.
    // The entire matching text will be replaced by the text described by "replacement".
    match_pattern: RegExp
    // A pattern describing the text that replaces what is matched by match_pattern.
    // A replacement pattern uses the syntax of MS VS Code, e.g.: "c$1"
    // This may contain one capture group index.
    // (The "$" indicates the index of the capture group from the RegExp.)
    replacement_pattern: string
}


// A mapping of the last 3-characters of an infinitive to the possible typographic change rule.
const infinitive_3_endings_to_rules: {[ending: string]: string} = {
    car: "preserve-hard-c-sound",
    cer: "preserve-soft-c-sound",
    cir: "preserve-soft-c-sound",
    gar: "preserve-hard-g-sound",
    ger: "preserve-soft-g-sound",
    gir: "preserve-soft-g-sound",
    zar: "replace-disallowed-ze-zi",
    zer: "replace-disallowed-ze-zi",
    zir: "replace-disallowed-ze-zi",
}


// Verb changes made solely for phonetic reasons, and using changes in typography.
const typographical_change_rules : {[rule_name: string]: TypographicalChangeRule} = {
    "preserve-soft-c-sound": {
        // example: conocer,PresInd,1s: conoco => conozco
        match_pattern: /c([aáoóuú])$/u, 
        replacement_pattern: "zc$1"
    },
    "preserve-hard-c-sound": {
        // example: sacar,PastInd,1s: sacé => saqué
        match_pattern: /c([eéií])$/u,
        replacement_pattern: "qu$1"
    },
    "preserve-soft-g-sound": {
        // example: elegir,PresInd,1s: eligo => elijo
        match_pattern: /g([aáoóuú])$/u,
        replacement_pattern: "j$1"
    },
    "preserve-hard-g-sound": {
        // example: llegar,PastInd,1s: llegé => llegué
        match_pattern: /g([eéií])$/u,
        replacement_pattern: "gu$1"
    },
    "replace-disallowed-ze-zi": {
        // Spanish doesn't have "ze", or "zi"
        // It does have "za" (zanahoria), "zo" (zoo), "zu" (azul)
        // example: empezar,PastInd,1s: empezé => empecé
        match_pattern: /z([eéií])/u,
        replacement_pattern: "c$1"
    },
}


// assert_typographicalChange({text: "empezé", infinitive: "empezar"}, "empecé")






// if (doesMatchTypographicalChangeRule(infinitive, rule)) {
//     const typographical_change = applyTypographicalChangeRule(verb, rule)
//     if (typographical_change) {
//         rules_applied?.push(rule.name)
//         corrected_verb_text = typographical_change
//         verb.text = typographical_change
//     }
// }

const capture_group_id_regexp = /\$(\d+)/


function applyTypographicalChange(conjugated_form: string, rule: TypographicalChangeRule) : string | undefined {
    const {match_pattern, replacement_pattern} = rule
    const errant_typographical_match = conjugated_form.match(match_pattern)
    if (errant_typographical_match) {
        const unchanged_length = errant_typographical_match[0].length
        const unchanged_index = errant_typographical_match.index
        let replacement_text
        const capture_group_id_match = replacement_pattern.match(capture_group_id_regexp)
        if (capture_group_id_match) {
            const id_index = capture_group_id_match.index
            const id_length = capture_group_id_match[0].length
            const capture_group_id = parseInt(capture_group_id_match[1])
            if (Number.isNaN(capture_group_id)) {
                throw new Error(`Invalid capture_group_id in replacement_pattern=${replacement_pattern}`)
            }
            const capture_group_match = errant_typographical_match[capture_group_id]
            replacement_text = replacement_pattern.slice(0, id_index) + capture_group_match + replacement_pattern.slice(id_index + id_length)
        } else {
            replacement_text = replacement_pattern
        }
        const changed = conjugated_form.slice(0, unchanged_index) + replacement_text + conjugated_form.slice(unchanged_index + unchanged_length)
        return changed
    }
}


export function test_applyTypographicalChange(conjugated_form: string, infinitive: string) {
    const ending = infinitive.slice(-3)
    const rule_name = infinitive_3_endings_to_rules[ending]
    if (rule_name) {
        const rule = typographical_change_rules[rule_name]
        const changed = applyTypographicalChange(conjugated_form, rule)
        return changed
    }
}


// @return The conjugated form after applying the typographical change rules.
// @param @output rules_applied Contains the names of the rules that were applied to the input verb.
export function applyTypographicalChangeRules(infinitive: string, conjugation: VerbConjugation) : VerbConjugation {
    // Apply the rule to the conjugated_form, if the rule matches the form.
    let typographical_changes: {[k:string]: string} = {}
    const ending = infinitive.slice(-3)
    const rule_name = infinitive_3_endings_to_rules[ending]
    if (rule_name) {
        const rule = typographical_change_rules[rule_name]
        const keys: Array<keyof VerbConjugation> = <Array<keyof VerbConjugation>> Object.keys(conjugation).filter((key: keyof VerbConjugation) => {
            return conjugation_keys.includes(key)
        })
        keys.forEach((key) => {
            const conjugated_form = conjugation[key]
            if (conjugated_form && (typeof conjugated_form === "string")) {
                const changed = applyTypographicalChange(conjugated_form, rule)
                if (changed) {
                    typographical_changes[key] = changed
                }
            }
        })
    }
    return typographical_changes
}


// // @return the text as changed by applying the rule, or undefined if the rule isn't applied
// function applyTypographicalChangeRule(verb: VerbTextUsage_forTypographicalChange, rule: TypographicalChangeRule) {
//     const {match_pattern, replacement_pattern} = rule.change
//     const match = verb.text.match(match_pattern)
//     if (match) {
//         const unchanged_length = match[0].length
//         const unchanged_index = match.index
//         let replacement_text
//         const capture_group_id_match = replacement_pattern.match(capture_group_id_regexp)
//         if (capture_group_id_match) {
//             const id_index = capture_group_id_match.index
//             const id_length = capture_group_id_match[0].length
//             const capture_group_id = parseInt(capture_group_id_match[1])
//             if (Number.isNaN(capture_group_id)) {
//                 throw new Error(`Invalid capture_group_id in replacement_pattern=${replacement_pattern}`)
//             }
//             const capture_group_match = match[capture_group_id]
//             replacement_text = replacement_pattern.slice(0, id_index) + capture_group_match + replacement_pattern.slice(id_index + id_length)
//         } else {
//             replacement_text = replacement_pattern
//         }
//         const changed = verb.text.slice(0, unchanged_index) + replacement_text + verb.text.slice(unchanged_index + unchanged_length)
//         return changed
//     }
// }

