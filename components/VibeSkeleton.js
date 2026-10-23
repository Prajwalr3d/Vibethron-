const WIDTHS = [96, 88, 93, 72, 90, 54];

export default function VibeSkeleton({ vibe, index }) {
  return (
    <article className="sheet reveal flex flex-col p-5 sm:p-6" style={{ "--i": index }} aria-busy="true">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
        Vibe {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-1 font-display text-lg font-medium leading-tight">{vibe.name}</h3>
      <div className="mt-5 space-y-3.5" aria-hidden="true">
        {WIDTHS.map((w, i) => (
          <div key={i} className="skeleton-line" style={{ width: `${w}%`, "--d": i }} />
        ))}
      </div>
      <p className="mt-6 font-mono text-[11.5px] text-ink-faint">Marking up...</p>
    </article>
  );
}
