"use client";

import { useState } from "react";
import { MAX_AUDIENCE } from "@/lib/vibes";

export default function AudienceForm({ busy, onAdd }) {
  const [audience, setAudience] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!audience.trim() || busy) return;
    if (await onAdd(audience.trim())) setAudience("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-[6px] border border-dashed border-rule-strong p-4 sm:flex-row sm:items-center sm:p-5">
      <label htmlFor="audience" className="shrink-0 font-display text-[17px] italic">
        Write for someone else
      </label>
      <input
        id="audience"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        maxLength={MAX_AUDIENCE}
        placeholder="e.g. my strict professor"
        disabled={busy}
        className="min-w-0 flex-1 rounded-[5px] border border-rule-strong bg-paper px-3 py-2 text-[15px] outline-none placeholder:text-ink-faint focus:border-pencil"
      />
      <button type="submit" disabled={busy || !audience.trim()} className="btn-ink px-4 py-2 text-sm font-medium">
        {busy ? "Writing..." : "Add audience"}
      </button>
    </form>
  );
}
