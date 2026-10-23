import { FriendlyError, generateJson } from "@/lib/gemini";
import { MAX_GRAMMAR_BYTES, STRICTNESS, fromLanguageTool, grammarEngineFor, locateIssues } from "@/lib/grammar";
import { ANALYST_INSTRUCTION, buildGrammarPrompt } from "@/lib/prompt";
import { allow, clientKey } from "@/lib/rateLimit";
import { MAX_CHARS } from "@/lib/textStats";
import { GRAMMAR_SCHEMA, normalizeGrammar } from "@/lib/transformSchema";

const LT_URL = "https://api.languagetool.org/v2/check";

function fail(status, error, code) {
  return Response.json({ error, code }, { status });
}

/** Returns issues from LanguageTool, or null if it failed or the text isn't English. */
async function checkWithLanguageTool(text, strictness) {
  const body = new URLSearchParams({
    text,
    language: "auto",
    preferredVariants: "en-GB", // Indian English spelling is closest to British
    level: strictness === "strict" ? "picky" : "default",
  });
  try {
    const res = await fetch(LT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body,
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!String(data?.language?.detectedLanguage?.code || data?.language?.code || "en").startsWith("en")) return null;
    return fromLanguageTool(data.matches, text, strictness);
  } catch {
    return null;
  }
}

async function checkWithGemini(text, strictness) {
  const raw = await generateJson({
    system: ANALYST_INSTRUCTION,
    prompt: buildGrammarPrompt(text, strictness),
    schema: GRAMMAR_SCHEMA,
    validate: normalizeGrammar,
    temperature: 0.2,
  });
  return locateIssues(text, raw);
}

/** POST { text, strictness } -> { issues, engine } */
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text : "";
  if (!text.trim()) return fail(400, "Write or paste a draft first.", "empty");
  if (text.length > MAX_CHARS || new TextEncoder().encode(text).length > MAX_GRAMMAR_BYTES) {
    return fail(413, "That draft is too long to check.", "too_long");
  }
  // LanguageTool's free tier allows about 20 requests a minute per IP; stay under it.
  if (!allow("grammar", clientKey(request), 15, 60_000)) {
    return fail(429, "Too many grammar checks in a minute. Wait a little and try again.", "rate_limited");
  }
  const strictness = STRICTNESS.includes(body.strictness) ? body.strictness : "standard";

  const english = grammarEngineFor(text) === "languagetool";
  try {
    if (english) {
      const issues = await checkWithLanguageTool(text, strictness);
      if (issues) return Response.json({ issues, engine: "languagetool" });
    }
    const issues = await checkWithGemini(text, strictness);
    return Response.json({ issues, engine: "gemini" });
  } catch (err) {
    if (err instanceof FriendlyError) {
      const message =
        err.code !== "no_key"
          ? err.message
          : english
            ? "LanguageTool is unavailable right now, and the AI fallback isn't set up."
            : "Hindi and Hinglish drafts are checked by the AI, which isn't set up on this deployment.";
      return fail(err.status, message, err.code);
    }
    console.error("grammar failed", err);
    return fail(500, "Something went wrong while checking grammar.", "internal");
  }
}
