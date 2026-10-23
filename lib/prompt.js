import { OUTPUT_LANGUAGES, TARGET_TONES, WRITING_STYLES } from "./options";

const LANGUAGE_RULES = {
  en: "English.",
  hi: "Hindi written in Devanagari script. Keep all numbers as 0-9 digits and keep names of people, companies and products in their original Latin spelling.",
  hinglish:
    "Hinglish: natural Hindi-English mix written ONLY in Roman (Latin) script, no Devanagari. Keep all numbers as 0-9 digits.",
};

const labelOf = (list, id) => list.find((o) => o.id === id)?.label || id;

export const SYSTEM_INSTRUCTION = `You are VibeShift, an expert communication editor. You rewrite a draft message for different audiences without changing what it says.

Hard rules:
- Keep every number, amount, currency symbol, percentage, date, time and name exactly as written in the draft. Do not round, convert, reformat or drop any of them.
- Keep the sender's actual request, deadline and consequences. Change the voice, not the facts.
- Plain text only: no markdown, no asterisks, no headings, no bullet symbols. Line breaks are fine.
- Respond with JSON only, matching the requested shape exactly. No commentary before or after it.`;

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

function briefLines({ language, style, tone }) {
  const toneLine =
    tone === "auto"
      ? "Target tone: choose the tone that best suits each audience."
      : `Target tone: ${labelOf(TARGET_TONES, tone)}, adapted to each audience.`;
  return [
    `Output language: ${LANGUAGE_RULES[language] || labelOf(OUTPUT_LANGUAGES, language)}`,
    `Writing style: ${labelOf(WRITING_STYLES, style)}, applied on top of each audience's voice.`,
    toneLine,
  ].join("\n");
}

const vibeLine = (v) => `- id "${v.id}", name "${v.name}": ${v.brief}`;

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
