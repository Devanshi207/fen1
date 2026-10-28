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
    <section id="figures" data-chapter="Figures" data-snap className="figures">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <p className="figures-eyebrow" data-reveal="up">
          At a glance
        </p>
        <div className="figures-grid">
          {STATS.map((s, i) => (
            <div key={s.label} data-reveal="up" data-delay={i * 110}>
              <div className="figure-num">
                <CountUp to={s.to} />
              </div>
              <p className="figure-label">{s.label}</p>
              <p className="figure-note">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
