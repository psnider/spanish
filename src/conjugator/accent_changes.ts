import { TenseMoodMap, GrammaticalPersons, VerbConjugation, TenseMood, GrammaticalPerson } from "."
import { applyToVerbForms } from "./lib.js"


type AccentChangePattern = string  // "á:a"
type AccentChanges = TenseMoodMap< GrammaticalPersons<AccentChangePattern> >


// based on model: vaciar
// FIX: linguistics
const accent_model_criar: AccentChanges = {
    IndPres: {p2: "á:a"},
    IndPret: {s1: "é:e", s3: "ó:o"},
}


// FIX: linguistics
const accent_changes_by_infinitive: {[base_infinitive: string]: AccentChanges} = {
    criar: accent_model_criar,
    guiar: accent_model_criar,
}


export function correctDiéresis(conjugation: string) {
    // Order matters here: first resolve üi/ü + vowel, thenrestore güi/güí
    conjugation = conjugation.replace(/üi?([aáeéoó])/, "uy$1")
    return conjugation.replace(/gu([ií])/, "gü$1")
}


export function getChangedAccents(infinitive: string, tense_mood: TenseMood, conjugation: VerbConjugation) : VerbConjugation {
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
    }
    // Apparently, the only verb that ends in "üir" is "argüir".
    if (infinitive.includes("ü")) {
        for (const conjugation_key in conjugation) {
            // this alias obviates type casting in the following assignment
            const gramatical_person = <GrammaticalPerson> conjugation_key
            accent_changes[gramatical_person] = applyToVerbForms(conjugation[gramatical_person], correctDiéresis)
        }
    }
    return accent_changes
}

