import assert from "node:assert"
import { generaFormasDeSustantivo} from "../src/genera-formas-de-sustantivos.js"
import { AtributosSintetizados, IndiceDePalabrasAtribuidas } from "../src/index.js"
import { generaFormasDeAdjetivo } from "../src/genera-formas-de-adjetivos.js"
import { generaFormasDePronombre } from "../src/genera-formas-de-pronombres.js"


type ExpectedResults = {[forma: string]: AtributosSintetizados[]}


function test_género_pluralidad(formas: IndiceDePalabrasAtribuidas | undefined, prueba_nombre: string, lema: string, esperado: ExpectedResults) {
    assert(formas, `formas must be contain not be undefined`)
    const formas_esperados = Object.keys(esperado)
    assert(Object.keys(formas).length === formas_esperados.length, `${prueba_nombre}: el lema=${lema}: debe tener ${formas_esperados.length} formas`)
    for (let forma_esperado of formas_esperados) {
        const resultados_esperados = esperado[forma_esperado]
        assert(formas[forma_esperado]?.length === resultados_esperados.length, `${prueba_nombre}: la forma=${forma_esperado} de ${lema}: debe tener ${resultados_esperados.length} variaciones`)
        for (let i in resultados_esperados) {
            const atributos_esperado = resultados_esperados[i]
            const forma_atributos = formas[forma_esperado][i]
            assert(forma_atributos === atributos_esperado, `${prueba_nombre} [${i}]: ${forma_atributos} !== ${atributos_esperado}`)
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


function test_pronombre(prueba_nombre: string, lema: string, esperado: ExpectedResults) {
    const formas = generaFormasDePronombre(lema)
    test_género_pluralidad(formas, prueba_nombre, lema, esperado)
}


// function test_artículo(prueba_nombre: string, lema: string, esperado: ExpectedResults) {
//     const formas = generaFormasDeArtículo(lema)
//     test_género_pluralidad(formas, prueba_nombre, lema, esperado)
// }


test_sustantivo("test_gato_mf_o", "gato", {
    gato:  [ "NOU,m,s" ],
    gatos: [ "NOU,m,p" ],
    gata:  [ "NOU,f,s" ],
    gatas: [ "NOU,f,p" ],
})

test_sustantivo("test_jefe_mf_e", "jefe", {
    jefe:  [ "NOU,m,s" ],
    jefes: [ "NOU,m,p" ],
    jefa:  [ "NOU,f,s" ],
    jefas: [ "NOU,f,p" ],
})

test_sustantivo("test_felón_mf_n", "felón", {
    felón:  [ "NOU,m,s" ],
    felones: [ "NOU,m,p" ],
    felona:  [ "NOU,f,s" ],
    felonas: [ "NOU,f,p" ],
})

test_sustantivo("test_trabajador_mf_r", "trabajador", {
    trabajador:  [ "NOU,m,s" ],
    trabajadores: [ "NOU,m,p" ],
    trabajadora:  [ "NOU,f,s" ],
    trabajadoras: [ "NOU,f,p" ],
})

test_sustantivo("test_pájaro_m_o", "pájaro", {
    pájaro:  [ "NOU,m,s" ],
    pájaros: [ "NOU,m,p" ],
})

test_sustantivo("test_tema_m_a", "tema", {
    tema:  [ "NOU,m,s" ],
    temas: [ "NOU,m,p" ],
})

test_sustantivo("test_casa_f_a", "casa", {
    casa:  [ "NOU,f,s" ],
    casas: [ "NOU,f,p" ],
})

test_sustantivo("test_mano_f_o", "mano", {
    mano:  [ "NOU,f,s" ],
    manos: [ "NOU,f,p" ],
})

test_sustantivo("test_sartén_ambos_n", "sartén", {
    sartén:  [ "NOU,mf,s" ],
    sartenes: [ "NOU,mf,p" ],
})

test_sustantivo("test_parte_var_n", "parte", {
    parte:  [ "NOU,mf,s" ],
    partes: [ "NOU,mf,p" ],
})

test_sustantivo("test_don_irregularidad_f", "don", {
    don:  [ "NOU,m,s" ],
    dones: [ "NOU,m,p" ],
    doña:  [ "NOU,f,s" ],
    doñas: [ "NOU,f,p" ],
})

test_sustantivo("test_actor_con_2_patrones", "actor", {
    actor:    [ "NOU,m,s" ],
    actores:  [ "NOU,m,p" ],
    actriz:   [ "NOU,f,s" ],
    actrices: [ "NOU,f,p" ],
    actora:   [ "NOU,f,s" ,],
    actoras:  [ "NOU,f,p" ,],
})


test_adjetivo("test_actor_m_f", "actor", {
    actor:   [ "ADJ,m,s" ],
    actores: [ "ADJ,m,p" ],
    actora:  [ "ADJ,f,s" ],
    actoras: [ "ADJ,f,p" ],
})


test_adjetivo("test_actual_mf_l", "actual", {
    actual:   [ "ADJ,n,s" ],
    actuales: [ "ADJ,n,p" ],
})


test_adjetivo("test_cada_invariante", "cada", {
    cada:   [ "ADJ,n,s" ],
})


test_adjetivo("test_bueno_mf_apócope", "bueno", {
    bueno:  [ "ADJ,m,s" ],
    buenos: [ "ADJ,m,p" ],
    buena:  [ "ADJ,f,s" ],
    buenas: [ "ADJ,f,p" ],
    buen:   [ "ADJ,m,s" ],
})

test_adjetivo("test_cualquiera_n_apócope", "cualquiera", {
    cualquiera:   [ "ADJ,n,s" ],
    cualesquiera: [ "ADJ,n,p" ],
    cualquier:    [ "ADJ,m,s" ],
})

test_adjetivo("test_ese_mf_n", "ese", {
    ese:    [ "ADJ,m,s" ],
    esos:   [ "ADJ,m,p" ],
    esa:    [ "ADJ,f,s" ],
    esas:   [ "ADJ,f,p" ],
    eso:    [ "ADJ,n,s" ],
})

test_adjetivo("test_este_mf_n", "este", {
    este:    [ "ADJ,m,s" ],
    estos:   [ "ADJ,m,p" ],
    esta:    [ "ADJ,f,s" ],
    estas:   [ "ADJ,f,p" ],
    esto:    [ "ADJ,n,s" ],
})

test_pronombre("test_ese_mf_n", "ese", {
    ese:    [ "PRN,m,s,dem" ],
    esos:   [ "PRN,m,p,dem" ],
    esa:    [ "PRN,f,s,dem" ],
    esas:   [ "PRN,f,p,dem" ],
    eso:    [ "PRN,n,s,dem" ],
    ése:    [ "PRN,m,s,dem" ],
    ésos:   [ "PRN,m,p,dem" ],
    ésa:    [ "PRN,f,s,dem" ],
    ésas:   [ "PRN,f,p,dem" ],
    éso:    [ "PRN,n,s,dem" ],
})
