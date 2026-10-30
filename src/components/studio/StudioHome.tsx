"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { GALLERY } from "@/data/gallery";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { FEN1_MODULES } from "@/data/modules";
import { readProgress } from "@/lib/studio";
import StudioLoader from "./StudioLoader";
import { Fen1Mark } from "./Fen1Reveal";
import "./studio.css";

const REDUCE = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";
const STATEMENT = "One system, from first enquiry to final handover.".split(" ");
const pad = (n: number) => String(n).padStart(3, "0");

/** A soft circle that trails the pointer and names what you are over (anything with data-cursor). Mouse only. */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = dot.current;
    if (!el || !window.matchMedia(FINE).matches || window.matchMedia(REDUCE).matches) return;
    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.classList.add("is-live");
      setLabel((e.target as Element | null)?.closest?.("[data-cursor]")?.getAttribute("data-cursor") ?? "");
    };
    const leave = () => el.classList.remove("is-live");
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return createPortal(
    <div ref={dot} className={`st-cursor ${label ? "has-label" : ""}`} aria-hidden="true">
      <span>{label}</span>
    </div>,
    document.body
  );
}

/** The photo that follows the pointer over the roadmap list. */
function Peek({ active, area }: { active: number; area: React.RefObject<HTMLOListElement | null> }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = area.current;
    const el = box.current;
    if (!host || !el || !window.matchMedia(FINE).matches) return;
    const reduce = window.matchMedia(REDUCE).matches;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const loop = () => {
      raf = 0;
      cx = reduce ? x : cx + (x - cx) * 0.16;
      cy = reduce ? y : cy + (y - cy) * 0.16;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.5) raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    host.addEventListener("pointermove", move);
    return () => {
      host.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [area]);

  return (
    <div ref={box} className={`st-peek ${active >= 0 ? "is-on" : ""}`} aria-hidden="true">
      {GALLERY.map((g, i) => (
        <span key={g.src} className={i === active % GALLERY.length ? "is-shown" : ""}>
          <Image src={g.src} alt="" fill sizes="22rem" className="object-cover" style={{ objectPosition: g.position }} />
        </span>
      ))}
    </div>
  );
}

/**
 * The home page as an editorial studio page: a very large FEN1 wordmark with a loader that fills it in, photo tiles that
 * drift at their own pace, a statement that darkens word by word as you read, the roadmap as an index with a photo that
 * follows the pointer, a scroll-driven ticker and a big closing call to talk. All text comes from the site's own data.
 */
export default function StudioHome() {
  const [phase, setPhase] = useState<"load" | "fly" | "done">("load");
  const [hover, setHover] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const statement = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const fly = useCallback(() => setPhase("fly"), []);
  const done = useCallback(() => setPhase("done"), []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia(REDUCE).matches;
    const words = Array.from(statement.current?.querySelectorAll<HTMLElement>(".st-word-i") ?? []);
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--sy", String(Math.round(window.scrollY)));
      if (percent.current) percent.current.textContent = `${String(Math.round((max > 0 ? window.scrollY / max : 0) * 100)).padStart(2, "0")}%`;
      const s = statement.current;
      if (s) {
        const r = s.getBoundingClientRect();
        // the words light up while the statement crosses the middle of the screen
        const p = readProgress(r.top + window.innerHeight * 0.3, r.height, window.innerHeight * 0.6) * 1.25 - 0.05;
        words.forEach((w, i) => {
          w.style.opacity = reduce ? "1" : String(Math.min(Math.max(p * words.length - i, 0), 1) * 0.84 + 0.16);
        });
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  // the closing button leans toward the pointer
  const lean = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--tx", `${((e.clientX - (r.left + r.width / 2)) * 0.3).toFixed(1)}px`);
    e.currentTarget.style.setProperty("--ty", `${((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px`);
  };
  const unlean = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--tx", "0px");
    e.currentTarget.style.setProperty("--ty", "0px");
  };

  const ticker = FEN1_MODULES.map((m) => m.name);

  return (
    <div ref={root} className={`st ${phase !== "load" ? "is-fly" : ""}`} data-no-reveal>
      {phase !== "done" && <StudioLoader onFly={fly} onDone={done} />}
      <Cursor />
      <p className="st-mono st-scroll" aria-hidden="true">
        (Scroll) <span ref={percent}>00%</span>
      </p>

      <section className="st-hero">
        <div className="st-meta st-mono">
          <span>FEN1 ERP</span>
          <span>Glass / Aluminium / Windows</span>
          <span>{ROADMAP_STAGES.length} stages, one system</span>
        </div>
        <h1 className="st-wordmark" aria-label="FEN1">
          <Fen1Mark className="st-mark" />
        </h1>
        <div className="st-intro">
          <p className="st-kicker">The operating system for glass, aluminium &amp; windows</p>
          <p className="st-lede">
            From estimation to installation, FEN1 connects sales, engineering, procurement, production, projects, people, finance and analytics in one unified ERP platform.
          </p>
          <div className="st-actions">
            <Link href="/solutions" className="st-btn is-solid" data-cursor="Go">
              Explore FEN1
            </Link>
            <Link href="/request-demo" className="st-btn" data-cursor="Go">
              Request a demo
            </Link>
          </div>
        </div>
        <ul className="st-shots">
          {GALLERY.map((g, i) => (
            <li key={g.src} style={{ ["--i" as string]: i }}>
              <Link href={`/solutions#${g.solution}`} className="st-shot" data-cursor="View">
                <span className="st-shot-img">
                  <Image src={g.src} alt={g.alt} fill loading="eager" sizes="(min-width: 1024px) 22vw, 46vw" className="object-cover" style={{ objectPosition: g.position }} />
                </span>
                <span className="st-mono st-shot-cap">
                  <span>{pad(i + 1)} / {g.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section ref={statement} className="st-statement" aria-label="The idea">
        <p className="st-mono">(The idea)</p>
        <h2 className="st-big">
          {STATEMENT.map((w, i) => (
            <span key={i} className="st-word-i">
              {w}{" "}
            </span>
          ))}
        </h2>
        <p className="st-lede">{ROADMAP_STAGES.length} connected stages. Each one hands clean data to the next.</p>
      </section>

      <section className="st-index" id="roadmap" aria-label="The roadmap">
        <div className="st-head st-mono">
          <span>(The roadmap)</span>
          <span>0_{ROADMAP_STAGES.length}</span>
        </div>
        <ol ref={list} onPointerLeave={() => setHover(-1)}>
          {ROADMAP_STAGES.map((s, i) => (
            <li key={s.step} className="st-row" onPointerEnter={() => setHover(i)}>
              <span className="st-mono st-row-n">{s.step}</span>
              <h3 className="st-row-t">{s.title}</h3>
              <p className="st-row-s">{s.subtitle}</p>
              <p className="st-row-d">{s.desc}</p>
            </li>
          ))}
          <Peek active={hover} area={list} />
        </ol>
      </section>

      <section className="st-ticker" aria-label="Modules">
        {[0, 1].map((row) => (
          <div key={row} className={`st-lane ${row ? "is-back" : ""}`} aria-hidden={row ? "true" : undefined}>
            <div className="st-lane-run">
              {[0, 1].map((k) => (
                <span key={k}>
                  {(row ? [...ticker].reverse() : ticker).map((n) => (
                    <b key={n}>
                      {n} <i>{">>>"}</i>
                    </b>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="st-close">
        <p className="st-mono">(Next)</p>
        <h2 className="st-close-t">
          Let&apos;s
          <br />
          talk.
        </h2>
        <div className="st-close-row">
          <p className="st-lede">See your own enquiry-to-handover flow on one screen.</p>
          <Link href="/request-demo" className="st-orb" onPointerMove={lean} onPointerLeave={unlean} data-cursor="Go">
            <span>Request a demo</span>
          </Link>
          <Link href="/request-demo?topic=question" className="st-btn" data-cursor="Go">
            Or send us a message
          </Link>
        </div>
      </section>
    </div>
  );
}
