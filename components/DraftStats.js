import { MAX_CHARS, draftStats } from "@/lib/textStats";

export default function DraftStats({ text }) {
  const { words, chars, reading } = draftStats(text);
  const near = chars >= MAX_CHARS * 0.9;
  const full = chars >= MAX_CHARS;

  return (
    <p className="font-mono text-[12px] tabular-nums text-ink-soft" aria-live="polite">
      <span>{words} {words === 1 ? "word" : "words"}</span>
      <span className="mx-2 text-ink-faint">/</span>
      <span className={full ? "text-redpen" : near ? "text-amber" : undefined}>
        {chars.toLocaleString("en-IN")} of {MAX_CHARS.toLocaleString("en-IN")} chars
        {full && " (limit)"}
      </span>
      <span className="mx-2 text-ink-faint">/</span>
      <span>~{reading} read</span>
    </p>
  );
}
