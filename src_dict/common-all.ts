// The dictionary clearly separates system structure from linguistic content. 
// The system structure describes how data is organized and connected; for this reason, 
// its fields use English, which is the standard language of programming and 
// ensures long-term consistency and interoperability.
//
// Linguistic content describes how a word works inside a specific language. 
// These fields must be written in the language being described, so that native speakers, 
// teachers, and tutors can maintain entries without needing technical knowledge or English terminology.
//
// When a local concept needs to connect to the global system, global identifiers in English are used, 
// together with a local mapping in the dictionary’s language. This keeps the data easy for 
// humans to edit while remaining clear and reliable for computers.


// System Structure (independent of any target language)

// Language following IETF BCP-47 codes.
export type Language = "en" | "es" | "fr" | "jp" | "pt"
export type DeadLanguage = "Latin" | "Middle English" | "Old English"
export type OriginLanguage = Language | DeadLanguage
export type Country = "AR" | "BO" | "CL" | "CR" | "CU" | "DR" | "EC" | "ES" | "GT" | "HN" | "MX" | "NI" | "PA" | "PY" | "SV" | "US" | "UY" | "VE"
export type Region = "Am" | Country
type Register = "colloquial" | "informal" | "neutral" | "formal" |  "literary" | "technical" | "vulgar"

// An ID for a lemma.
// Lemmas are independent of each other within a language.
// Lemma IDs are composed of the 2-letter ISO Language identifier followed by the lemma in that language.
// For example: "en.apple", "es.manzana", "ja.ringo"
// The lemma is given with a roman letter transciption when that is common in the language,
// so that maintenance is easier by people who don't speak that language.
// Notice that "ja.ringo" is prefered over "ja.林檎"
export type LemmaID = string;
// An ID for a particular meaning/use of a lemma (e.g., "en.apple.2", "es.manzana.1")
// This is composed of a LemmaID + PartOfSpeech + a concept/meaning ID
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



// Si una definición necesita palabras más difíciles que la palabra definida, el nivel está mal asignado.



export type SemanticDomain = "anatomy" | "animal" | "building" | "clothing" | "emotion" |  "event" | "food" | "fruit" | "household" | "idea" |  "mineral" | "nature" | "object" | "person" | "place" |  "plant" | "role" | "technology" | "time" | "tool" |  "tree" | "vegetable"

export const domain_ids : Record<SemanticDomain, null> = {
  anatomy: null,
  animal: null,
  building: null,
  clothing: null,
  emotion: null,
  event: null,
  food: null,
  fruit: null,
  household: null,
  idea: null,
  mineral: null,
  nature: null,
  object: null,
  person: null,
  place: null,
  plant: null,
  role: null, // of a person
  technology: null,
  time: null,
  tool: null,
  tree: null,
  vegetable: null,
}


// All of the entries, across languages, that correspond to a certain concept.
//  cross-linguistic mapping between lemmas
export interface ConceptsToLemmas {
  // Unique and stable concept identifier (e.g., "apple-fruit")
  id: string

  // Human-friendly short description to help maintainers preserve the integrity of this set of lemmas.
  // This is not the definition.
  description?: string

  // Map of languages to the lemma that express this concept.
  entries: Record<Language, LemmaConceptID[]>
}

interface CommonMistake {
  wrong: DescriptionText
  explanation: DescriptionText
}


interface MaintenanceHistory {
  // Name of who or what was responsible for the modification.
  // This would be a person's email address, the URL of a web resource, or the name and version of an AI.
  source: string
  // Date in UTC, in form of yyyy-mm-dd
  date: string
}


// Audio
// - Empieza con GitHub
// - Usa audio corto en .ogg
// - Estructura clara por idioma y lema
// - Migra a Cloudflare Pages cuando crezca

// How fast this speech is compared to normal naturally spoken speech.
// 1 means normal, 0.9 means 90% of normal (a little slower), 1.1 means a little faster.
// Most speech is probably between 0.7 and 1.3.
type SpeechSpeed = number

interface AudioPronunciation {
  // URL or relative path to the audio file
  src: string
  // Optional region or accent
  region?: Region
  speed: SpeechSpeed
  // Optional speaker info
  speaker?: string
  // License identifier (e.g. "CC-BY-SA-4.0")
  license: string
}


interface Lemma {
  // Unique identifier for this sense.
  id: LemmaID   // e.g "es.manzana",
  lang: Language
  // Lemma as written in citation form.
  lemma: string
  // The next ID to be assigned to a new sense/meaning for this lemma.
  next_sense_id: number
  // A list of the IDs of the senses of this lemma.
  // Note that all of these must start with the LemmaID given in the 'id' field.
  senses: LemmaConceptID[]
  // There are cases in which a single lemma actually is two separate words, 
  // which is indicated when the concepts: 
  // - don't share origin
  // - don't share intuitive meaning
  // - don't support learning the other group(s)
  // This is a rare case, and shouldn't be used if there aren't homonyms within this lemma.
  homonym_group_count?: number
  // Optional metadata to help maintainers
  history?: MaintenanceHistory
}

interface ExampleSentence {
  // The example showing the word used in a clarifying context.
  text: DescriptionText
  // Optional field for translators
  translation_hint?: string
}

interface Etymology {
    origin: OriginLanguage
    notes?: string[]
}

interface LemmaConcept {
  // Unique identifier for this lemma with this sense/meaning.
  // e.g "es.manzana.1",
  id: LemmaConceptID 
  lemma: DescriptionText
  // part of speech
  // In rare instances a single word and meaning may be used in more than one way.
  pos: PartOfSpeech
  // Human-readable definition in Spanish.
  // This is what is presented to users as the definition.
  definition: DescriptionText
  // The id of the homonym group within the containint lemma to which this belongs.
  // This is a rare case, and shouldn't be used if there aren't homonyms.
  homonym_group_id?: number
  // Proficiency level for this sense
  level: ProficiencyLevel
  frequency: UsageFrequency
  register: Register
  // An ID that refers to a specific image that shows what this concept is.
  image_id?: string
  // Example sentences
  examples?: ExampleSentence[],
  common_mistakes?: CommonMistake[]
  // Etymology is optional but useful
  etymology?: Etymology
  // Semantic domain tags (free-form, helps with cross-lingual alignment)
  semantic_domains?: SemanticDomain[]
  // Closely related senses, perhaps with different lemmas.
  related_senses?: LemmaConceptID[]
  // Equivalent words in other languages.
  translations?: LemmaConceptID[]
    // Fixed expressions related to this sense
  fixed_expressions?: FixedExpression[]
  // Common words used with this sense
  collocations?: Collocations
  // Optional metadata to help maintainers
  history?: MaintenanceHistory
}


// Proficiency level required to understand and use this sense.
// Higher levels mean more abstract, less frequent, or more specialized usage.
//
// Levels are internal and numeric for computation.
export type ProficiencyLevel =
  | 0 // elemental: immediately perceptible, learned very early
  | 1 // basic: everyday life, very common
  | 2 // basic+: common but needs context
  | 3 // intermediate: abstract or figurative
  | 4 // intermediate+: precise or formal usage
  | 5 // advanced: abstract, literary, or academic
  | 6 // specialized: technical or professional
  | 7 // rare: erudite, archaic, or very uncommon

// Mapping from internal levels to human-friendly UI labels
export const proficiencyLabelMap: Record<ProficiencyLevel, string> = {
  0: "basic",
  1: "everyday",
  2: "common",
  3: "abstract", // intermediate: abstract or figurative
  4: "precise", // intermediate: precise or formal
  5: "advanced",
  6: "specialized",
  7: "rare"
}

type AudioID = string

interface Audio {
  region?: Region
  audio_id: AudioID
}
// A definition or description that can be presented to a user.
// Must use language appropriate within the ProficiencyLevel of what is being described.
interface DescriptionText {
  text: string
  voicing?: Audio[]
}

// Fixed expressions related to this sense.
// These are complete expressions with their own meaning.
export interface FixedExpression {
  // The expression as written.
  text: DescriptionText
  level: ProficiencyLevel
  // Type of expression.
  // idiom: meaning not literal
  // collocation: semi-fixed phrase
  // proverb: complete saying
  kind: "idiom" | "locution" | "proverb"
  // Definition or meaning.
  meaning: DescriptionText
  examples?: DescriptionText[]
}

type LemmaPossiblyUnkownConceptID = LemmaID | LemmaConceptID

// Words frequently used together with this sense.
// This should have a complete LemmaConceptID, but if that is too difficult, a LemmaID is still helpful.
export interface Collocations {
  adjectives?: LemmaPossiblyUnkownConceptID[]
  adverbs?: LemmaPossiblyUnkownConceptID[]
  nouns?: LemmaPossiblyUnkownConceptID[]
  verbs?: LemmaPossiblyUnkownConceptID[]
}



