# spanish

## conjugator

### Overview

A spanish verb conjugator, that conjugates according to rules, rather than look-up tables.  
Given a verb infinitive, and a tense-and-mood, the conjugator determines the transforms required to generate the conjugated forms of the verb.  
The conjugated forms include each of the six common forms, which are the permutations of (1st,2nd,3rd-person * singular, plural).

For example:  
```typescript
 conjugateVerb("venir", "PresInd")
```
returns:  
```json
{"1s": "vengo", "2s": "vienes", "3s": "viene", "1p": "venimos", "2p": "venís", "3p": "vienen"}
```


The process starts with the conjugation for a regular verb.
It then finds applicable transforms, and applies them in order, changing or replacing the collected congugated forms. 
Each transform is in its own module.

The transforms are performed in this order:  
- Get the suffixes for the regular verb family.  
  See: [getRegularSuffixes()](./src/conjugator/regular-verb-rules.ts)  
- Apply any spelling changes for the verb stem (verb root).  
  Stem changes are not considered to be irregular.  
  See: [getStemChanges()](./src/conjugator/stem-change-patterns.ts)  
- Combine the verb stem forms with the suffixes.  
  This results in the most common conjugated forms.  

The remaining steps only affect those forms that are not correct yet.  
- If the verb is irregular, apply the corresponding changes.  
  For example, the **PresInd** conjugation of "dar" is irregular, but only for the "1s" and "2p" forms.  
  See: [getIrregularConjugations()](./src/conjugator/irregular-conjugations.ts)  
  The most common irregular verbs are all handled.  
- Apply any rules for additional typographical (spelling) changes.  
  Determines if the resulting conjugated forms contain any invalid spelling, and corrects them.
  See: applyTypographicalChangeRules()  
- Apply any rules for accent changes.  
  Determines if the resulting conjugated forms contain any invalid accents, and corrects them.
  See: applyTypographicalChangeRules()  


There is also a list of the verbs that have been verified to conjugate correctly with this method.  
The list contains the most common verbs, as well as some that are less common but that are similar to other irregular verbs.  
See: [verb_conjugation_rules](./src/conjugator/conjugation-rules-per-verb.ts)  


### Usage

The main function is:
```typescript
function conjugateVerb(infinitive: string, mood_tense: VerbTenseMood): VerbConjugation
```

You can find the types in [index.d.ts](./src/conjugator/index.d.ts).

You can find usage examples in the test file: [test.ts](./src/conjugator/test.ts)


# Conjugation forms 

#### Indicativo
form | examples | common code | NLP coding  
-----|-------------|-----|-----------
indicativo presente     | amo, tengo          | PresInd | Mood=Ind,Tense=Pres
indicativo imperfecto   | amaba, tenía        | PastImp  | Mood=Ind,Tense=Imp
indicativo pretérito    | amé, tuve           | PastInd | Mood=Ind,Tense=Past
indicativo futuro       | amaré, tendré       | FutInd  | Mood=Ind,Tense=Fut
indicativo condicional  | amaría, tendría     | CndInd  | Mood=Cnd
pretérito perfecto      | he amado, he tenido | PresPerf | Mood=Ind,Tense=Pres of haber + Tense=Past,VerbForm=Part
pluscuamperfecto        | había amado, había tenido | PastPerf | Mood=Ind,Tense=Imp of haber + Tense=Past,VerbForm=Part
subjuntivo presente     | ame, tenga          | PresSub | Mood=Sub,Tense=Pres
imperativo afirmativo   | ama, ten            | Cmd | Mood=Imp
imperativo negativo     | no ames, no tengas  | Cmd | Mood=Imp







