import { describe, expect, test } from "vitest";
import { checkIntent } from "@/lib/intentlock";

// The demo case shipped with the INTENT / SHIFT frontend (spa/types/transformer.ts).
const ORIGINAL = "I might finish the project by Friday, but I need approval first.";
const RISKY = "I will deliver the completed project by Friday.";
const SAFE = "I expect to finish by Friday, subject to approval.";

const summary = (r) => r.risks.map((x) => `${x.category}:${x.riskLevel}`).sort();

describe("IntentLock on the frontend's own demo case", () => {
  test("the risky rewrite gets exactly the three risks the design shows", () => {
    const r = checkIntent(ORIGINAL, RISKY);
    expect(summary(r)).toEqual(["commitments:critical", "conditions:critical", "negations:moderate"]);
    const commitment = r.risks.find((x) => x.category === "commitments");
    expect(commitment.originalSnippet).toBe("might finish the");
    expect(commitment.rewrittenSnippet).toBe("will deliver the");
    expect(r.risks.find((x) => x.category === "conditions").originalSnippet).toBe("need approval first");
    expect(r.categories).toEqual({
      commitments: "critical",
      deadlines: "safe",
      facts: "safe",
      conditions: "critical",
      negations: "moderate",
    });
  });

  test("the safe alternative passes cleanly", () => {
    const r = checkIntent(ORIGINAL, SAFE);
    expect(r.risks).toEqual([]);
    expect(r.critical + r.moderate).toBe(0);
  });

  test("lenient strictness hides moderate risks", () => {
    expect(summary(checkIntent(ORIGINAL, RISKY, "lenient"))).toEqual(["commitments:critical", "conditions:critical"]);
  });
});

describe("IntentLock rules", () => {
  test("a dropped date is a deadline risk and a dropped amount is a fact risk", () => {
    const r = checkIntent("Refund ₹14,200 by 28 March.", "Please send the refund soon.");
    expect(summary(r)).toEqual(["deadlines:critical", "facts:critical"]);
  });

  test("a dropped 'do not' directive is critical; a rephrased negation is only moderate", () => {
    expect(summary(checkIntent("Do not share this file outside the team.", "Please share this file with the team."))).toEqual([
      "negations:critical",
    ]);
    expect(summary(checkIntent("We can't afford this proposal.", "This proposal is beyond our budget."))).toEqual([
      "negations:moderate",
    ]);
  });

  test("a new strong promise is flagged; strict mode also flags a new 'will'", () => {
    expect(summary(checkIntent("We are looking into the outage.", "We guarantee the outage is fixed."))).toEqual([
      "commitments:moderate",
    ]);
    expect(checkIntent("We are looking into the outage.", "We will update you.").risks).toEqual([]);
    expect(summary(checkIntent("We are looking into the outage.", "We will update you.", "strict"))).toEqual([
      "commitments:moderate",
    ]);
  });

  test("fewer conditions is moderate; the same conditions reworded or reordered is fine", () => {
    expect(
      checkIntent("If the budget is approved and pending legal review, we start Monday.", "Once the budget is approved, we start Monday.").risks
    ).toEqual([
      expect.objectContaining({ category: "conditions", riskLevel: "moderate", originalSnippet: expect.stringContaining("pending legal review") }),
    ]);
    expect(checkIntent("If the budget is approved, we start Monday.", "We start Monday if the budget is approved.").risks).toEqual([]);
  });

  test("works on Hinglish and Hindi wording", () => {
    expect(summary(checkIntent("Agar approval mila toh Friday tak bhej denge.", "Friday tak bhej denge."))).toEqual([
      "conditions:critical",
    ]);
    expect(summary(checkIntent("यह फ़ाइल बाहर मत भेजना।", "यह फ़ाइल भेज देना।"))).toEqual(["negations:critical"]);
  });
});
