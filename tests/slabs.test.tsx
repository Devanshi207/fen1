import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectSlabs from "@/components/ProjectSlabs";
import { GALLERY } from "@/data/gallery";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

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

describe("ProjectSlabs (industry features)", () => {
  it("renders one feature per photo, numbered in order, each linking to its solution", () => {
    render(<ProjectSlabs />);
    const features = [...document.querySelectorAll(".feat")];
    expect(features).toHaveLength(GALLERY.length);
    features.forEach((f, i) => {
      expect(f.querySelector(".feat-num")?.textContent?.replace(/\s/g, "")).toBe(`${String(i + 1).padStart(2, "0")}/${String(GALLERY.length).padStart(2, "0")}`);
      expect(f.querySelector("a")).toHaveAttribute("href", `#${GALLERY[i].solution}`);
    });
  });

  it("alternates the side the photo is revealed from", () => {
    render(<ProjectSlabs />);
    const flips = [...document.querySelectorAll(".feat")].map((f) => f.classList.contains("feat-flip"));
    expect(flips).toEqual(GALLERY.map((_, i) => i % 2 === 1));
  });

  it("exposes each title once to assistive technology", () => {
    render(<ProjectSlabs />);
    for (const g of GALLERY) expect(screen.getByRole("heading", { level: 3, name: g.title })).toBeInTheDocument();
  });

  it("marks every feature as revealed (no observer here, so nothing is left hidden) and never pins the page", () => {
    render(<ProjectSlabs />);
    document.querySelectorAll(".feat").forEach((f) => expect(f).toHaveClass("is-in"));
    expect(document.querySelector(".slab, [data-pinned]")).toBeNull();
  });
});
