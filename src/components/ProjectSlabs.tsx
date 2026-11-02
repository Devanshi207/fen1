"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GALLERY } from "@/data/gallery";
import { revealOnce } from "@/lib/inview";

/**
 * The industry photography, one feature at a time. Each photo is revealed by a clean directional mask (from the left,
 * then from the right) while it settles from 1.03 to 1.0, and its label, title, note and link enter one after another
 * afterwards. Nothing is pinned or tied to the scroll position: an IntersectionObserver adds `is-in` once per feature.
 * The look and motion are in app/motion.css (`.feat-*`).
 */
export default function ProjectSlabs() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const features = Array.from(wrap.current?.children ?? []);
    return revealOnce(features, (el) => el.classList.add("is-in"), { rootMargin: "0px 0px -18% 0px" });
  }, []);

  return (
    <section id="gallery" data-chapter="Gallery" className="slabs-section">
      <div className="slabs-intro max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="slabs-eyebrow tech">Built for the fenestration industry</span>
        <h2 className="slabs-heading">FROM GLASS SHEET TO FINISHED WINDOW.</h2>
        <p className="slabs-lede">Every glass sheet, aluminium profile and site install runs through one connected system.</p>
      </div>

      <div ref={wrap} data-no-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {GALLERY.map((g, i) => (
          <article key={g.title} className={`feat ${i % 2 ? "feat-flip" : ""}`} aria-label={g.title}>
            <div className="feat-media">
              <div className="feat-img">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 900px) 58vw, 100vw"
                  className="object-cover"
                  style={g.position ? { objectPosition: g.position } : undefined}
                  priority={false}
                />
              </div>
            </div>
            <div className="feat-copy">
              <p className="feat-num tech" style={{ ["--i" as string]: 0 }}>
                {String(i + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
              </p>
              <h3 className="feat-title" style={{ ["--i" as string]: 1 }}>
                {g.title}
              </h3>
              <p className="feat-note" style={{ ["--i" as string]: 2 }}>
                {g.note}
              </p>
              <Link href={`#${g.solution}`} className="feat-link" style={{ ["--i" as string]: 3 }}>
                <span className="feat-link-line" aria-hidden="true" />
                See the solution <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
