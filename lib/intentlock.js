// IntentLock: plain code, no AI. Checks that a rewrite keeps the original's
// commitments, deadlines, facts, conditions and negations/uncertainty.
// Facts and deadlines come from Fact Guard; the other three are wording rules,
// so they are heuristics: they catch the common ways polite rewrites change
// meaning ("might" becoming "will", "subject to approval" disappearing).
import { checkFacts, describeFact } from "./factguard";

export const CATEGORY_LABELS = {
  commitments: "Commitments & Promises",
  deadlines: "Deadlines & Dates",
  facts: "Facts & Numbers",
  conditions: "Conditions & Approvals",
  negations: "Negations & Uncertainty",
};
export const CATEGORIES = Object.keys(CATEGORY_LABELS);

// Phrases are matched case-insensitively on word boundaries; Devanagari ones by substring.
const HEDGES = [
  "might", "may", "maybe", "could", "possibly", "perhaps", "probably", "likely", "hope to", "hoping to",
  "try to", "trying to", "aim to", "aiming to", "aiming for", "plan to", "planning to", "expect to", "expect",
  "tentative", "tentatively", "targeting", "target", "estimated", "approximately", "roughly",
  "should be able to", "not sure", "unsure", "shayad", "शायद", "संभवतः",
];
const PROMISES = ["will", "shall", "guarantee", "guaranteed", "definitely", "certainly", "commit to", "committed to",
  "promise", "ensure", "without fail", "for sure", "zaroor", "ज़रूर", "जरूर"];
const STRONG_PROMISES = PROMISES.filter((p) => p !== "will" && p !== "shall");
const CONDITIONS = [
  "if", "unless", "subject to", "pending", "provided that", "provided", "contingent on", "contingent upon",
  "conditional on", "as long as", "assuming", "depends on", "depending on", "only after", "once",
  "need approval", "needs approval", "require approval", "requires approval", "approval first", "sign-off",
  "sign off", "until", "agar", "jab tak", "tabhi", "अगर", "यदि", "जब तक", "बशर्ते",
];
const NEGATIONS = [
  "not", "no", "never", "don't", "do not", "doesn't", "didn't", "can't", "cannot", "won't", "wouldn't",
  "shouldn't", "mustn't", "must not", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't",
  "nothing", "none", "neither", "nor", "without", "nahi", "nahin", "mat", "नहीं", "मत",
];
const DIRECTIVE_NEGATIONS = ["do not", "don't", "never", "must not", "mustn't", "mat", "मत"];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const DEVANAGARI = /[ऀ-ॿ]/;

function matcher(phrases) {
  const latin = phrases.filter((p) => !DEVANAGARI.test(p)).sort((a, b) => b.length - a.length);
  const re = new RegExp(String.raw`(?<![\p{L}'’])(${latin.map(escape).join("|")})(?![\p{L}'’])`, "giu");
  const deva = phrases.filter((p) => DEVANAGARI.test(p));
  return (text) => {
    const found = [...text.matchAll(re)].map((m) => ({ phrase: m[1].toLowerCase(), index: m.index }));
    for (const p of deva) {
      let i = text.indexOf(p);
      while (i !== -1) {
        found.push({ phrase: p, index: i });
        i = text.indexOf(p, i + p.length);
      }
    }
    return found.sort((a, b) => a.index - b.index);
  };
}

const findHedges = matcher(HEDGES);
const findPromises = matcher(PROMISES);
const findConditions = matcher(CONDITIONS);
const findNegations = matcher(NEGATIONS);

// The matched phrase plus up to two following words, within the same sentence.
function snippet(text, { phrase, index }) {
  const rest = text.slice(index + phrase.length).match(/^[^.!?।\n]*/)[0];
  const next = rest.trim().split(/\s+/).filter(Boolean).slice(0, 2).join(" ");
  return `${text.substr(index, phrase.length)}${next ? ` ${next}` : ""}`.replace(/[,;:]$/, "");
}

const risk = (category, riskLevel, originalSnippet, rewrittenSnippet, explanation, safeguardRecommendation) => ({
  id: `${category}-${originalSnippet}-${rewrittenSnippet}`.toLowerCase().replace(/\s+/g, "-"),
  category,
  categoryLabel: CATEGORY_LABELS[category],
  riskLevel,
  originalSnippet,
  rewrittenSnippet,
  explanation,
  safeguardRecommendation,
});

const DEADLINE_TYPES = new Set(["date", "time"]);

/**
 * Compares a rewrite with its original.
 * strictness: "lenient" (critical only), "standard", or "strict" (also flags any new "will"/"shall").
 * Returns { risks, critical, moderate, categories: { [category]: "critical" | "moderate" | "safe" }, facts }.
 */
export function checkIntent(original, rewrite, strictness = "standard") {
  const risks = [];
  const facts = checkFacts(original, rewrite);

  for (const f of facts.missing) {
    const deadline = DEADLINE_TYPES.has(f.type);
    risks.push(
      risk(
        deadline ? "deadlines" : "facts",
        "critical",
        describeFact(f),
        "[REMOVED]",
        deadline
          ? `The ${f.type === "time" ? "time" : "date"} "${describeFact(f)}" from the original is missing from the rewrite.`
          : `"${describeFact(f)}" from the original is missing or was changed in the rewrite.`,
        "Put the exact value back; Fact Guard matches it in any format."
      )
    );
  }

  // Commitments and uncertainty
  const hedges = findHedges(original);
  const rewriteHedges = findHedges(rewrite);
  const originalPromises = new Set(findPromises(original).map((p) => p.phrase));
  const newPromises = findPromises(rewrite).filter((p) => !originalPromises.has(p.phrase));
  if (hedges.length && !rewriteHedges.length) {
    const before = snippet(original, hedges[0]);
    if (newPromises.length) {
      const after = snippet(rewrite, newPromises[0]);
      risks.push(
        risk("commitments", "critical", before, after,
          `The original was tentative ("${hedges[0].phrase}"); the rewrite turns it into a firm promise ("${newPromises[0].phrase}").`,
          `Keep the hedge, for example "expect to", "aiming for" or "subject to".`)
      );
    }
    risks.push(
      risk("negations", "moderate", before, newPromises.length ? "absolute certainty" : "[REMOVED]",
        "The rewrite drops the original's uncertainty, so it reads as more certain than you are.",
        "Keep a probability qualifier for anything not yet confirmed.")
    );
  } else {
    const strong = newPromises.filter((p) => STRONG_PROMISES.includes(p.phrase) || strictness === "strict");
    if (strong.length) {
      risks.push(
        risk("commitments", "moderate", "[none]", snippet(rewrite, strong[0]),
          `The rewrite adds a commitment ("${strong[0].phrase}") that the original didn't make.`,
          "Remove the promise unless you intend to make it.")
      );
    }
  }

  // Conditions and approvals
  // Conditions are often reworded ("need approval first" -> "subject to approval"),
  // so compare how many there are rather than the exact words.
  const conditions = findConditions(original);
  if (conditions.length) {
    const rewriteConditions = findConditions(rewrite);
    const keptWords = new Set(rewriteConditions.map((c) => c.phrase));
    // Wording alone can't say which one went, so name every condition not repeated verbatim.
    const unmatched = conditions.filter((c) => !keptWords.has(c.phrase));
    const lostSnippet = (unmatched.length ? unmatched : conditions).map((c) => snippet(original, c)).join(" / ");
    if (!rewriteConditions.length) {
      risks.push(
        risk("conditions", "critical", snippet(original, conditions[0]), "[REMOVED]",
          `The rewrite drops the condition "${snippet(original, conditions[0])}", so it reads as unconditional.`,
          `Keep the condition, for example "subject to approval" or "contingent on".`)
      );
    } else if (rewriteConditions.length < conditions.length) {
      risks.push(
        risk("conditions", "moderate", lostSnippet, "[MISSING]",
          `The original has ${conditions.length} conditions and the rewrite only ${rewriteConditions.length}; check "${lostSnippet}".`,
          "Make sure every prerequisite from the original is still there.")
      );
    }
  }

  // Negations
  const negations = findNegations(original);
  if (negations.length && !findNegations(rewrite).length) {
    const directive = negations.find((n) => DIRECTIVE_NEGATIONS.includes(n.phrase));
    const first = directive ?? negations[0];
    risks.push(
      risk("negations", directive ? "critical" : "moderate", snippet(original, first), "[REMOVED]",
        directive
          ? `The original says "${snippet(original, first)}"; the rewrite has no negation at all, so the instruction may be lost or reversed.`
          : `The original's negation ("${snippet(original, first)}") isn't in the rewrite. That can be fine if it was rephrased, so check it.`,
        "Keep explicit \"do not\" / \"never\" instructions word for word.")
    );
  }

  const shown = strictness === "lenient" ? risks.filter((r) => r.riskLevel === "critical") : risks;
  const categories = Object.fromEntries(
    CATEGORIES.map((c) => {
      const levels = shown.filter((r) => r.category === c).map((r) => r.riskLevel);
      return [c, levels.includes("critical") ? "critical" : levels.length ? "moderate" : "safe"];
    })
  );
  return {
    risks: shown,
    critical: shown.filter((r) => r.riskLevel === "critical").length,
    moderate: shown.filter((r) => r.riskLevel === "moderate").length,
    categories,
    facts,
  };
}
