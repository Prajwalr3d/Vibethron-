import { SAMPLES } from "@/lib/samples";

export default function SampleDrafts({ onPick }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Try a sample</span>
      {SAMPLES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onPick(s.text)}
          className="rounded-[4px] border border-dashed border-rule-strong px-2.5 py-1 text-[13px] text-ink-soft transition-colors hover:border-solid hover:border-ink-faint hover:bg-paper-2 hover:text-ink"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
