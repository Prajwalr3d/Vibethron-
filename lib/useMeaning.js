"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Owns the embedding worker. The English model preloads on mount; the
 * multilingual one loads the first time a Hindi rewrite needs it.
 */
export function useMeaning() {
  const [models, setModels] = useState({ en: { status: "loading", progress: 0 } });
  const workerRef = useRef(null);
  const pending = useRef(new Map());
  const nextId = useRef(1);

  useEffect(() => {
    let worker;
    try {
      worker = new Worker(new URL("./meaning.worker.js", import.meta.url), { type: "module" });
    } catch {
      queueMicrotask(() => setModels({ en: { status: "error" } }));
      return;
    }
    workerRef.current = worker;
    const requests = pending.current;

    worker.addEventListener("message", ({ data }) => {
      if (data.type === "status") {
        setModels((m) => ({ ...m, [data.model]: { status: data.status, progress: data.progress ?? 0 } }));
      } else if (data.type === "scores") {
        const req = requests.get(data.id);
        requests.delete(data.id);
        if (data.error) req?.reject(new Error(data.error));
        else req?.resolve(data.results);
      }
    });
    worker.addEventListener("error", () => {
      setModels((m) => Object.fromEntries(Object.keys(m).map((k) => [k, { status: "error" }])));
      requests.forEach((r) => r.reject(new Error("Meaning model crashed")));
      requests.clear();
    });
    worker.postMessage({ type: "load", model: "en" });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  /** Resolves to { [key]: { percent, sentences } } for each rewrite. */
  const measure = useCallback((model, original, rewrites) => {
    const worker = workerRef.current;
    if (!worker) return Promise.reject(new Error("Meaning model unavailable"));
    if (model === "multi") {
      setModels((m) => (m.multi ? m : { ...m, multi: { status: "loading", progress: 0 } }));
    }
    const id = nextId.current++;
    return new Promise((resolve, reject) => {
      pending.current.set(id, { resolve, reject });
      worker.postMessage({ type: "score", id, model, original, rewrites });
    });
  }, []);

  return { models, measure };
}
