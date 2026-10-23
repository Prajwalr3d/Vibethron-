// Parsing and validation of the model's JSON, plus the schema sent to Gemini.

export class ShapeError extends Error {}

const TONE_KEYS = ["formality", "warmth", "urgency", "directness"];

/** Strips ``` fences and stray prose, then parses. Throws ShapeError on failure. */
export function parseModelJson(raw) {
  const cleaned = String(raw ?? "")
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {}
    }
    throw new ShapeError("Model output was not valid JSON");
  }
}

function score(value, field) {
  const n = Number(value);
  if (value === null || value === "" || !Number.isFinite(n)) {
    throw new ShapeError(`Missing score: ${field}`);
  }
  return Math.max(0, Math.min(100, Math.round(n)));
}

const optionalScore = (value) => {
  const n = Number(value);
  return value === null || value === undefined || !Number.isFinite(n)
    ? null
    : Math.max(0, Math.min(100, Math.round(n)));
};

const str = (value) => (typeof value === "string" ? value.trim() : "");

function bool(value) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null; // unknown, shown as such rather than guessed
}

function tone(raw, where) {
  if (!raw || typeof raw !== "object") throw new ShapeError(`Missing tone: ${where}`);
  return Object.fromEntries(TONE_KEYS.map((k) => [k, score(raw[k], `${where}.${k}`)]));
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*[*•]\s+/gm, "- ");
}

export function normalizeVibe(raw, def) {
  if (!raw || typeof raw !== "object") throw new ShapeError(`Missing vibe: ${def.id}`);
  const text = stripMarkdown(str(raw.text));
  if (!text) throw new ShapeError(`Empty text: ${def.id}`);
  return {
    id: def.id,
    name: def.name,
    text,
    tone: tone(raw.tone, def.id),
    meaning_score: optionalScore(raw.meaning_score),
    intent: str(raw.intent),
    intent_preserved: bool(raw.intent_preserved),
    intent_note: str(raw.intent_note),
    risks: Array.isArray(raw.risks) ? raw.risks.map(str).filter(Boolean).slice(0, 3) : [],
    reaction: str(raw.reaction),
  };
}

/** Validates a full transform; vibes are matched by id, falling back to order. */
export function normalizeFull(data, defs) {
  if (!data || typeof data !== "object" || !Array.isArray(data.vibes)) {
    throw new ShapeError("Missing vibes array");
  }
  const vibes = defs.map((def, i) => {
    const raw = data.vibes.find((v) => v?.id === def.id) ?? data.vibes[i];
    return normalizeVibe(raw, def);
  });
  const ot = data.original_tone || {};
  return {
    original_intent: str(data.original_intent),
    original_tone: {
      label: str(ot.label) || "Unclear",
      confidence: optionalScore(ot.confidence) ?? 0,
      ...tone(ot, "original_tone"),
    },
    vibes,
  };
}

export function normalizeSingle(data, def) {
  return normalizeVibe(data?.vibe ?? data, def);
}

// ---------- Gemini responseSchema (OpenAPI-style subset) ----------
const S = (type, extra = {}) => ({ type, ...extra });
const scoreSchema = S("integer", { minimum: 0, maximum: 100 });
const toneProps = Object.fromEntries(TONE_KEYS.map((k) => [k, scoreSchema]));

const vibeSchema = S("object", {
  properties: {
    id: S("string"),
    name: S("string"),
    text: S("string"),
    tone: S("object", { properties: toneProps, required: TONE_KEYS }),
    meaning_score: scoreSchema,
    intent: S("string"),
    intent_preserved: S("boolean"),
    intent_note: S("string"),
    risks: S("array", { items: S("string") }),
    reaction: S("string"),
  },
  required: ["id", "text", "tone", "meaning_score", "intent", "intent_preserved", "intent_note", "risks", "reaction"],
});

export const FULL_SCHEMA = S("object", {
  properties: {
    original_intent: S("string"),
    original_tone: S("object", {
      properties: { label: S("string"), confidence: scoreSchema, ...toneProps },
      required: ["label", "confidence", ...TONE_KEYS],
    }),
    vibes: S("array", { items: vibeSchema }),
  },
  required: ["original_intent", "original_tone", "vibes"],
});

export const SINGLE_SCHEMA = S("object", {
  properties: { vibe: vibeSchema },
  required: ["vibe"],
});
