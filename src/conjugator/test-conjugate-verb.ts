import { VerbConjugation, VerbTenseMood } from ".";
import { conjugateVerb } from "./conjugate-verb.js";
import { assert_TenseMood } from "./test-support.js"



let infinitive = "detener"
let mood_tense: VerbTenseMood = "PresInd"



let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))



debugger

