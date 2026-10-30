import { useSyncExternalStore } from "react";

/**
 * Which home page the visitor sees. ?home=studio shows the oversized-wordmark home page and is kept for the browser tab;
 * ?home=default switches back. (?home=horizontal belongs to the sideways layout and is ignored here.)
 */
export function resolveHome(param: string | null, stored: string | null): "studio" | "default" {
  if (param === "default") return "default";
  if (param === "studio") return "studio";
  return stored === "studio" ? "studio" : "default";
}

const KEY = "fen1-home";

function read(): "studio" | "default" {
  const param = new URLSearchParams(window.location.search).get("home");
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(KEY);
    if (param === "studio" || param === "default") sessionStorage.setItem(KEY, param);
  } catch {
    // storage unavailable: the URL parameter still decides for this page view
  }
  return resolveHome(param, stored);
}

const subscribe = () => () => {};

/** True when the studio home page should render. */
export function useStudioHome(): boolean {
  return useSyncExternalStore(subscribe, () => read() === "studio", () => false);
}

/** How far (0 to 1) a section has been read: 0 when its top meets the bottom of the screen, 1 when its bottom meets the top. */
export function readProgress(top: number, height: number, viewport: number): number {
  const span = height + viewport;
  if (span <= 0) return 0;
  return Math.min(Math.max((viewport - top) / span, 0), 1);
}

/** The ease for the loading counter: slow start, quick middle, slow finish. */
export function countEase(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return 0.5 - Math.cos(Math.PI * c) / 2;
}

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
/** Progress (0 to 1) of one step that runs between `start` and `end` of the whole animation, eased. */
export function subProgress(progress: number, start: number, end: number, ease: (t: number) => number = easeOutCubic): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return ease((progress - start) / (end - start));
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Where the finished FEN1 lockup sits inside the 1200 x 675 drawing (and so inside the video), as fractions of its frame. */
export const LOCKUP = { x: 324 / 1200, y: 229 / 675, w: 536 / 1200, h: 199 / 675 };

/** The lockup's box on screen, given the box a full frame of the animation occupies. */
export function lockupBox(frame: Box): Box {
  return { left: frame.left + frame.width * LOCKUP.x, top: frame.top + frame.height * LOCKUP.y, width: frame.width * LOCKUP.w, height: frame.height * LOCKUP.h };
}

/** The CSS that moves and scales `frame` so its lockup (`from`) lands exactly on `to`. */
export function flyTransform(frame: Box, from: Box, to: Box): { origin: string; transform: string } {
  const fx = from.left + from.width / 2;
  const fy = from.top + from.height / 2;
  return {
    origin: `${fx - frame.left}px ${fy - frame.top}px`,
    transform: `translate(${to.left + to.width / 2 - fx}px, ${to.top + to.height / 2 - fy}px) scale(${to.width / from.width})`,
  };
}
