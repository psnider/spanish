// Prefixes that precede irregular verbs.
// This isn't a list of all known prefixes.

import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js"

// These are in order of: first letter, then longest first when there is a prefix match.
// Each entry has a comment giving one example that shows the use of the prefix.
const verb_prefixes = [
"a",        // atener, atraer, avenir
"abs",      // abstener, abstraer
"ante",     // anteponer
"auto",     // autoregular, NO irregular
"ben",      // bendecir
"co",       // cooperar, NO irregular
"com",      // componer
"con",      // contener, contraer, condecir, convenir
"contra",   // contradecir, contrahacer, contraponer
"de",       // detener, detraer
"desa",     // (des + a ) desavenir
"des",      // desavenir, deshacer, desoír
"dis",      // distraer
"en",
"entre",    // entreoír
"ex",       // extraer
"extra",
"hiper",
"im",       // imponer
"in",
"inter",    // interponer, intervenir
"mal",      // maldecir
// mantener
"micro",
"mini",
"mono",
"multi",
// oponer
// obtener
"post",
"pos",     // posponer
"pre",     // predecir, prevenir
"pro",     // proponer, provenir
"re",      // rehacer, reponer, retener, retraer
"retro",
"semi",
"sobre",   // sobresalir, sobrevenir
"sos",     // sostener
// suponer
"sub",
"super",   // superponer
// sustraer
"trans",
"ultra",
]

const verbs_with_false_prefixes = new Set([
  "coser",
  "delinquir",
])


export interface BaseWPrefix {
  prefix?: string
  base: string
}


// ChatGPT says: Si ves un verbo que:
// - tiene prefijo claro (pre-, re-, con-, sub-, ante-, etc.)
// - termina como un verbo irregular fuerte
// 👉 Asume que se conjuga como el verbo base, hasta que alguien te demuestre lo contrario.
//    Funciona el 95 %+ del tiempo.
export function findPrefixOfIrregularVerb(infinitive: string): BaseWPrefix {
  if (verbs_with_false_prefixes.has(infinitive)) {
    return {base: infinitive}
  }
  let prefix: string = undefined
  let base = infinitive
  for (const prefix_1 of verb_prefixes) {
    if (infinitive.startsWith(prefix_1)) {
      const possible_base = infinitive.slice(prefix_1.length)
      const base_infinitive_rules = verb_conjugation_rules[possible_base]
      if (base_infinitive_rules) {
        return {prefix: prefix_1, base: possible_base}
      }
    }
  }
  // It seems we don't have to check for compound prefixes, eg. desavenir
  // We will add checks once failure cases are found
  return {prefix, base}
}
