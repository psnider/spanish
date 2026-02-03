import {VerbConjugation, VerbForms} from "."


// The minimum length of a verb that might have prefixes.
// Segun ChatGPT, hay solo un verbo de largo 2, "ir", que no puede tener prefijos.
// y solo hay estos de largo 3: dar, ser, ver, oír
export const MIN_BASE_VERB_LENGTH = 3

// The names of the conjugations.
// The first character refers to plurality, and the second to person.
// So "s1" refers to 1st-person-singular, and "p2" refers to 2nd-person-plural.
// This must match GrammaticalPerson.
export const conjugation_keys: Array <keyof VerbConjugation> = ["s1", "s2", "s3", "p1", "p2", "p3", "vos"]


export function applyToVerbForms(source: VerbConjugation, target: VerbConjugation, gramatical_person: keyof VerbConjugation, change: (conjugation: string) => string | undefined) {
    const change_in_place = (source === target)
    const source_verb_forms = source[gramatical_person]
    if (source_verb_forms) {
        if (!change_in_place && !target[gramatical_person]) {
            target[gramatical_person] = <VerbForms><unknown> new Array(source_verb_forms.length)
        }
        source_verb_forms.forEach((source_verb_form, i) => {
            let changed_form = change(source_verb_form)
            if (changed_form) {
                target[gramatical_person][i] = changed_form
            } else {
                if (!change_in_place) {
                     target[gramatical_person][i] = source_verb_form
                }
            }
        })
    }
}
