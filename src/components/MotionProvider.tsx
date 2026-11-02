"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { columnCount, isOffsetColumn, staggerDelay } from "@/lib/stagger";
import { revealOnce } from "@/lib/inview";

/**
 * Staggered scroll motion. Only the top-most element of each group animates (a card, not the text inside it),
 * and siblings are delayed in sequence so content cascades in as you scroll.
 * Elements are tagged once, then an IntersectionObserver adds `.in` the first time each one nears the viewport.
 * Nothing polls and no work happens per scroll event; an element that has appeared never animates again.
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
  // the route fade is for moving between pages; the first load has its own sequence (splash, then the hero)
  const firstLoad = useRef(true);

  useEffect(() => {
    // A short fade (with a few pixels of lift) each time the route changes; the header and footer stay put.
    const page = document.getElementById("page");
    if (page && !firstLoad.current) {
      page.classList.remove("page-in");
      void page.offsetWidth;
      page.classList.add("page-in");
    }

    firstLoad.current = false;

    const seen = new WeakSet<Element>();
    let stop = () => {};
    const watch = new Set<HTMLElement>();

    const enter = (el: Element) => {
      const node = el as HTMLElement;
      // Work out the delay from the layout as it is right now (columns change with window width).
      if (node.dataset.delay === undefined && node.parentElement) {
        const columns = columnCount(getComputedStyle(node.parentElement).gridTemplateColumns);
        node.style.setProperty("--d", `${staggerDelay(Number(node.dataset.stagger ?? 0), columns)}ms`);
      }
      node.classList.add("in");
      watch.delete(node);
    };

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
        watch.add(el);
        fresh.push(el);
      });
      if (fresh.length) {
        void document.body.offsetWidth; // flush styles once for the whole batch
        fresh.forEach((el) => el.style.removeProperty("transition"));
        const previous = stop;
        const next = revealOnce(fresh, enter);
        stop = () => {
          previous();
          next();
        };
      }
    };

    scan();
    // Content that appears later (a form that swaps its fields, a dialog) is tagged when it arrives.
    let t: number | undefined;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(scan, 60);
    });
    mo.observe(document.getElementById("page") ?? document.body, { childList: true, subtree: true });

    return () => {
      stop();
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
