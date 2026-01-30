import { GrammaticalPersons, VerbConjugation, VerbConjugationRules, VerbTenseMood } from ".";
import { verb_conjugation_rules } from "./conjugation-rules-per-verb.js";
import { getRegularSuffixes } from "./regular-verb-rules.js";


export interface DerivationRule {
    preserve_stress_from_base?: boolean
}


export type DerivationRules = GrammaticalPersons<DerivationRule>


// The rules for conjugating a single form of a verb, such as: "IndPres", "IndImp"
export interface VerbAspectConjugations {
    // The aspect from which this one is derived.
    parent_tense_mood?: VerbTenseMood
    // The conjugated forms.
    // If this is set, 'root' may not be set.
    // A particular form may be set to null, which indicates that that form should not be generated.
    // For example, for the single sylable infinitive "dar", IndPres,vos and CmdPos,vos both share the "s2" form.
    forms?: VerbConjugation
    // Rules for modifying derived forms.
    // If this is set, 'root' may not be set.
    derivations?: DerivationRules
    // If set, then this string replaces the root used in regular conjugation rules.
    // If this is set, 'forms' may not be set.
    root?: string
}


// Contains just those forms that differ from the regular forms.
export const irregular_conjugations: { [infinitive: string]: VerbConjugationRules<VerbAspectConjugations> } = {
    andar: {
        conjugation_classes: ["pretérito: raíz corta", "futuro: raíz especial"],
        aspects: {
            IndPret: { root: "anduv",
                       forms: { s1: ["anduve"], s2: ["anduviste"], s3: ["anduvo"], p1: ["anduvimos"], p2: ["anduvisteis"], p3: ["anduvieron"] }
                     },
        }
    },
    caber: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
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
        participles: {pres: "cayendo", past: "caído"},
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
        participles: { pres: "dando", past: "dado" },
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
        participles: { pres: "diciendo", past: "dicho" },
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
        aspects: {
            // other than s1, the only spelling difference is the accents
            // The "vos" form is that same as the "s2" form, so don't present it
            IndPres: { forms: { s1: ["estoy"], s2: ["estás"], s3: ["está"],                                    p3: ["están"], vos: null } },
            SubPres: { forms: { s1: ["esté"], s2: ["estés"], s3: ["esté"],    p1: ["estemos"], p2: ["estéis"], p3: ["estén"] } },
            // stem change est => "estuv"
            IndPret: { root: "estuv", 
                       forms: { s1: ["estuve"], s2: ["estuviste"], s3: ["estuvo"],    p1: ["estuvimos"], p2: ["estuvisteis"], p3: ["estuvieron"] } },
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
        aspects: {
            // "haber" uses the "tú" form for vos, not the inherited regular "-er" form
            IndPres: { forms: { s1: ["he"], s2: ["has"], s3: ["hay", "ha"],     p1: ["hemos"],                     p3: ["han"],  vos: null} },
            SubPres: { forms: { s1: ["haya"], s2: ["hayas"], s3: ["haya"],        p1: ["hayamos"], p2: ["hayáis"], p3: ["hayan"] } },
            IndPret: { root: "hub",
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
        aspects: {
            IndPres: { forms: { s1: ["hago"] } },
            SubPres: { root: "hag" },
            IndPret: { root: "hic",
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
        aspects: {
            IndPret: { forms: { s1: ["jugué"], s2: ["jugaste"], s3: ["jugó"], p1: ["jugamos"], p2: ["jugasteis"], p3: ["jugaron"] } },
            // FIX: vos spelling differs by region: vos: ["juegues", "*jugués"]
            SubPres: { root: "juegu",
                      forms: {                                          p1: ["juguemos"], p2: ["juguéis"]} },
            CmdPos:  { forms: { s1: null, s2: ["juega"], s3: ["juegue"],    p1: ["juguemos"],                   p3: ["jueguen"],     vos: ["jugá"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    leer: {
        conjugation_classes: ["hiato → y (fonológico)"],
        aspects: {
            // TODO: consider using spelling rules and accent changes to generate these forms
            IndPret: { forms: { s2: ["leíste"], s3: ["leyó"], p1: ["leímos"], p2: ["leísteis"], p3: ["leyeron"] } },
        }
    },
    oír: {
        conjugation_classes: ["hiato → y (fonológico)", "presente: diptongo e → i"],
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
        aspects: {
            // "o:u"  FIX: use root
            // FIX: vos spelling differs by region: vos: ["puedas", "*podás"]
            SubPres: { forms: { s1: ["pueda"], s2: ["puedas"], s3: ["pueda"],                                    p3: ["puedan"]} },
            IndPret: { root: "pud",
                       forms: { s1: ["pude"], s2: ["pudiste"], s3: ["pudo"], p1: ["pudimos"], p2: ["pudisteis"], p3: ["pudieron"] } },
            IndFut:  { root: "podr" },
            IndCond:  { root: "podr" }, 
            CmdPos:  { forms: { s1: null, s2: ["puede"], s3: ["pueda"],                                        p3: ["puedan"], vos: ["podé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    poner: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        aspects: {
            IndPres: { forms: { s1: ["pongo"] } },
            // FIX: vos spelling differs by region: vos: ["pongas", "*pongás"]
            SubPres: { forms: { s1: ["ponga"], s2: ["pongas"], s3: ["ponga"],   p1: ["pongamos"], p2: ["pongáis"],  p3: ["pongan"]} },
            IndPret: { root: "pus",
                       forms: { s1: ["puse"], s2: ["pusiste"], s3: ["puso"],    p1: ["pusimos"], p2: ["pusisteis"], p3: ["pusieron"] } },
            IndFut:  { root: "pondr" },
            IndCond: { root: "pondr" },
            CmdPos:  {
                forms: { s1: null, s2: ["pon"], s3: ["ponga"],         p1: ["pongamos"],           p3: ["pongan"]},
                derivations: {s2: {preserve_stress_from_base: true}}
            },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    querer: {
        conjugation_classes: ["presente: diptongo e → ie", "pretérito: raíz corta", "futuro: raíz especial"],
        participles: {pres: "queriendo", past: "querido"},
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
        aspects: {
            // similar a caber
            IndPres: { forms: { s1: ["sé"] } },
            SubPres:  { root: "sep" },
            // stem change sab => sup
            IndPret: { root: "sup",
                       forms: { s1: ["supe"], s2: ["supiste"], s3: ["supo"], p1: ["supimos"], p2: ["supisteis"], p3: ["supieron"] } },
            IndFut:  { root: "sabr" },
            IndCond: { root: "sabr" },
            CmdPos:  { forms: {                                s3: ["sepa"],  p1: ["sepamos"],                     p3: ["sepan"], vos: ["sabé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    salir: {
        conjugation_classes: ["presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
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
        aspects: {
            IndPres: { forms: { s1: ["sigo"] } },
            SubPres: { root: "sig" },
            CmdPos:  { forms: {                s2: ["sigue"], s3: ["siga"],     p1: ["sigamos"],                     p3: ["sigan"], vos: ["seguí"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    ser: {
        conjugation_classes: ["atómico verdadero"],
        aspects: {
            IndPres: { forms: { s1: ["soy"], s2: ["eres"], s3: ["es"],        p1: ["somos"], p2: ["sois"], p3: ["son"], vos: ["sos"] } },
            SubPres: { root: "se" },
            IndPret: { forms: { s1: ["fui"], s2: ["fuiste"], s3: ["fue"],     p1: ["fuimos"], p2: ["fuisteis"], p3: ["fueron"] } },
            IndImp: { forms: { s1: ["era"], s2: ["eras"], s3: ["era"],           p1: ["éramos"], p2: ["erais"], p3: ["eran"]}},
            CmdPos:  { forms: {            s2: ["sé"],   s3: ["sea"],           p1: ["seamos"],               p3: ["sean"],            vos: ["sé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    tener: {      // ChatGPT says this is NOT irregular
        conjugation_classes: ["presente: diptongo e → ie", "presente: -go 1.ª p", "pretérito: raíz corta", "futuro: raíz especial"],
        aspects: {
            IndPres: { forms: { s1: ["tengo"] } },
            SubPres: { root: "teng" },
            IndPret: { root: "tuv",
                       forms: { s1: ["tuve"], s2: ["tuviste"], s3: ["tuvo"], p1: ["tuvimos"], p2: ["tuvisteis"], p3: ["tuvieron"] } },
            IndFut:  { root: "tendr" },
            IndCond: { root: "tendr" },
            CmdPos:  { forms: {            s2: ["ten"],   s3: ["tenga"],           p1: ["tengamos"],               p3: ["tengan"],            vos: ["tené"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    traer: {  // similar to "caer"
        conjugation_classes: ["pretérito: raíz corta"],
        aspects: {
            IndPres: { forms: { s1: ["traigo"] } },
            SubPres: { root: "traig" },
            // There may be general rules that could be used, such as: 3-vowels
            IndPret: { root: "traj",
                       forms: { s1: ["traje"], s2: ["trajiste"], s3: ["trajo"], p1: ["trajimos"], p2: ["trajisteis"], p3: ["trajeron"] } },
            CmdPos:  { forms: {                                  s3: ["traiga"], p1: ["traigamos"],                     p3: ["traigan"],            vos: ["traé"] } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
        }
    },
    vaciar: {
    conjugation_classes: ["hiato → y (fonológico)"],
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
        aspects: {
            // p2 => accent dropped
            // The default "-er" verb pattern of accent the last sylable doesn't apply to vos forms of "ver", since "vés" is only one sylable
            IndPres: { forms: { s1: ["veo"], p2: ["veis"], vos: null } },
            SubPres: { root: "ve" },
            // accents dropped
            IndPret: { forms: { s1: ["vi"], s3: ["vio"] } },
            IndImp: { root: "ve" },
            CmdPos:  { forms: {                      s3: ["vea"],           p1: ["veamos"],               p3: ["vean"],            vos: null } },
            CmdNeg:  { parent_tense_mood: "SubPres" },
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
                        const root_w_suffix = root + regular_suffixes[conjugation_key]
                        irregular_base_conjugated[conjugation_key] = [root_w_suffix]
                    })
                }
                if (forms) {
                    Object.keys(forms).forEach((conjugation_key: keyof VerbConjugation) => {
                        const form = forms[conjugation_key]
                        if (!irregular_base_conjugated[conjugation_key]) {
                            if (form !== null) {
                                irregular_base_conjugated[conjugation_key] = <any> form
                            } else {
                                delete regular_conjugation[conjugation_key]
                                delete irregular_base_conjugated[conjugation_key]
                            }
                        } else if (((typeof irregular_base_conjugated[conjugation_key] === "string")) && (typeof form === "string")) {
                            irregular_base_conjugated[conjugation_key] = form
                            console.log("applyIrregularConjugationRules(): using possibly dead code ?")
                            // FIX: Is this dead code?
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

