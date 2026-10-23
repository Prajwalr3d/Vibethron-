import { connection } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3";
const MAX_BYTES = 25 * 1024 * 1024; // Groq free-tier upload limit
const LANGUAGE_HINTS = new Set(["en", "hi"]); // "auto" sends no hint

function fail(status, error, code) {
  return Response.json({ error, code }, { status });
}

// Tells the client whether server transcription is configured (never the key itself).
export async function GET() {
  await connection();
  return Response.json({ available: Boolean(process.env.GROQ_API_KEY) });
}

export async function POST(request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return fail(503, "Server transcription isn't set up on this deployment.", "no_key");
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "The recording didn't arrive in a readable form.", "bad_request");
  }

  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return fail(400, "The recording was empty.", "empty");
  }
  if (file.size > MAX_BYTES) {
    return fail(413, "That recording is too large to transcribe.", "too_large");
  }

  const body = new FormData();
  body.append("file", file, file.name || "voice.webm");
  body.append("model", MODEL);
  body.append("response_format", "json");
  body.append("temperature", "0");
  const language = form.get("language");
  if (LANGUAGE_HINTS.has(language)) body.append("language", language);

  let res;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body,
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const timedOut = err?.name === "TimeoutError";
    return fail(
      504,
      timedOut ? "Transcription took too long." : "Couldn't reach the transcription service.",
      "upstream_unreachable"
    );
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      return fail(502, "The transcription key was rejected.", "bad_key");
    }
    if (res.status === 429) {
      return fail(429, "Transcription is busy right now.", "rate_limited");
    }
    return fail(502, "The transcription service returned an error.", "upstream_error");
  }

  const data = await res.json().catch(() => null);
  const text = typeof data?.text === "string" ? data.text.trim() : "";
  return Response.json({ text });
}
