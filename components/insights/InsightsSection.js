"use client";

import { useState } from "react";
import { buildInsights } from "@/lib/insights";
import SummaryTiles from "./SummaryTiles";
import ToneRadars from "./ToneRadars";
import WordCountChart from "./WordCountChart";
import MeaningChart from "./MeaningChart";
import ChangeDonuts from "./ChangeDonuts";

const TONE_KEYS = ["formality", "warmth", "urgency", "directness"];

// Every chart value, readable without colour or hover.
function InsightsTable({ rows, originalTone }) {
  return (
    <div className="sheet overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="border-b border-rule-strong font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">
          <tr>
            {["Vibe", "Words", "Changed", "Meaning", "Intent", "Facts", ...TONE_KEYS].map((h) => (
              <th key={h} className="px-3 py-2.5 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rule tabular-nums">
          {originalTone && (
            <tr className="text-ink-soft">
              <td className="px-3 py-2">Your draft</td>
              <td className="px-3 py-2">{rows[0]?.wordsBefore}</td>
              <td className="px-3 py-2" colSpan={4} />
              {TONE_KEYS.map((k) => <td key={k} className="px-3 py-2">{originalTone[k]}</td>)}
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{r.wordsAfter}</td>
              <td className="px-3 py-2">{r.percentChanged}%</td>
              <td className="px-3 py-2">
                {r.meaning ? `${r.meaning.percent}%${r.meaning.source === "ai" ? " (AI-est.)" : ""}` : "measuring"}
              </td>
              <td className="px-3 py-2">{r.intentPreserved === false ? "Changed" : r.intentPreserved ? "Preserved" : "Unclear"}</td>
              <td className="px-3 py-2">{r.factsFound}/{r.factsChecked}</td>
              {TONE_KEYS.map((k) => <td key={k} className="px-3 py-2">{r.tone[k]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InsightsSection({ result, source, meaningFor }) {
  const [asTable, setAsTable] = useState(false);
  const { rows, summary } = buildInsights({ vibes: result.vibes, original: source.text, meaningFor });

  return (
    <section className="mt-14" aria-labelledby="insights-heading">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-rule-strong pb-3">
        <h2 id="insights-heading" className="font-display text-2xl font-bold uppercase tracking-tight">
          Insights
        </h2>
        <button
          type="button"
          onClick={() => setAsTable((t) => !t)}
          aria-pressed={asTable}
          className="btn-paper px-3 py-1.5 text-[13px]"
        >
          {asTable ? "Show charts" : "Show as table"}
        </button>
      </div>
      <SummaryTiles summary={summary} count={rows.length} />
      <div className="mt-5">
        {asTable ? (
          <InsightsTable rows={rows} originalTone={result.original_tone} />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <ToneRadars rows={rows} originalTone={result.original_tone} />
            <MeaningChart rows={rows} />
            <WordCountChart rows={rows} />
            <div className="lg:col-span-2">
              <ChangeDonuts rows={rows} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
