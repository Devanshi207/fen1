import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import SolutionsSection from "@/components/sections/SolutionsSection";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { SOLUTION_PHOTOS } from "@/data/gallery";

describe("Solutions layout", () => {
  it("has no photograph: each industry opens as one wide, horizontal panel", () => {
    render(<SolutionsSection />);
    expect(document.querySelector(".sol-media, .sol-photo, .sol-shot, img")).toBeNull();
    const panel = screen.getByRole("tabpanel");
    expect(panel.querySelector(".sol-head")).toBeTruthy();
    expect(panel.querySelectorAll(".sol-journey-list li").length).toBeGreaterThan(2);
    const css = readFileSync(join("src", "app", "sections.css"), "utf8");
    expect(/\.sol-journey-list \{[^}]*\}/.exec(css)![0]).toMatch(/repeat\(auto-fit/);
    expect(css).toMatch(/\.sol-head \{ grid-template-columns: minmax\(0, 5fr\) minmax\(0, 7fr\)/);
    expect(/\.sol-mods/.test(css) && document.querySelector(".sol-mods .notes-4")).toBeTruthy();
  });

  it("changes the panel with the tab, and the photos stay for the menu only", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    await user.click(screen.getAllByRole("tab")[1]);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[1].title);
    for (const s of INDUSTRY_SOLUTIONS) expect(SOLUTION_PHOTOS[s.id]?.src).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
  });

  it("is the only place the industry photos appear: the home page has no second photo block", () => {
    render(<Page />);
    expect(document.querySelector(".feat, .slabs-section, #gallery")).toBeNull();
    expect(document.body.textContent).not.toMatch(/See the solution/);
  });
});

describe("numbering and type details", () => {
  it("writes numbers as plain 01, 02, never as 01 / 05", () => {
    render(<Page />);
    expect(document.body.textContent).not.toMatch(/\b\d{2}\s*\/\s*\d{2}\b/);
  });

  it("has no oversized numeral in the workflow", () => {
    render(<Page />);
    expect(document.querySelector(".wf2-num")).toBeNull();
  });
});

describe("fewer clicks, fewer decorations", () => {
  it("has no call-to-action button in the header (the hero and the final band carry them)", () => {
    render(<Page />);
    expect(screen.queryByRole("link", { name: /get in touch/i })).toBeNull();
  });

  it("has no decorative dash lines or corner marks in the hero", () => {
    render(<Page />);
    expect(document.querySelector(".hero-tick, .hero-dim")).toBeNull();
    const css = readFileSync(join("src", "app", "motion.css"), "utf8");
    expect(css).not.toMatch(/\.hero-eyebrow::before/);
  });

  it("lets you change industry from anywhere in the section: sticky tabs plus up and down arrows", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    const css = readFileSync(join("src", "app", "sections.css"), "utf8");
    expect(/\.sol-side \{[^}]*\}/.exec(css)![0]).toMatch(/position: sticky/);
    await user.click(screen.getByRole("button", { name: "Next industry" }));
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("button", { name: "Previous industry" }));
    await user.click(screen.getByRole("button", { name: "Previous industry" }));
    expect(screen.getAllByRole("tab")[INDUSTRY_SOLUTIONS.length - 1]).toHaveAttribute("aria-selected", "true");
  });
});

describe("Solutions on narrow screens", () => {
  it("lets the grid shrink to the screen, so the row of tabs scrolls instead of widening the section", () => {
    const css = readFileSync(join("src", "app", "sections.css"), "utf8");
    expect(/\.sol \{[^}]*\}/.exec(css)![0]).toMatch(/grid-template-columns: minmax\(0, 1fr\)/);
    expect(/\.sol-side \{[^}]*\}/.exec(css)![0]).toMatch(/min-width: 0/);
    expect(/\.sol-tabs \{[^}]*\}/.exec(css)![0]).toMatch(/overflow-x: auto/);
  });
});
