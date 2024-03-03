
import {VerbConjugation, VerbTenseMood} from "."
import { conjugateVerb } from "./conjugate-verb.js"
import { test_applyTypographicalChange } from "./typographical-rules.js"

// The names of the conjugations.
// The first character refers to person, and the second to plurality.
// So "1s" refers to 1st-person-singular, and "2p" refers to 2nd-person-plural.
export const conjugation_keys: Array <keyof VerbConjugation> = ["1s", "2s", "3s", "1p", "2p", "3p"]

