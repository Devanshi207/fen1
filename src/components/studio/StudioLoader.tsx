"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { flyTransform, lockupBox, type Box } from "@/lib/studio";
import Fen1Reveal from "./Fen1Reveal";

const SEEN = "fen1-studio-seen";
const VIDEO = "/media/fen1-intro.mp4";
/** How fast the first visit in a tab plays (later ones play at double speed). */
const FIRST_SPEED = 1.3;

const box = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });

/** Moves and scales the animation so its finished lockup lands exactly on the home page's wordmark (.st-mark). */
function fly(el: Element | null, drawn: boolean) {
  const to = document.querySelector(".st-mark")?.getBoundingClientRect();
  if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;
  if (!to) {
    // no wordmark on this page to land on (the main home page): ease forward and dissolve into the page instead
    el.style.transform = "scale(1.06)";
    return;
  }
  const frame = box(el.getBoundingClientRect());
  // the drawn version marks its lockup with an invisible rect; the video's frame has it at fixed fractions
  const mark = drawn ? el.querySelector("[data-lockup]")?.getBoundingClientRect() : null;
  const from = mark ? box(mark) : lockupBox(frame);
  if (!from.width) return;
  const { origin, transform } = flyTransform(frame, from, box(to));
  el.style.transformOrigin = origin;
  el.style.transform = transform;
}

/**
 * The loading page. It plays the FEN1 animation video (the wordmark built on a blueprint grid), then flies the finished
 * wordmark onto the home page, where it becomes the big wordmark (or, with `instant`, cuts straight to the page). The first load in a tab plays it a little faster than the video's own pace, later
 * ones at double speed. If the video cannot play, the same animation is drawn in code instead. It plays whatever the "reduce motion" setting is: it is the brand intro, and on some Windows machines that setting is on by default.
 */
export default function StudioLoader({ onFly, onDone, instant = false }: { onFly: () => void; onDone: () => void; instant?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [out, setOut] = useState(false);
  const [mode, setMode] = useState<"video" | "drawn">("video");
  const video = useRef<HTMLVideoElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    let first = true;
    try {
      first = !sessionStorage.getItem(SEEN);
    } catch {
      // storage unavailable: treat every load as the first
    }
    let raf = 0;
    let lift = 0;
    let done = 0;
    let stall = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(1);
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {
        // nothing to record
      }
      // a hard cut: the page is there the moment the animation ends
      if (instant) {
        onFly();
        onDone();
        return;
      }
      // hold the finished wordmark for a beat, then fly it onto the page's wordmark while the backdrop fades
      lift = window.setTimeout(() => {
        fly(mode === "video" ? video.current : svg.current, mode === "drawn");
        setOut(true);
        onFly();
        done = window.setTimeout(onDone, 1000);
      }, 350);
    };

    const v = video.current;
    const fallback = () => {
      if (!finished) setMode("drawn");
    };
    if (mode === "video" && v) {
      v.playbackRate = first ? FIRST_SPEED : 2;
      const tick = () => {
        if (v.duration) setProgress(Math.min(v.currentTime / v.duration, 1));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      v.addEventListener("ended", finish);
      v.addEventListener("error", fallback);
      v.play().catch(fallback);
      // a video that never starts (slow network, blocked) must not hold the page back
      stall = window.setTimeout(() => {
        if (v.currentTime === 0) fallback();
      }, 3500);
    } else {
      setProgress(0);
      const total = first ? 4600 / FIRST_SPEED : 2300;
      const begin = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - begin) / total, 1);
        setProgress(t);
        if (t < 1) raf = requestAnimationFrame(step);
        else finish();
      };
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(lift);
      window.clearTimeout(done);
      window.clearTimeout(stall);
      v?.removeEventListener("ended", finish);
      v?.removeEventListener("error", fallback);
    };
  }, [mode, instant, onDone, onFly]);

  // in the body, so it sits above the site header whatever stacking context the page is in
  return createPortal(
    <div className={`st-loader ${out ? "is-out" : ""}`} role="status" aria-label="Loading">
      <div className="st-l-bg" aria-hidden="true" />
      {mode === "video" ? <video ref={video} className="st-l-video" src={VIDEO} muted playsInline preload="auto" aria-hidden="true" /> : <Fen1Reveal progress={progress} svgRef={svg} />}
    </div>,
    document.body
  );
}
