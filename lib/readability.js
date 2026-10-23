// Flesch-Kincaid grade level with a vowel-group syllable heuristic.
// Only meaningful for Latin-script (English or Hinglish) text.

const LATIN_WORD = /[a-z]/i;

export function countSyllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  // Silent endings: "-es", "-e", and "-ed" except after t/d ("created" keeps it).
  w = w.replace(/(?:[^laeiouy]es|[^aeiouydt]ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

function sentenceCount(text) {
  // Line breaks end sentences too, so bullet lists aren't one giant sentence.
  const parts = text.split(/[.!?।]+|\n+/).filter((s) => /\S/.test(s));
  return Math.max(1, parts.length);
}

/** Returns the grade (one decimal) or null if the text isn't mostly Latin script. */
export function fleschKincaidGrade(text) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  const latin = words.filter((w) => LATIN_WORD.test(w));
  if (latin.length / words.length < 0.6) return null;

  const syllables = latin.reduce((sum, w) => sum + countSyllables(w), 0);
  const grade = 0.39 * (latin.length / sentenceCount(text)) + 11.8 * (syllables / latin.length) - 15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}
