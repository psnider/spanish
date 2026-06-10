import { GéneroDeSustantivo, SustantivoRestringidoPorÁrea } from "./sustantivos.js"



// Solamente tienen la pluralidad de la forma primera.
// Por ejemplo, "México" no admite el plural "Méxicos".
export interface NombrePropio {
  género: GéneroDeSustantivo
  forma_alterniva?: string
  // Si está prestado de otro idioma
  préstamo?: "en"
  // Si esta palabra es un abreviatura, esto refiere a la palabra entero.
  abr?: string
  // numero por 100,000 palabras, aproximadamente 400 páginas de 250 palabras por página.
  // Debe llenar este campo con los resultados de analísis real.
  frecuencia?: number
  significados: SustantivoRestringidoPorÁrea[]
}


export const indice_de_nombres_propios: {[lemma: string]: NombrePropio} = {
    "América": {género: "f", significados: [{id: "América,f,1"}]},
    "América Central": {género: "f", significados: [{id: "América Central,f,1"}]},
    "América del Norte": {género: "f", significados: [{id: "América del Norte,f,1"}]},
    "América del Sur": {género: "f", significados: [{id: "América del Sur,f,1"}]},
    "América Latina": {género: "f", significados: [{id: "América Latina,f,1"}]},
    "Argentina": {género: "f", significados: [{id: "Argentina,f,1"}]},
    "Belice": {género: "m", significados: [{id: "Belice,m,1"}]},
    "Bolivia": {género: "f", significados: [{id: "Bolivia,f,1"}]},
    "Brasil": {género: "m", significados: [{id: "Brasil,m,1"}]},
    "Canadá": {género: "m", significados: [{id: "Canadá,m,1"}]},      // termina en -a tónica
    "Centroamérica": {género: "f", significados: [{id: "Centroamérica,f,1"}]},
    "Chile": {género: "m", significados: [{id: "Chile,m,1"}]},
    "Colombia": {género: "f", significados: [{id: "Colombia,f,1"}]},
    "Costa Rica": {género: "f", significados: [{id: "Costa Rica,f,1"}]},
    "Cuba": {género: "f", significados: [{id: "Cuba,f,1"}]},
    "Ecuador": {género: "m", significados: [{id: "Ecuador,m,1"}]},
    "España": {género: "f", significados: [{id: "España,f,1"}]},
    "Estados Unidos": {género: "m", significados: [{id: "Estados Unidos,m,1"}]},
    "El Salvador": {género: "m", significados: [{id: "El Salvador,m,1"}]},
    "Filipinas":  {género: "f", significados: [{id: "Filipinas,f,1"}]},
    "Guatemala":  {género: "f", significados: [{id: "Guatemala,f,1"}]},
    "Guayana": {género: "f", significados: [{id: "Guayana,f,1"}]},
    "Guayana Francesa": {género: "f", significados: [{id: "Guayana Francesa,f,1"}]},
    "Haití": {género: "m", significados: [{id: "Haití,m,1"}]},
    "Honduras":  {género: "f", significados: [{id: "Guatemala,f,1"}]},
    "India":   {género: "f", significados: [{id: "India,f,1"}]},
    "Irán": {género: "m", significados: [{id: "Irán,m,1"}]},
    "Japón": {género: "m", significados: [{id: "Japón,m,1"}]},
    "Latinoamérica": {género: "f", significados: [{id: "Latinoamérica,f,1"}]},
    "México": {género: "m", significados: [{id: "México,m,1"}]},
    "Nicaragua":  {género: "f", significados: [{id: "Nicaragua,f,1"}]},
    "Norteamérica": {género: "f", significados: [{id: "Norteamérica,f,1"}]},
    "Panamá": {género: "m", significados: [{id: "Panamá,m,1"}]},
    "Paraguay": {género: "m", significados: [{id: "Paraguay,m,1"}]},
    "Perú": {género: "m", significados: [{id: "Perú,m,1"}]},
    "Puerto Rico": {género: "m", significados: [{id: "Puerto Rico,m,1"}]},
    "República Dominicana": {género: "f", significados: [{id: "República Dominicana,f,1"}]},
    "Rusia": {género: "f", significados: [{id: "Rusia,f,1"}]},
    "Suramérica": {género: "f", significados: [{id: "Suramérica,f,1"}]},
    "Surinam": {género: "m", significados: [{id: "Surinam,m,1"}]},
    "Uruguay": {género: "m", significados: [{id: "Uruguay,m,1"}]},
    "Venezuela": {género: "f", significados: [{id: "Venezuela,f,1"}]},
}
