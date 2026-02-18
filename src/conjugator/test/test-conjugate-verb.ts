import { TenseMood } from "..";
import { conjugateVerb } from "../conjugate-verb.js";
import { deriveParticiples } from "../derive-participles.js";


let infinitive = "prever"
let mood_tense: TenseMood = "IndPres"

// case "IndPres":
// case "IndImp":
// case "IndPret":
// case "IndFut":
// case "IndCond":
// case "SubPres":
// case "SubImp":
// case "SubFut":
// case "CmdPos":
// case "CmdNeg":
 
let participles = deriveParticiples(infinitive)
console.log(JSON.stringify(participles, null, 4))

let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))


debugger
