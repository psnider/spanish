import { VerbConjugation, VerbConjugationAnnotated, VerbConjugationRules, VerbTenseMood } from ".";
import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js";


export const irregular_conjugations: {[infinitive: string]: VerbConjugationRules} = {
    caber: {
        // similar a saber
        PresInd: {suffixes: {"1s": "quepo"}},
        // stem change cab => cup
        PastInd: {suffixes: {"1s": "cupe", "2s": "cupiste", "3s": "cupo",  "1p": "cupimos", "2p": "cupisteis", "3p": "cupieron"}},
    },
    caer: {
        PresInd: {suffixes: {"1s": "caigo"}},
        // There may be general rules that could be used, such as: 3-vowels
        PastInd: {suffixes: {"1s": "caí", "2s": "caíste", "3s": "cayó",  "1p": "caímos", "2p": "caísteis", "3p": "cayeron"}},
    },
    conducir: {
        // stem change conduc => "conduj"
        PastInd: {suffixes: {"1s": "conduje", "2s": "condujiste", "3s": "condujo",  "1p": "condujimos", "2p": "condujisteis", "3p": "condujeron"}},
    },
    dar: {
        PresInd: {suffixes: {"1s": "doy", "2p": "dais"}},
        PastInd: {suffixes: {"1s": "di", "2s": "diste", "3s": "dio",  "1p": "dimos", "2p": "disteis", "3p": "dieron"}},
    },
    decir: {
        PresInd: {suffixes: {"1s": "digo"}},
        PastInd: {suffixes: {"1s": "dije", "2s": "dijiste", "3s": "dijo",  "1p": "dijimos", "2p": "dijisteis", "3p": "dijeron"}},
    },
    erguir: {
        PresInd: {suffixes: {"1s": ["irgo", "yergo"], "2s": ["irgues", "yergues"], "3s": ["irgue", "yergue"], "1p": "erguimos", "2p": "erguís", "3p": ["irguen", "yerguen"]}},
        PastInd: {suffixes: {"1s": "erguí", "2s": "erguiste", "3s": "irguió",  "1p": "erguimos", "2p": "erguisteis", "3p": "irguieron"}},
    },
    estar: {
        // other than "1s", the only spelling difference is the accents
        PresInd: {suffixes: {"1s": "estoy", "2s": "estás", "3s": "está", "3p": "están"}},
        // stem change est => "estuv"
        PastInd: {suffixes: {"1s": "estuve", "2s": "estuviste", "3s": "estuvo",  "1p": "estuvimos", "2p": "estuvisteis", "3p": "estuvieron"}},
    },
    haber: {
        PresInd: {suffixes: {"1s": "he", "2s": "has", "3s": ["ha", "hay"],  "1p": "hemos", "2p": "habéis", "3p": "han"}},
        // stem change hab => "hub"
        PastInd: {suffixes: {"1s": "hube", "2s": "hubiste", "3s": "hubo",  "1p": "hubimos", "2p": "hubisteis", "3p": "hubieron"}},
    },
    hacer: {
        PresInd: {suffixes: {"1s": "hago"}},
        // "a:i"
        PastInd: {suffixes: {"1s": "hice", "2s": "hiciste", "3s": "hizo",  "1p": "hicimos", "2p": "hicisteis", "3p": "hicieron"}},
    },
    huir: {
        PresInd: {suffixes: {"1s": "huyo", "2s": "huyes", "3s": "huye",  "1p": "huimos", "2p": "huis", "3p": "huyen"}},
        PastInd: {suffixes: {"1s": "hui", "2s": "huiste", "3s": "huyó",  "1p": "huimos", "2p": "huisteis", "3p": "huyeron"}},
    },
    ir: {
        PresInd: {suffixes: {"1s": "voy", "2s": "vas", "3s": "va", "1p": "vamos", "2p": "vais", "3p": "van"}},
        PastInd: {suffixes: {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"}},
    },
    jugar: {
        PastInd: {suffixes: {"1s": "jugué", "2s": "jugaste", "3s": "jugó",  "1p": "jugamos", "2p": "jugasteis", "3p": "jugaron"}},
    },
    leer: {
        PastInd: {suffixes: {"2s": "leíste", "3s": "leyó", "1p": "leímos", "2p": "leísteis", "3p": "leyeron"}},
    },
    oír: {
        // FIX: can this be done with typographical rules?
        PresInd: {suffixes: {"1s": "oigo", "2s": "oyes", "3s": "oye", "1p": "oímos", "2p": "oís", "3p": "oyen"}},
        PastInd: {suffixes: {"1s": "oí", "2s": "oíste", "3s": "oyó",  "1p": "oímos", "2p": "oísteis", "3p": "oyeron"}},
    },
    poder: {
        // "o:u"
        PastInd: {suffixes: {"1s": "pude", "2s": "pudiste", "3s": "pudo",  "1p": "pudimos", "2p": "pudisteis", "3p": "pudieron"}},
    },
    poner: {
        PresInd: {suffixes: {"1s": "pongo"}},
        // stem change pon => pus
        PastInd: {suffixes: {"1s": "puse", "2s": "pusiste", "3s": "puso",  "1p": "pusimos", "2p": "pusisteis", "3p": "pusieron"}},
    },
    querer: {
        // stem change quer => quis
        PastInd: {suffixes: {"1s": "quise", "2s": "quisiste", "3s": "quiso",  "1p": "quisimos", "2p": "quisisteis", "3p": "quisieron"}},
    },
    saber: {
        // similar a caber
        PresInd: {suffixes: {"1s": "sé"}},
        // stem change sab => sup
        PastInd: {suffixes: {"1s": "supe", "2s": "supiste", "3s": "supo",  "1p": "supimos", "2p": "supisteis", "3p": "supieron"}},
    },
    salir: {
        PresInd: {suffixes: {"1s": "salgo"}},
    },
    seguir: {
        PresInd: {suffixes: {"1s": "sigo"}},
    },
    ser: {
        PresInd: {suffixes: {"1s": "soy", "2s": "eres", "3s": "es", "1p": "somos", "2p": "sois", "3p": "son"}},
        PastInd: {suffixes: {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"}},
    },
    tener: {
        PresInd: {suffixes: {"1s": "tengo"}},
        // stem change ten => tuv
        PastInd: {suffixes: {"1s": "tuve", "2s": "tuviste", "3s": "tuvo",  "1p": "tuvimos", "2p": "tuvisteis", "3p": "tuvieron"}},
    },
    traer: {  // similar to "caer"
        PresInd: {suffixes: {"1s": "traigo"}},
        // There may be general rules that could be used, such as: 3-vowels
        PastInd: {suffixes: {"1s": "traje", "2s": "trajiste", "3s": "trajo",  "1p": "trajimos", "2p": "trajisteis", "3p": "trajeron"}},
    },
    vaciar: {
        // The accent is the only thing different from the regular forms
        PresInd: {
            suffixes: {"1s": "vacío", "2s": "vacías", "3s": "vacía", "3p": "vacían"},
            // change_accents: {"2p": "á:a"},  // TODO: this probably does not belong in this table
        },
        PastInd: {
            suffixes: null,
            // change_accents: {"1s": "é:e", "3s": "ó:o"}
        },
    },
    venir: {
        PresInd: {suffixes: {"1s": "vengo"}},
        PastInd: {suffixes: {"1s": "vine", "2s": "viniste", "3s": "vino",  "1p": "vinimos", "2p": "vinisteis"}},
    },
    ver: {
        // 2s => accent dropped
        PresInd: {suffixes: {"1s": "veo", "2p": "veis"}},
        // accents dropped
        PastInd: {suffixes: {"1s": "vi", "3s": "vio"}},
    },
}

// This is only called if the infinitive differs from the conjugation_rules?.irregular?.base infinitive


// @return The conjugated forms for this irregular verb that differ from the regular forms.
//  If there are no forms to replace the regular forms, then an empty object is returned.
export function applyIrregularConjugationRules(infinitive: string, tense_mood: VerbTenseMood, regular_conjugation: VerbConjugation) : VerbConjugation {
    function applyDerivedChanges(irregular_base_conjugated: VerbConjugation["1s"]) : string {
        let conjugation_rules = verb_conjugation_rules[infinitive]
        if (Array.isArray(irregular_base_conjugated)) {
            throw new Error(`require single form for infinitive=${infinitive} tense_mood=${tense_mood} irregular_base_conjugated=${irregular_base_conjugated}`)
        }
        let irregular_derived_conjugated: string
        if (conjugation_rules.irregular.remove) {
            if (!irregular_base_conjugated.startsWith(conjugation_rules.irregular.remove)) {
                throw new Error (`irregular_base_conjugated=${irregular_base_conjugated} from infinitive=${infinitive} doesn't start with irregular_rules.irregular.remove=${conjugation_rules.irregular.remove}"`)
            }
            irregular_derived_conjugated = irregular_base_conjugated.slice(conjugation_rules.irregular.remove.length)
        }
        if (conjugation_rules.irregular.add) {
            irregular_derived_conjugated = conjugation_rules.irregular.add + irregular_derived_conjugated
        }
        return irregular_derived_conjugated
    }
    let conjugation_rules = verb_conjugation_rules[infinitive]
    const irregular_base_infinitive = conjugation_rules?.irregular?.base
    if (irregular_base_infinitive) {
        const irregular_base_conjugation = irregular_conjugations[irregular_base_infinitive]?.[tense_mood]?.suffixes
        let conjugation_w_prefix: {[conjugation_key: string]: VerbConjugation["1s"]} = {}
        Object.keys(regular_conjugation).forEach((key: keyof VerbConjugation) => {
            let regular_conjugated = regular_conjugation[key]
            let irregular_base_conjugated = irregular_base_conjugation?.[key]
            // multiple conjugated forms disallowed for derived verbs
            let conjugated_form: VerbConjugation["1s"]
            if (irregular_base_conjugated) {
                if (infinitive !== irregular_base_infinitive) {
                    conjugated_form = applyDerivedChanges(irregular_base_conjugated)
                } else {
                    conjugated_form = irregular_base_conjugated
                }
            } else {
                conjugated_form = regular_conjugated
            }
            conjugation_w_prefix[key] = conjugated_form
        })
        return conjugation_w_prefix
    }
}

