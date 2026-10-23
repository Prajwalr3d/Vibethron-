// Browser-side calls to the API routes. Throws Errors with user-facing messages.

async function post(payload, url = "/api/transform") {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) throw new Error(data?.error || "That request failed. Try again.");
  return data;
}

export const checkGrammar = (text, strictness) => post({ text, strictness }, "/api/grammar");

export const detectTone = (text) => post({ text }, "/api/tone");

export const transformDraft = (text, settings) => post({ text, ...settings });

export async function regenerateVibe(text, settings, vibeId, previous, audience) {
  const { vibe } = await post({ text, ...settings, vibe: vibeId, previous, audience });
  return audience ? { ...vibe, audience } : vibe;
}
