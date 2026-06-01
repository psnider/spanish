
interface Conjunción {
    adj?: true
    adv?: true
    noun?: true
    prep?: true
    pron?: true
    copulativo?: true
    adversativo?: true
    causal?: true
    concesivo?: true
    distributivo?: true
    cambio_por_sandhi?: string 
}


const indice_de_conjunciones: {[lemma: string]: Conjunción} = {
    así: {adj: true, adv: true},
    aunque: {},
    con: {},
    como: {adv: true},
    cuando: {prep: true, adv: true},
    cuanto: {noun: true, adj: true, adv: true, pron: true},
    mas: {},
    o: {noun: true, copulativo: true, cambio_por_sandhi: "u"},
    ora: {distributivo: true},
    pero: {noun: true, adversativo: true},
    porque: {causal: true},
    pues: {},
    que:      {pron: true},
    si:   {},
    sino: {noun: true, adversativo: true },
    siquiera: {adv: true, concesivo: true, distributivo: true},
    y: {noun: true, copulativo: true, cambio_por_sandhi: "e"},
}
