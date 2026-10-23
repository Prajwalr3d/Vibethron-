export default function Hero() {
  return (
    <section className="reveal grid gap-6 pb-8 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Instant persona &amp; communication transformer
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-[2.35rem] font-medium leading-[1.06] tracking-[-0.025em] sm:text-6xl">
          One draft, four audiences.{" "}
          <span className="pen-strike hero-strike">Lose</span>{" "}
          <span className="marker hero-marker">Keep</span> every fact.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] text-ink-soft sm:text-base">
          We show you exactly what changed, and prove your facts survived. We don&apos;t ask the AI
          to grade itself: Fact Guard is plain code, Meaning Match is a local embedding model, and
          both run in your browser.
        </p>
      </div>
      <aside className="hidden rotate-[-2deg] lg:block" aria-hidden="true">
        <p className="hand text-[26px]">
          numbers, dates, names &amp; amounts stay exactly as you wrote them
        </p>
        <svg width="70" height="40" viewBox="0 0 70 40" className="ml-8 mt-1 text-redpen">
          <path d="M60 4C44 10 26 18 12 33" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 22l1 12 12-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </aside>
    </section>
  );
}
