import { meaningLabel } from "@/lib/meaning";

const DOT = { Strong: "bg-stamp", Fair: "bg-amber", Drifted: "bg-redpen" };

export default function MeaningBadge({ meaning, aiScore }) {
  if (meaning.state === "pending") {
    return (
      <span className="badge text-ink-faint" title="Comparing embeddings in your browser">
        <span className="rec-dot h-1.5 w-1.5 rounded-full bg-pencil" aria-hidden="true" />
        Meaning Match: measuring...
      </span>
    );
  }
  if (meaning.state === "local") {
    const label = meaningLabel(meaning.percent);
    return (
      <span className="badge" title="Cosine similarity of local MiniLM sentence embeddings, computed in your browser">
        <span className={`h-1.5 w-1.5 rounded-full ${DOT[label]}`} aria-hidden="true" />
        Meaning Match: {meaning.percent}% <span className="text-ink-faint">{label}</span>
      </span>
    );
  }
  if (aiScore === null || aiScore === undefined) {
    return <span className="badge text-ink-faint">Meaning Match: unavailable</span>;
  }
  return (
    <span
      className="badge"
      title={meaning.reason || "The local model can't judge this text, so this is the rewriting AI's own estimate"}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" aria-hidden="true" />
      Meaning Match: {aiScore}% <span className="text-ink-faint">AI-estimated</span>
    </span>
  );
}
