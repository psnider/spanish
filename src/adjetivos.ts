import { Frecuencias } from "./index.js"


type GrammaticalPerson = "s1" | "s2" | "s3" | "p1" | "p2" | "p3" | "sp3"


// Solo especifica las formas irregulares.
// Por ejemplo: "el actor", "la actriz" (las formas plurales son normales)
export interface IrregularidadesOrtograficasDeAdjetivos {
  // singular
  f?: string
  // Es posible que no necesite esta forma, como es la del lema
//   m?: string
  // plural
//   fpl?: string
  mpl?: string
  // neutro
  // Solamente para demostrativos como "eso", "cualquiera"
  n?: string
  npl?: string
}


type GénerosDeAdjectivo = "mf" | "n"
export type Pluralidad = "s" | "p"

export interface AtributosDeAdjetivo {
    // noun?: true
    // adv?: true
    // prep?: true
    // pron?: true
    // conj?: true
    géneros: GénerosDeAdjectivo
    // solo si hay solo una forma de pluralidad
    pluralidad?: Pluralidad
    // // forma neutral
    // neutro?: string
    persona?: GrammaticalPerson
    comparativo?: true
    demostrativo?: true
    exclamativo?: true
    // Solo hay una forma, no hay diferencias por género, no hay plural
    // No acepta irregularidades.
    indefinido?: true
    interrogativo?: true
    posesivo?: true
    relativo?: true
    // Indica que la forma masculina cambia antes de un sustantivo.
    // El valor indica cual porción del sufijo debe remover.
    apócope?: string
    frecuencias?: Frecuencias
    irregularidades?: IrregularidadesOrtograficasDeAdjetivos    
}


export const indice_de_adjetivos:        {[lemma: string]: AtributosDeAdjetivo} = {
    actor:         {géneros: "mf"},  // noun: true
    actual:        {géneros: "n"},
    ambiente:      {géneros: "n"},  // noun: true
    animal:        {géneros: "n"},  // noun: true
    anterior:      {géneros: "n"},
    antes:         {géneros: "n"},
    aparte:        {géneros: "n"},  // noun: true  // adv: true
    aquel:         {géneros: "mf", demostrativo: true, irregularidades: {f: "aquella", mpl: "aquellos", n: "aquello"}},
    así:           {géneros: "n"},  // adv: true  // conj: true
    bastante:      {géneros: "n"},  // pron: true  // adv: true
    bajo:          {géneros: "mf"},  // noun: true  // adv: true  // prep: true
    blanco:        {géneros: "mf"},  // noun: true
    bonito:        {géneros: "mf"},  // noun: true
    bueno:         {géneros: "mf", apócope: "o"},
    cada:          {géneros: "n", pluralidad: "s"},
    café:          {géneros: "n"},  // noun: true
    caliente:      {géneros: "n"},
    campesino:     {géneros: "mf"},  // noun: true
    carne:         {géneros: "n"},  // noun: true
    cierto:        {géneros: "mf"},
    común:         {géneros: "n"},  // noun: true
    conjunto:      {géneros: "mf"},  // noun: true
    contenido:     {géneros: "mf"},  // noun: true
    contrario:     {géneros: "mf"},  // noun: true
    cuadro:        {géneros: "mf"},  // noun: true
    cualquiera:    {géneros: "n", indefinido: true, apócope: "a", persona: "s3", irregularidades: {npl: "cualesquiera"}},  // noun: true  // pron: true
    cuanto:        {géneros: "mf"},  // noun: true  // pron: true  // adv: true  // conj: true
    cuarto:        {géneros: "mf"},  // noun: true
    cuyo:          {géneros: "mf", relativo: true},  // noun: true
    demás:         {géneros: "n", pluralidad: "s"},  // pron: true
    demasiado:     {géneros: "mf"},  // pron: true
    diferente:     {géneros: "n"},  // adv: true
    difícil:       {géneros: "n"},
    director:      {géneros: "mf"},  // noun: true
    diverso:       {géneros: "mf"},
    don:           {géneros: "mf", irregularidades:        {f: "doña"}},  // noun: true
    ese:           {géneros: "mf", demostrativo: true, irregularidades:        {mpl: "esos", n: "eso"}},
    este:          {géneros: "mf", demostrativo: true, irregularidades:        {mpl: "estos", n: "esto"}},
    económico:     {géneros: "mf"},
    especial:      {géneros: "n"},  // noun: true
    fácil:         {géneros: "n"},  // adv: true
    federal:       {géneros: "n"},  // noun: true
    felón:         {géneros: "mf"},  // noun: true
    fondo:         {géneros: "mf"},  // noun: true
    fuerte:        {géneros: "n"},  // noun: true  // adv: true
    futuro:        {géneros: "mf"},  // noun: true
    general:       {géneros: "n"},  // noun: true
    hecho:         {géneros: "mf"},  // noun: true
    descendiente:  {géneros: "n"},  // noun: true
    humano:        {géneros: "mf"},  // noun: true
    igual:         {géneros: "n"},  // noun: true
    importante:    {géneros: "n"},
    industrial:    {géneros: "n"},  // noun: true
    internacional: {géneros: "n"},  // noun: true
    junto:         {géneros: "mf"},
    libre:         {géneros: "n"},
    malo:          {géneros: "mf", apócope: "o"},  // noun: true
    más:           {géneros: "n", pluralidad: "s"},
    mejor:         {géneros: "n"},
    menor:         {géneros: "n"},  // noun: true
    mi:            {géneros: "n", posesivo: true},  // pron: true
    mío:           {géneros: "mf", posesivo: true},
    mismo:         {géneros: "mf", },  // adv: true
    motivo:        {géneros: "mf", },  // noun: true
    mucho:         {géneros: "mf", indefinido: true},  // pron: true  // adv: true
    mundial:       {géneros: "n"},
    nacional:      {géneros: "n"},  // noun: true
    natural:       {géneros: "n"},  // noun: true
    necesario:     {géneros: "mf"},
    negro:         {géneros: "mf"},  // noun: true
    normal:        {géneros: "n"},
    nuevo:         {géneros: "mf"},
    nuestro:       {géneros: "mf", posesivo: true, persona: "p1"},
    otro:          {géneros: "mf"},
    oro:           {géneros: "n"},  // noun: true
    particular:    {géneros: "n"},  // noun: true
    partido:       {géneros: "mf"},  // noun: true
    pasado:        {géneros: "mf"},  // noun: true
    pequeño:       {géneros: "mf"},
    personal:      {géneros: "n"},  // noun: true
    poco:          {géneros: "mf", indefinido: true},  // noun: true  // pron: true
    popular:       {géneros: "n"},
    pobre:         {géneros: "n"},  // noun: true
    político:      {géneros: "mf"},  // noun: true
    preciso:       {géneros: "mf"},
    grande:        {géneros: "n", apócope: "de"},
    primero:       {géneros: "mf", apócope: "o"},  // noun: true
    principal:     {géneros: "n"},  // noun: true
    pronto:        {géneros: "mf"},  // noun: true
    propio:        {géneros: "mf"},
    qué:           {géneros: "n", pluralidad: "s", interrogativo: true, exclamativo: true},  // pron: true  // adv: true
    real:          {géneros: "n"},  // noun: true
    regular:       {géneros: "n"},  // noun: true
    santo:         {géneros: "mf", apócope: "to"},
    siguiente:     {géneros: "n"},
    simple:        {géneros: "n"},
    social:        {géneros: "n"},
    solo:          {géneros: "mf"},  // noun: true
    su:            {géneros: "n", posesivo: true, persona: "sp3"},
    suficiente:    {géneros: "n"},
    tal:           {géneros: "n", demostrativo: true, indefinido: true},  // pron: true  // adv: true
    tamaño:        {géneros: "n"},  // noun: true
    tanto:         {géneros: "mf", comparativo: true, demostrativo: true, apócope: "to"},  // noun: true  // pron: true  // adv: true
    tu:            {géneros: "n", posesivo: true, persona: "s2"},
    tuyo:          {géneros: "mf", posesivo: true, persona: "s2"},
    veinte:        {géneros: "n"},  // noun: true
    viejo:         {géneros: "mf"},  // noun: true
    uno:           {géneros: "mf", apócope: "o", frecuencias: {f: 8}},  // noun: true  // pron: true
    último:        {géneros: "mf"},
    único:         {géneros: "mf"},
    vuestro:       {géneros: "mf", posesivo: true, persona: "p2"},
    vario:         {géneros: "mf"},  // noun: true  // pron: true
}