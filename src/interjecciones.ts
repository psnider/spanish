
interface Interjección {
    // adv?: true
    // noun?: true
    // prep?: true
}


export const indice_de_interjecciones: {[lemma: string]: Interjección} = {
    ah: {},
    ánimo: {},
    ay: {},   // noun: true
    cámara: {},
    eh: {},
    mentira: {},
    mmm: {},
    pues: {},
    qué: {},
    so: {},   // prep: true, adv: true
    ya: {},   // adv: true
}