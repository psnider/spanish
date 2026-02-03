import { VerbTenseMood } from ".";
import { conjugateVerb, deriveParticiples } from "./conjugate-verb.js";



let infinitive = "prever"
let mood_tense: VerbTenseMood = "IndPres"


let participles = deriveParticiples(infinitive)
console.log(JSON.stringify(participles, null, 4))

let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))



debugger

