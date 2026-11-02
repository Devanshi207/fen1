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
 * The enquiry-to-handover workflow as one compact stepper instead of a long scroll: all 13 stages sit on a single line,
 * grouped into four phases, and the stage you pick shows its detail below. The line draws as you move forward. It never
 * pins the page or waits for anything: it draws in once when it scrolls into view, and every control is a real button.
 * Phones show the stages in two rows (the line is dropped there). The look and motion are in app/motion.css (`.wf2-*`).
 */
export default function Workflow() {
  const [active, setActive] = useState(0);
  const [ref, seen] = useOnScreen<HTMLDivElement>({ threshold: 0.3, rootMargin: "0px" });
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
    <section id="roadmap" className="wf2-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="wf-head">
          <p className="wf-eyebrow tech">Lead to installation</p>
          <h2 className="text-3xl sm:text-4xl leading-[1.1] tracking-tight text-[#34434A]">FROM FIRST ENQUIRY TO FINAL HANDOVER.</h2>
          <p className="wf-lede">{total} connected stages. Each one hands clean data to the next.</p>
        </div>

        <div ref={ref} className={`wf2 ${seen ? "is-in" : ""}`} data-no-reveal style={{ ["--p" as string]: active / (total - 1) }}>
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
            <p className="wf2-num" aria-hidden="true">
              {stage.step}
            </p>
            <div className="wf2-copy">
              <p className="wf-sub tech">{stage.subtitle}</p>
              <h3 className="wf-title">{stage.title}</h3>
              <p className="wf-desc">{stage.desc}</p>
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
      </div>
    </section>
  );
}
