"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { activeStage, stageScrollTarget } from "@/lib/roadmap";
import KineticHeading from "@/components/KineticHeading";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * The enquiry-to-handover roadmap as one pinned screen: the page stops, and scrolling swaps the stage.
 * Layout and motion live in CSS (`.roadmap-*` in globals.css); this component only reports which stage is active.
 * With reduced motion the scene stays pinned but the stages cross-fade instead of sliding.
 */
export default function RoadmapScene() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
  const n = ROADMAP_STAGES.length;

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(Math.max(-r.top / travel, 0), 1) : 0;
      el.style.setProperty("--p", progress.toFixed(4));
      setActive(activeStage(progress, n));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  const goTo = useCallback(
    (index: number) => {
      const el = section.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + stageScrollTarget(index, n, el.offsetHeight, window.innerHeight), behavior: "smooth" });
    },
    [n]
  );

  const current = ROADMAP_STAGES[active];

  return (
    <section
      ref={section}
      id="roadmap"
      data-chapter="Roadmap"
      data-no-reveal
      data-reduce={reduce || undefined}
      className="roadmap"
      style={{ ["--n" as string]: n, ["--h" as string]: 196 + active * 2.3 }}
    >
      <div className="roadmap-stage">
        <div className="roadmap-top">
          <div className="space-y-1">
            <p className="roadmap-eyebrow">Lead to installation</p>
            <h2 className="roadmap-heading">FROM FIRST ENQUIRY TO FINAL HANDOVER.</h2>
            <p className="roadmap-sub">{n} connected stages. Each one hands clean data to the next.</p>
          </div>
          <p className="roadmap-count" aria-hidden="true">
            <span>{current.step}</span> / {String(n).padStart(2, "0")}
          </p>
        </div>

        <ol className="roadmap-panels">
          {ROADMAP_STAGES.map((s, i) => (
            <li
              key={s.step}
              className={`roadmap-panel ${i === active ? "is-active" : i < active ? "is-past" : "is-next"}`}
              aria-current={i === active ? "step" : undefined}
            >
              <span className="roadmap-number" aria-hidden="true">
                {s.step}
              </span>
              <div className="roadmap-copy">
                <p className="roadmap-stage-name">{s.subtitle}</p>
                <KineticHeading as="h3" text={s.title} className="roadmap-title" />
                <p className="roadmap-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="roadmap-rail">
          <p className={`roadmap-cue ${active === 0 ? "is-on" : ""}`} aria-hidden="true">
            Scroll please.
          </p>
          <div className="roadmap-line" aria-hidden="true">
            <span className="roadmap-line-fill" />
          </div>
          <div className="roadmap-dots">
            {ROADMAP_STAGES.map((s, i) => (
              <button
                key={s.step}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Step ${s.step}: ${s.title}`}
                className={`roadmap-dot ${i === active ? "is-active" : i < active ? "is-past" : ""}`}
              >
                <span aria-hidden="true">{s.step}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
