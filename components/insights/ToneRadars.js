"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from "recharts";
import { ANIMATION, ChartCard, Legend, PaperTooltip, TooltipRow } from "./chrome";

const AXES = [
  ["formality", "Formal"],
  ["warmth", "Warm"],
  ["urgency", "Urgent"],
  ["directness", "Direct"],
];

// Small multiples: one radar per vibe over the draft's own shape, instead of
// six overlapping polygons nobody can tell apart.
export default function ToneRadars({ rows, originalTone }) {
  return (
    <ChartCard
      title="Tone shift"
      caption="Each rewrite's tone (coloured) over your draft's tone (grey outline), 0 to 100."
      legend={<Legend items={[{ label: "Your draft", color: "var(--ink-faint)", shape: "line" }]} />}
      className="lg:col-span-2"
    >
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {rows.map((row) => {
          const data = AXES.map(([key, axis]) => ({ axis, vibe: row.tone[key], draft: originalTone?.[key] ?? 0 }));
          return (
            <div key={row.id} className="min-w-0">
              <RadarChart responsive data={data} outerRadius="68%" style={{ width: "100%", height: 170 }}>
                <PolarGrid stroke="var(--rule)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--ink-faint)", fontSize: 10.5 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="draft" stroke="var(--ink-faint)" strokeWidth={1.5} fill="none" isAnimationActive={false} />
                <Radar dataKey="vibe" stroke={row.color} strokeWidth={2} fill={row.color} fillOpacity={0.14} {...ANIMATION} />
                <Tooltip
                  content={(p) => (
                    <PaperTooltip
                      {...p}
                      render={([v]) => (
                        <>
                          <TooltipRow color={row.color} label={row.name} value={v.payload.vibe} />
                          <TooltipRow color="var(--ink-faint)" label="Your draft" value={v.payload.draft} />
                        </>
                      )}
                    />
                  )}
                />
              </RadarChart>
              <p className="flex items-center justify-center gap-1.5 text-center text-[12.5px] text-ink-soft">
                <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: row.color }} aria-hidden="true" />
                {row.name}
              </p>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
