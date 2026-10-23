import { describe, expect, test } from "vitest";
import { applyAll, applyIssue, fromLanguageTool, grammarEngineFor, locateIssues } from "@/lib/grammar";
import { SAMPLES } from "@/lib/samples";

describe("grammarEngineFor", () => {
  test("English drafts, including all samples, go to LanguageTool", () => {
    for (const s of SAMPLES) expect(grammarEngineFor(s.text)).toBe("languagetool");
    expect(grammarEngineFor("Send the report to the client by Friday.")).toBe("languagetool");
  });

  test("Devanagari and Hinglish drafts go to the AI", () => {
    expect(grammarEngineFor("कृपया शुक्रवार तक भुगतान करें।")).toBe("gemini");
    expect(grammarEngineFor("Bhai report kal tak bhej do, client ko Friday ko dikhana hai aur abhi tak kuch nahi aaya.")).toBe("gemini");
  });
});

describe("fromLanguageTool", () => {
  const text = "This are a test of teh checker , ok";
  const matches = [
    { offset: 0, length: 4, message: "Use these", replacements: [{ value: "These" }], rule: { id: "THIS_NNS", issueType: "grammar", category: { id: "GRAMMAR" } } },
    { offset: 19, length: 3, message: "Spelling", replacements: [{ value: "the" }], rule: { id: "MORFOLOGIK", issueType: "misspelling", category: { id: "TYPOS" } } },
    { offset: 30, length: 2, message: "Space before comma", replacements: [{ value: "," }], rule: { id: "COMMA_WS", issueType: "whitespace", category: { id: "TYPOGRAPHY" } } },
    { offset: 33, length: 2, message: "Informal", replacements: [], rule: { id: "OK", issueType: "style", category: { id: "STYLE" } } },
  ];

  test("maps types and keeps the exact phrase and offsets", () => {
    const issues = fromLanguageTool(matches, text, "standard");
    expect(issues.map((i) => [i.type, i.original_phrase, i.suggestion])).toEqual([
      ["grammar", "This", "These"],
      ["spelling", "teh", "the"],
      ["punctuation", " ,", ","],
      ["clarity", "ok", ""],
    ]);
  });

  test("light strictness keeps only spelling and grammar", () => {
    expect(fromLanguageTool(matches, text, "light").map((i) => i.type)).toEqual(["grammar", "spelling"]);
  });
});

describe("locateIssues", () => {
  test("finds AI phrases in order and drops ones not in the text", () => {
    const text = "kal tak bhej dena, aur kal tak call karna";
    const issues = locateIssues(text, [
      { original_phrase: "kal tak", suggestion: "kal tak", type: "grammar", reason: "same" },
      { original_phrase: "bhej dena", suggestion: "bhej dijiye", type: "clarity", reason: "Politer" },
      { original_phrase: "not here", suggestion: "x", type: "grammar", reason: "missing" },
      { original_phrase: "kal tak", suggestion: "parso tak", type: "grammar", reason: "second" },
    ]);
    expect(issues.map((i) => [i.original_phrase, i.offset])).toEqual([
      ["bhej dena", 8],
      ["kal tak", 23],
    ]);
  });
});

describe("applyIssue / applyAll", () => {
  const text = "This are a test of teh checker.";
  const issues = [
    { id: "a", original_phrase: "This are", suggestion: "This is", type: "grammar", reason: "", offset: 0, length: 8 },
    { id: "b", original_phrase: "teh", suggestion: "the", type: "spelling", reason: "", offset: 19, length: 3 },
  ];

  test("accepting one fix shifts the offsets of later issues", () => {
    const r = applyIssue(text, issues, "a");
    expect(r.text).toBe("This is a test of teh checker.");
    expect(r.issues).toEqual([{ ...issues[1], offset: 18 }]);
    expect(r.text.slice(18, 21)).toBe("teh");
  });

  test("finds the phrase again if the user edited text before it", () => {
    const edited = "Hello. " + text;
    expect(applyIssue(edited, issues, "b").text).toBe("Hello. This are a test of the checker.");
  });

  test("returns null when the phrase no longer exists", () => {
    expect(applyIssue("Completely different.", issues, "b")).toBeNull();
  });

  test("accept all applies every fix", () => {
    expect(applyAll(text, issues)).toEqual({ text: "This is a test of the checker.", issues: [] });
  });
});
