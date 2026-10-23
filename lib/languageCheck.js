// Checks that a rewrite is in the script the user asked for. Live testing showed
// the model sometimes answers a Hindi request in English or Hinglish, and writes
// formal (Legal/Executive) Hinglish rewrites in plain English.
import { hinglishWordShare } from "./grammar";

function devanagariShare(text) {
  const letters = text.match(/\p{L}/gu) || [];
  return letters.length ? (text.match(/[ऀ-ॿ]/g) || []).length / letters.length : 0;
}

/** Why a rewrite doesn't match the requested output language, or null if it does. */
export function languageMismatch(text, language) {
  const dev = devanagariShare(text);
  if (language === "hi") return dev < 0.4 ? "isn't in Devanagari" : null;
  if (language === "hinglish") {
    if (dev > 0.05) return "uses Devanagari instead of Roman script";
    return hinglishWordShare(text) < 0.06 ? "reads as plain English, not Hinglish" : null;
  }
  return dev > 0.5 ? "isn't in English" : null;
}

/** One message per rewrite that missed the requested language. */
export function languageWarnings(vibes, language) {
  return vibes.flatMap((v) => {
    const reason = languageMismatch(v.text, language);
    return reason ? [`${v.name} ${reason}`] : [];
  });
}
