import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SolutionsPage from "@/app/solutions/page";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

const pages = () => [...document.querySelectorAll<HTMLElement>(".jp")];
const modulePages = () => pages().filter((p) => p.querySelector(".jp-mods"));
const verticalPages = () => pages().filter((p) => p.querySelector(".jp-cols"));

describe("Solutions page", () => {
  it("lists every industry solution", () => {
    render(<SolutionsPage />);
    for (const s of INDUSTRY_SOLUTIONS) {
      expect(screen.getByRole("heading", { name: s.title })).toBeInTheDocument();
    }
  });

  it("puts all the verticals on two pages and all the modules on two more, after the intro", () => {
    render(<SolutionsPage />);
    expect(pages()).toHaveLength(5);
    expect(verticalPages()).toHaveLength(2);
    expect(modulePages()).toHaveLength(2);
    expect(pages()[0].querySelector(".jp-cols, .jp-mods")).toBeNull();
    const inVerticals = verticalPages().flatMap((p) => [...p.querySelectorAll(".jp-col")].map((c) => c.id));
    expect(inVerticals).toEqual(INDUSTRY_SOLUTIONS.map((s) => s.id));
  });

  it("lists every module, in order, across the module pages", () => {
    render(<SolutionsPage />);
    const names = modulePages().flatMap((p) => [...p.querySelectorAll(".jp-mod-name")].map((n) => n.textContent));
    expect(names).toEqual(FEN1_MODULES.map((m) => m.name));
  });

  it("keeps #modules on the first module page, so links to it turn to the right page", () => {
    render(<SolutionsPage />);
    expect(document.getElementById("modules")).toBe(modulePages()[0]);
  });

  it("shows only titles for the modules, with no search or filters, and no links out", () => {
    render(<SolutionsPage />);
    for (const page of modulePages()) {
      expect(page.querySelector("input")).toBeNull();
      expect(page.querySelectorAll("button")).toHaveLength(0);
      expect(page.querySelectorAll("a")).toHaveLength(0);
      expect(page.textContent).not.toContain(FEN1_MODULES[0].description.slice(0, 30));
    }
  });

  it("ends with the last module page, with no closing call to action after it", () => {
    render(<SolutionsPage />);
    const journey = document.querySelector(".jp-section") as HTMLElement;
    // the journey is the whole page: nothing follows it
    expect(journey.nextElementSibling).toBeNull();
    expect(document.getElementById("contact-cta")).toBeNull();
    expect(screen.queryByText(/your operation\./i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /EXPLORE FEN1/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /REQUEST A DEMO/i })).not.toBeInTheDocument();
  });
});
