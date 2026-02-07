import { GrammaticalPersons, VerbConjugation, VerbConjugationRules, TenseMood, GrammaticalPerson } from ".";
import { morphophonemic_verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { getRegularSuffixes } from "./regular-verb-rules.js";


export interface DerivationRule {
    preserve_stress_from_base?: boolean
}


export type DerivationRules = GrammaticalPersons<DerivationRule>


// The rules for conjugating a single form of a verb, such as: "IndPres", "IndImp"
export interface VerbAspectConjugations {
    // If set, then this string replaces the root used in regular conjugation rules.
    root?: string
    // The aspect from which this one is derived.
    // Note: there are no known conjugations that use both 'root' and 'parent_tense_mood'
    parent_tense_mood?: TenseMood
    // The conjugated forms.
    // If root is also set, then the regular forms with 'root' are generated first, and any forms in this list override those.
    // A particular form may be set to null, which indicates that that form should not be generated.
    // For example, for the single sylable infinitive "dar", IndPres,vos and CmdPos,vos both share the "s2" form,
    // so irregular_conjugations.dar.aspects.CmdPos.forms.vos == null
    forms?: VerbConjugation
    // Rules for modifying derived forms.
    derivations?: DerivationRules
}


// Contains just those forms that differ from the regular forms.
// FIX: linguist: In general, I would like to replace specific spellings with general production rules, wherever possible.
export const irregular_conjugations: { [infinitive: string]: VerbConjugationRules<VerbAspectConjugations> } = {
    andar: {
        conjugation_classes: ["pretérito: raíz corta", "futuro: raíz especial"],
        participle_rules: { pres: {full: "andando"}, past: {full: "andado"} },
        aspects: {
            IndPret: { root: "anduv",
                       // FIX: linguist: This is the same pattern as in "estar". Are there some rules that could apply here instead of a list?
                       //                  é:e             a:i                ó:o             a:i                a:i                  a:ie
                       forms: { s1: ["anduve"], s2: ["anduviste"], s3: ["anduvo"], p1: ["anduvimos"], p2: ["anduvisteis"], p3: ["anduvieron"] }
                     },
        }
    },
    caber: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        participle_rules: { pres: {full: "cabiendo"}, past: {full: "cabido"} },
        aspects: {
            // similar a saber
            IndPres: { forms: { s1: ["quepo"] } },
            SubPres: { root: "quep" },
            // stem change cab => cup
            IndPret: { root: "cup",
                       forms: { s1: ["cupe"],          s3: ["cupo"], } },
            IndFut:  { root: "cabr"},
            IndCond: { root: "cabr"},
            CmdPos:  { forms: {                        s3: ["quepa"],      p1: ["quepamos"],                    p3: ["quepan"],      vos: ["cabé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    caer: {
        conjugation_classes: ["hiato → y (fonológico)"],
        participle_rules: { pres: {full: "cayendo"}, past: {full: "caído"} },
        aspects: {
            IndPres: { forms: { s1: ["caigo"] } },
            SubPres: { root: "caig" },
            // There may be general rules that could be used, such as: 3-vowels
            IndPret: { forms: {        s2: ["caíste"], s3: ["cayó"],   p1: ["caímos"], p2: ["caísteis"], p3: ["cayeron"] } },
            CmdPos:  { forms: {                        s3: ["caiga"],  p1: ["caigamos"],                 p3: ["caigan"],      vos: ["caé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },         
        }
    },
    conducir: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta"],
        conjugation_family: "-ducir",
        participle_rules: { pres: {full: "conduciendo"}, past: {full: "conducido"} },
        aspects: {
            SubPres: { root: "conduzc" },
            // stem change conduc => "conduj"
            IndPret: { forms: { s1: ["conduje"], s2: ["condujiste"], s3: ["condujo"],      p1: ["condujimos"], p2: ["condujisteis"], p3: ["condujeron"] } },
            CmdPos:  { forms: {                                      s3: ["conduzca"],     p1: ["conduzcamos"],                      p3: ["conduzcan"],     vos: ["conducí"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    dar: {
        conjugation_classes: ["pretérito: raíz corta"],
        participle_rules: { pres: {full: "dando"}, past: {full: "dado"} },
        aspects: {
            // The default "-ar" verb pattern of accent the last sylable doesn't apply to vos forms of "dar", since "dás" is only one sylable
            IndPres: { forms: { s1: ["doy"],                                              p2: ["dais"],                     vos: null } },
            SubPres: { forms: { s1: ["dé"],                 s3: ["dé"],                   p2: ["deis"] } },
            IndPret: { forms: { s1: ["di"], s2: ["diste"],  s3: ["dio"],   p1: ["dimos"], p2: ["disteis"], p3: ["dieron"] } },
            CmdPos:  { forms: {                             s3: ["dé"],                                                     vos: null  } },
            CmdNeg:  { parent_tense_mood: "SubPres", 
                       forms: {                             s3: ["dé"] } },
        }
    },
    decir: {
        conjugation_classes: ["presente: diptongo e → i", "presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        conjugation_family: "decir", 
        participle_rules: { pres: {full: "diciendo"}, past: {full: "dicho"} },
        aspects: {
            IndPres: { forms: { s1: ["digo"] } },
            SubPres: { root: "dig" },
            IndPret: { root: "dij",
                       forms: { s1: ["dije"], s2: ["dijiste"], s3: ["dijo"], p1: ["dijimos"], p2: ["dijisteis"], p3: ["dijeron"] } },
            IndFut:  { root: "dir"},
            IndCond: { root: "dir"},
            CmdPos:  { forms: {               s2: ["di"], s3: ["diga"],      p1: ["digamos"],                    p3: ["digan"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    erguir: {
        conjugation_classes: ["presente: diptongo e → i", "u → ü (diéresis)"],
        participle_rules: { pres: {full: "irguiendo"}, past: {full: "erguido"} },
        aspects: {
            IndPres: { forms: { s1: ["irgo", "yergo"], s2: ["irgues", "yergues"], s3: ["irgue", "yergue"], p1: ["erguimos"], p2: ["erguís"], p3: ["irguen", "yerguen"] } },
            // TODO: perhaps this could be handled by allowing two roots?
            SubPres: { forms: { s1:["irga","yerga"], s2:["irgas","yergas"], s3:["irga","yerga"],           p1:["irgamos","yergamos"], p2:["irgáis","yergáis"], p3:["irgan","yergan"], vos: ["yergas"]}},

            IndPret: { forms: { s1: ["erguí"], s2: ["erguiste"], s3: ["irguió"],                       p1: ["erguimos"], p2: ["erguisteis"], p3: ["irguieron"] } },
            CmdPos:  { forms: {                s2:["irgue","yergue"],s3:["irga","yerga"],          p1:["irgamos","yergamos"],          p3:["irgan","yergan"],   vos: ["erguí"]}},
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    estar: {
        conjugation_classes: ["presente: -oy 1.ª p", "pretérito: raíz corta"],
        participle_rules: { pres: {full: "estando"}, past: {full: "estado"} },
        aspects: {
            // other than s1, the only spelling difference is the accents
            // The "vos" form is that same as the "s2" form, so don't present it
            IndPres: { forms: { s1: ["estoy"], s2: ["estás"], s3: ["está"],                                    p3: ["están"], vos: null } },
            SubPres: { forms: { s1: ["esté"], s2: ["estés"], s3: ["esté"],    p1: ["estemos"], p2: ["estéis"], p3: ["estén"] } },
            // stem change est => "estuv"
            IndPret: { root: "estuv", 
                       // FIX: linguist: This is the same pattern as in "andar". Are there some rules that could apply here instead of a list?
                       //                  é:e             a:i                ó:o             a:i                a:i                  a:ie
                       forms: { s1: ["estuve"], s2: ["estuviste"], s3: ["estuvo"], p1: ["estuvimos"], p2: ["estuvisteis"], p3: ["estuvieron"] }
                     },
            IndImp: { forms: {s1: ["estaba"], s2: ["estabas"], s3: ["estaba"],  p1: ["estábamos"], p2: ["estabais"], p3: ["estaban"] } },
            // IndFut:  uses the regular form
            // IndCond:  uses the regular form
            // The "vos" form is that same as the "s2" form, so don't present it
            CmdPos:  { forms: {                s2: ["está"], s3: ["esté"],                                            p3: ["estén"], vos: null } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    haber: {
        conjugation_classes: ["atómico verdadero"],
        participle_rules: { pres: {full: "habiendo"}, past: {full: "habido"} },
        aspects: {
            // "haber" uses the "tú" form for vos, not the inherited regular "-er" form
            IndPres: { forms: { s1: ["he"], s2: ["has"], s3: ["hay", "ha"],     p1: ["hemos"],                     p3: ["han"],  vos: null} },
            SubPres: { forms: { s1: ["haya"], s2: ["hayas"], s3: ["haya"],        p1: ["hayamos"], p2: ["hayáis"], p3: ["hayan"] } },
            IndPret: { root: "hub",
                       // FIX: linguist: This is the same pattern as in "hacer", "poder", "poner", "saber". Are there some rules that could apply here instead of a list?
                       //                í:e                          ió:o
                       forms: { s1: ["hube"],                s3: ["hubo"],        }},
            // IndImp uses regular conjugation
            IndFut:  { root: "habr" },
            IndCond: { root: "habr" },
            CmdPos:  { forms: {             s2: ["habe", "he"], s3: ["haya"],   p1: ["hayamos"],                  p3: ["hayan"], vos: null} },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    hacer: {      // ChatGPT says this is NOT irregular
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        conjugation_family: "-acer",
        participle_rules: { pres: {full: "haciendo"}, past: {full: "hecho"} },
        aspects: {
            IndPres: { forms: { s1: ["hago"] } },
            SubPres: { root: "hag" },
            IndPret: { root: "hic",
                       // FIX: linguist: This is the same pattern as in "haber", "poder", "poner", "saber". Are there some rules that could apply here instead of a list?
                       //                í:e                         ió:o
                       forms: { s1: ["hice"],               s3: ["hizo"],  } },
            // IndImp uses regular conjugation
            IndFut:  { root: "har" },
            IndCond: { root: "har" },
            CmdPos:  { forms: {             s2: ["haz"], s3: ["haga"],            p1: ["hagamos"],                  p3: ["hagan"]                                                              } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    huir: {      // ChatGPT says this is NOT irregular
        conjugation_classes: ["u → y (hiato)"],
        conjugation_family: "-uir",
        participle_rules: { pres: {full: "huyendo"}, past: {full: "huido"} },
        aspects: {
            IndPres: { forms: { s1: ["huyo"], s2: ["huyes"], s3: ["huye"], p1: ["huimos"], p2: ["huis"], p3: ["huyen"], vos: ["huis"] } },
            SubPres: { root: "huy" },
            IndPret: { forms: { s1: ["hui"], s2: ["huiste"], s3: ["huyó"], p1: ["huimos"], p2: ["huisteis"], p3: ["huyeron"] } },
            CmdPos:  { forms: {             s2: ["huye"], s3: ["huya"],    p1: ["huyamos"],                  p3: ["huyan"],        vos: ["hui"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    ir: {
        conjugation_classes: ["atómico verdadero"],
        participle_rules: { pres: {full: "yendo"}, past: {full: "ido"} },
        aspects: {
            // The default "-ir" verb pattern of accent the last sylable doesn't apply to vos forms of "ir", since "ir" is only one sylable
            IndPres: { forms: { s1: ["voy"], s2: ["vas"], s3: ["va"],         p1: ["vamos"], p2: ["vais"], p3: ["van"], vos: null } },
            SubPres: { root: "vay" },
            IndPret: { forms: { s1: ["fui"], s2: ["fuiste"], s3: ["fue"],     p1: ["fuimos"], p2: ["fuisteis"], p3: ["fueron"] } },
            IndImp: { forms: { s1: ["iba"], s2: ["ibas"], s3: ["iba"],       p1: ["íbamos"], p2: ["ibais"], p3: ["iban"] } },
            // IndFut: uses regular conjugation
            // IndCond: uses regular conjugation
            CmdPos:  { forms: { s1: null, s2: ["ve"], s3: ["vaya"],         p1: ["vayamos", "vamos"],         p3: ["vayan"], vos: ["andá"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    jugar: {
        conjugation_classes: ["presente: diptongo o → ue"],
        participle_rules: { pres: {full: "jugando"}, past: {full: "jugado"} },
        aspects: {
            IndPret: { forms: { s1: ["jugué"], s2: ["jugaste"], s3: ["jugó"], p1: ["jugamos"], p2: ["jugasteis"], p3: ["jugaron"] } },
            // FIX: SubPres: vos spelling differs by region: vos: ["juegues", "*jugués"]
            CmdPos:  { forms: { s1: null, s2: ["juega"], s3: ["juegue"],    p1: ["juguemos"],                   p3: ["jueguen"],     vos: ["jugá"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    leer: {
        conjugation_classes: ["hiato → y (fonológico)"],
        conjugation_family: "-eer", 
        participle_rules: { pres: {full: "leyendo"}, past: {full: "leído"} },
        aspects: {
            // TODO: consider using spelling rules and accent changes to generate these forms 
            IndPret: { forms: { s2: ["leíste"], s3: ["leyó"], p1: ["leímos"], p2: ["leísteis"], p3: ["leyeron"] } },
        }
    },
    oír: {
        conjugation_classes: ["hiato → y (fonológico)", "presente: diptongo e → i"],
        conjugation_family: "oír", 
        participle_rules: { pres: {full: "oyendo"}, past: {full: "oído"} },
        aspects: {
            // FIX: can this be done with typographical rules?
            IndPres: { forms: { s1: ["oigo"], s2: ["oyes"], s3: ["oye"],   p1: ["oímos"],                  p3: ["oyen"] } },
            SubPres: { root: "oig" },
            IndPret: { forms: {               s2: ["oíste"], s3: ["oyó"],  p1: ["oímos"], p2: ["oísteis"], p3: ["oyeron"] } },
            IndFut:  { root: "oir" },
            IndCond: { root: "oir" },
            CmdPos:  { forms: {             s2: ["oye"], s3: ["oiga"],     p1: ["oigamos"], p2: ["oíd"],   p3: ["oigan"], vos: ["oí"]   } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    poder: {
        conjugation_classes: ["presente: diptongo o → ue", "futuro: raíz especial"],
        participle_rules: { pres: {full: "pudiendo"}, past: {full: "podido"} },
        aspects: {
            // "o:u"  FIX: use root
            // FIX: vos spelling differs by region: vos: ["puedas", "*podás"]
            SubPres: { forms: { s1: ["pueda"], s2: ["puedas"], s3: ["pueda"],                                    p3: ["puedan"]} },
            IndPret: { root: "pud",
                       // FIX: linguist: This is the same pattern as in "haber", "hacer", "poner", "saber". Are there some rules that could apply here instead of a list?
                       //                í:e                          ió:o
                       forms: { s1: ["pude"],                s3: ["pudo"] } },
            IndFut:  { root: "podr" },
            IndCond: { root: "podr" }, 
            CmdPos:  { forms: { s1: null, s2: ["puede"], s3: ["pueda"],                                        p3: ["puedan"], vos: ["podé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    poner: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        conjugation_family: "poner",
        participle_rules: { pres: {full: "poniendo"}, past: {full: "puesto"} },
        aspects: {
            IndPres: { forms: { s1: ["pongo"] } },
            // FIX: vos spelling differs by region: vos: ["pongas", "*pongás"]
            // FIX: linguist: doesn't this use the root of IndPres.s1 ?
            SubPres: { forms: { s1: ["ponga"], s2: ["pongas"], s3: ["ponga"],   p1: ["pongamos"], p2: ["pongáis"],  p3: ["pongan"]} },
            IndPret: { root: "pus",
                       // FIX: linguist: This is the same pattern as in "haber", "hacer", "poder", "saber". Are there some rules that could apply here instead of a list?
                       //                í:e                         ió:o
                       forms: { s1: ["puse"],               s3: ["puso"],  } },
            IndFut:  { root: "pondr" },
            IndCond: { root: "pondr" },
            CmdPos:  { forms: { s1: null, s2: ["pon"], s3: ["ponga"],         p1: ["pongamos"],           p3: ["pongan"]},
                       derivations: {s2: {preserve_stress_from_base: true}}
                     },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    querer: {
        conjugation_classes: ["presente: diptongo e → ie", "pretérito: raíz corta", "futuro: raíz especial"],
        participle_rules: { pres: {full: "queriendo"}, past: {full: "querido"} },
        aspects: {
            // stem change quer => quis
            IndPret: { root: "quis",
                       forms: { s1: ["quise"], s2: ["quisiste"], s3: ["quiso"], p1: ["quisimos"], p2: ["quisisteis"], p3: ["quisieron"] } },
            IndFut:  { root: "querr" },
            IndCond: { root: "querr" },
        }
    },
    saber: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta"],
        participle_rules: { pres: {full: "sabiendo"}, past: {full: "sabido"} },
        aspects: {
            // similar a caber
            IndPres: { forms: { s1: ["sé"] } },
            SubPres:  { root: "sep" },
            IndPret: { root: "sup",
                       // FIX: linguist: This is the same pattern as in "haber","hacer","poder","poner". Are there some rules that could apply here instead of a list?
                       //                í:e                         ió:o
                       forms: { s1: ["supe"],                  s3: ["supo"] }
                     },
            IndFut:  { root: "sabr" },
            IndCond: { root: "sabr" },
            CmdPos:  { forms: {                                s3: ["sepa"],  p1: ["sepamos"],                     p3: ["sepan"], vos: ["sabé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    salir: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        participle_rules: { pres: {full: "saliendo"}, past: {full: "salido"} },
        aspects: {
            IndPres: { forms: { s1: ["salgo"] } },
            SubPres: { root: "salg" },
            IndFut:  { root: "saldr" },
            IndCond: { root: "saldr" },
            CmdPos:  { forms: {                s2: ["sal"], s3: ["salga"],     p1: ["salgamos"],                     p3: ["salgan"], vos: ["salí"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    seguir: {
        conjugation_classes: ["presente: diptongo e → i", "presente: -go 1.ª p"],
        conjugation_family: "seguir",
        participle_rules: { pres: {full: "siguiendo"}, past: {full: "seguido"} },
        aspects: {
            IndPres: { forms: { s1: ["sigo"] } },
            SubPres: { root: "sig" },
            CmdPos:  { forms: {                s2: ["sigue"], s3: ["siga"],     p1: ["sigamos"],                     p3: ["sigan"], vos: ["seguí"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    ser: {
        conjugation_classes: ["atómico verdadero"],
        participle_rules: { pres: {full: "siendo"}, past: {full: "sido"} },
        aspects: {
            IndPres: { forms: { s1: ["soy"], s2: ["eres"], s3: ["es"],        p1: ["somos"], p2: ["sois"], p3: ["son"], vos: ["sos"] } },
            SubPres: { root: "se" },
            IndPret: { forms: { s1: ["fui"], s2: ["fuiste"], s3: ["fue"],     p1: ["fuimos"], p2: ["fuisteis"], p3: ["fueron"] } },
            IndImp:  { forms: { s1: ["era"], s2: ["eras"], s3: ["era"],           p1: ["éramos"], p2: ["erais"], p3: ["eran"]}},
            CmdPos:  { forms: {            s2: ["sé"],   s3: ["sea"],           p1: ["seamos"],               p3: ["sean"],            vos: ["sé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    tener: {      // ChatGPT says this is NOT irregular
        conjugation_classes: ["presente: diptongo e → ie", "presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        conjugation_family: "tener", 
        participle_rules: { pres: {full: "teniendo"}, past: {full: "tenido"} },
        aspects: {
            IndPres: { forms: { s1: ["tengo"] } },
            SubPres: { root: "teng" },
            IndPret: { root: "tuv",
                       // FIX: linguist: This is the same pattern as in "estar". Are there some rules that could apply here instead of a list?
                       //                í:e                       ió:o
                       forms: { s1: ["tuve"],             s3: ["tuvo"] }
                     },
            IndFut:  { root: "tendr" },
            IndCond: { root: "tendr" },
            CmdPos:  { forms: {            s2: ["ten"],   s3: ["tenga"],           p1: ["tengamos"],               p3: ["tengan"],            vos: ["tené"] },
                       derivations: {s2: {preserve_stress_from_base: true}}
                     },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    traer: {  // similar to "caer"
        conjugation_classes: ["pretérito: raíz corta"],
        conjugation_family: "traer",
        participle_rules: { pres: {full: "trayendo"}, past: {full: "traído"} },
        aspects: {
            IndPres: { forms: { s1: ["traigo"] } },
            SubPres: { root: "traig" },
            // There may be general rules that could be used, such as: 3-vowels
            IndPret: { root: "traj",
                       // FIX: linguist: This pattern is similiar to in "estar". Are there some rules that could apply here instead of a list?
                       //                 í:e                              ió:o                                      ie:e
                       forms: { s1: ["traje"],                   s3: ["trajo"],                            p3: ["trajeron"] } },
            CmdPos:  { forms: {                                  s3: ["traiga"], p1: ["traigamos"],                     p3: ["traigan"],            vos: ["traé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    vaciar: {
        conjugation_classes: ["hiato → y (fonológico)"],
        conjugation_family: "-iar",
        participle_rules: { pres: {full: "vaciando"}, past: {full: "vaciado"} },
        aspects: {
            // The accent is the only thing different from the regular forms
            IndPres: {
                forms: { s1: ["vacío"], s2: ["vacías"], s3: ["vacía"],                          p3: ["vacían"] },
            },
            SubPres: { root: "vací",
                       forms: {                                              p1: ["vaciemos"], p2: ["vaciéis"] } },
            CmdPos:  { forms: {              s2: ["vacía"], s3: ["vacíe"],                                    p3: ["vacíen"],  vos: ["vaciá"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    venir: {
        conjugation_classes: ["presente: diptongo e → i", "presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        participle_rules: { pres: {full: "viniendo"}, past: {full: "venido"} },
        aspects: {
            IndPres: { forms: { s1: ["vengo"] } },
            SubPres: { root: "veng" },
            IndPret: { root: "vin",
                       forms: { s1: ["vine"],         s3: ["vino"],      } },
            IndFut:  { root: "vendr" },
            IndCond: { root: "vendr" },
            CmdPos:  { forms: {            s2: ["ven"],   s3: ["venga"],           p1: ["vengamos"],               p3: ["vengan"],            vos: ["vení"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    ver: {
        conjugation_classes: ["pretérito: raíz corta"],
        participle_rules: { pres: {full: "viendo"}, past: {full: "visto"} },
        aspects: {
            // p2 => accent dropped
            // The default "-er" verb pattern of accent the last sylable doesn't apply to vos forms of "ver", since "vés" is only one sylable
            IndPres: { forms: { s1: ["veo"], p2: ["veis"], vos: null },
                       derivations: {s2: {preserve_stress_from_base: true}, s3: {preserve_stress_from_base: true}, p2: {preserve_stress_from_base: true}, p3: {preserve_stress_from_base: true}}
                     },
            SubPres: { root: "ve" },
            // accents dropped
            IndPret: { forms: { s1: ["vi"], s3: ["vio"] },
                       derivations: {s1: {preserve_stress_from_base: true}, s3: {preserve_stress_from_base: true}}
                     },
            IndImp: { root: "ve" },
            CmdPos:  { forms: {                      s3: ["vea"],           p1: ["veamos"],               p3: ["vean"],            vos: null },
                       derivations: {s2: {preserve_stress_from_base: true}}
                     },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
}


// Get the lineage of TenseMood's that form the conjugation ancestry of this verb.
export function getTenseMoodLineage(infinitive: string, tense_mood: TenseMood) : TenseMood[] {
    const rules = irregular_conjugations[infinitive]
    const tense_mood_lineage: TenseMood[] = [tense_mood]
    let parent_tense_mood = rules?.aspects[tense_mood]?.parent_tense_mood
    while (parent_tense_mood) {
        tense_mood_lineage.unshift(parent_tense_mood)
        parent_tense_mood = rules?.aspects[parent_tense_mood]?.parent_tense_mood
    }
    return tense_mood_lineage
}


// @return The conjugated forms for this irregular verb that differ from the regular forms.
//  If there are no forms to replace the regular forms, then an empty object or undefined is returned.
export function applyIrregularConjugationRules(infinitive: string, tense_mood: TenseMood, regular_conjugation: VerbConjugation) : VerbConjugation | undefined {
    function applyRoot(root: string) {
        const regular_suffixes = getRegularSuffixes(irregular_base_infinitive, tense_mood)
        for (const key in regular_suffixes) {
            const grammatical_person = <GrammaticalPerson> key
            if (regular_suffixes[grammatical_person] === null) {
                irregular_forms[grammatical_person] = null
            } else {
                const root_w_suffix = root + regular_suffixes[grammatical_person]
                irregular_forms[grammatical_person] = [root_w_suffix]
            }
        }
    }
    let conjugation_rules = morphophonemic_verb_conjugation_rules[infinitive]
    const irregular_base_infinitive = conjugation_rules?.irregular_base
    if (!irregular_base_infinitive) {
        return undefined
    }
    // from this point on, the infinitive is only used for error reporting, as the irregular_base_infinitive is what is used for conjugation
    const irregular_base = irregular_conjugations[irregular_base_infinitive]
    if (!irregular_base) {
        throw new Error(`morphophonemic_verb_conjugation_rules[${infinitive}].irregular.base=${irregular_base_infinitive} does not exist in morphophonemic_verb_conjugation_rules`)
    }
    let irregular_forms: VerbConjugation = {}
    const lineage = getTenseMoodLineage(irregular_base_infinitive, tense_mood)
    for (const lineage_tense_mood of lineage) {
        const aspects = irregular_base.aspects[lineage_tense_mood]
        if (aspects) {
            const {forms, root} = aspects
            // The root is applied first
            if (root) {
                applyRoot(root)
            }
            if (forms) {
                for (const key in forms) {
                    const grammatical_person = <GrammaticalPerson> key
                    const form = forms[grammatical_person]
                    // override a farther ancestor with a closer one
                    // if this is null, then this form will not be conjugated
                    if (irregular_forms[grammatical_person] !== null) {
                        irregular_forms[grammatical_person] = form
                    }
                }
            }    
        } else {
            // no aspect means use the regular forms, so no need to add anything here
        }
    }
    return irregular_forms
}

