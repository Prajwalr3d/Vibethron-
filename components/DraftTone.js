import { TARGET_TONES } from "@/lib/options";
import ToneMeters from "./ToneMeters";

export default function DraftTone({ tone, text, targetTone, onDetect }) {
  const { status, data, forText } = tone;
  const loading = status === "loading";
  const stale = data && forText !== text.trim();
  const target = targetTone !== "auto" ? TARGET_TONES.find((t) => t.id === targetTone)?.label : null;

  if (!data) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-soft">How does your draft come across before you rewrite it?</p>
        <button type="button" onClick={onDetect} disabled={loading} className="btn-paper px-3 py-1.5 text-sm">
          {loading ? "Reading tone..." : "Detect tone"}
        </button>
      </div>
    );
  }

  const { original_tone: t, original_intent: intent } = data;
  return (
    <div className={`flex flex-col gap-4 ${loading ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">Your draft reads as</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-3xl font-medium tracking-tight">{t.label}</span>
            <span className="font-mono text-[12px] text-ink-soft">{t.confidence}% confident (AI-assessed)</span>
          </p>
          {target && (
            <p className="mt-1.5 text-[14px]">
              Your draft: <span className="font-medium">{t.label}</span>{" "}
              <span className="text-redpen" aria-hidden="true">
                &rarr;
              </span>
              <span className="sr-only">to</span> Target: <span className="font-medium">{target}</span>
            </p>
          )}
        </div>
        <button type="button" onClick={onDetect} disabled={loading} className="btn-paper px-3 py-1.5 text-sm">
          {loading ? "Reading tone..." : stale ? "Detect again" : "Re-check"}
        </button>
      </div>
      {stale && <p className="text-[12.5px] text-amber">Your draft has changed since this reading.</p>}
      {intent && <p className="text-[15px] text-ink-soft">&ldquo;{intent}&rdquo;</p>}
      <ToneMeters tone={t} index={0} />
    </div>
  );
}
