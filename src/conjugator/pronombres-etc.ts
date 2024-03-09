import "./index"


const pronombres_personales = {
    s1: "yo",
    s2: {
        es: "vos",
        mx: "tú"
    },
    s3: ["él", "ella", "usted"],
    p1: ["nosotros", "nosotras"],
    p2: {
        es: ["vosotros", "vosotras"],
        mx: "ustedes"
    },
    p3: ["ellos", "ellas", "ustedes"],
}


const objetos_directos = {
    s1: "me",
    s2: "te",
    s3: ["lo", "la"],
    p1: "nos",
    p2: "os",
    p3: ["los", "las"],
}

const objetos_indirectos = {
    s1: "me",
    s2: "te",
    s3: "le",
    p1: "nos",
    p2: "os",
    p3: "les",
}


// used with "a"+
const pronombres = {
    s1: "mí",
    s2: "ti",
    s3: ["él", "ella", "usted"],
    p1: "nos",
    p2: {
        es: ["vosotros", "vosotras"],
        mx: "ustedes"
    },
    p3: ["ellos", "ellas", "ustedes"],
}


const pronombres_reflexivos_y_recíprocos = {
    s1: "me",
    s2: "te",
    s3: "se",
    p1: "nos",
    p2: "os",
    p3: "se",
}


const what_do_you_call_this = {
    s1: "conmigo",
    s2: "contigo",
    s3: "consigo",
    p3: "consigo",
}


const pronombres_relativos = {
    que: "que",
    cual: [ "cual", "cuales"],
    cuanto: ["cuanto", "cuanta", "cuantos", "cuantas"],
    donde: "donde",
    quien: ["quien", "quienes"],
    cuyo: ["cuyo", "cuya", "cuyos", "cuyas"],
}

const pronombres_demostrativos = {
    sm:	["éste", "ése", "aquél"],
    sf:	["ésta", "ésa", "aquélla"],
    "s?": ["esto", "eso", "aquello"],
    pm:	["éstos", "ésos" , "aquéllos"],
    pf:	["éstas", "ésas" , "aquéllas"],
}


const pronombres_posesivos = {
    s1: ["mío", "mía", "míos", "mías"],
    s2: ["tuyo", "tuya", "tuyos", "tuyas"],
    s3: ["suyo", "suya", "suyos", "suyas"],
    p1: ["nuestro", "nuestra", "nuestros", "nuestras"],
    p2: ["vuestro", "vuestra", "vuestros", "vuestras"],
    p3: ["suyo", "suya", "suyos", "suyas"],
}


const pronombres_interrogativos_y_exclamativos = {
    "qué": "qué",
    "quién": ["quién", "quiénes"],
    "cuál": ["cuál", "cuáles"],
    "cuánto": ["cuánto", "cuántos"],
    "cómo": "cómo",
}


const pronombres_indefinidos = {
    un: ["un", "una", "unos", "unas"],
    "algún" : ["algún", "alguna", "algunos", "algunas"],
    "ningún": ["ningún", "ninguna", "ningunos", "ningunas"],
    "otro": ["otro", "otra", "otros", "otras"],
    "tanto": ["tanto", "tanta", "tantos", "tantas"],
    mucho: "mucho",
    demasiado: "demasiado",
    escaso: "escaso",
    todo: "todo"
    // and more
}


const indefinidas_y_negativas = {
    "algo": {
        pos: "algo",
        neg: "nada"
    },
    "alguien": {pos: "alguien", neg: "nadie"},
    "siempre": {pos: "siempre", neg: ["nunca", "jamás" ,"nunca jamás"]},
    "también": {pos: "también", neg: "tampoco"},
    "algún": {
        pos: ["alguno", "alguna", "algunos", "algunas", "algún"],
        neg: ["ninguno", "ninguna", "ningunos", "ningunas", "ningún"],
    },
    o: {pos: "o", neg: "ni"}
}

