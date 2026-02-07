import {VerbConjugation, VerbForms} from "."


// Apply a change to each verb form for a single conjugation (for mood + tense + gramatical person).
// The number of forms (1 or 2) is preserved.
// If there are no verb forms, then there is no change.
// @change: Returns the changed form, or undefined if there is no change.
export function applyToVerbForms(source_forms: VerbForms, change: (form: string) => string | undefined) : VerbForms {
    if (source_forms) {
        const changed_forms = <VerbForms> source_forms.map((source_form) => {
            const changed_form = change(source_form)
            return (changed_form !== undefined) ? changed_form : source_form
        })
        return changed_forms
    } else {
        return source_forms
    }
}
