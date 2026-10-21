"use client";

import CountUp from "@/components/CountUp";
import { INDUSTRIAL_STAGES } from "@/lib/data";
import { FEN1_MODULES } from "@/data/modules";

const STATS = [
  { to: FEN1_MODULES.length, label: "Connected modules", note: "Sales to site, one database" },
  { to: INDUSTRIAL_STAGES.length, label: "Lifecycle stages", note: "Enquiry to handover" },
  { to: 3.4, decimals: 1, prefix: "< ", suffix: "%", label: "Extrusion scrap", note: "With 1D linear nesting" },
  { to: 94.2, decimals: 1, suffix: "%", label: "Off-cut recovery", note: "Bar-level stock tracking" },
];

export default function StatsStrip() {
  return (
    <section className="relative pb-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="stats-bar rounded-[28px] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#D0DCF0]/70">
          {STATS.map((s, i) => (
            <div key={s.label} data-reveal="up" data-delay={i * 90} className="px-6 py-8 sm:px-8 sm:py-10 text-center lg:text-left">
              <div className="font-display text-4xl sm:text-5xl text-[#0B1530] tracking-tight">
                <CountUp to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-sm font-semibold text-[#0B1530]">{s.label}</div>
              <div className="mt-1 text-xs text-[#4A5B7A]">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
