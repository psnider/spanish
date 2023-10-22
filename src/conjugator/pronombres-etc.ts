import "./index"


const pronombres_personales = {
    "1s": "yo",
    "2s": {
        es: "vos",
        mx: "tú"
    },
    "3s": ["él", "ella", "usted"],
    "1p": ["nosotros", "nosotras"],
    "2p": {
        es: ["vosotros", "vosotras"],
        mx: "ustedes"
    },
    "3p": ["ellos", "ellas", "ustedes"],
}


const objetos_directos = {
    "1s": "me",
    "2s": "te",
    "3s": ["lo", "la"],
    "1p": "nos",
    "2p": "os",
    "3p": ["los", "las"],
}

const objetos_indirectos = {
    "1s": "me",
    "2s": "te",
    "3s": "le",
    "1p": "nos",
    "2p": "os",
    "3p": "les",
}


// used with "a"+
const pronombres = {
    "1s": "mí",
    "2s": "ti",
    "3s": ["él", "ella", "usted"],
    "1p": "nos",
    "2p": {
        es: ["vosotros", "vosotras"],
        mx: "ustedes"
    },
    "3p": ["ellos", "ellas", "ustedes"],
}


const pronombres_reflexivos_y_recíprocos = {
    "1s": "me",
    "2s": "te",
    "3s": "se",
    "1p": "nos",
    "2p": "os",
    "3p": "se",
}


const what_do_you_call_this = {
    "1s": "conmigo",
    "2s": "contigo",
    "3s": "consigo",
    "3p": "consigo",
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
    "1s": ["mío", "mía", "míos", "mías"],
    "2s": ["tuyo", "tuya", "tuyos", "tuyas"],
    "3s": ["suyo", "suya", "suyos", "suyas"],
    "1p": ["nuestro", "nuestra", "nuestros", "nuestras"],
    "2p": ["vuestro", "vuestra", "vuestros", "vuestras"],
    "3p": ["suyo", "suya", "suyos", "suyas"],
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

