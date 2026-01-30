import { AspectsT, GrammaticalPersons, VerbConjugation, VerbTenseMood } from "."
import { applyToVerbForms } from "./lib.js"


type AccentChanges = AspectsT< GrammaticalPersons<string> >


namespace accents {

    // based on model: vaciar
    export const criar: AccentChanges = {
        IndPres: {p2: "á:a"},
        IndPret: {s1: "é:e", s3: "ó:o"},
    }

}


const accent_changes_by_infinitive: {[base_infinitive: string]: AccentChanges} = {
    criar: accents.criar,
    guiar: accents.criar,
}


export function getChangedAccents(infinitive: string, tense_mood: VerbTenseMood, conjugation: VerbConjugation) : VerbConjugation {
    function correctDiéresis(conjugation: string) {
        // argüó
        conjugation = conjugation.replace(/üi?([aáeéoó])/, "uy$1")
        return conjugation.replace(/gu([ií])/, "gü$1")
    }
    let accent_changes: VerbConjugation = {}
    const accent_change_rules = accent_changes_by_infinitive[infinitive]?.[tense_mood]
    if (accent_change_rules) {
        Object.keys(accent_change_rules).forEach((key: keyof GrammaticalPersons<string>) => {
            const accent_change_pattern = accent_change_rules[key]
            const conjugated_form = conjugation[key]
            if (typeof accent_change_pattern !== "string") {
                throw new Error(`expected string in accent_change_pattern=${accent_change_pattern}`)
            }
            const [unchanged, changed] = accent_change_pattern.split(":")
            const i = conjugated_form.lastIndexOf(unchanged)
            if (i === -1) {
                throw new Error(`can't apply accent_change_pattern=${accent_change_pattern} to conjugated_form=${conjugated_form}`)
            }
            const changed_form = conjugated_form.slice(0,i) + changed + conjugated_form.slice(i + unchanged.length)
            accent_changes[key] = [changed_form]
        })
    } else {
        accent_changes = {...conjugation}
    }
    // Apparently, the only verb that ends in "üir" is "argüir".
    if (infinitive.includes("ü")) {
        for (const conjugation_key in accent_changes) {
            applyToVerbForms(accent_changes, accent_changes, <keyof VerbConjugation> conjugation_key, correctDiéresis)
        }
    }
    return accent_changes
}

