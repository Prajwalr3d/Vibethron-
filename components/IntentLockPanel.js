"use client";

import { useState } from "react";

const LEVEL = {
  critical: { label: "Critical", cls: "border-redpen/50 text-redpen bg-redpen-soft" },
  moderate: { label: "Moderate", cls: "border-amber/50 text-amber bg-amber-soft" },
};

/** IntentLock results for one rewrite: a summary chip that expands into risk cards. */
export default function IntentLockPanel({ lock }) {
  const [open, setOpen] = useState(false);
  const count = lock.critical + lock.moderate;

  if (!count) {
    return (
      <p className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-stamp">
        <span className="h-1.5 w-1.5 rounded-full bg-stamp" aria-hidden="true" />
        IntentLock: 0 risks detected
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink hover:text-accent"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${lock.critical ? "bg-redpen" : "bg-amber"}`} aria-hidden="true" />
        IntentLock: {lock.critical ? `${lock.critical} critical` : ""}
        {lock.critical && lock.moderate ? ", " : ""}
        {lock.moderate ? `${lock.moderate} moderate` : ""}
        <span className="text-ink-faint">{open ? "hide" : "review"}</span>
      </button>
      {open && (
        <ul className="mt-3 space-y-2">
          {lock.risks.map((r) => (
            <li key={r.id} className="rounded-[2px] border border-rule-strong bg-desk p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`badge ${LEVEL[r.riskLevel].cls}`}>{LEVEL[r.riskLevel].label}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">{r.categoryLabel}</span>
              </div>
              <p className="mt-2 font-mono text-[12.5px]">
                <span className="text-ink-faint">&ldquo;{r.originalSnippet}&rdquo;</span>
                <span className="mx-2 text-accent" aria-hidden="true">&rarr;</span>
                <span className="sr-only">became</span>
                <span className={r.rewrittenSnippet.startsWith("[") ? "text-redpen" : "text-ink"}>
                  {r.rewrittenSnippet.startsWith("[") ? r.rewrittenSnippet : `“${r.rewrittenSnippet}”`}
                </span>
              </p>
              <p className="mt-1 text-[13px] text-ink-soft">{r.explanation}</p>
              <p className="mt-1 text-[12.5px] text-stamp">{r.safeguardRecommendation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
