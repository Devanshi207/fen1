"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { TRACKS } from "@/data/trainingContent";
import HShell from "./HShell";
import Mark from "./Mark";
import { ScrollCue } from "./Parts";

const SIZE = "clamp(4rem, 14vw, 12.5rem)";

/** Training as a sideways journey: the six role tracks are a strip of slim panels; the one you point at opens up. */
export default function HorizontalTraining() {
  const [open, setOpen] = useState(0);
  return (
    <HShell left="TRAI" right="NING" size={SIZE} start={3}>
      <article className="hz-panel hz-hero" data-label="Training">
        <div className="hz-hero-body">
          <Mark left="TRAI" right="NING" size={SIZE} start={3} />
          <p className="hz-kicker">Training for every team</p>
          <p className="hz-lede">Role-based training that follows the FEN1 roadmap, from enquiry to handover.</p>
        </div>
        <ScrollCue />
      </article>

      <article id="roles" className="hz-panel hz-accordion-panel" data-label="Roles">
        <div className="hz-accordion">
          {TRACKS.map((track, i) => (
            <button
              key={track.title}
              type="button"
              className={`hz-fold ${i === open ? "is-open" : ""}`}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              aria-pressed={i === open}
            >
              <span className="hz-fold-rail">{track.title}</span>
              <span className="hz-fold-body">
                <span className="hz-fold-title">{track.title}</span>
                <span className="hz-fold-team">{track.team}</span>
                <span className="hz-fold-topics">
                  {track.topics.map((t) => (
                    <span key={t}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent)" }} />
                      {t}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
      </article>
    </HShell>
  );
}
