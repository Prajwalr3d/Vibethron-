import { describe, expect, test } from "vitest";
import { checkFacts, extractFacts } from "@/lib/factguard";
import { SAMPLES } from "@/lib/samples";

const keys = (text) => extractFacts(text).map((f) => f.key);
const missingRaw = (r) => r.missing.map((f) => f.raw);

describe("extractFacts", () => {
  test("finds amounts, percentages, dates, times and names", () => {
    const k = keys("Please pay ₹48,500 (73.6% of the total) to Sharma Furniture by 15 March at 6:30 PM.");
    expect(k).toEqual(
      expect.arrayContaining(["amount:INR:48500", "percent:73.6", "date:15-3", "time:18:30", "name:sharma furniture"])
    );
  });

  test("ignores capitalised sentence starters but keeps addressed names", () => {
    const k = keys("Vikram, your report was late. Fix it by Thursday. Two charts were wrong. Run it past Neha.");
    expect(k).toContain("name:vikram");
    expect(k).toContain("name:neha");
    expect(k).toContain("weekday:thu");
    expect(k).not.toContain("name:fix");
    expect(k).not.toContain("name:two");
  });

  test("splits date ranges and keeps titles out of names", () => {
    const k = keys("Ananya out 21-24 Oct. Demo to Mr. Verma on 31 Oct, 11:00 AM.");
    expect(k).toEqual(expect.arrayContaining(["date:21-10", "date:24-10", "date:31-10", "time:11:00", "name:verma"]));
  });
});

describe("checkFacts", () => {
  test("passes when facts are reformatted but unchanged", () => {
    const r = checkFacts(
      "We paid Rs 5,000 on 15 March at 6:30 PM to Hotel Leela. That is 20% of the budget.",
      "On March 15, at 6:30 pm, ₹5000 went to the Leela hotel, which is 20 percent of our budget."
    );
    expect(r.missing).toEqual([]);
    expect(r.passed).toBe(true);
    expect(r.found).toBe(r.facts.length);
  });

  test("lists exactly what went missing", () => {
    const r = checkFacts(
      "I want the remaining 35 chairs by Friday 28 March or a refund of ₹14,200.",
      "Please send the remaining chairs by Friday 28 March."
    );
    expect(r.passed).toBe(false);
    expect(missingRaw(r).sort()).toEqual(["35", "₹14,200"].sort());
  });

  test("catches a changed amount even when the number looks similar", () => {
    const r = checkFacts("Q2 revenue is ₹3.2 crore.", "Q2 revenue is ₹2.3 crore.");
    expect(missingRaw(r)).toEqual(["₹3.2 crore"]);
  });

  test("matches Devanagari digits, Hindi month and weekday names", () => {
    const r = checkFacts(
      "Send the 35 chairs by Friday 28 March or refund ₹14,200.",
      "कृपया शुक्रवार २८ मार्च तक ३५ कुर्सियाँ भेजें या ₹१४,२०० लौटाएँ।"
    );
    expect(r.missing).toEqual([]);
  });

  test("does not flag transliterated names in a Devanagari rewrite, but notes them", () => {
    const r = checkFacts("Priya Mehta paid ₹48,500 to Sharma Furniture.", "प्रिया मेहता ने शर्मा फर्नीचर को ₹48,500 दिए।");
    expect(r.passed).toBe(true);
    expect(r.unchecked.map((f) => f.raw).sort()).toEqual(["Priya Mehta", "Sharma Furniture"]);
  });

  test("still flags missing Latin names in a Hinglish rewrite", () => {
    const r = checkFacts("Run it past Neha before sending.", "Bhejne se pehle ek baar check karwa lena.");
    expect(missingRaw(r)).toEqual(["Neha"]);
  });

  test("a bare time without AM/PM matches either half of the day", () => {
    const r = checkFacts("The event is at 6:30 PM.", "Event शाम 6:30 बजे है।");
    expect(r.passed).toBe(true);
  });

  test("marks preserved facts in the rewrite", () => {
    const rewrite = "Hi Rajesh, please refund ₹14,200 by 28 March.";
    const r = checkFacts("Rajesh, refund ₹14,200 by 28 March.", rewrite);
    const marked = r.marks.map((m) => rewrite.slice(m.start, m.end));
    expect(marked).toEqual(["Rajesh", "₹14,200", "28 March"]);
  });

  test("every sample draft passes against itself", () => {
    for (const s of SAMPLES) expect(checkFacts(s.text, s.text).passed).toBe(true);
  });
});

test("a sentence-ending full stop is not part of a time", () => {
  const rewrite = "See you at 6:30 PM.";
  const r = checkFacts("The event is at 6:30 PM.", rewrite);
  expect(r.facts[0].raw).toBe("6:30 PM");
  expect(r.marks.map((m) => rewrite.slice(m.start, m.end))).toEqual(["6:30 PM"]);
});
