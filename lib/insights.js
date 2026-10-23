// Numbers behind the Insights dashboard, derived from the same checks the cards show.
import { changeStats } from "./changeStats";
import { checkFacts } from "./factguard";

// Colour follows the vibe, never its position, so a removed card never repaints the rest.
const SLOT = { executive: 1, peer: 2, legal: 3, genz: 4, custom: 5 };
export const seriesColor = (id) => `var(--series-${SLOT[id] ?? 5})`;

const maxBy = (rows, f) => rows.reduce((best, r) => (f(r) > f(best) ? r : best), rows[0]);

/** meaningFor(vibe) -> { state: "local" | "ai" | "pending", percent? } as used by the cards. */
export function buildInsights({ vibes, original, meaningFor }) {
  const rows = vibes.map((v) => {
    const stats = changeStats(original, v.text);
    const facts = checkFacts(original, v.text);
    const m = meaningFor(v);
    const meaning =
      m.state === "local"
        ? { percent: m.percent, source: "local" }
        : m.state === "ai" && v.meaning_score !== null
          ? { percent: v.meaning_score, source: "ai" }
          : null;
    return {
      id: v.id,
      name: v.name,
      color: seriesColor(v.id),
      tone: v.tone,
      wordsBefore: stats.wordsBefore,
      wordsAfter: stats.wordsAfter,
      percentChanged: stats.percentChanged,
      meaning,
      intentPreserved: v.intent_preserved,
      factsFound: facts.found,
      factsChecked: facts.facts.length - facts.unchecked.length,
    };
  });

  const scored = rows.filter((r) => r.meaning);
  return {
    rows,
    summary: {
      bestMeaning: scored.length ? maxBy(scored, (r) => r.meaning.percent) : null,
      mostChanged: maxBy(rows, (r) => r.percentChanged),
      shortest: maxBy(rows, (r) => -r.wordsAfter),
      factsFound: rows.reduce((s, r) => s + r.factsFound, 0),
      factsChecked: rows.reduce((s, r) => s + r.factsChecked, 0),
    },
  };
}
