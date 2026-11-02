"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const subscribe = () => () => {};
const armed = () => !!document.documentElement.dataset.intro;

/** Remembered for the tab's session, so the splash plays on the first visit only (see HOME_FLAG in app/layout). */
export const INTRO_SEEN = "fen1-intro-seen";
/** How long the finished mark is on screen before it fades (the whole splash is about 1.3s). */
const SHOW_MS = 1000;
const FADE_MS = 300;

/**
 * The opening splash for the home page: the FEN1 logo is wiped in from the left and a fine progress line runs beneath it.
 * About 1.3s in all, CSS only. A small script in app/layout marks a first visit (data-intro) and puts a cover over the page
 * from first paint, so the home page never shows before the splash; the hero sequence behind it is paused until it leaves.
 * It does not play again for the rest of the tab's session, and never on navigation between pages.
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
      <div className="intro-lockup">
        <Image src="/brand/fen1-logo.png" alt="" width={900} height={294} priority sizes="22rem" className="intro-logo" />
        <span className="intro-track" aria-hidden="true">
          <span className="intro-bar" />
        </span>
      </div>
    </div>,
    document.body
  );
}
