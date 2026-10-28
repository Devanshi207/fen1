"use client";

import { useEffect, useRef } from "react";

const WORDS = ["Glass", "Aluminium", "Windows"];

/**
 * Two rows of giant outlined words that slide in opposite directions as the page scrolls.
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
      el.style.setProperty("--bx", `${((window.innerHeight - r.top) * 0.45).toFixed(1)}px`);
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
