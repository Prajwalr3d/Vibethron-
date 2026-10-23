"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, Tooltip, XAxis, YAxis } from "recharts";
import { ANIMATION, AXIS_TICK, ChartCard, GRID_STROKE, Legend, PaperTooltip, TooltipRow } from "./chrome";

const short = (name) => name.split(/[\s/]/)[0];

export default function WordCountChart({ rows }) {
  const data = rows.map((r) => ({ name: short(r.name), full: r.name, original: r.wordsBefore, rewrite: r.wordsAfter, color: r.color }));
  return (
    <ChartCard
      title="Length"
      caption="Word count of your draft (grey) next to each rewrite (its vibe colour)."
      legend={<Legend items={[{ label: "Your draft", color: "var(--series-neutral)" }]} />}
    >
      <BarChart responsive data={data} barGap={2} margin={{ top: 18, right: 4, bottom: 0, left: -18 }} style={{ width: "100%", height: 230 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--rule-strong)" }} interval={0} />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "var(--rule)" }}
          content={(p) => (
            <PaperTooltip
              {...p}
              label={p.payload?.[0]?.payload.full}
              render={([v]) => (
                <>
                  <TooltipRow color="var(--series-neutral)" label="Your draft" value={`${v.payload.original} words`} />
                  <TooltipRow color={v.payload.color} label="Rewrite" value={`${v.payload.rewrite} words`} />
                </>
              )}
            />
          )}
        />
        <Bar dataKey="original" fill="var(--series-neutral)" barSize={14} radius={[4, 4, 0, 0]} {...ANIMATION} />
        <Bar
          dataKey="rewrite"
          barSize={14}
          shape={(props) => <Rectangle {...props} fill={props.payload.color} radius={[4, 4, 0, 0]} />}
          {...ANIMATION}
        >
          <LabelList dataKey="rewrite" position="top" fill="var(--ink-soft)" fontSize={11} />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
