"use client";

import Image from "next/image";
import { GALLERY } from "@/data/gallery";
import { useOnScreen } from "@/lib/useOnScreen";

/** The photograph the drawing resolves into: slim aluminium-framed glazing. */
const PHOTO = GALLERY.find((g) => g.solution === "windows-doors") ?? GALLERY[0];

/** A line of the drawing and when it starts (seconds after the section scrolls into view). */
const line = (d: string, k: number, extra = "") => <path className={`wd-line ${extra}`} d={d} pathLength={1} style={{ ["--k" as string]: k }} />;

/**
 * The signature FEN1 animation. When the section scrolls into view, an aluminium window is drawn in fine
 * engineering lines (frame, sashes and glass, then the width and height dimensions, then a section through the
 * profile with its connection points), and the drawing then resolves into a photograph of a finished frame.
 * Plain SVG and CSS animations, started once by an IntersectionObserver; the rules live in app/motion.css.
 * The dimension labels are letters (W, H), not numbers, because this is an illustration of the process, not a spec.
 */
export default function WindowDrawing() {
  const [ref, seen] = useOnScreen<HTMLDivElement>({ threshold: 0.35, rootMargin: "0px" });

  return (
    <section id="drawing" className="py-16 sm:py-24">
      <div className="wd-wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4">
          <p className="wd-eyebrow tech">Profile to product</p>
          <h2 className="text-3xl sm:text-4xl leading-[1.1] tracking-tight text-[#34434A]">From profile drawing to finished window</h2>
          <p className="text-base text-[#5B6B73] max-w-md leading-relaxed">
            Profile sections, frame dimensions and joint details are defined once, then carried through estimation, cutting lists and production to the finished unit.
          </p>
        </div>

        <div ref={ref} className={`wd ${seen ? "is-in" : ""}`} data-no-reveal>
          <figure className="wd-stage" aria-label="An aluminium window drawing that resolves into a photograph of a finished frame">
            <div className="wd-photo">
              <Image src={PHOTO.src} alt={PHOTO.alt} fill sizes="(min-width: 900px) 58vw, 100vw" className="object-cover" style={{ objectPosition: PHOTO.position }} />
            </div>
            <svg className="wd-svg" viewBox="0 0 600 400" role="img" aria-label="Technical drawing of an aluminium window">
              {/* frame elevation: outer frame, inner frame, mullion, two sashes with their glass */}
              {line("M30 40H320V310H30Z", 0)}
              {line("M44 54H306V296H44Z", 0.15)}
              {line("M169 54V296M181 54V296", 0.3)}
              {line("M52 62H161V288H52Z", 0.45)}
              {line("M189 62H298V288H189Z", 0.55)}
              {line("M64 74H149V276H64Z", 0.7, "thin")}
              {line("M201 74H286V276H201Z", 0.8, "thin")}
              <g className="wd-fade" style={{ ["--k" as string]: 1 }}>
                <path className="wd-line thin" d="M149 74L64 175L149 276M201 74L286 175L201 276" style={{ strokeDasharray: "4 4", strokeDashoffset: 0 }} />
              </g>

              {/* width and height dimensions */}
              {line("M30 310V344M320 310V344M30 338H320M30 332V344M320 332V344", 1.1, "accent")}
              {line("M320 40H354M320 310H354M348 40V310M342 40H354M342 310H354", 1.3, "accent")}
              <text x="175" y="362" textAnchor="middle" style={{ ["--k" as string]: 1.6 }}>W</text>
              <text x="368" y="179" textAnchor="start" style={{ ["--k" as string]: 1.7 }}>H</text>

              {/* the section callout */}
              {line("M320 175L370 170", 1.8, "accent")}
              {line("M570 170A100 100 0 1 0 370 170A100 100 0 1 0 570 170Z", 1.9, "thin")}
              {line("M418 105H450V235H418Z", 2.1)}
              {line("M458 105H490V235H458Z", 2.2)}
              <rect className="wd-fill wd-fade" x="450" y="115" width="8" height="110" style={{ ["--k" as string]: 2.5 }} />
              {line("M425 118H443V160H425ZM425 172H443V222H425ZM465 118H483V190H465Z", 2.4, "thin")}
              {line("M490 135L504 142V198L490 205", 2.5)}
              {line("M510 100V240M520 100V240M510 108H520M510 232H520", 2.6)}

              {/* connection points: the frame corners and the mullion joints */}
              {[
                [30, 40],
                [320, 40],
                [30, 310],
                [320, 310],
                [175, 54],
                [175, 296],
              ].map(([x, y], i) => (
                <circle key={i} className="wd-dot" cx={x} cy={y} r="4.5" style={{ ["--k" as string]: 2.9 + i * 0.1 }} />
              ))}

              {/* labels */}
              <text x="175" y="26" textAnchor="middle" style={{ ["--k" as string]: 3.2 }}>FRAME ELEVATION</text>
              <text className="opt" x="30" y="26" textAnchor="start" style={{ ["--k" as string]: 3.3 }}>JOINT</text>
              <text x="470" y="56" textAnchor="middle" style={{ ["--k" as string]: 3.3 }}>SECTION A-A</text>
              {line("M454 235V300", 3.2, "thin")}
              <text x="454" y="316" textAnchor="middle" style={{ ["--k" as string]: 3.4 }}>THERMAL BREAK</text>
              {line("M515 240L545 300", 3.3, "thin")}
              <text className="opt" x="548" y="316" textAnchor="middle" style={{ ["--k" as string]: 3.5 }}>GLAZING</text>
            </svg>
          </figure>
        </div>
      </div>
    </section>
  );
}
