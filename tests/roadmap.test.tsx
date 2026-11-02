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

  it("shows the module a stage is worked in and the record it leaves", async () => {
    const user = userEvent.setup();
    render(<Workflow />);
    await user.click(screen.getAllByRole("tab")[2]);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent(ROADMAP_STAGES[2].module);
    expect(panel).toHaveTextContent(ROADMAP_STAGES[2].record);
  });

  it("has a vertical timeline for phones, where only the chosen stage is open", async () => {
    const user = userEvent.setup();
    render(<Workflow />);
    const rows = [...document.querySelectorAll(".wf2-list > li")];
    expect(rows).toHaveLength(ROADMAP_STAGES.length);
    expect(document.querySelectorAll(".wf2-row-body")).toHaveLength(1);
    await user.click(rows[5].querySelector("button") as HTMLElement);
    expect(rows[5].querySelector(".wf2-row-body")).toHaveTextContent(ROADMAP_STAGES[5].desc);
    expect(rows[4]).toHaveClass("is-done");
    expect(rows[5]).toHaveClass("is-active");
    expect(document.querySelectorAll(".wf2-row-body")).toHaveLength(1);
  });

  it("is short: one stepper and one detail panel, not a list of every stage's text", () => {
    render(<Workflow />);
    expect(document.querySelectorAll(".wf2-panel .wf-desc")).toHaveLength(1);
    expect(screen.getByText(new RegExp(`${ROADMAP_STAGES.length} stages on one job record`))).toBeInTheDocument();
  });
});
