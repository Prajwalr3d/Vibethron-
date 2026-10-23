import { SENTENCE_WEAK } from "@/lib/meaning";

// Each original sentence's best match in the rewrite; weak matches marked amber.
export default function DriftView({ sentences }) {
  const weak = sentences.filter((s) => s.score < SENTENCE_WEAK);
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-[13px] text-ink-soft hover:text-ink">
        <span className="mr-1.5 inline-block transition-transform group-open:rotate-90" aria-hidden="true">&rsaquo;</span>
        Meaning drift:{" "}
        {weak.length
          ? `${weak.length} of ${sentences.length} sentences possibly dropped or changed`
          : `all ${sentences.length} sentences have a close match`}
      </summary>
      <div className="mt-3 space-y-3 text-[13.5px] leading-6">
        <p className="text-ink-soft">
          {sentences.map((s, i) => (
            <span key={i}>
              <span className={s.score < SENTENCE_WEAK ? "drift-weak" : undefined} title={`Best match ${Math.round(s.score * 100)}%`}>
                {s.text}
              </span>{" "}
            </span>
          ))}
        </p>
        {weak.length > 0 && (
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber">Possibly dropped or changed</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-soft">
              {weak.map((s, i) => (
                <li key={i}>
                  {s.text} <span className="font-mono text-[11px] text-ink-faint">{Math.round(s.score * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
