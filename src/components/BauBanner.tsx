"use client";

import { useEffect, useRef } from "react";

/**
 * Home, right of the headline: a 12.6 second silent video (public/video/bau-2027-story-web-720.mp4): we are participating in BAU 2027, the
 * dates, Hall B4 and Stand 527, the official banner exactly as the fair supplied it, "Meet us there" and "Thank you". It always plays by itself, muted and in a loop (browsers allow that without a click). `autoPlay` starts it, and
 * the effect asks again in case the browser held it back, when the page becomes visible again and on the first touch.
 */
export default function BauBanner() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const start = () => {
      try {
        void v.play()?.catch(() => {});
      } catch {
        /* nothing to do: the poster stays */
      }
    };
    start();
    const again = () => v.paused && start();
    document.addEventListener("visibilitychange", again);
    window.addEventListener("pointerdown", again, { once: true });
    v.addEventListener("canplay", again);
    return () => {
      document.removeEventListener("visibilitychange", again);
      window.removeEventListener("pointerdown", again);
      v.removeEventListener("canplay", again);
    };
  }, []);

  return (
    <div className="bau hero-seq" style={{ ["--hs" as string]: "900ms" }}>
      <video ref={video} className="bau-video" autoPlay muted loop playsInline preload="auto" poster="/video/bau-2027-official-poster-1080.jpg" aria-label="We are participating in BAU 2027, 11 to 15 January 2027, Messe München, Hall B4, Stand 527. Meet us there.">
        <source src="/video/bau-2027-story-web-720.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
