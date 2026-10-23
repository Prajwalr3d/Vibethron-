// Shared chart chrome: card, legend swatches, tooltip, axis styling.

export const AXIS_TICK = { fill: "var(--ink-faint)", fontSize: 11, fontFamily: "var(--font-jetbrains), monospace" };
export const GRID_STROKE = "var(--rule)";
export const ANIMATION = { animationDuration: 900, animationEasing: "ease-out" };

export function ChartCard({ title, caption, legend, children, className = "" }) {
  return (
    <figure className={`sheet flex min-w-0 flex-col gap-3 p-4 sm:p-5 ${className}`}>
      <figcaption>
        <p className="text-[15px] font-medium">{title}</p>
        {caption && <p className="text-[12.5px] text-ink-soft">{caption}</p>}
      </figcaption>
      {legend}
      {children}
    </figure>
  );
}

export function Swatch({ color, shape = "square" }) {
  if (shape === "line") {
    return <span className="inline-block h-[2px] w-3.5 rounded-full" style={{ background: color }} aria-hidden="true" />;
  }
  return <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} aria-hidden="true" />;
}

export function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-soft">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <Swatch color={i.color} shape={i.shape} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/** Paper-styled tooltip; `render(payload)` returns the rows to show. */
export function PaperTooltip({ active, payload, label, render }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[5px] border border-rule-strong bg-paper px-3 py-2 text-[12.5px] shadow-[var(--shadow-sheet)]">
      {label !== undefined && <p className="mb-1 font-medium">{label}</p>}
      {render(payload)}
    </div>
  );
}

export const TooltipRow = ({ color, label, value }) => (
  <p className="flex items-center gap-2 text-ink-soft">
    {color && <Swatch color={color} />}
    <span>{label}</span>
    <span className="ml-auto pl-3 font-mono tabular-nums text-ink">{value}</span>
  </p>
);
