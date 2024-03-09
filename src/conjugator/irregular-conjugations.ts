import { IrregularBase, VerbConjugation, VerbConjugationRules, VerbTenseMood } from ".";
import { combineRegularSuffixesAndStemChanges } from "./conjugate-verb.js";
import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { getRegularSuffixes } from "./regular-verb-rules.js";


// The rules for conjugating a single form of a verb, such as: "PresInd", "PastImp"
interface VerbAspectConjugations {
    // The aspect from which this one is derived.
    parent_tense_mood?: VerbTenseMood
    // The conjugated forms.
    // If this is set, 'root' may not be set.
    forms?: VerbConjugation
    // If set, then this string replaces the root used in regular conjugation rules.
    // If this is set, 'forms' may not be set.
    root?: string
}


// Contains just those forms that differ from the regular forms.
export const irregular_conjugations: { [infinitive: string]: VerbConjugationRules<VerbAspectConjugations> } = {
    caber: {
        aspects: {
            // similar a saber
            PresInd: { forms: { "1s": "quepo" } },
            PresSub: { root: "quep" },
            // stem change cab => cup
            PastInd: { root: "cup",
                       forms: { "1s": "cupe",          "3s": "cupo", } },
            FutInd:  { root: "cabr"},
            FutCond: { root: "cabr"},
            CmdPos:  { forms: {                        "3s": "quepa",      "1p": "quepamos",                    "3p": "quepan",      vos: "cabé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },         
        }
    },
    caer: {
        participles: {pres: "cayendo", past: "caído"},
        aspects: {
            PresInd: { forms: { "1s": "caigo" } },
            PresSub: { root: "caig" },
            // There may be general rules that could be used, such as: 3-vowels
            PastInd: { forms: {        "2s": "caíste", "3s": "cayó",   "1p": "caímos", "2p": "caísteis", "3p": "cayeron" } },
            CmdPos:  { forms: {                        "3s": "caiga",  "1p": "caigamos",                 "3p": "caigan",      vos: "caé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },         
        }
    },
    conducir: {
        aspects: {
            PresSub: { root: "conduzc" },
            // stem change conduc => "conduj"
            PastInd: { forms: { "1s": "conduje", "2s": "condujiste", "3s": "condujo",      "1p": "condujimos", "2p": "condujisteis", "3p": "condujeron" } },
            CmdPos:  { forms: {                                      "3s": "conduzca",     "1p": "conduzcamos",                      "3p": "conduzcan",     vos: "conducí" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    dar: {
        participles: { pres: "dando", past: "dado" },
        aspects: {
            PresInd: { forms: { "1s": "doy",                                              "2p": "dais" } },
            PresSub: { forms: { "1s": "dé",                 "3s": "dé",                   "2p": "deis" } },
            PastInd: { forms: { "1s": "di", "2s": "diste",  "3s": "dio",   "1p": "dimos", "2p": "disteis", "3p": "dieron" } },
            CmdPos:  { forms: {                             "3s": "dé" } },
            CmdNeg:  { parent_tense_mood: "PresSub", 
                       forms: {                             "3s": "dé" } },
        }
    },
    decir: {
        participles: { pres: "diciendo", past: "dicho" },
        aspects: {
            PresInd: { forms: { "1s": "digo" } },
            PresSub: { root: "dig" },
            PastInd: { forms: { "1s": "dije", "2s": "dijiste", "3s": "dijo", "1p": "dijimos", "2p": "dijisteis", "3p": "dijeron" } },
            FutInd:  { root: "dir"},
            FutCond: { root: "dir"},
            CmdPos:  { forms: {               "2s": "di", "3s": "diga",      "1p": "digamos",                    "3p": "digan" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    erguir: {
        aspects: {
            PresInd: { forms: { "1s": ["irgo", "yergo"], "2s": ["irgues", "yergues"], "3s": ["irgue", "yergue"], "1p": "erguimos", "2p": "erguís", "3p": ["irguen", "yerguen"] } },
            // TODO: perhaps this could be handled by allowing two roots?
            PresSub: { forms: { "1s":["irga","yerga"], "2s":["irgas","yergas"], "3s":["irga","yerga"],           "1p":["irgamos","yergamos"], "2p":["irgáis","yergáis"], "3p":["irgan","yergan"], "vos":"yergas"}},

            PastInd: { forms: { "1s": "erguí", "2s": "erguiste", "3s": "irguió",                       "1p": "erguimos", "2p": "erguisteis", "3p": "irguieron" } },
            CmdPos:  { forms: {                "2s":["irgue","yergue"],"3s":["irga","yerga"],          "1p":["irgamos","yergamos"],          "3p":["irgan","yergan"],   "vos":"erguí"}},
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    estar: {
        aspects: {
            // other than "1s", the only spelling difference is the accents
            PresInd: { forms: { "1s": "estoy", "2s": "estás", "3s": "está",                                    "3p": "están" } },
            PresSub: { forms: { "1s": "esté", "2s": "estés", "3s": "esté",    "1p": "estemos", "2p": "estéis", "3p": "estén" } },
            // stem change est => "estuv"
            PastInd: { forms: { "1s": "estuve", "2s": "estuviste", "3s": "estuvo",    "1p": "estuvimos", "2p": "estuvisteis", "3p": "estuvieron" } },
            PastImp: { forms: {"1s": "estaba", "2s": "estabas", "3s": "estaba",  "1p": "estábamos", "2p": "estabais", "3p": "estaban" } },
            // FutInd:  uses the regular form
            // FutCond:  uses the regular form
            CmdPos:  { forms: {                "2s": "está", "3s": "esté",                                            "3p": "estén" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    haber: {
        aspects: {
            PresInd: { forms: { "1s": "he", "2s": "has", "3s": ["hay", "ha"],     "1p": "hemos",                     "3p": "han" } },
            PresSub: { forms: { "1s": "haya", "2s": "hayas", "3s": "haya",        "1p": "hayamos", "2p": "hayáis", "3p": "hayan" } },
            PastInd: { root: "hub",
                       forms: { "1s": "hube",                "3s": "hubo",        }},
            // PastImp uses regular conjugation
            FutInd:  { root: "habr" },
            FutCond: { root: "habr" },
            CmdPos:  { forms: {             "2s": ["habe", "he"], "3s": "haya",   "1p": "hayamos",                  "3p": "hayan"                                                              } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    hacer: {
        aspects: {
            PresInd: { forms: { "1s": "hago" } },
            PresSub: { root: "hag" },
            PastInd: { root: "hic",
                       forms: { "1s": "hice",               "3s": "hizo",  } },
            // PastImp uses regular conjugation
            FutInd:  { root: "har" },
            FutCond: { root: "har" },
            CmdPos:  { forms: {             "2s": "haz", "3s": "haga",            "1p": "hagamos",                  "3p": "hagan"                                                              } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    huir: {
        aspects: {
            PresInd: { forms: { "1s": "huyo", "2s": "huyes", "3s": "huye", "1p": "huimos", "2p": "huis", "3p": "huyen" } },
            PresSub: { root: "huy" },
            PastInd: { forms: { "1s": "hui", "2s": "huiste", "3s": "huyó", "1p": "huimos", "2p": "huisteis", "3p": "huyeron" } },
            CmdPos:  { forms: {             "2s": "huye", "3s": "huya",    "1p": "huyamos",                  "3p": "huyan",        vos: "hui" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    ir: {
        aspects: {
            PresInd: { forms: { "1s": "voy", "2s": "vas", "3s": "va",         "1p": "vamos", "2p": "vais", "3p": "van" } },
            PresSub: { root: "vay" },
            PastInd: { forms: { "1s": "fui", "2s": "fuiste", "3s": "fue",     "1p": "fuimos", "2p": "fuisteis", "3p": "fueron" } },
            PastImp: { forms: { "1s": "iba", "2s": "ibas", "3s": "iba",       "1p": "íbamos", "2p": "ibais", "3p": "iban" } },
            // FutInd: uses regular conjugation
            // FutCond: uses regular conjugation
            CmdPos:  { forms: { "1s": null, "2s": "ve", "3s": "vaya",         "1p": ["vayamos", "vamos"],         "3p": "vayan" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    jugar: {
        aspects: {
            PastInd: { forms: { "1s": "jugué", "2s": "jugaste", "3s": "jugó", "1p": "jugamos", "2p": "jugasteis", "3p": "jugaron" } },
            PresSub: { root: "juegu",
                       forms: {                                               "1p": "juguemos", "2p": "juguéis",                       vos: ["juegues", "*jugués"]} },
            CmdPos:  { forms: { "1s": null, "2s": "juega", "3s": "juegue",    "1p": "juguemos",                   "3p": "jueguen",     vos: "jugá" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    leer: {
        aspects: {
            // TODO: consider using spelling rules and accent changes to generate these forms
            PastInd: { forms: { "2s": "leíste", "3s": "leyó", "1p": "leímos", "2p": "leísteis", "3p": "leyeron" } },
        }
    },
    oír: {
        aspects: {
            // FIX: can this be done with typographical rules?
            PresInd: { forms: { "1s": "oigo", "2s": "oyes", "3s": "oye",   "1p": "oímos",                  "3p": "oyen" } },
            PresSub: { root: "oig" },
            PastInd: { forms: {               "2s": "oíste", "3s": "oyó",  "1p": "oímos", "2p": "oísteis", "3p": "oyeron" } },
            FutInd:  { root: "oir" },
            FutCond: { root: "oir" },
            CmdPos:  { forms: {             "2s": "oye", "3s": "oiga",     "1p": "oigamos", "2p": "oíd",   "3p": "oigan", vos: "oí"   } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    poder: {
        aspects: {
            // "o:u"  FIX: use root
            PresSub: { forms: { "1s": "pueda", "2s": "puedas", "3s": "pueda",                                    "3p": "puedan" , vos: ["puedas", "*podás"]} },
            PastInd: { forms: { "1s": "pude", "2s": "pudiste", "3s": "pudo", "1p": "pudimos", "2p": "pudisteis", "3p": "pudieron" } },
            FutInd:  { root: "podr" },
            FutCond:  { root: "podr" }, 
            CmdPos:  { forms: { "1s": null, "2s": "puede", "3s": "pueda",                                        "3p": "puedan" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    poner: {
        aspects: {
            PresInd: { forms: { "1s": "pongo" } },
            PresSub: { forms: { "1s": "ponga", "2s": "pongas", "3s": "ponga",   "1p": "pongamos", "2p": "pongáis",  "3p": "pongan" , vos: ["pongas", "*pongás"]} },
            // stem change pon => pus
            PastInd: { forms: { "1s": "puse", "2s": "pusiste", "3s": "puso",    "1p": "pusimos", "2p": "pusisteis", "3p": "pusieron" } },
            FutInd:  { root: "pondr" },
            FutCond: { root: "pondr" },
            CmdPos:  { forms: { "1s": null, "2s": "pon", "3s": "ponga",         "1p": "pongamos",           "3p": "pongan" , vos: "poné"} },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    querer: {
        participles: {pres: "queriendo", past: "querido"},
        aspects: {
            // stem change quer => quis
            PastInd: { forms: { "1s": "quise", "2s": "quisiste", "3s": "quiso", "1p": "quisimos", "2p": "quisisteis", "3p": "quisieron" } },
            FutInd:  { root: "querr" },
            FutCond: { root: "querr" },
        }
    },
    saber: {
        aspects: {
            // similar a caber
            PresInd: { forms: { "1s": "sé" } },
            PresSub:  { root: "sep" },
            // stem change sab => sup
            PastInd: { forms: { "1s": "supe", "2s": "supiste", "3s": "supo", "1p": "supimos", "2p": "supisteis", "3p": "supieron" } },
            FutInd:  { root: "sabr" },
            FutCond: { root: "sabr" },
            CmdPos:  { forms: {                                "3s":"sepa",  "1p":"sepamos",                     "3p":"sepan", "vos":"sabé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    salir: {
        aspects: {
            PresInd: { forms: { "1s": "salgo" } },
            PresSub: { root: "salg" },
            FutInd:  { root: "saldr" },
            FutCond: { root: "saldr" },
            CmdPos:  { forms: {                "2s": "sal", "3s":"salga",     "1p":"salgamos",                     "3p":"salgan", "vos":"salí" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    seguir: {
        aspects: {
            PresInd: { forms: { "1s": "sigo" } },
            PresSub: { root: "sig" },
            CmdPos:  { forms: {                "2s": "sigue", "3s":"siga",     "1p":"sigamos",                     "3p":"sigan", "vos":"seguí" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    ser: {
        aspects: {
            PresInd: { forms: { "1s": "soy", "2s": "eres", "3s": "es",        "1p": "somos", "2p": "sois", "3p": "son" } },
            PresSub: { root: "se" },
            PastInd: { forms: { "1s": "fui", "2s": "fuiste", "3s": "fue",     "1p": "fuimos", "2p": "fuisteis", "3p": "fueron" } },
            PastImp: { forms: {"1s":"era", "2s":"eras", "3s":"era",           "1p":"éramos", "2p":"erais", "3p":"eran",            "vos":"eras"}},
            CmdPos:  { forms: {            "2s":"sé",   "3s":"sea",           "1p":"seamos",               "3p":"sean",            "vos":"sé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    tener: {
        aspects: {
            PresInd: { forms: { "1s": "tengo" } },
            PresSub: { root: "teng" },
            // stem change ten => tuv
            PastInd: { forms: { "1s": "tuve", "2s": "tuviste", "3s": "tuvo", "1p": "tuvimos", "2p": "tuvisteis", "3p": "tuvieron" } },
            FutInd:  { root: "tendr" },
            FutCond: { root: "tendr" },
            CmdPos:  { forms: {            "2s":"ten",   "3s":"tenga",           "1p":"tengamos",               "3p":"tengan",            "vos":"tené" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    traer: {  // similar to "caer"
        aspects: {
            PresInd: { forms: { "1s": "traigo" } },
            PresSub: { root: "traig" },
            // There may be general rules that could be used, such as: 3-vowels
            PastInd: { forms: { "1s": "traje", "2s": "trajiste", "3s": "trajo", "1p": "trajimos", "2p": "trajisteis", "3p": "trajeron" } },
            CmdPos:  { forms: {                                  "3s":"traiga", "1p":"traigamos",                     "3p":"traigan",            "vos":"traé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    vaciar: {
        aspects: {
            // The accent is the only thing different from the regular forms
            PresInd: {
                forms: { "1s": "vacío", "2s": "vacías", "3s": "vacía",                          "3p": "vacían" },
                // change_accents: {"2p": "á:a"},  // TODO: this probably does not belong in this table
            },
            PresSub: { root: "vací",
                       forms: {                                              "1p":"vaciemos", "2p": "vaciéis" } },
            CmdPos:  { forms: {              "2s": "vacía", "3s":"vacíe",                                    "3p":"vacíen",  "vos": "vaciá" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    venir: {
        aspects: {
            PresInd: { forms: { "1s": "vengo" } },
            PresSub: { root: "veng" },
            PastInd: { root: "vin",
                       forms: { "1s": "vine",         "3s": "vino",      } },
            FutInd:  { root: "vendr" },
            FutCond: { root: "vendr" },
            CmdPos:  { forms: {            "2s":"ven",   "3s":"venga",           "1p":"vengamos",               "3p":"vengan",            "vos":"vení" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    ver: {
        aspects: {
            // 2s => accent dropped
            PresInd: { forms: { "1s": "veo", "2p": "veis" } },
            PresSub: { root: "ve" },
            // accents dropped
            PastInd: { forms: { "1s": "vi", "3s": "vio" } },
            PastImp: { root: "ve" },
            CmdPos:  { forms: {                      "3s":"vea",           "1p":"veamos",               "3p":"vean",            "vos":"ve" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
}


function getParentVerbTenseMood(infinitive: string, tense_mood: VerbTenseMood) {
    const rules = irregular_conjugations[infinitive]
    const aspect = rules.aspects[tense_mood]
    if (aspect?.parent_tense_mood) {
        const parent_aspect = rules.aspects[aspect.parent_tense_mood]
        return parent_aspect
    }
}


// Get the lineage of VerbTenseMood's that form the conjugation ancestry of this verb.
export function getTenseMoodLineage(infinitive: string, tense_mood: VerbTenseMood) : VerbTenseMood[] {
    const rules = irregular_conjugations[infinitive]
    const tense_mood_lineage: VerbTenseMood[] = [tense_mood]
    let parent_tense_mood = rules.aspects[tense_mood]?.parent_tense_mood
    while (parent_tense_mood) {
        tense_mood_lineage.unshift(parent_tense_mood)
        parent_tense_mood = rules.aspects[parent_tense_mood]?.parent_tense_mood
    }
    return tense_mood_lineage
}



// @return The conjugated forms for this irregular verb that differ from the regular forms.
//  If there are no forms to replace the regular forms, then an empty object is returned.
export function applyIrregularConjugationRules(infinitive: string, tense_mood: VerbTenseMood, regular_conjugation: VerbConjugation) : VerbConjugation {
    let conjugation_rules = verb_conjugation_rules[infinitive]
    const irregular_base_infinitive = conjugation_rules?.irregular?.base
    if (irregular_base_infinitive) {
        // from this point on, the infinitive is only used for error reporting, as the irregular_base_infinitive is what is used for conjugation
        const irregular_base = irregular_conjugations[irregular_base_infinitive]
        if (!irregular_base) {
            throw new Error(`verb_conjugation_rules[${infinitive}].irregular.base=${irregular_base_infinitive} does not exist in verb_conjugation_rules`)
        }
        let irregular_base_conjugated: VerbConjugation = {}
        const lineage = getTenseMoodLineage(irregular_base_infinitive, tense_mood)
        lineage.forEach((tense_mood) => {
            const aspects = irregular_base.aspects[tense_mood]
            if (aspects) {
                const {forms, root} = aspects
                // The root is applied first
                if (root) {
                    const regular_suffixes = getRegularSuffixes(irregular_base_infinitive, tense_mood)
                    Object.keys(regular_suffixes).forEach((conjugation_key: keyof VerbConjugation) => {
                        irregular_base_conjugated[conjugation_key] = root + regular_suffixes[conjugation_key]
                    })
                }
                if (forms) {
                    Object.keys(forms).forEach((conjugation_key: keyof VerbConjugation) => {
                        const form = forms[conjugation_key]
                        if (irregular_base_conjugated[conjugation_key] == null) {
                            irregular_base_conjugated[conjugation_key] = <any> form
                        } else if (((typeof irregular_base_conjugated[conjugation_key] === "string")) && (typeof form === "string")) {
                            irregular_base_conjugated[conjugation_key] = form
                        } else if (Array.isArray(irregular_base_conjugated[conjugation_key]) && Array.isArray(form)) {
                            irregular_base_conjugated[conjugation_key] = <any> form
                        } else {
                            throw new Error(`expected typeof string for irregular_base_conjugated[${conjugation_key}] for infinitive=${infinitive} irregular_base_infinitive=${irregular_base_infinitive} tense_mood=${tense_mood}`)
                        }
                    })
                }    
            } else {
                // no aspect means use the regular forms, so no need to add anything here
            }
        })
        // const aspect = irregular_base.aspects[tense_mood]
        // // const regular_suffixes = getRegularSuffixes(infinitive, tense_mood)
        // // const regular_root = infinitive.slice(0, -2)
        // const irregular_base_conjugation = aspect?.forms
        // const base_aspect = aspect?.parent_tense_mood ? irregular_base.aspects[aspect.parent_tense_mood] : undefined
        // Object.keys(regular_conjugation).forEach((key: keyof VerbConjugation) => {
        //     let regular_conjugated = regular_conjugation[key]
        //     let irregular_base_conjugated
        //     if (aspect?.root) {
        //         if (typeof regular_conjugated === "string") {
        //             irregular_base_conjugated = aspect.root + regular_suffixes[key]
        //         } else {
        //             throw new Error(`unexpected regular_conjugated=${regular_conjugated} for infinitive=${infinitive} tense_mood=${tense_mood}`)
        //         }
        //     } else {
        //         irregular_base_conjugated = base_aspect?.forms?.[key] || irregular_base_conjugation?.[key]
        //     }
        //     // multiple conjugated forms disallowed for derived verbs
        //     let conjugated_form: VerbConjugation["1s"]
        //     if (irregular_base_conjugated) {
        //         if (infinitive !== irregular_base_infinitive) {
        //             conjugated_form = applyDerivedChanges(irregular_base_conjugated)
        //         } else {
        //             conjugated_form = irregular_base_conjugated
        //         }
        //         if (conjugated_form === regular_conjugated) {
        //             console.log(`warning: remove unnecessary rule for infinitive=${infinitive} tense_mood=${tense_mood} key=${key}`)
        //         }
        //     } else {
        //         conjugated_form = regular_conjugated
        //     }
        //     conjugation_w_prefix[key] = conjugated_form
        // })
        const irregular_conjugated: VerbConjugation = {...regular_conjugation, ...irregular_base_conjugated}
        if (["CmdPos","CmdNeg"].includes(tense_mood)) {
            delete irregular_base_conjugated["1s"]
        }
        return irregular_base_conjugated
    }
    return {}
}

