// Prefixes that precede irregular verbs.
// This isn't a list of all known prefixes.

import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js"

// These are in order of: first letter, then longest first when there is a prefix match.
// Each entry has a comment giving one example that shows the use of the prefix.
const verb_prefixes = [
"a",        // atener, atraer, avenir
"abs",      // abstener, abstraer
// "ante",
// "auto",
// "co",
"con",      // contener, contraer
"contra",
"de",       // detener, detraer
"desa",     // desavenir= des + a + venir
"des",      // desavenir= des + a + venir
"dis",      // distraer
"en",
"entre",
"ex",
"extra",
"hiper",
"im",
"in",
"inter",
"micro",
"mini",
"mono",
"multi",
"post",
"pre",
"pro",
"re",
"retro",
"semi",
"sobre",
"sub",
"super",
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
  // if a prefix was found, check for a compound prefix, eg. desavenir
  return {prefix, base}
}
