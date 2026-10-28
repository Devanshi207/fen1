import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoadmapScene from "@/components/RoadmapScene";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { activeStage, stageScrollTarget } from "@/lib/roadmap";

describe("activeStage", () => {
  it("maps scroll progress onto the stages in order", () => {
    expect(activeStage(0, 13)).toBe(0);
    expect(activeStage(0.5, 13)).toBe(6);
    expect(activeStage(1, 13)).toBe(12);
  });

  it("clamps out-of-range progress", () => {
    expect(activeStage(-2, 13)).toBe(0);
    expect(activeStage(4, 13)).toBe(12);
  });

  it("splits the travel into equal slices", () => {
    const counts = new Array(13).fill(0);
    for (let i = 0; i < 1300; i++) counts[activeStage(i / 1300, 13)]++;
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });
});

describe("stageScrollTarget", () => {
  it("lands inside the slice that belongs to the stage", () => {
    const section = 9000;
    const viewport = 800;
    for (let i = 0; i < 13; i++) {
      const progress = stageScrollTarget(i, 13, section, viewport) / (section - viewport);
      expect(activeStage(progress, 13)).toBe(i);
    }
  });
});

describe("RoadmapScene", () => {
  afterEach(() => vi.restoreAllMocks());

  it("lists every roadmap stage in order, with the first one active", () => {
    render(<RoadmapScene />);
    const panels = [...document.querySelectorAll(".roadmap-panel")];
    expect(panels).toHaveLength(ROADMAP_STAGES.length);
    expect(panels.map((p) => p.querySelector("h3")?.getAttribute("aria-label"))).toEqual(ROADMAP_STAGES.map((s) => s.title));
    expect(panels[0]).toHaveClass("is-active");
    expect(panels[0]).toHaveAttribute("aria-current", "step");
    expect(document.querySelectorAll(".roadmap-panel.is-active")).toHaveLength(1);
  });

  it("states the stage count from the data", () => {
    render(<RoadmapScene />);
    expect(screen.getByText(new RegExp(`${ROADMAP_STAGES.length} connected stages`))).toBeInTheDocument();
  });

  it("offers one labelled dot per stage", () => {
    render(<RoadmapScene />);
    for (const s of ROADMAP_STAGES) {
      expect(screen.getByRole("button", { name: `Step ${s.step}: ${s.title}` })).toBeInTheDocument();
    }
  });

  it("switches the active stage as the page scrolls through it", async () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    const section = document.createElement("section");
    render(<RoadmapScene />);
    const el = document.getElementById("roadmap") as HTMLElement;
    expect(section).toBeTruthy();
    // 9,000px tall section, scrolled so that 60% of the travel is behind us
    const travel = 9000 - 800;
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: -travel * 0.6, height: 9000, bottom: 0, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    const expected = activeStage(0.6, ROADMAP_STAGES.length);
    const panels = [...document.querySelectorAll(".roadmap-panel")];
    expect(panels[expected]).toHaveClass("is-active");
    expect(panels[expected - 1]).toHaveClass("is-past");
    expect(panels[expected + 1]).toHaveClass("is-next");
    expect(el.style.getPropertyValue("--p")).toBe("0.6000");
  });

  it("scrolls to a stage when its dot is clicked", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    const user = userEvent.setup();
    render(<RoadmapScene />);
    await user.click(screen.getByRole("button", { name: /Step 08/ }));
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
  });
});
