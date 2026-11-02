import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const css = (name: string) => readFileSync(join("src", "app", name), "utf8");

describe("FEN1 logo", () => {
  it("ships the logo, a transparent version of the supplied artwork, and the tab icon", () => {
    for (const f of [join("public", "brand", "fen1-logo.png"), join("public", "brand", "fen1-mark.png"), join("src", "app", "icon.png")]) expect(existsSync(f)).toBe(true);
    expect(existsSync(join("src", "app", "icon.svg"))).toBe(false);
    // a PNG with an alpha channel (colour type 6)
    expect(readFileSync(join("public", "brand", "fen1-logo.png")).readUInt8(25)).toBe(6);
  });

  it("is the header's brand, linking back to the top", () => {
    render(<Navbar />);
    const link = screen.getByRole("link", { name: /FEN1, back to the top/ });
    expect(link).toHaveAttribute("href", "#home");
    expect(within(link).getByRole("img", { name: "FEN1" })).toHaveAttribute("src", expect.stringContaining("fen1-logo.png"));
  });

  it("is in the footer too", () => {
    render(<Footer />);
    expect(screen.getByRole("img", { name: "FEN1" })).toHaveAttribute("src", expect.stringContaining("fen1-logo.png"));
  });
});

describe("space above a part of the page", () => {
  it("works out where a link stops from the section's own top padding, so the first line lands just under the header", () => {
    const sections = css("sections.css");
    expect(/\[data-section\] \{[^}]*\}/.exec(sections)![0]).toMatch(/--pad: clamp\([^)]*\);\s*scroll-margin-top: calc\(4\.4rem - var\(--pad\) \+ 1\.25rem\)/);
    expect(/\.page-sec \{[^}]*\}/.exec(sections)![0]).toMatch(/padding-block: var\(--pad\)/);
    expect(/\.sec-anchor \{[^}]*\}/.exec(sections)![0]).toMatch(/scroll-margin-top: calc\(4\.4rem - var\(--pad/);
    expect(sections).toMatch(/#contact \{ --pad:/);
  });

  it("keeps the home hero compact: no screen-high minimum and no stacked top padding", () => {
    render(<Page />);
    const hero = document.getElementById("intro")!;
    expect(hero.className).not.toMatch(/min-h-|pt-28|lg:pt-24/);
    expect(hero.className).toMatch(/pt-6/);
  });
});
