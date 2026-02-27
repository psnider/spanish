import { GrammaticalPerson, StemChangeRuleId, MoodTense, MoodTenseMap, VerbConjugation, VerbConjugationAnnotation, VerbConjugationChanges, VerbForms } from "."
import { VerbAspectModifications } from "./regular-verb-rules"
import { version, license } from "./version.js"



export type InfinitiveClass = "-ar" | "-er" | "-ir"

// A family of verbs that conjugate the same depending on the termination.
// A preceding hyphen indicates that the form is not a verb itself.
export type VerboClaseConjugacional = "-acer" | "decir" | "-ducir" | "-eer" | "-iar" | "oír" | "poner" | "seguir" | "tener" | "traer" | "-uir"


// El modelo de la conjugación.
// Note that some models are not verbs themselves, but are productive verb endings. These are marked with a leading hyphen.
// Para verbos regulares, no especifica un modelo.
export type ModeloConjugacional = VerboClaseConjugacional
                    | "delinquir"
                    | "caber" | "caer" | "dar" | "erguir" | "estar"
                    | "haber" | "ir" | "jugar" | "poder"
                    | "querer" | "saber" | "salir" | "ser"
                    | "vaciar" |"venir" | "ver"


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
    modelo?: ModeloConjugacional
    tema_presente_yo?: string | [string, string]
    sufijo_presente_yo?: string
    tema_pretérito?: string
    // tema especial del futuro / condicional
    tema_futuro?: string
    alternancia_vocálica?: StemChangeRuleId
    // Propiedades que no se generalizan bien, no productivos, no extrapolable.
    excepciones_léxicas?: {
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
        reglas?: MoodTenseMap<VerbAspectRulesWithFullyIrregularForms>
    }
}


export const verbos_con_cambios_morfológicos : {[infinitive: string]: ReglasDeConjugaciónDeVerbo} = {
    acertar:  {alternancia_vocálica: "e:ie"},
    acordar:  {alternancia_vocálica: "o:ue"},
    acostar:  {alternancia_vocálica: "o:ue"},
    almorzar: {alternancia_vocálica: "o:ue"},
    ampliar:  {modelo: "vaciar"},
    andar:    {tema_pretérito: "anduv"},
    apostar:  {alternancia_vocálica: "o:ue"},
    aprobar:  {alternancia_vocálica: "o:ue"},  // Remove once a- prefixes are handled correctly
    ascender: {alternancia_vocálica: "e:ie"},
    atender:  {alternancia_vocálica: "e:ie"},
    caer:     {tema_presente_yo: "caig"},
    caber: {
        tema_presente_yo: "quep",
        tema_pretérito: "cup",
        tema_futuro: "cabr",
    },
    calentar:  {alternancia_vocálica: "e:ie"},
    // FIX: add ceñir
    comenzar:  {alternancia_vocálica: "e:ie"},
    competir:  {alternancia_vocálica: "e:i"},
    comprobar: {alternancia_vocálica: "o:ue"},
    concertar: {alternancia_vocálica: "e:ie"},
    concordar: {alternancia_vocálica: "o:ue"},
    conducir: {
        clase_conjugacional: "-ducir",
        // FIX: linguist: how can this pattern be generalized?
        tema_pretérito: "conduj",  // pretérito fuerte con -j
    },
    confesar:  {alternancia_vocálica: "e:ie"},
    confiar:   {modelo: "vaciar"},
    conjugar:   {modelo: null},  // regular, no sigue el modelo de "jugar"
    contar:    {alternancia_vocálica: "o:ue"},
    convertir: {alternancia_vocálica: "e:ie"},
    corregir:  {alternancia_vocálica: "e:i"},
    costar:    {alternancia_vocálica: "o:ue"},
    criar:     {modelo: "vaciar"},
    dar: {
        // FIX: linguist: unclear
        excepciones_léxicas: {
            reglas: {
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
        excepciones_léxicas: {
            participio: "dicho",
            gerundio: "diciendo",
            imperativo_tú: "di"
        }
    },
    defender:   {alternancia_vocálica: "e:ie"},
    descender:  {alternancia_vocálica: "e:ie"},
    desconfiar: {modelo: "vaciar"},
    despertar:  {alternancia_vocálica: "e:ie"},
    desviar:    {modelo: "vaciar"},
    diferir:    {alternancia_vocálica: "e:ie"},
    disolver:   {alternancia_vocálica: "o:ue"},
    doler:      {alternancia_vocálica: "o:ue"},
    dormir:     {alternancia_vocálica: "o:ue"},
    elegir:     {alternancia_vocálica: "e:i"},
    enjugar:    {modelo: null},  // regular, no sigue el modelo de "jugar"
    empezar:    {alternancia_vocálica: "e:ie"},
    encender:   {alternancia_vocálica: "e:ie"},
    encontrar:  {alternancia_vocálica: "o:ue"},
    entender:   {alternancia_vocálica: "e:ie"},
    enterrar:   {alternancia_vocálica: "e:ie"},
    enviar:     {modelo: "vaciar"},
    erguir: {
        alternancia_vocálica: "e:ie",
        // tema_presente_yo: ["irg", "yerg"],
        tema_presente_yo: "yerg",
        excepciones_léxicas: {
            gerundio: "irguiendo",
        }
    },
    escribir: {
        excepciones_léxicas: {
            participio: "escrito",
        }
    },
    esforzar: {alternancia_vocálica: "o:ue"},
    espiar: {modelo: "vaciar"},
    esquiar: {modelo: "vaciar"},
    estar: {
        sufijo_presente_yo: "oy",
        tema_pretérito: "estuv", 
        excepciones_léxicas: {
            imperativo_tú: "está",
            reglas: {
                IndPres: {suffixes: {           s2: ["ás"], s3: ["á"], p3: ["án"]}},
                SubPres: {suffixes: {s1: ["é"], s2: ["és"], s3: ["é"], p3: ["én"]}},
                CmdPos:  {suffixes: {                       s3: ["é"], p3: ["én"]}},
                CmdNeg:  {suffixes: {           s2: ["és"], s3: ["é"], p3: ["én"]}}
            }
        }
    },
    extender: {alternancia_vocálica: "e:ie"},
    forzar: {alternancia_vocálica: "o:ue"},
    fotografiar: {modelo: "vaciar"},
    gobernar: {alternancia_vocálica: "e:ie"},
    granizar: {alternancia_vocálica: "o:ue"},     // conjugate_only: ["s3"]},
    guiar: {
        // TODO: hay formas reformadas en la reforma ortográfica de la RAE de 2010, considera añadir estas formas
        // irregular_base: "vaciar"
        clase_conjugacional: "-iar",
        // The accent is the only thing different from the regular forms
        excepciones_léxicas: {
            reglas: {
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
        excepciones_léxicas: {
            supletivo: true,
            imperativo_tú: ["habe", "he"],
            reglas: {
                IndPres: { forms: { s1: ["he"], s2: ["has"], s3: ["hay", "ha"],     p1: ["hemos"],                     p3: ["han"],   vos: null} },
                SubPres: { tema: "hay" },
                CmdPos:  { tema: "hay",
                           forms: {                                                                  p2: ["habed"],                   vos: null} },
                CmdNeg:  { tema: "hay" },
            }
        }
    },
    hacer: {
        clase_conjugacional: "-acer",
        tema_presente_yo: "hag",
        tema_pretérito: "hic",
        tema_futuro: "har",
        excepciones_léxicas: {
            participio: "hecho",
            imperativo_tú: "haz",
            reglas: {
                // FIX: linguist: should "hizo" be managed with sound preserving transformations?
                IndPret: { forms: {s3: ["hizo"]} }
            }
        }
    },
    helar: {alternancia_vocálica: "e:ie"},
    huir: { // FIX: is this fully regular now?
        clase_conjugacional: "-uir",
        excepciones_léxicas: {
            reglas: {
                IndPres: { suffixes: {p2: ["is"], vos: ["is"]}},
                IndPret: { suffixes: { s1: ["i"] } },
                CmdPos:  { suffixes: { vos: ["i"] } }
            },
        }
    },
    impedir: {alternancia_vocálica: "e:i"},
    ir: {
        tema_pretérito: "fu",
        sufijo_presente_yo: "oy",
        excepciones_léxicas: {
            supletivo: true,
            participio: "ido",
            gerundio: "yendo",
            reglas: {
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
    },
    llover:     {alternancia_vocálica: "o:ue"},   // FIX: conjugate_only: ["s3"]},
    manifestar: {alternancia_vocálica: "e:ie"},
    medir:      {alternancia_vocálica: "e:i"},
    merendar:   {alternancia_vocálica: "e:ie"},
    morir:      {alternancia_vocálica: "o:ue"},
    mostrar:    {alternancia_vocálica: "o:ue"},
    mover:      {alternancia_vocálica: "o:ue"},
    nevar:      {alternancia_vocálica: "e:ie"},       // FIX: conjugate_only: ["s3"]},
    oír: {
        // why is this a class?
        clase_conjugacional: "oír", 
        tema_presente_yo: "oig",
        excepciones_léxicas: {
            reglas: {
                CmdPos:  { suffixes: {                                                      p2: ["íd"],          } },
            }
        }
    },
    pedir:    {alternancia_vocálica: "e:i"},
    pensar:   {alternancia_vocálica: "e:ie"},
    perder:   {alternancia_vocálica: "e:ie"},
    poder: {
        alternancia_vocálica: "o:ue",
        tema_pretérito: "pud",
        tema_futuro: "podr",
        excepciones_léxicas: {
            gerundio_tema_cambio_excepcional: "o:u",
        }
    },
    poner: {
        tema_presente_yo: "pong",
        tema_pretérito: "pus",
        tema_futuro: "pondr",
        excepciones_léxicas: {
            participio: "puesto",
            imperativo_tú: "pon",
            reglas: {
                CmdPos:  { derivations: {preserve_stress_from_base: ["s2"] }},
            }
        }
    },
    preferir: {alternancia_vocálica: "e:ie"},
    pretender: {alternancia_vocálica: "e:ie"},
    probar:    {alternancia_vocálica: "o:ue"},
    quebrar:   {alternancia_vocálica: "e:ie"},
    querer: {
        tema_pretérito: "quis",
        tema_futuro: "querr",
        alternancia_vocálica: "e:ie",
    },
    recomendar: {alternancia_vocálica: "e:ie"},
    recordar: {alternancia_vocálica: "o:ue"},
    regir: {alternancia_vocálica: "e:i"},
    reír: {
        // alternancia_vocálica: "i:í",  FIX: linguist: is there a vowel change rule?
        excepciones_léxicas: {
            gerundio: "riendo",
            participio: "reído",
            reglas: {
                // FIX: linguist: are there other reglas I can use?
                // FIX: must formalize the relationship of CmdPos on SubPres
                IndPres: {forms: {s1: ["río"], s2: ["ríes"], s3: ["ríe"], p1: ["reímos"], p2: ["reís"],  p3: ["ríen"],   vos: ["reís"], }},
                IndPret: {forms: {                           s3: ["rio"],                                p3: ["rieron"],}},
                SubPres: {tema: "rí",
                        //   forms: {s1: ["ría"], s2: ["rías"], s3: ["ría"], p1: ["riamos"], p2: ["riáis"], p3: ["rían"] }},
                          forms: {                           s3: ["ría"], p1: ["riamos"], p2: ["riáis"], p3: ["rían"] }},
                CmdPos:  {tema: "rí",
                          forms: {                                        p1: ["riamos"], p2: ["reíd"],                  vos: ["reí"]}}
            }
        }
    },
    repetir: {alternancia_vocálica: "e:i"},
    resolver: {alternancia_vocálica: "o:ue"},
    reunir: {alternancia_vocálica: "u:ú"},      // FIX: linguist: can this be handled with accentuation rules?
    saber: {
        tema_pretérito: "sup",
        tema_futuro: "sabr",
        excepciones_léxicas: {
            // ind_pres_yo: "sé",
            // tema_subjuntivo_yo: "sep",
            reglas: {
                // similar a caber
                IndPres: { forms: { s1: ["sé"] } },
                SubPres: { tema: "sep" },
                CmdPos:  { forms: {                                s3: ["sepa"],  p1: ["sepamos"],                     p3: ["sepan"] } },
                CmdNeg:  { tema: "sep" },
            }
        }
    },
    salir: {
        tema_presente_yo: "salg",
        tema_futuro: "saldr",
        excepciones_léxicas: {
            imperativo_tú: "sal"
        }
    },
    // seducir: is this supported?
    seguir: {
        // NOTE: this does not conjugate as a "-uir" clase infinitive
        tema_presente_yo: "sig",
        alternancia_vocálica: "e:i",
        excepciones_léxicas: {
            tema_subjuntivo_yo: "sig"
        }
    },
    sentir:  {alternancia_vocálica: "e:ie"},
    ser: {
        excepciones_léxicas: {
            supletivo: true,
            reglas: {
                IndPres: { forms: { s1: ["soy"], s2: ["eres"],   s3: ["es"],    p1: ["somos"],  p2: ["sois"],     p3: ["son"],    vos: ["sos"] } },
                IndImp:  { forms: { s1: ["era"], s2: ["eras"],   s3: ["era"],   p1: ["éramos"], p2: ["erais"],    p3: ["eran"]}},
                IndPret: { forms: { s1: ["fui"], s2: ["fuiste"], s3: ["fue"],   p1: ["fuimos"], p2: ["fuisteis"], p3: ["fueron"] } },
                SubPres: { tema: "se" },
                CmdPos:  { forms: {              s2: ["sé"],     s3: ["sea"],   p1: ["seamos"],                   p3: ["sean"],   vos: null} },
                CmdNeg:  { tema: "se" },
            }

        }
    },
    servir:  {alternancia_vocálica: "e:i"},
    soldar:  {alternancia_vocálica: "o:ue"},
    soltar:  {alternancia_vocálica: "o:ue"},
    sonar:   {alternancia_vocálica: "o:ue"},
    soñar:   {alternancia_vocálica: "o:ue"},
    temblar: {alternancia_vocálica: "e:ie"},
    tender:  {alternancia_vocálica: "e:ie"},
    tener: {
        clase_conjugacional: "tener", 
        tema_presente_yo: "teng",
        tema_pretérito: "tuv",
        tema_futuro: "tendr",
        alternancia_vocálica: "e:ie",
        excepciones_léxicas: {
            imperativo_tú: "ten",
            reglas: {
                CmdPos:  { derivations: {preserve_stress_from_base: ["s2"] }},
            }
        }
    },
    // traducir: is this supported?
    traer: {
        tema_presente_yo: "traig",
        tema_pretérito: "traj",
    },
    trompezar: {alternancia_vocálica: "e:ie"},
    vaciar: {
        clase_conjugacional: "-iar",
        // FIX: linguist: The accent is the only thing different from the regular forms
        // Is this due to an orthographic rule? or something else?
        excepciones_léxicas: {
            reglas: {
                IndPres: {stress_last_char_of_s123p3_stem: true,
                          suffixes: {           s2: ["as"], s3: ["á"],       p2: ["áis"], p3: ["án"] }},
                SubPres: {stress_last_char_of_s123p3_stem: true},
                CmdPos:  {stress_last_char_of_s123p3_stem: true},
                CmdNeg:  {stress_last_char_of_s123p3_stem: true,
                          suffixes: {                                        vos: null }},
            }
        }
    },
    variar: {modelo: "vaciar"},
    valer: {
        tema_presente_yo: "valg",
        tema_futuro: "valdr",
    },
    venir: {
        tema_presente_yo: "veng",
        tema_pretérito: "vin",
        tema_futuro: "vendr",
        alternancia_vocálica: "e:ie",
        excepciones_léxicas: {
            gerundio: "viniendo",
            imperativo_tú: "ven",
            reglas: {
                CmdPos:  { derivations: {preserve_stress_from_base: ["s2"] }},
            }
        }
    },
    ver: {
        // parece que no conforma bien a estas reglas
        // sí prefijo_ind_pres_yo cambia, pero no con "g", y no con los mismos cambios
        // no aplican ni tema_pretérito ni tema_futuro ni alternancia_vocálica
        // el resto con excepciones_léxicas
        excepciones_léxicas: {
            gerundio: "viendo",
            participio: "visto",
            // hay varias excepciones_léxicas que probablemente tienen que ver con el hecho que ver es solo una sílaba
            reglas: {
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
    vestir: {alternancia_vocálica: "e:ie"},
    volar: {
        alternancia_vocálica: "o:ue",
        excepciones_léxicas: {
            participio: "vuelto",
        }
    },
    volcar: {alternancia_vocálica: "o:ue"},
    volver:  {alternancia_vocálica: "o:ue"},
}


// FIX: restore after refactoring complete
export function getAnnotations(infinitive: string, modelo: ModeloConjugacional, mood_tense: MoodTense) : VerbConjugationAnnotation {
    const annotations: VerbConjugationAnnotation = {version, license, modelo: undefined}
    // const unconfirmed = !(infinitive in morphophonemic_verb_conjugation_rules) || undefined
    // const annotations: VerbConjugationAnnotation = {model, mood_tense, unconfirmed}
    return annotations
}
