import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import SolutionsSection from "@/components/sections/SolutionsSection";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { SOLUTION_PHOTOS } from "@/data/gallery";

describe("Solutions photographs", () => {
  it("has a photograph for every industry, each different", () => {
    for (const s of INDUSTRY_SOLUTIONS) expect(SOLUTION_PHOTOS[s.id]?.src).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
    const srcs = INDUSTRY_SOLUTIONS.map((s) => SOLUTION_PHOTOS[s.id].src);
    expect(new Set(srcs).size).toBe(srcs.length);
    for (const s of INDUSTRY_SOLUTIONS) expect(SOLUTION_PHOTOS[s.id].alt.length).toBeGreaterThan(5);
  });

  it("stacks the photos, with only the chosen industry's on top and described", () => {
    render(<SolutionsSection />);
    const shots = [...document.querySelectorAll(".sol-shot")];
    expect(shots).toHaveLength(INDUSTRY_SOLUTIONS.length);
    expect(shots.filter((s) => s.classList.contains("is-active"))).toHaveLength(1);
    expect(shots[0]).toHaveClass("is-active");
    expect(screen.getAllByRole("img", { name: SOLUTION_PHOTOS["windows-doors"].alt })).toHaveLength(1);
  });

  it("wipes the next photo in over the last one: the old photo stays underneath, and the side alternates", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    await user.click(screen.getAllByRole("tab")[1]);
    const shots = [...document.querySelectorAll(".sol-shot")];
    expect(shots[1]).toHaveClass("is-active");
    expect(shots[0]).toHaveClass("is-prev");
    expect(shots[1].getAttribute("data-dir")).not.toBe(shots[0].getAttribute("data-dir"));
    await user.click(screen.getAllByRole("tab")[3]);
    expect([...document.querySelectorAll(".sol-shot")][1]).toHaveClass("is-prev");
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

  it("sets the careers role lines in the body font, not the technical mono face", () => {
    render(<Page />);
    const roles = document.querySelectorAll(".path-roles");
    expect(roles.length).toBeGreaterThan(0);
    roles.forEach((r) => expect(r).not.toHaveClass("tech"));
    const css = readFileSync(join("src", "app", "sections.css"), "utf8");
    expect(/\.path-roles \{[^}]*\}/.exec(css)![0]).not.toMatch(/letter-spacing|font-mono|--font-tech/);
  });

  it("has no oversized numeral in the workflow", () => {
    render(<Page />);
    expect(document.querySelector(".wf2-num")).toBeNull();
  });
});

describe("fewer clicks, fewer decorations", () => {
  it("has no Explore / Request a demo / Get in touch buttons in the hero or header", () => {
    render(<Page />);
    for (const name of [/explore the platform/i, /get in touch/i]) expect(screen.queryByRole("link", { name })).toBeNull();
    expect(document.querySelector("#intro a[href='#demo'], #intro a[href='#solutions']")).toBeNull();
  });

  it("has no decorative dash lines or corner marks in the hero", () => {
    render(<Page />);
    expect(document.querySelector(".hero-tick, .hero-dim")).toBeNull();
    const css = readFileSync(join("src", "app", "motion.css"), "utf8");
    expect(css).not.toMatch(/\.hero-eyebrow::before/);
  });

  it("keeps the workflow arrows in one place: the panel has a fixed height and no rule under the numbers", () => {
    const css = readFileSync(join("src", "app", "motion.css"), "utf8");
    const panel = /\.wf2-panel \{[^}]*\}/.exec(css)![0];
    expect(panel).toMatch(/min-height: 17rem/);
    expect(panel).not.toMatch(/border-top/);
    expect(/\.wf2-nav \{[^}]*\}/.exec(css)![0]).toMatch(/align-self: start/);
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
