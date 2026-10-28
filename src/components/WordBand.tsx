"use client";

import { useEffect, useRef } from "react";

const WORDS = ["Glass", "Aluminium", "Windows"];

/**
 * Two horizontally scrollable rows of giant outlined words. They slide in opposite directions as the page scrolls,
 * and can also be swiped, dragged or scrolled sideways by hand.
 * Decorative only: hidden from assistive technology, and still when reduced motion is requested.
 */
export default function WordBand() {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = band.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 when the band enters at the bottom of the screen, rising as it travels up
      const travel = (window.innerHeight - r.top) * 0.45;
      el.querySelectorAll<HTMLElement>(".wordband-row").forEach((row, i) => {
        const max = row.scrollWidth - row.clientWidth;
        row.scrollLeft = i === 1 ? Math.max(0, max - travel) : Math.min(max, travel);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    let drag: { row: HTMLElement; x: number; left: number } | null = null;
    const down = (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>(".wordband-row");
      if (row && e.pointerType === "mouse") drag = { row, x: e.clientX, left: row.scrollLeft };
    };
    const move = (e: PointerEvent) => {
      if (drag) drag.row.scrollLeft = drag.left - (e.clientX - drag.x);
    };
    const up = () => (drag = null);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Enough repeats that the row is wider than any screen, whatever the offset
  const row = Array.from({ length: 4 }, () => WORDS).flat();

  return (
    <div ref={band} className="wordband" aria-hidden="true" data-no-reveal>
      {[0, 1].map((r) => (
        <div key={r} className={`wordband-row ${r === 1 ? "is-reverse" : ""}`}>
          {row.map((w, i) => (
            <span key={i} className="wordband-item">
              {w}
              <i className="wordband-dot" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
