import { VerbConjugation, VerbTenseMood } from "."


interface AccentChanges {
    PresInd?: VerbConjugation
    PresSub?: VerbConjugation

    PastInd?: VerbConjugation
    PastImpInd?: VerbConjugation
    PastCond?: VerbConjugation
    
    FutInd?: VerbConjugation
    CmdPos?: VerbConjugation
    CmdNeg?: VerbConjugation
}


namespace accents {

    // based on model: vaciar
    export const criar: AccentChanges = {
        PresInd: {"2p": "á:a"},
        PastInd: {"1s": "é:e", "3s": "ó:o"},
    }

}


const accent_changes_by_infinitive: {[base_infinitive: string]: AccentChanges} = {
    criar: accents.criar,
    guiar: accents.criar,
}



export function applyAccentChanges(infinitive: string, tense_mood: VerbTenseMood, conjugation: VerbConjugation) : VerbConjugation {
    const accent_changes: VerbConjugation = {}
    const accent_change_rules = accent_changes_by_infinitive[infinitive]?.[tense_mood]
    if (accent_change_rules) {
        Object.keys(accent_change_rules).forEach((key: keyof VerbConjugation) => {
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
            accent_changes[key] = changed_form
        })
    }
    return accent_changes
}


