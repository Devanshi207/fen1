import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const read = (...p: string[]) => readFileSync(join("src", ...p), "utf8");
const globals = read("app", "globals.css");
const sections = read("app", "sections.css");
const motion = read("app", "motion.css");

describe("photographs are card-sized", () => {
  it("has no photograph in the home hero: the headline and the one button stand alone", () => {
    expect(globals + motion).not.toMatch(/\.hero-frame|\.hero-media/);
    expect(existsSync(join("src", "components", "HeroGallery.tsx"))).toBe(false);
  });

  it("keeps them 3:2 and never lets one grow with the screen: no portrait photo, no viewport-height cap, no half-page column", () => {
    expect(globals + sections).not.toMatch(/max-height: calc\(100svh - 12\.5rem\)|max-height: 70svh/);
    expect(sections).toMatch(/\.contact-grid \{ grid-template-columns: minmax\(0, var\(--photo-max\)\) minmax\(0, 1fr\)/);
  });

  it("asks for no image quality the config does not list: the default is used, so the console stays free of image warnings", () => {
    const config = readFileSync("next.config.ts", "utf8");
    const allowed = /qualities:\s*\[([^\]]*)\]/.exec(config)?.[1].split(",").map((n) => Number(n.trim())) ?? [75];
    for (const file of [["components", "Navbar.tsx"], ["components", "Footer.tsx"]]) {
      for (const m of read(...file).matchAll(/quality=\{(\d+)\}/g)) expect(allowed, `${file.join("/")} quality ${m[1]}`).toContain(Number(m[1]));
    }
  });
});
