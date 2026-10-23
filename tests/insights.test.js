import { expect, test } from "vitest";
import { buildInsights, seriesColor } from "@/lib/insights";

const tone = { formality: 50, warmth: 50, urgency: 50, directness: 50 };
const original = "Please refund ₹14,200 to Priya by 28 March.";
const vibes = [
  { id: "executive", name: "Executive", text: "Refund ₹14,200 to Priya by 28 March, please.", tone, meaning_score: 90, intent_preserved: true },
  { id: "genz", name: "Gen-Z", text: "Yo, refund pls!", tone, meaning_score: 40, intent_preserved: false },
  { id: "custom", name: "Professor", text: "Kindly refund ₹14,200 to Priya by 28 March.", tone, meaning_score: 85, intent_preserved: true },
];
const meaningFor = (v) => (v.id === "custom" ? { state: "ai" } : v.id === "genz" ? { state: "local", percent: 52 } : { state: "pending" });

test("summarises meaning, change, length and facts across rewrites", () => {
  const { rows, summary } = buildInsights({ vibes, original, meaningFor });
  expect(rows.map((r) => r.meaning)).toEqual([null, { percent: 52, source: "local" }, { percent: 85, source: "ai" }]);
  expect(summary.bestMeaning.id).toBe("custom");
  expect(summary.mostChanged.id).toBe("genz");
  expect(summary.shortest.id).toBe("genz");
  // 3 facts (amount, name, date) per rewrite; Gen-Z keeps none of them
  expect([summary.factsFound, summary.factsChecked]).toEqual([6, 9]);
});

test("colour is tied to the vibe, not its position", () => {
  expect(seriesColor("legal")).toBe("var(--series-3)");
  expect(seriesColor("custom")).toBe("var(--series-5)");
});
