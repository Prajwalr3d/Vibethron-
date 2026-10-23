// Grammar issue helpers shared by /api/grammar and the grammar panel.
// Issue shape: { id, original_phrase, suggestion, type, reason, offset, length }

export const STRICTNESS = ["light", "standard", "strict"];
export const ISSUE_TYPES = ["spelling", "grammar", "punctuation", "clarity"];
export const MAX_GRAMMAR_BYTES = 20_000; // LanguageTool's free per-request limit

const DEVANAGARI = /[ऀ-ॿ]/g;

// Frequent Romanised Hindi words. Enough of them means LanguageTool would
// "correct" Hinglish into English, so the AI checks it instead.
// Words that are also common English ("the", "to", "main", "par") are left out.
const HINGLISH = new Set(
  `hai hain tha thi hoga hogi nahi nahin kya kyu kyun kaise kab kahan kaun
  mein mujhe mera meri mere tum tera teri aap aapka aapki apna apni humne hamara
  ko ka ki ke se pe bhi aur lekin toh jo yeh ye woh wo isko usko inko unko
  karo karna karke kar kiya kiye ki gaya gayi raha rahi rahe sakta sakte chahiye bata batao
  bhai yaar accha acha theek thik haan abhi jaldi baad pehle sirf bahut zyada thoda kuch sab`.split(/\s+/)
);

export function isMostlyDevanagari(text) {
  const letters = text.match(/\p{L}/gu) || [];
  return letters.length > 0 && (text.match(DEVANAGARI) || []).length / letters.length > 0.5;
}

/** Share of Latin-script words that are common Romanised Hindi words (0-1). */
export function hinglishWordShare(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  return words.length ? words.filter((w) => HINGLISH.has(w)).length / words.length : 0;
}

export function isHinglish(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  return words.length >= 4 && hinglishWordShare(text) >= 0.15 && words.filter((w) => HINGLISH.has(w)).length >= 3;
}

/** "languagetool" for English, "gemini" for Hindi or Hinglish drafts. */
export function grammarEngineFor(text) {
  return isMostlyDevanagari(text) || isHinglish(text) ? "gemini" : "languagetool";
}

function ltType(rule) {
  const issue = rule?.issueType;
  const cat = rule?.category?.id;
  if (issue === "misspelling" || cat === "TYPOS") return "spelling";
  if (issue === "grammar" || cat === "GRAMMAR") return "grammar";
  if (["typographical", "whitespace", "punctuation"].includes(issue) || ["PUNCTUATION", "TYPOGRAPHY", "CASING"].includes(cat)) {
    return "punctuation";
  }
  return "clarity";
}

/** LanguageTool matches -> issues. Light keeps only spelling and grammar. */
export function fromLanguageTool(matches, text, strictness) {
  return (matches || [])
    .map((m) => ({
      id: `lt-${m.offset}-${m.rule?.id || "rule"}`,
      original_phrase: text.slice(m.offset, m.offset + m.length),
      suggestion: m.replacements?.[0]?.value ?? "",
      type: ltType(m.rule),
      reason: m.message || m.shortMessage || "Possible issue",
      offset: m.offset,
      length: m.length,
    }))
    .filter((i) => i.original_phrase && (strictness !== "light" || i.type === "spelling" || i.type === "grammar"));
}

/**
 * AI issues carry only the phrase, so find each one in the text, in order.
 * Phrases that aren't in the text, duplicates and overlaps are dropped.
 */
export function locateIssues(text, issues) {
  const out = [];
  let from = 0;
  for (const raw of issues) {
    const phrase = typeof raw.original_phrase === "string" ? raw.original_phrase : "";
    if (!phrase || phrase === raw.suggestion) continue;
    let at = text.indexOf(phrase, from);
    if (at === -1) at = text.indexOf(phrase);
    if (at === -1) continue;
    if (out.some((i) => at < i.offset + i.length && at + phrase.length > i.offset)) continue;
    out.push({
      id: `ai-${at}-${out.length}`,
      original_phrase: phrase,
      suggestion: typeof raw.suggestion === "string" ? raw.suggestion : "",
      type: ISSUE_TYPES.includes(raw.type) ? raw.type : "clarity",
      reason: typeof raw.reason === "string" && raw.reason.trim() ? raw.reason.trim() : "Possible issue",
      offset: at,
      length: phrase.length,
    });
    from = at + phrase.length;
  }
  return out.sort((a, b) => a.offset - b.offset);
}

/** Where the issue's phrase is now: its recorded offset, else the nearest match, else -1. */
function findPhrase(text, issue) {
  if (text.slice(issue.offset, issue.offset + issue.length) === issue.original_phrase) return issue.offset;
  return text.indexOf(issue.original_phrase);
}

/**
 * Applies one fix. Returns { text, issues } with later offsets shifted and
 * any issue that overlapped the edit dropped; null if the phrase is gone.
 */
export function applyIssue(text, issues, id) {
  const issue = issues.find((i) => i.id === id);
  if (!issue) return null;
  const at = findPhrase(text, issue);
  if (at === -1) return null;
  const end = at + issue.length;
  const delta = issue.suggestion.length - issue.length;
  const next = text.slice(0, at) + issue.suggestion + text.slice(end);
  const rest = issues
    .filter((i) => i.id !== id && !(i.offset < end && i.offset + i.length > at))
    .map((i) => (i.offset >= end ? { ...i, offset: i.offset + delta } : i));
  return { text: next, issues: rest };
}

/** Applies every issue that has a suggestion, last to first so offsets stay valid. */
export function applyAll(text, issues) {
  let state = { text, issues };
  const fixable = issues.filter((i) => i.suggestion).sort((a, b) => b.offset - a.offset);
  for (const issue of fixable) {
    state = applyIssue(state.text, state.issues, issue.id) ?? state;
  }
  return state;
}
