"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { useOnScreen } from "@/lib/useOnScreen";

/** The four phases the 13 stages fall into: first and last stage of each (0-based, inclusive). */
export const PHASES = [
  { label: "Win the job", from: 0, to: 3 },
  { label: "Define it", from: 4, to: 5 },
  { label: "Make it", from: 6, to: 10 },
  { label: "Deliver it", from: 11, to: 12 },
];

/**
 * The enquiry-to-handover workflow. All 13 stages sit on one line, grouped into four phases, and the stage you pick
 * shows its description, the FEN1 module it is worked in and the record it leaves for the next stage. The line draws in
 * once when the section scrolls into view and fills as you move forward. It never pins the page or captures the scroll,
 * and every control is a real button. On phones the same stages are a vertical connected timeline, with the chosen stage
 * opened in place. The look and motion are in app/motion.css (`.wf2-*`).
 */
export default function Workflow() {
  const [active, setActive] = useState(0);
  const [ref, seen] = useOnScreen<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px" });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = ROADMAP_STAGES.length;
  const stage = ROADMAP_STAGES[active];
  const go = (i: number) => setActive(Math.min(total - 1, Math.max(0, i)));

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? total - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    tabs.current[Math.min(total - 1, Math.max(0, next))]?.focus();
  };

  return (
    <section id="roadmap" className="wf2-section sec-teal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="wf-head">
          <p className="wf-eyebrow tech">Workflow</p>
          <h2 className="text-3xl sm:text-4xl leading-[1.12] tracking-tight text-[#1E2B45]">From enquiry to handover</h2>
          <p className="wf-lede">{total} stages on one job record. Each stage starts from what the one before it recorded.</p>
        </div>

        <div ref={ref} className={`wf2 ${seen ? "is-in" : ""}`} data-no-reveal style={{ ["--p" as string]: active / (total - 1) }}>
          <div className="wf2-wide">
            <div className="wf2-phases tech" aria-hidden="true">
              {PHASES.map((p) => (
                <span key={p.label} style={{ gridColumn: `${p.from + 1} / ${p.to + 2}` }}>
                  {p.label}
                </span>
              ))}
            </div>

            <div className="wf2-rail">
              <span className="wf2-line" aria-hidden="true" />
              <span className="wf2-fill" aria-hidden="true" />
              <ol className="wf2-nodes" role="tablist" aria-label="Workflow stages">
                {ROADMAP_STAGES.map((s, i) => (
                  <li key={s.step} role="presentation">
                    <button
                      ref={(el) => {
                        tabs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`wf-tab-${s.step}`}
                      aria-selected={i === active}
                      aria-controls="wf-panel"
                      tabIndex={i === active ? 0 : -1}
                      title={s.title}
                      className={`wf2-node tech ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
                      style={{ ["--i" as string]: i }}
                      onClick={() => go(i)}
                      onKeyDown={(e) => onKey(e, i)}
                    >
                      {s.step}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${stage.step}`} key={stage.step} className="wf2-panel">
              <div className="wf2-copy">
                <p className="wf-sub tech">{stage.subtitle}</p>
                <h3 className="wf-title">{stage.title}</h3>
                <p className="wf-desc">{stage.desc}</p>
                <dl className="wf2-meta">
                  <div>
                    <dt className="tech">Worked in</dt>
                    <dd>{stage.module}</dd>
                  </div>
                  <div>
                    <dt className="tech">Leaves in the record</dt>
                    <dd>{stage.record}</dd>
                  </div>
                </dl>
              </div>
              <div className="wf2-nav">
                <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous stage" className="wf2-step">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => go(active + 1)} disabled={active === total - 1} aria-label="Next stage" className="wf2-step">
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Phones: the same stages as a vertical connected timeline; the chosen one opens in place */}
          <ol className="wf2-list" aria-label="Workflow stages">
            {ROADMAP_STAGES.map((s, i) => (
              <li key={s.step} className={`${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`} style={{ ["--i" as string]: i }}>
                <button type="button" aria-expanded={i === active} onClick={() => setActive(i)} className="wf2-row">
                  <span className="wf2-dot tech">{s.step}</span>
                  <span className="wf2-row-title">{s.title}</span>
                </button>
                {i === active && (
                  <div className="wf2-row-body">
                    <p className="wf-desc">{s.desc}</p>
                    <p className="wf2-row-meta">
                      <span className="tech">Worked in</span> {s.module}
                    </p>
                    <p className="wf2-row-meta">
                      <span className="tech">Leaves in the record</span> {s.record}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
