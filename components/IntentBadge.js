"use client";

import { useState } from "react";

const STYLES = {
  true: { label: "Intent preserved", cls: "border-stamp/50 text-stamp" },
  false: { label: "Intent changed", cls: "border-redpen/50 text-redpen bg-redpen-soft" },
  null: { label: "Intent unclear", cls: "text-ink-faint" },
};

// Note shows on hover (desktop) or tap (touch).
export default function IntentBadge({ preserved, note }) {
  const [open, setOpen] = useState(false);
  const s = STYLES[String(preserved)] || STYLES.null;
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        className={`badge ${s.cls} cursor-help`}
      >
        {s.label}
        <span className="sr-only">. {note}</span>
      </button>
      {note && (
        <span
          role="tooltip"
          className={`absolute left-0 top-full z-20 mt-1.5 w-64 max-w-[75vw] rounded-[5px] border border-rule-strong bg-paper px-3 py-2 text-[12.5px] leading-snug text-ink-soft shadow-[var(--shadow-sheet)] ${open ? "block" : "hidden group-hover:block"}`}
        >
          {note} <span className="text-ink-faint">(AI-assessed)</span>
        </span>
      )}
    </span>
  );
}
