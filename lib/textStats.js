export const MAX_CHARS = 3000;
const WORDS_PER_MINUTE = 200;

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function readingTime(words) {
  const seconds = Math.round((words / WORDS_PER_MINUTE) * 60);
  if (seconds === 0) return "0 sec";
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
