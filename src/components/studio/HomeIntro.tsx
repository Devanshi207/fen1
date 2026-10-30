"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import StudioLoader from "./StudioLoader";
import "./studio.css";

const subscribe = () => () => {};
const armed = () => !!document.documentElement.dataset.intro;

/**
 * The opening animation for the home page. A small script in app/layout marks the page (data-intro) on a fresh load of "/",
 * so this plays when the site is opened or reloaded, not when moving back to Home from another page. The script also puts a
 * cover over the page from first paint, so the home page never shows before the animation starts.
 */
export default function HomeIntro() {
  const playing = useSyncExternalStore(subscribe, armed, () => false);
  const [done, setDone] = useState(false);
  // the animation cuts straight to the page when it ends, so there is nothing to do when it would start flying
  const noop = useCallback(() => {}, []);
  const finish = useCallback(() => {
    delete document.documentElement.dataset.intro;
    document.getElementById("fen1-cover")?.remove();
    setDone(true);
  }, []);

  // once the loader is on screen it covers the page itself, so the early cover can go
  useEffect(() => {
    if (!playing) return;
    document.documentElement.dataset.intro = "playing";
    document.getElementById("fen1-cover")?.remove();
  }, [playing]);

  if (!playing || done) return null;
  return <StudioLoader instant onFly={noop} onDone={finish} />;
}
