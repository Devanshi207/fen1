"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { columnCount, isOffsetColumn, parallaxOffset, staggerDelay } from "@/lib/stagger";

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
        if (el.getBoundingClientRect().top < limit) {
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
        if (seen.has(el) || el.closest('[role="dialog"], header')) return;
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

    // Parallax layers drift at their own speed while scrolling
    let raf = 0;
    const drift = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
        const speed = Number(el.dataset.speed) || 0;
        el.style.setProperty("--sy", `${parallaxOffset(r.top + r.height / 2, window.innerHeight, speed).toFixed(1)}px`);
      });
    };
    const onScroll = () => {
      check();
      if (!reduce && !raf) raf = requestAnimationFrame(drift);
    };

    // Card spotlight follows the pointer
    const onSpot = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('[class~="bg-[#FFFFFF]"], .journey-card, .stats-bar');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onSpot, { passive: true });

    scan();
    check();
    if (!reduce) drift();
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
      window.removeEventListener("pointermove", onSpot);
      window.clearInterval(tick);
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
