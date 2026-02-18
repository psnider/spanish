import { GrammaticalPerson, TenseMood, VerbConjugation, VerbForms } from ".";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";


const unaccented_vowels_to_accented = {
  a: "á", e: "é", i: "í", o: "ó", u: "ú"
}
const accented_vowels_to_unaccented = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u"
};


function removeAccent(c: string) {
    return accented_vowels_to_unaccented[<keyof typeof accented_vowels_to_unaccented> c] ?? c
} 


function addAccent(c: string) {
    return unaccented_vowels_to_accented[<keyof typeof unaccented_vowels_to_accented> c] ?? c
} 


export function moveStress(word: string, move: {from?: number, to?: number}) {
    const chars = [...word]
    if (move.from != null) {
        chars[move.from] = removeAccent(chars[move.from])
    }
    if (move.to != null) {
        chars[move.to] = addAccent(chars[move.to])
    }
    return chars.join("")
}


const stressed_regex = /[áéíóú]/
const unstressed_regex = /[aeiou][bcdfghjklmnpqrstvwxyz]?$/
// FIX: add remaining dipthongs
const unstressed_dipthong_regex = /(ei)[bcdfghjklmnpqrstvwxyz]?$/
function findIndexOfStress(verb_form: string) : number | undefined {
    let match = verb_form.match(stressed_regex)
    if (match) {
        return match.index
    } else {
        match = verb_form.match(unstressed_dipthong_regex)
        if (match) {
            return match.index
        } else {
            match = verb_form.match(unstressed_regex)
            if (match) {
                return match.index
            }
        }
    }
}


function placeStressInVerbForm(verb_form: string, stress_index: number) : string {
    const old_stress_index = findIndexOfStress(verb_form)
    const moved = moveStress(verb_form, {from: old_stress_index, to: stress_index})
    return moved
}


export function removeStress(original: string) : string {
    const old_stress_index = findIndexOfStress(original)
    if (old_stress_index !== undefined) {
        const unstressed = moveStress(original, {from: old_stress_index})
        return unstressed
    } else {
        return original
    }
}


export function removeHiatusStressFromAfterDipthong(form: string) {
    const index = form.indexOf("gui")
    if (index !== -1) {
        const accented_ch = form[index + "gui".length] 
        const unaccented_ch = removeAccent(accented_ch)
        form = form.replace(`gui` + accented_ch, `gui` + unaccented_ch)
    }
    return form
}

