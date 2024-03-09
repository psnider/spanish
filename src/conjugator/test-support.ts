
import {VerbConjugation, VerbTenseMood} from "."
import { conjugateVerb } from "./conjugate-verb.js"
import { test_applyTypographicalChange } from "./typographical-rules.js"

export function equal(lhs: string | [string, string] | undefined, rhs: string | [string, string] | undefined) {
    if ((typeof lhs === "string") && (typeof rhs === "string")) {
        return (lhs === rhs)
    } else if (Array.isArray(lhs) && Array.isArray(rhs)) {
        return ((lhs[0] === rhs[0]) && (lhs[1] === rhs[1]))
    } if ((lhs == null) && (rhs == null)) {
        return true
    } else {
        return false
    }
}


export function assert_singleForm(infinitive: string, mood_tense: VerbTenseMood, form: string, expected: string) {
    const conjugation = conjugateVerb(infinitive, mood_tense)
    const actual = conjugation.forms[<keyof VerbConjugation> form]
    if (actual !== expected) {
        throw new Error(`${infinitive},${mood_tense},${form}: ${actual} !== ${expected}`)
    }
}


export function assert_TenseMood(infinitive: string, mood_tense: VerbTenseMood, expected: VerbConjugation) {
    const actual = conjugateVerb(infinitive, mood_tense)
    const forms = actual.forms
    const expected_keys = Object.keys(expected)
    expected_keys.forEach((expected_key: keyof VerbConjugation) => {
        if (expected_key != "vos") {
            if (! equal(forms[expected_key], expected[expected_key])) {
                throw new Error(`${infinitive},${mood_tense},${expected_key}: ${forms[expected_key]} !== ${expected[expected_key]}`)
            }    
        }
        delete forms[expected_key]
    })
    const unexpected_keys = Object.keys(actual.forms)
    if (unexpected_keys.length > 0) {
        throw new Error(`${infinitive},${mood_tense}: has more keys than expected: ${unexpected_keys}`)
    }
}


export function assert_typographicalChange(args: {conjugated_form: string, infinitive: string}, expected: string) {
    const rules_applied: string[] = []
    const actual = test_applyTypographicalChange(args.conjugated_form, args.infinitive)
    if (actual !== expected) {
        throw new Error(`${actual} !== ${expected} : rules_applied=${rules_applied}`)
    }
}
