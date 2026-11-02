"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { FEN1_MODULES } from "@/data/modules";
import { SOLUTION_PHOTOS } from "@/data/gallery";
import { useOnScreen } from "@/lib/useOnScreen";
import { prefersReducedMotion } from "@/lib/inview";
import { MODULE_ICONS } from "@/components/moduleIcons";
import ModuleList from "@/components/ModuleList";
import SectionHead from "./SectionHead";

/**
 * The five industries as tabs across the top, which stay in view. Photo and content sit side by side, so the section is about one
 * screen tall. Each industry has its own photograph: the photos sit stacked, and choosing an industry wipes its photo
 * in over the last one while it settles from 1.03 to 1, then the text enters. Nothing is pinned and no scroll engine is
 * involved. Below the tabs, every module as a numbered list. A link to #glass, #windows-doors and so on scrolls here and opens that industry.
 */
export default function SolutionsSection() {
  // `prev` is the industry that was showing, so its photo stays underneath while the new one wipes in
  const [{ active, prev }, setShown] = useState({ active: 0, prev: 0 });
  const [ref, seen] = useOnScreen<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px" });
  const show = (i: number) => setShown((cur) => (cur.active === i ? cur : { active: i, prev: cur.active }));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const total = INDUSTRY_SOLUTIONS.length;
  const s = INDUSTRY_SOLUTIONS[active];

  // Choosing an industry from further down the page brings its photo back into view, so there is no scrolling up to check
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
        <SectionHead eyebrow="Solutions" title="Set up for each part of the fenestration trade">
          FEN1 is configured for glass processing plants, aluminium window fabricators, glazing contractors and dealer networks. Choose an industry to see how a job runs.
        </SectionHead>

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

          {/* the photo on one side (it stays in view), the content on the other */}
          <div className="sol-body" ref={body}>
            <div className="sol-media">
              <div className="sol-photo">
                {INDUSTRY_SOLUTIONS.map((x, i) => {
                  const photo = SOLUTION_PHOTOS[x.id];
                  return (
                    <div key={x.id} className={`sol-shot ${i === active ? "is-active" : i === prev ? "is-prev" : ""}`} data-dir={i % 2 ? "r" : "l"} aria-hidden={i === active ? undefined : true}>
                      <Image src={photo.src} alt={i === active ? photo.alt : ""} fill sizes="(min-width: 900px) 42vw, 100vw" className="object-cover" style={photo.position ? { objectPosition: photo.position } : undefined} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${s.id}`} key={s.id} className="sol-panel">
              <p className="tech sol-kicker">
                {s.number} &nbsp;{s.subtitle}
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
        </div>

        <div id="modules" className="mods">
          <p className="sol-label tech">All {FEN1_MODULES.length} modules</p>
          <ModuleList modules={FEN1_MODULES} icons={MODULE_ICONS} />
        </div>
      </div>
    </section>
  );
}
