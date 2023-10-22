# spanish

## conjugator

### Overview

A spanish verb conjugator, that conjugates according to rules, rather than look-up tables.

This contains several major components, all contained in the file [conjugation-rules.ts](./src/conjugator/conjugation-rules.ts):
- rules for conjugating regular verbs  
  See: regular_verb_suffixes
- rules for spelling changes to verb stems (verb roots)  
  Stem changes are not considered to be irregular.  
  See: stem_change_patterns
- rules for typographical (spelling) changes  
  I'm sure there are more rules.  
  If you find any more, please file an issue.  
  See: typographical_change_rules
- rules for conjugating irregular verbs  
  I believe this contains all of the most common irregular verbs.
  See: irregular_conjugations
- verbs that have conjugated correctly using   these rules  
  This lists the verbs I have come across most often.  
  But I have also included some that are less common, when they are similar to other irregular verbs. 
  See: verb_conjugation_types

If you are interested in the rules, please view the [conjugation-rules.ts](./src/conjugator/conjugation-rules.ts) file, and search for the element named after "See:" above.

### Usage

The main function is:
```typescript
function conjugateVerb(infinitive: string, mood_tense: VerbMoodTense): VerbConjugation
```

You can find the types in [index.d.ts](./src/conjugator/index.d.ts).

You can find usage examples in the test file: [test.ts](./src/conjugator/test.ts)