"use client";

import { useEffect, useRef } from "react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { FEN1_MODULES } from "@/data/modules";
import { MODULE_ICONS } from "@/components/moduleIcons";
import { easeInOutCubic, flightAt, hopStyle, journeyOffset, NOSE_TILT, snapTarget, trailPath, turnDuration, type Spot } from "@/lib/journey";
import "./journey.css";

/** How long scrolling must pause before the page settles onto a page */
const SNAP_AFTER_MS = 160;
/** How closely the track follows the scroll position each frame (a little behind it, which smooths wheel notches) */
const FOLLOW = 0.14;
/** How long the plane takes to fly in when the page opens, and when it starts */
const ENTRY_MS = 1800;
const ENTRY_DELAY_MS = 400;
/** How the plane is turned when it rests: nose up and to the right (the artwork's nose is 33 degrees off its drawn rotation). */
const REST_ROT = -2;

/** The pages after the intro: the five verticals over two pages, the thirteen modules over two. */
const VERTICAL_PAGES = [INDUSTRY_SOLUTIONS.slice(0, 3), INDUSTRY_SOLUTIONS.slice(3)];
const MODULE_SPLIT = Math.ceil(FEN1_MODULES.length / 2);
const MODULE_PAGES = [FEN1_MODULES.slice(0, MODULE_SPLIT), FEN1_MODULES.slice(MODULE_SPLIT)];
const COUNT = 1 + VERTICAL_PAGES.length + MODULE_PAGES.length;
const range = (items: { number: string }[]) => `${items[0].number}-${items[items.length - 1].number}`;
/** The soft background tone of each page: the intro, two vertical pages, two module pages. */
const TONES = ["icy", "pale", "icy", "icy", "pale"];
/** The plane's own box is 64px; it is scaled to the size it should be, which is cheaper than resizing it every frame. */
const PLANE_BOX = 64;
/** The side-by-side layout: desktops and tablets across, and phones held sideways. The same query as the stylesheet uses. */
const WIDE_QUERY = "(min-width: 900px), (min-width: 560px) and (max-height: 520px)";

/**
 * Solutions as a journey of pages. The screen is pinned and the pages slide sideways as you scroll: an intro with a board of
 * the five verticals, the verticals over two pages, the modules over two. The track simply follows the scroll position, so a
 * fast scroll flies through the pages and nothing ever locks; when scrolling stops it settles onto a page, carrying a short push
 * on to the next page that way and a long scroll to the nearest one. An arrow key or a click on the board glides to a page.
 * A paper plane makes one journey from the bottom left of the first page to the top right of the last, in one diagonal across
 * the pages. It rests on a spot on each page and, whichever way the pages turn, flies on its own to the next spot, looping or
 * zig-zagging, with a dotted trail. It flies between the page backgrounds and the text, so it never covers anything.
 * Links to /solutions#glass, #modules and so on turn straight to the right page.
 */
export default function SolutionsJourney() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bgs = useRef<HTMLDivElement>(null);
  const goTo = useRef<(i: number, smooth?: boolean) => void>(() => {});
  const flyer = useRef<HTMLDivElement>(null);
  const flyerRot = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    const panels = Array.from(tr.querySelectorAll<HTMLElement>(":scope > .jp"));
    const bgTrack = bgs.current;
    // the parts of each page that drift sideways at their own pace while it turns, found once
    const drift = panels.map((p) => ({
      title: p.querySelector<HTMLElement>(".jp-title"),
      cols: p.querySelector<HTMLElement>(".jp-cols"),
      mods: p.querySelector<HTMLElement>(".jp-mods"),
      board: p.querySelector<HTMLElement>(".jp-board"),
    }));
    const wideQuery = window.matchMedia(WIDE_QUERY);
    let wide = wideQuery.matches;
    const plane = flyer.current;
    const planeRot = flyerRot.current;
    const trailEl = trail.current;
    const last = COUNT - 1;
    /** where the track is, in pages (0 = first page in view) */
    let pos = 0;
    let raf = 0;
    let idle = 0;
    /** the scroll position before the current scroll began, and the latest one, to tell which way and how far it went */
    let gestureStart = -1;
    let lastY = 0;
    /** an eased glide of the scroll position itself (settling, a key press, a click): `page` is the page it is heading for */
    let tween: { from: number; to: number; start: number; dur: number; page: number } | null = null;
    /** where the plane rests on each page, measured from the page's dock marker */
    let spots: Spot[] = [];
    let heading = REST_ROT;
    let prevO = 0;
    /** which way the pages last turned: 1 forward, -1 back (the plane faces the way it is actually travelling) */
    let dir = 1;
    /** 0 while the plane is still flying in from off the left of the screen, 1 once it has arrived */
    let entry = 0;
    let entryStart = 0;

    // where the section starts and how far it scrolls: measured when it changes, not every frame
    let top0 = 0;
    let travelPx = 0;
    const measure = () => {
      top0 = sec.getBoundingClientRect().top + window.scrollY;
      travelPx = Math.max(sec.offsetHeight - window.innerHeight, 0);
    };
    const scrollFor = (page: number) => top0 + (page / last) * travelPx;
    /** how far through the pages a scroll position is, in pages, in a straight line (0 to last) */
    const pagesAt = (y: number) => (travelPx > 0 ? Math.min(Math.max((y - top0) / travelPx, 0), 1) : 0) * last;
    /** where the track sits for a scroll position: the same, but resting on each page for a while before and after it */
    const offsetAt = (y: number) => journeyOffset(pagesAt(y) / last, COUNT);
    const pinned = () => window.scrollY >= top0 - 1 && window.scrollY <= top0 + travelPx + 1;
    const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });

    const measureDocks = () => {
      spots = panels.map((p) => {
        const dock = p.querySelector<HTMLElement>(".jp-dock");
        const pr = p.getBoundingClientRect();
        const r = dock?.getBoundingClientRect();
        return r
          ? { x: r.left - pr.left + r.width / 2, y: r.top - pr.top + r.height / 2, size: r.width }
          : { x: pr.width / 2, y: pr.height / 2, size: 48 };
      });
    };

    const render = (o: number) => {
      const slide = `translate3d(${((-o / COUNT) * 100).toFixed(4)}%,0,0)`;
      tr.style.transform = slide;
      if (bgTrack) bgTrack.style.transform = slide;
      // Only the pages that are (nearly) on screen need their drift updated; the rest are a screen or more away. Writing the
      // transforms straight onto four elements per page is far cheaper than changing a CSS variable the whole page inherits.
      const vw = window.innerWidth / 100;
      drift.forEach((d, i) => {
        const dist = i - o;
        if (Math.abs(dist) > 1.3) return;
        if (d.title) d.title.style.transform = `translateX(${(dist * 14 * vw).toFixed(1)}px)`;
        if (d.cols && wide) d.cols.style.transform = `translateX(${(dist * 7 * vw).toFixed(1)}px)`;
        if (d.mods) d.mods.style.transform = `translateX(${(dist * -9 * vw).toFixed(1)}px)`;
        if (d.board) d.board.style.transform = wide ? `translateY(-50%) translateX(${(dist * -9 * vw).toFixed(1)}px)` : "none";
      });
      if (!plane || !planeRot || !trailEl || spots.length < 2) return;
      // The plane's place is worked out from how far through the pages the track is, so going back retraces the same route.
      const n = Math.min(Math.max(o, 0), last);
      const at = Math.min(Math.floor(n), last - 1);
      let from = spots[at];
      let to = spots[at + 1];
      let t = n - at;
      let style = hopStyle(at);
      if (entry < 1) {
        // opening: in from below the left edge of the screen to the first spot
        from = { x: -window.innerWidth * 0.08, y: window.innerHeight * 0.98, size: spots[0].size * 0.6 };
        to = spots[0];
        t = entry;
        style = "loop";
        dir = 1;
      } else if (Math.abs(o - prevO) > 0.0004) {
        dir = o > prevO ? 1 : -1;
      }
      prevO = o;
      const f = flightAt(from, to, t, style);
      // facing: the way it is travelling (turned about when going back), easing to its resting pose at each end of a hop
      const wrap = (v: number, ref: number) => {
        let w = v;
        while (w - ref > 180) w -= 360;
        while (w - ref < -180) w += 360;
        return w;
      };
      const travel = wrap(f.angle + NOSE_TILT + (dir < 0 ? 180 : 0), heading);
      const rest = wrap(REST_ROT, heading);
      const flying = Math.min(Math.max(Math.min(t, 1 - t) / 0.1, 0), 1);
      heading += (rest + (travel - rest) * flying - heading) * 0.35;
      plane.style.transform = `translate3d(${(f.x - PLANE_BOX / 2).toFixed(1)}px,${(f.y - PLANE_BOX / 2).toFixed(1)}px,0) scale(${(f.size / PLANE_BOX).toFixed(3)})`;
      planeRot.style.transform = `rotate(${heading.toFixed(1)}deg)`;
      trailEl.setAttribute("d", t > 0.001 && t < 0.999 ? trailPath(from, to, t, style) : "");
      trailEl.style.opacity = String(Math.min(1, Math.sin(Math.PI * t) * 2) * 0.85);
    };

    // One loop. A glide (settling, a key, a click) eases the scroll position itself; the track then follows the scroll position,
    // a little behind it. Everything per frame is a transform: nothing is measured, so nothing is laid out.
    const frame = (now: number) => {
      raf = 0;
      let settled = true;
      if (entry < 1) {
        const e = (now - entryStart) / ENTRY_MS;
        entry = e <= 0 ? 0 : e >= 1 ? 1 : easeInOutCubic(e);
        if (entry < 1) settled = false;
      }
      if (tween) {
        const t = Math.min((now - tween.start) / tween.dur, 1);
        jump(tween.from + (tween.to - tween.from) * easeInOutCubic(t));
        if (t >= 1) tween = null;
        else settled = false;
      }
      const want = offsetAt(window.scrollY);
      pos += (want - pos) * FOLLOW;
      if (Math.abs(want - pos) < 0.0008) pos = want;
      if (pos !== want) settled = false;
      render(pos);
      if (!settled) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const glide = (page: number, dur: number) => {
      tween = { from: window.scrollY, to: scrollFor(page), start: performance.now(), dur, page };
      kick();
    };

    /** to page `to`: gliding, or (smooth = false) straight there */
    const turnTo = (to: number, smooth = true) => {
      const target = Math.min(Math.max(Math.round(to), 0), last);
      if (!smooth || Math.abs(target - pos) < 0.001) {
        tween = null;
        pos = target;
        jump(scrollFor(target));
        render(pos);
        return;
      }
      glide(target, turnDuration(target - pos));
    };
    goTo.current = turnTo;

    // When scrolling stops, settle on a page: a short push goes on to the next page that way, a long scroll to the nearest.
    const settle = () => {
      const from = gestureStart;
      gestureStart = -1;
      if (tween || !pinned()) return;
      const y = window.scrollY;
      // decided on the straight-line scroll distance, so even one wheel notch (a small push) turns a page
      const now = pagesAt(y);
      const target = snapTarget(from >= 0 ? pagesAt(from) : now, now, last);
      if (Math.abs(scrollFor(target) - y) > 2) glide(target, 350 + Math.min(Math.abs(target - now), 2) * 400);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (!tween) {
        if (idle === 0) gestureStart = lastY;
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          idle = 0;
          settle();
        }, SNAP_AFTER_MS);
      }
      lastY = y;
      kick();
    };
    // the reader taking over (wheel, touch, scrollbar) ends any glide at once, so a fast scroll is never held back
    const takeOver = () => {
      if (tween) {
        tween = null;
        kick();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || !pinned()) return;
      const t = e.target;
      if (t instanceof Element && t.closest("input, textarea, select, [contenteditable], [role='dialog']")) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      const at = tween ? tween.page : Math.round(pos);
      if ((down && at >= last) || (up && at <= 0)) return;
      e.preventDefault();
      turnTo(at + (down ? 1 : -1));
    };

    const toHash = (smooth: boolean) => {
      const id = window.location.hash.slice(1);
      const page = id ? document.getElementById(id)?.closest(".jp") : null;
      const i = page ? panels.indexOf(page as HTMLElement) : -1;
      if (i >= 0) turnTo(i, smooth);
    };
    const onHash = () => toHash(true);

    const onResize = () => {
      wide = wideQuery.matches;
      measure();
      measureDocks();
      kick();
    };

    // start from wherever the page is already scrolled to
    measure();
    lastY = window.scrollY;
    pos = offsetAt(lastY);
    prevO = pos;
    measureDocks();
    const landing = window.location.hash.length > 1 || pos > 0.05;
    entry = landing ? 1 : 0;
    entryStart = performance.now() + ENTRY_DELAY_MS;
    render(pos);
    if (!landing) kick();
    const first = window.setTimeout(() => toHash(false), 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("touchstart", takeOver, { passive: true });
    window.addEventListener("pointerdown", takeOver, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchstart", takeOver);
      window.removeEventListener("pointerdown", takeOver);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /** Page that holds the first vertical in `list` (the page index in the track) */
  const pageOfVertical = (id: string) => 1 + VERTICAL_PAGES.findIndex((group) => group.some((s) => s.id === id));

  return (
    // data-no-reveal: the site's scroll-reveal would otherwise tag the headings and give them a 0.4s transition on transform,
    // which makes the sideways drift lag behind the pages
    <section ref={section} data-no-reveal className="jp-section" style={{ ["--n" as string]: COUNT }} aria-label="Solutions">
      <div className="jp-stage">
        <div ref={bgs} className="jp-bgs" aria-hidden="true">
          {TONES.map((tone, i) => (
            <div key={i} className={`jp-bg jp-bg--${tone}`} />
          ))}
        </div>
        <svg className="jp-trail" aria-hidden="true">
          <path ref={trail} />
        </svg>
        <div ref={flyer} className="jp-flyer" aria-hidden="true">
          <div ref={flyerRot} className="jp-flyer-rot">
            <div className="jp-flyer-bob">
              <svg viewBox="0 0 64 64" width="88%" height="88%">
                <g transform="rotate(-33 32 32)">
                  <path d="M10 28 L63 36 L10 46 L22 36 Z" fill="rgba(11,21,48,0.16)" />
                  <path d="M6 22 L60 32 L6 42 L18 32 Z" fill="#1b4fd6" />
                  <path d="M18 32 L60 32 L6 42 Z" fill="#102f9e" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div ref={track} className="jp-track">
          <article className={`jp jp--${TONES[0]}`} aria-label="Solutions">
            <span className="jp-dock jp-dock--0" aria-hidden="true" />
            <p className="jp-kicker">Solutions</p>
            <h1 className="jp-title">Engineered for your exact operations.</h1>
            <p className="jp-sub">
              FEN1 is built for glass processing plants, aluminium window fabricators, glazing contractors and dealer networks, with every module you need in one system.
            </p>
            <ol className="jp-board" aria-label="The five verticals">
              {INDUSTRY_SOLUTIONS.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => goTo.current(pageOfVertical(s.id))}>
                    <span>{s.number}</span>
                    <span>{s.title}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </li>
              ))}
            </ol>
          </article>

          {VERTICAL_PAGES.map((group, page) => (
            <article key={group[0].id} className={`jp jp--${TONES[page + 1]}`} aria-label={`Industry verticals ${range(group)}`}>
              <span className={`jp-dock jp-dock--${page + 1}`} aria-hidden="true" />
              <div className="jp-cols" style={{ ["--cols" as string]: group.length }}>
                {group.map((s) => (
                  <section key={s.id} id={s.id} className="jp-col">
                    <span className="jp-col-num">{s.number}</span>
                    <h2 className="jp-col-title">{s.title}</h2>
                    <p className="jp-col-sub">{s.subtitle}</p>
                    <ul className="jp-col-list">
                      {s.keyBenefits.slice(0, 2).map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="jp-col-chain">{s.workflow.join(" \u2192 ")}</p>
                  </section>
                ))}
              </div>
            </article>
          ))}

          {MODULE_PAGES.map((group, page) => (
            <article key={group[0].id} id={page === 0 ? "modules" : undefined} className={`jp jp--${TONES[VERTICAL_PAGES.length + page + 1]}`} aria-label={`Modules ${range(group)}`}>
              <span className={`jp-dock jp-dock--${VERTICAL_PAGES.length + page + 1}`} aria-hidden="true" />
              <div className="jp-mod-wrap">
                <h2 className="jp-title jp-title--small">{page === 0 ? "Every module, one connected system." : "The rest of the modules."}</h2>
                <ul className="jp-mods">
                  {group.map((m) => {
                    const Icon = MODULE_ICONS[m.id];
                    return (
                      <li key={m.id} tabIndex={0}>
                        <span className="jp-mod-num">{m.number}</span>
                        {Icon && <Icon className="jp-mod-icon" />}
                        <span className="jp-mod-name">{m.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
