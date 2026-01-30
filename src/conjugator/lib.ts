import {VerbConjugation, VerbForms} from "."

// The names of the conjugations.
// The first character refers to plurality, and the second to person.
// So "s1" refers to 1st-person-singular, and "p2" refers to 2nd-person-plural.
// This must match GrammaticalPerson.
export const conjugation_keys: Array <keyof VerbConjugation> = ["s1", "s2", "s3", "p1", "p2", "p3", "vos"]


export function applyToVerbForms(source: VerbConjugation, target: VerbConjugation, fieldname: keyof VerbConjugation, change: (conjugation: string) => string | undefined) {
    const change_in_place = (source === target)
    const source_verb_forms = source[fieldname]
    if (source_verb_forms) {
        if (!change_in_place && !target[fieldname]) {
            target[fieldname] = <VerbForms><unknown> new Array(source_verb_forms.length)
        }
        source_verb_forms.forEach((source_verb_form, i) => {
            let changed_form = change(source_verb_form)
            if (changed_form) {
                target[fieldname][i] = changed_form
            } else {
                if (!change_in_place) {
                     target[fieldname][i] = source_verb_form
                }
            }
        })
    }
}
