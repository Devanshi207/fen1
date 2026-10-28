"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { columnCount, isOffsetColumn, staggerDelay } from "@/lib/stagger";
import { magnetShift } from "@/lib/magnet";

/**
 * Staggered scroll motion. Only the top-most element of each group animates (a card, not the text inside it),
 * and siblings are delayed in sequence so content cascades in as you scroll.
 */
const TARGETS = [
  "main [data-reveal]",
  "main h2",
  "main h3",
  "main p",
  "main ul > li",
  "main table",
  "main form",
  "main details",
  "main .grid > *",
  'main .flex > a[class*="rounded-full"]',
  "footer .grid > *",
].join(", ");

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const page = document.getElementById("page");
    if (page) {
      page.classList.remove("page-in");
      void page.offsetWidth;
      page.classList.add("page-in");
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pending = new Set<HTMLElement>();
    const check = () => {
      const limit = window.innerHeight * 0.94;
      pending.forEach((el) => {
        // Ignore the start offset of staggered columns, or a card that begins lower would wait for extra scrolling.
        const offset = el.classList.contains("reveal-alt") && !el.classList.contains("in") ? 60 : 0;
        if (el.getBoundingClientRect().top - offset < limit) {
          // Work out the delay from the layout as it is right now (columns change with window width).
          if (el.dataset.delay === undefined && el.parentElement) {
            const columns = columnCount(getComputedStyle(el.parentElement).gridTemplateColumns);
            el.style.setProperty("--d", `${staggerDelay(Number(el.dataset.stagger ?? 0), columns)}ms`);
          }
          el.classList.add("in");
          pending.delete(el);
        }
      });
    };

    const seen = new WeakSet<Element>();
    const scan = () => {
      const fresh: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
        if (seen.has(el) || el.closest('[role="dialog"], header, [data-no-reveal]')) return;
        // Animate the card, not the text inside it (unless the inner element asks for its own reveal).
        const own = el.hasAttribute("data-reveal");
        if (!own && el.parentElement?.closest(".reveal")) return;

        seen.add(el);
        const parent = el.parentElement;
        const group = parent ? Array.from(parent.children).filter((c) => c.matches(TARGETS)) : [el];
        const index = Math.max(0, group.indexOf(el));
        const columns = parent ? columnCount(getComputedStyle(parent).gridTemplateColumns) : 1;

        const custom = el.dataset.delay;
        el.dataset.stagger = String(index);
        el.style.setProperty("--d", `${custom !== undefined ? Number(custom) : staggerDelay(index, columns)}ms`);
        // Tagging must not itself animate: switch the transition off, apply the hidden start state, then restore it.
        el.style.transition = "none";
        if (isOffsetColumn(index, columns)) el.classList.add("reveal-alt");
        el.classList.add("reveal");
        pending.add(el);
        fresh.push(el);
      });
      if (fresh.length) {
        void document.body.offsetWidth; // flush styles once for the whole batch
        fresh.forEach((el) => el.style.removeProperty("transition"));
      }
    };

    const onScroll = () => check();

    // Pill buttons lean toward the mouse
    const MAGNETIC = 'main a[class*="rounded-full"], header a[class*="rounded-full"]';
    let leaning: HTMLElement | null = null;
    const release = () => {
      if (leaning) leaning.style.removeProperty("transform");
      leaning = null;
    };
    const onMagnet = (e: PointerEvent) => {
      if (reduce || e.pointerType !== "mouse") return;
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (leaning && leaning !== target) release();
      if (!target) return;
      leaning = target;
      const { x, y } = magnetShift({ x: e.clientX, y: e.clientY }, target.getBoundingClientRect());
      target.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    window.addEventListener("pointermove", onMagnet, { passive: true });
    document.documentElement.addEventListener("mouseleave", release);

    scan();
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const tick = window.setInterval(check, 250);
    let t: number | undefined;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        scan();
        check();
      }, 60);
    });
    mo.observe(document.getElementById("page") ?? document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
        window.clearInterval(tick);
      window.removeEventListener("pointermove", onMagnet);
      document.documentElement.removeEventListener("mouseleave", release);
      release();
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
