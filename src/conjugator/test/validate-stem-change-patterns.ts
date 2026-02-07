import { stem_change_descriptions, stem_change_patterns } from "../stem-changes.js"


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
    for (const [tense_mood, persons] of Object.entries(rules)) {
      if (tense_mood === "transforms" || tense_mood === "gerund_rule") continue
      for (const [person, rule_id] of Object.entries(persons ?? {})) {
        if (rule_id == null) continue
        if (!allowed_rule_ids.has(<string> rule_id)) {
          throw new Error(
            `stem_change_patterns.${pattern_id}.${tense_mood}.${person}: rule ${rule_id} not in transforms`
          )
        }

        if (!stem_change_descriptions[<string> rule_id]) {
          throw new Error(
            `stem_change_patterns.${pattern_id}.${tense_mood}.${person}: unknown rule ${rule_id}`
          )
        }
      }
    }
  }
}

// Call it immediately to find any errors.
// Según ChatGPT: Código al nivel superior del módulo = constructor del módulo, y we ejecuta una vez y queda cacheado.
validateStemChangePatterns()

console.log("Just ran validateStemChangePatterns() !!!!!!!!!!!!!!!!!!!!!!!")