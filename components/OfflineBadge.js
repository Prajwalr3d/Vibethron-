// Shown whenever saved demo results are standing in for the AI.
export default function OfflineBadge() {
  return (
    <span
      className="badge border-amber/50 bg-amber-soft text-amber"
      role="status"
      title="The AI is unavailable, so VibeShift is showing saved results for this sample. Fact Guard and Meaning Match still run live on them."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
      Offline demo mode
    </span>
  );
}
