import { PartOfSpeech } from "../src_dict/index.js"

export interface Conjunción {
    partes: ("CON" | "SUB")[]
    // adj?: true
    // adv?: true
    // noun?: true
    // prep?: true
    // pron?: true
    copulativo?: true
    adversativo?: true
    causal?: true
    concesivo?: true
    distributivo?: true
    cambio_por_sandhi?: string 
    frecuencia: number
}


export const indice_de_conjunciones: {[lemma: string]: Conjunción} = {
    así:      {partes: ["CON","SUB"], frecuencia: 150 },   // adj: true, adv: true
    aunque:   {partes: ["SUB"], frecuencia: 250 },
    como:     {partes: ["SUB"], frecuencia: 1000 },   // adv: true
    cuando:   {partes: ["SUB"], frecuencia: 400 },   // prep: true, adv: true
    cuanto:   {partes: ["SUB"], frecuencia: 20 },   // noun: true, adj: true, adv: true, pron: true
    mas:      {partes: ["CON"], frecuencia: 150 },
    o:        {partes: ["CON"], copulativo: true, cambio_por_sandhi: "u", frecuencia: 2000 },   // noun: true, 
    ora:      {partes: ["CON"], distributivo: true, frecuencia: 10 },  // forma alternativa de: ahora
    pero:     {partes: ["CON"], adversativo: true, frecuencia: 800 },   // noun: true, 
    porque:   {partes: ["SUB"], causal: true, frecuencia: 600 },
    pues:     {partes: ["SUB"], frecuencia: 300 },
    que:      {partes: ["SUB"], frecuencia: 7000 },   // pron: true
    si:       {partes: ["SUB"], frecuencia: 200 },
    sino:     {partes: ["CON"], adversativo: true , frecuencia: 400 },   // noun: true, 
    siquiera: {partes: ["CON","SUB"], concesivo: true, distributivo: true, frecuencia: 30 },   // adv: true, 
    y:        {partes: ["CON"], copulativo: true, cambio_por_sandhi: "e", frecuencia: 5000 },   // noun: true, 
}
