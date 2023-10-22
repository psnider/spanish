import {ConjugationChanges, ConjugationKey, StemChangePatterns, SuffixesForRegularVerbs, TypographicalChangeRule, VerbConjugation, VerbConjugation_nonStandard, VerbFamily, VerbMoodTense} from "./index"


// @description Data describing the general conjugation rules for the supported verbs.
//  This contains several major components:
//  - rules for conjugating regular verbs
//    See: regular_verb_suffixes
//  - rules for spelling changes to verb stems (verb roots)
//    See: stem_change_patterns
//  - rules for typographical (spelling) changes
//    See: typographical_change_rules
//  - rules for conjugating irregular verbs 
//    See: irregular_conjugations
//  - verbs that have conjugated correctly using these rules
//    See: verb_conjugation_types


// The names of the conjugations.
// The first character refers to person, and the second to plurality.
// So "1s" refers to 1st-person-singular, and "2p" refers to 2nd-person-plural.
export const conjugation_keys = ["1s", "2s", "3s", "1p", "2p", "3p"]


// The suffixes used by all standard verb conjugations.
// That is, those that are not irregular.
// Note that even irregular verbs often use these suffixes for most forms.
export const regular_verb_suffixes: SuffixesForRegularVerbs = {
    ar: {    // ar: like "amar"
        regular: {
            IndPres: {"1s": "o", "2s": "as", "3s": "a", "1p": "amos", "2p": "áis", "3p": "an"},
            IndPast: {"1s": "é", "2s": "aste", "3s": "ó",  "1p": "amos", "2p": "asteis", "3p": "aron"},
        }
    },
    er: {   // er: like "temer"
        regular: {
            IndPres: {"1s": "o", "2s": "es", "3s": "e", "1p": "emos", "2p": "éis", "3p": "en"},
            IndPast: {"1s": "í", "2s": "iste", "3s": "ió", "1p": "imos", "2p": "isteis", "3p": "ieron"},
        },
        eer: {
            // match_root: /[aeiou]$/u,
            IndPast: { "1s": "í", "2s": "íste", "3s": "yó", "1p": "ímos", "2p": "ísteis", "3p": "yeron" },
        }

    },
    ir: {    // ir: like "partir"
        regular: {
            IndPres: {"1s": "o", "2s": "es", "3s": "e", "1p": "imos", "2p": "ís",  "3p": "en"},
            IndPast: {"1s": "í", "2s": "iste", "3s": "ió", "1p": "imos", "2p": "isteis", "3p": "ieron"},
        },
    }
}


// The patterns used for stem changes.
// The form is: original_character : replacement_characters
// The changes apply to the last instance of the original_character in a verb stem (root form).
export const stem_change_patterns: {[stem_change_pattern_name: string]: StemChangePatterns} = {
    "o:ue": {
        transforms: ["o:ue", "o:u"],
        IndPres: {"1s": "o:ue", "2s": "o:ue", "3s": "o:ue", "3p": "o:ue"},
        IndPast: {"3s": "o:u", "3p": "o:u"},
    },
    "e:i": {
        transforms: ["e:i"],
        IndPres: {"1s": "e:i", "2s": "e:i", "3s": "e:i", "3p": "e:i"},
        IndPast: {"3s": "e:i", "3p": "e:i"},
    },
    "e:ie": {
        transforms: ["e:ie", "e:i"],
        IndPres: {"1s": "e:ie", "2s": "e:ie", "3s": "e:ie", "3p": "e:ie"},
        IndPast: {"3s": "e:i", "3p": "e:i"},
    },
    "u:ue": {
        transforms: ["u:ue"],
        IndPres: {"1s": "u:ue", "2s": "u:ue", "3s": "u:ue", "3p": "u:ue"},
    },
}


// Note: this combination of conjugated forms is sometimes referred to as the "boot".
const conjugation_keys_1s2s3s3p: ConjugationKey[] = ["1s", "2s", "3s", "3p"]


// Verb changes made solely for phonetic reasons, and using changes in typography.
// These rules are applied in order, but only the first matching rule is applied.
// However, it might be unnecessary, as we haven't found any cases in which more than one rule is applied
export const typographical_change_rules : TypographicalChangeRule[] = [
    {
        // example: conocer,IndPres,1s: conoco => conozco
        name: "preserve-soft-c-sound",
        filter: {infinitive_endings: ["cer", "cir"]},
        change: {match_pattern: /c([aáoóuú])$/u, replacement_pattern: "zc$1"}
    },
    {
        // example: sacar,IndPast,1s: sacé => saqué
        name: "preserve-hard-c-sound",
        filter: {infinitive_endings: ["car"]},
        change: {match_pattern: /c([eéií])$/u, replacement_pattern: "qu$1"}
    },
    {
        // example: elegir,IndPres,1s: eligo => elijo
        name: "preserve-soft-g-sound",
        filter: {infinitive_endings: ["ger", "gir"]},
        change: {match_pattern: /g([aáoóuú])$/u, replacement_pattern: "j$1"}
    },
    {
        // example: llegar,IndPast,1s: llegé => llegué
        name: "preserve-hard-g-sound",
        filter: {infinitive_endings: ["gar"]},
        change: {match_pattern: /g([eéií])$/u, replacement_pattern: "gu$1"}
    },
    {
        // Spanish doesn't have "ze", or "zi"
        // It does have "za" (zanahoria), "zo" (zoo), "zu" (azul)
        // example: empezar,IndPast,1s: empezé => empecé
        name: "replace-disallowed-ze-zi",
        filter: {infinitive_endings: ["zar", "zer", "zir"]},
        change: {match_pattern: /z([eéií])/u, replacement_pattern: "c$1"}
    },
    // {
    //   This rule was incorrect
    //   For example: it worked for: vaciar, esquiar
    //   but NOT:  cambiar
    //   TODO: Perhaps it would work for these endings: [cflprstv]iar, quiar
    //     verb_root_last_char: "i",
    //     verb_family: "ar",
    //     mood_tense: "IndPres",
    //     conjugation_keys: conjugation_keys_1s2s3s3p,
    //     replacement_for_last_char: "í"
    // }
]


export const irregular_conjugations: {[infinitive: string]: VerbConjugation_nonStandard} = {
    caber: {
        // similar a saber
        IndPres: {"1s": "quepo"},
        // stem change cab => cup
        IndPast: {"1s": "cupe", "2s": "cupiste", "3s": "cupo",  "1p": "cupimos", "2p": "cupisteis", "3p": "cupieron"},
    },
    caer: {
        IndPres: {"1s": "caigo"},
        // There may be general rules that could be used, such as: 3-vowels
        IndPast: {"1s": "caí", "2s": "caíste", "3s": "cayó",  "1p": "caímos", "2p": "caísteis", "3p": "cayeron"},
    },
    conducir: {
        // stem change conduc => "conduj"
        IndPast: {"1s": "conduje", "2s": "condujiste", "3s": "condujo",  "1p": "condujimos", "2p": "condujisteis", "3p": "condujeron"},
    },
    dar: {
        IndPres: {"1s": "doy", "2p": "dais"},
        IndPast: {"1s": "di", "2s": "diste", "3s": "dio",  "1p": "dimos", "2p": "disteis", "3p": "dieron"},
    },
    decir: {
        IndPres: {"1s": "digo"},
        IndPast: {"1s": "dije", "2s": "dijiste", "3s": "dijo",  "1p": "dijimos", "2p": "dijisteis", "3p": "dijeron"},
    },
    erguir: {
        IndPres: {"1s": ["irgo", "yergo"], "2s": ["irgues", "yergues"], "3s": ["irgue", "yergue"], "1p": "erguimos", "2p": "erguís", "3p": ["irguen", "yerguen"]},
        IndPast: {"1s": "erguí", "2s": "erguiste", "3s": "irguió",  "1p": "erguimos", "2p": "erguisteis", "3p": "irguieron"},
    },
    estar: {
        // other than "1s", the only spelling difference is the accents
        IndPres: {"1s": "estoy", "2s": "estás", "3s": "está", "3p": "están"},
        // stem change est => "estuv"
        IndPast: {"1s": "estuve", "2s": "estuviste", "3s": "estuvo",  "1p": "estuvimos", "2p": "estuvisteis", "3p": "estuvieron"},
    },
    haber: {
        // FIX: support alternate form for 3s => impersonal: hay
        IndPres: {"1s": "he", "2s": "has", "3s": ["ha", "hay"],  "1p": "hemos", "2p": "habéis", "3p": "han"},
        // stem change hab => "hub"
        IndPast: {"1s": "hube", "2s": "hubiste", "3s": "hubo",  "1p": "hubimos", "2p": "hubisteis", "3p": "hubieron"},
    },
    hacer: {
        IndPres: {"1s": "hago"},
        // "a:i"
        IndPast: {"1s": "hice", "2s": "hiciste", "3s": "hizo",  "1p": "hicimos", "2p": "hicisteis", "3p": "hicieron"},
    },
    huir: {
        IndPres: {"1s": "huyo", "2s": "huyes", "3s": "huye",  "1p": "huimos", "2p": "huis", "3p": "huyen"},
        IndPast: {"1s": "hui", "2s": "huiste", "3s": "huyó",  "1p": "huimos", "2p": "huisteis", "3p": "huyeron"},
    },
    ir: {
        IndPres: {"1s": "voy", "2s": "vas", "3s": "va", "1p": "vamos", "2p": "vais", "3p": "van"},
        IndPast: {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"},
    },
    jugar: {
        IndPast: {"1s": "jugué", "2s": "jugaste", "3s": "jugó",  "1p": "jugamos", "2p": "jugasteis", "3p": "jugaron"},
    },
    oír: {
        // FIX: can this be done with typographical rules?
        IndPres: {"1s": "oigo", "2s": "oyes", "3s": "oye", "1p": "oímos", "2p": "oís", "3p": "oyen"},
        IndPast: {"1s": "oí", "2s": "oíste", "3s": "oyó",  "1p": "oímos", "2p": "oísteis", "3p": "oyeron"},
    },
    poder: {
        // "o:u"
        IndPast: {"1s": "pude", "2s": "pudiste", "3s": "pudo",  "1p": "pudimos", "2p": "pudisteis", "3p": "pudieron"},
    },
    poner: {
        IndPres: {"1s": "pongo"},
        // stem change pon => pus
        IndPast: {"1s": "puse", "2s": "pusiste", "3s": "puso",  "1p": "pusimos", "2p": "pusisteis", "3p": "pusieron"},
    },
    querer: {
        // stem change quer => quis
        IndPast: {"1s": "quise", "2s": "quisiste", "3s": "quiso",  "1p": "quisimos", "2p": "quisisteis", "3p": "quisieron"},
    },
    saber: {
        // similar a caber
        IndPres: {"1s": "sé"},
        // stem change sab => sup
        IndPast: {"1s": "supe", "2s": "supiste", "3s": "supo",  "1p": "supimos", "2p": "supisteis", "3p": "supieron"},
    },
    salir: {
        IndPres: {"1s": "salgo"},
    },
    seguir: {
        IndPres: {"1s": "sigo"},
    },
    ser: {
        IndPres: {"1s": "soy", "2s": "eres", "3s": "es", "1p": "somos", "2p": "sois", "3p": "son"},
        IndPast: {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"},
    },
    tener: {
        IndPres: {"1s": "tengo"},
        // stem change ten => tuv
        IndPast: {"1s": "tuve", "2s": "tuviste", "3s": "tuvo",  "1p": "tuvimos", "2p": "tuvisteis", "3p": "tuvieron"},
    },
    traer: {  // similar to "caer"
        IndPres: {"1s": "traigo"},
        // There may be general rules that could be used, such as: 3-vowels
        IndPast: {"1s": "traje", "2s": "trajiste", "3s": "trajo",  "1p": "trajimos", "2p": "trajisteis", "3p": "trajeron"},
    },
    vaciar: {
        // The accent is the only thing different from the regular forms
        IndPres: {"1s": "vacío", "2s": "vacías", "3s": "vacía", "3p": "vacían"},
        change_accents: {
            // used by guiar
            IndPres: {"2p": "á:a"},
            IndPast: {"1s": "é:e", "3s": "ó:o"},
        }
    },
    venir: {
        IndPres: {"1s": "vengo"},
        IndPast: {"1s": "vine", "2s": "viniste", "3s": "vino",  "1p": "vinimos", "2p": "vinisteis"},
    },
    ver: {
        // 2s => accent dropped
        IndPres: {"1s": "veo", "2p": "veis"},
        // accents dropped
        IndPast: {"1s": "vi", "3s": "vio"},
    }
}


// Verbs that have conjugated correctly using these rules.
// Each verb has a description of the rules required to conjugate it properly.
// If there are no ConjugationChanges (a value of "null"), then the verb is regular, and is conjugated normally.
// Otherwise, the ConjugationChanges specify the minimal rules required for conjugating the verb.
export const verb_conjugation_types: {[infinitive: string]: ConjugationChanges | null} = {
    abrazar: null,
    abrir: null,
    abstener: {model: "retener", irregular: {base: "tener", add: "abs"}, reflexive_only: true},
    aburrir: null,
    acabar: null,
    aceptar: null,
    acercar: {model: "sacar"},
    acordar: {model: "contar", stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    acostar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    actualizar: null,
    acudir: null,
    adormecer: null,
    afeitar: null,
    agarrar: null,
    agradecer: null,
    agredir: null,
    alcanzar: null,
    almorzar: {model: "forzar", stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    // almorzar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    alzar: null,
    amanecer: null,
    amenazar: null,
    aparecer: null,
    aplicar: {model: "sacar"},
    apostar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    aprobar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    amar: null,
    ampliar: {irregular: {base: "vaciar", remove: "vac", add: "ampl"}},
    analizar: null,
    aprender: null,
    arrancar: null,
    arrodillar: null,
    ascender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    asegurar: null,
    asistir: null,   // conjugates like cambiar
    asociar: null,
    atacar: {model: "sacar"},
    atender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    aterrizar: null,
    atraer: {irregular: {base: "traer", add: "a"}},
    avanzar: null,
    ayudar: null,
    bailar: null,
    bañar: null,
    bautizar: null,
    beber: null,
    bendecir: {irregular: {base: "decir", add: "ben"}},
    bloquear: null,
    brincar: null,
    bucear: null,
    buscar: {model: "sacar"},
    caber: {irregular: {base: "saber"}},
    caer: {irregular: {base: "caer"}},
    calentar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    cambiar: null,
    caminar: null,
    canalizar: null,
    cantar: null,
    cazar: null,
    celebrar: null,
    cenar: null,
    cerrar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    cepillar: null,
    checar: {model: "sacar"},
    chequear: null,
    chocar: null,
    coger: null,
    colocar: null,
    comenzar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    comer: null,
    compartir: null,
    competir: {stem_change_type: "e:i"},
    completar: null,
    componer: {irregular: {base: "poner", add: "com"}},
    comprar: null,
    comprender: null,
    comprobar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    comprometer: null,  // news
    comunicar: null,
    conceptualizar: null,
    concertar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    concordar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    conducir: {irregular: {base: "conducir"}}, 
    conectar: null,
    confesar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    confiar: {irregular: {base: "vaciar", remove: "vac", add: "conf"}},
    confundir: null,
    conmover: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    conocer: null,
    conseguir: {irregular: {base: "seguir", add: "con"}, stem_change_type: "e:i", stem_change_inclusions: ["IndPres", "IndPast"]},    // except for yo, similar to {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    considerar: null,
    construir: {irregular: {base: "huir", remove: "h", add: "constr"}},
    contar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    contener: {irregular: {base: "tener", add: "con"}},
    contestar: null,
    contraer: {irregular: {base: "traer", add: "con"}},
    contribuir: {irregular: {base: "huir", remove: "h", add: "contrib"}},
    conversar: null,
    convertir: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres", "IndPast"]},
    convocar: {model: "sacar"},
    coproducir: {irregular: {base: "conducir", remove:  "con", add: "copro"}},
    corregir: {stem_change_type: "e:i", stem_change_inclusions: ["IndPres","IndPast"]},
    correr: null,
    costar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    cotizar: null,
    crear: null,
    crecer: null,
    creer: {suffix_change_type: "eer"},
    criar: {irregular: {base: "vaciar", remove: "vac", add: "cr", change_accents: true}},
    criticar: {model: "sacar"},
    cruzar: null,
    dar: {irregular: {base: "dar"}},
    deber: null,
    decidir: null,
    decir: {irregular: {base: "decir"}, stem_change_type: "e:i", stem_change_inclusions: ["IndPres"]},
    dedicar: {model: "sacar"},
    defender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    dejar: null,
    democratizar: null,
    demostrar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    derrocar: {model: "sacar"},
    desaparecer: null,
    desaprobar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    desayunar: null,
    descansar: null,
    descomponer: {irregular: {base: "poner", add: "descom"}},
    desconfiar: {irregular: {base: "vaciar", remove: "vac", add: "desconf"}},
    desear: null,
    describir: null,
    deshacer: {irregular: {base: "hacer", add: "des"}},
    despedir: null,
    despertar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    destruir: {irregular: {base: "huir", remove: "h", add: "destr"}},
    desviar: {irregular: {base: "vaciar", remove: "vac", add: "desv"}},
    devolver: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    dibujar: null,
    dictar: null,
    difundir: null,    // podcasts, news
    disparar: null,    // news
    disponer: {irregular: {base: "poner", add: "dis"}},
    dividir: null,
    disminuir: {irregular: {base: "huir", remove: "h", add: "dismin"}},
    disolver: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    distraer: {irregular: {base: "traer", add: "dis"}},
    distribuir: {irregular: {base: "huir", remove: "h", add: "distrib"}},
    doler: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    dormir: {stem_change_type: "o:ue"},
    desembocar: null,
    desoír: {irregular: {base: "oír", add: "des"}},
    desproteger: null,
    detener: {irregular: {base: "tener", add: "de"}},
    disfrazar: null,
    duchar: null,
    duplicar: {model: "sacar"},
    elegir: {stem_change_type: "e:i", stem_change_inclusions: ["IndPres","IndPast"]},
    emparejar: null,
    empatar: null,
    empatizar: null,
    empezar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    encantar: null,
    encauzar: null,
    encender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    encontrar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    endurecer: null,
    enfocar: {model: "sacar"},
    enfriar: {irregular: {base: "vaciar", remove: "vac", add: "enfr"}},
    enfurecer: null,
    enloquecer: null,
    enojar: null,
    ensañar: null,
    enseñar: null,
    entender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    enterrar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    entrar: null,
    entrecerrar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    entreoír: {irregular: {base: "oír", add: "entre"}},
    entretener: {irregular: {base: "tener", add: "entre"}},
    entristecer: null,
    envejecer: null,
    enviar: {irregular: {base: "vaciar", remove: "vac", add: "env"}},
    equivocar: {model: "sacar"},
    erguir: {irregular: {base: "erguir"}},
    escalar: null,
    escoger: null,
    escribir: null,
    escuchar: null,
    esforzar: {model: "forzar", stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    esperar: null,
    espiar: {irregular: {base: "vaciar", remove: "vac", add: "esp"}},
    esquiar: {irregular: {base: "vaciar", remove: "vac", add: "esqu"}},
    estabilizar: null,
    establecer: null,
    estar: {irregular: {base: "estar"}},
    estremecer: null,
    estudiar: null,
    excluir: {irregular: {base: "huir", remove: "h", add: "excl"}},
    existir: null,
    expandir: null,
    explicar: {model: "sacar"},
    exponer: {irregular: {base: "poner", add: "ex"}},
    extender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    extraer: {irregular: {base: "traer", add: "ex"}},
    fabricar: {model: "sacar"},
    fallecer: null,
    faltar: null,
    fascinar: null,
    fluir: {irregular: {base: "huir", remove: "h", add: "fl"}},
    formalizar: null,
    formar: null,
    fortalecer: null,
    // FIX: no need for this conjugate_only: ["3s"] rule, now that ze is converted to ce
    forzar: {model: "forzar", stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    fotografiar: {irregular: {base: "vaciar", remove: "vac", add: "fotograf"}},
    guiar: {irregular: {base: "vaciar", remove: "vac", add: "gu", change_accents: true}},
    funcionar: null,
    ganar: null,
    garantizar: null,
    gastar: null,
    gobernar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    gozar: null,
    granizar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"], conjugate_only: ["3s"]},
    gustar: null,
    haber: {irregular: {base: "haber"}},
    habitar: null,
    hablar: null,
    hacer: {irregular: {base: "hacer"}},
    helar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    hipnotizar: null,
    huir: {irregular: {base: "huir"}},
    hundir: null,
    identificar: {model: "sacar"},
    impedir: {stem_change_type: "e:i"},
    implicar: {model: "sacar"},
    imponer: {irregular: {base: "poner", add: "im"}},
    importar: null,
    incluir: {irregular: {base: "huir", remove: "h", add: "incl"}},
    inculcar: {model: "sacar"},
    indicar: {model: "sacar"},
    influir: {irregular: {base: "huir", remove: "h", add: "infl"}},
    instruir: {irregular: {base: "huir", remove: "h", add: "instr"}},
    intentar: null,
    interceptar: null,   // news
    interesar: null,
    interponer: {irregular: {base: "poner", add: "inter"}},
    ir: {irregular: {base: "ir"}},
    jugar: {irregular: {base: "jugar"}, stem_change_type: "u:ue", stem_change_inclusions: ["IndPres"]},
    lanzar: null,
    lavar: null,
    leer: {suffix_change_type: "eer"},
    legalizar: null,
    levantar: null,
    llamar: null,
    llegar: null,
    llevar: null,
    llorar: null,
    llover: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"], conjugate_only: ["3s"]},
    lograr: null,
    machucar: {model: "sacar"},
    maldecir: {irregular: {base: "decir", add: "mal"}},
    manifestar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    mantener: {irregular: {base: "tener", add: "man"}},
    maquillar: null,
    marcar: {model: "sacar"},
    matar: null,
    medir: {stem_change_type: "e:i"},
    merecer: null,
    merendar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    meter: null,
    mirar: null,
    molestar: null,
    morir: {stem_change_type: "o:ue"},
    mostrar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    mover: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    movilizar: null,
    nacer: null,
    nadar: null,
    necesitar: null,
    nevar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"], conjugate_only: ["3s"]},
    normalizar: null,
    obedecer: null,
    obtener: {irregular: {base: "tener", add: "ob"}},
    ocurrir: null,
    ofrecer: null,
    oír: {irregular: {base: "oír"}},
    oponer: {irregular: {base: "poner", add: "o"}},
    orar: null,
    organizar: null,
    pagar: null,
    paralizar: null,
    parar: null,
    parecer: null,
    partir: null,
    pasar: null,
    pasear: null,
    patinar: null,
    pedir: {stem_change_type: "e:i"},
    peinar: null,
    pensar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    perder: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    permanecer: null,
    perseguir: {irregular: {base: "seguir", add: "per"}, stem_change_type: "e:i", stem_change_inclusions: ["IndPres", "IndPast"]},    // except for yo, similar to {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    pertenecer: null,
    pescar: {model: "sacar"},
    picar: {model: "sacar"},
    platicar: {model: "sacar"},
    poder: {irregular: {base: "poder"}, stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    politizar: null,
    poner: {irregular: {base: "poner"}},
    posponer: {irregular: {base: "poner", add: "pos"}},
    practicar: {model: "sacar"},
    preferir: {stem_change_type: "e:ie"},
    preguntar: null,
    preocupar: null,
    preparar: null,
    presentar: null,
    probar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    producir: {irregular: {base: "conducir", remove:  "con", add: "pro"}},
    profundizar: null,
    programar: null,
    promover: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    proponer: {irregular: {base: "poner", add: "pro"}},
    proseguir: {irregular: {base: "seguir", add: "pro"}, stem_change_type: "e:i", stem_change_inclusions: ["IndPres", "IndPast"]},    // except for yo, similar to {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    protagonizar: null,
    proteger: null,
    provocar: {model: "sacar"},
    publicar: {model: "sacar"},
    quebrar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    quedar: null,
    querer: {irregular: {base: "querer"}, stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    quitar: null,
    rascar: {model: "sacar"},
    realizar: null,
    rebautizar: null,
    recalcar: {model: "sacar"},
    recalentar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    rechazar: null,
    recibir: null,
    recoger: null,
    recomendar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    recomenzar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    reconocer: null,
    recontar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    recordar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    reducir: {irregular: {base: "conducir", remove:  "con", add: "re"}},
    reemplazar: null,
    reencontrar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    reflejar: null,
    reforzar: {model: "forzar", stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    regatear: null,
    regir: {stem_change_type: "e:i", stem_change_inclusions: ["IndPres","IndPast"]},
    regresar: null,
    regularizar: null,
    remover: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    repetir: {stem_change_type: "e:i"},
    replicar: {model: "sacar"},
    reponer: {irregular: {base: "poner", add: "re"}},
    reprobar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    reproducir: {irregular: {base: "conducir", remove:  "con", add: "repro"}},
    resignar: null,
    resolver: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    responder: null,
    retener: {irregular: {base: "tener", add: "re"}},
    revisar: null,
    revolver: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    rezar: null,
    saber: {irregular: {base: "saber"}},
    sacar: {model: "sacar"},
    sacer: null,
    sacrificar: {model: "sacar"},
    sacudir: null,
    salir: {irregular: {base: "salir"}},
    satisfacer: {irregular: {base: "hacer", remove: "h", add: "satisf"}},
    seguir: {irregular: {base: "seguir"}, stem_change_type: "e:i", stem_change_inclusions: ["IndPres", "IndPast"]},    // except for yo, similar to {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    secar: {model: "sacar"},
    seducir: {irregular: {base: "conducir", remove:  "con", add: "se"}},
    seleccionar: null,
    sentar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    sentir: {stem_change_type: "e:ie"},
    ser: {irregular: {base: "ser"}},
    servir: {stem_change_type: "e:i"},
    significar: {model: "sacar"},
    simbolizar: null,
    sobrecalentar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    sobrevolar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    soldar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    solidarizar: null,
    soltar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    sonar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    soñar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    sorprender: null,   // canciones, podcasts, news
    sostener: {irregular: {base: "tener", add: "sos"}},
    subir: null,
    sufrir: null,
    suponer: {irregular: {base: "poner", add: "su"}},
    sustituir: {irregular: {base: "huir", remove: "h", add: "sustit"}},
    temblar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    temer: null,
    tender: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    tener: {irregular: {base: "tener"}, stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]}, //{irregular: {base: "tener"}},
    terminar: null,
    tirar: null,
    tocar: {model: "sacar"},
    tomar: null,
    trabajar: null,
    traducir: {irregular: {base: "conducir", remove:  "con", add: "tra"}},
    traer: {irregular: {base: "traer"}},
    traficar: {model: "sacar"},
    tranquilizar: null,
    tratar: null,
    triplicar: {model: "sacar"},
    trompezar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    tropezar: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    ubicar: {model: "sacar"},
    unir: null,
    unificar: {model: "sacar"},
    usar: null,
    utilizar: null,
    vaciar: {irregular: {base: "vaciar"}},
    variar: {irregular: {base: "vaciar", remove: "vac", add: "var"}},
    vender: null,
    venir: {irregular: {base: "venir"}, stem_change_type: "e:ie", stem_change_inclusions: ["IndPres", "IndPast"]},
    ver: {irregular: {base: "ver"}},
    verificar: {model: "sacar"},
    vestir: {stem_change_type: "e:ie", stem_change_inclusions: ["IndPres"]},
    viajar: null,
    visitar: null,
    visualizar: null,
    vivir: null,
    volar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    volcar: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
    volver: {stem_change_type: "o:ue", stem_change_inclusions: ["IndPres"]},
}

