/**
 * One place for viewport-triggered motion. Everything that reveals on scroll uses an IntersectionObserver, so
 * nothing polls on a timer or reads layout while the page moves.
 * Where IntersectionObserver does not exist (very old browsers, the test environment) callers are told at once,
 * so content is never left hidden.
 */

export interface InViewOptions {
  /** Shrinks (negative) or grows the viewport the element is judged against. Default: a little before the bottom edge. */
  rootMargin?: string;
  /** Fraction of the element that must show. */
  threshold?: number;
}

/**
 * Calls `onEnter` the first time each element scrolls into view, then stops watching it. One observer serves the
 * whole list. Returns a cleanup that disconnects it.
 *
 * An observer only reports what is on screen when a frame is drawn, so content that is jumped over (the End key, an
 * anchor link, a dragged scrollbar, a reload part-way down the page) would never be reported and would stay hidden when
 * the visitor scrolled back to it. So an element that is already above the screen counts as seen, both when watching
 * starts and, once scrolling settles (the `scrollend` event; a short debounce where it does not exist), for anything
 * left behind. That is one cheap check after each scroll, not work on every scroll event.
 */
export function revealOnce(elements: Iterable<Element>, onEnter: (el: Element) => void, { rootMargin = "0px 0px -6% 0px", threshold = 0 }: InViewOptions = {}): () => void {
  const list = Array.from(elements);
  if (typeof IntersectionObserver === "undefined") {
    list.forEach(onEnter);
    return () => {};
  }
  const pending = new Set(list);
  const fire = (el: Element) => {
    if (!pending.delete(el)) return;
    io.unobserve(el);
    onEnter(el);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const above = !entry.isIntersecting && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0);
        if (entry.isIntersecting || above) fire(entry.target);
      }
    },
    { rootMargin, threshold }
  );
  list.forEach((el) => io.observe(el));

  const settle = () => pending.forEach((el) => el.getBoundingClientRect().bottom <= 0 && fire(el));
  let timer: number | undefined;
  const native = "onscrollend" in window;
  const onScroll = native ? settle : () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(settle, 150);
  };
  window.addEventListener(native ? "scrollend" : "scroll", onScroll, { passive: true });
  return () => {
    io.disconnect();
    window.removeEventListener(native ? "scrollend" : "scroll", onScroll);
    window.clearTimeout(timer);
  };
}

/**
 * Reports which element currently crosses a thin band in the middle of the screen (the "active" one), calling
 * `onChange` only when that changes. Used for the workflow timeline and the chapter rail.
 */
export function watchCentre(elements: Element[], onChange: (el: Element) => void): () => void {
  if (typeof IntersectionObserver === "undefined" || elements.length === 0) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) onChange(entry.target);
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  elements.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** True when the visitor has asked their system for less motion. */
export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
