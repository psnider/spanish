import { VerbTenseMood } from ".";
import { conjugateVerb } from "./conjugate-verb.js";



let infinitive = "delinquir"
let mood_tense: VerbTenseMood = "PresInd"


let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))



debugger

