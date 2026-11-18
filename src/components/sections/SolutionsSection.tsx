"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { useOnScreen } from "@/lib/useOnScreen";
import { prefersReducedMotion } from "@/lib/inview";
import { SOLUTIONS_INCLUDED, SOLUTION_MODULES } from "@/data/erpContent";
import { sentenceCase } from "@/lib/text";
import ModuleNotes from "./ModuleNotes";
import SectionHead from "./SectionHead";

/**
 * The industries as tabs across the top, which stay in view. Each industry opens as one wide, horizontal panel (the problem and
 * the answer side by side, the job as a row of steps, the modules and the benefits in columns), so there is little to scroll.
 * A link to #glass-railing, #windows-doors and so on scrolls here and opens that industry.
 */
/** The one accent, used for the tab, its number and the kicker of whichever industry is open. */
const TONE = { fill: "var(--blue)", text: "var(--accent)" };
const TONE_STYLE = { ["--tone-fill" as string]: TONE.fill, ["--tone-text" as string]: TONE.text };

export default function SolutionsSection() {
  const [active, setActive] = useState(0);
  const [ref, seen] = useOnScreen<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px" });
  const show = (i: number) => setActive(i);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const total = INDUSTRY_SOLUTIONS.length;
  const s = INDUSTRY_SOLUTIONS[active];

  // Choosing an industry from further down the page brings its panel back into view, so there is no scrolling up to check
  const pick = (i: number) => {
    show(i);
    const top = body.current?.getBoundingClientRect().top ?? 0;
    if (top < 150) window.scrollTo({ top: window.scrollY + top - 170, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  useEffect(() => {
    const fromHash = () => {
      const i = INDUSTRY_SOLUTIONS.findIndex((x) => `#${x.id}` === window.location.hash);
      if (i >= 0) show(i);
    };
    // the address is only readable in the browser, so a link that opens an industry is picked up after mount
    queueMicrotask(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + total) % total;
    pick(n);
    tabs.current[n]?.focus();
  };

  return (
    <section id="solutions" data-section="solutions" className="page-sec">
      {/* every industry's link target sits here, so #glass and the others scroll to the tabs */}
      {INDUSTRY_SOLUTIONS.map((x) => (
        <span key={x.id} id={x.id} className="sec-anchor" aria-hidden="true" />
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title="Set up for each part of the fenestration trade">
          FEN1 is set up for aluminium and uPVC windows and doors, glass railing and curtain wall. Choose one to see how a job runs.
        </SectionHead>

        {/* above the industries, because it belongs to all of them */}
        <div className="sol-common">
          <p className="sol-label tech">Included in every solution</p>
          <ModuleNotes notes={SOLUTIONS_INCLUDED} cols={2} level={3} />
        </div>

        <div ref={ref} className={`sol ${seen ? "is-in" : ""}`} data-no-reveal>
          {/* the industry tabs stay at the top of the screen while you read, so changing industry never means scrolling up */}
          <div className="sol-side">
            <div role="tablist" aria-label="Industries" aria-orientation="horizontal" className="sol-tabs">
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
                  style={TONE_STYLE}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className="tech sol-tab-num">{x.number}</span>
                  <span className="sol-tab-title">{x.title}</span>
                </button>
              ))}
            </div>
            <div className="sol-nav" aria-label="Change industry">
              <button type="button" onClick={() => pick((active + total - 1) % total)} aria-label="Previous industry" className="sol-arrow">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => pick((active + 1) % total)} aria-label="Next industry" className="sol-arrow">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* one wide panel */}
          <div className="sol-body" ref={body} style={TONE_STYLE}>
            <div id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${s.id}`} key={s.id} className="sol-panel">
              <div className="sol-head">
                <div>
                  <p className="tech sol-kicker">
                    {s.number} &nbsp;{s.subtitle}
                  </p>
                  <h3 className="sol-title">
                    {s.title}
                    {s.parts && <small className="sol-parts">({s.parts})</small>}
                  </h3>
                </div>
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
              </div>
              <ol className="sol-chain" aria-label="Stages of a job">
                {s.workflow.map((w) => (
                  <li key={w}>{sentenceCase(w)}</li>
                ))}
              </ol>
              <div className="sol-journey">
                <p className="sol-label tech">How a job runs</p>
                <ol className="sol-journey-list">
                  {s.operationalJourney.map((j) => {
                    const [, num = "", title = j.step] = /^(\d+)\.\s*(.*)$/.exec(j.step) ?? [];
                    return (
                      <li key={j.step}>
                        <span className="tech sol-j-n">{num}</span>
                        <span>
                          <strong className="sol-j-title">{title}</strong>
                          <span className="sol-j-text">{j.action}</span>
                          <span className="sol-j-mod">{sentenceCase(j.module)}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="sol-mods">
                <p className="sol-label tech">Modules it uses</p>
                <ModuleNotes notes={SOLUTION_MODULES[s.id] ?? []} cols={4} level={4} />
              </div>
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
        </div>
      </div>
    </section>
  );
}
