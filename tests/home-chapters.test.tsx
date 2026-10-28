import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KineticHeading from "@/components/KineticHeading";
import ScrollWords from "@/components/ScrollWords";
import ChapterRail from "@/components/ChapterRail";
import StatsStrip from "@/components/StatsStrip";
import WordBand from "@/components/WordBand";
import { currentChapter } from "@/lib/chapters";
import { litWords } from "@/lib/scrollwords";
import { magnetShift } from "@/lib/magnet";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { ROADMAP_STAGES } from "@/data/roadmap";

const rect = (top: number, height = 800) =>
  ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;

describe("KineticHeading", () => {
  it("keeps the full text for assistive technology and hides the split letters", () => {
    render(<KineticHeading text={"THE OPERATING SYSTEM\nFOR GLASS"} />);
    const h = screen.getByRole("heading", { level: 1, name: "THE OPERATING SYSTEM FOR GLASS" });
    expect(h.querySelectorAll(".kinetic-line")).toHaveLength(2);
    h.querySelectorAll(".kinetic-line").forEach((line) => expect(line).toHaveAttribute("aria-hidden", "true"));
  });

  it("splits into one animated span per letter, in reading order, with rising delays", () => {
    render(<KineticHeading text="GLASS WINDOWS" as="h2" />);
    const chars = [...document.querySelectorAll<HTMLElement>(".kinetic-char")];
    expect(chars.map((c) => c.textContent).join("")).toBe("GLASSWINDOWS");
    const order = chars.map((c) => Number(c.style.getPropertyValue("--i")));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(order).size).toBe(order.length);
  });
});

describe("litWords", () => {
  it("lights words in proportion to progress and clamps it", () => {
    expect(litWords(0, 8)).toBe(0);
    expect(litWords(0.5, 8)).toBe(4);
    expect(litWords(1, 8)).toBe(8);
    expect(litWords(-1, 8)).toBe(0);
    expect(litWords(9, 8)).toBe(8);
    expect(litWords(0.5, 0)).toBe(0);
  });
});

describe("ScrollWords", () => {
  afterEach(() => vi.restoreAllMocks());

  it("keeps every word in the page and starts with none lit when the block is below the screen", () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(2000, 200));
    render(<ScrollWords text={"YOUR OPERATION.\nONE CONNECTED SYSTEM."} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent?.replace(/\s+/g, " ").trim()).toBe("YOUR OPERATION. ONE CONNECTED SYSTEM.");
    expect(document.querySelectorAll(".scrollword")).toHaveLength(5);
    expect(document.querySelectorAll(".scrollword.is-lit")).toHaveLength(0);
  });

  it("lights every word once the block has scrolled up the screen", async () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(-300, 200));
    render(<ScrollWords text="ONE TWO THREE" />);
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(document.querySelectorAll(".scrollword.is-lit")).toHaveLength(3);
  });
});

describe("currentChapter", () => {
  const rects = [
    { top: 0, bottom: 800 },
    { top: 800, bottom: 1600 },
    { top: 1600, bottom: 2400 },
  ];

  it("picks the chapter that holds the middle of the screen", () => {
    expect(currentChapter(rects, 400)).toBe(0);
    expect(currentChapter(rects.map((r) => ({ top: r.top - 900, bottom: r.bottom - 900 })), 400)).toBe(1);
  });

  it("falls back to the nearest chapter above when the middle is in a gap, and to the first before any", () => {
    const gap = [{ top: 100, bottom: 300 }, { top: 900, bottom: 1200 }];
    expect(currentChapter(gap, 500)).toBe(0);
    expect(currentChapter([{ top: 600, bottom: 900 }], 400)).toBe(0);
    expect(currentChapter([], 400)).toBe(0);
  });
});

describe("ChapterRail", () => {
  afterEach(() => vi.restoreAllMocks());

  it("builds one dot per chapter found in the page and jumps to a chapter on click", async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
    render(
      <>
        <section id="one" data-chapter="Intro" />
        <section id="two" data-chapter="Roadmap" />
        <section id="three" data-chapter="Contact" />
        <section data-chapter="No id, so ignored" />
        <ChapterRail />
      </>
    );
    const nav = await screen.findByRole("navigation", { name: "Page chapters" });
    const links = [...nav.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("aria-label"))).toEqual(["Intro", "Roadmap", "Contact"]);
    await userEvent.setup().click(links[1]);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("renders nothing when the page has fewer than two chapters", async () => {
    render(
      <>
        <section id="only" data-chapter="Only" />
        <ChapterRail />
      </>
    );
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Page chapters" })).not.toBeInTheDocument());
  });
});

describe("StatsStrip", () => {
  it("derives its figures from the site's own data", () => {
    render(<StatsStrip />);
    // CountUp animates, but each figure's label and note are static; check the labels exist
    expect(screen.getByText("Connected modules")).toBeInTheDocument();
    expect(screen.getByText("Roadmap stages")).toBeInTheDocument();
    expect(screen.getByText("Industry solutions")).toBeInTheDocument();
    expect(screen.getByText("Module groups")).toBeInTheDocument();
    expect(FEN1_MODULES.length).toBeGreaterThan(0);
    expect(INDUSTRY_SOLUTIONS.length).toBe(5);
    expect(ROADMAP_STAGES.length).toBe(13);
  });
});

describe("WordBand", () => {
  it("is decorative: hidden from assistive technology", () => {
    render(<WordBand />);
    const band = document.querySelector(".wordband");
    expect(band).toHaveAttribute("aria-hidden", "true");
    expect(band?.textContent).toMatch(/Glass/);
  });
});

describe("magnetShift", () => {
  const box = { left: 100, top: 100, width: 200, height: 50 };

  it("does not move the element when the pointer is at its centre", () => {
    expect(magnetShift({ x: 200, y: 125 }, box)).toEqual({ x: 0, y: 0 });
  });

  it("leans toward the pointer and never further than the strength allows", () => {
    const right = magnetShift({ x: 300, y: 125 }, box);
    expect(right.x).toBeGreaterThan(0);
    expect(right.x).toBeLessThanOrEqual(14 / 2 + 0.001);
    expect(magnetShift({ x: 100, y: 125 }, box).x).toBeLessThan(0);
    expect(magnetShift({ x: 200, y: 150 }, box).y).toBeGreaterThan(0);
  });

  it("ignores an element with no size", () => {
    expect(magnetShift({ x: 5, y: 5 }, { left: 0, top: 0, width: 0, height: 0 })).toEqual({ x: 0, y: 0 });
  });
});
