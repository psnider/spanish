import { VerbConjugation, VerbTenseMood } from ".";
import { conjugateVerb } from "./conjugate-verb.js";
import { assert_TenseMood } from "./test-support.js"


let infinitive = "partir"
let mood_tense: VerbTenseMood = "CmdNeg"



let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))


debugger

