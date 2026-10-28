import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import ProjectSlabs from "@/components/ProjectSlabs";
import { GALLERY } from "@/data/gallery";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { arrival, cover } from "@/lib/slabs";

describe("arrival", () => {
  it("is 0 below the screen and 1 once the slab reaches the top", () => {
    expect(arrival(800, 800)).toBe(0);
    expect(arrival(1600, 800)).toBe(0);
    expect(arrival(0, 800)).toBe(1);
    expect(arrival(-300, 800)).toBe(1);
  });

  it("grows steadily as the slab slides up", () => {
    expect(arrival(600, 800)).toBeCloseTo(0.25);
    expect(arrival(400, 800)).toBeCloseTo(0.5);
    expect(arrival(200, 800)).toBeCloseTo(0.75);
  });

  it("copes with a zero-height viewport", () => {
    expect(arrival(100, 0)).toBe(1);
  });
});

describe("cover", () => {
  it("is 0 for the last slab, which nothing covers", () => {
    expect(cover(null, 800)).toBe(0);
  });

  it("rises from 0 to 1 as the next slab slides over", () => {
    expect(cover(800, 800)).toBe(0);
    expect(cover(400, 800)).toBeCloseTo(0.5);
    expect(cover(0, 800)).toBe(1);
  });
});

describe("gallery data", () => {
  it("links every slab to a real card on the Solutions page", () => {
    const ids = INDUSTRY_SOLUTIONS.map((s) => s.id);
    for (const g of GALLERY) expect(ids).toContain(g.solution);
  });

  it("gives every photo alt text and a title", () => {
    for (const g of GALLERY) {
      expect(g.alt.length).toBeGreaterThan(3);
      expect(g.title.length).toBeGreaterThan(2);
    }
  });

  it("avoids the removed façade wording", () => {
    expect(JSON.stringify(GALLERY)).not.toMatch(/fa[cç]ade/i);
  });
});

describe("ProjectSlabs", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders one slab per photo, numbered in order, each linking to its solution", () => {
    render(<ProjectSlabs />);
    const slabs = [...document.querySelectorAll(".slab")];
    expect(slabs).toHaveLength(GALLERY.length);
    slabs.forEach((slab, i) => {
      expect(slab.querySelector(".slab-count")?.textContent?.replace(/\s/g, "")).toBe(
        `${String(i + 1).padStart(2, "0")}/${String(GALLERY.length).padStart(2, "0")}`
      );
      expect(slab.querySelector("a")).toHaveAttribute("href", `/solutions#${GALLERY[i].solution}`);
    });
  });

  it("exposes each title once to assistive technology", () => {
    render(<ProjectSlabs />);
    for (const g of GALLERY) {
      expect(screen.getByRole("heading", { level: 3, name: g.title })).toBeInTheDocument();
    }
  });

  it("writes arrival and cover values from each slab's position as the page scrolls", async () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    render(<ProjectSlabs />);
    const slabs = [...document.querySelectorAll<HTMLElement>(".slab")];
    const tops = [0, 400, 800, 1200]; // slab 0 pinned, slab 1 half-way up, the rest still below
    slabs.forEach((slab, i) =>
      vi.spyOn(slab, "getBoundingClientRect").mockReturnValue({ top: tops[i], height: 800, bottom: 0, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect)
    );
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(slabs[0].style.getPropertyValue("--sp")).toBe("1.000");
    expect(slabs[0].style.getPropertyValue("--cover")).toBe("0.500"); // slab 1 is half-way over it
    expect(slabs[1].style.getPropertyValue("--sp")).toBe("0.500");
    expect(slabs[2].style.getPropertyValue("--sp")).toBe("0.000");
    expect(slabs[3].style.getPropertyValue("--cover")).toBe("0.000"); // last slab is never covered
  });
});
