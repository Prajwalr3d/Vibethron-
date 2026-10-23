// Meaning Match helpers shared by the embedding worker and the UI.
// Scores come from local sentence embeddings, never from the rewriting AI.

export const MODELS = {
  en: "Xenova/all-MiniLM-L6-v2",
  multi: "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
};

// Calibrated on hand-written rewrites of the three sample drafts:
//   all-MiniLM-L6-v2, faithful 79-95, drifted (dropped or reversed ask) 24-56
//   multilingual, English -> Hindi faithful 73-89, drifted 22-40
// Sentence level: dropped sentences scored 0.13-0.34; kept-but-merged ones 0.44-0.6.
export const THRESHOLDS = { strong: 78, fair: 60 };
export const SENTENCE_WEAK = 0.5;

export function cosine(a, b) {
  if (!a?.length || a.length !== b?.length) throw new Error("Vectors must be the same non-zero length");
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export const toPercent = (similarity) => Math.max(0, Math.min(100, Math.round(similarity * 100)));

export function meaningLabel(percent) {
  if (percent >= THRESHOLDS.strong) return "Strong";
  if (percent >= THRESHOLDS.fair) return "Fair";
  return "Drifted";
}

/** Sentences and bullet lines; drops fragments with fewer than two words. */
export function splitSentences(text) {
  return text
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((s) => s.replace(/^[\s\-*•]+/, "").trim())
    .filter((s) => s.split(/\s+/).length >= 2);
}

const DEVANAGARI = /[ऀ-ॿ]/;

/** Which local model can judge this pair, or null when only the AI estimate is usable. */
export function modelFor(language, original, rewrite) {
  if (language === "hinglish") return null; // Romanised Hindi is out of both models' training
  if (language === "hi" || DEVANAGARI.test(original) || DEVANAGARI.test(rewrite)) return "multi";
  return "en";
}
