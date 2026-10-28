import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import SolutionsPage from "@/app/solutions/page";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

function modulesSection() {
  return document.getElementById("modules") as HTMLElement;
}

describe("Solutions page", () => {
  it("lists every industry solution", () => {
    render(<SolutionsPage />);
    for (const s of INDUSTRY_SOLUTIONS) {
      expect(screen.getByRole("heading", { name: s.title })).toBeInTheDocument();
    }
  });

  it("lists every module in the modules directory", () => {
    render(<SolutionsPage />);
    const headings = within(modulesSection()).getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(FEN1_MODULES.length);
  });

  it("shows only titles in a section called Modules, with no search or group filters", () => {
    render(<SolutionsPage />);
    const section = modulesSection();
    expect(within(section).getByRole("heading", { level: 2, name: "Modules" })).toBeInTheDocument();
    expect(within(section).queryByPlaceholderText("Search")).not.toBeInTheDocument();
    expect(within(section).queryAllByRole("button")).toHaveLength(0);
    expect(section.textContent).not.toContain(FEN1_MODULES[0].description.slice(0, 30));
  });

  it("keeps module and solution cards free of links to other pages", () => {
    render(<SolutionsPage />);
    const links = [...document.querySelectorAll("#modules a")];
    expect(links).toHaveLength(0);
  });
});
