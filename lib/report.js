// Everything the export features need about a result, computed once.
import { checkFacts, describeFact } from "./factguard";
import { meaningLabel } from "./meaning";
import { OUTPUT_LANGUAGES, TARGET_TONES, WRITING_STYLES } from "./options";

const label = (list, id) => list.find((o) => o.id === id)?.label ?? id;
const toneLine = (t) => `Formality ${t.formality} · Warmth ${t.warmth} · Urgency ${t.urgency} · Directness ${t.directness}`;

export function reportData({ result, source, meaningFor }) {
  const vibes = result.vibes.map((v) => {
    const facts = checkFacts(source.text, v.text);
    const m = meaningFor(v);
    const meaning =
      m.state === "local"
        ? `${m.percent}% ${meaningLabel(m.percent)} (local model)`
        : m.state === "ai" && v.meaning_score !== null
          ? `${v.meaning_score}% (AI-estimated)`
          : "not measured";
    return {
      name: v.name,
      text: v.text,
      facts: !facts.facts.length
        ? "No facts to check"
        : facts.passed
          ? `VERIFIED: all ${facts.found} facts preserved`
          : `MISSING: ${facts.missing.map(describeFact).join(", ")}`,
      factsPassed: facts.passed,
      meaning,
      intent: `${v.intent_preserved === false ? "changed" : v.intent_preserved ? "preserved" : "unclear"}${v.intent_note ? ` (${v.intent_note.replace(/\.$/, "")})` : ""}`,
      tone: toneLine(v.tone),
    };
  });
  const s = source.settings;
  return {
    original: source.text,
    originalTone: result.original_tone ? `${result.original_tone.label} (${result.original_tone.confidence}% confident). ${toneLine(result.original_tone)}` : "",
    brief: `${label(OUTPUT_LANGUAGES, s.language)} · ${label(WRITING_STYLES, s.style)} · Tone: ${label(TARGET_TONES, s.tone)}`,
    vibes,
  };
}

/** Plain text for "Copy all". */
export function reportText(data) {
  const blocks = data.vibes.map(
    (v) => `--- ${v.name} ---\n${v.text}\n\nFact Guard: ${v.facts}\nMeaning Match: ${v.meaning}\nIntent: ${v.intent}`
  );
  return [`VibeShift rewrites (${data.brief})`, `Original draft:\n${data.original}`, ...blocks].join("\n\n");
}
