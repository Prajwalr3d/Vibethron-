function Tile({ label, value, detail, color, index }) {
  return (
    <div className="sheet reveal flex min-w-0 flex-col gap-1 p-4" style={{ "--i": index }}>
      <p className="text-[12.5px] text-ink-soft">{label}</p>
      <p className="text-[28px] font-semibold leading-tight tracking-tight">{value}</p>
      <p className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-ink-soft">
        {color && <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: color }} aria-hidden="true" />}
        <span className="truncate">{detail}</span>
      </p>
    </div>
  );
}

export default function SummaryTiles({ summary, count }) {
  const { bestMeaning, mostChanged, shortest, factsFound, factsChecked } = summary;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Tile
        index={0}
        label="Best meaning match"
        value={bestMeaning ? `${bestMeaning.meaning.percent}%` : "..."}
        detail={bestMeaning ? `${bestMeaning.name}${bestMeaning.meaning.source === "ai" ? " (AI-est.)" : ""}` : "Measuring"}
        color={bestMeaning?.color}
      />
      <Tile index={1} label="Most changed" value={`${mostChanged.percentChanged}%`} detail={mostChanged.name} color={mostChanged.color} />
      <Tile index={2} label="Shortest" value={`${shortest.wordsAfter} words`} detail={shortest.name} color={shortest.color} />
      <Tile index={3} label="Facts preserved" value={`${factsFound}/${factsChecked}`} detail={`Across ${count} rewrites, by Fact Guard`} />
    </div>
  );
}
