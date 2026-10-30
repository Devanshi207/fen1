"use client";

import { CheckCircle2 } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { FEN1_MODULES } from "@/data/modules";
import ModuleList from "@/components/ModuleList";
import { MODULE_ICONS } from "@/components/moduleIcons";
import HShell from "./HShell";
import Mark from "./Mark";
import { ScrollCue } from "./Parts";

const SIZE = "clamp(3.2rem, 11.5vw, 10.5rem)";

/** Solutions as a sideways journey: the verticals as tall cards (each reachable by its #id), then the module list. */
export default function HorizontalSolutions() {
  return (
    <HShell left="SOLU" right="TIONS" size={SIZE} start={2}>
      <article className="hz-panel hz-hero" data-label="Solutions">
        <div className="hz-hero-body">
          <Mark left="SOLU" right="TIONS" size={SIZE} start={2} />
          <p className="hz-kicker">Engineered for your exact operations</p>
          <p className="hz-lede">
            FEN1 is built for glass processing plants, aluminium window fabricators, glazing contractors and dealer networks, with every module you need in one system.
          </p>
        </div>
        <ScrollCue />
      </article>

      <article className="hz-panel hz-cards" data-label="Verticals">
        <div className="hz-card-row is-wide">
          {INDUSTRY_SOLUTIONS.map((sol) => (
            <div key={sol.id} id={sol.id} className="hz-card hz-card--tall hz-tilt">
              <span className="hz-card-ghost" aria-hidden="true">
                {sol.number}
              </span>
              <span className="hz-eyebrow">Vertical {sol.number}</span>
              <h2 className="hz-card-title is-large">{sol.title}</h2>
              <p className="hz-card-text">{sol.subtitle}</p>
              <ul className="hz-benefits">
                {sol.keyBenefits.slice(0, 2).map((b) => (
                  <li key={b}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>

      <article id="modules" className="hz-panel hz-modules is-list" data-label="Modules">
        <p className="hz-eyebrow">Modules</p>
        <ModuleList modules={FEN1_MODULES} icons={MODULE_ICONS} />
      </article>
    </HShell>
  );
}
