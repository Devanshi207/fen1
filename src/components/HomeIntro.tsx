"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const armed = () => !!document.documentElement.dataset.intro;

/** Remembered for the tab's session, so the splash plays on the first visit only (see HOME_FLAG in app/layout). */
export const INTRO_SEEN = "fen1-intro-seen";
/** How long the finished mark is on screen before it fades (the whole splash is about 1.3s). */
const SHOW_MS = 1000;
const FADE_MS = 300;

/** The letters of the wordmark as plain rectangles and one diagonal, in a 300-wide drawing box (x 324-744, y 248-428). */
const LETTERS: { key: string; shapes: React.ReactNode }[] = [
  {
    key: "F",
    shapes: (
      <>
        <rect x="324" y="248" width="36" height="180" />
        <rect x="360" y="248" width="80" height="34" />
        <rect x="360" y="322" width="64" height="32" />
      </>
    ),
  },
  {
    key: "E",
    shapes: (
      <>
        <rect x="462" y="248" width="36" height="180" />
        <rect x="498" y="248" width="82" height="34" />
        <rect x="498" y="322" width="66" height="32" />
        <rect x="498" y="394" width="82" height="34" />
      </>
    ),
  },
  {
    key: "N",
    shapes: (
      <>
        <rect x="612" y="248" width="36" height="180" />
        <polygon points="648,248 710,428 648,286" />
        <rect x="708" y="248" width="36" height="180" />
      </>
    ),
  },
];
/** The outline of the "1": flag, stem and foot as one closed line, so it can be drawn. */
const ONE = "M774 282 L800 248 H836 V396 H860 V428 H776 V396 H800 V282 Z";

/**
 * The opening splash for the home page: FEN appears with a subtle rise, the "1" is drawn as a technical line and
 * then filled, and a fine progress line runs underneath. About 1.3s in all, CSS only. A small script in app/layout
 * marks a first visit (data-intro) and puts a cover over the page from first paint, so the home page never shows
 * before the splash; the hero sequence behind it is paused until it leaves. It does not play again for the rest of
 * the tab's session, and never on navigation between pages.
 */
export default function HomeIntro() {
  const playing = useSyncExternalStore(subscribe, armed, () => false);
  const [out, setOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const root = document.documentElement;
    root.dataset.intro = "playing";
    // the splash is on screen now and covers the page itself, so the early cover can go
    document.getElementById("fen1-cover")?.remove();
    try {
      sessionStorage.setItem(INTRO_SEEN, "1");
    } catch {
      // storage unavailable: it will simply play again next time
    }
    const fade = window.setTimeout(() => setOut(true), SHOW_MS);
    const end = window.setTimeout(() => {
      delete root.dataset.intro;
      setDone(true);
    }, SHOW_MS + FADE_MS);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(end);
    };
  }, [playing]);

  if (!playing || done) return null;
  return createPortal(
    <div className={`intro ${out ? "is-out" : ""}`} role="status" aria-label="Loading FEN1">
      <svg className="intro-mark" viewBox="300 226 584 270" aria-hidden="true" fill="currentColor" style={{ color: "var(--ink)" }}>
        {LETTERS.map((l, i) => (
          <g key={l.key} className="intro-letter" style={{ ["--i" as string]: i }}>
            {l.shapes}
          </g>
        ))}
        <path className="intro-one-fill" d={ONE} />
        <path className="intro-one-line" d={ONE} pathLength={1} />
        <rect className="intro-bar-track" x="324" y="462" width="536" height="2" />
        <rect className="intro-bar" x="324" y="462" width="536" height="2" />
      </svg>
    </div>,
    document.body
  );
}
