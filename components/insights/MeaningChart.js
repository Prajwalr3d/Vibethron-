"use client";

import { Bar, BarChart, LabelList, Rectangle, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { THRESHOLDS, meaningLabel } from "@/lib/meaning";
import { ANIMATION, AXIS_TICK, ChartCard, PaperTooltip, TooltipRow } from "./chrome";

// Value at the bar tip, plus a red "x" marker and label when the intent changed.
function TipLabel({ x, y, width, height, index, data }) {
  const row = data[index];
  const end = x + width + 6;
  const mid = y + height / 2;
  const value = row.meaning ? `${row.meaning.percent}%${row.meaning.source === "ai" ? " AI-est." : ""}` : "measuring...";
  return (
    <g fontSize={11} fontFamily="var(--font-jetbrains), monospace">
      <text x={end} y={mid} dominantBaseline="central" fill="var(--ink-soft)">
        {value}
      </text>
      {row.intentPreserved === false && (
        <g transform={`translate(${end + value.length * 6.8 + 10}, ${mid})`}>
          <circle r={6} fill="var(--redpen)" />
          <path d="M-2.5 -2.5 L2.5 2.5 M2.5 -2.5 L-2.5 2.5" stroke="var(--paper)" strokeWidth={1.6} strokeLinecap="round" />
          <text x={10} dominantBaseline="central" fill="var(--ink-soft)">
            intent changed
          </text>
        </g>
      )}
    </g>
  );
}

export default function MeaningChart({ rows }) {
  const data = rows.map((r) => ({ ...r, value: r.meaning?.percent ?? 0 }));
  return (
    <ChartCard
      title="Meaning Match"
      caption={`Similarity to your draft. Lines mark Fair (${THRESHOLDS.fair}) and Strong (${THRESHOLDS.strong}). Faded bars are the AI's own estimate.`}
    >
      <BarChart
        responsive
        layout="vertical"
        data={data}
        margin={{ top: 18, right: 132, bottom: 0, left: 0 }}
        style={{ width: "100%", height: 46 * data.length + 50 }}
      >
        <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={124}
          tick={{ fill: "var(--ink-soft)", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "var(--rule-strong)" }}
        />
        {[
          [THRESHOLDS.fair, "Fair"],
          [THRESHOLDS.strong, "Strong"],
        ].map(([x, label]) => (
          <ReferenceLine
            key={label}
            x={x}
            stroke="var(--rule-strong)"
            label={{ value: label, position: "top", fill: "var(--ink-faint)", fontSize: 10.5 }}
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
          <LabelList dataKey="value" content={(p) => <TipLabel {...p} data={data} />} />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
