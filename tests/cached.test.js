import { describe, expect, test } from "vitest";
import { cachedGrammar, cachedTone, cachedTransform } from "@/lib/cached";
import { checkFacts } from "@/lib/factguard";
import { locateIssues } from "@/lib/grammar";
import { SAMPLES } from "@/lib/samples";
import { normalizeFull } from "@/lib/transformSchema";
import { VIBES } from "@/lib/vibes";

describe("offline demo data", () => {
  test("exists only for the sample drafts", () => {
    expect(cachedTransform("Something else entirely")).toBeNull();
    expect(cachedTone("")).toBeNull();
    for (const s of SAMPLES) expect(cachedTransform(`  ${s.text}\n`)).not.toBeNull();
  });

  test("passes the same validation as live AI output", () => {
    for (const s of SAMPLES) {
      const data = cachedTransform(s.text);
      expect(normalizeFull(data, VIBES)).toEqual(data);
    }
  });

  test("keeps every fact, except the one deliberate miss", () => {
    const misses = [];
    for (const s of SAMPLES) {
      for (const v of cachedTransform(s.text).vibes) {
        checkFacts(s.text, v.text).missing.forEach((f) => misses.push(`${s.id}/${v.id}: ${f.raw}`));
      }
    }
    expect(misses).toEqual(["feedback/genz: 9 AM"]);
  });

  test("grammar phrases are found in the sample text", () => {
    for (const s of SAMPLES) {
      const raw = cachedGrammar(s.text);
      expect(locateIssues(s.text, raw)).toHaveLength(raw.length);
    }
  });
});
