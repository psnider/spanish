import { GrammaticalPerson } from "../index.js"
import { mood_tenses } from "../lib.js"
import { stem_change_descriptions, stem_change_patterns, StemChangeRules } from "../stem-changes.js"


// Finds misspelling errors and possibly cut&paste error in the 'StemChangeRuleId's in stem_change_patterns.
function validateStemChangePatterns() {
  for (const [pattern_id, rules] of Object.entries(stem_change_patterns)) {
    const allowed_rule_ids = new Set(rules.allowed_transforms)
    // validate gerund_rule
    if (rules.gerund_rule && !allowed_rule_ids.has(rules.gerund_rule)) {
      throw new Error(
        `stem_change_patterns.${pattern_id}: gerund_rule=${rules.gerund_rule} not in transforms`
      )
    }
    // validate tiempos / personas
    for (const mood_tense of mood_tenses) {
      const stem_changes = rules[mood_tense]
      if (stem_changes) {
        for (const person in stem_changes) {
          const rule_id = stem_changes[<GrammaticalPerson>person]
          if (rule_id == null) continue
          if (!allowed_rule_ids.has(rule_id)) {
            throw new Error(
              `stem_change_patterns.${pattern_id}.${mood_tense}.${person}: rule ${rule_id} not in transforms`
            )
          }
          if (!stem_change_descriptions[rule_id]) {
            throw new Error(
              `stem_change_patterns.${pattern_id}.${mood_tense}.${person}: unknown rule ${rule_id}`
            )
          }
        }
      }
    }
  }
}


// Call it immediately to find any errors.
// Según ChatGPT: Código al nivel superior del módulo = constructor del módulo, y we ejecuta una vez y queda cacheado.
validateStemChangePatterns()

console.log("Just ran validateStemChangePatterns() !!!!!!!!!!!!!!!!!!!!!!!")
