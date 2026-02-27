# combine files into one and remove import statements and export keywords

cd generated/src/conjugator 

for f in version.js lib.js move-stress.js ortografía.js prefixes.js regular-verb-rules.js tema-futuro.js tema-presente-yo.js tema-pretérito.js verbos-con-cambios-morfológicas.js alternancia-vocálica.js resolve-conjugation-class.js stem-changes.js derive-participles.js conjugate-verb.js ; do cat -- "$f"; printf "\n"; done > one.js

sed -i '' 's/export //g' one.js
sed -i '' '/^import/d' one.js
sed -i '' 's/\/\/# sourceMappingURL/\/\/ sourceMappingURL/g' one.js


# move the "version"
so it is defined before it is used (aún mejor cambie el código)

