import { MoodTense } from "..";
import { conjugateVerb } from "../conjugate-verb.js";
import { deriveParticiples } from "../derive-participles.js";
import { mood_tenses } from "../lib.js";
import { verb_terminations } from "../regular-verb-rules.js";



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
 
let infinitive: string = "intercambiar"
let mood_tense: MoodTense = "IndPres"

if (process.argv.length !== 4) {
    console.log("Usage: infinitive mood_tense")
    if (process.argv.length > 2) {
        process.exit(1)
    }
} else {
    infinitive = process.argv[2]
    mood_tense = <MoodTense> process.argv[3]
}

console.log(`${infinitive} ${mood_tense}`)
let error = false
if ( ! verb_terminations.includes(infinitive.slice(-2))) {
    console.log(`infinitive must end with one of "ar","er","ir"`)
    error = true
}
if ( ! mood_tenses.includes(mood_tense)) {
    console.log(`infinitive must end with one of "ar","er","ir"`)
    error = true
}
if (error) {
    process.exit(1)
}

let participles = deriveParticiples(infinitive)
console.log(JSON.stringify(participles, null, 4))

let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))

