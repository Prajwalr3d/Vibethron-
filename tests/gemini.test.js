import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { generateJson } from "@/lib/gemini";

const ok = (json, extraParts = []) => ({
  status: 200,
  body: { candidates: [{ finishReason: "STOP", content: { parts: [...extraParts, { text: JSON.stringify(json) }] } }] },
});

/** Replaces fetch with queued responses; returns the list of calls made. */
function stub(responses) {
  const calls = [];
  vi.stubGlobal("fetch", async (url, init) => {
    calls.push({ model: url.match(/models\/([^:]+):/)[1], body: JSON.parse(init.body) });
    const r = responses.shift();
    if (r === "timeout") throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
    return new Response(JSON.stringify(r.body ?? {}), { status: r.status ?? 200, headers: { "retry-after": "0" } });
  });
  return calls;
}

const run = () =>
  generateJson({
    system: "s",
    prompt: "p",
    schema: { type: "object" },
    validate: (d) => {
      if (d.ok !== true) throw new (class ShapeError extends Error {})();
      return d;
    },
  });

describe("generateJson", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("GEMINI_MODEL", "");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test("uses the default model with JSON mode and low thinking, ignoring thought parts", async () => {
    const calls = stub([ok({ ok: true }, [{ text: "thinking...", thought: true }])]);
    expect(await run()).toEqual({ ok: true });
    expect(calls[0].model).toBe("gemini-3.6-flash");
    expect(calls[0].body.generationConfig).toMatchObject({
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: "low" },
    });
  });

  test("an overloaded model (503) falls back to the next one", async () => {
    const calls = stub([{ status: 503 }, ok({ ok: true })]);
    expect(await run()).toEqual({ ok: true });
    expect(calls.map((c) => c.model)).toEqual(["gemini-3.6-flash", "gemini-3.5-flash"]);
  });

  test("a rate-limited model (429) falls back too, since quotas are per model", async () => {
    const calls = stub([{ status: 429 }, { status: 503 }, ok({ ok: true })]);
    expect(await run()).toEqual({ ok: true });
    expect(calls.map((c) => c.model)).toEqual(["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"]);
  });

  test("when every model is rate-limited, the error says how long to wait", async () => {
    const quota = {
      status: 429,
      body: { error: { code: 429, details: [{ "@type": "type.googleapis.com/google.rpc.RetryInfo", retryDelay: "41s" }] } },
    };
    stub([quota, quota, quota]);
    await expect(run()).rejects.toMatchObject({ code: "rate_limited", message: expect.stringContaining("41 seconds") });
  });

  test("a timeout falls back too, and a configured model is tried first", async () => {
    vi.stubEnv("GEMINI_MODEL", "gemini-3.8-flash");
    const calls = stub(["timeout", ok({ ok: true })]);
    await run();
    expect(calls.map((c) => c.model)).toEqual(["gemini-3.8-flash", "gemini-3.6-flash"]);
  });

  test("every model overloaded gives a clear error", async () => {
    stub([{ status: 503 }, { status: 503 }, { status: 503 }]);
    await expect(run()).rejects.toMatchObject({ code: "overloaded", status: 503 });
  });

  test("a short 429 wait on the last model is retried once", async () => {
    const quick = { status: 429, body: { error: { details: [{ "@type": "google.rpc.RetryInfo", retryDelay: "0s" }] } } };
    const calls = stub([quick, quick, quick, ok({ ok: true })]);
    await run();
    expect(calls.map((c) => c.model)).toEqual([
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite",
    ]);
  });

  test("400 retries once without schema and thinking options", async () => {
    const calls = stub([{ status: 400 }, ok({ ok: true })]);
    await run();
    expect(calls[1].body.generationConfig.responseSchema).toBeUndefined();
    expect(calls[1].body.generationConfig.thinkingConfig).toBeUndefined();
  });

  test("malformed JSON is retried once, then reported", async () => {
    stub([{ body: { candidates: [{ content: { parts: [{ text: "{nope" }] } }] } }, ok({ ok: true })]);
    await expect(run()).resolves.toEqual({ ok: true });
    stub([{ body: { candidates: [{ content: { parts: [{ text: "nope" }] } }] } }, { body: { candidates: [{ content: { parts: [{ text: "nope" }] } }] } }]);
    await expect(run()).rejects.toMatchObject({ code: "malformed" });
  });

  test("a rejected key and a blocked prompt fail fast", async () => {
    let calls = stub([{ status: 401 }]);
    await expect(run()).rejects.toMatchObject({ code: "bad_key" });
    expect(calls).toHaveLength(1);
    calls = stub([{ body: { promptFeedback: { blockReason: "SAFETY" } } }]);
    await expect(run()).rejects.toMatchObject({ code: "blocked" });
    expect(calls).toHaveLength(1);
  });
});
