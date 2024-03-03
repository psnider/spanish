import { assert_TenseMood, assert_typographicalChange } from "./test-support.js"



// -ar
assert_TenseMood("amar", "PresInd", {"1s": "amo", "2s": "amas", "3s": "ama", "1p": "amamos", "2p": "amáis", "3p": "aman"})
assert_TenseMood("amar", "PresSub", {"1s": "ame", "2s": "ames", "3s": "ame", "1p": "amemos", "2p": "améis", "3p": "amen"})
assert_TenseMood("amar", "PastInd", {"1s": "amé", "2s": "amaste", "3s": "amó", "1p": "amamos", "2p": "amasteis", "3p": "amaron"})
assert_TenseMood("amar", "PastImpInd", {"1s": "amba", "2s": "ambas", "3s": "amba", "1p": "amábamos", "2p": "amabais", "3p": "amaban"})
assert_TenseMood("amar", "PastCond", {"1s": "amaría", "2s": "amarías", "3s": "amaría", "1p": "amaríamos", "2p": "amaríais", "3p": "amarían"})
assert_TenseMood("amar", "FutInd", {"1s": "amaré", "2s": "amarás", "3s": "amará", "1p": "amaremos", "2p": "amaréis", "3p": "amarán"})
assert_TenseMood("amar", "CmdPos", {"1s": undefined, "2s": "ama", "3s": "ame", "1p": "amemos", "2p": "amad", "3p": "amen"})
assert_TenseMood("amar", "CmdNeg", {"1s": undefined, "2s": "ames", "3s": "ame", "1p": "amemos", "2p": "améis", "3p": "amen"})


// -er
assert_TenseMood("beber", "PresInd", {"1s": "bebo", "2s": "bebes", "3s": "bebe", "1p": "bebemos", "2p": "bebéis", "3p": "beben"})
assert_TenseMood("beber", "PresSub", {"1s": "beba", "2s": "bebas", "3s": "beba", "1p": "bebamos", "2p": "bebáis", "3p": "beban"})
assert_TenseMood("beber", "PastInd", {"1s": "bebí", "2s": "bebiste", "3s": "bebió", "1p": "bebimos", "2p": "bebisteis", "3p": "bebieron"})
assert_TenseMood("beber", "PastImpInd", {"1s": "bebía", "2s": "bebías", "3s": "bebía",  "1p": "bebíamos", "2p": "bebíais", "3p": "bebían"})
assert_TenseMood("beber", "PastCond", {"1s": "bebería", "2s": "beberías", "3s": "bebería", "1p": "beberíamos", "2p": "beberíais", "3p": "beberían"})
assert_TenseMood("beber", "FutInd", {"1s": "beberé", "2s": "beberás", "3s": "beberá", "1p": "beberemos", "2p": "beberéis", "3p": "beberán"})
assert_TenseMood("beber", "CmdPos", {"1s": undefined, "2s": "bebe", "3s": "beba", "1p": "bebamos", "2p": "bebed", "3p": "beban"})
assert_TenseMood("beber", "CmdNeg", {"1s": undefined, "2s": "bebas", "3s": "beba", "1p": "bebamos", "2p": "bebáis", "3p": "beban"})


// -ir
assert_TenseMood("partir", "PresInd", {"1s": "parto", "2s": "partes", "3s": "parte", "1p": "partimos", "2p": "partís", "3p": "parten"})
assert_TenseMood("partir", "PresSub", {"1s": "parta", "2s": "partas", "3s": "parta", "1p": "partamos", "2p": "partáis", "3p": "partan"})
assert_TenseMood("partir", "PastInd", {"1s": "partí", "2s": "partiste", "3s": "partió", "1p": "partimos", "2p": "partisteis", "3p": "partieron"})
assert_TenseMood("partir", "PastImpInd", {"1s": "partía", "2s": "partías", "3s": "partía",  "1p": "partíamos", "2p": "partíais", "3p": "partían"})
assert_TenseMood("partir", "PastCond", {"1s": "partiría", "2s": "partirías", "3s": "partiría", "1p": "partiríamos", "2p": "partiríais", "3p": "partirían"})
assert_TenseMood("partir", "FutInd", {"1s": "partiré", "2s": "partirás", "3s": "partirá", "1p": "partiremos", "2p": "partiréis", "3p": "partirán"})
assert_TenseMood("partir", "CmdPos", {"1s": undefined, "2s": "parte", "3s": "parta", "1p": "partamos", "2p": "partid", "3p": "partan"})
assert_TenseMood("partir", "CmdNeg", {"1s": undefined, "2s": "partas", "3s": "parta", "1p": "partamos", "2p": "partáis", "3p": "partan"})


assert_TenseMood("dar", "PresInd", {"1s": "doy", "2s": "das", "3s": "da", "1p": "damos", "2p": "dais", "3p": "dan"})
assert_TenseMood("dar", "PastInd", {"1s": "di", "2s": "diste", "3s": "dio",  "1p": "dimos", "2p": "disteis", "3p": "dieron"})

assert_TenseMood("decir", "PresInd", {"1s": "digo", "2s": "dices", "3s": "dice", "1p": "decimos", "2p": "decís", "3p": "dicen"})
assert_TenseMood("decir", "PastInd", {"1s": "dije", "2s": "dijiste", "3s": "dijo",  "1p": "dijimos", "2p": "dijisteis", "3p": "dijeron"})

assert_TenseMood("estar", "PresInd", {"1s": "estoy", "2s": "estás", "3s": "está", "1p": "estamos", "2p": "estáis", "3p": "están"})
assert_TenseMood("estar", "PastInd", {"1s": "estuve", "2s": "estuviste", "3s": "estuvo",  "1p": "estuvimos", "2p": "estuvisteis", "3p": "estuvieron"})

// based on "vaciar", but has changes to the accents
assert_TenseMood("guiar", "PresInd", {"1s": "guío", "2s": "guías", "3s": "guía", "1p": "guiamos", "2p": "guiais", "3p": "guían"})
assert_TenseMood("guiar", "PastInd", {"1s": "guie", "2s": "guiaste", "3s": "guio",  "1p": "guiamos", "2p": "guiasteis", "3p": "guiaron"})

// NOTE: support alternate form for 3s => impersonal: hay
assert_TenseMood("haber", "PresInd", {"1s": "he", "2s": "has", "3s": ["ha", "hay"],  "1p": "hemos", "2p": "habéis", "3p": "han"})
assert_TenseMood("haber", "PastInd", {"1s": "hube", "2s": "hubiste", "3s": "hubo",  "1p": "hubimos", "2p": "hubisteis", "3p": "hubieron"})

assert_TenseMood("hacer", "PresInd", {"1s": "hago", "2s": "haces", "3s": "hace", "1p": "hacemos", "2p": "hacéis", "3p": "hacen"})
assert_TenseMood("hacer", "PastInd", {"1s": "hice", "2s": "hiciste", "3s": "hizo",  "1p": "hicimos", "2p": "hicisteis", "3p": "hicieron"})

assert_TenseMood("ir", "PresInd", {"1s": "voy", "2s": "vas", "3s": "va", "1p": "vamos", "2p": "vais", "3p": "van"})
assert_TenseMood("ir", "PastInd", {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"})

assert_TenseMood("leer", "PresInd", {"1s": "leo", "2s": "lees", "3s": "lee", "1p": "leemos", "2p": "leéis", "3p": "leen"})
assert_TenseMood("leer", "PastInd", {"1s": "leí", "2s": "leíste", "3s": "leyó", "1p": "leímos", "2p": "leísteis", "3p": "leyeron"})

assert_TenseMood("llegar", "PresInd", {"1s": "llego", "2s": "llegas", "3s": "llega", "1p": "llegamos", "2p": "llegáis", "3p": "llegan"})
assert_TenseMood("llegar", "PastInd", {"1s": "llegué", "2s": "llegaste", "3s": "llegó",  "1p": "llegamos", "2p": "llegasteis", "3p": "llegaron"})

assert_TenseMood("poder", "PresInd", {"1s": "puedo", "2s": "puedes", "3s": "puede", "1p": "podemos", "2p": "podéis", "3p": "pueden"})
assert_TenseMood("poder", "PastInd", {"1s": "pude", "2s": "pudiste", "3s": "pudo",  "1p": "pudimos", "2p": "pudisteis", "3p": "pudieron"})

assert_TenseMood("oír", "PresInd", {"1s": "oigo", "2s": "oyes", "3s": "oye", "1p": "oímos", "2p": "oís", "3p": "oyen"})
assert_TenseMood("oír", "PastInd", {"1s": "oí", "2s": "oíste", "3s": "oyó",  "1p": "oímos", "2p": "oísteis", "3p": "oyeron"})

assert_TenseMood("poner", "PresInd", {"1s": "pongo", "2s": "pones", "3s": "pone", "1p": "ponemos", "2p": "ponéis", "3p": "ponen"})
assert_TenseMood("poner", "PastInd", {"1s": "puse", "2s": "pusiste", "3s": "puso",  "1p": "pusimos", "2p": "pusisteis", "3p": "pusieron"})

assert_TenseMood("querer", "PresInd", {"1s": "quiero", "2s": "quieres", "3s": "quiere", "1p": "queremos", "2p": "queréis", "3p": "quieren"})
assert_TenseMood("querer", "PastInd", {"1s": "quise", "2s": "quisiste", "3s": "quiso",  "1p": "quisimos", "2p": "quisisteis", "3p": "quisieron"})

assert_TenseMood("saber", "PresInd", {"1s": "sé", "2s": "sabes", "3s": "sabe", "1p": "sabemos", "2p": "sabéis", "3p": "saben"})
assert_TenseMood("saber", "PastInd", {"1s": "supe", "2s": "supiste", "3s": "supo",  "1p": "supimos", "2p": "supisteis", "3p": "supieron"})

assert_TenseMood("salir", "PresInd", {"1s": "salgo", "2s": "sales", "3s": "sale", "1p": "salimos", "2p": "salís", "3p": "salen"})
assert_TenseMood("salir", "PastInd", {"1s": "salí", "2s": "saliste", "3s": "salió",  "1p": "salimos", "2p": "salisteis", "3p": "salieron"})

assert_TenseMood("seguir", "PresInd", {"1s": "sigo", "2s": "sigues", "3s": "sigue", "1p": "seguimos", "2p": "seguís", "3p": "siguen"})
assert_TenseMood("seguir", "PastInd", {"1s": "seguí", "2s": "seguiste", "3s": "siguió",  "1p": "seguimos", "2p": "seguisteis", "3p": "siguieron"})

assert_TenseMood("ser", "PresInd", {"1s": "soy", "2s": "eres", "3s": "es", "1p": "somos", "2p": "sois", "3p": "son"})
assert_TenseMood("ser", "PastInd", {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"})

assert_TenseMood("tener", "PresInd", { '1s': 'tengo', '2s': 'tienes', '3s': 'tiene', '1p': 'tenemos', '2p': 'tenéis', '3p': 'tienen' })
assert_TenseMood("tener", "PastInd", { '1s': 'tuve', '2s': 'tuviste', '3s': 'tuvo', '1p': 'tuvimos', '2p': 'tuvisteis', '3p': 'tuvieron' })

assert_TenseMood("traer", "PresInd", { '1s': 'traigo', '2s': 'traes', '3s': 'trae', '1p': 'traemos', '2p': 'traéis', '3p': 'traen' })
assert_TenseMood("traer", "PastInd", { '1s': 'traje', '2s': 'trajiste', '3s': 'trajo', '1p': 'trajimos', '2p': 'trajisteis', '3p': 'trajeron' })

assert_TenseMood("vaciar", "PresInd", {"1s": "vacío", "2s": "vacías", "3s": "vacía", "1p": "vaciamos", "2p": "vaciáis", "3p": "vacían"})
assert_TenseMood("vaciar", "PastInd", {"1s": "vacié", "2s": "vaciaste", "3s": "vació",  "1p": "vaciamos", "2p": "vaciasteis", "3p": "vaciaron"})

assert_TenseMood("venir", "PresInd", {"1s": "vengo", "2s": "vienes", "3s": "viene", "1p": "venimos", "2p": "venís", "3p": "vienen"})
assert_TenseMood("venir", "PastInd", {"1s": "vine", "2s": "viniste", "3s": "vino",  "1p": "vinimos", "2p": "vinisteis", "3p": "vinieron"})

assert_TenseMood("ver", "PresInd", {"1s": "veo", "2s": "ves", "3s": "ve", "1p": "vemos", "2p": "veis", "3p": "ven"})
assert_TenseMood("ver", "PastInd", {"1s": "vi", "2s": "viste", "3s": "vio",  "1p": "vimos", "2p": "visteis", "3p": "vieron"})



assert_typographicalChange({conjugated_form: "empezé", infinitive: "empezar"}, "empecé")
assert_typographicalChange({conjugated_form: "conoco", infinitive: "conocer"}, "conozco")
assert_typographicalChange({conjugated_form: "sacé", infinitive: "sacar"}, "saqué")
assert_typographicalChange({conjugated_form: "eligo", infinitive: "elegir"}, "elijo")
assert_typographicalChange({conjugated_form: "llegé", infinitive: "llegar"}, "llegué")
