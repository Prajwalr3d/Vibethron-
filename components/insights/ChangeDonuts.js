"use client";

import { Pie, PieChart } from "recharts";
import { ANIMATION, ChartCard } from "./chrome";

// One ring gauge per vibe: share of words added or removed.
export default function ChangeDonuts({ rows }) {
  return (
    <ChartCard title="How much changed" caption="Share of words added or removed in each rewrite.">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {rows.map((row) => (
          <div key={row.id} className="flex min-w-0 flex-col items-center">
            <div className="relative h-[92px] w-[92px]">
              <PieChart width={92} height={92}>
                <Pie
                  data={[
                    { value: row.percentChanged, fill: row.color },
                    { value: 100 - row.percentChanged, fill: "var(--paper-2)" },
                  ]}
                  dataKey="value"
                  innerRadius={30}
                  outerRadius={42}
                  startAngle={90}
                  endAngle={-270}
                  stroke="var(--paper)"
                  strokeWidth={2}
                  isAnimationActive
                  {...ANIMATION}
                />
              </PieChart>
              <span className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold">
                {row.percentChanged}%
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-center text-[12px] leading-tight text-ink-soft">
              <span className="inline-block h-2 w-2 shrink-0 rounded-[2px]" style={{ background: row.color }} aria-hidden="true" />
              <span className="truncate">{row.name}</span>
            </p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
