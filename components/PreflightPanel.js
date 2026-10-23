import DraftTone from "./DraftTone";
import GrammarPanel from "./GrammarPanel";

// "Before you send": the draft's own tone and a grammar pass.
export default function PreflightPanel({ text, tone, targetTone, onDetectTone, grammar }) {
  return (
    <section className="sheet flex flex-col" aria-label="Before you send">
      <div className="border-b border-rule px-4 py-3 sm:px-5">
        <h2 className="font-display text-lg font-medium italic leading-none">Before you send</h2>
      </div>
      <div className="px-4 py-4 sm:px-5">
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Your draft&apos;s tone</h3>
        <DraftTone tone={tone} text={text} targetTone={targetTone} onDetect={onDetectTone} />
      </div>
      <div className="border-t border-dashed border-rule-strong px-4 py-4 sm:px-5">
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Grammar</h3>
        <GrammarPanel grammar={grammar} text={text} />
      </div>
    </section>
  );
}
