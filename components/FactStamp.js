import { describeFact } from "@/lib/factguard";

// Rubber-stamp verdict from Fact Guard (plain code, no AI).
export default function FactStamp({ check, index }) {
  const { found, missing, unchecked, passed } = check;
  if (!check.facts.length) {
    return <span className="stamp text-ink-faint" title="No numbers, dates or names to check">No facts to check</span>;
  }
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span
        className={`stamp ${passed ? "stamp-ok stamp-animate" : "stamp-bad"} self-start`}
        style={{ "--i": index }}
        title="Fact Guard: plain code checks every number, date, amount and name"
      >
        {passed ? `Verified: all ${found} facts preserved` : `Missing: ${missing.length}`}
      </span>
      {!passed && (
        <p className="text-[12.5px] text-redpen">
          {missing.map(describeFact).join(", ")}
        </p>
      )}
      {unchecked.length > 0 && (
        <p className="text-[12px] text-ink-faint">
          Not checked, may be written in Devanagari: {unchecked.map((f) => f.raw).join(", ")}
        </p>
      )}
    </div>
  );
}
