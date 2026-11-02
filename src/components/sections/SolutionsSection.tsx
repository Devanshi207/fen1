"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { FEN1_MODULES } from "@/data/modules";
import { MODULE_ICONS } from "@/components/moduleIcons";
import ModuleList from "@/components/ModuleList";
import SectionHead from "./SectionHead";

/**
 * The five industries as tabs with one panel that crossfades (no scroll engine, nothing pinned), then every module as a
 * numbered list. A link to #glass, #windows-doors and so on scrolls here and opens that industry.
 */
export default function SolutionsSection() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = INDUSTRY_SOLUTIONS.length;
  const s = INDUSTRY_SOLUTIONS[active];

  useEffect(() => {
    const fromHash = () => {
      const i = INDUSTRY_SOLUTIONS.findIndex((x) => `#${x.id}` === window.location.hash);
      if (i >= 0) setActive(i);
    };
    // the address is only readable in the browser, so a link that opens an industry is picked up after mount
    queueMicrotask(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + total) % total;
    setActive(n);
    tabs.current[n]?.focus();
  };

  return (
    <section id="solutions" data-section="solutions" className="page-sec">
      {/* every industry's link target sits here, so #glass and the others scroll to the tabs */}
      {INDUSTRY_SOLUTIONS.map((x) => (
        <span key={x.id} id={x.id} className="sec-anchor" aria-hidden="true" />
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Solutions" title="ENGINEERED FOR YOUR EXACT OPERATIONS.">
          FEN1 is built for glass processing plants, aluminium window fabricators, glazing contractors and dealer networks, with every module you need in one system.
        </SectionHead>

        <div className="sol" data-no-reveal>
          <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="sol-tabs">
            {INDUSTRY_SOLUTIONS.map((x, i) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`sol-tab-${x.id}`}
                aria-selected={i === active}
                aria-controls="sol-panel"
                tabIndex={i === active ? 0 : -1}
                className={`sol-tab ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="tech sol-tab-num">{x.number}</span>
                <span className="sol-tab-title">{x.title}</span>
              </button>
            ))}
          </div>

          <div id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${s.id}`} key={s.id} className="sol-panel">
            <p className="tech sol-kicker">
              {s.number} / {String(total).padStart(2, "0")} &nbsp;{s.subtitle}
            </p>
            <h3 className="sol-title">{s.title}</h3>
            <div className="sol-cols">
              <div>
                <p className="sol-label tech">The problem</p>
                <p className="sol-text">{s.challenge}</p>
              </div>
              <div>
                <p className="sol-label tech">How FEN1 handles it</p>
                <p className="sol-text">{s.solutionSummary}</p>
              </div>
            </div>
            <p className="sol-chain" aria-label={`Workflow: ${s.workflow.join(", ")}`}>
              {s.workflow.map((w, i) => (
                <span key={w}>
                  {w}
                  {i < s.workflow.length - 1 && <span aria-hidden="true"> → </span>}
                </span>
              ))}
            </p>
            <ul className="sol-benefits">
              {s.keyBenefits.map((b) => (
                <li key={b}>
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="modules" className="mods">
          <p className="sol-label tech">All {FEN1_MODULES.length} modules</p>
          <ModuleList modules={FEN1_MODULES} icons={MODULE_ICONS} />
        </div>
      </div>
    </section>
  );
}
