import { OUTPUT_LANGUAGES, TARGET_TONES, WRITING_STYLES } from "./options";

const LANGUAGE_RULES = {
  en: "English.",
  hi: "Hindi written in Devanagari script. Keep all numbers as 0-9 digits and keep names of people, companies and products in their original Latin spelling.",
  hinglish:
    'Hinglish: the way people in India text, mostly Hindi words written in Roman (Latin) script, mixed with English words. Not plain English, and no Devanagari. Example: "Rajesh ji, humne 3 March ko payment kar diya tha, par chairs abhi tak nahi aayi. Please Friday tak bhej dijiye." Keep all numbers as 0-9 digits.',
};

const labelOf = (list, id) => list.find((o) => o.id === id)?.label || id;

export const SYSTEM_INSTRUCTION = `You are an expert communication editor. You rewrite a draft message for different audiences without changing what it says.

Hard rules:
- Keep every number, amount, currency symbol, percentage, date, time and name exactly as written in the draft. Do not round, convert, reformat or drop any of them.
- Keep every person, company and place name. If the draft has a greeting or sign-off with a name, the rewrite keeps a greeting or sign-off with that name.
- Keep the sender's actual request, deadline and consequences. Change the voice, not the facts.
- Keep the sender's level of certainty: if the draft is tentative ("might", "hope to") do not turn it into a promise ("will"). Keep every condition ("if", "subject to", "need approval first") and every "do not" / "never".
- Plain text only: no markdown, no asterisks, no headings, no bullet symbols. Line breaks are fine.
- Respond with JSON only, matching the requested shape exactly. No commentary before or after it.`;

const TUNE_LABEL = (n) => (n >= 80 ? "very high" : n >= 60 ? "high" : n >= 40 ? "moderate" : n >= 20 ? "low" : "very low");

const TONE_FIELDS = `{"formality": 0-100, "warmth": 0-100, "urgency": 0-100, "directness": 0-100}`;

const VIBE_SHAPE = `{
  "id": "<vibe id>",
  "name": "<vibe name>",
  "text": "<the rewritten message>",
  "tone": ${TONE_FIELDS},
  "meaning_score": 0-100 (how fully the rewrite keeps the original meaning),
  "intent": "<one sentence: what this rewrite is trying to achieve>",
  "intent_preserved": true or false (does it still pursue the original intent?),
  "intent_note": "<one short sentence explaining that judgement>",
  "risks": ["<0-3 short ways this rewrite could misfire with its reader>"],
  "reaction": "<one sentence: how the target reader will likely react>"
}`;

function briefLines({ language, style, tone, tune, preserveQuotes }) {
  const toneLine =
    tone === "auto"
      ? "Target tone: choose the tone that best suits each audience."
      : `Target tone: ${labelOf(TARGET_TONES, tone)}, adapted to each audience.`;
  const lines = [
    `Output language: ${LANGUAGE_RULES[language] || labelOf(OUTPUT_LANGUAGES, language)}`,
    `Writing style: ${labelOf(WRITING_STYLES, style)}, applied on top of each audience's voice.`,
    toneLine,
  ];
  if (tune) {
    lines.push(
      `Fine-tuning: aim for ${TUNE_LABEL(tune.formality)} formality (${tune.formality}/100) and ${TUNE_LABEL(tune.directness)} directness (${tune.directness}/100), shifting each audience's voice in that direction.`
    );
  }
  if (preserveQuotes) lines.push('Anything inside quotation marks in the draft must appear word for word in every rewrite.');
  return lines.join("\n");
}

const vibeLine = (v) => `- id "${v.id}", name "${v.name}": ${v.brief}`;

// Repeated after the audience list: the formal audiences tended to drift back into English.
function languageReminder({ language }, many) {
  const who = many ? "every audience, including Legal/Compliance and Executive" : "this audience";
  return `Language check: write the "text" field for ${who} in ${LANGUAGE_RULES[language] || "English."} The other fields stay in English.`;
}

export function buildFullPrompt({ text, settings, vibes }) {
  return `${briefLines(settings)}

Rewrite the draft once for each of these audiences:
${vibes.map(vibeLine).join("\n")}

Also analyse the original draft itself.

Return JSON in exactly this shape:
{
  "original_intent": "<one sentence: what the sender wants to achieve>",
  "original_tone": {"label": "<one or two words, e.g. Angry, Anxious, Neutral>", "confidence": 0-100, "formality": 0-100, "warmth": 0-100, "urgency": 0-100, "directness": 0-100},
  "vibes": [ one object per audience, in the order listed, each shaped like:
${VIBE_SHAPE}
  ]
}

${languageReminder(settings, true)}

Draft:
"""
${text}
"""`;
}

export function buildSinglePrompt({ text, settings, vibe, previous }) {
  const avoid = previous
    ? `\nWrite a fresh alternative. Do not reuse this earlier version's wording:\n"""\n${previous}\n"""\n`
    : "";
  return `${briefLines(settings)}

Rewrite the draft for this one audience:
${vibeLine(vibe)}
${avoid}
Return JSON in exactly this shape:
{"vibe": ${VIBE_SHAPE}}

${languageReminder(settings, false)}

Draft:
"""
${text}
"""`;
}

const ORIGINAL_SHAPE = `{
  "original_intent": "<one sentence: what the sender wants to achieve>",
  "original_tone": {"label": "<one or two words, e.g. Angry, Anxious, Neutral>", "confidence": 0-100, "formality": 0-100, "warmth": 0-100, "urgency": 0-100, "directness": 0-100}
}`;

export const ANALYST_INSTRUCTION = `You are a careful writing analyst. You read drafts and report on them; you never rewrite them. Respond with JSON only.`;

export function buildTonePrompt(text) {
  return `Read this draft and describe the sender's intent and tone.

Return JSON in exactly this shape:
${ORIGINAL_SHAPE}

Draft:
"""
${text}
"""`;
}

const STRICTNESS_RULES = {
  light: "Only clear spelling and grammar mistakes.",
  standard: "Spelling, grammar and punctuation mistakes, plus anything genuinely unclear.",
  strict: "Spelling, grammar, punctuation, clarity and awkward or wordy phrasing.",
};

export function buildGrammarPrompt(text, strictness) {
  return `Proofread this draft. It may be Hindi in Devanagari or Hinglish (Hindi written in Roman script).
Report: ${STRICTNESS_RULES[strictness] || STRICTNESS_RULES.standard}

Rules:
- "original_phrase" must be copied exactly, character for character, from the draft, and be as short as possible.
- "suggestion" replaces only that phrase. Keep the draft's script: Hinglish stays in Roman script, Hindi stays in Devanagari.
- Do not translate, and do not flag Hinglish words just because they are not English.
- Never change numbers, amounts, dates or names.
- "type" is one of spelling, grammar, punctuation, clarity. "reason" is one short sentence in English.
- At most 15 issues. Return {"issues": []} if the draft is fine.

Return JSON: {"issues": [{"original_phrase": "...", "suggestion": "...", "type": "...", "reason": "..."}]}

Draft:
"""
${text}
"""`;
}
