const KEYS = ["formality", "warmth", "urgency", "directness"];

// Four tone bars; the red tick marks the original draft's level.
export default function ToneMeters({ tone, original, index }) {
  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5">
      {KEYS.map((k) => (
        <div key={k}>
          <div className="flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
            <dt>{k}</dt>
            <dd className="tabular-nums text-ink-soft">{tone[k]}</dd>
          </div>
          <div className="relative mt-1 h-1.5 rounded-full bg-paper-2" aria-hidden="true">
            <div
              className="meter-fill h-full rounded-full bg-ink-soft"
              style={{ width: `${tone[k]}%`, "--i": index }}
            />
            {original && (
              <span
                className="absolute -top-1 h-3.5 w-[2px] rounded-full bg-redpen"
                style={{ left: `calc(${original[k]}% - 1px)` }}
                title={`Your draft: ${original[k]}`}
              />
            )}
          </div>
        </div>
      ))}
    </dl>
  );
}
