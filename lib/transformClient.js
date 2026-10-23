// Browser-side calls to /api/transform. Throws Errors with user-facing messages.

async function post(payload) {
  let res;
  try {
    res = await fetch("/api/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) throw new Error(data?.error || "Rewriting failed. Try again.");
  return data;
}

export const transformDraft = (text, settings) => post({ text, ...settings });

export async function regenerateVibe(text, settings, vibeId, previous) {
  const { vibe } = await post({ text, ...settings, vibe: vibeId, previous });
  return vibe;
}
