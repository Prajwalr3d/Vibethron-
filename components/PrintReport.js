"use client";

import { createPortal } from "react-dom";

// One-page report, invisible on screen and the only thing printed.
// Rendered at the body root so the print stylesheet can hide everything else.
export default function PrintReport({ data, offline }) {
  if (typeof document === "undefined") return null;
  const date = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return createPortal(
    <div className="print-report" aria-hidden="true">
      <header className="pr-header">
        <div>
          <h1>VibeShift report</h1>
          <p>We show you exactly what changed, and prove your facts survived.</p>
        </div>
        <p className="pr-meta">
          {date}
          <br />
          {data.brief}
          {offline && (
            <>
              <br />
              Offline demo mode (saved results)
            </>
          )}
        </p>
      </header>

      <section className="pr-original">
        <h2>Original draft</h2>
        <p className="pr-text">{data.original}</p>
        {data.originalTone && <p className="pr-proof">Tone (AI-assessed): {data.originalTone}</p>}
      </section>

      <div className="pr-grid">
        {data.vibes.map((v) => (
          <section key={v.name} className="pr-vibe">
            <h2>{v.name}</h2>
            <p className="pr-text">{v.text}</p>
            <p className={`pr-stamp ${v.factsPassed ? "ok" : "bad"}`}>Fact Guard: {v.facts}</p>
            <p className="pr-proof">Meaning Match: {v.meaning}</p>
            <p className="pr-proof">Intent: {v.intent}</p>
            <p className="pr-proof">Tone: {v.tone}</p>
          </section>
        ))}
      </div>

      <footer className="pr-footer">
        Fact Guard is plain code. Meaning Match is a local MiniLM embedding model run in the browser. Intent and tone are
        AI-assessed.
      </footer>
    </div>,
    document.body
  );
}
