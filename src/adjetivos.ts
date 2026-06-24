import { Etiquetas, Frecuencias } from "./index.js"


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


type GénerosDeAdjectivo = "mf" | "n" | "f"
export type Pluralidad = "s" | "p"

export interface AtributosDeAdjetivo extends Pick<Etiquetas, "comp" | "dem" | "excl" | "indef" | "interrog" | "poses" | "relat">{
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
    // Indica que la forma masculina cambia antes de un sustantivo.
    // El valor es la forma.
    apócope?: string
    préstamo?: "en"
    frecuencias?: Frecuencias
    irregularidades?: IrregularidadesOrtograficasDeAdjetivos    
}


export const indice_de_adjetivos:        {[lemma: string]: AtributosDeAdjetivo} = {
    actor:         {géneros: "mf"},  // noun: true
    actual:        {géneros: "n"},
    eufórico:      {géneros: "mf"},
    alguno:        {géneros: "mf", indef: true, apócope: "algún" },
    ambiente:      {géneros: "n"},  // noun: true
    animal:        {géneros: "n"},  // noun: true
    anterior:      {géneros: "n"},
    antes:         {géneros: "n"},
    aparte:        {géneros: "n"},  // noun: true  // adv: true
    aquel:         {géneros: "mf", dem: true, irregularidades: {f: "aquella", mpl: "aquellos", n: "aquello"}},
    argentino:     {géneros: "mf"},
    aristocrático: {géneros: "mf"},
    así:           {géneros: "n"},  // adv: true  // conj: true
    bastante:      {géneros: "n"},  // pron: true  // adv: true
    bajo:          {géneros: "mf"},  // noun: true  // adv: true  // prep: true
    blanco:        {géneros: "mf"},  // noun: true
    bonito:        {géneros: "mf"},  // noun: true
    bueno:         {géneros: "mf", apócope: "buen"},
    cada:          {géneros: "n", pluralidad: "s"},
    café:          {géneros: "n"},  // noun: true
    caliente:      {géneros: "n"},
    campesino:     {géneros: "mf"},  // noun: true
    carmelita:     {géneros: "f"},
    carne:         {géneros: "n"},  // noun: true
    cierto:        {géneros: "mf"},
    claro:         {géneros: "mf"},
    común:         {géneros: "n"},  // noun: true
    conjunto:      {géneros: "mf"},  // noun: true
    contenido:     {géneros: "mf"},  // noun: true
    contrario:     {géneros: "mf"},  // noun: true
    corto:         {géneros: "mf"},
    cuadro:        {géneros: "mf"},  // noun: true
    cualquiera:    {géneros: "n", indef: true, apócope: "cualquier", persona: "s3", irregularidades: {npl: "cualesquiera"}},  // noun: true  // pron: true
    cuanto:        {géneros: "mf"},  // noun: true  // pron: true  // adv: true  // conj: true
    cuarto:        {géneros: "mf"},  // noun: true
    cuyo:          {géneros: "mf", relat: true},  // noun: true
    delgado:       {géneros: "mf"},
    demás:         {géneros: "n", pluralidad: "s"},  // pron: true
    demasiado:     {géneros: "mf"},  // pron: true
    descalza:      {géneros: "mf"}, 
    diferente:     {géneros: "n"},  // adv: true
    difícil:       {géneros: "n"},
    director:      {géneros: "mf"},  // noun: true
    diverso:       {géneros: "mf"},
    don:           {géneros: "mf", irregularidades:        {f: "doña"}},  // noun: true
    drástico:      {géneros: "mf"},
    ese:           {géneros: "mf", dem: true, irregularidades:        {mpl: "esos", n: "eso"}},
    este:          {géneros: "mf", dem: true, irregularidades:        {mpl: "estos", n: "esto"}},
    económico:     {géneros: "mf"},
    especial:      {géneros: "n"},  // noun: true
    espiritual:    {géneros: "mf"},
    exterior:      {géneros: "mf"},
    fácil:         {géneros: "n"},  // adv: true
    familiar:      {géneros: "n"},
    federal:       {géneros: "n"},  // noun: true
    felón:         {géneros: "mf"},  // noun: true
    fondo:         {géneros: "mf"},  // noun: true
    fuerte:        {géneros: "n"},  // noun: true  // adv: true
    futuro:        {géneros: "mf"},  // noun: true
    general:       {géneros: "n"},  // noun: true
    hecho:         {géneros: "mf"},  // noun: true
    descendiente:  {géneros: "n"},  // noun: true
    habitante:     {géneros: "n"},
    humano:        {géneros: "mf"},  // noun: true
    igual:         {géneros: "n"},  // noun: true
    implícito:     {géneros: "mf"},
    importante:    {géneros: "n"},
    industrial:    {géneros: "n"},  // noun: true
    inglés:        {géneros: "mf"},  // noun: true
    inmediato:     {géneros: "mf"}, 
    internacional: {géneros: "n"},  // noun: true
    junto:         {géneros: "mf"},
    libre:         {géneros: "n"},
    malo:          {géneros: "mf", apócope: "mal"},  // noun: true
    marrón:        {géneros: "n"},
    más:           {géneros: "n", pluralidad: "s"},
    mejor:         {géneros: "n"},
    menor:         {géneros: "n"},  // noun: true
    mi:            {géneros: "n", poses: true},  // pron: true
    mío:           {géneros: "mf", poses: true, persona: "s1"},
    mismo:         {géneros: "mf", },  // adv: true
    motivo:        {géneros: "mf", },  // noun: true
    mucho:         {géneros: "mf", indef: true},  // pron: true  // adv: true
    mundial:       {géneros: "n"},
    nacional:      {géneros: "n"},  // noun: true
    natural:       {géneros: "n"},  // noun: true
    necesario:     {géneros: "mf"},
    negro:         {géneros: "mf"},  // noun: true
    normal:        {géneros: "n"},
    nuclear:       {géneros: "n"},
    nuevo:         {géneros: "mf"},
    nuestro:       {géneros: "mf", poses: true, persona: "p1"},
    otro:          {géneros: "mf"},
    oro:           {géneros: "n"},  // noun: true
    particular:    {géneros: "n"},  // noun: true
    partido:       {géneros: "mf"},  // noun: true
    pasado:        {géneros: "mf"},  // noun: true
    pequeño:       {géneros: "mf"},
    personal:      {géneros: "n"},  // noun: true
    poco:          {géneros: "mf", indef: true},  // noun: true  // pron: true
    popular:       {géneros: "n"},
    pobre:         {géneros: "n"},  // noun: true
    político:      {géneros: "mf"},  // noun: true
    preciso:       {géneros: "mf"},
    prior:         {géneros: "mf"},
    grande:        {géneros: "n", apócope: "gran"},
    primero:       {géneros: "mf", apócope: "primer"},  // noun: true
    principal:     {géneros: "n"},  // noun: true
    privado:       {géneros: "mf"}, // tb. es participio de "privar"
    procedente:    {géneros: "n"},
    pronto:        {géneros: "mf"},  // noun: true
    propio:        {géneros: "mf"},
    qué:           {géneros: "n", pluralidad: "s", interrog: true, excl: true},  // pron: true  // adv: true
    radiactivo:    {géneros: "mf"},
    rápido:        {géneros: "mf"},
    real:          {géneros: "n"},  // noun: true
    regular:       {géneros: "n"},  // noun: true
    relleno:       {géneros: "mf"},
    santo:         {géneros: "mf", apócope: "san"},
    seguro:        {géneros: "mf"},
    siguiente:     {géneros: "n"},
    simple:        {géneros: "n"},
    social:        {géneros: "n"},
    solo:          {géneros: "mf"},  // noun: true
    su:            {géneros: "n", poses: true, persona: "sp3"},
    suficiente:    {géneros: "n"},
    superior:      {géneros: "mf"}, 
    suyo:          {géneros: "mf", poses: true, persona: "sp3"},
    tal:           {géneros: "n", dem: true, indef: true},  // pron: true  // adv: true
    tamaño:        {géneros: "n"},  // noun: true
    tanto:         {géneros: "mf", comp: true, dem: true, apócope: "tan"},  // noun: true  // pron: true  // adv: true
    todo:          {géneros: "mf"},
    tu:            {géneros: "n", poses: true, persona: "s2"},
    turbulento:    {géneros: "mf"},
    tuyo:          {géneros: "mf", poses: true, persona: "s2"},
    veinte:        {géneros: "n"},  // noun: true
    viejo:         {géneros: "mf"},  // noun: true
    último:        {géneros: "mf"},
    único:         {géneros: "mf"},
    uno:           {géneros: "mf", apócope: "un", frecuencias: {f: 8}},  // noun: true  // pron: true
    vario:         {géneros: "mf"},  // noun: true  // pron: true
    verde:         {géneros: "n"},
    vuestro:       {géneros: "mf", poses: true, persona: "p2"},
    estricto:      {géneros: "mf"},
    postulante:    {géneros: "n"},
    antiguo:       {géneros: "mf"},
    incluso:       {géneros: "n"},
    perfecto:      {géneros: "mf"},
    débil:       {géneros: "n"},
    sagrado:     {géneros: "mf"},
    exclusivo:   {géneros: "mf"},
    pecador:     {géneros: "mf"},
    severo:     {géneros: "mf"},
    mortal:       {géneros: "n"},
    católico:     {géneros: "mf"},
    raquítico:     {géneros: "mf"},
    psicólogo:     {géneros: "mf"},
    grabador:  {géneros: "mf"},
    gratuito:  {géneros: "mf"},
    creador:  {géneros: "mf"},
    editorial:       {géneros: "n"},
    original:  {géneros: "n"},
    freelance: {géneros: "n", préstamo: "en" },
    condicional:  {géneros: "n"},
    vital:  {géneros: "n"},
    ilegítimo:  {géneros: "mf"},
    efectivo:  {géneros: "mf"},
    histórico: {géneros: "mf"},
    fiscal: {géneros: "n"},
    culto: {géneros: "mf"},
    componente: {géneros: "n"},
    canónico: {géneros: "mf"},
    experto: {géneros: "mf"},
    ex:      {géneros: "n", pluralidad: "s"},
    defensor: {géneros: "mf"},
    feliz: {géneros: "n"},
    infeliz: {géneros: "n"},
    triste: {géneros: "n"},
    alegre: {géneros: "n"},
    papal: {géneros: "n"},
    suave: {géneros: "n"},
    eclesiástico: {géneros: "mf"},
    obligatorio: {géneros: "mf"},
    colectivo: {géneros: "mf"},
    judicial: {géneros: "n"},
    terrorífico: {géneros: "mf"},
    enfermo: {géneros: "mf"},
    enfermero: {géneros: "mf"},
    temprano: {géneros: "mf"},
    electrónico: {géneros: "mf"},
    peor: {géneros: "n"},
    listo: {géneros: "mf"},
    ninguno: {géneros: "mf", apócope: "ningún", indef: true},
    primo: {géneros: "mf"},
    concreto: {géneros: "mf"},
    abusador: {géneros: "mf"},
    abusivo: {géneros: "mf"},
    cuál: {géneros: "n"},
    psicológico: {géneros: "mf"},
    médico: {géneros: "mf"},
    correcto: {géneros: "mf"},
    físico: {géneros: "mf"},
    verbal: {géneros: "n"},
    frágil: {géneros: "n"},
    delicado: {géneros: "mf"},
    perplejo: {géneros: "mf"},
    confuso: {géneros: "mf"},
    vago: {géneros: "mf"},
    narrativo: {géneros: "mf"},
    computadora: {géneros: "mf"},
    ortodoxo: {géneros: "mf"},
    puro: {géneros: "mf"},
    tenso: {géneros: "mf"},
    tercero: {géneros: "mf"},
    cuánto: {géneros: "mf", interrog: true, excl: true },
    verdadero: {géneros: "mf" },
    chico: {géneros: "mf" },
    preso: {géneros: "mf" },
    liviano: {géneros: "mf" },
    carismático: {géneros: "mf" },
    histriónico: {géneros: "mf" },
    adulto: {géneros: "mf" },
    aaaaa: {géneros: "n"},
    anémico: {géneros: "mf" },
    raro: {géneros: "mf" },
    hueso: {géneros: "n"},
    mental: {géneros: "n"},
    bienvenido: {géneros: "mf" },
    definitivo: {géneros: "mf" },
    solemne: {géneros: "n"},
    cerámico:  {géneros: "mf" },
    piola: {géneros: "n"},
    próximo:  {géneros: "mf" },
    sencillo:  {géneros: "mf" },
    consumidor:  {géneros: "mf" },
    químico:  {géneros: "mf" },
    perdido:  {géneros: "mf" },
    satisfecho:  {géneros: "mf" },
    orgulloso:  {géneros: "mf" },
    desesperado: {géneros: "mf" },
    expuesto: {géneros: "mf" },
    obrero: {géneros: "mf" },
    mero: {géneros: "mf" },
    doceno: {géneros: "mf" },
    investigador: {géneros: "mf" },
    clínico: {géneros: "mf" },
    acumulativo: {géneros: "mf" },
    moderno: {géneros: "mf" },
    celular:  {géneros: "n" },
    graso: {géneros: "mf" },
    supervisor: {géneros: "mf" },
    contenedor: {géneros: "mf" },
    estudiante: {géneros: "mf" },
    temporal: {géneros: "mf" },
    masivo: {géneros: "mf" },
    ácido: {géneros: "mf" },
    ruidoso: {géneros: "mf" },
    ejecutivo: {géneros: "mf" },
    gobernador: {géneros: "mf" },
    repetitivo: {géneros: "mf" },
    poderoso: {géneros: "mf" },
    enorme: {géneros: "n" },
    cercano: {géneros: "mf" },
    intensivo: {géneros: "mf" },
    burocrático: {géneros: "mf" },
    grave: {géneros: "mf" },
    sistémico: {géneros: "mf" },
    libra: {géneros: "n" },
    honesto: {géneros: "mf" },
    extremo: {géneros: "mf" },
    jurídico: {géneros: "mf" },
    distinto: {géneros: "mf" },
    cárnico: {géneros: "mf" },
    separador: {géneros: "mf" },
    centavo: {géneros: "mf" },
    directivo: {géneros: "mf" },
    lógico: {géneros: "mf" },
    corporativo: {géneros: "mf" },
    cristiano: {géneros: "mf" },
    transportador: {géneros: "mf" },
    parlante: {géneros: "mf" },
    creciente: {géneros: "n" },
    deportivo: {géneros: "mf" },

}