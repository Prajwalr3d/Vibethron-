import { describe, expect, test } from "vitest";
import { cosine, meaningLabel, modelFor, splitSentences, toPercent } from "@/lib/meaning";

describe("cosine", () => {
  test("identical direction is 1, opposite is -1, orthogonal is 0", () => {
    expect(cosine([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    expect(cosine([1, 0], [-1, 0])).toBeCloseTo(-1);
    expect(cosine([1, 0], [0, 5])).toBeCloseTo(0);
  });

  test("matches a hand-computed value", () => {
    // (1*4 + 2*5 + 3*6) / (sqrt(14) * sqrt(77)) = 32 / 32.833
    expect(cosine([1, 2, 3], [4, 5, 6])).toBeCloseTo(0.9746, 4);
  });

  test("zero vectors give 0 and mismatched lengths throw", () => {
    expect(cosine([0, 0], [1, 1])).toBe(0);
    expect(() => cosine([1, 2], [1, 2, 3])).toThrow();
  });
});

describe("helpers", () => {
  test("percent and labels follow the calibrated thresholds", () => {
    expect(toPercent(0.912)).toBe(91);
    expect(toPercent(-0.2)).toBe(0);
    expect(meaningLabel(91)).toBe("Strong");
    expect(meaningLabel(70)).toBe("Fair");
    expect(meaningLabel(45)).toBe("Drifted");
  });

  test("splits sentences, bullets and Hindi danda; drops one-word fragments", () => {
    expect(splitSentences("Rajesh,\n\nWe paid on time. Where are the chairs?\n- Bugs down to 19\nकृपया भुगतान करें। धन्यवाद जी")).toEqual([
      "We paid on time.",
      "Where are the chairs?",
      "Bugs down to 19",
      "कृपया भुगतान करें।",
      "धन्यवाद जी",
    ]);
  });

  test("picks the multilingual model for Devanagari and none for Hinglish", () => {
    expect(modelFor("en", "Pay now", "Please pay")).toBe("en");
    expect(modelFor("hi", "Pay now", "कृपया भुगतान करें")).toBe("multi");
    expect(modelFor("en", "कृपया भुगतान करें", "Please pay")).toBe("multi");
    expect(modelFor("hinglish", "Pay now", "Jaldi pay karo")).toBeNull();
  });
});
