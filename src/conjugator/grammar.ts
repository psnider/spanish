import {ConjugationChanges, ConjugationKey, 
    StemChangePatterns, SuffixChangeType, SuffixesForRegularVerbs, 
    VerbConjugation, VerbConjugationChanges, VerbConjugationChangesForMoodAndTense, 
    VerbConjugationOverrides, VerbConjugation_nonStandard, VerbConjugationSuffixes, 
    VerbConjugationSuffixesForMoodAndTense, VerbFamily, VerbMoodTense, VerbMoodTenseKey, 
    VerbTextUsage_forTypographicalChange,
    TypographicalChangeRule
    } from "./index"
import {conjugation_keys, irregular_conjugations, stem_change_patterns, regular_verb_suffixes, verb_conjugation_types, typographical_change_rules} from "./conjugation-rules.js"


// NOTE: for testing
// Use the following to import this code into a node REPL instance:
// var conjugateVerb ; import("./generated/spanish/grammar.js").then((module) => {conjugateVerb = module.conjugateVerb})



// Get the suffixes for the given verb family, mood, and tense, applying a suffix change if one is given. 
// @return The set of suffixes for all of the conjugated forms.
// For example: getSuffixes("er", "IndPast", "eer")
//    {"1s":"í", "2s":"íste", "3s":"yó", "1p":"ímos", "2p":"ísteis", "3p":"yeron"}
function getSuffixes(verb_family: string, mood_tense: string, suffix_change_type?: SuffixChangeType) : VerbConjugationChanges {
    const suffixes_for_verb_family = regular_verb_suffixes[<keyof SuffixesForRegularVerbs> verb_family]
    if (!suffixes_for_verb_family) {
        throw new Error(`No suffixes found for verb_family=${verb_family}`)
    }
    const regular_suffixes = suffixes_for_verb_family.regular[<keyof VerbConjugationSuffixesForMoodAndTense> mood_tense]
    if (!regular_suffixes) {
        throw new Error(`No suffixes found for verb_family=${verb_family} mood_tense=${mood_tense}`)
    }
    // make a local copy (to prevent polluting the source data)
    let suffixes = {...regular_suffixes}
    if (suffix_change_type) {
        const changed_suffixes = suffixes_for_verb_family[suffix_change_type]?.[<keyof VerbConjugationSuffixesForMoodAndTense> mood_tense]
        if (changed_suffixes) {
            const conjugation_keys = Object.keys(changed_suffixes)
            conjugation_keys.forEach((conjugation_key: keyof VerbConjugationSuffixes) => {
                suffixes[conjugation_key] = changed_suffixes[conjugation_key]
            })
        }
    }
    return suffixes
}


// Get any stem change patterns for the given verb mood and tense.
// @return Stem change patterns for those conjugated forms for which they exist.
//   For example: getStemChanges("IndPres", {stem_change_type: "o:ue"}):
//     {"1s": "o:ue", "2s": "o:ue", "3s": "o:ue", "3p": "o:ue"},
function getStemChanges(mood_tense: string, irregular_rules?: ConjugationChanges) : Partial<VerbConjugationChanges> | undefined{
    const stem_change_type = irregular_rules?.stem_change_type
    if (stem_change_type) {
        const stem_changes_for_type = stem_change_patterns[<keyof StemChangePatterns> stem_change_type]
        if (stem_changes_for_type) {
            if (irregular_rules.stem_change_inclusions?.includes(<VerbMoodTenseKey> mood_tense)) {
                const stem_changes = stem_change_patterns[<keyof StemChangePatterns> stem_change_type]?.[<keyof VerbConjugationChangesForMoodAndTense> mood_tense]
                return stem_changes
            }
        }
    }
}


// A rule matches if its "filter" matches the rule.
// A filter matches if every provided field matches.
function doesMatchTypographicalChangeRule(verb: VerbTextUsage_forTypographicalChange, rule: TypographicalChangeRule) {
    const {filter} = rule
    if (filter.infinitive_endings) {
        const matching_ending = filter.infinitive_endings.find((infinitive_ending) => {
            const ending_matches = verb.infinitive.endsWith(infinitive_ending)
            return ending_matches
        })
        if (!matching_ending) return false
    }
    return true
}


const capture_group_id_regexp = /\$(\d+)/
// @return the text as changed by applying the rule, or undefined if the rule isn't applied
function applyTypographicalChangeRule(verb: VerbTextUsage_forTypographicalChange, rule: TypographicalChangeRule) {
    const {match_pattern, replacement_pattern} = rule.change
    const match = verb.text.match(match_pattern)
    if (match) {
        const unchanged_length = match[0].length
        const unchanged_index = match.index
        let replacement_text
        const capture_group_id_match = replacement_pattern.match(capture_group_id_regexp)
        if (capture_group_id_match) {
            const id_index = capture_group_id_match.index
            const id_length = capture_group_id_match[0].length
            const capture_group_id = parseInt(capture_group_id_match[1])
            if (Number.isNaN(capture_group_id)) {
                throw new Error(`Invalid capture_group_id in replacement_pattern=${replacement_pattern}`)
            }
            const capture_group_match = match[capture_group_id]
            replacement_text = replacement_pattern.slice(0, id_index) + capture_group_match + replacement_pattern.slice(id_index + id_length)
        } else {
            replacement_text = replacement_pattern
        }
        const changed = verb.text.slice(0, unchanged_index) + replacement_text + verb.text.slice(unchanged_index + unchanged_length)
        return changed
    }
}


// @return The conjugated form after applying the typographical change rules.
// @param @output rules_applied Contains the names of the rules that were applied to the input verb.
export function applyTypographicalChangeRules(verb: VerbTextUsage_forTypographicalChange, rules_applied?: string[]) : string {
    let corrected_verb_text = verb.text
    for (let i = 0 ; i < typographical_change_rules.length ; ++i) {
        const rule = typographical_change_rules[i]
        if (doesMatchTypographicalChangeRule(verb, rule)) {
            const typographical_change = applyTypographicalChangeRule(verb, rule)
            if (typographical_change) {
                rules_applied?.push(rule.name)
                corrected_verb_text = typographical_change
                verb.text = typographical_change
            }
        }
    }
    return corrected_verb_text
}


// @return The root that should be used after applying any stem change.
// This is the unchanged root if there is no stem change.
function applyStemChange(args: {verb_root: string, verb_family: VerbFamily, mood_tense: VerbMoodTense, conjugation_key: ConjugationKey, stem_change_type: string, stem_changes?: Partial<VerbConjugationChanges>}) {
    const {verb_root, verb_family, mood_tense, conjugation_key, stem_change_type, stem_changes} = args
    if (stem_changes) {
        const stem_change = stem_changes[<keyof VerbConjugationChanges> conjugation_key]
        if (stem_change) {
            const [unchanged, changed] = stem_change.split(":")
            const i = verb_root.lastIndexOf(unchanged)
            if (i === -1) {
                throw new Error(`can't apply stem_change_type=${stem_change_type} to verb_root=${verb_root}`)
            }
            const changed_root = verb_root.slice(0,i) + changed + verb_root.slice(i + unchanged.length)
            return changed_root
        }
    }
    return verb_root
}


// @param mood_tense The forms to conjugate, given by mood and tense. 
// @return The conjugated forms for the given verb.
// @note In some cases, only some forms are returned, such as for weather verbs.
//   For example, there is no form of "I rain".
export function conjugateVerb(infinitive: string, mood_tense: VerbMoodTense): VerbConjugation {
    function getIrregularConjugation(regular_conjugation: VerbConjugation) {
        function applyChanges(conjugated_form: string, key: keyof VerbConjugation) {
            if (conjugation_changes.irregular.remove) {
                if (!conjugated_form.startsWith(conjugation_changes.irregular.remove)) {
                    throw new Error (`conjugated base=${conjugated_form} doesn't start with irregular_rules.irregular.remove=${conjugation_changes.irregular.remove}"`)
                }
                conjugated_form = conjugated_form.slice(conjugation_changes.irregular.remove.length)
            }
            if (conjugation_changes.irregular.add) {
                conjugated_form = conjugation_changes.irregular.add + conjugated_form
            }
            return conjugated_form
        }
        function applyAccentChanges(conjugated_form: string, key: keyof VerbConjugation, irregular_base_conjugations: VerbConjugation_nonStandard) {
            if (conjugation_changes?.irregular?.change_accents && irregular_base_conjugations.change_accents) {
                const dropped_accents = irregular_base_conjugations.change_accents[mood_tense]
                const dropped_accent_pattern = dropped_accents?.[key]
                if (dropped_accent_pattern) {
                    const [unchanged, changed] = dropped_accent_pattern.split(":")
                    const i = conjugated_form.lastIndexOf(unchanged)
                    if (i === -1) {
                        throw new Error(`can't apply dropped_accent_pattern=${dropped_accent_pattern} to conjugated_form=${conjugated_form}`)
                    }
                    conjugated_form = conjugated_form.slice(0,i) + changed + conjugated_form.slice(i + unchanged.length)
                }
            }
            return conjugated_form
        }
        const base_verb = conjugation_changes?.irregular?.base
        if (base_verb) {
            const irregular_base_conjugations = irregular_conjugations[<keyof VerbConjugation_nonStandard> base_verb]
            let irregular_base_conjugation = irregular_base_conjugations?.[<keyof VerbConjugationOverrides> mood_tense]
            let conjugation_w_prefix: {[conjugation_key: string]: string} = {}
            Object.keys(regular_conjugation).forEach((key: keyof VerbConjugation) => {
                let regular_conjugated = regular_conjugation[<keyof VerbConjugation> key]
                let irregular_base_conjugated = irregular_base_conjugation?.[key]
                if (!Array.isArray(irregular_base_conjugated)) {
                    if (irregular_base_conjugated) {
                        // multiple conjugated forms disallowed for derived verbs
                        irregular_base_conjugated = applyChanges(irregular_base_conjugated, key)
                    }
                }
                let conjugated_form = <any> irregular_base_conjugated || regular_conjugated
                conjugated_form = applyAccentChanges(conjugated_form, key, irregular_base_conjugations)
                conjugation_w_prefix[key] = conjugated_form
            })
            return <VerbConjugation><unknown> conjugation_w_prefix
        }
    }
    function getRegularOrSlightlyIrregularConjugation() {
        const verb_root_last_char = verb_root[verb_root.length - 1]
        const suffix_change_type = conjugation_changes?.suffix_change_type
        const suffixes = getSuffixes(verb_family, mood_tense, suffix_change_type)
        const stem_changes = getStemChanges(mood_tense, conjugation_changes)
        let conjugation = <VerbConjugation> {}
        const valid_conjugation_keys = conjugation_changes?.conjugate_only || conjugation_keys
        valid_conjugation_keys.forEach((conjugation_key: keyof(VerbConjugation)) => {
            const stem_change_type = conjugation_changes?.stem_change_type
            let corrected_root = applyStemChange({verb_root, verb_family, mood_tense, conjugation_key, stem_change_type, stem_changes})
            const suffix = suffixes[conjugation_key]
            let conjugated_form = `${corrected_root}${suffix}`
            // don't apply any rules if this is a test of the regular conjugations
            if (verb_root !== "_") {
                const corrected_typography = applyTypographicalChangeRules({text: conjugated_form, infinitive})
                if (corrected_typography) {
                    conjugated_form = corrected_typography
                }
            }
            conjugation[conjugation_key] = conjugated_form
        })
        return conjugation
    }
    function getVerbFamily(infinitive: string) {
        let verb_family = infinitive.slice(-2)
        if (verb_family === "ír") {
            verb_family = "ir"
        }
        return <VerbFamily> verb_family
    }
    const verb_root = infinitive.slice(0, -2)
    const verb_family = getVerbFamily(infinitive)
    if ((verb_root !== "_") && ! (infinitive in verb_conjugation_types)) {
        throw new Error(`infinitive=${infinitive} not in verb_conjugation_types`)
    }
    // copy because we may amend with properties from base
    let conjugation_changes = verb_conjugation_types[infinitive]
    // if (conjugation_changes === null) the verb is regular, and no other setup is required
    if (conjugation_changes === undefined) {
        // don't print warning if this is a test
        if (verb_root !== "_") {
            console.log(`not known if "${infinitive}" is supported`)
        }
    } else if (conjugation_changes) {
        if (conjugation_changes.unsupported) {
            console.log(`"${infinitive}" is NOT supported`)
            return
        }
        const base = conjugation_changes.irregular?.base
        if (base && (base !== infinitive)) {
            // Make a shallow copy so fields can be added from base verb
            conjugation_changes = <ConjugationChanges> {...conjugation_changes}
            if (! (base in verb_conjugation_types)) {
                throw new Error(`base=${base} (for infinitive=${infinitive}) not in verb_conjugation_types`)
            }
            let conjugation_changes_for_base = verb_conjugation_types[conjugation_changes.irregular?.base]
            let keys = Object.keys(conjugation_changes_for_base)
            keys.forEach((key: keyof ConjugationChanges) => {
                if (key !== <keyof ConjugationChanges> "irregular") {
                    if (conjugation_changes[key]) {
                        // Usage is to use the value from the base verb
                        throw new Error(`Unexpected value in ConjugationChanges for infinitive=${infinitive}`)
                    }
                    (<any> conjugation_changes[key]) = conjugation_changes_for_base[key]
                }
            })
        }
    }
    let conjugation = getRegularOrSlightlyIrregularConjugation()
    let irregular_conjugation = getIrregularConjugation(conjugation)
    if (irregular_conjugation) {
        // FIX: clean up
        const irregular_conjugation_keys = Object.keys(irregular_conjugation)
        irregular_conjugation_keys.forEach((key: keyof VerbConjugationSuffixes) => {
            conjugation[key] = <any> irregular_conjugation[key]
        })
    }
    return conjugation;
}
