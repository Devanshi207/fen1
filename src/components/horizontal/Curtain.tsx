"use client";

import { useEffect, useRef, useState } from "react";
import { GALLERY } from "@/data/gallery";
import Mark from "./Mark";

const REDUCE = "(prefers-reduced-motion: reduce)";
const SEEN = "fen1-hz-seen";

type Phase = "count" | "grow" | "out";

/**
 * The loading page. The first one in a browser tab counts 000 to 100 slowly; after that it is a short wipe that names the
 * page you are going to. Either way the photo in the wordmark opens up as the count climbs, then grows to fill the screen
 * and the curtain slides away.
 */
export default function Curtain({ left, right, size, start = 0, onDone }: { left: string; right: string; size?: string; start?: number; onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<Phase>("count");
  const slot = useRef<HTMLSpanElement>(null);
  const [cover, setCover] = useState<string>();

  useEffect(() => {
    const reduce = window.matchMedia(REDUCE).matches;
    let first = true;
    try {
      first = !sessionStorage.getItem(SEEN);
    } catch {
      // storage unavailable: treat every load as the first
    }
    const total = reduce ? 400 : first ? 2600 : 950;
    const begin = performance.now();
    const timers: number[] = [];
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - begin) / total, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 2.2)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {
        // nothing to record
      }
      const el = slot.current;
      if (reduce || !el) {
        setPhase("out");
        timers.push(window.setTimeout(onDone, 60));
        return;
      }
      // the photo grows from where it sits to cover the whole screen
      const r = el.getBoundingClientRect();
      const scale = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.05;
      const dx = window.innerWidth / 2 - (r.left + r.width / 2);
      const dy = window.innerHeight / 2 - (r.top + r.height / 2);
      setCover(`translate(${dx}px, ${dy}px) scale(${scale})`);
      setPhase("grow");
      timers.push(window.setTimeout(() => setPhase("out"), 850));
      timers.push(window.setTimeout(onDone, 850 + 750));
    };
    raf = requestAnimationFrame(step);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.style.overflow = prev;
    };
  }, [onDone]);

  const slotStyle: React.CSSProperties =
    phase === "count"
      ? { width: `${(pct / 100) * 0.72}em`, marginInline: `${(pct / 100) * 0.05}em` }
      : { width: "0.72em", marginInline: "0.05em", transform: cover, transition: "transform 0.85s var(--ease)", zIndex: 5 };

  return (
    <div className={`hz-loader is-${phase}`} role="status" aria-label={`Loading ${pct} percent`}>
      <Mark loading left={left} right={right} size={size} start={start} slotRef={slot} slotStyle={slotStyle} shown={Math.min(Math.floor(pct / 25), GALLERY.length - 1)} />
      <p className="hz-loader-count" aria-hidden="true">
        {String(pct).padStart(3, "0")}
      </p>
      <p className="hz-loader-tag" aria-hidden="true">
        FEN1 ERP
      </p>
      <span className="hz-loader-bar" style={{ transform: `scaleX(${pct / 100})` }} aria-hidden="true" />
    </div>
  );
}
