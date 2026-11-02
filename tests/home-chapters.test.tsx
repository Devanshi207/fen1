import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import KineticHeading from "@/components/KineticHeading";
import StatsStrip from "@/components/StatsStrip";
import WordBand from "@/components/WordBand";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { ROADMAP_STAGES } from "@/data/roadmap";

describe("KineticHeading", () => {
  it("keeps the full text for assistive technology and hides the split lines", () => {
    render(<KineticHeading text={"THE OPERATING SYSTEM\nFOR GLASS"} />);
    const h = screen.getByRole("heading", { level: 1, name: "THE OPERATING SYSTEM FOR GLASS" });
    expect(h.querySelectorAll(".kinetic-line")).toHaveLength(2);
    h.querySelectorAll(".kinetic-line").forEach((line) => expect(line).toHaveAttribute("aria-hidden", "true"));
  });

  it("reveals whole lines through a mask, one after another, not letter by letter", () => {
    render(<KineticHeading text={"GLASS WINDOWS\nALUMINIUM"} as="h2" />);
    const inner = [...document.querySelectorAll<HTMLElement>(".kinetic-inner")];
    expect(inner.map((l) => l.textContent)).toEqual(["GLASS WINDOWS", "ALUMINIUM"]);
    expect(inner.map((l) => Number(l.style.getPropertyValue("--i")))).toEqual([0, 1]);
    expect(document.querySelector(".kinetic-char")).toBeNull();
  });
});

describe("StatsStrip", () => {
  it("derives its figures from the site's own data", () => {
    render(<StatsStrip />);
    // CountUp animates, but each figure's label and note are static; check the labels exist
    expect(screen.getByText("Connected modules")).toBeInTheDocument();
    expect(screen.getByText("Roadmap stages")).toBeInTheDocument();
    expect(screen.getByText("Industry solutions")).toBeInTheDocument();
    expect(screen.getByText("Module groups")).toBeInTheDocument();
    expect(FEN1_MODULES.length).toBeGreaterThan(0);
    expect(INDUSTRY_SOLUTIONS.length).toBe(5);
    expect(ROADMAP_STAGES.length).toBe(13);
  });
});

describe("WordBand", () => {
  it("is decorative: hidden from assistive technology", () => {
    render(<WordBand />);
    const band = document.querySelector(".wordband");
    expect(band).toHaveAttribute("aria-hidden", "true");
    expect(band?.textContent).toMatch(/Glass/);
  });
});
