// One-line status for the in-browser embedding models.
export default function MeaningStatus({ models }) {
  const loading = Object.entries(models).find(([, m]) => m.status === "loading");
  if (loading) {
    const [name, m] = loading;
    return (
      <p className="flex items-center gap-2 font-mono text-[11.5px] text-ink-soft" role="status">
        <span className="rec-dot h-1.5 w-1.5 rounded-full bg-pencil" aria-hidden="true" />
        Loading {name === "multi" ? "Hindi meaning model" : "meaning model"}... {Math.round((m.progress || 0) * 100)}%
      </p>
    );
  }
  if (models.en?.status === "error") {
    return (
      <p className="font-mono text-[11.5px] text-amber" role="status">
        Meaning model unavailable. Scores will be AI-estimated.
      </p>
    );
  }
  return (
    <p className="flex items-center gap-2 font-mono text-[11.5px] text-ink-faint" role="status">
      <span className="h-1.5 w-1.5 rounded-full bg-stamp" aria-hidden="true" />
      Meaning model ready, running in your browser
    </p>
  );
}
