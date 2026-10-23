"use client";

import { Bar, BarChart, LabelList, Rectangle, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { THRESHOLDS, meaningLabel } from "@/lib/meaning";
import { useWidth } from "@/lib/useWidth";
import { ANIMATION, AXIS_TICK, ChartCard, PaperTooltip, TooltipRow } from "./chrome";

// Red "x" marker with its label: intent changed is never shown by colour alone.
function IntentMarker({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={6} fill="var(--redpen)" />
      <path d="M-2.5 -2.5 L2.5 2.5 M2.5 -2.5 L-2.5 2.5" stroke="var(--paper)" strokeWidth={1.6} strokeLinecap="round" />
      <text x={10} dominantBaseline="central" fill="var(--ink-soft)" fontSize={11}>
        intent changed
      </text>
    </g>
  );
}

// Value at the bar tip; on wide layouts the intent marker follows it.
function TipLabel({ x, y, width, height, index, data, narrow }) {
  const row = data[index];
  const end = x + width + 6;
  const mid = y + height / 2;
  const value = row.meaning ? `${row.meaning.percent}%${row.meaning.source === "ai" ? " AI-est." : ""}` : "measuring...";
  return (
    <g fontSize={11} fontFamily="var(--font-jetbrains), monospace">
      <text x={end} y={mid} dominantBaseline="central" fill="var(--ink-soft)">
        {value}
      </text>
      {!narrow && row.intentPreserved === false && <IntentMarker x={end + value.length * 6.8 + 10} y={mid} />}
    </g>
  );
}

// Compact layout: the vibe name (and intent marker) sits above its bar.
function NameLabel({ x, y, index, data }) {
  const row = data[index];
  return (
    <g fontSize={12}>
      <text x={x} y={y - 8} fill="var(--ink-soft)">
        {row.name}
      </text>
      {row.intentPreserved === false && <IntentMarker x={x + row.name.length * 6.6 + 12} y={y - 12} />}
    </g>
  );
}

export default function MeaningChart({ rows }) {
  const [ref, width] = useWidth();
  const narrow = width > 0 && width < 520;
  const data = rows.map((r) => ({ ...r, value: r.meaning?.percent ?? 0 }));
  return (
    <ChartCard
      title="Meaning Match"
      caption={`Similarity to your draft. Lines mark Fair (${THRESHOLDS.fair}) and Strong (${THRESHOLDS.strong}). Faded bars are the AI's own estimate.`}
    >
      <div ref={ref}>
      <BarChart
        responsive
        layout="vertical"
        data={data}
        margin={{ top: 18, right: narrow ? 64 : 132, bottom: 0, left: 0 }}
        style={{ width: "100%", height: (narrow ? 60 : 46) * data.length + 50 }}
      >
        <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          hide={narrow}
          width={124}
          tick={{ fill: "var(--ink-soft)", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "var(--rule-strong)" }}
        />
        {[
          [THRESHOLDS.fair, "Fair", -14],
          [THRESHOLDS.strong, "Strong", 18],
        ].map(([x, label, dx]) => (
          <ReferenceLine
            key={label}
            x={x}
            stroke="var(--rule-strong)"
            label={{ value: label, position: "top", fill: "var(--ink-faint)", fontSize: 10.5, dx }}
          />
        ))}
        <Tooltip
          cursor={{ fill: "var(--rule)" }}
          content={(p) => (
            <PaperTooltip
              {...p}
              render={([v]) => {
                const r = v.payload;
                return (
                  <>
                    <TooltipRow
                      color={r.color}
                      label={r.meaning?.source === "ai" ? "AI-estimated" : "Local model"}
                      value={r.meaning ? `${r.meaning.percent}% ${meaningLabel(r.meaning.percent)}` : "measuring"}
                    />
                    <TooltipRow label="Intent" value={r.intentPreserved === false ? "changed" : r.intentPreserved ? "preserved" : "unclear"} />
                  </>
                );
              }}
            />
          )}
        />
        <Bar
          dataKey="value"
          barSize={14}
          shape={(props) => (
            <Rectangle
              {...props}
              fill={props.payload.color}
              fillOpacity={props.payload.meaning?.source === "ai" ? 0.45 : 1}
              radius={[0, 4, 4, 0]}
            />
          )}
          {...ANIMATION}
        >
          <LabelList dataKey="value" content={(p) => <TipLabel {...p} data={data} narrow={narrow} />} />
          {narrow && <LabelList dataKey="name" content={(p) => <NameLabel {...p} data={data} />} />}
        </Bar>
      </BarChart>
      </div>
    </ChartCard>
  );
}
