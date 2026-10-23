import { FriendlyError, generateJson } from "@/lib/gemini";
import { ANALYST_INSTRUCTION, buildTonePrompt } from "@/lib/prompt";
import { MAX_CHARS, hasWords } from "@/lib/textStats";
import { TONE_SCHEMA, normalizeOriginal } from "@/lib/transformSchema";

/** POST { text } -> { original_intent, original_tone } */
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) return Response.json({ error: "Write or paste a draft first.", code: "empty" }, { status: 400 });
  if (!hasWords(text)) {
    return Response.json({ error: "Add some words; emoji or symbols alone have no tone to read.", code: "no_words" }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return Response.json({ error: "That draft is too long.", code: "too_long" }, { status: 413 });
  }
  try {
    const result = await generateJson({
      system: ANALYST_INSTRUCTION,
      prompt: buildTonePrompt(text),
      schema: TONE_SCHEMA,
      validate: normalizeOriginal,
      temperature: 0.2,
    });
    return Response.json(result);
  } catch (err) {
    if (err instanceof FriendlyError) {
      const error = err.code === "no_key" ? "Tone detection uses the AI, which isn't set up on this deployment." : err.message;
      return Response.json({ error, code: err.code }, { status: err.status });
    }
    console.error("tone failed", err);
    return Response.json({ error: "Something went wrong while reading the tone.", code: "internal" }, { status: 500 });
  }
}
