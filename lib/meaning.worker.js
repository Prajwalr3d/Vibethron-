// Web Worker: local sentence embeddings with Transformers.js. Nothing leaves the browser
// except the one-time model download from the Hugging Face hub.
import { env, pipeline } from "@huggingface/transformers";
import { MODELS, cosine, splitSentences, toPercent } from "./meaning";

env.allowLocalModels = false;

const pipes = {};
const cache = new Map(); // `${model}|${text}` -> vector

function load(model) {
  if (!pipes[model]) {
    self.postMessage({ type: "status", model, status: "loading", progress: 0 });
    pipes[model] = pipeline("feature-extraction", MODELS[model], {
      dtype: "q8",
      // v4 reports combined download progress across all model files (0-100).
      progress_callback: (p) => {
        if (p.status === "progress_total") {
          self.postMessage({ type: "status", model, status: "loading", progress: p.progress / 100 });
        }
      },
    })
      .then((pipe) => {
        self.postMessage({ type: "status", model, status: "ready", progress: 1 });
        return pipe;
      })
      .catch((err) => {
        delete pipes[model];
        self.postMessage({ type: "status", model, status: "error", message: String(err?.message || err) });
        throw err;
      });
  }
  return pipes[model];
}

async function embed(model, texts) {
  const todo = [...new Set(texts.filter((t) => !cache.has(`${model}|${t}`)))];
  if (todo.length) {
    const pipe = await load(model);
    const vectors = (await pipe(todo, { pooling: "mean", normalize: true })).tolist();
    todo.forEach((t, i) => cache.set(`${model}|${t}`, vectors[i]));
    if (cache.size > 2000) cache.clear();
  }
  return texts.map((t) => cache.get(`${model}|${t}`));
}

async function score({ model, original, rewrites }) {
  const sentences = splitSentences(original);
  const [whole, ...sentenceVecs] = await embed(model, [original, ...sentences]);
  const results = {};
  for (const { key, text } of rewrites) {
    const [rewriteVec] = await embed(model, [text]);
    const parts = splitSentences(text);
    const partVecs = await embed(model, parts.length ? parts : [text]);
    results[key] = {
      percent: toPercent(cosine(whole, rewriteVec)),
      sentences: sentences.map((s, i) => ({
        text: s,
        score: Math.max(...partVecs.map((v) => cosine(sentenceVecs[i], v))),
      })),
    };
  }
  return results;
}

self.addEventListener("message", async ({ data }) => {
  if (data.type === "load") {
    load(data.model).catch(() => {});
    return;
  }
  if (data.type === "score") {
    try {
      self.postMessage({ type: "scores", id: data.id, results: await score(data) });
    } catch (err) {
      self.postMessage({ type: "scores", id: data.id, error: String(err?.message || err) });
    }
  }
});
