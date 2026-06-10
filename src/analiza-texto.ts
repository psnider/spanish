import * as fs from "node:fs"
import { generaTodasFormasDeTodasPalabras } from "./genera-todas-formas.js"
import { generaIndiceDeFormasConjugadas } from "conjugador-espanol"
import { AtributosDeContracción, AtributosDeDesconocido, AtributosDePalabra, AtributosDePronombre, AtributosDePuntuación, AtributosDeVerbo, ComponenteDeContracción, GéneroDeForma } from "./index.js"
import { GrammaticalPersonDePronombre, GéneroDePronombre } from "./pronombres-etc.js"

function muestraUso() {
    console.log("Usage:  -f <filename of text>")
    console.log("   or:  text [...]")
}


function getTexto() {
    let texto: string
    if ((process.argv.length === 4) && (process.argv[2] === "-f")) {
        const archivo = process.argv[3]
        texto = fs.readFileSync(archivo, {encoding: "utf8"})
    } else if (process.argv.length >= 3) {
        texto = process.argv.slice(2).join(" ")
    } else {
        muestraUso()
        process.exit(1)
    }
    return texto
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
const puntuacion_base = "`~!^&*()=+{}[\\]:;<>.,?|/¿¡"
const puntuación_secuencia_regex = new RegExp(`([${puntuacion_base}${signos_de_citas}${guiones_especiales}]+)`)

// Tokeniza el texto dado.
// Los tokens pueden ser:
//   palabras simples, como "bueno"
//   palabras compuestos, como "anti-balas"
//   palabras como simbolos, como "i18n", "#vivir", "@FIFA"
//   secuencias de puntuación, como ".", ";", "!?", "!!!!", "*******", "------"
function tokeniza(texto: string) {
    // al principio, separa por los espacios en blanco.
    const separados = texto.split(espacios_regex)
    const tokenes: string[] = []
    for (let separado of separados) {
        // separa secuencias de puntuación
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
    return tokenes
}


const todas_palabras = generaTodasFormasDeTodasPalabras()


// grupos de captura:
// 1: la forma del verbo, infinitivo o imperativo
// 2: la terminación del verbo, si termina con "r" es un infinitivo
// 3: el objeto indirecto
// 4: el objeto directo
const enclisis_regex = /([a-záéíóúüñ]+?([aáeéií]r|[aeiouáéíóúlnz]))(me|te|se|nos|os)?(la|lo|las|los)?$/i
const terminaciones_de_adjetivos = /(ble|ísimo|érrimo|os[ao])s?$/i
const terminaciones_de_adverbios = /(mente|ísimamente)$/i
const terminaciones_de_sustantivos = /([cs]ión|[cs]iones|dad(es)?|ez|eces|ezas?|ismos?|ajes?|torios?)$/i


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

function parsaEnclisis(token: string) : AtributosDeContracción | undefined {
    const match = token.match(enclisis_regex)
    if (match) {
        const expandido: ComponenteDeContracción[] = []
        const verbo = match[1]
        const terminación = match[2]
        const objeto_indirecto = match[3]
        const objeto_directo = match[4]
        if (objeto_indirecto || objeto_directo) {
            let verbo_atributos: AtributosDeVerbo = {parte: "vrb"}
            if (terminación.slice(-1) === "r") {
                verbo_atributos.forma = "inf"
            } else {
                verbo_atributos.modo_tiempo = "CmdPos"
                // FIX: busqua el forma de verbo en l
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

function adivinaLosAtributos(token: string) : AtributosDePalabra | undefined{
    if (token.match(palabra_o_símbolo_regex)) {
        let match = token.match(terminaciones_de_adjetivos)
        if (match) {
            return {parte: "adj"}
        }
        match = token.match(terminaciones_de_adverbios)
        if (match) {
            return {parte: "adv"}
        }
        match = token.match(terminaciones_de_sustantivos)
        if (match) {
            return {parte: "nou"}
        }
        const atributos = parsaEnclisis(token)
        if (atributos) {
            return atributos
        }
    }
}


// Genera atributos apropiados por cada token.
export function generaAtributosLéxicosDeTexto(tokenes: string[]) {
    const puntuación: AtributosDePuntuación = {parte: "PNC"}
    const desconocido: AtributosDeDesconocido = {parte: "UNK"}
    const atributos_por_token: AtributosDePalabra[][] = []
    for (let token of tokenes) {
        const token_en_minúsculo = token.toLocaleLowerCase("es")
        const atributos = todas_palabras[token_en_minúsculo]
        if (atributos) {
            atributos_por_token.push(atributos)
        } else {
            if (token.match(puntuación_secuencia_regex)) {
                atributos_por_token.push([puntuación])
            } else {
                const atributos = adivinaLosAtributos(token)
                if (atributos) {
                    atributos_por_token.push([atributos])
                } else {
                    atributos_por_token.push([desconocido])
                }
            }
        }
    }
    return atributos_por_token
}


const texto = getTexto()
const tokenes = tokeniza(texto)
const atributos_por_token = generaAtributosLéxicosDeTexto(tokenes)
if (tokenes.length !== atributos_por_token.length) {
    console.log(`tokenes y atributos_por_token tienen que tener el mismo numbero de entradas.`)
}
for (let i in atributos_por_token) {
    const token = tokenes[i]
    const atributos = atributos_por_token[i]
    console.log(`${token}: ${JSON.stringify(atributos)}`)
}



