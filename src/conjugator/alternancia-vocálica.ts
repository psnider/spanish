// Objetivo del módulo
//   Aplicar una alternancia vocálica productiva al tema verbal base.
// 1. Condición de activación
//   - si existe alternancia_vocálica
//   Nada más.
// 2. Dominio de aplicación
//   Aplicar solo a:
//   - Presente indicativo: s2, s3, p3
//   - Presente subjuntivo: todas las personas
//   - Imperativo:
//     - tú
//     - usted / ustedes
//   (No aplicar a s1 si existe tema_presente_yo)
// 3. Base de aplicación
//   La alternancia se aplica sobre:
//   - tema_regular
//   Nunca sobre:
//   - tema_presente_yo
//   - tema_pretérito
//   - tema_futuro
// 4. Condición fonológica
//   Aplicar solo si:
//   - la vocal afectada está en sílaba tónica
//     (No intentes calcular acento aquí; el motor ya sabe qué sílaba es tónica.)
// 5. Tipos comunes de alternancia
//   Ejemplos de StemChangeRuleId: "e:ie", "o:ue", "e:i", "u:ue"
// 6. Exclusiones duras
//   No aplicar nunca a:
//   - imperfecto
//   - pretérito
//   - futuro
//   - condicional
//   - infinitivo
//   - participio
//   - gerundio
// 7. Orden de ejecución (crítico)
//   - Seleccionar tema (tema_presente_yo si corresponde)
//   - Si no hay tema_presente_yo, aplicar alternancia_vocálica
//   - Aplicar reglas ortográficas
//   - Añadir terminaciones


import { TenseMood, VerbConjugationStems, VerbForms } from ".";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";
import { applyStemChangePattern, getStemChangesFromRule, stem_change_descriptions } from "./stem-changes.js";


const domains: TenseMood[] = ["IndPres", "SubPres", "CmdPos", "CmdNeg"]

// function stub() {
    // if (alternancia_vocálica &&
    //     contexto ∈ dominio_presente &&
    //     !usa_tema_presente_yo &&
    //     vocal_en_sílaba_tónica) {
    //         aplicar_alternancia()
    // }
// }


export function getTemaConAlternanciaVocálica(conj_and_deriv_rules: ConjugationAndDerivationRules, tense_mood: TenseMood) : VerbConjugationStems {
    const changed_stems : VerbConjugationStems = {}
    if (domains.includes(tense_mood)) {
        const {conjugable_infinitive, verb_family, morphological_rules} = conj_and_deriv_rules
        const alternancia_vocálica = morphological_rules?.alternancia_vocálica
        if (alternancia_vocálica) {
            const stem_regular = conjugable_infinitive.slice(0, -2)
            const tema_presente_yo = morphological_rules?.tema_presente_yo
            const sufijo_presente_yo = morphological_rules?.sufijo_presente_yo
            const dont_apply_to_yo = (tense_mood === "IndPres") && (tema_presente_yo || sufijo_presente_yo)
            // FIX: linguist: vocal_en_sílaba_tónica is implied by the existance of alternancia_vocálica, which is manually applied to verbs in verbos_con_cambios_morfológicas[]
            const stem_changes_per_form = getStemChangesFromRule(tense_mood, alternancia_vocálica)
            for (const key in stem_changes_per_form) {
                const gramatical_person = key as keyof VerbConjugationStems
                const do_apply = (!dont_apply_to_yo || (gramatical_person !== "s1"))
                if (do_apply) {
                    const stem_change_rule = stem_changes_per_form?.[gramatical_person]
                    if (stem_change_rule) {
                        const rule_description = stem_change_descriptions[stem_change_rule]
                        if (!rule_description.only_for_ir_verbs || verb_family === "-ir") {
                            let changed = applyStemChangePattern(stem_regular, rule_description)
                            if (changed !== stem_regular) {
                                changed_stems[gramatical_person] = [changed]
                            }
                        }
                    }
                }
            }
        }
    }
    return changed_stems
}

