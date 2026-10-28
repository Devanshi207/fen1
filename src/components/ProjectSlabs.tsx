"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GALLERY } from "@/data/gallery";
import { arrival, cover } from "@/lib/slabs";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Full-screen photo slabs that stack over one another as you scroll. Each photo starts tilted and straightens as its
 * slab arrives, the outlined title fills in, and the slab underneath recedes when the next one covers it.
 * The scroll-linked values are written to `--sp` (arrival) and `--cover` on each slab; the look is all CSS (`.slab-*`).
 */
export default function ProjectSlabs() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);

  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    const slabs = Array.from(root.querySelectorAll<HTMLElement>(".slab"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      slabs.forEach((slab, i) => {
        const top = slab.getBoundingClientRect().top;
        const nextTop = i < slabs.length - 1 ? slabs[i + 1].getBoundingClientRect().top : null;
        slab.style.setProperty("--sp", arrival(top, vh).toFixed(3));
        slab.style.setProperty("--cover", cover(nextTop, vh).toFixed(3));
      });
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
  }, []);

  return (
    <section id="gallery" data-chapter="Gallery" data-no-reveal className="slabs-section">
      <div className="slabs-intro max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="slabs-eyebrow">Built for the fenestration industry</span>
        <h2 className="slabs-heading">FROM GLASS SHEET TO FINISHED WINDOW.</h2>
        <p className="slabs-lede">Every glass sheet, aluminium profile and site install runs through one connected system.</p>
      </div>

      <div ref={wrap} data-reduce={reduce || undefined} className="slabs">
        {GALLERY.map((g, i) => (
          <article key={g.title} className="slab" aria-label={g.title}>
            <div className="slab-inner">
              <div className="slab-img">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={g.position ? { objectPosition: g.position } : undefined}
                  priority={i === 0}
                />
              </div>
              <div className="slab-shade" aria-hidden="true" />

              <h3 className="slab-title" aria-label={g.title}>
                <span className="slab-outline" aria-hidden="true">
                  {g.title}
                </span>
                <span className="slab-fill" aria-hidden="true">
                  {g.title}
                </span>
              </h3>

              <div className="slab-meta">
                <p className="slab-count">
                  <span>{String(i + 1).padStart(2, "0")}</span> / {String(GALLERY.length).padStart(2, "0")}
                </p>
                <p className="slab-note">{g.note}</p>
                <Link href={`/solutions#${g.solution}`} className="slab-link">
                  <span className="slab-link-line" aria-hidden="true" />
                  See the solution <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="slabs-credit">Photography via Unsplash</p>
    </section>
  );
}
