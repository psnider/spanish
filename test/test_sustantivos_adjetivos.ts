import assert from "node:assert"
import { generaFormasDeSustantivo} from "../src/genera-formas-de-sustantivos.js"
import { PartOfSpeech } from "../src_dict/index.js"
import { AtributosDeAdjetivo, AtributosDeSustantivo, GéneroDeForma, IndiceDePalabrasAtribuidas } from "../src/index.js"
import { generaFormasDeAdjetivo } from "../src/genera-formas-de-adjetivos.js"


type ExpectedResults = {[forma: string]: ExpectedResult[]}
interface ExpectedResult {
    parte: PartOfSpeech
    género: GéneroDeForma
    singular: boolean
}


function test_género_pluralidad(formas: IndiceDePalabrasAtribuidas, prueba_nombre: string, lema: string, esperado: ExpectedResults) {
    const formas_esperados = Object.keys(esperado)
    assert(Object.keys(formas).length === formas_esperados.length, `${prueba_nombre}: el lema=${lema}: debe tener ${formas_esperados.length} formas`)
    for (let forma_esperado of formas_esperados) {
        const resultados_esperados = esperado[forma_esperado]
        assert(formas[forma_esperado]?.length === resultados_esperados.length, `${prueba_nombre}: la forma=${forma_esperado} de ${lema}: debe tener ${resultados_esperados.length} variaciones`)
        for (let i in resultados_esperados) {
            const atributos_esperado = resultados_esperados[i]
            const forma_atributos = <AtributosDeSustantivo | AtributosDeAdjetivo> formas[forma_esperado][i]
            assert(forma_atributos.parte === atributos_esperado.parte, `${prueba_nombre}: ${forma_esperado}[${i}]: parte desigual: ${forma_atributos.parte}`)
            assert(forma_atributos.género === atributos_esperado.género, `${prueba_nombre}: ${forma_esperado}[${i}]: género desigual: ${forma_atributos.género}`)
            assert(forma_atributos.singular === atributos_esperado.singular, `${prueba_nombre}: ${forma_esperado}[${i}]: parte singular: ${forma_atributos.singular}`)
        }
    }
}


function test_sustantivo(prueba_nombre: string, lema: string, esperado: ExpectedResults) {
    const formas = generaFormasDeSustantivo(lema)
    test_género_pluralidad(formas, prueba_nombre, lema, esperado)
}


function test_adjetivo(prueba_nombre: string, lema: string, esperado: ExpectedResults) {
    const formas = generaFormasDeAdjetivo(lema)
    test_género_pluralidad(formas, prueba_nombre, lema, esperado)
}


// function test_artículo(prueba_nombre: string, lema: string, esperado: ExpectedResults) {
//     const formas = generaFormasDeArtículo(lema)
//     test_género_pluralidad(formas, prueba_nombre, lema, esperado)
// }


test_sustantivo("test_gato_mf_o", "gato", {
    gato:  [{parte: "NOU", género: "m", singular: true}],
    gatos: [{parte: "NOU", género: "m", singular: false}],
    gata:  [{parte: "NOU", género: "f", singular: true}],
    gatas: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_jefe_mf_e", "jefe", {
    jefe:  [{parte: "NOU", género: "m", singular: true}],
    jefes: [{parte: "NOU", género: "m", singular: false}],
    jefa:  [{parte: "NOU", género: "f", singular: true}],
    jefas: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_felón_mf_n", "felón", {
    felón:  [{parte: "NOU", género: "m", singular: true}],
    felones: [{parte: "NOU", género: "m", singular: false}],
    felona:  [{parte: "NOU", género: "f", singular: true}],
    felonas: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_trabajador_mf_r", "trabajador", {
    trabajador:  [{parte: "NOU", género: "m", singular: true}],
    trabajadores: [{parte: "NOU", género: "m", singular: false}],
    trabajadora:  [{parte: "NOU", género: "f", singular: true}],
    trabajadoras: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_pájaro_m_o", "pájaro", {
    pájaro:  [{parte: "NOU", género: "m", singular: true}],
    pájaros: [{parte: "NOU", género: "m", singular: false}],
})

test_sustantivo("test_tema_m_a", "tema", {
    tema:  [{parte: "NOU", género: "m", singular: true}],
    temas: [{parte: "NOU", género: "m", singular: false}],
})

test_sustantivo("test_casa_f_a", "casa", {
    casa:  [{parte: "NOU", género: "f", singular: true}],
    casas: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_mano_f_o", "mano", {
    mano:  [{parte: "NOU", género: "f", singular: true}],
    manos: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_sartén_ambos_n", "sartén", {
    sartén:  [{parte: "NOU", género: "mf", singular: true}],
    sartenes: [{parte: "NOU", género: "mf", singular: false}],
})

test_sustantivo("test_parte_var_n", "parte", {
    parte:  [{parte: "NOU", género: "mf", singular: true}],
    partes: [{parte: "NOU", género: "mf", singular: false}],
})

test_sustantivo("test_don_irregularidad_f", "don", {
    don:  [{parte: "NOU", género: "m", singular: true}],
    dones: [{parte: "NOU", género: "m", singular: false}],
    doña:  [{parte: "NOU", género: "f", singular: true}],
    doñas: [{parte: "NOU", género: "f", singular: false}],
})

test_sustantivo("test_actor_con_2_patrones", "actor", {
    actor:    [{parte: "NOU", género: "m", singular: true}],
    actores:  [{parte: "NOU", género: "m", singular: false}],
    actriz:   [{parte: "NOU", género: "f", singular: true}],
    actrices: [{parte: "NOU", género: "f", singular: false}],
    actora:   [{parte: "NOU", género: "f", singular: true},],
    actoras:  [{parte: "NOU", género: "f", singular: false},],
})


test_adjetivo("test_actor_m_f", "actor", {
    actor:   [{parte: "ADJ", género: "m", singular: true}],
    actores: [{parte: "ADJ", género: "m", singular: false}],
    actora:  [{parte: "ADJ", género: "f", singular: true}],
    actoras: [{parte: "ADJ", género: "f", singular: false}],
})


test_adjetivo("test_actual_mf_l", "actual", {
    actual:   [{parte: "ADJ", género: "n", singular: true}],
    actuales: [{parte: "ADJ", género: "n", singular: false}],
})


test_adjetivo("test_cada_invariante", "cada", {
    cada:   [{parte: "ADJ", género: "n", singular: true}],
})


test_adjetivo("test_bueno_mf_apócope", "bueno", {
    bueno:  [{parte: "ADJ", género: "m", singular: true}],
    buenos: [{parte: "ADJ", género: "m", singular: false}],
    buena:  [{parte: "ADJ", género: "f", singular: true}],
    buenas: [{parte: "ADJ", género: "f", singular: false}],
    buen:   [{parte: "ADJ", género: "m", singular: true}],
})

test_adjetivo("test_cualquiera_n_apócope", "cualquiera", {
    cualquiera:   [{parte: "ADJ", género: "n", singular: true}],
    cualesquiera: [{parte: "ADJ", género: "n", singular: false}],
    cualquier:    [{parte: "ADJ", género: "m", singular: true}],
})

test_adjetivo("test_ese_mf_n", "ese", {
    ese:    [{parte: "ADJ", género: "m", singular: true}],
    esos:   [{parte: "ADJ", género: "m", singular: false}],
    esa:    [{parte: "ADJ", género: "f", singular: true}],
    esas:   [{parte: "ADJ", género: "f", singular: false}],
    eso:    [{parte: "ADJ", género: "n", singular: true}],
})

test_adjetivo("test_este_mf_n", "este", {
    este:    [{parte: "ADJ", género: "m", singular: true}],
    estos:   [{parte: "ADJ", género: "m", singular: false}],
    esta:    [{parte: "ADJ", género: "f", singular: true}],
    estas:   [{parte: "ADJ", género: "f", singular: false}],
    esto:    [{parte: "ADJ", género: "n", singular: true}],
})


// test_artículo("test_el", "el", {
//     el:  [{parte: "DET", género: "m", singular: true}],
//     la:  [{parte: "DET", género: "m", singular: false}],
//     los: [{parte: "DET", género: "f", singular: true}],
//     las: [{parte: "DET", género: "f", singular: false}],
//     lo:  [{parte: "DET", género: "n", singular: true}],
// })

