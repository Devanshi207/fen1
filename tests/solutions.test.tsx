import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("has a search box with a plain placeholder", () => {
    render(<SolutionsPage />);
    expect(within(modulesSection()).getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("filters modules by search text", async () => {
    const user = userEvent.setup();
    render(<SolutionsPage />);
    await user.type(within(modulesSection()).getByPlaceholderText("Search"), "estimation");
    const headings = within(modulesSection()).getAllByRole("heading", { level: 3 });
    expect(headings.length).toBeGreaterThan(0);
    expect(headings.length).toBeLessThan(FEN1_MODULES.length);
    expect(headings.some((h) => /estimation/i.test(h.textContent ?? ""))).toBe(true);
  });

  it("filters modules by group", async () => {
    const user = userEvent.setup();
    render(<SolutionsPage />);
    await user.click(within(modulesSection()).getByRole("button", { name: "ANALYTICS" }));
    const expected = FEN1_MODULES.filter((m) => m.category === "ANALYTICS").length;
    expect(within(modulesSection()).getAllByRole("heading", { level: 3 })).toHaveLength(expected);
  });

  it("keeps module and solution cards free of links to other pages", () => {
    render(<SolutionsPage />);
    const links = [...document.querySelectorAll("#modules a")];
    expect(links).toHaveLength(0);
  });
});
