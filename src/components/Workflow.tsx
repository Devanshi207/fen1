"use client";

import { useEffect, useRef, useState } from "react";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { STAGE_SCREENS } from "@/data/stageScreens";
import StageDialog from "@/components/StageDialog";

/** The four phases the 13 stages fall into: first and last stage of each (0-based, inclusive). */
export const PHASES = [
  { label: "Win the job", from: 0, to: 3 },
  { label: "Define it", from: 4, to: 5 },
  { label: "Make it", from: 6, to: 10 },
  { label: "Deliver it", from: 11, to: 12 },
];

/** How much scrolling each stage takes, as a share of the screen height. */
export const STEP_SVH = 24;

/**
 * Three ERP screens in a row: the first (the main one) big in the middle, one smaller on each side. Point at any of them and it
 * grows while the other two shrink and blur; move away and the row settles back (pure CSS, see `.wf3-shots` in motion.css).
 * Select one and it opens larger, with the details of the stage (see StageDialog).
 */
function Screens({ step, title, onOpen }: { step: string; title: string; onOpen: (shot: number) => void }) {
  const shots = STAGE_SCREENS[step] ?? [];
  return (
    <div className="wf3-shots">
      {shots.map((s, i) => (
        <button key={s.src} type="button" className={`wf3-shot s${i + 1}`} aria-haspopup="dialog" aria-label={`${title}, screen ${i + 1} of ${shots.length}: open details`} onClick={() => onOpen(i)}>
          {/* plain img: the screens are small SVGs now and can be any image type later */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.src} alt="" width={960} height={600} decoding="async" />
        </button>
      ))}
    </div>
  );
}

/**
 * The enquiry-to-handover workflow, driven by scrolling: the stage changes as the page moves, and the only things to click are the ERP screens, which open the stage's details. The section is a tall
 * block with one stage panel held in place (position: sticky) while you scroll past it, and the stage changes as you go,
 * about a quarter of a screen of scrolling for each of the 13 stages. Scrolling is never captured or slowed: the page moves
 * as normal and the panel simply stays put. Which stage is showing comes from 13 invisible markers and an
 * IntersectionObserver (no scroll listener, and the page re-renders only when the stage changes). The numbers along the top
 * and the line between them are an indicator, not buttons. For screen readers the whole workflow is a plain list.
 * Each stage shows its description, the FEN1 module it is worked in, the record it leaves, and three ERP screens (demo
 * images for now: see data/stageScreens.ts). The look and motion are in app/motion.css (`.wf3-*`, `.wf2-*`).
 */
export default function Workflow() {
  const [active, setActive] = useState(0);

  // every stage's screens are fetched as soon as the section mounts, so a stage never opens on empty white boxes
  useEffect(() => {
    for (const shots of Object.values(STAGE_SCREENS)) {
      for (const s of shots) {
        const img = new Image();
        img.decoding = "async";
        img.src = s.src;
      }
    }
  }, []);

  const [short, setShort] = useState(false); // the block is one screen tall while you are on your way back up
  const [opened, setOpened] = useState<{ index: number; shot: number } | null>(null);
  const markers = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = ROADMAP_STAGES.length;
  const stage = ROADMAP_STAGES[active];
  const phase = PHASES.find((p) => active >= p.from && active <= p.to) ?? PHASES[0];

  // the stage whose marker is crossing the middle of the screen is the one to show. Scrolling down walks through every stage.
  // Coming back up from the next section (past the end of the block) does not make you scroll through the stages again: the panel
  // shows step 1 at once, and the block shrinks to one screen so Home is one scroll away; it grows back once you are above it.
  useEffect(() => {
    const box = markers.current;
    const track = trackRef.current;
    if (!box || typeof IntersectionObserver === "undefined") return;
    let last = 0; // the marker crossed most recently, to tell down from up
    let returning = false; // came back up from below the block
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          const up = i < last;
          last = i;
          if (returning && up) continue;
          returning = false;
          setActive(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    box.querySelectorAll("[data-i]").forEach((el) => io.observe(el));

    // the whole block leaving the screen: below it means the reader went on to the next section, above it means they have not started
    const edge = track
      ? new IntersectionObserver((entries) => {
          for (const e of entries) {
            if (e.isIntersecting) continue;
            const wentOn = e.boundingClientRect.bottom <= 0;
            returning = wentOn;
            last = wentOn ? ROADMAP_STAGES.length : 0;
            setActive(0);
            setShort(wentOn);
          }
        })
      : null;
    if (track) edge?.observe(track);
    return () => {
      io.disconnect();
      edge?.disconnect();
    };
  }, []);

  return (
    <section id="roadmap" className="wf3-section sec-teal" aria-labelledby="wf-title">
      <div ref={trackRef} className={`wf3-track${short ? " is-short" : ""}`} data-no-reveal style={{ ["--n" as string]: total, ["--step" as string]: `${STEP_SVH}svh`, ["--p" as string]: active / (total - 1) }}>
        <div className="wf3-stage">
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 wf3-inner">
            <div className="wf-head" aria-hidden="true">
              <p className="wf-eyebrow tech">Workflow</p>
              <p className="wf3-heading">From enquiry to handover</p>
              <p className="wf-lede">{total} stages on one job record. Each stage starts from what the one before it recorded.</p>
            </div>

            {/* phones: one line for where you are, and a bar of 13 segments, instead of the row of 13 numbered circles */}
            <div className="wf-m" aria-hidden="true">
              <div className="wf-m-row">
                <span className="wf-m-phase">{phase.label}</span>
                <span className="wf-m-count">
                  {stage.step}
                  <small> / {total}</small>
                </span>
              </div>
              <div className="wf-m-bar">
                {ROADMAP_STAGES.map((s, i) => (
                  <span key={s.step} className={i < active ? "is-done" : i === active ? "is-now" : ""} />
                ))}
              </div>
            </div>

            <div className="wf2-phases tech" aria-hidden="true">
              {PHASES.map((p) => (
                <span key={p.label} className={active > p.to ? "is-done" : active >= p.from ? "is-active" : ""} style={{ gridColumn: `${p.from + 1} / ${p.to + 2}`, ["--f" as string]: active > p.to ? 1 : active >= p.from ? (active - p.from + 1) / (p.to - p.from + 1) : 0 }}>
                  {p.label}
                </span>
              ))}
            </div>
            <div className="wf2-rail" aria-hidden="true">
              <span className="wf2-line" />
              <span className="wf2-fill" />
              <ol className="wf2-nodes">
                {ROADMAP_STAGES.map((s, i) => (
                  <li key={s.step}>
                    <span className={`wf2-node tech ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}>{s.step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div key={stage.step} className="wf3-panel">
              <div className="wf3-copy" aria-hidden="true">
                <p className="wf-sub tech">{stage.subtitle}</p>
                <p className="wf-title wf3-title">{stage.title}</p>
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
              <Screens step={stage.step} title={stage.title} onOpen={(shot) => setOpened({ index: active, shot })} />
            </div>
          </div>
        </div>

        {opened && (
          <StageDialog
            stages={ROADMAP_STAGES}
            index={opened.index}
            startShot={opened.shot}
            onMove={(index) => setOpened({ index, shot: 0 })}
            onClose={() => {
              const shot = opened.shot;
              setOpened(null);
              // focus goes back to the screen that was opened
              queueMicrotask(() => document.querySelector<HTMLElement>(`.wf3-shot.s${shot + 1}`)?.focus());
            }}
          />
        )}

        {/* the markers: 13 blocks of scrolling, one per stage, held below the middle of the screen when the panel is pinned */}
        <div ref={markers} className="wf3-markers" aria-hidden="true">
          {ROADMAP_STAGES.map((s, i) => (
            <span key={s.step} data-i={i} />
          ))}
        </div>

        {/* what the pinned panel shows, as plain text for screen readers (the panel itself is hidden from them to avoid repeating it) */}
        <div className="sr-only">
          <h2 id="wf-title">From enquiry to handover</h2>
          <ol>
            {ROADMAP_STAGES.map((s) => (
              <li key={s.step}>
                <h3>
                  {s.step} {s.title}: {s.subtitle}
                </h3>
                <p>{s.desc}</p>
                <p>Worked in: {s.module}. Leaves in the record: {s.record}.</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
