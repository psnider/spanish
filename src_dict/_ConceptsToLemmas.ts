import {Language, LemmaConceptID} from "."



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
