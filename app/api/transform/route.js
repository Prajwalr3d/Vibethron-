import { FriendlyError, generateJson } from "@/lib/gemini";
import { OUTPUT_LANGUAGES, TARGET_TONES, WRITING_STYLES } from "@/lib/options";
import { MAX_CHARS, hasWords } from "@/lib/textStats";
import { SYSTEM_INSTRUCTION, buildFullPrompt, buildSinglePrompt } from "@/lib/prompt";
import { FULL_SCHEMA, SINGLE_SCHEMA, ShapeError, normalizeFull, normalizeSingle } from "@/lib/transformSchema";
import { languageWarnings } from "@/lib/languageCheck";
import { VIBES, customVibe, vibeById } from "@/lib/vibes";

const ids = (list) => new Set(list.map((o) => o.id));
const LANGUAGES = ids(OUTPUT_LANGUAGES);
const STYLES = ids(WRITING_STYLES);
const TONES = ids(TARGET_TONES);

function fail(status, error, code) {
  return Response.json({ error, code }, { status });
}

/**
 * Wraps a validator so an answer in the wrong language counts as a bad answer
 * while a retry is still available. After that it is accepted, and any
 * remaining misses go back to the user as warnings.
 */
function inLanguage(language, normalize) {
  return (data, { canRetry } = {}) => {
    const result = normalize(data);
    const vibes = result.vibes ?? result;
    if (canRetry && languageWarnings(vibes, language).length) throw new ShapeError("Wrong output language");
    return result;
  };
}

/**
 * POST { text, language, style, tone }              -> all four vibes + original analysis
 * POST { text, language, style, tone, vibe, previous } -> { vibe } (regenerate one card)
 * POST { ..., vibe: "custom", audience }               -> { vibe } for a user-described reader
 */
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail(400, "The request wasn't readable.", "bad_request");

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return fail(400, "Write or paste a draft first.", "empty");
  if (!hasWords(text)) return fail(400, "Add some words; emoji or symbols alone can't be rewritten.", "no_words");
  if (text.length > MAX_CHARS) {
    return fail(413, `Drafts can be up to ${MAX_CHARS.toLocaleString("en-IN")} characters.`, "too_long");
  }

  const settings = {
    language: LANGUAGES.has(body.language) ? body.language : "en",
    style: STYLES.has(body.style) ? body.style : "professional",
    tone: TONES.has(body.tone) ? body.tone : "auto",
  };

  try {
    if (body.vibe) {
      const def = body.vibe === "custom" ? customVibe(body.audience) : vibeById(body.vibe);
      if (!def) {
        return body.vibe === "custom"
          ? fail(400, "Describe the audience first.", "no_audience")
          : fail(400, "Unknown vibe.", "bad_vibe");
      }
      const previous = typeof body.previous === "string" ? body.previous.slice(0, MAX_CHARS * 2) : "";
      const vibe = await generateJson({
        system: SYSTEM_INSTRUCTION,
        prompt: buildSinglePrompt({ text, settings, vibe: def, previous }),
        schema: SINGLE_SCHEMA,
        validate: inLanguage(settings.language, (data) => [normalizeSingle(data, def)]),
      });
      return Response.json({ vibe: vibe[0], warnings: languageWarnings(vibe, settings.language) });
    }

    const result = await generateJson({
      system: SYSTEM_INSTRUCTION,
      prompt: buildFullPrompt({ text, settings, vibes: VIBES }),
      schema: FULL_SCHEMA,
      validate: inLanguage(settings.language, (data) => normalizeFull(data, VIBES)),
    });
    return Response.json({ ...result, warnings: languageWarnings(result.vibes, settings.language) });
  } catch (err) {
    if (err instanceof FriendlyError) return fail(err.status, err.message, err.code);
    console.error("transform failed", err);
    return fail(500, "Something went wrong while rewriting. Try again.", "internal");
  }
}
