"use client";

import { useEffect, useRef, useState } from "react";
import { panelAt, panelProgress } from "@/lib/horizontal";

const REDUCE = "(prefers-reduced-motion: reduce)";
const NO_DRAG = "a, button, input, select, textarea, label, [role='dialog']";

/**
 * The sideways page. Vertical scrolling drives a horizontal track of panels (children with class `hz-panel`).
 * It also gives the track its interactions: drag to scroll, arrow keys, a clickable chapter bar, panels that drift at
 * their own speed (`[data-speed]`), a slight lean when you scroll fast, tilting cards (`.hz-tilt`) and a pointer-driven
 * `--mx/--my` for anything that should follow the cursor. Links to `#id` inside the track glide to that spot.
 */
export default function HScroll({ children, ready }: { children: React.ReactNode; ready: boolean }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const goTo = useRef<(i: number) => void>(() => {});
  const [labels, setLabels] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sec = section.current;
    const st = stage.current;
    const tr = track.current;
    if (!sec || !st || !tr) return;
    const reduce = window.matchMedia(REDUCE).matches;
    const panels = Array.from(tr.querySelectorAll<HTMLElement>(":scope > .hz-panel"));
    setLabels(panels.map((p) => p.dataset.label ?? ""));

    let dist = 0;
    let cur = 0;
    let raf = 0;
    let lefts: number[] = [];
    let lastActive = -1;

    const secTop = () => sec.getBoundingClientRect().top + window.scrollY;
    const travelPx = () => sec.offsetHeight - window.innerHeight;
    const measure = () => {
      // measured to the end of the last panel: the outlined background words spill past it and must not count
      const last = panels[panels.length - 1];
      dist = last ? Math.max(last.offsetLeft + last.offsetWidth - window.innerWidth, 0) : 0;
      // the page is as tall as the track is wide, so one scroll step is about one step sideways
      sec.style.height = `${dist + window.innerHeight}px`;
      lefts = panels.map((p) => p.offsetLeft);
    };
    const targetNow = () => {
      const travel = travelPx();
      const p = travel > 0 ? Math.min(Math.max(-sec.getBoundingClientRect().top / travel, 0), 1) : 0;
      sec.style.setProperty("--hp", p.toFixed(4));
      return p * dist;
    };
    const tick = () => {
      raf = 0;
      const target = targetNow();
      const gap = target - cur;
      cur = reduce ? target : cur + gap * 0.14;
      if (Math.abs(target - cur) < 0.4) cur = target;
      tr.style.transform = `translate3d(${-cur}px,0,0)`;
      // how hard the page is moving: panels lean into it
      st.style.setProperty("--v", reduce ? "0" : Math.max(-1, Math.min(1, (target - cur) / 260)).toFixed(3));
      panels.forEach((p, i) => {
        p.style.setProperty("--d", reduce ? "0" : (lefts[i] + p.offsetWidth / 2 - cur - window.innerWidth / 2).toFixed(1));
      });
      const a = panelAt(lefts, cur + window.innerWidth * 0.5);
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
      if (cur !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const remeasure = () => {
      measure();
      kick();
    };
    const smooth = (): ScrollBehavior => (reduce ? "auto" : "smooth");

    const goToPanel = (i: number) => {
      const index = Math.min(Math.max(i, 0), panels.length - 1);
      window.scrollTo({ top: secTop() + panelProgress(lefts[index], dist) * travelPx(), behavior: smooth() });
    };
    goTo.current = goToPanel;
    const goToElement = (el: HTMLElement) => {
      const left = el.getBoundingClientRect().left + cur - window.innerWidth * 0.08;
      window.scrollTo({ top: secTop() + panelProgress(left, dist) * travelPx(), behavior: smooth() });
    };
    const goToHash = (hash: string) => {
      const el = hash.length > 1 ? tr.querySelector<HTMLElement>(`#${CSS.escape(hash.slice(1))}`) : null;
      if (el) goToElement(el);
      return !!el;
    };

    // Links to #something on this page: glide along the track instead of scrolling the page to the element
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.pathname !== window.location.pathname || !a.hash) return;
      if (goToHash(a.hash)) {
        e.preventDefault();
        e.stopPropagation();
        window.history.pushState(null, "", a.hash);
      }
    };

    // Drag to scroll (mouse only; touch already scrolls the page)
    let drag: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || (e.target as Element).closest(NO_DRAG)) return;
      drag = { x: e.clientX, y: window.scrollY };
      st.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      const nx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      st.style.setProperty("--mx", nx.toFixed(3));
      st.style.setProperty("--my", ny.toFixed(3));
      if (drag) {
        const ratio = dist > 0 ? travelPx() / dist : 1;
        window.scrollTo({ top: drag.y - (e.clientX - drag.x) * ratio * 1.4, behavior: "auto" });
      }
      const card = (e.target as Element).closest<HTMLElement>(".hz-tilt");
      st.querySelectorAll<HTMLElement>(".hz-tilt.is-tilting").forEach((el) => {
        if (el !== card) {
          el.classList.remove("is-tilting");
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        }
      });
      if (card && !reduce) {
        const r = card.getBoundingClientRect();
        card.classList.add("is-tilting");
        card.style.setProperty("--rx", `${(((e.clientX - r.left) / r.width) * 2 - 1) * 7}deg`);
        card.style.setProperty("--ry", `${(((e.clientY - r.top) / r.height) * 2 - 1) * -7}deg`);
      }
    };
    const onUp = () => {
      drag = null;
      st.classList.remove("is-dragging");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target;
      if (t instanceof Element && t.closest("input, textarea, select, [contenteditable], [role='dialog']")) return;
      e.preventDefault();
      goToPanel(lastActive + (e.key === "ArrowRight" ? 1 : -1));
    };

    measure();
    cur = targetNow();
    tr.style.transform = `translate3d(${-cur}px,0,0)`;
    kick();
    if (window.location.hash) window.setTimeout(() => goToHash(window.location.hash), 600);

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerup", onUp);
    st.addEventListener("pointerdown", onDown);
    st.addEventListener("pointermove", onMove);
    // images and fonts settle after first paint and change the track's width
    const ro = new ResizeObserver(remeasure);
    ro.observe(tr);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerup", onUp);
      st.removeEventListener("pointerdown", onDown);
      st.removeEventListener("pointermove", onMove);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} data-no-reveal data-ready={ready || undefined} className="hz" aria-label="Page">
      <div ref={stage} className="hz-stage">
        <div ref={track} className="hz-track">
          {children}
        </div>
        <nav className="hz-chapters" aria-label="Sections">
          {labels.map((label, i) => (
            <button key={`${label}-${i}`} type="button" onClick={() => goTo.current(i)} className={`hz-chapter ${i === active ? "is-active" : i < active ? "is-past" : ""}`} aria-current={i === active ? "true" : undefined}>
              <span className="hz-chapter-dot" aria-hidden="true" />
              <span className="hz-chapter-label">{label}</span>
            </button>
          ))}
        </nav>
        <span className="hz-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
