import { useSyncExternalStore } from "react";

/**
 * Which layout the visitor is looking at. ?layout=horizontal switches every page to the sideways version and is kept for
 * the browser tab; ?layout=default switches back. ?home=horizontal is the older link for the home page and still works.
 */
export function resolveLayout(param: string | null, stored: string | null): "horizontal" | "default" {
  if (param === "default") return "default";
  if (param === "horizontal") return "horizontal";
  return stored === "horizontal" ? "horizontal" : "default";
}

const KEY = "fen1-layout";

function read(): "horizontal" | "default" {
  const params = new URLSearchParams(window.location.search);
  const param = params.get("layout") ?? (params.get("home") === "horizontal" ? "horizontal" : null);
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(KEY);
    if (param === "horizontal" || param === "default") sessionStorage.setItem(KEY, param);
  } catch {
    // storage unavailable: the URL parameter still decides for this page view
  }
  return resolveLayout(param, stored);
}

const subscribe = () => () => {};

/** True when the sideways layout should render. Pages call this and return their horizontal version. */
export function useHorizontalLayout(): boolean {
  return useSyncExternalStore(subscribe, () => read() === "horizontal", () => false);
}

/** Scroll progress (0 to 1) at which a panel's left edge reaches the left of the screen. */
export function panelProgress(panelLeft: number, distance: number): number {
  if (distance <= 0) return 0;
  return Math.min(Math.max(panelLeft / distance, 0), 1);
}

/** The panel showing at the middle of the screen: the last one whose left edge is at or before `x`. */
export function panelAt(lefts: number[], x: number): number {
  let found = 0;
  lefts.forEach((left, i) => {
    if (left <= x) found = i;
  });
  return found;
}
