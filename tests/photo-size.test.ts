import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (...p: string[]) => readFileSync(join("src", ...p), "utf8");
const globals = read("app", "globals.css");
const sections = read("app", "sections.css");
const motion = read("app", "motion.css");
const rule = (text: string, selector: string) => new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{[^}]*\\}`).exec(text)![0];

describe("photographs are card-sized", () => {
  it("has one photo size, about 440px, that the hero and Contact photos both use", () => {
    expect(globals).toMatch(/--photo-max: 27\.5rem;/);
    expect(rule(globals, ".hero-frame")).toMatch(/max-width: var\(--photo-max\)/);
    expect(rule(sections, ".contact-photo")).toMatch(/max-width: var\(--photo-max\)/);
  });

  it("keeps them 3:2 and never lets one grow with the screen: no portrait photo, no viewport-height cap, no half-page column", () => {
    for (const sel of [[globals, ".hero-frame"], [sections, ".contact-photo"]] as const) expect(rule(sel[0], sel[1])).toMatch(/aspect-ratio: 3 \/ 2/);
    expect(globals + sections).not.toMatch(/max-height: calc\(100svh - 12\.5rem\)|max-height: 70svh/);
    expect(sections).toMatch(/\.contact-grid \{ grid-template-columns: minmax\(0, var\(--photo-max\)\) minmax\(0, 1fr\)/);
  });

  it("lets the window drawing, which has fine lettering, be a little larger than a photo", () => {
    expect(rule(motion, ".wd-stage")).toMatch(/max-width: 34rem/);
  });

  it("tells the browser the real size, so a card-sized photo is not downloaded at half-screen width", () => {
    for (const file of [["components", "HeroGallery.tsx"], ["components", "WindowDrawing.tsx"], ["components", "sections", "ContactSection.tsx"]]) {
      const text = read(...file);
      expect(text, file.join("/")).not.toMatch(/sizes="[^"]*\b\d{1,2}vw/); // 42vw, 45vw, 58vw: a share of the screen
      expect(text, file.join("/")).toMatch(/sizes="\(max-width: \d+px\) 100vw, \d+px"/);
    }
  });

  it("asks for no image quality the config does not list: the default is used, so the console stays free of image warnings", () => {
    const config = readFileSync("next.config.ts", "utf8");
    const allowed = /qualities:\s*\[([^\]]*)\]/.exec(config)?.[1].split(",").map((n) => Number(n.trim())) ?? [75];
    for (const file of [["components", "HeroGallery.tsx"], ["components", "WindowDrawing.tsx"], ["components", "sections", "ContactSection.tsx"], ["components", "sections", "SolutionsSection.tsx"], ["components", "Navbar.tsx"], ["components", "Footer.tsx"]]) {
      for (const m of read(...file).matchAll(/quality=\{(\d+)\}/g)) expect(allowed, `${file.join("/")} quality ${m[1]}`).toContain(Number(m[1]));
    }
  });
});
