import { VerbTenseMood } from ".";
import { conjugateVerb } from "./conjugate-verb.js";



let infinitive = "elegir"
let mood_tense: VerbTenseMood = "CmdPos"


let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))



debugger

