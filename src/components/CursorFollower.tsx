"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a, button, summary, [role="button"], input, select, textarea, label, [data-cursor]';

/**
 * A soft ring that trails the mouse and swells over anything clickable. It is added to the normal cursor, never
 * instead of it, and only exists for devices with a precise pointer (so not on phones or tablets). It is drawn with
 * `mix-blend-mode: difference`, which keeps it visible on both the pale page and the dark photo slabs.
 */
export default function CursorFollower() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;
    if (!window.matchMedia("(pointer: fine)").matches || !window.matchMedia("(hover: hover)").matches) return;

    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;

    const loop = () => {
      // The ring eases toward the pointer; the dot is exact.
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      ringEl.dataset.on = "true";
      dotEl.dataset.on = "true";
      const hot = (e.target as Element | null)?.closest(INTERACTIVE);
      ringEl.dataset.hot = hot ? "true" : "false";
    };
    const onLeave = () => {
      ringEl.dataset.on = "false";
      dotEl.dataset.on = "false";
    };
    const onDown = () => (ringEl.dataset.down = "true");
    const onUp = () => (ringEl.dataset.down = "false");

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" data-on="false" data-hot="false" data-down="false" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" data-on="false" />
    </>
  );
}
