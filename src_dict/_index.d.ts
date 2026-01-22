// Language following IETF BCP-47 codes.
export type Language = "en" | "es" | "fr" | "jp" | "pt"
export type DeadLanguage = "Latin" | "Middle English" | "Old English"
export type OriginLanguage = Language | DeadLanguage
export type Country = "AR" | "BO" | "CL" | "CR" | "CU" | "DR" | "EC" | "ES" | "GT" | "HN" | "MX" | "NI" | "PA" | "PY" | "SV" | "US" | "UY" | "VE"
export type Region = "Am" | Country

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

// Universal Dependencies (UD) POS tag set (UPOS)
export type PartOfSpeech =
  | "ADJ"    // adjective
  | "ADP"    // adposition (prepositions, postpositions)
  | "ADV"    // adverb
  | "AUX"    // auxiliary verb
  | "CCONJ"  // coordinating conjunction
  | "DET"    // determiner
  | "INTJ"   // interjection, some emojis
  | "NOUN"   // common noun
  | "NUM"    // numeral
  | "PART"   // particle
  | "PRON"   // pronoun
  | "PROPN"  // proper noun
  | "SCONJ"  // subordinating conjunction
  | "SYM"    // symbol, emojis, hashtags, URLs, email addresses
  | "VERB"   // main verb
  | "X"      // other / foreign / unclassified
  | "PUNCT"; // punctuation (unusual for lexicons but part of UD)

// How often this word appears every 10000 words
type UsageFrequency = number



type UsageDifficulty = "daily" | "common" | "weekly" | "unusual"

