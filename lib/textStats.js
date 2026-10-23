export const MAX_CHARS = 3000;
const WORDS_PER_MINUTE = 200;

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function readingTime(words) {
  if (words === 0) return "0 sec";
  const seconds = Math.max(1, Math.round((words / WORDS_PER_MINUTE) * 60));
  if (seconds < 60) return `${seconds} sec`;
  return `${Math.round(seconds / 60)} min`;
}

export function draftStats(text) {
  const words = countWords(text);
  return { words, chars: text.length, reading: readingTime(words) };
}

// Appends new text (from voice or OCR) on its own line, clipped to the limit.
export function appendText(current, addition) {
  const extra = addition.trim();
  if (!extra) return { text: current, clipped: false };
  const base = current.replace(/\s+$/, "");
  const joined = base ? `${base}\n${extra}` : extra;
  if (joined.length <= MAX_CHARS) return { text: joined, clipped: false };
  return { text: joined.slice(0, MAX_CHARS), clipped: true };
}

// Emoji or punctuation alone gives the AI nothing to rewrite.
export const hasWords = (text) => /[\p{L}\p{N}]/u.test(text);

/** A user-facing problem with the draft, or null if it can be sent. */
export function draftProblem(text) {
  if (!text.trim()) return "Write, paste, dictate or upload a draft first.";
  if (!hasWords(text)) return "Add some words. Emoji or symbols alone don't give the AI anything to rewrite.";
  if (text.length > MAX_CHARS) return `Drafts can be up to ${MAX_CHARS.toLocaleString("en-IN")} characters.`;
  return null;
}
