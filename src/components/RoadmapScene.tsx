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

// Layout under review: ?roadmap=ladder or ?roadmap=film swaps the stage layout; anything else is the original centred one
const subscribeNone = () => () => {};
type Variant = "centred" | "ladder" | "film" | "film3";
const readVariant = (): Variant => {
  const v = new URLSearchParams(window.location.search).get("roadmap");
  return v === "ladder" || v === "film" || v === "film3" ? v : "centred";
};
const GROUP = 3;

/**
 * The enquiry-to-handover roadmap as one pinned screen: the page stops, and scrolling swaps the stage.
 * Layout and motion live in CSS (`.roadmap-*` in globals.css); this component only reports which stage is active.
 * With reduced motion the scene stays pinned but the stages cross-fade instead of sliding.
 */
export default function RoadmapScene() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // True while the page is gliding on its own (a jump out of the roadmap, or a dot click), so those scrolls are not re-judged
  const gliding = useRef(false);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
  const variant = useSyncExternalStore(subscribeNone, readVariant, (): Variant => "centred");
  const total = ROADMAP_STAGES.length;
  // film3 moves three cards per scroll step, so the scroll is divided into groups instead of single stages
  const n = variant === "film3" ? Math.ceil(total / GROUP) : total;

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
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
      // Scrolling back up inside the roadmap does not walk the stages one by one: it returns straight to stage 1
      const y = window.scrollY;
      const goingUp = y < lastY - 2;
      lastY = y;
      if (!goingUp || gliding.current) return;
      const r = el.getBoundingClientRect();
      if (r.top < -8 && r.bottom > window.innerHeight * 0.5) {
        gliding.current = true;
        window.scrollTo({ top: window.scrollY + r.top, behavior: window.matchMedia(REDUCE).matches ? "auto" : "smooth" });
        window.setTimeout(() => {
          gliding.current = false;
          lastY = window.scrollY;
        }, 1100);
      }
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
      gliding.current = true;
      window.setTimeout(() => (gliding.current = false), 1100);
      const unit = variant === "film3" ? Math.min(Math.floor(index / GROUP), n - 1) : index;
      window.scrollTo({ top: top + stageScrollTarget(unit, n, el.offsetHeight, window.innerHeight), behavior: "smooth" });
    },
    [n, variant]
  );

  const grouped = variant === "film3";
  // The three cards on show in a group; the last group is pulled back so it still shows three
  const first = grouped ? Math.min(active * GROUP, total - GROUP) : active;
  const last = grouped ? first + GROUP - 1 : active;
  const current = ROADMAP_STAGES[first];
  const cardState = (i: number) => (i >= first && i <= last ? "is-active" : i < first ? "is-past" : "");

  return (
    <section
      ref={section}
      id="roadmap"
      data-chapter="Roadmap"
      data-no-reveal
      data-reduce={reduce || undefined}
      data-variant={variant}
      className="roadmap"
      style={{ ["--n" as string]: n, ["--a" as string]: grouped ? first + 1 : active }}
    >
      <div className="roadmap-stage">
        <div className="roadmap-top">
          <div className="space-y-1">
            <p className="roadmap-eyebrow">Lead to installation</p>
            <h2 className="roadmap-heading">FROM FIRST ENQUIRY TO FINAL HANDOVER.</h2>
            <p className="roadmap-sub">{total} connected stages. Each one hands clean data to the next.</p>
          </div>
          <p className="roadmap-count" aria-hidden="true">
            <span>{grouped ? `${current.step}-${ROADMAP_STAGES[last].step}` : current.step}</span> / {String(total).padStart(2, "0")}
          </p>
        </div>

        {variant === "ladder" && (
          <div className="rl-body">
            <ol className="rl-list" aria-label="Stages">
              {ROADMAP_STAGES.map((s, i) => (
                <li key={s.step}>
                  <button type="button" onClick={() => goTo(i)} className={`rl-item ${i === active ? "is-active" : i < active ? "is-past" : ""}`} aria-current={i === active ? "step" : undefined}>
                    <span className="rl-item-num">{s.step}</span>
                    <span className="rl-item-title">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="rl-detail" key={current.step}>
              <span className="rl-detail-num" aria-hidden="true">{current.step}</span>
              <p className="roadmap-stage-name">{current.subtitle}</p>
              <h3 className="roadmap-title">{current.title}</h3>
              <p className="roadmap-desc">{current.desc}</p>
            </div>
          </div>
        )}

        {(variant === "film" || grouped) && (
          <div className="rf-view">
            <ol className="rf-track">
              {ROADMAP_STAGES.map((s, i) => (
                <li key={s.step} className={`rf-card ${cardState(i)}`}>
                  <button type="button" onClick={() => goTo(i)} aria-current={i >= first && i <= last ? "step" : undefined}>
                    <span className="rf-num">{s.step}</span>
                    <span className="rf-title">{s.title}</span>
                    <span className="rf-sub">{s.subtitle}</span>
                    <span className="rf-desc">{s.desc}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        <ol className="roadmap-panels">
          {variant === "centred" && ROADMAP_STAGES.map((s, i) => (
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
