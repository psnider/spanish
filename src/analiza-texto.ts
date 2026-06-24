import * as fs from "node:fs"
import { generaListaDePalabrasConAtributos, generaTodasFormasDeTodasPalabras } from "./genera-todas-formas.js"
import { generaIndiceDeFormasConjugadas } from "conjugador-espanol"
import { AtributosDeContracción, AtributosDeDesconocido, AtributosDePalabra, AtributosDePronombre, AtributosDePuntuación, AtributosDeVerbo, AtributosSintetizados, ComponenteDeContracción, GrammaticalPersonDePronombre, GéneroDeForma } from "./index.js"
import { generaSíntetis, remueveAcentoDeTerminaciónDeEnclisis } from "./genera-formas.js"

function muestraUso() {
    console.log("Usage:  -f <filename of text>")
    console.log("   or:  text [...]")
}


function getLíneasDeTexto() {
    let líneas: string[]
    if ((process.argv.length === 4) && (process.argv[2] === "-f")) {
        const archivo = process.argv[3]
        const todo = fs.readFileSync(archivo, {encoding: "utf8"})
        líneas = todo.split("\n")
    } else if (process.argv.length >= 3) {
        líneas = [process.argv.slice(2).join(" ")]
    } else {
        muestraUso()
        process.exit(1)
    }
    return líneas
}


// Separa el texto en palabras y puntuación.
// También puede tratar varios caracteres como letras, cuando no deben separarlos como:
//     -: para apellidos compuestos, como "Pérez-López"
//   0-9: Permite numeros como partes de palabras, como "i18n"
//     @: para indicar el nombre de un usuario: "@Maria"
//        un reemplazo por "a", como "c@rbón"
//        para indicar ambos generos de un palabra, como "bonit@"
//     #: para indicar un hashtag, como "#mexico"
//     &: un parte de un nombre, como "AT&T"
//     _: en nombres de archivos, como "borrador_3.pdf"
// Los demás se tratan como puntución.
// "\u0020"   " "    space
// "\u00A0"   " "    no-break space (raro en español)
// "\t"       "\t"   tab
// "\n"       "\n"   line feed
// "\r"       "\r"   carriage return
const espacios_regex = /\s+/
// \u2012   ‒   figure dash
// \u2013   –   en dash
// \u2014   —   em dash
// \u2015   ―   quotation dash
// \u2212   −   minus sign
// \uFE63   ﹣   small hyphen
// \uFF0D   －   fullwidth hyphen
// -        -   hyphen-minus
const palabra_o_símbolo_regex = /^([-a-záéíóúüñ0-9_@#$%]+)$/i
const signos_de_citas = "\"'\u00AB\u00BB\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u2039\u203A\u300C\u300D\u300E\u300F\u301D\u301E\u301F\uFE41\uFE42\uFE43\uFE44\uFF02\uFF07"
const guiones_especiales = "\u2012\u2013\u2014\u2015\u2212\uFE63\uFF0D"
const puntuacion_base = "`~!^&*()=+{}[\\]:;<>.,?|/¿¡…"
const puntuación_secuencia_regex = new RegExp(`([${puntuacion_base}${signos_de_citas}${guiones_especiales}]+)`)
const numero_real_sin_exponente = "(?:[-+]?\\d+(?:\\.\\d*)?|\\.\\d+)"
const numero_normal_regex = new RegExp(`^${numero_real_sin_exponente}(?:e${numero_real_sin_exponente})?$`)
const numero_computacional_regex = /^(o[0-7]+|0x[0-9a-f]+)+$/i


// Match URL
// parts: 1=protocol, 2=domain, 3=port, 4=page
const url_regex = /^([fghitps]+:\/\/)?([a-z0-9]+\.(?:ai|com|es|io|mx|org|uk))(:\d+)?(\/[a-z0-9\/]+)?/
// Tokeniza el texto dado.
// Los tokens pueden ser:
//   palabras simples, como "bueno"
//   palabras compuestos, como "anti-balas"
//   palabras como simbolos, como "i18n", "#vivir", "@FIFA"
//   secuencias de puntuación, como ".", ";", "!?", "!!!!", "*******", "------"
//
// apoya: pa’que
function tokeniza(texto: string) {
    // al principio, separa por los espacios en blanco.
    const separados = texto.split(espacios_regex)
    const tokenes: string[] = []
    for (let separado of separados) {
        if (separado.match(url_regex)) {
            tokenes.push(separado)
        } else {
            // separa secuencias de puntuación
            // hay un problema cuando hay puntuación que es una parte de un token, como una marca "AT&T" o un numero "1,200.67"
            const con_puntuación = separado.split(puntuación_secuencia_regex).filter(parte => parte.length > 0)
            for (let fragmento of con_puntuación) {
                const empieza_con_guion = fragmento.startsWith("-")
                if (empieza_con_guion) {
                    fragmento = fragmento.slice(1)
                    tokenes.push("-")
                }
                const termina_con_guion = fragmento.endsWith("-")
                if (termina_con_guion) {
                    fragmento = fragmento.slice(0, -1)
                }
                if (fragmento) {
                    tokenes.push(fragmento)
                }
                if (termina_con_guion) {
                    tokenes.push("-")
                }
            }
        }
    }
    return tokenes
}


const todas_palabras = generaTodasFormasDeTodasPalabras()
console.log(`todas_palabras contiene ${Object.keys(todas_palabras).length} formas`)


// grupos de captura:
// 1: la forma del verbo, infinitivo o imperativo
// 2: la terminación del verbo, si termina con "r" es un infinitivo
// 3: el objeto indirecto
// 4: el objeto directo
// FIX: posiblemente tenga que dividir las formas...
// ORG: const enclisis_infinitivo_regex = /([a-záéíóúüñ]+?([aáeéií]r|[aeiouáéíóúlnz]))(me|te|le|se|nos|os|les)?(la|lo|las|los)?$/i
const oi_od_terminación = "(me|te|le|se|nos|os|les)?(lo|la|los|las)?$"
const enclisis_regex = new RegExp(`^(.*?(?:[aáeéií]r|[aáeéií]ndo|[aáeéií]n?|d|e|a|í|i))${oi_od_terminación}$`, "iu")
const terminaciones_de_adjetivos = /(ble|érrimo|ísimo|ista|os[ao])s?$/i
const terminaciones_de_adverbios = /(mente|ísimamente)$/i
const terminaciones_de_sustantivos = /(ajes?|ari[ao]s?|c[ií]as?|[cs]ión|[cs]iones|dad(es)?|ez|eces|ezas?|ismos?|istas?|mientos?|torios?)$/i


const objeto_indirecto_a_persona_mapa: {[oi: string]: GrammaticalPersonDePronombre} = {
    me:  "s1",
    te:  "s2",
    se:  "sp3",
    nos: "p1",
    os:  "p2"
}

const objeto_directo_a_persona_mapa: {[od: string]: {persona: GrammaticalPersonDePronombre, género: GéneroDeForma}} = {
    lo:  {persona: "s3", género: "m"},
    la:  {persona: "s3", género: "f"},
    los: {persona: "p3", género: "m"},
    las: {persona: "p3", género: "f"},
}

// FIX: necesita apoyar: GERUNDIO + DO
// FIX: no admite "tranquilo"
// fíjense, fíjensé, irse, irte

function parsaEnclisis(token: string) : AtributosDeContracción | undefined {
    const token_sin_acento_final = remueveAcentoDeTerminaciónDeEnclisis(token)
    const match = token_sin_acento_final.match(enclisis_regex)
    if (match) {
        const expandido: ComponenteDeContracción[] = []
        const verbo = match[1]
        const objeto_indirecto = match[2]
        const objeto_directo = match[3]
        if (objeto_indirecto || objeto_directo) {
            let verbo_atributos: AtributosDeVerbo = {parte: "vrb"}
            if (verbo.slice(-1) === "r") {
                verbo_atributos.deriv = "inf"
            } else if (verbo.slice(-3) === "ndo") {
                verbo_atributos.deriv = "ger"
            } else {
                verbo_atributos.modo_tiempo = "CmdPos"
                // FIX: busqua el forma de verbo en el conjugador
                // verbo_atributos.infinitivo = inferirInfinitivo(verbo)
            }
            expandido.push({palabra: verbo, atributos: verbo_atributos})
            if (objeto_indirecto) {
                const persona = objeto_indirecto_a_persona_mapa[objeto_indirecto]
                let atributos: AtributosDePronombre = {parte: "PRN",  persona}
                if (objeto_directo) {
                    atributos.oi = true
                }
                const componente: ComponenteDeContracción = {palabra: objeto_indirecto, atributos}
                expandido.push(componente)
            }
            if (objeto_directo) {
                const {persona, género} = objeto_directo_a_persona_mapa[objeto_directo]
                let atributos: AtributosDePronombre = {parte: "PRN", od: true, persona, género}
                expandido.push({palabra: objeto_directo, atributos})
            }
            const atributos: AtributosDeContracción = {parte: "CTN", expandido}
            return atributos
        }
    }
}


const superlativo_regex = /ísim[ao]$/


// FIX: debe apoyar "irse", "irte", etc.
function adivinaLosAtributos(token: string, token_está_capitalizado: boolean) : AtributosSintetizados[] | undefined{
    if (token.match(palabra_o_símbolo_regex)) {
        const posibilidades: AtributosSintetizados[] = []
        let match = token.match(terminaciones_de_adjetivos)
        if (match) {
            posibilidades.push("adj")
        }
        match = token.match(terminaciones_de_adverbios)
        if (match) {
            posibilidades.push("adv")
        }
        match = token.match(terminaciones_de_sustantivos)
        if (match) {
            posibilidades.push("nou")
        }
        match = token.match(superlativo_regex)
        if (match) {
            posibilidades.push("adj,super")
        }
        const atributos_de_enclisis = parsaEnclisis(token)
        if (atributos_de_enclisis) {
            const lista = generaListaDePalabrasConAtributos(atributos_de_enclisis)
            // FIX: apoya frecuencia
            const síntesis = `ctn${lista}`
            posibilidades.push(síntesis)
        }
        if (token_está_capitalizado) {
            posibilidades.push("nam")
        }
        if (posibilidades.length > 0) {
            return posibilidades
        }
    }
}

const terminaction_de_diminuativo_regex = /(e?c)?it([ao])s?$/
// FIX: añada forma de -ísimo/a, p.ej.: muchísimas, poderosísima

function atributosDeDiminuativo(token_en_minúsculo: string) : string[] | undefined {
    let match = token_en_minúsculo.match(terminaction_de_diminuativo_regex)
    if (match) {
        const base = token_en_minúsculo.slice(0, match.index)
        const base_con_terminación = base + match[2]
        let atributos = todas_palabras[base_con_terminación] || todas_palabras[base]
        if (atributos) {
            const modificados: string[] = []
            for (const atributo of atributos) {
                if (!atributo.startsWith("VRB,")) {
                    modificados.push(atributo + ",dim")
                }
            }
            if (modificados.length > 0) {
                return modificados
            }
        }
        return ["UNK,dim"]
    }
}


// Genera atributos apropiados por cada token.
// @return una lista de atributos posibles por token, cada entrada es una lista de posibilidades, y
//     la lista primera tiene el mismo numero de entradas con 'tokenes', corresponden una con una
export function generaAtributosLéxicosDeTexto(tokenes: string[]) {
    const puntuación: AtributosSintetizados = "PNC"
    const desconocido: AtributosSintetizados = "UNK"
    const numero: AtributosSintetizados = "NUM"
    const atributos_por_token: AtributosSintetizados[][] = []
    for (let token of tokenes) {
        const atributos_sintetizados: AtributosSintetizados[] = []
        const token_en_minúsculo = token.toLocaleLowerCase("es")
        const token_está_capitalizado = (token[0] !== token_en_minúsculo[0])
        const atributos = todas_palabras[token_en_minúsculo]
        if (atributos) {
            atributos_sintetizados.push(...atributos)
        } else {
            const atributos_diminuativos = atributosDeDiminuativo(token_en_minúsculo)
            if (atributos_diminuativos) {
                atributos_sintetizados.push(...atributos_diminuativos)
            } else if (token_en_minúsculo.match(puntuación_secuencia_regex)) {
                atributos_sintetizados.push(puntuación)
            } else if (token_en_minúsculo.match(numero_normal_regex)) {
                atributos_sintetizados.push(numero)
            } else {
                const atributos = adivinaLosAtributos(token_en_minúsculo, token_está_capitalizado)
                if (atributos) {
                    atributos_sintetizados.push(...atributos)
                } else {
                    atributos_sintetizados.push(desconocido)
                }
            }
        }
        atributos_por_token.push(atributos_sintetizados)
    }
    return atributos_por_token
}


// FIX: considera cómo identificar:
//    URLs
//    direcciones de correo electrónico
function analizaTexto() {
    const líneas = getLíneasDeTexto()
    for (let línea_i in líneas) {
        const línea = líneas[línea_i]
        console.log(`${línea_i}: ${línea}`)
        const tokenes = tokeniza(línea)
        const atributos_por_token = generaAtributosLéxicosDeTexto(tokenes)
        if (tokenes.length !== atributos_por_token.length) {
            console.log(`tokenes y atributos_por_token tienen que tener el mismo numbero de entradas.`)
        }
        for (let token_i in atributos_por_token) {
            const token = tokenes[token_i]
            const atributos = atributos_por_token[token_i]
            console.log(`${línea_i},${token}: ${JSON.stringify(atributos)}`)
        }
    }
}


analizaTexto()

// let tokens = "con Y le mandaba el papelito con la hermana que me".split(" ")
// for (let token of tokens) {
//     const atributos = todas_palabras[token]
//     console.log(`${token}: ${JSON.stringify(atributos)}`)
// }
