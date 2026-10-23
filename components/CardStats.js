const Sep = () => <span className="text-ink-faint" aria-hidden="true">/</span>;

function lengthLabel(pct) {
  if (pct === 0) return "same length";
  return `${Math.abs(pct)}% ${pct < 0 ? "shorter" : "longer"}`;
}

const grade = (g) => (g === null ? "n/a" : g.toFixed(1));

export default function CardStats({ stats }) {
  const { percentChanged, wordsBefore, wordsAfter, lengthChange, gradeBefore, gradeAfter } = stats;
  return (
    <dl className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11.5px] tabular-nums text-ink-soft">
      <div title="Words added or removed, out of all words in the original and the rewrite">
        <dt className="sr-only">Words changed</dt>
        <dd>{percentChanged}% words changed</dd>
      </div>
      <Sep />
      <div>
        <dt className="sr-only">Word count</dt>
        <dd>
          {wordsBefore} &rarr; {wordsAfter} words ({lengthLabel(lengthChange)})
        </dd>
      </div>
      <Sep />
      <div title="Flesch-Kincaid grade level, original to rewrite (Latin-script text only)">
        <dt className="sr-only">Reading grade</dt>
        <dd>
          Grade {grade(gradeBefore)} &rarr; {grade(gradeAfter)}
        </dd>
      </div>
    </dl>
  );
}
