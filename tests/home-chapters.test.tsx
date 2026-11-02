import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import KineticHeading from "@/components/KineticHeading";

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
