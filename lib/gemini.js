// Server-only Gemini client. Never import this from a client component.
import { ShapeError, parseModelJson } from "./transformSchema";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
export const DEFAULT_MODEL = "gemini-3.8-flash";
const TIMEOUT_MS = 45_000;

/** An error whose message is safe to show the user. */
export class FriendlyError extends Error {
  constructor(message, status = 502, code = "upstream_error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function retryDelay(res) {
  const seconds = Number(res.headers.get("retry-after"));
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds, 5) * 1000 : 1500;
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

  if (!res.ok) return { res };

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
 * Calls Gemini and returns validated JSON. One retry, used for a 429,
 * malformed/invalid JSON, or a 400 (retried without schema/thinking options).
 */
export async function generateJson({ system, prompt, schema, validate, temperature = 0.7 }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new FriendlyError("AI rewriting isn't set up on this deployment.", 503, "no_key");
  }
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  let lean = false;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const last = attempt === 2;
    const { res, text } = await callOnce({ key, model, system, prompt, schema, lean, temperature });

    if (!res.ok) {
      if (res.status === 429 && !last) {
        await sleep(retryDelay(res));
        continue;
      }
      if (res.status === 400 && !last && !lean) {
        lean = true;
        continue;
      }
      if (res.status === 429) {
        throw new FriendlyError("The AI is busy right now. Wait a moment and try again.", 429, "rate_limited");
      }
      if (res.status === 401 || res.status === 403) {
        throw new FriendlyError("The AI key was rejected. Check GEMINI_API_KEY.", 502, "bad_key");
      }
      if (res.status === 404) {
        throw new FriendlyError(`The AI model "${model}" wasn't found. Check GEMINI_MODEL.`, 502, "bad_model");
      }
      throw new FriendlyError("The AI service returned an error. Try again.", 502, "upstream_error");
    }

    try {
      return validate(parseModelJson(text));
    } catch (err) {
      if (!(err instanceof ShapeError)) throw err;
      if (last) {
        throw new FriendlyError("The AI sent back an answer we couldn't read, twice. Try again.", 502, "malformed");
      }
    }
  }
}
