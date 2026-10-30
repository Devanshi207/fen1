"use client";

import { XCircle } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { PROBLEMS, PRINCIPLES } from "@/data/aboutContent";
import HShell from "./HShell";
import Mark from "./Mark";
import { ScrollCue } from "./Parts";

const SIZE = "clamp(4.5rem, 17vw, 15rem)";

/** About as a sideways journey: the problem cards in a staggered row, then the three ideas, then who it is built for. */
export default function HorizontalAbout() {
  return (
    <HShell left="AB" right="OUT" size={SIZE} start={1}>
      <article className="hz-panel hz-hero" data-label="About">
        <div className="hz-hero-body">
          <Mark left="AB" right="OUT" size={SIZE} start={1} />
          <p className="hz-kicker">An ERP built around glass, aluminium &amp; windows</p>
          <p className="hz-lede">FEN1 runs the whole job in one system, from the first enquiry to final handover.</p>
        </div>
        <ScrollCue />
      </article>

      <article className="hz-panel hz-statement" data-label="Problem">
        <span className="hz-ghost" aria-hidden="true" data-speed="0.35" style={{ ["--s" as string]: 0.35 }}>
          TOOLS
        </span>
        <p className="hz-eyebrow">Without one system</p>
        <h2 className="hz-big hz-skew">Disconnected tools drain efficiency.</h2>
        <p className="hz-lede">When sales, design, purchase, store, production and site teams use separate tools, data is re-entered, errors compound and margins leak.</p>
      </article>

      <article className="hz-panel hz-cards" data-label="Six gaps">
        <div className="hz-card-row">
          {PROBLEMS.map((item) => (
            <div key={item.n} className="hz-card hz-tilt">
              <div className="hz-card-top">
                <span className="hz-card-num">{item.n}</span>
                <XCircle className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="hz-card-title">{item.name}</h3>
              <p className="hz-card-text">{item.issue}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="hz-panel hz-statement" data-label="The FEN1 way">
        <span className="hz-ghost" aria-hidden="true" data-speed="0.35" style={{ ["--s" as string]: 0.35 }}>
          CONNECTED
        </span>
        <p className="hz-eyebrow">The FEN1 way</p>
        <h2 className="hz-big hz-skew">One connected system.</h2>
        <p className="hz-lede">FEN1 follows the way the work actually flows, so every team starts from the previous team&apos;s data.</p>
      </article>

      <article className="hz-panel hz-cards" data-label="Three ideas">
        <div className="hz-card-row is-wide">
          {PRINCIPLES.map((p) => (
            <div key={p.label} className="hz-card hz-card--tall hz-tilt">
              <span className="hz-eyebrow">{p.label}</span>
              <h3 className="hz-card-title is-large">{p.title}</h3>
              <p className="hz-card-text">{p.text}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="hz-panel hz-built" data-label="Built for">
        <p className="hz-eyebrow">Built for</p>
        <ul className="hz-chips">
          {INDUSTRY_SOLUTIONS.map((s) => (
            <li key={s.id} className="hz-chip">
              {s.title}
            </li>
          ))}
        </ul>
      </article>
    </HShell>
  );
}
