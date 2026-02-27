import * as fs from 'node:fs/promises';
import { VerbConjugationExpected } from './test-support.js';
import { MoodTense } from '../index.js';


interface FormasNoPersonales {
    infinitivo: string
    gerundio: string
    participio: string
}

interface FormaAtípico {
    forma: string            // la forma limpia
    etiquetas?: string[]     // ["no normativo", "arcaico", "regional", etc.]
    nota?: string            // opcional, explicación corta si se quiere
}

interface ConjugatedForms {
    // La forma estandar
    estándar: string[]
    atípicos?: FormaAtípico[]
}
type ConjugationSlot = string[] | ConjugatedForms

interface ConjugaciónModoTiempo {
    s1?: ConjugationSlot
    s2?: ConjugationSlot
    s3?: ConjugationSlot
    p1?: ConjugationSlot
    p2?: ConjugationSlot
    p3?: ConjugationSlot
    vos?: ConjugationSlot
}


const desired_mood_tenses = ["IndPres", "IndImp", "IndPret", "IndFut", "IndCond", "SubPres", "SubImp", "SubFut", "CmdPos"]


interface ConjugaciónTabla {
    IndPres: ConjugaciónModoTiempo
    IndImp: ConjugaciónModoTiempo
    IndPret: ConjugaciónModoTiempo
    IndFut: ConjugaciónModoTiempo
    IndCond: ConjugaciónModoTiempo
    SubPres: ConjugaciónModoTiempo
    SubImp: ConjugaciónModoTiempo
    SubFut: ConjugaciónModoTiempo
    CmdPos: ConjugaciónModoTiempo
}


interface ConjugaciónEntero {
    lexicografía: {
        pronunciacion: string
        silabacion: string
        acentuacion: string
        etimologia: string
        modelos: string[]
    }
    formas_no_personales: FormasNoPersonales
    formas_personales: ConjugaciónTabla
}


const moodMap: Record<string, string> = {
  "Modo indicativo": "Ind",
  "Modo subjuntivo": "Sub",
  "Modo condicional": "Ind",
  "Modo imperativo": "Cmd",
};


const tenseMap: Record<string, string> = {
  "Presente": "Pres",
  "Pretérito imperfecto": "Imp",
  "Pretérito perfecto": "Pret",
  "Futuro": "Fut",
  "Condicional simple": "Cond",
};


const persons_order_in_page = <Array<keyof ConjugaciónModoTiempo>> ["s1", "s2", "vos", "s3", "p1", "p2", "p3"];


function extractSpanishSection(html: string): string {
    const RE_SECTION = /<h2 id="Español">/i
    const match_start = html.match(RE_SECTION)
    if (!match_start)
        throw new Error("No Spanish section")
    html = html.slice(match_start.index)
    const RE_CONJUGATION_BLOCK = /<div[^>]*>\s*<b>\s*Conjugación\s+de[\s\S]*?<\/table>/i
    const match_end = html.match(RE_CONJUGATION_BLOCK)
    if (!match_end) {
        throw new Error("No conjugation block")
    }
    const index_end_conjugation = match_end.index + match_end[0].length
    html = html.slice(0, index_end_conjugation)
    return html
}


function extractEtimologia(html: string): string | null {
    const sectionMatch = html.match(/<h3[^>]*>\s*(?:<span[^>]*><\/span>\s*)?Etimología[^<]*<\/h3>([\s\S]*?)<\/section>/i)
    if (!sectionMatch) return null
    const pMatch = sectionMatch[1].match(/<p[^>]*>([\s\S]*?)<\/p>/i)
    if (!pMatch) return null
    let text = pMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    if (text === "Si puedes, incorpórala: ver cómo.") {
        text = null
    }
    return text
}


function extractModelo(html: string) {
    const match = html.match(/paradigmas?:\s*([^<\[]+)/i)
    if (!match) return null
    const raw = match[1].trim()
    // ejemplo raw:
    // "amar (regular)"
    // "entender, tener (irregular)"
    const modelos = raw.replace(/\([^)]+\)/, "").split(",").map(v => v.trim()).filter(Boolean)
    return modelos
}


function extractGerundio(html: string): string | null {
    const re = /<th[^>]*>\s*Gerundio\s*<\/th>[\s\S]*?<td[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/i
    const match = html.match(re)
    if (!match) return null
    return match[1].replace(/<[^>]+>/g, "").trim()
}


function extractParticipio(html: string): string | null {
    const re = /<th[^>]*>\s*Participio\s*<\/th>[\s\S]*?<td[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/i
    const match = html.match(re)
    if (!match) return null
    return match[1].replace(/<[^>]+>/g, "").trim()
}


function getFormasNoPersonales(html: string) {
    let infinitivo: string
    // const infMatch = html.match(/Infinitivo[\s\S]*?>([^<>]+)<\/a>/i);
    const infMatch = html.match(/Infinitivo<\/th>\s*<td[^>]*>([^<]+)<\/td>/i)
    if (infMatch) {
        infinitivo = infMatch[1]
    }
    const gerundio = extractGerundio(html)
    const participio = extractParticipio(html)
    return {infinitivo, gerundio, participio}
}


function getFormasPersonales(html: string) {
    const legendMap = getLegendMap(html)
    const formas_personales = <ConjugaciónTabla> {}
    let currentMood: string
    let currentTense: string
    for (const rowMatch of html.matchAll(RE_ROW)) {
        const row = rowMatch[0]
        currentMood  = extractMood(row) || currentMood
        currentTense = extractTense(row)
        if (!currentMood || !currentTense)
            continue
        let mood_tense = (currentMood + currentTense) as keyof ConjugaciónTabla
        if (mood_tense === <any>"CmdPres") mood_tense = "CmdPos"
        if (!desired_mood_tenses.includes(mood_tense)) {
          continue
        }
        const table = formas_personales[mood_tense] ??= {}
        let i = 0
        for (const cellMatch of row.matchAll(RE_CELL)) {
            const person = persons_order_in_page[i++]
            const slot = parseCell(cellMatch[1], legendMap)
            if (slot)
                table[person] = slot
        }
        if (mood_tense === "CmdPos") {
            break
        }
    }
    return formas_personales
}


function getLegendMap(html: string) {
    const legendMatch = html.match(/Leyenda:\s*([^<]+)/i)
    const legendText = legendMatch ? legendMatch[1].trim() : ""
    // mapear símbolo → etiqueta
    const legendMap: Record<string, string> = {}
    legendText.split(",").forEach(part => {
        const m = part.trim().match(/^(\S+)\s+(.*)$/)
        if (m) {
            legendMap[m[1]] = m[2].trim()
        }
    })
    return legendMap
}


/**
 * Construye un slot de conjugación.
 * 
 * @param estándar La forma principal / normativa
 * @param atípicos Array opcional de formas atípicas, con etiquetas
 * @returns string si no hay excepciones, o ConjugatedForms si hay
 */
function buildConjugationSlot(
    estándar: string[],
    atípicos?: FormaAtípico[]
): ConjugationSlot {
    if (!atípicos || atípicos.length === 0) {
        return estándar
    }
    return { estándar, atípicos }
}


function parseCell(cellHtml: string, legendMap: Record<string,string>): ConjugationSlot | undefined {

    const estándar: string[] = []
    const atípicos: FormaAtípico[] = []

    for (const m of cellHtml.matchAll(RE_LINK_BLOCK)) {
        const forma = m[1].trim()
        if (forma.includes("la página no existe"))
            continue
        const symbol = m[2]?.trim()
        if (symbol && legendMap[symbol]) {
            atípicos.push({
                forma,
                etiquetas: [legendMap[symbol]]
            })
        }
        else {
            estándar.push(forma)
        }
    }

    if (!estándar.length && !atípicos.length)
        return undefined

    return buildConjugationSlot(
        estándar,
        atípicos.length ? atípicos : undefined
    )
}


const RE_ROW = /<tr[\s\S]*?<\/tr>/gi
const RE_CELL = /<td[^>]*>(.*?)<\/td>/gi
const RE_LINK_BLOCK = /<a\b[^>]*\btitle="([^"]+)"[^>]*>[\s\S]*?<\/a>(?:<sup>([^<]+)<\/sup>)?/gi
const RE_MOOD = /Modo\s+(indicativo|subjuntivo|condicional|imperativo)/i


function extractPronunciacion(html: string): string | undefined {
    const regex_pronunciación = /<tr>\s*<td[^>]*>[\s\S]*?pronunciación[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i
    const match_pronunciación = html.match(regex_pronunciación)
    if (match_pronunciación) {
        const td = match_pronunciación[1]
        // extraer IPA entre [] o /
        const regex_ipa = /[\[\/][^\]\/]+[\]\/]/
        const match_ipa = td.match(regex_ipa)
        if (match_ipa) {
            return match_ipa[0].trim()
        }
    }
}


function extractSyllabation(html: string): string | undefined {
    const regex_silabación = /<tr>\s*<td[^>]*>\s*<b>\s*silabación\s*<\/b>\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
    const match = html.match(regex_silabación)
    if (match) {
        return match[1].trim()
    }
}


function extractAcentuación(html: string): string | undefined {
    const m = html.match(/<td[^>]*>\s*<b[^>]*>\s*acentuación\s*<\/b>\s*<\/td>\s*<td[^>]*>([^<]+)/i)
    if (!m) return
    const acentuación = m?.[1].trim() ?? null
    return acentuación
}


function extractMood(row: string) {
    const moodMatch = row.match(RE_MOOD)
    if (moodMatch) {
        const mood = moodMap[`Modo ${moodMatch[1].toLowerCase()}`] ?? ""
        return mood
    }
}


function extractTense(row: string) {
    const RE_TENSE = /<th[^>]*background:[^>]*>([^<]+)(?:<sup>†<\/sup>)?<\/th>/i
    const tenseMatch = row.match(RE_TENSE)
    if (tenseMatch) {
        const tense = tenseMap[tenseMatch[1].trim()]
        return tense
    }
}


export function scrapeVerbConjugation(html: string): ConjugaciónEntero {
    const html_conjugación_española = extractSpanishSection(html)
    const pronunciacion = extractPronunciacion(html_conjugación_española)
    const silabacion = extractSyllabation(html_conjugación_española)
    const acentuacion = extractAcentuación(html_conjugación_española)
    const etimologia = extractEtimologia(html_conjugación_española)
    const modelos = extractModelo(html_conjugación_española)
    const formas_no_personales = getFormasNoPersonales(html_conjugación_española)
    const formas_personales = getFormasPersonales(html_conjugación_española)
    const lexicografía = {pronunciacion, silabacion, acentuacion, etimologia, modelos}
    const entero: ConjugaciónEntero = {lexicografía, formas_no_personales, formas_personales}
    return entero
}


export function stringifyConjugaciónEntero(entero: ConjugaciónEntero) {
    const lexicografía_template = {...entero.lexicografía}
    const json_modelos = JSON.stringify(entero.lexicografía.modelos)
    lexicografía_template.modelos = <any> "REPLACE"
    const json_lexicografía_sin_modelos = JSON.stringify(lexicografía_template, null, 2)
    const json_lexicografía = json_lexicografía_sin_modelos.replace('"REPLACE"', json_modelos)
    const json_formas_no_personales = JSON.stringify(entero.formas_no_personales)
    const formas_personales_stub: any = {}
    for (const mood_tense of desired_mood_tenses) {
        formas_personales_stub[mood_tense] = `REPLACE ${mood_tense}`
    }
    let formas_personales_template = JSON.stringify(formas_personales_stub, null, 4)
    for (const mood_tense of desired_mood_tenses) {
        const json_mood_tense_forma = JSON.stringify(entero.formas_personales[<keyof ConjugaciónTabla>mood_tense])
        const mood_tense_stub = `"REPLACE ${mood_tense}"`
        formas_personales_template = formas_personales_template.replace(mood_tense_stub, json_mood_tense_forma)
    }
    const json_formas_personales = formas_personales_template
    let json = `{\n  "lexicografía": ${json_lexicografía},\n  "formas_no_personales": ${json_formas_no_personales},\n  "formas_personales": ${json_formas_personales}\n}`
    return json
}


export function saveConjugaciónEntero(entero: ConjugaciónEntero, filename: string) {
    const json = stringifyConjugaciónEntero(entero)
    fs.writeFile(filename, json)
}


const persons_order_in_tests = <Array<keyof ConjugaciónModoTiempo>> ["s1", "s2", "s3", "p1", "p2", "p3", "vos"]


function printTests(entero: ConjugaciónEntero) {
    function getTestable_Tú_y_Vos(mood_tense: MoodTense, formas: ConjugaciónModoTiempo) {
        const {s2, vos} = formas
        if (mood_tense === "SubImp") {
            if (Array.isArray(s2) && Array.isArray(vos)) {
                if ((s2[0] === vos[0]) && (s2[1] === vos[1])) {
                    return {s2}
                }
            }
            return {s2, vos}
        } else {
            const s2_is_array = Array.isArray(s2)
            const vos_is_array = Array.isArray(vos)
            // for now only test the standard forms
            const s2_standard = (s2_is_array ? s2[0] : s2.estándar[0])
            const vos_standard = (vos_is_array ? vos[0] : vos.estándar[0])
            const tú_y_vos_differ = (s2_standard !== vos_standard)
            return {s2: s2_standard, vos: tú_y_vos_differ ? vos_standard : undefined}
        }
    }
    const {formas_no_personales, formas_personales} = entero
    const {infinitivo} = formas_no_personales
    console.log(`doTestIf([], () => {`)
    console.log(`  assert_Participles("${formas_no_personales.infinitivo}", { gerundio: "${formas_no_personales.gerundio}", participio: "${formas_no_personales.participio}" })`)
    for (const key of desired_mood_tenses) {
        const mood_tense = <MoodTense> key
        const formas = formas_personales[<keyof ConjugaciónTabla> mood_tense]
        const tú_y_vos_test = getTestable_Tú_y_Vos(mood_tense, formas)
        let persons_for_tests = (tú_y_vos_test ? persons_order_in_tests : persons_order_in_tests.slice(0,6))
        if (mood_tense === "CmdPos") {
            persons_for_tests = persons_for_tests.slice(1)
        }
        let test_args_of_forms = ""
        for (const person of persons_for_tests) {
            let formas_comprobables: VerbConjugationExpected["s1"]
            if (person === "s2") {
                formas_comprobables = <VerbConjugationExpected["s1"]> tú_y_vos_test[person]
            } else if (person === "vos") {
                formas_comprobables = (tú_y_vos_test[person] ? <VerbConjugationExpected["s1"]> tú_y_vos_test[person] : undefined)
            } else {
                if (!Array.isArray(formas[person])) {
                    throw new Error(`don't yet support formas atíipicos: ${infinitivo},${mood_tense} ${JSON.stringify(formas[person])}`)
                }
                formas_comprobables = (formas[person].length === 1) ? formas[person][0] : <[string, string]> formas[person]
            }
            if (formas_comprobables) {
                test_args_of_forms += `${person}: ${JSON.stringify(formas_comprobables)}, `
            }
        }
        console.log(`  assert_MoodTense("${formas_no_personales.infinitivo}", "${mood_tense}", {${test_args_of_forms}})`)
    }
    console.log(`})`)
}


if (process.argv.length !== 3) {
    console.log("Must give verb infinitive as only argument")
}
const infinitive = process.argv[2]

const first_letter = infinitive[0]
const html_filename = `tmp/verbos/${first_letter}/${infinitive}.html`
const json_filename = `src/conjugator/test/verbos/${first_letter}/${infinitive}.json`

const html = fs.readFile(html_filename, {encoding: "utf8"}).then((buffer) => {
   const html = buffer.toString()
   const conjugation = scrapeVerbConjugation(html)
   saveConjugaciónEntero(conjugation, json_filename)
   printTests(conjugation)
//    console.log(`conjugation=\n${JSON.stringify(conjugation, null, 4)}`)
}).catch((error) => {console.log(`Error: ${error}`)})

