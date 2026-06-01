interface Preposición {
    adj?: true
    adv?: true
    conj?: true
    noun?: true
    interj?: true
}

const indice_de_preposiciones: {[lemma: string]: Preposición} = {
    a: {noun: true},
    ante: {noun: true},
    bastante: {adj: true, adv: true},
    bajo: {noun: true, adj: true, adv: true},
    cabe: { noun: true},
    con: {},
    contra: {noun: true},
    cuando: {conj: true, adv: true},
    de: {},
    desde: {},
    donde: {adv: true},
    durante: {},
    en: {},
    entre: {},
    hacia: {},
    hasta: {adv: true},
    mediante: {},
    para: {},
    por: {},
    según: {adv: true},
    sin: {},
    so: {adv: true, interj: true},
    sobre: {},
    tras: {noun: true},
    versus: {},
    vía: {noun: true},
}

