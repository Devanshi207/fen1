import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Workflow, { PHASES } from "@/components/Workflow";
import { ROADMAP_STAGES } from "@/data/roadmap";

describe("Workflow (compact stepper)", () => {
  it("puts every roadmap stage on one line of numbered tabs, in order", () => {
    render(<Workflow />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(ROADMAP_STAGES.length);
    expect(tabs.map((t) => t.textContent)).toEqual(ROADMAP_STAGES.map((s) => s.step));
  });

  it("starts on the first stage and shows its detail", () => {
    render(<Workflow />);
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent(ROADMAP_STAGES[0].title);
    expect(panel).toHaveTextContent(ROADMAP_STAGES[0].desc);
  });

  it("opens a stage when its number is clicked, and steps with the arrows", async () => {
    const user = userEvent.setup();
    render(<Workflow />);
    await user.click(screen.getAllByRole("tab")[7]);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(ROADMAP_STAGES[7].desc);
    await user.click(screen.getByRole("button", { name: "Next stage" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(ROADMAP_STAGES[8].title);
    await user.click(screen.getByRole("button", { name: "Previous stage" }));
    await user.click(screen.getByRole("button", { name: "Previous stage" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(ROADMAP_STAGES[6].title);
  });

  it("disables the arrows at either end and supports the keyboard", async () => {
    const user = userEvent.setup();
    render(<Workflow />);
    expect(screen.getByRole("button", { name: "Previous stage" })).toBeDisabled();
    screen.getAllByRole("tab")[0].focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Next stage" })).toBeDisabled();
    expect(screen.getByRole("tabpanel")).toHaveTextContent(ROADMAP_STAGES[ROADMAP_STAGES.length - 1].title);
  });

  it("groups the stages into phases that cover all of them exactly once", () => {
    const covered = PHASES.flatMap((p) => Array.from({ length: p.to - p.from + 1 }, (_, i) => p.from + i));
    expect(covered).toEqual(ROADMAP_STAGES.map((_, i) => i));
  });

  it("is short: one stepper and one detail panel, not a list of every stage's text", () => {
    render(<Workflow />);
    expect(document.querySelectorAll(".wf-desc")).toHaveLength(1);
    expect(screen.getByText(new RegExp(`${ROADMAP_STAGES.length} connected stages`))).toBeInTheDocument();
  });
});
