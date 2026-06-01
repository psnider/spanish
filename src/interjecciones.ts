
interface Interjección {
    adv?: true
    noun?: true
    prep?: true
}


const indice_de_interjecciones: {[lemma: string]: Interjección} = {
    ah: {},
    ay: {noun: true},
    eh: {},
    mmm: {},
    pues: {},
    qué: {},
    so: {prep: true, adv: true},
    ya: {adv: true}
}