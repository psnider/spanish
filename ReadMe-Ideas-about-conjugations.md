
// Notas sobre clasificación de verbos
// 1. Qué significa “una familia que merece existir”
// Una familia morfológica merece existir como entidad propia si cumple al menos dos de estos criterios fuertes (y idealmente tres):
// Criterio A — Productividad
// ¿Puedo crear verbos nuevos (o poco comunes) que sigan el mismo patrón sin sorprender a un hablante?
// Ejemplo claro:
// contar → descontar, reencontrar, malcontar, recontra-contar
// todos aceptan o:ue sin pensarlo
// Si la respuesta es “sí, naturalmente”, hay familia.
// Criterio B — Estabilidad semántica
// ¿El significado del verbo derivado sigue conectado al verbo base?
// contar → descontar → recontar → incontable
// ✔️ misma noción semántica
// acordar → recordar → concordar → discordar
// ✔️ misma raíz conceptual (cor, cordis)
// Si la semántica se rompe, la familia se rompe.
// Criterio C — Regularidad morfofonológica
// ¿El cambio de raíz ocurre exactamente en los mismos contextos?
// Ejemplo:
// e:ie solo en sílaba tónica
// o:ue idem
// nunca en infinitivo, gerundio, imperfecto
// Si hay “sí, pero…” constantes → no es buena familia.
// Criterio D (débil pero útil) — Tamaño mínimo
// Una familia con 1–2 verbos es sospechosa.
// Con 4–5 o más, ya empieza a justificar existencia.


// 2. Familias que claramente justifican existir
// Estas son prácticamente indiscutibles.
// 🟢 Familia e:ie tipo pensar
// Ejemplos:
// pensar
// cerrar
// empezar
// perder
// entender
// defender
// sentir
// mentir
// ✔️ productiva
// ✔️ estable
// ✔️ regular
// ✔️ enorme
// 👉 Esta familia no debe modelarse verbo por verbo.

// 🟢 Familia o:ue tipo contar
// Ejemplos:
// contar
// volver
// poder
// dormir
// encontrar
// mostrar
// recordar
// volar
// Idem. Familia canónica.
// 🟢 Familia e:i tipo pedir
// Ejemplos:
// pedir
// servir
// repetir
// medir
// corregir
// Muy consistente, muy reconocible.
// 🟢 Familia -uir tipo huir
// Ejemplos:
// huir
// construir
// destruir
// influir
// sustituir
// Aquí el cambio es distinto (yod epentética), pero:
// ✔️ absolutamente productiva
// ✔️ muy regular


// 3. Familias que NO merecen existir (o solo como excepción)
// 🔴 “Familias” de 1 verbo
// Ejemplos:
// decir
// hacer
// ir
// ser
// haber
// Estos no son familias, son lexemas nucleares.


// Familias con semántica rota
// Ejemplo clásico:
// acordar (o:ue)
// encordar (NO o:ue)
// Misma forma superficial, otra raíz semántica.
// 👉 Aquí la familia es léxica, no ortográfica.


// 4. Zona gris (la parte interesante)
// Aquí es donde hay que decidir con bisturí.
// 🟡 familia -cordar
// acordar
// concordar
// discordar
// recordar
// ✔️ semántica clara
// ✔️ patrón estable
// ❌ poco productiva hoy
// 👉 Sí merece existir, pero:
// como familia cerrada
// no como regla productiva abierta
// 🟡 familia -tener
// tener
// mantener
// obtener
// contener
// detener
// retener
// Esto es perfecto ejemplo de:
// familia morfológica no productiva pero sistemática
// 👉 Aquí herencia explícita es ideal.
// 🟡 familia -poner
// poner
// componer
// proponer
// disponer
// suponer
// Idem.
// 5. Regla de oro (muy importante)
// Una familia no es un regex.
// Si una familia solo se puede definir como:
// “verbos que acaban en X”
// pero no puedes explicar su semántica, entonces:
// ❌ NO es familia
// ✔️ es coincidencia ortográfica
// Tu regex de e:ie es útil como heurística, pero no como verdad.



// Familia: tener
// Se define por tres rasgos que siempre viajan juntos:
//  - IndPres fuerte en -g- (yo)
//  - IndPret fuerte en -uv- / -uv-
//  - IndFut, IndCond con raíz reducida
// Miembros legítimos de la familia
// - Núcleo
// - tener
// - venir
// - Derivados productivos (prefijación)
// - mantener
// - obtener
// - contener
// - detener
// - retener
// - sostener
// - intervenir
// - prevenir
// - convenir
// Excepciones:
// - entender ❌ (solo e:ie)
// - atender ❌
// - pretender ❌
// - defender ❌

//======================
// Regla arquitectónica nueva (muy importante)
// Un verbo puede ser:
// regular
// regular + stem-change
// irregular núcleo
// irregular núcleo + stem-change
// Y tener / venir caen en la última.

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// reglas de partes de la conjugación
// 1) «yo irregular en -g»
//    Una irregularidad solo en la 1.ª persona del singular del presente de indicativo.
//    Es aislada: no afecta a las demás personas.
//    No implica nada sobre otros tiempos.
//    La forma de yo añade una -g (a veces como parte de -ig, -ng, -lg, etc.).
//    Ejemplos
//    tener → tengo
//    venir → vengo
//    poner → pongo
//    salir → salgo
//    decir → digo
//    traer → traigo
//    valer → valgo
// 2) «pretérito fuerte»
//     El pretérito indefinido no se construye a partir del tema regular (-é / -í), sino de un tema especial.
//     Ejemplos
//       tener → tuv- (tuve, tuvo…)
//       venir → vin-
//       poner → pus-
//       decir → dij-
//       traer → traj-
//       caber → cup-
//     Propiedades típicas
//     Vocal temática -e- / -i-, no -é / -í
//     3.ª persona plural en -eron → dijeron, trajeron
//     A menudo sin tilde (tuve, no tuvé)
// 3) «futuro reducido» (también llamado futuro irregular)
//     El futuro y el condicional no usan el infinitivo completo, sino un tema reducido o modificado.
//     Ejemplos
//       tener → tendr-
//       venir → vendr-
//       poner → pondr-
//       salir → saldr-
//       decir → dir-
//       hacer → har-
//       caber → cabr-
