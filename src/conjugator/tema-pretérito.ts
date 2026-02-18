// Objetivo del módulo
//   Seleccionar un tema de pretérito no regular cuando exista.
// 1. Condición de activación
//   - si existe tema_pretérito
//   Nada más.
// 2. Dominio de aplicación
//   Usar tema_pretérito para:
//   - Pretérito indefinido (todas las personas)
//     Parece que la forma de "vos" nunca difiere de la de "tú"
//   - Subjuntivo imperfecto (-ra, -se)
//   - Subjuntivo futuro (si lo generas)
// 3. Base de aplicación
//   Este tema de reglas.tema_pretérito:
//   - reemplaza completamente el tema regular
//   - no se combina con alternancias vocálicas
//   - no se modifica aquí
// 4. Terminaciones
//   Este módulo no decide terminaciones.
//   El motor debe:
//   - detectar que el tema es de pretérito fuerte
//   - usar el paradigma fuerte correspondiente (-e, -iste, -o, -eron, etc.)
//   (No pongas terminaciones aquí.)
// 5. Exclusiones duras
//   No aplicar nunca a:
//   - presente (indicativo / subjuntivo)
//   - imperfecto de indicativo
//   - futuro
//   - condicional
//   - imperativo
//   - infinitivo
//   - participio
//   - gerundio
// 6. Interacción con otros módulos
//   Orden obligatorio:
//   - ¿supletivo? → salir
//   - ¿tema_pretérito? → usarlo
//   - Si no, usar tema regular
//   Nunca después de:
//   - alternancia_vocálica
//   - tema_presente_yo
//   - tema_futuro

import { TenseMood, VerbConjugationStems, VerbConjugationSuffixes } from ".";
import { setStem } from "./lib.js";
import { ConjugationAndDerivationRules } from "./resolve-conjugation-class.js";


const domains: TenseMood[] = ["IndPret", "SubImp", "SubFut"]


export function getTemaPretérito(conj_and_deriv_rules: ConjugationAndDerivationRules, tense_mood: TenseMood) : VerbConjugationStems | undefined {
    const tema_pretérito = conj_and_deriv_rules.morphological_rules?.tema_pretérito
    if (tema_pretérito && domains.includes(tense_mood)) {
        const temas = setStem(tema_pretérito)
        return temas
    }
}


export function getSuffixesForStrongPretérito(conj_and_deriv_rules: ConjugationAndDerivationRules, tense_mood: TenseMood) : VerbConjugationSuffixes | undefined {
    const tema_pretérito = conj_and_deriv_rules?.morphological_rules?.tema_pretérito
    if (tense_mood === "IndPret" && tema_pretérito) {
        const p3_form = tema_pretérito.endsWith("j") ? "eron" : "ieron"
        const suffixes: VerbConjugationSuffixes = {s1: ["e"], s2: ["iste"], s3: ["o"], p1: ["imos"], p2: ["isteis"], p3: [p3_form]}
        return suffixes
    }
}


