import { PartOfSpeech } from "../src_dict/index.js"
import { Etiquetas } from "./index.js"

export interface Conjunción extends Pick<Etiquetas, "advers" | "causal" | "conc" | "copulat" | "distrib"> {
    partes: ("CON" | "SUB")[]
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
    ni:       {partes: ["CON"], copulat: true, frecuencia: 75}, 
    o:        {partes: ["CON"], copulat: true, cambio_por_sandhi: "u", frecuencia: 2000 },   // noun: true, 
    ora:      {partes: ["CON"], distrib: true, frecuencia: 10 },  // forma alternativa de: ahora
    pero:     {partes: ["CON"], advers: true, frecuencia: 800 },   // noun: true, 
    porque:   {partes: ["SUB"], causal: true, frecuencia: 600 },
    pues:     {partes: ["SUB"], frecuencia: 300 },
    que:      {partes: ["SUB"], frecuencia: 7000 },   // pron: true
    si:       {partes: ["SUB"], frecuencia: 200 },
    sino:     {partes: ["CON"], advers: true , frecuencia: 400 },   // noun: true, 
    siquiera: {partes: ["CON","SUB"], conc: true, distrib: true, frecuencia: 30 },   // adv: true, 
    y:        {partes: ["CON"], copulat: true, cambio_por_sandhi: "e", frecuencia: 5000 },   // noun: true, 
}
