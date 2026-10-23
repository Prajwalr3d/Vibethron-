import { expect, test } from "vitest";
import { languageMismatch } from "@/lib/languageCheck";
import { checkFacts } from "@/lib/factguard";

// Texts below are shortened from real Gemini output seen in live testing.
test("Hindi requests must come back in Devanagari", () => {
  expect(languageMismatch("कृपया Friday 28 March तक शेष 35 chairs भेजें या ₹14,200 लौटाएँ।", "hi")).toBeNull();
  expect(languageMismatch("Project Atlas Week 12 Update. Razorpay sandbox access has been pending since 9 Oct.", "hi")).toBe("isn't in Devanagari");
  expect(languageMismatch("Vikram, sprint report ka submission deadline Monday 9 AM tha, jo Wednesday 4 PM par mila.", "hi")).toBe("isn't in Devanagari");
});

test("Hinglish requests must be Romanised Hindi, not plain English or Devanagari", () => {
  expect(languageMismatch("Rajesh ji, humne 3 March ko ₹48,500 pay kiye the, par sirf 85 chairs aayi hain.", "hinglish")).toBeNull();
  expect(languageMismatch("Vikram, sprint report update required. Submission was late and contained errors.", "hinglish")).toBe(
    "reads as plain English, not Hinglish"
  );
  expect(languageMismatch("कृपया शुक्रवार तक भेजें", "hinglish")).toBe("uses Devanagari instead of Roman script");
});

test("English requests only fail when the text is mostly Devanagari", () => {
  expect(languageMismatch("Please send the chairs by Friday.", "en")).toBeNull();
  expect(languageMismatch("कृपया शुक्रवार तक कुर्सियाँ भेजें।", "en")).toBe("isn't in English");
});

test("capitalised weekday abbreviations count, lowercase words don't", () => {
  expect(checkFacts("It was due Monday 9 AM and came in Wednesday at 4 PM.", "Due Mon 9 AM, reached Wed 4 PM.").passed).toBe(true);
  expect(checkFacts("Send it by Wednesday.", "They will wed soon.").passed).toBe(false);
});
