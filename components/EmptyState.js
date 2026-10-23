const STEPS = [
  ["01", "Draft it", "Type, dictate, paste a screenshot, or pick a scenario."],
  ["02", "Brief it", "Choose the language, style, tone and, if you like, fine-tune formality."],
  ["03", "Verify it", "Every rewrite is checked by IntentLock, Fact Guard and Meaning Match."],
];

export default function EmptyState() {
  return (
    <div className="rounded-[2px] border border-dashed border-rule-strong px-4 py-10 sm:px-8 sm:py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">No transformation yet</p>
      <h3 className="mt-2 max-w-2xl font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Four personas. One intent. Zero lost facts.
      </h3>
      <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">
        Your rewrites land here: executive, supportive, legal and Gen-Z, each with its changes marked and its
        commitments, deadlines, facts, conditions and negations checked against your original.
      </p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {STEPS.map(([n, title, body], i) => (
          <li key={n} className="reveal sheet p-4" style={{ "--i": i + 1 }}>
            <span className="font-mono text-[11px] text-stamp">{n}</span>
            <span className="mt-1 block font-display text-lg font-bold uppercase">{title}</span>
            <span className="mt-1 block text-[13px] text-ink-soft">{body}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
