const COMMON_PREFIXES = [
  "sobre",
  "retro",
  "inter",
  "super",
  "entre",
  "anti",
  "auto",
  "sub",
  "pre",
  "pro",
  "con",
  "des",
  "re",
  "de",
  "in",
  "im",
  "ex",
].sort((a, b) => b.length - a.length)

const NON_INHERITING_VERBS = new Set([
  "atraer",
  "distraer",
  "abstraer",
  "contraer",
  "delinquir",
  "insistir",
  "resistir",
  "desistir",
])


interface PrefixWBase {
  prefix: string
  base: string
}

export function findPrefixOfRegularVerb(infinitive: string): PrefixWBase | undefined {
  if (NON_INHERITING_VERBS.has(infinitive)) {
    return undefined
  }
  for (const prefix of COMMON_PREFIXES) {
    if (!infinitive.startsWith(prefix)) continue
    const base = infinitive.slice(prefix.length)
    return {prefix, base}
  }
  return undefined
}
