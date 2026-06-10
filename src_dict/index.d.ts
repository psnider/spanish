// Language following IETF BCP-47 codes.
 export type Language = "en" | "es" | "fr" | "jp" | "pt"
 export type DeadLanguage = "Latin" | "Middle English" | "Old English"
 export type OriginLanguage = Language | DeadLanguage
 export type Country = "AR" | "BO" | "CL" | "CR" | "CU" | "DR" | "EC" | "ES" | "GT" | "HN" | "MX" | "NI" | "PA" | "PY" | "SV" | "US" | "UY" | "VE"
 export type Region = "Am." | Country

// An ID for a lemma.
// Lemmas are independent of each other within a language.
// Lemma IDs are composed of the 2-letter ISO Language identifier followed by the lemma in that language.
// For example: "en.apple", "es.manzana", "ja.ringo"
// The lemma is given with a roman letter transciption when that is common in the language,
// so that maintenance is easier by people who don't speak that language.
// Notice that "ja.ringo" is prefered over "ja.林檎"
export type LemmaID = string;
// An ID for a particular meaning/use of a lemma (e.g., "en.apple.2", "es.manzana.1")
// This is composed of a LemmaID + a concept/meaning ID
export type LemmaConceptID = string;

// Valores en mayúsculas significan que la parte de oración es cierto o casí cierto.
// Palabras etiquadas con estos valores en mayúsculas vengan de tables.
export type PartOfSpeechCertain =
  // Estándar UD normalizado a 3 caracteres
  | "ADJ"   // adjective
  | "ADP"   // adposition (prepositions, postpositions)
  | "ADV"   // adverb
  | "AUX"   // auxiliary verb
  | "CON"   // coordinating conjunction (CCONJ)
  | "DET"   // determiner
  | "INT"   // interjection, some emojis (INTJ)
  | "NOU"   // common noun (NOUN)
  | "NUM"   // numeral
  | "PRT"   // particle (PART)
  | "PRN"   // pronoun (PRON)
  | "NAM"   // proper noun (PROPN)
  | "SUB"   // subordinating conjunction (SCONJ)
  | "SYM"   // symbol, emojis, hashtags, URLs, email addresses
  | "VRB"   // main verb (VERB)
  | "PNC"   // punctuation (PUNCT)
  | "UNK"   // other / foreign / unclassified (X)
  // Additional types added for simplification
  | "CTN"   // contraction
  | "ONO"   // onomatopeya


// Valores en minúsculas significan que la parte de oración está inferido.
// Palabras etiquadas con estos valores en mayúsculas vengan de tables.
export type PartOfSpeechInferred =
  | "adj"   // adjective
  | "adv"   // adverb
  | "int"   // interjection, some emojis (INTJ)
  | "nou"   // common noun (NOUN)
  | "nam"   // proper noun (PROPN)
  | "vrb"   // main verb (VERB)
  // Additional types added for simplification
  | "ctn"   // contraction
  | "ono"   // onomatopeya

// Universal Dependencies (UD) POS tag set (UPOS).
// Valores en mayúsculas significan que la parte de oración es cierto o casí cierto.
// Los en minúsculas significan que es una inferencia.
export type PartOfSpeech = PartOfSpeechCertain | PartOfSpeechInferred


// How often this word appears every 10000 words
export type UsageFrequency = number



export type UsageDifficulty = "daily" | "common" | "weekly" | "unusual"

