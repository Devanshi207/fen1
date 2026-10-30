"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GALLERY } from "@/data/gallery";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { FEN1_MODULES } from "@/data/modules";
import HShell from "./HShell";
import Mark from "./Mark";
import { ScrollCue } from "./Parts";

const SIZE = "clamp(4.5rem, 17vw, 15rem)";

/** Home as a sideways journey: wordmark, the idea, four photo panels, the roadmap as a line, modules, close. */
export default function HorizontalHome() {
  return (
    <HShell left="FE" right="N1" size={SIZE}>
      <article className="hz-panel hz-hero" data-label="Intro">
        <div className="hz-hero-body">
          <Mark left="FE" right="N1" size={SIZE} />
          <p className="hz-kicker">The operating system for glass, aluminium &amp; windows</p>
          <p className="hz-lede">
            From estimation to installation, FEN1 connects sales, engineering, procurement, production, projects, people, finance and analytics in one unified ERP platform.
          </p>
          <div className="hz-actions">
            <Link href="/solutions" className="px-8 py-3.5 rounded-full bg-[#1B4FD6] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span>EXPLORE FEN1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/request-demo" className="px-8 py-3.5 rounded-full bg-[#FFFFFF] border border-[#D0DCF0] text-[#0B1530] font-bold text-xs uppercase tracking-wider">
              REQUEST A DEMO
            </Link>
          </div>
        </div>
        <ScrollCue />
      </article>

      <article className="hz-panel hz-statement" data-label="Idea">
        <span className="hz-ghost" aria-hidden="true" data-speed="0.35" style={{ ["--s" as string]: 0.35 }}>
          ONE SYSTEM
        </span>
        <p className="hz-eyebrow">Lead to installation</p>
        <h2 className="hz-big hz-skew">One system, from first enquiry to final handover.</h2>
        <p className="hz-lede">{ROADMAP_STAGES.length} connected stages. Each one hands clean data to the next.</p>
      </article>

      {GALLERY.map((g, i) => (
        <article key={g.src} className={`hz-panel hz-photo ${i % 2 ? "is-flip" : ""}`} data-label={g.title.split(" ")[0]}>
          <div className="hz-photo-frame hz-tilt hz-skew">
            <div className="hz-photo-inner" data-speed="-0.12" style={{ ["--s" as string]: -0.12 }}>
              <Image src={g.src} alt={g.alt} fill loading="eager" sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" style={{ objectPosition: g.position }} />
            </div>
          </div>
          <div className="hz-photo-copy">
            <span className="hz-eyebrow">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="hz-title">{g.title}</h2>
            <p className="hz-lede">{g.note}</p>
            <Link href={`/solutions#${g.solution}`} className="hz-link">
              <span>See the solution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>
      ))}

      <article className="hz-panel hz-timeline" data-label="Roadmap" aria-label="Roadmap">
        <div className="hz-timeline-head">
          <p className="hz-eyebrow">The roadmap</p>
          <h2 className="hz-title">Enquiry to handover.</h2>
        </div>
        <ol className="hz-steps">
          {ROADMAP_STAGES.map((s) => (
            <li key={s.step} className="hz-step">
              <span className="hz-step-dot" aria-hidden="true" />
              <span className="hz-step-num">{s.step}</span>
              <h3 className="hz-step-title">{s.title}</h3>
              <p className="hz-step-sub">{s.subtitle}</p>
              <p className="hz-step-desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </article>

      <article className="hz-panel hz-modules" data-label="Modules">
        <p className="hz-eyebrow">Modules</p>
        <ul className="hz-module-list">
          {FEN1_MODULES.map((m) => (
            <li key={m.id}>
              <span>{m.number}</span>
              {m.name}
            </li>
          ))}
        </ul>
      </article>
    </HShell>
  );
}
