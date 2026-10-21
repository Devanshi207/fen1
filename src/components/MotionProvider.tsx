"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGETS =
  'main [data-reveal], main section, main [class~="bg-[#FFFFFF]"], main [class~="bg-[#F7FAFF]"], main h2, main h3, main table, main form, footer > div';

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const page = document.getElementById("page");
    if (page) {
      page.classList.remove("page-in");
      void page.offsetWidth;
      page.classList.add("page-in");
    }

    const pending = new Set<Element>();
    const check = () => {
      const limit = window.innerHeight * 0.94;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add("in");
          pending.delete(el);
        }
      });
    };

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(TARGETS).forEach((el) => {
        if (seen.has(el) || el.closest('[role="dialog"], header, .reveal .reveal')) return;
        const own = (el as HTMLElement).hasAttribute("data-reveal");
        if (!own && el.parentElement?.closest(".reveal") && el.matches("section, h2, h3")) return;
        if (!own && el.matches("section") && el.querySelector("[data-reveal]")) return;
        seen.add(el);
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const i = Math.max(0, siblings.indexOf(el));
        const custom = (el as HTMLElement).dataset.delay;
        (el as HTMLElement).style.setProperty("--d", `${custom !== undefined ? Number(custom) : Math.min(i, 8) * 70}ms`);
        el.classList.add("reveal");
        pending.add(el);
      });
    };

    // Card spotlight follows the pointer
    const onSpot = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('[class~="bg-[#FFFFFF]"], .journey-card, .dept-panel, .stats-bar');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onSpot, { passive: true });

    scan();
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
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
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.removeEventListener("pointermove", onSpot);
      window.clearInterval(tick);
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
