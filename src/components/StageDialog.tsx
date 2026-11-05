"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { RoadmapStage } from "@/data/roadmap";
import { STAGE_SCREENS } from "@/data/stageScreens";

/**
 * One workflow stage opened over the page: its ERP screens large, and what it is, where it is worked and what it leaves in the
 * record, with Previous / Next stage. Closes with the Close button, Escape or a click outside. While it is open the page behind
 * does not scroll, Tab stays inside it, and focus starts on Close. Used by the home page Workflow (the screen that was selected).
 * The screens are the demo ERP screens in data/stageScreens.ts.
 */
export default function StageDialog({ stages, index, startShot = 0, onMove, onClose }: { stages: RoadmapStage[]; index: number; startShot?: number; onMove: (i: number) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [shot, setShot] = useState(startShot);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const stage = stages[index];
  const shots = STAGE_SCREENS[stage.step] ?? [];

  useEffect(() => {
    closeBtn.current?.focus();
    // the page behind does not scroll while a stage is open
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Tab stays inside the dialog
  const trap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !box.current) return;
    const items = [...box.current.querySelectorAll<HTMLElement>("button:not([disabled])")];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const go = (i: number) => {
    setShot(0);
    onMove(i);
  };

  // rendered into the page body: the panel it was opened from animates, which would otherwise make it the frame of reference for `fixed`
  return createPortal(
    <div className="flow-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="flow-dlg-title" className="flow-dlg" onKeyDown={trap}>
        <button ref={closeBtn} type="button" className="flow-close" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flow-dlg-body">
          <div className="flow-dlg-media">
            {shots[shot] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={shots[shot].src} src={shots[shot].src} alt={shots[shot].alt} className="flow-dlg-img" />
            )}
            {shots.length > 1 && (
              <div className="flow-dlg-thumbs">
                {shots.map((s, i) => (
                  <button key={s.src} type="button" className={`flow-thumb${i === shot ? " is-on" : ""}`} aria-label={`Screen ${i + 1} of ${shots.length}`} aria-pressed={i === shot} onClick={() => setShot(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flow-dlg-text">
            <p className="tech flow-dlg-kicker">
              Step {stage.step} of {stages.length}
            </p>
            <h4 id="flow-dlg-title" className="flow-dlg-title">
              {stage.title}
            </h4>
            <p className="flow-dlg-sub">{stage.subtitle}</p>
            <p className="flow-dlg-desc">{stage.desc}</p>
            <dl className="flow-dlg-meta">
              <div>
                <dt className="tech">Worked in</dt>
                <dd>{stage.module}</dd>
              </div>
              <div>
                <dt className="tech">Leaves in the record</dt>
                <dd>{stage.record}</dd>
              </div>
            </dl>
            <div className="flow-dlg-nav">
              <button type="button" className="flow-nav" disabled={index === 0} onClick={() => go(index - 1)}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Previous step</span>
              </button>
              <button type="button" className="flow-nav" disabled={index === stages.length - 1} onClick={() => go(index + 1)}>
                <span>Next step</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
