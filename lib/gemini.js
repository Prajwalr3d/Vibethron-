// Server-only Gemini client. Never import this from a client component.
import { ShapeError, parseModelJson } from "./transformSchema";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
// 3.8 and 3.7 Flash were overloaded (503s, 60s hangs) when tested on 2026-10-23,
// while 3.6 and 3.5 answered in ~1.3s. Overload comes and goes, so we also fall back.
// Free-tier quotas are per model, so a 429 also moves down this list.
export const DEFAULT_MODEL = "gemini-3.6-flash";
const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
const TIMEOUT_MS = 30_000;

/** An error whose message is safe to show the user. */
export class FriendlyError extends Error {
  constructor(message, status = 502, code = "upstream_error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Seconds Gemini asks us to wait, from RetryInfo ("41s") or the Retry-After header. */
function retrySeconds(res, detail) {
  try {
    const info = JSON.parse(detail).error?.details?.find((d) => d["@type"]?.includes("RetryInfo"));
    const s = parseFloat(info?.retryDelay);
    if (Number.isFinite(s)) return Math.ceil(s);
  } catch {}
  const header = Number(res.headers.get("retry-after"));
  return Number.isFinite(header) && header > 0 ? header : null;
}

async function callOnce({ key, model, system, prompt, schema, lean, temperature }) {
  // `lean` drops the schema and thinking options, in case the model rejects them.
  const generationConfig = { responseMimeType: "application/json", temperature };
  if (!lean) {
    generationConfig.responseSchema = schema;
    generationConfig.thinkingConfig = { thinkingLevel: "low" };
  }

  let res;
  try {
    res = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw err?.name === "TimeoutError"
      ? new FriendlyError("The AI took too long to answer. Try again.", 504, "timeout")
      : new FriendlyError("Couldn't reach the AI service. Check your connection.", 502, "unreachable");
  }

  if (!res.ok) {
    // Server log only (never the key): what Gemini said, so failures can be diagnosed.
    const detail = await res.text().catch(() => "");
    console.warn(`gemini ${model} -> ${res.status}${lean ? " (lean)" : ""}: ${detail.replace(/\s+/g, " ").slice(0, 300)}`);
    return { res, detail };
  }

  const data = await res.json().catch(() => null);
  if (data?.promptFeedback?.blockReason) {
    throw new FriendlyError("The AI declined to rewrite this draft.", 422, "blocked");
  }
  const candidate = data?.candidates?.[0];
  if (candidate?.finishReason === "SAFETY") {
    throw new FriendlyError("The AI declined to rewrite this draft.", 422, "blocked");
  }
  const text = (candidate?.content?.parts || [])
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
  return { res, text };
}

/**
 * Calls Gemini and returns validated JSON.
 * - An overloaded, rate-limited, missing or timed-out model moves on to the next fallback model.
 * - One retry on the same model for malformed/invalid JSON, a 400 (retried
 *   without schema/thinking options), or a short 429 wait on the last model.
 */
export async function generateJson({ system, prompt, schema, validate, temperature = 0.7 }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new FriendlyError("AI rewriting isn't set up on this deployment.", 503, "no_key");
  }
  // A configured model goes first; the default and fallbacks back it up.
  const models = [...new Set([process.env.GEMINI_MODEL || DEFAULT_MODEL, DEFAULT_MODEL, ...FALLBACK_MODELS])];

  let m = 0;
  let lean = false;
  let retried = false;
  const canFallBack = () => m < models.length - 1;

  for (;;) {
    const model = models[m];
    let res, text, detail;
    try {
      ({ res, text, detail } = await callOnce({ key, model, system, prompt, schema, lean, temperature }));
    } catch (err) {
      if (err.code === "timeout" && canFallBack()) {
        m++;
        continue;
      }
      throw err;
    }

    if (!res.ok) {
      if ((res.status >= 500 || res.status === 404 || res.status === 429) && canFallBack()) {
        m++;
        continue;
      }
      const wait = res.status === 429 ? retrySeconds(res, detail) : null;
      if (res.status === 429 && !retried && wait !== null && wait <= 5) {
        retried = true;
        await sleep(wait * 1000);
        continue;
      }
      if (res.status === 400 && !retried && !lean) {
        retried = true;
        lean = true;
        continue;
      }
      if (res.status === 429) {
        const when = wait ? `in about ${wait} seconds` : "in a minute";
        throw new FriendlyError(`The AI's request limit was reached. Try again ${when}.`, 429, "rate_limited");
      }
      if (res.status === 401 || res.status === 403) {
        throw new FriendlyError("The AI key was rejected. Check GEMINI_API_KEY.", 502, "bad_key");
      }
      if (res.status === 404) {
        throw new FriendlyError(`The AI model "${model}" wasn't found. Check GEMINI_MODEL.`, 502, "bad_model");
      }
      if (res.status === 503) {
        throw new FriendlyError("The AI is overloaded right now. Try again in a minute.", 503, "overloaded");
      }
      throw new FriendlyError("The AI service returned an error. Try again.", 502, "upstream_error");
    }

    try {
      // canRetry lets a validator be strict only while a retry is still available.
      return validate(parseModelJson(text), { canRetry: !retried });
    } catch (err) {
      if (!(err instanceof ShapeError)) throw err;
      if (retried) {
        throw new FriendlyError("The AI sent back an answer we couldn't read, twice. Try again.", 502, "malformed");
      }
      retried = true;
    }
  }
}
