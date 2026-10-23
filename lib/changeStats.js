import { diffWords } from "diff";
import { countWords } from "./textStats";
import { fleschKincaidGrade } from "./readability";

const DEVANAGARI = /[ऀ-ॿ]/;
let segmenter;

function diffOptions(a, b) {
  // The default tokenizer splits Devanagari words at vowel signs; Intl.Segmenter keeps them whole.
  if (!DEVANAGARI.test(a + b) || typeof Intl?.Segmenter !== "function") return undefined;
  segmenter ??= new Intl.Segmenter("hi", { granularity: "word" });
  return { intlSegmenter: segmenter };
}

export function wordDiff(original, rewrite) {
  return diffWords(original, rewrite, diffOptions(original, rewrite));
}

/** Per-card numbers: share of words changed, length change, readability grade. */
export function changeStats(original, rewrite, parts = wordDiff(original, rewrite)) {
  let added = 0;
  let removed = 0;
  for (const p of parts) {
    if (p.added) added += countWords(p.value);
    else if (p.removed) removed += countWords(p.value);
  }
  const before = countWords(original);
  const after = countWords(rewrite);
  return {
    // Changed tokens over all tokens on both sides: 0 = identical, 100 = nothing shared.
    percentChanged: before + after ? Math.round(((added + removed) / (before + after)) * 100) : 0,
    wordsBefore: before,
    wordsAfter: after,
    lengthChange: before ? Math.round(((after - before) / before) * 100) : 0,
    gradeBefore: fleschKincaidGrade(original),
    gradeAfter: fleschKincaidGrade(rewrite),
  };
}
