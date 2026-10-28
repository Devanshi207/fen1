"use client";

import { useEffect, useRef } from "react";
import { litWords } from "@/lib/scrollwords";

/**
 * A statement whose words light up one by one as it scrolls through the screen, as on the Sleepy Interactions page.
 * The full text is always in the DOM (and readable by assistive technology); only the colour changes.
 * Use "\n" for line breaks.
 */
export default function ScrollWords({ text, className }: { text: string; className?: string }) {
  const box = useRef<HTMLHeadingElement>(null);
  const lines = text.split("\n").map((l) => l.split(" "));
  const total = lines.reduce((n, l) => n + l.length, 0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".scrollword"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // starts as the block's top passes 80% of the screen height, complete when its bottom reaches 45%
      const start = vh * 0.8;
      const end = vh * 0.45;
      const progress = (start - r.top) / Math.max(start - end + r.height, 1);
      const lit = litWords(progress, words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
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
  }, [total]);

  return (
    <h2 ref={box} className={className} data-no-reveal>
      {lines.map((words, li) => (
        <span key={li} className="scrollwords-line">
          {words.map((w, wi) => (
            <span key={wi} className="scrollword">
              {w}{" "}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
