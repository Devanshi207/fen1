import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import MotionProvider from "@/components/MotionProvider";
import HomeIntro, { INTRO_SEEN } from "@/components/HomeIntro";
import WindowDrawing from "@/components/WindowDrawing";
import { revealOnce, watchCentre } from "@/lib/inview";

/** A controllable IntersectionObserver: tests decide when elements "scroll into view". */
class FakeIO {
  static all: FakeIO[] = [];
  observed = new Set<Element>();
  disconnected = false;
  constructor(public cb: IntersectionObserverCallback, public init?: IntersectionObserverInit) {
    FakeIO.all.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }
  /** `where` says where a non-intersecting element sits: below the screen (the default) or already scrolled past, above it. */
  show(el: Element, isIntersecting = true, where: "below" | "above" = "below") {
    if (!this.observed.has(el)) return; // a real observer stops reporting an element once it is unobserved
    const bottom = where === "above" ? -20 : 1400;
    this.cb([{ target: el, isIntersecting, boundingClientRect: { bottom }, rootBounds: { top: 0 } } as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe("revealOnce / watchCentre", () => {
  beforeEach(() => {
    FakeIO.all = [];
    vi.stubGlobal("IntersectionObserver", FakeIO);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("calls back once per element, only when it is actually in view, then stops watching it", () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    const seen: Element[] = [];
    revealOnce([a, b], (el) => seen.push(el));
    const io = FakeIO.all[0];
    io.show(a, false);
    expect(seen).toEqual([]);
    io.show(a);
    io.show(a);
    expect(seen).toEqual([a]);
    expect(io.observed.has(a)).toBe(false);
    expect(io.observed.has(b)).toBe(true);
  });

  it("counts content the visitor has already scrolled past as seen, so it is there when they scroll back", () => {
    const skipped = document.createElement("div");
    const ahead = document.createElement("div");
    const seen: Element[] = [];
    revealOnce([skipped, ahead], (el) => seen.push(el));
    FakeIO.all[0].show(ahead, false, "below");
    FakeIO.all[0].show(skipped, false, "above");
    expect(seen).toEqual([skipped]);
  });

  it("reveals elements a fast jump left above the screen once scrolling settles", () => {
    const skipped = document.createElement("div");
    const ahead = document.createElement("div");
    vi.spyOn(skipped, "getBoundingClientRect").mockReturnValue({ bottom: -300 } as DOMRect);
    vi.spyOn(ahead, "getBoundingClientRect").mockReturnValue({ bottom: 900 } as DOMRect);
    const seen: Element[] = [];
    const stop = revealOnce([skipped, ahead], (el) => seen.push(el));
    // an observer never reported either; the scroll settling does the catching up
    vi.useFakeTimers();
    window.dispatchEvent(new Event("scrollend"));
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(200);
    vi.useRealTimers();
    expect(seen).toEqual([skipped]);
    stop();
  });

  it("disconnects its observer on cleanup", () => {
    const stop = revealOnce([document.createElement("div")], () => {});
    stop();
    expect(FakeIO.all[0].disconnected).toBe(true);
  });

  it("reports the element crossing the middle band, using a thin centre margin", () => {
    const a = document.createElement("li");
    const onChange = vi.fn();
    watchCentre([a], onChange);
    expect(FakeIO.all[0].init?.rootMargin).toBe("-45% 0px -45% 0px");
    FakeIO.all[0].show(a);
    expect(onChange).toHaveBeenCalledWith(a);
  });

  it("tells callers at once when IntersectionObserver is missing, so nothing stays hidden", () => {
    vi.unstubAllGlobals();
    const a = document.createElement("div");
    const seen: Element[] = [];
    revealOnce([a], (el) => seen.push(el));
    expect(seen).toEqual([a]);
  });
});

describe("MotionProvider performance", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reveals through an observer: no polling timer and no per-scroll handler", () => {
    FakeIO.all = [];
    vi.stubGlobal("IntersectionObserver", FakeIO);
    const addListener = vi.spyOn(window, "addEventListener");
    const interval = vi.spyOn(window, "setInterval");
    render(
      <main>
        <div id="page">
          <p>Hello</p>
        </div>
        <MotionProvider />
      </main>
    );
    // at most one passive "scrolling settled" listener, never a handler that runs on every scroll event
    const scrollListeners = addListener.mock.calls.filter((c) => c[0] === "scroll" || c[0] === "scrollend");
    expect(scrollListeners.length).toBeLessThanOrEqual(1);
    scrollListeners.forEach((c) => expect(c[2]).toEqual({ passive: true }));
    expect(interval).not.toHaveBeenCalled();
    const p = document.querySelector("p") as HTMLElement;
    expect(p).toHaveClass("reveal");
    expect(p).not.toHaveClass("in");
    act(() => FakeIO.all.find((io) => io.observed.has(p))!.show(p));
    expect(p).toHaveClass("in");
  });
});

describe("route fade", () => {
  it("is left for navigation: the first load has its own sequence, so the page is not faded twice", () => {
    render(
      <main>
        <div id="page" />
        <MotionProvider />
      </main>
    );
    expect(document.getElementById("page")).not.toHaveClass("page-in");
  });
});

describe("HomeIntro (opening splash)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    delete document.documentElement.dataset.intro;
  });
  afterEach(() => {
    vi.useRealTimers();
    delete document.documentElement.dataset.intro;
  });

  it("does nothing unless the page was marked as a first visit", () => {
    render(<HomeIntro />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("plays for about 1.3 seconds, remembers the visit, then releases the page", () => {
    document.documentElement.dataset.intro = "1";
    const cover = document.createElement("div");
    cover.id = "fen1-cover";
    document.body.appendChild(cover);
    render(<HomeIntro />);
    expect(screen.getByRole("status", { name: "Loading FEN1" })).toBeInTheDocument();
    expect(document.getElementById("fen1-cover")).toBeNull();
    expect(sessionStorage.getItem(INTRO_SEEN)).toBe("1");
    expect(document.documentElement.dataset.intro).toBe("playing");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("status")).toHaveClass("is-out");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.documentElement.dataset.intro).toBeUndefined();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("is short: the whole splash is within the 1-1.5 second brief", () => {
    const src = readFileSync(join("src", "components", "HomeIntro.tsx"), "utf8");
    const show = Number(/SHOW_MS = (\d+)/.exec(src)?.[1]);
    const fade = Number(/FADE_MS = (\d+)/.exec(src)?.[1]);
    expect(show + fade).toBeGreaterThanOrEqual(1000);
    expect(show + fade).toBeLessThanOrEqual(1500);
  });

  it("only arms on a first visit: the layout script checks the session flag", () => {
    const layout = readFileSync(join("src", "app", "layout.tsx"), "utf8");
    expect(layout).toContain('getItem("fen1-intro-seen")');
    expect(INTRO_SEEN).toBe("fen1-intro-seen");
  });
});

describe("WindowDrawing (signature animation)", () => {
  beforeEach(() => {
    FakeIO.all = [];
    vi.stubGlobal("IntersectionObserver", FakeIO);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("holds the drawing, the labels and the finished photograph, with no invented measurements", () => {
    render(<WindowDrawing />);
    const svg = screen.getByRole("img", { name: "Technical drawing of an aluminium window" });
    expect(svg.querySelectorAll(".wd-line").length).toBeGreaterThan(10);
    expect(svg.querySelectorAll(".wd-dot")).toHaveLength(6);
    const labels = [...svg.querySelectorAll("text")].map((t) => t.textContent);
    expect(labels).toEqual(expect.arrayContaining(["W", "H", "SECTION A-A", "THERMAL BREAK", "GLAZING"]));
    expect(labels.join(" ")).not.toMatch(/\d{3,}/);
    expect(document.querySelector(".wd-photo img")).toBeTruthy();
  });

  it("starts drawing only once it scrolls into view, and only once", () => {
    render(<WindowDrawing />);
    const stage = document.querySelector(".wd") as HTMLElement;
    expect(stage).not.toHaveClass("is-in");
    act(() => FakeIO.all[0].show(stage));
    expect(stage).toHaveClass("is-in");
  });
});

describe("motion stylesheet", () => {
  const css = readFileSync(join("src", "app", "motion.css"), "utf8");

  it("uses the brief's easing curve for the site", () => {
    expect(readFileSync(join("src", "app", "globals.css"), "utf8")).toContain("--ease: cubic-bezier(0.22, 1, 0.36, 1)");
  });

  it("keeps scroll reveals within 450-750ms and 15-30px of travel", () => {
    const reveal = /\.reveal \{[^}]*?opacity ([\d.]+)s[^}]*?\}/.exec(css);
    expect(reveal).toBeTruthy();
    const seconds = Number(reveal![1]);
    expect(seconds).toBeGreaterThanOrEqual(0.45);
    expect(seconds).toBeLessThanOrEqual(0.75);
    const travel = [...css.matchAll(/translate: (?:-?(\d+)px 0|0 (\d+)px)/g)].map((m) => Number(m[1] ?? m[2]));
    expect(Math.max(...travel)).toBeLessThanOrEqual(30);
  });

  it("only hides content under (scripting: enabled), and respects reduced motion", () => {
    expect(css).toContain("@media (scripting: enabled)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    // the hidden start states of the workflow, features and drawing are all inside a scripting block
    const outside = css.replace(/@media \(scripting: enabled\) \{[\s\S]*?\n\}\n/g, "");
    expect(outside).not.toMatch(/\.wf-content \{[^}]*opacity: 0/);
    expect(outside).not.toMatch(/\.feat-media \{ clip-path/);
  });

  it("animates transform, opacity and clip-path only: no width, height, top or left in a transition or keyframe", () => {
    const animated = [...css.matchAll(/@keyframes [\w-]+ \{(?:[^{}]|\{[^{}]*\})*\}/g)].map((m) => m[0]).join("\n");
    expect(animated).not.toMatch(/\b(width|height|top|left|right|bottom|margin|padding)\s*:/);
  });
});
