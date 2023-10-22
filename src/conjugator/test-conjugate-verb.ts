import { applyTypographicalChangeRules, conjugateVerb } from "./grammar.js";
import { VerbMoodTense } from "./index.js";

let infinitive = "llegar"
let mood_tense: VerbMoodTense = "IndPast"

let conjugation = conjugateVerb(infinitive, mood_tense)
console.log(JSON.stringify(conjugation, null, 4))


// const rules_applied: string[] = []
// // should return "empecé"
// const actual = applyTypographicalChangeRules({text_type: "conjugated", text: "empezé", infinitive: "empezar"}, rules_applied)


debugger