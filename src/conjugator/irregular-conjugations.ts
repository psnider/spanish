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
            PresInd: { forms: { s1: "quepo" } },
            PresSub: { root: "quep" },
            // stem change cab => cup
            PastInd: { root: "cup",
                       forms: { s1: "cupe",          s3: "cupo", } },
            FutInd:  { root: "cabr"},
            FutCond: { root: "cabr"},
            CmdPos:  { forms: {                        s3: "quepa",      p1: "quepamos",                    p3: "quepan",      vos: "cabé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },         
        }
    },
    caer: {
        participles: {pres: "cayendo", past: "caído"},
        aspects: {
            PresInd: { forms: { s1: "caigo" } },
            PresSub: { root: "caig" },
            // There may be general rules that could be used, such as: 3-vowels
            PastInd: { forms: {        s2: "caíste", s3: "cayó",   p1: "caímos", p2: "caísteis", p3: "cayeron" } },
            CmdPos:  { forms: {                        s3: "caiga",  p1: "caigamos",                 p3: "caigan",      vos: "caé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },         
        }
    },
    conducir: {
        aspects: {
            PresSub: { root: "conduzc" },
            // stem change conduc => "conduj"
            PastInd: { forms: { s1: "conduje", s2: "condujiste", s3: "condujo",      p1: "condujimos", p2: "condujisteis", p3: "condujeron" } },
            CmdPos:  { forms: {                                      s3: "conduzca",     p1: "conduzcamos",                      p3: "conduzcan",     vos: "conducí" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    dar: {
        participles: { pres: "dando", past: "dado" },
        aspects: {
            PresInd: { forms: { s1: "doy",                                              p2: "dais" } },
            PresSub: { forms: { s1: "dé",                 s3: "dé",                   p2: "deis" } },
            PastInd: { forms: { s1: "di", s2: "diste",  s3: "dio",   p1: "dimos", p2: "disteis", p3: "dieron" } },
            CmdPos:  { forms: {                             s3: "dé" } },
            CmdNeg:  { parent_tense_mood: "PresSub", 
                       forms: {                             s3: "dé" } },
        }
    },
    decir: {
        participles: { pres: "diciendo", past: "dicho" },
        aspects: {
            PresInd: { forms: { s1: "digo" } },
            PresSub: { root: "dig" },
            PastInd: { forms: { s1: "dije", s2: "dijiste", s3: "dijo", p1: "dijimos", p2: "dijisteis", p3: "dijeron" } },
            FutInd:  { root: "dir"},
            FutCond: { root: "dir"},
            CmdPos:  { forms: {               s2: "di", s3: "diga",      p1: "digamos",                    p3: "digan" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    erguir: {
        aspects: {
            PresInd: { forms: { s1: ["irgo", "yergo"], s2: ["irgues", "yergues"], s3: ["irgue", "yergue"], p1: "erguimos", p2: "erguís", p3: ["irguen", "yerguen"] } },
            // TODO: perhaps this could be handled by allowing two roots?
            PresSub: { forms: { s1:["irga","yerga"], s2:["irgas","yergas"], s3:["irga","yerga"],           p1:["irgamos","yergamos"], p2:["irgáis","yergáis"], p3:["irgan","yergan"], "vos":"yergas"}},

            PastInd: { forms: { s1: "erguí", s2: "erguiste", s3: "irguió",                       p1: "erguimos", p2: "erguisteis", p3: "irguieron" } },
            CmdPos:  { forms: {                s2:["irgue","yergue"],s3:["irga","yerga"],          p1:["irgamos","yergamos"],          p3:["irgan","yergan"],   "vos":"erguí"}},
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    estar: {
        aspects: {
            // other than s1, the only spelling difference is the accents
            PresInd: { forms: { s1: "estoy", s2: "estás", s3: "está",                                    p3: "están" } },
            PresSub: { forms: { s1: "esté", s2: "estés", s3: "esté",    p1: "estemos", p2: "estéis", p3: "estén" } },
            // stem change est => "estuv"
            PastInd: { forms: { s1: "estuve", s2: "estuviste", s3: "estuvo",    p1: "estuvimos", p2: "estuvisteis", p3: "estuvieron" } },
            PastImp: { forms: {s1: "estaba", s2: "estabas", s3: "estaba",  p1: "estábamos", p2: "estabais", p3: "estaban" } },
            // FutInd:  uses the regular form
            // FutCond:  uses the regular form
            CmdPos:  { forms: {                s2: "está", s3: "esté",                                            p3: "estén" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    haber: {
        aspects: {
            PresInd: { forms: { s1: "he", s2: "has", s3: ["hay", "ha"],     p1: "hemos",                     p3: "han" } },
            PresSub: { forms: { s1: "haya", s2: "hayas", s3: "haya",        p1: "hayamos", p2: "hayáis", p3: "hayan" } },
            PastInd: { root: "hub",
                       forms: { s1: "hube",                s3: "hubo",        }},
            // PastImp uses regular conjugation
            FutInd:  { root: "habr" },
            FutCond: { root: "habr" },
            CmdPos:  { forms: {             s2: ["habe", "he"], s3: "haya",   p1: "hayamos",                  p3: "hayan"                                                              } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    hacer: {
        aspects: {
            PresInd: { forms: { s1: "hago" } },
            PresSub: { root: "hag" },
            PastInd: { root: "hic",
                       forms: { s1: "hice",               s3: "hizo",  } },
            // PastImp uses regular conjugation
            FutInd:  { root: "har" },
            FutCond: { root: "har" },
            CmdPos:  { forms: {             s2: "haz", s3: "haga",            p1: "hagamos",                  p3: "hagan"                                                              } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    huir: {
        aspects: {
            PresInd: { forms: { s1: "huyo", s2: "huyes", s3: "huye", p1: "huimos", p2: "huis", p3: "huyen" } },
            PresSub: { root: "huy" },
            PastInd: { forms: { s1: "hui", s2: "huiste", s3: "huyó", p1: "huimos", p2: "huisteis", p3: "huyeron" } },
            CmdPos:  { forms: {             s2: "huye", s3: "huya",    p1: "huyamos",                  p3: "huyan",        vos: "hui" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    ir: {
        aspects: {
            PresInd: { forms: { s1: "voy", s2: "vas", s3: "va",         p1: "vamos", p2: "vais", p3: "van" } },
            PresSub: { root: "vay" },
            PastInd: { forms: { s1: "fui", s2: "fuiste", s3: "fue",     p1: "fuimos", p2: "fuisteis", p3: "fueron" } },
            PastImp: { forms: { s1: "iba", s2: "ibas", s3: "iba",       p1: "íbamos", p2: "ibais", p3: "iban" } },
            // FutInd: uses regular conjugation
            // FutCond: uses regular conjugation
            CmdPos:  { forms: { s1: null, s2: "ve", s3: "vaya",         p1: ["vayamos", "vamos"],         p3: "vayan" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    jugar: {
        aspects: {
            PastInd: { forms: { s1: "jugué", s2: "jugaste", s3: "jugó", p1: "jugamos", p2: "jugasteis", p3: "jugaron" } },
            PresSub: { root: "juegu",
                       forms: {                                               p1: "juguemos", p2: "juguéis",                       vos: ["juegues", "*jugués"]} },
            CmdPos:  { forms: { s1: null, s2: "juega", s3: "juegue",    p1: "juguemos",                   p3: "jueguen",     vos: "jugá" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    leer: {
        aspects: {
            // TODO: consider using spelling rules and accent changes to generate these forms
            PastInd: { forms: { s2: "leíste", s3: "leyó", p1: "leímos", p2: "leísteis", p3: "leyeron" } },
        }
    },
    oír: {
        aspects: {
            // FIX: can this be done with typographical rules?
            PresInd: { forms: { s1: "oigo", s2: "oyes", s3: "oye",   p1: "oímos",                  p3: "oyen" } },
            PresSub: { root: "oig" },
            PastInd: { forms: {               s2: "oíste", s3: "oyó",  p1: "oímos", p2: "oísteis", p3: "oyeron" } },
            FutInd:  { root: "oir" },
            FutCond: { root: "oir" },
            CmdPos:  { forms: {             s2: "oye", s3: "oiga",     p1: "oigamos", p2: "oíd",   p3: "oigan", vos: "oí"   } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    poder: {
        aspects: {
            // "o:u"  FIX: use root
            PresSub: { forms: { s1: "pueda", s2: "puedas", s3: "pueda",                                    p3: "puedan" , vos: ["puedas", "*podás"]} },
            PastInd: { forms: { s1: "pude", s2: "pudiste", s3: "pudo", p1: "pudimos", p2: "pudisteis", p3: "pudieron" } },
            FutInd:  { root: "podr" },
            FutCond:  { root: "podr" }, 
            CmdPos:  { forms: { s1: null, s2: "puede", s3: "pueda",                                        p3: "puedan" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    poner: {
        aspects: {
            PresInd: { forms: { s1: "pongo" } },
            PresSub: { forms: { s1: "ponga", s2: "pongas", s3: "ponga",   p1: "pongamos", p2: "pongáis",  p3: "pongan" , vos: ["pongas", "*pongás"]} },
            // stem change pon => pus
            PastInd: { forms: { s1: "puse", s2: "pusiste", s3: "puso",    p1: "pusimos", p2: "pusisteis", p3: "pusieron" } },
            FutInd:  { root: "pondr" },
            FutCond: { root: "pondr" },
            CmdPos:  { forms: { s1: null, s2: "pon", s3: "ponga",         p1: "pongamos",           p3: "pongan" , vos: "poné"} },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    querer: {
        participles: {pres: "queriendo", past: "querido"},
        aspects: {
            // stem change quer => quis
            PastInd: { forms: { s1: "quise", s2: "quisiste", s3: "quiso", p1: "quisimos", p2: "quisisteis", p3: "quisieron" } },
            FutInd:  { root: "querr" },
            FutCond: { root: "querr" },
        }
    },
    saber: {
        aspects: {
            // similar a caber
            PresInd: { forms: { s1: "sé" } },
            PresSub:  { root: "sep" },
            // stem change sab => sup
            PastInd: { forms: { s1: "supe", s2: "supiste", s3: "supo", p1: "supimos", p2: "supisteis", p3: "supieron" } },
            FutInd:  { root: "sabr" },
            FutCond: { root: "sabr" },
            CmdPos:  { forms: {                                s3:"sepa",  p1:"sepamos",                     p3:"sepan", "vos":"sabé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    salir: {
        aspects: {
            PresInd: { forms: { s1: "salgo" } },
            PresSub: { root: "salg" },
            FutInd:  { root: "saldr" },
            FutCond: { root: "saldr" },
            CmdPos:  { forms: {                s2: "sal", s3:"salga",     p1:"salgamos",                     p3:"salgan", "vos":"salí" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    seguir: {
        aspects: {
            PresInd: { forms: { s1: "sigo" } },
            PresSub: { root: "sig" },
            CmdPos:  { forms: {                s2: "sigue", s3:"siga",     p1:"sigamos",                     p3:"sigan", "vos":"seguí" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    ser: {
        aspects: {
            PresInd: { forms: { s1: "soy", s2: "eres", s3: "es",        p1: "somos", p2: "sois", p3: "son" } },
            PresSub: { root: "se" },
            PastInd: { forms: { s1: "fui", s2: "fuiste", s3: "fue",     p1: "fuimos", p2: "fuisteis", p3: "fueron" } },
            PastImp: { forms: {s1:"era", s2:"eras", s3:"era",           p1:"éramos", p2:"erais", p3:"eran",            "vos":"eras"}},
            CmdPos:  { forms: {            s2:"sé",   s3:"sea",           p1:"seamos",               p3:"sean",            "vos":"sé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    tener: {
        aspects: {
            PresInd: { forms: { s1: "tengo" } },
            PresSub: { root: "teng" },
            // stem change ten => tuv
            PastInd: { forms: { s1: "tuve", s2: "tuviste", s3: "tuvo", p1: "tuvimos", p2: "tuvisteis", p3: "tuvieron" } },
            FutInd:  { root: "tendr" },
            FutCond: { root: "tendr" },
            CmdPos:  { forms: {            s2:"ten",   s3:"tenga",           p1:"tengamos",               p3:"tengan",            "vos":"tené" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    traer: {  // similar to "caer"
        aspects: {
            PresInd: { forms: { s1: "traigo" } },
            PresSub: { root: "traig" },
            // There may be general rules that could be used, such as: 3-vowels
            PastInd: { forms: { s1: "traje", s2: "trajiste", s3: "trajo", p1: "trajimos", p2: "trajisteis", p3: "trajeron" } },
            CmdPos:  { forms: {                                  s3:"traiga", p1:"traigamos",                     p3:"traigan",            "vos":"traé" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    vaciar: {
        aspects: {
            // The accent is the only thing different from the regular forms
            PresInd: {
                forms: { s1: "vacío", s2: "vacías", s3: "vacía",                          p3: "vacían" },
            },
            PresSub: { root: "vací",
                       forms: {                                              p1:"vaciemos", p2: "vaciéis" } },
            CmdPos:  { forms: {              s2: "vacía", s3:"vacíe",                                    p3:"vacíen",  "vos": "vaciá" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    venir: {
        aspects: {
            PresInd: { forms: { s1: "vengo" } },
            PresSub: { root: "veng" },
            PastInd: { root: "vin",
                       forms: { s1: "vine",         s3: "vino",      } },
            FutInd:  { root: "vendr" },
            FutCond: { root: "vendr" },
            CmdPos:  { forms: {            s2:"ven",   s3:"venga",           p1:"vengamos",               p3:"vengan",            "vos":"vení" } },
            CmdNeg:  { parent_tense_mood: "PresSub" },
        }
    },
    ver: {
        aspects: {
            // p2 => accent dropped
            PresInd: { forms: { s1: "veo", p2: "veis" } },
            PresSub: { root: "ve" },
            // accents dropped
            PastInd: { forms: { s1: "vi", s3: "vio" } },
            PastImp: { root: "ve" },
            CmdPos:  { forms: {                      s3:"vea",           p1:"veamos",               p3:"vean",            "vos":"ve" } },
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
        const irregular_conjugated: VerbConjugation = {...regular_conjugation, ...irregular_base_conjugated}
        if (["CmdPos","CmdNeg"].includes(tense_mood)) {
            delete irregular_base_conjugated.s1
        }
        return irregular_base_conjugated
    }
    return {}
}

