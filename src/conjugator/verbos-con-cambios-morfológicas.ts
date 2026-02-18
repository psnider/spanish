import { GrammaticalPerson, StemChangeRuleId, TenseMood, TenseMoodMap, VerbConjugation, VerbConjugationAnnotation, VerbConjugationChanges, VerbConjugationSuffixes, VerbForms } from "."
import { VerbAspectModifications, VerbAspectRules } from "./regular-verb-rules"


// 1. Qué significa “una familia que merece existir”
// Una familia morfológica merece existir como entidad propia si cumple al menos dos de estos criterios fuertes (y idealmente tres):
// Criterio A — Productividad
// ¿Puedo crear verbos nuevos (o poco comunes) que sigan el mismo patrón sin sorprender a un hablante?
// Ejemplo claro:
// contar → descontar, reencontrar, malcontar, recontra-contar
// todos aceptan o:ue sin pensarlo
// Si la respuesta es “sí, naturalmente”, hay familia.
// Criterio B — Estabilidad semántica
// ¿El significado del verbo derivado sigue conectado al verbo base?
// contar → descontar → recontar → incontable
// ✔️ misma noción semántica
// acordar → recordar → concordar → discordar
// ✔️ misma raíz conceptual (cor, cordis)
// Si la semántica se rompe, la familia se rompe.
// Criterio C — Regularidad morfofonológica
// ¿El cambio de raíz ocurre exactamente en los mismos contextos?
// Ejemplo:
// e:ie solo en sílaba tónica
// o:ue idem
// nunca en infinitivo, gerundio, imperfecto
// Si hay “sí, pero…” constantes → no es buena familia.
// Criterio D (débil pero útil) — Tamaño mínimo
// Una familia con 1–2 verbos es sospechosa.
// Con 4–5 o más, ya empieza a justificar existencia.


// 2. Familias que claramente justifican existir
// Estas son prácticamente indiscutibles.
// 🟢 Familia e:ie tipo pensar
// Ejemplos:
// pensar
// cerrar
// empezar
// perder
// entender
// defender
// sentir
// mentir
// ✔️ productiva
// ✔️ estable
// ✔️ regular
// ✔️ enorme
// 👉 Esta familia no debe modelarse verbo por verbo.

// 🟢 Familia o:ue tipo contar
// Ejemplos:
// contar
// volver
// poder
// dormir
// encontrar
// mostrar
// recordar
// volar
// Idem. Familia canónica.
// 🟢 Familia e:i tipo pedir
// Ejemplos:
// pedir
// servir
// repetir
// medir
// corregir
// Muy consistente, muy reconocible.
// 🟢 Familia -uir tipo huir
// Ejemplos:
// huir
// construir
// destruir
// influir
// sustituir
// Aquí el cambio es distinto (yod epentética), pero:
// ✔️ absolutamente productiva
// ✔️ muy regular


// 3. Familias que NO merecen existir (o solo como excepción)
// 🔴 “Familias” de 1 verbo
// Ejemplos:
// decir
// hacer
// ir
// ser
// haber
// Estos no son familias, son lexemas nucleares.


// Familias con semántica rota
// Ejemplo clásico:
// acordar (o:ue)
// encordar (NO o:ue)
// Misma forma superficial, otra raíz semántica.
// 👉 Aquí la familia es léxica, no ortográfica.


// 4. Zona gris (la parte interesante)
// Aquí es donde hay que decidir con bisturí.
// 🟡 familia -cordar
// acordar
// concordar
// discordar
// recordar
// ✔️ semántica clara
// ✔️ patrón estable
// ❌ poco productiva hoy
// 👉 Sí merece existir, pero:
// como familia cerrada
// no como regla productiva abierta
// 🟡 familia -tener
// tener
// mantener
// obtener
// contener
// detener
// retener
// Esto es perfecto ejemplo de:
// familia morfológica no productiva pero sistemática
// 👉 Aquí herencia explícita es ideal.
// 🟡 familia -poner
// poner
// componer
// proponer
// disponer
// suponer
// Idem.
// 5. Regla de oro (muy importante)
// Una familia no es un regex.
// Si una familia solo se puede definir como:
// “verbos que acaban en X”
// pero no puedes explicar su semántica, entonces:
// ❌ NO es familia
// ✔️ es coincidencia ortográfica
// Tu regex de e:ie es útil como heurística, pero no como verdad.



// Familia: tener
// Se define por tres rasgos que siempre viajan juntos:
//  - IndPres fuerte en -g- (yo)
//  - IndPret fuerte en -uv- / -uv-
//  - IndFut, IndCond con raíz reducida
// Miembros legítimos de la familia
// - Núcleo
// - tener
// - venir
// - Derivados productivos (prefijación)
// - mantener
// - obtener
// - contener
// - detener
// - retener
// - sostener
// - intervenir
// - prevenir
// - convenir
// Excepciones:
// - entender ❌ (solo e:ie)
// - atender ❌
// - pretender ❌
// - defender ❌

//======================
// Regla arquitectónica nueva (muy importante)
// Un verbo puede ser:
// regular
// regular + stem-change
// irregular núcleo
// irregular núcleo + stem-change
// Y tener / venir caen en la última.

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// reglas de partes de la conjugación
// 1) «yo irregular en -g»
//    Una irregularidad solo en la 1.ª persona del singular del presente de indicativo.
//    Es aislada: no afecta a las demás personas.
//    No implica nada sobre otros tiempos.
//    La forma de yo añade una -g (a veces como parte de -ig, -ng, -lg, etc.).
//    Ejemplos
//    tener → tengo
//    venir → vengo
//    poner → pongo
//    salir → salgo
//    decir → digo
//    traer → traigo
//    valer → valgo
// 2) «pretérito fuerte»
//     El pretérito indefinido no se construye a partir del tema regular (-é / -í), sino de un tema especial.
//     Ejemplos
//       tener → tuv- (tuve, tuvo…)
//       venir → vin-
//       poner → pus-
//       decir → dij-
//       traer → traj-
//       caber → cup-
//     Propiedades típicas
//     Vocal temática -e- / -i-, no -é / -í
//     3.ª persona plural en -eron → dijeron, trajeron
//     A menudo sin tilde (tuve, no tuvé)
// 3) «futuro reducido» (también llamado futuro irregular)
//     El futuro y el condicional no usan el infinitivo completo, sino un tema reducido o modificado.
//     Ejemplos
//       tener → tendr-
//       venir → vendr-
//       poner → pondr-
//       salir → saldr-
//       decir → dir-
//       hacer → har-
//       caber → cabr-


export type InfinitiveClass = "-ar" | "-er" | "-ir"

// A family of verbs that conjugate the same depending on the termination.
// A preceding hyphen indicates that the form is not a verb itself.
export type VerboClaseConjugacional = "-acer" | "decir" | "-ducir" | "-eer" | "-iar" | "oír" | "poner" | "seguir" | "tener" | "traer" | "-uir"


// The model of conjugation.
// Note that some models are not verbs themselves, but are productive verb endings. These are marked with a leading hyphen.
export type ConjugationModel = InfinitiveClass | VerboClaseConjugacional
                    | "delinquir"
                    | "caber" | "caer" | "dar" | "erguir" | "estar"
                    | "haber" | "ir" | "jugar" | "poder"
                    | "querer" | "saber" | "salir" | "ser"
                    | "venir" | "ver"


// The rules for conjugating a single form of an irregular verb, such as: "IndPres", "IndImp"
export interface VerbAspectRulesWithFullyIrregularForms extends VerbAspectModifications {
    // morphology
    suffixes?: VerbConjugationChanges
    // suplication
    tema?: string
    forms?: VerbConjugation
    derivations?: {
        preserve_stress_from_base?: GrammaticalPerson[]
    }
}
                    
                    
// FIX: want to explain reason/origin/etemology for each change... this could help learners
export interface ReglasDeConjugaciónDeVerbo {
    clase_conjugacional?: VerboClaseConjugacional
    tema_presente_yo?: string | [string, string]
    sufijo_presente_yo?: string
    tema_pretérito?: string
    // tema especial del futuro / condicional
    tema_futuro?: string
    alternancia_vocálica?: StemChangeRuleId
    // Propiedades que no se generalizan bien, no productivos, no extrapolable.
    excepciones_lexicas?: {
        // irregulares como: "ir", "ser"
        supletivo?: true,
        participio?: string
        gerundio?: string
        // Solo para casos irregulares, sí para "poder", no para "dormir"
        gerundio_tema_cambio_excepcional?: StemChangeRuleId
        imperativo_tú?: string | VerbForms
        vos?: string
        // ideas que probablemente no sirve mucho...
        tema_subjuntivo_yo?: string
        // FIX: narrow this type for exceptions, e.g. disallow add_suffix_to_infinitive
        rules?: TenseMoodMap<VerbAspectRulesWithFullyIrregularForms>
    }
}


export const verbos_con_cambios_morfológicas : {[infinitive: string]: ReglasDeConjugaciónDeVerbo} = {
    acertar:  {alternancia_vocálica: "e:ie"},
    acordar:  {alternancia_vocálica: "o:ue"},
    acostar:  {alternancia_vocálica: "o:ue"},
    almorzar: {alternancia_vocálica: "o:ue"},
    andar:    {tema_pretérito: "anduv"},
    atender:  {alternancia_vocálica: "e:ie"},
    caer:     {tema_presente_yo: "caig"},
    caber: {
        tema_presente_yo: "quep",
        tema_pretérito: "cup",
        tema_futuro: "cabr",
    },
    conducir: {
        clase_conjugacional: "-ducir",
        tema_pretérito: "conduj",  // pretérito fuerte con -j
    },
    dar: {
        // FIX: linguist: unclear
        excepciones_lexicas: {
            rules: {
                // The default "-ar" verb pattern of accent the last sylable doesn't apply to vos forms of "dar", since "dás" is only one sylable
                IndPres: { suffixes: { s1: ["oy"],                                           p2: ["ais"],                       vos: null } },
                SubPres: { suffixes: { s1: ["é"],                s3: ["é"],                  p2: ["eis"] } },
                IndPret: { suffixes: { s1: ["i"], s2: ["iste"],  s3: ["io"],   p1: ["imos"], p2: ["isteis"], p3: ["ieron"] } },
                CmdPos:  { suffixes: {                           s3: ["é"],                                                     vos: null  } },
                CmdNeg:  { suffixes: {                           s3: ["é"],                  p2: ['eis']} },
            }
        }
    },
    decir: {
        clase_conjugacional: "decir", 
        tema_presente_yo: "dig",
        tema_pretérito: "dij",
        tema_futuro: "dir",
        alternancia_vocálica: "e:i",
        excepciones_lexicas: {
            participio: "dicho",
            gerundio: "diciendo",
            imperativo_tú: "di"
        }
    },
    defender: {alternancia_vocálica: "e:ie"},
    descender: {alternancia_vocálica: "e:ie"},
    dormir: {alternancia_vocálica: "o:ue"},
    elegir: {alternancia_vocálica: "e:i"},
    entender: {alternancia_vocálica: "e:ie"},
    erguir: {
        alternancia_vocálica: "e:ie",
        // tema_presente_yo: ["irg", "yerg"],
        tema_presente_yo: "yerg",
        excepciones_lexicas: {
            gerundio: "irguiendo",
        }
    },
    escribir: {
        excepciones_lexicas: {
            participio: "escrito",
        }
    },
    estar: {
        sufijo_presente_yo: "oy",
        tema_pretérito: "estuv", 
        excepciones_lexicas: {
            imperativo_tú: "está",
            rules: {
                IndPres: {suffixes: {           s2: ["ás"], s3: ["á"], p3: ["án"]}},
                SubPres: {suffixes: {s1: ["é"], s2: ["és"], s3: ["é"], p3: ["én"]}},
                CmdPos:  {suffixes: {                       s3: ["é"], p3: ["én"]}},
                CmdNeg:  {suffixes: {           s2: ["és"], s3: ["é"], p3: ["én"]}}
            }
        }
    },
    extender: {alternancia_vocálica: "e:ie"},
    guiar: {
        // TODO: hay formas reformadas en la reforma ortográfica de la RAE de 2010, considera añadir estas formas
        // irregular_base: "vaciar"
        clase_conjugacional: "-iar",
        // The accent is the only thing different from the regular forms
        excepciones_lexicas: {
            rules: {
                IndPres: {stress_last_char_of_s123p3_stem: true,
                          suffixes: {                       s3: ["á"],       p2: ["ais"],           vos: ["as"] }},
                IndPret: {suffixes: {s1: ["e"],             s3: ["o"] }},
                SubPres: {stress_last_char_of_s123p3_stem: true,
                          suffixes: {                                        p2: ["eis"] }},
                CmdPos:  {stress_last_char_of_s123p3_stem: true,
                          suffixes: {                                                               vos: ["a"] }},
                CmdNeg:  {stress_last_char_of_s123p3_stem: true,
                          suffixes: {                                        p2: ["eis"] }},
            }
        }
    },
    haber: {
        tema_pretérito: "hub",
        tema_futuro: "habr",
        excepciones_lexicas: {
            supletivo: true,
            imperativo_tú: ["habe", "he"],
            rules: {
                IndPres: { forms: { s1: ["he"], s2: ["has"], s3: ["hay", "ha"],     p1: ["hemos"],                     p3: ["han"],   vos: null} },
                SubPres: { tema: "hay" },
                CmdPos:  { tema: "hay",
                           forms: {                                                                  p2: ["habed"],                   vos: null} },
                CmdNeg:  { tema: "hay" },
            }
        }
    },
    hacer: {
        tema_presente_yo: "hag",
        tema_pretérito: "hic",
        tema_futuro: "har",
        excepciones_lexicas: {
            participio: "hecho",
            imperativo_tú: "haz",
            rules: {
                // FIX: linguist: should "hizo" be managed with sound preserving transformations?
                IndPret: { forms: {s3: ["hizo"]} }
            }
        }
    },
    huir: { // FIX: is this fully regular now?
        clase_conjugacional: "-uir",
        excepciones_lexicas: {
            rules: {
                IndPres: { suffixes: {p2: ["is"], vos: ["is"]}},
                IndPret: { suffixes: { s1: ["i"] } },
                CmdPos:  { suffixes: { vos: ["i"] } }
            },
        }
    },
    ir: {
        tema_pretérito: "fu",
        sufijo_presente_yo: "oy",
        excepciones_lexicas: {
            supletivo: true,
            participio: "ido",
            gerundio: "yendo",
            rules: {
                // The default "-ir" verb pattern of accent the last sylable doesn't apply to vos forms of "ir", since "ir" is only one sylable
                IndPres: { forms: { s1: ["voy"], s2: ["vas"],    s3: ["va"],   p1: ["vamos"],  p2: ["vais"],     p3: ["van"], vos: null } },
                SubPres: { tema: "vay" },
                IndPret: { forms: { s1: ["fui"], s2: ["fuiste"], s3: ["fue"],  p1: ["fuimos"], p2: ["fuisteis"], p3: ["fueron"] } },
                IndImp:  { forms: { s1: ["iba"], s2: ["ibas"],   s3: ["iba"],  p1: ["íbamos"], p2: ["ibais"],    p3: ["iban"] } },
                // IndFut: uses regular conjugation
                // IndCond: uses regular conjugation
                CmdPos:  { forms: {              s2: ["ve"],     s3: ["vaya"], p1: ["vayamos", "vamos"],         p3: ["vayan"], vos: ["andá"] } },
                // FIX: linguist: the relation of CmdNeg being derived from SubPres is a fixed rule, right? If so, I can move this into code...
                CmdNeg:  { tema: "vay" },
            }
        }
    },
    jugar: {
        // FIX: SubPres: vos spelling differs by region: vos: ["juegues", "*jugués"]
        alternancia_vocálica: "u:ue",
    },
    leer: {
        clase_conjugacional: "-eer", 
        // excepciones_lexicas: {
        //     gerundio: "leyendo",
        //     participio: "leído",
        //     // ¿hay una reglar para aplicar los cambios de los acentos?
        // }

    },
    oír: {
        // why is this a class?
        clase_conjugacional: "oír", 
        tema_presente_yo: "oig",
        excepciones_lexicas: {
            rules: {
                CmdPos:  { suffixes: {                                                      p2: ["íd"],          } },
            }
        }
    },
    pensar:  {alternancia_vocálica: "e:ie"},
    perder:  {alternancia_vocálica: "e:ie"},
    poder: {
        alternancia_vocálica: "o:ue",
        tema_pretérito: "pud",
        tema_futuro: "podr",
        excepciones_lexicas: {
            gerundio_tema_cambio_excepcional: "o:u",
            rules: {
                // "o:u"  FIX: use root
                // FIX: vos spelling differs by region: vos: ["puedas", "*podás"]
                // SubPres: { forms: { s1: ["pueda"], s2: ["puedas"], s3: ["pueda"],                                    p3: ["puedan"]} },
                // IndPret: { root: "pud",
                //         // FIX: linguist: This is the same pattern as in "haber", "hacer", "poner", "saber". Are there some rules that could apply here instead of a list?
                //         //                í:e                          ió:o
                //         forms: { s1: ["pude"],                s3: ["pudo"] } },
                // IndFut:  { root: "podr" },
                // IndCond: { root: "podr" }, 
                // CmdPos:  { forms: { s1: null, s2: ["puede"], s3: ["pueda"],                                        p3: ["puedan"], vos: ["podé"] } },
                // CmdNeg:  { parent_tense_mood: "SubPres" },
            }
        }
    },
    poner: {
        tema_presente_yo: "pong",
        tema_pretérito: "pus",
        tema_futuro: "pondr",
        excepciones_lexicas: {
            participio: "puesto",
            imperativo_tú: "pon",
            rules: {
                CmdPos:  { derivations: {preserve_stress_from_base: ["s2"] }},
            }
        }
    },
    pretender: {alternancia_vocálica: "e:ie"},
    querer: {
        tema_pretérito: "quis",
        tema_futuro: "querr",
        alternancia_vocálica: "e:ie",
    },
    reunir: {alternancia_vocálica: "u:ú"},
    saber: {
        tema_pretérito: "sup",
        tema_futuro: "sabr",
        excepciones_lexicas: {
            // ind_pres_yo: "sé",
            // tema_subjuntivo_yo: "sep",
            rules: {
                // similar a caber
                IndPres: { forms: { s1: ["sé"] } },
                SubPres: { tema: "sep" },
                // IndPret: { root: "sup",
                //            // FIX: linguist: This is the same pattern as in "haber","hacer","poder","poner". Are there some rules that could apply here instead of a list?
                //            //                í:e                         ió:o
                //            forms: { s1: ["supe"],                  s3: ["supo"] }
                //          },
                // IndFut:  { root: "sabr" },
                // IndCond: { root: "sabr" },
                CmdPos:  { forms: {                                s3: ["sepa"],  p1: ["sepamos"],                     p3: ["sepan"] } },
                CmdNeg:  { tema: "sep" },
            }
        }
    },
    salir: {
        tema_presente_yo: "salg",
        tema_futuro: "saldr",
        excepciones_lexicas: {
            imperativo_tú: "sal"
        }
    },
    seguir: {
        // NOTE: this does not conjugate as a "-uir" clase infinitive
        tema_presente_yo: "sig",
        alternancia_vocálica: "e:i",
        excepciones_lexicas: {
            tema_subjuntivo_yo: "sig"
        }
    },
    sentir:  {alternancia_vocálica: "e:ie"},
    ser: {
        excepciones_lexicas: {
            supletivo: true,
            rules: {
                IndPres: { forms: { s1: ["soy"], s2: ["eres"],   s3: ["es"],    p1: ["somos"],  p2: ["sois"],     p3: ["son"],    vos: ["sos"] } },
                IndImp:  { forms: { s1: ["era"], s2: ["eras"],   s3: ["era"],   p1: ["éramos"], p2: ["erais"],    p3: ["eran"]}},
                IndPret: { forms: { s1: ["fui"], s2: ["fuiste"], s3: ["fue"],   p1: ["fuimos"], p2: ["fuisteis"], p3: ["fueron"] } },
                SubPres: { tema: "se" },
                CmdPos:  { forms: {              s2: ["sé"],     s3: ["sea"],   p1: ["seamos"],                   p3: ["sean"],   vos: null} },
                CmdNeg:  { tema: "se" },
            }

        }
    },
    tender: {alternancia_vocálica: "e:ie"},
    tener: {
        clase_conjugacional: "tener", 
        tema_presente_yo: "teng",
        tema_pretérito: "tuv",
        tema_futuro: "tendr",
        alternancia_vocálica: "e:ie",
        excepciones_lexicas: {
            imperativo_tú: "ten",
            rules: {
                CmdPos:  { derivations: {preserve_stress_from_base: ["s2"] }},
            }
        }
    },
    traer: {
        tema_presente_yo: "traig",
        tema_pretérito: "traj",
        // excepciones_lexicas: {
        //     // puedo usar una regla de ortographia de hiato?
        //     participio: "traído",
        //     // puedo usar una regla de ortographia?
        //     gerundio: "trayendo"
        // }
    },
    vaciar: {
        // The accent is the only thing different from the regular forms.
        // Is this due to an orthographic rule? or something else?
        clase_conjugacional: "-iar",
        // The accent is the only thing different from the regular forms
        excepciones_lexicas: {
            rules: {
                IndPres: {stress_last_char_of_s123p3_stem: true,
                          suffixes: {           s2: ["as"], s3: ["á"],       p2: ["áis"], p3: ["án"] }},
                SubPres: {stress_last_char_of_s123p3_stem: true},
                CmdPos:  {stress_last_char_of_s123p3_stem: true},
                CmdNeg:  {stress_last_char_of_s123p3_stem: true,
                          suffixes: {                                        vos: null }},
            }
        }
    },
    valer: {
        tema_presente_yo: "valg",
        tema_futuro: "valdr",
    },
    venir: {
        tema_presente_yo: "veng",
        tema_pretérito: "vin",
        tema_futuro: "vendr",
        alternancia_vocálica: "e:ie",
        excepciones_lexicas: {
            gerundio: "viniendo",
            imperativo_tú: "ven"
        }
    },
    ver: {
        // parece que no conforma bien a estas reglas
        // sí prefijo_ind_pres_yo cambia, pero no con "g", y no con los mismos cambios
        // no aplican ni tema_pretérito ni tema_futuro ni alternancia_vocálica
        // el resto con excepciones_lexicas
        excepciones_lexicas: {
            gerundio: "viendo",
            participio: "visto",
            // hay varias excepciones_lexicas que probablemente tienen que ver con el hecho que ver es solo una sílaba
            rules: {
                // p2 => accent dropped
                // The default "-er" verb pattern of accent the last sylable doesn't apply to vos forms of "ver", since "vés" is only one sylable
                IndPres: { suffixes: { s1: ["eo"],                                              p2: ["eis"],                        vos: null },
                           derivations: {preserve_stress_from_base: ["s2","s3","p2","p3"]}
                         },
                SubPres: { tema: "ve" },
                // accents dropped
                IndPret: { forms: { s1: ["vi"], s3: ["vio"] },
                           derivations: {preserve_stress_from_base: ["s1", "s3"]}
                        },
                IndImp: { tema: "ve" },
                CmdPos: { forms: {                      s3: ["vea"],           p1: ["veamos"],               p3: ["vean"],            vos: null },
                           derivations: {preserve_stress_from_base: ["s2"] }
                        },
                        // FIX: linguist: if CmdNeg always follows SubPres, can codify this
                CmdNeg: { tema: "ve" },
            }
        }
    },
    volar: {
        excepciones_lexicas: {
            participio: "vuelto",
        }
    }
}


// FIX: restore after refactoring complete
export function getAnnotations(infinitive: string, model: ConjugationModel, tense_mood: TenseMood) : VerbConjugationAnnotation {
    const annotations: VerbConjugationAnnotation = {model: undefined}
    // const unconfirmed = !(infinitive in morphophonemic_verb_conjugation_rules) || undefined
    // const annotations: VerbConjugationAnnotation = {model, tense_mood, unconfirmed}
    return annotations
}
