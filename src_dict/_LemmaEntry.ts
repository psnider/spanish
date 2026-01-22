import { LemmaID, LemmaConceptID, Language,PartOfSpeech, OriginLanguage, SemanticDomain, UsageFrequency } from "."
import {Sustantivo} from "../src/sustantivos"

interface MaintenanceHistory {
  // Name of who or what was responsible for the modification.
  // This would be a person's email address, the URL of a web resource, or the name and version of an AI.
  source: string
  // Date in UTC, in form of yyyy-mm-dd
  date: string
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
  // Optional metadata to help maintainers
  history?: MaintenanceHistory
}

interface ExampleSentence {
  // The example showing the word used in a clarifying context.
  text: string
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
  // part of speech
  // In rare instances a single word and meaning may be used in more than one way.
  pos: PartOfSpeech | PartOfSpeech[]
  // Human-readable definition in Spanish.
  // This is what is presented to users as the definition
  definition: string
  frequency: UsageFrequency
  difficulty: UsageDifficulty
  // An ID that refers to a specific image that shows what this concept is.
  image_id?: string
  // Example sentences
  examples?: ExampleSentence[],
  // Etymology is optional but useful
  etymology?: Etymology
  // Semantic domain tags (free-form, helps with cross-lingual alignment)
  semantic_domains?: SemanticDomain[]
  // Closely related senses, perhaps with different lemmas.
  related_senses?: LemmaConceptID[]
  // Equivalent words in other languages.
  translations?: LemmaConceptID[]
  // Optional metadata to help maintainers
  history?: MaintenanceHistory
}


