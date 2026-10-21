"use client";

import CountUp from "@/components/CountUp";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { ROADMAP_STAGES } from "@/data/roadmap";

// Every figure is derived from the data the site renders, so it can never drift from the content.
const GROUPS = new Set(FEN1_MODULES.map((m) => m.category)).size;

const STATS = [
  { to: FEN1_MODULES.length, label: "Connected modules", note: "Sales to site, one database" },
  { to: ROADMAP_STAGES.length, label: "Roadmap stages", note: "Enquiry to handover" },
  { to: INDUSTRY_SOLUTIONS.length, label: "Industry solutions", note: "Glass, aluminium and windows" },
  { to: GROUPS, label: "Module groups", note: "Business to analytics" },
];

export default function StatsStrip() {
  return (
    <section className="relative pb-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="stats-bar rounded-[28px] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#D0DCF0]/70">
          {STATS.map((s, i) => (
            <div key={s.label} data-reveal="up" data-delay={i * 90} className="px-6 py-8 sm:px-8 sm:py-10 text-center lg:text-left">
              <div className="font-display text-4xl sm:text-5xl text-[#0B1530] tracking-tight">
                <CountUp to={s.to} />
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
