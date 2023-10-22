import { VerbConjugation, VerbMoodTense, VerbTextUsage_forTypographicalChange } from "."
import {conjugateVerb} from "./grammar.js"
import {applyTypographicalChangeRules} from "./grammar.js"


function equal(lhs: string | [string, string], rhs: string | [string, string]) {
    if ((typeof lhs === "string") && (typeof rhs === "string")) {
        return (lhs === rhs)
    } else if (Array.isArray(lhs) && Array.isArray(rhs)) {
        return ((lhs[0] === rhs[0]) && (lhs[1] === rhs[1]))
    } else {
        return false
    }
}


function assert_singleForm(infinitive: string, mood_tense: VerbMoodTense, form: string, expected: string) {
    const conjugation = conjugateVerb(infinitive, mood_tense)
    const actual = conjugation[<keyof VerbConjugation> form]
    if (actual !== expected) {
        throw new Error(`${infinitive},${mood_tense},${form}: ${actual} !== ${expected}`)
    }
}


function assert_MoodTense(infinitive: string, mood_tense: VerbMoodTense, expected: VerbConjugation) {
    const actual = conjugateVerb(infinitive, mood_tense)
    const actual_keys = Object.keys(actual)
    const expected_keys = Object.keys(expected)
    expected_keys.forEach((expected_key: keyof VerbConjugation) => {
        if (! equal(actual[expected_key], expected[expected_key])) {
            throw new Error(`${infinitive},${mood_tense},${expected_key}: ${actual[expected_key]} !== ${expected[expected_key]}`)
        }
    })
}


function assert_typographicalChange(verb: VerbTextUsage_forTypographicalChange, expected: string) {
    const rules_applied: string[] = []
    const actual = applyTypographicalChangeRules(verb, rules_applied)
    if (actual !== expected) {
        throw new Error(`${actual} !== ${expected} : rules_applied=${rules_applied}`)
    }
}


// -ar
assert_MoodTense("_ar", "IndPres", {"1s": "_o", "2s": "_as", "3s": "_a", "1p": "_amos", "2p": "_áis", "3p": "_an"})
assert_MoodTense("_ar", "IndPast", {"1s": "_é", "2s": "_aste", "3s": "_ó", "1p": "_amos", "2p": "_asteis", "3p": "_aron"})
// -er
assert_MoodTense("_er", "IndPres", {"1s": "_o", "2s": "_es", "3s": "_e", "1p": "_emos", "2p": "_éis", "3p": "_en"})
assert_MoodTense("_er", "IndPast", {"1s": "_í", "2s": "_iste", "3s": "_ió", "1p": "_imos", "2p": "_isteis", "3p": "_ieron"})
// -ir
assert_MoodTense("_ir", "IndPres", {"1s": "_o", "2s": "_es", "3s": "_e", "1p": "_imos", "2p": "_ís", "3p": "_en"})
assert_MoodTense("_ir", "IndPast", {"1s": "_í", "2s": "_iste", "3s": "_ió", "1p": "_imos", "2p": "_isteis", "3p": "_ieron"})


assert_MoodTense("dar", "IndPres", {"1s": "doy", "2s": "das", "3s": "da", "1p": "damos", "2p": "dais", "3p": "dan"})
assert_MoodTense("dar", "IndPast", {"1s": "di", "2s": "diste", "3s": "dio",  "1p": "dimos", "2p": "disteis", "3p": "dieron"})

assert_MoodTense("decir", "IndPres", {"1s": "digo", "2s": "dices", "3s": "dice", "1p": "decimos", "2p": "decís", "3p": "dicen"})
assert_MoodTense("decir", "IndPast", {"1s": "dije", "2s": "dijiste", "3s": "dijo",  "1p": "dijimos", "2p": "dijisteis", "3p": "dijeron"})

assert_MoodTense("estar", "IndPres", {"1s": "estoy", "2s": "estás", "3s": "está", "1p": "estamos", "2p": "estáis", "3p": "están"})
assert_MoodTense("estar", "IndPast", {"1s": "estuve", "2s": "estuviste", "3s": "estuvo",  "1p": "estuvimos", "2p": "estuvisteis", "3p": "estuvieron"})

// based on "vaciar", but has changes to the accents
assert_MoodTense("guiar", "IndPres", {"1s": "guío", "2s": "guías", "3s": "guía", "1p": "guiamos", "2p": "guiais", "3p": "guían"})
assert_MoodTense("guiar", "IndPast", {"1s": "guie", "2s": "guiaste", "3s": "guio",  "1p": "guiamos", "2p": "guiasteis", "3p": "guiaron"})

assert_MoodTense("haber", "IndPres", {"1s": "he", "2s": "has", "3s": ["ha", "hay"],  "1p": "hemos", "2p": "habéis", "3p": "han"})
assert_MoodTense("haber", "IndPast", {"1s": "hube", "2s": "hubiste", "3s": "hubo",  "1p": "hubimos", "2p": "hubisteis", "3p": "hubieron"})

assert_MoodTense("hacer", "IndPres", {"1s": "hago", "2s": "haces", "3s": "hace", "1p": "hacemos", "2p": "hacéis", "3p": "hacen"})
assert_MoodTense("hacer", "IndPast", {"1s": "hice", "2s": "hiciste", "3s": "hizo",  "1p": "hicimos", "2p": "hicisteis", "3p": "hicieron"})

assert_MoodTense("ir", "IndPres", {"1s": "voy", "2s": "vas", "3s": "va", "1p": "vamos", "2p": "vais", "3p": "van"})
assert_MoodTense("ir", "IndPast", {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"})

assert_MoodTense("llegar", "IndPres", {"1s": "llego", "2s": "llegas", "3s": "llega", "1p": "llegamos", "2p": "llegáis", "3p": "llegan"})
assert_MoodTense("llegar", "IndPast", {"1s": "llegué", "2s": "llegaste", "3s": "llegó",  "1p": "llegamos", "2p": "llegasteis", "3p": "llegaron"})

assert_MoodTense("poder", "IndPres", {"1s": "puedo", "2s": "puedes", "3s": "puede", "1p": "podemos", "2p": "podéis", "3p": "pueden"})
assert_MoodTense("poder", "IndPast", {"1s": "pude", "2s": "pudiste", "3s": "pudo",  "1p": "pudimos", "2p": "pudisteis", "3p": "pudieron"})

assert_MoodTense("oír", "IndPres", {"1s": "oigo", "2s": "oyes", "3s": "oye", "1p": "oímos", "2p": "oís", "3p": "oyen"})
assert_MoodTense("oír", "IndPast", {"1s": "oí", "2s": "oíste", "3s": "oyó",  "1p": "oímos", "2p": "oísteis", "3p": "oyeron"})

assert_MoodTense("poner", "IndPres", {"1s": "pongo", "2s": "pones", "3s": "pone", "1p": "ponemos", "2p": "ponéis", "3p": "ponen"})
assert_MoodTense("poner", "IndPast", {"1s": "puse", "2s": "pusiste", "3s": "puso",  "1p": "pusimos", "2p": "pusisteis", "3p": "pusieron"})

assert_MoodTense("querer", "IndPres", {"1s": "quiero", "2s": "quieres", "3s": "quiere", "1p": "queremos", "2p": "queréis", "3p": "quieren"})
assert_MoodTense("querer", "IndPast", {"1s": "quise", "2s": "quisiste", "3s": "quiso",  "1p": "quisimos", "2p": "quisisteis", "3p": "quisieron"})

assert_MoodTense("saber", "IndPres", {"1s": "sé", "2s": "sabes", "3s": "sabe", "1p": "sabemos", "2p": "sabéis", "3p": "saben"})
assert_MoodTense("saber", "IndPast", {"1s": "supe", "2s": "supiste", "3s": "supo",  "1p": "supimos", "2p": "supisteis", "3p": "supieron"})

assert_MoodTense("salir", "IndPres", {"1s": "salgo", "2s": "sales", "3s": "sale", "1p": "salimos", "2p": "salís", "3p": "salen"})
assert_MoodTense("salir", "IndPast", {"1s": "salí", "2s": "saliste", "3s": "salió",  "1p": "salimos", "2p": "salisteis", "3p": "salieron"})

assert_MoodTense("seguir", "IndPres", {"1s": "sigo", "2s": "sigues", "3s": "sigue", "1p": "seguimos", "2p": "seguís", "3p": "siguen"})
assert_MoodTense("seguir", "IndPast", {"1s": "seguí", "2s": "seguiste", "3s": "siguió",  "1p": "seguimos", "2p": "seguisteis", "3p": "siguieron"})

assert_MoodTense("ser", "IndPres", {"1s": "soy", "2s": "eres", "3s": "es", "1p": "somos", "2p": "sois", "3p": "son"})
assert_MoodTense("ser", "IndPast", {"1s": "fui", "2s": "fuiste", "3s": "fue",  "1p": "fuimos", "2p": "fuisteis", "3p": "fueron"})

assert_MoodTense("tener", "IndPres", { '1s': 'tengo', '2s': 'tienes', '3s': 'tiene', '1p': 'tenemos', '2p': 'tenéis', '3p': 'tienen' })
assert_MoodTense("tener", "IndPast", { '1s': 'tuve', '2s': 'tuviste', '3s': 'tuvo', '1p': 'tuvimos', '2p': 'tuvisteis', '3p': 'tuvieron' })

assert_MoodTense("traer", "IndPres", { '1s': 'traigo', '2s': 'traes', '3s': 'trae', '1p': 'traemos', '2p': 'traéis', '3p': 'traen' })
assert_MoodTense("traer", "IndPast", { '1s': 'traje', '2s': 'trajiste', '3s': 'trajo', '1p': 'trajimos', '2p': 'trajisteis', '3p': 'trajeron' })

assert_MoodTense("vaciar", "IndPres", {"1s": "vacío", "2s": "vacías", "3s": "vacía", "1p": "vaciamos", "2p": "vaciáis", "3p": "vacían"})
assert_MoodTense("vaciar", "IndPast", {"1s": "vacié", "2s": "vaciaste", "3s": "vació",  "1p": "vaciamos", "2p": "vaciasteis", "3p": "vaciaron"})

assert_MoodTense("venir", "IndPres", {"1s": "vengo", "2s": "vienes", "3s": "viene", "1p": "venimos", "2p": "venís", "3p": "vienen"})
assert_MoodTense("venir", "IndPast", {"1s": "vine", "2s": "viniste", "3s": "vino",  "1p": "vinimos", "2p": "vinisteis", "3p": "vinieron"})

assert_MoodTense("ver", "IndPres", {"1s": "veo", "2s": "ves", "3s": "ve", "1p": "vemos", "2p": "veis", "3p": "ven"})
assert_MoodTense("ver", "IndPast", {"1s": "vi", "2s": "viste", "3s": "vio",  "1p": "vimos", "2p": "visteis", "3p": "vieron"})



assert_typographicalChange({text: "empezé", infinitive: "empezar"}, "empecé")
assert_typographicalChange({text: "conoco", infinitive: "conocer"}, "conozco")
assert_typographicalChange({text: "sacé", infinitive: "sacar"}, "saqué")
assert_typographicalChange({text: "eligo", infinitive: "elegir"}, "elijo")
assert_typographicalChange({text: "llegé", infinitive: "llegar"}, "llegué")
