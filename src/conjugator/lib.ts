import {GrammaticalPerson, TenseMood, VerbConjugation, VerbConjugationStems, VerbForms} from "."


// Apply a change to each verb form for a single conjugation (for mood + tense + gramatical person).
// The number of forms (1 or 2) is preserved.
// If there are no verb forms, then there is no change.
// @param source_forms The starting verb forms. This is not modified.
// @change: Returns the changed form, or undefined if there is no change.
// @return The VerbForms after applying the change()
export function applyToVerbForms(source_forms: VerbForms, change: (form: string, i?: number) => string | undefined) : VerbForms {
    if (source_forms) {
        const changed_forms = <VerbForms> source_forms.map((source_form, i) => {
            const changed_form = change(source_form, i)
            return (changed_form !== undefined) ? changed_form : source_form
        })
        return changed_forms
    } else {
        return source_forms
    }
}


export const persons_standard = <(keyof VerbConjugation)[]> ["s1", "s2", "s3", "p1", "p2", "p3"]
export const persons_w_vos = <(keyof VerbConjugation)[]> ["s1", "s2", "s3", "p1", "p2", "p3", "vos"]
export const tense_moods : TenseMood[] = ["IndPres", "IndImp", "IndPret", "IndFut", "IndCond", "SubPres" , "SubImp" , "SubFut", "CmdPos", "CmdNeg"]


export function setStem(stem: string | [string, string], only_persons?: GrammaticalPerson[]) {
    const temas : VerbConjugationStems = {}
    const stems : VerbForms = (Array.isArray(stem) ? stem : [stem])
    const persons = only_persons || persons_w_vos
    for (const key of persons) {
        const persona_gramatical = <GrammaticalPerson> key
        temas[persona_gramatical] = stems
    }
    return temas
}
