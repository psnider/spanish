import {VerbConjugation, VerbForms} from "."

// The names of the conjugations.
// The first character refers to plurality, and the second to person.
// So "s1" refers to 1st-person-singular, and "p2" refers to 2nd-person-plural.
export const conjugation_keys: Array <keyof VerbConjugation> = ["s1", "s2", "s3", "p1", "p2", "p3"]


export function applyToVerbForms(source: VerbConjugation, target: VerbConjugation, fieldname: keyof VerbConjugation, change: (conjugation: string) => string | undefined) {
    function applyToArray(source: [string, string], index: number) {
        let changed_form = change(source[index])
        if (changed_form) {
            let target_verb_forms = target[fieldname]
            if (typeof target_verb_forms === 'string') {
                throw new Error(`expected VerbForms array: fieldname=${fieldname} in ${JSON.stringify(source)}`)
            }
            if (!target_verb_forms) {
                target_verb_forms = [undefined, undefined]
                target[fieldname] = target_verb_forms
            }
            target_verb_forms[index] = changed_form
        }
    }
    const verb_forms = source[fieldname]
    if (verb_forms) {
        if (typeof verb_forms === 'string') {
            const changed_form = change(verb_forms)
            if (changed_form) {
                target[fieldname] = changed_form
            }
        } else {
            if (verb_forms.length != 2) {
                throw new Error(`array of conjugations must contain 2 entries: fieldname=${fieldname} in ${JSON.stringify(source)}`)
            }
            applyToArray(verb_forms, 0)
            applyToArray(verb_forms, 1)
        }
    }
}
